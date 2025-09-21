// markdoc-parser.ts

import Markdoc, { type Node } from '@markdoc/markdoc'
import { slugifyWithCounter } from '@sindresorhus/slugify'
import glob from 'fast-glob'
import * as fs from 'fs'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import * as path from 'path'
import type { DocumentChunk } from './types' // Assuming types.ts is in the same directory

/**
 * Converts a Markdoc Node or an array of Nodes into a plain text string.
 * This function aims to extract all relevant text content from the AST.
 */
function toString(node: Node | string | Node[]): string {
  if (typeof node === 'string') {
    return node
  }
  if (Array.isArray(node)) {
    return node.map((child) => toString(child)).join('')
  }

  let str = ''
  switch (node.type) {
    case 'text':
      str += node.attributes?.content || ''
      break
    case 'tag':
      switch (node.tag) {
        case 'code': // Inline code `foo`
          str += `\`${toString(node.children)}\``
          break
        case 'link': // Links [text](url) - just extract the text
          str += toString(node.children)
          break
        case 'image': // Images ![alt text](url) - use alt text
          str += node.attributes?.alt || ''
          break
        case 'strong':
        case 'em':
        case 'kbd':
          str += toString(node.children) // Recurse for styled text
          break
        default:
          str += toString(node.children) // For other general tags, just recurse children
      }
      break
    case 'heading': // Headings are processed for their text content when part of buffer
    case 'paragraph':
    case 'item': // List items
    case 'blockquote':
      str += toString(node.children)
      break
    case 'list': // Lists, prefix with bullets
      str += node.children.map((child) => `- ${toString(child)}`).join('\n')
      break
    case 'fence': // Code blocks, retain formatting
      str += `\`\`\`${node.attributes?.lang || ''}\n${node.attributes?.content || ''}\n\`\`\``
      break
    case 'table': // Basic table content extraction: join cells, then rows
      str += node.children
        .map((row) =>
          row.children.map((cell) => toString(cell.children)).join(' | '),
        )
        .join('\n')
      break
    case 'comment': // Ignore comments
      break
    // For other node types like 'block', 'document', simply recurse through children
    default:
      if ('children' in node && node.children) {
        str += toString(node.children)
      }
      break
  }
  return str
}

/**
 * Extracts DocumentChunks from a single Markdoc AST.
 * It intelligently splits content by headings (H1/H2) and then
 * further splits large blocks using a text splitter.
 */
async function extractChunksFromAst(
  ast: Node,
  documentTitle: string,
  sourceBaseUrl: string, // Base URL for the document (e.g., https://docs.onboardjs.com/installation)
  basePathForId: string, // A unique string derived from file path for chunk IDs (e.g., "installation")
): Promise<DocumentChunk[]> {
  const chunks: DocumentChunk[] = []
  let currentSectionHeading: string | undefined = undefined
  let currentSectionHash: string | undefined = undefined
  let currentSectionContentBuffer: string[] = []
  let currentChunkIdCounter = 0 // Ensures unique IDs within a document

  // Create a new slugify instance for each document to reset counters
  const documentSlugify = slugifyWithCounter()

  // Initialize the text splitter for fine-grained chunking
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000, // Roughly 250-300 words. Adjust based on LLM context window and desired granularity.
    chunkOverlap: 200, // Provides context across chunk boundaries, important for RAG.
  })

  /**
   * Processes the content currently accumulated in `currentSectionContentBuffer`.
   * Splits it into smaller chunks if necessary and adds them to the `chunks` array.
   */
  const processBufferedContent = async () => {
    if (currentSectionContentBuffer.length === 0) {
      return
    }

    const fullContent = currentSectionContentBuffer.join('\n\n').trim()
    currentSectionContentBuffer = [] // Reset buffer immediately after joining

    if (!fullContent) {
      return
    }

    // Split the accumulated content into smaller, overlapping chunks
    const splitContents = await textSplitter.splitText(fullContent)

    for (const chunkText of splitContents) {
      chunks.push({
        id: `${basePathForId}-${currentChunkIdCounter++}`, // Unique ID for each chunk
        content: chunkText,
        source_url:
          sourceBaseUrl + (currentSectionHash ? `#${currentSectionHash}` : ''),
        document_title: documentTitle,
        section_heading: currentSectionHeading,
        section_hash: currentSectionHash,
      })
    }
  }

  // Initialize the first section to be the document's introduction
  // Any content before the first H2 will be associated with the document title itself.
  currentSectionHeading = documentTitle
  currentSectionHash = undefined

  /**
   * Recursively traverses the Markdoc AST to identify headings and content.
   * When a new H1/H2 is encountered, it triggers the processing of previous content.
   */
  function traverse(node: Node) {
    if (node.type === 'heading') {
      // Before processing a new heading, chunk any buffered content from the previous section
      processBufferedContent()

      const headingText = toString(node).trim()
      if (node.attributes.level <= 2) {
        // H1 or H2 indicate a new main section
        currentSectionHash = node.attributes?.id ?? documentSlugify(headingText)
        currentSectionHeading = headingText
      } else {
        // H3 and deeper headings are considered part of the current main section's content
        currentSectionContentBuffer.push(`### ${headingText}`) // Include them as text
      }
    } else if (
      node.type === 'paragraph' ||
      node.type === 'fence' || // Code blocks
      node.type === 'list' ||
      node.type === 'table' ||
      node.type === 'blockquote'
    ) {
      // Extract text content from these nodes and add to the buffer
      const content = toString(node).trim()
      if (content) {
        currentSectionContentBuffer.push(content)
      }
    }
    // For other node types, simply recurse through their children to find content
    if (node.children) {
      for (const child of node.children) {
        traverse(child)
      }
    }
  }

  // Start the traversal from the root of the AST
  traverse(ast)

  // After the entire AST has been traversed, process any remaining buffered content
  await processBufferedContent()

  return chunks
}

/**
 * Reads all Markdoc files from a specified directory, parses them,
 * and returns a flattened array of DocumentChunk objects.
 *
 * @param pagesDir The root directory where your Markdoc documentation files are located (e.g., './src/app').
 * @param baseUrl The base URL for your documentation website (e.g., 'https://docs.onboardjs.com').
 * @returns A Promise that resolves to an array of DocumentChunk objects.
 */
export async function readAndChunkMarkdocDocs(
  pagesDir: string,
  baseUrl: string = 'https://docs.onboardjs.com',
): Promise<DocumentChunk[]> {
  const allChunks: DocumentChunk[] = []
  // Use fast-glob to find all .md files recursively
  const files = glob.sync('**/*.md', { cwd: pagesDir })

  for (const file of files) {
    const filePath = path.join(pagesDir, file)
    const mdContent = fs.readFileSync(filePath, 'utf8')

    const ast = Markdoc.parse(mdContent)

    // Extract document title from Markdoc frontmatter
    let documentTitle: string = 'Untitled Document'
    if (ast.attributes?.frontmatter) {
      const titleMatch =
        ast.attributes.frontmatter.match(/^title:\s*(.*?)\s*$/m)
      if (titleMatch && titleMatch[1]) {
        documentTitle = titleMatch[1]
      }
    }

    // Determine the relative URL path for the document.
    // Handles /page.md and other .md files.
    let relativeUrlPath = file.replace(/\.md$/, '')
    if (relativeUrlPath.endsWith('/page')) {
      relativeUrlPath = relativeUrlPath.slice(0, -5) // Remove '/page'
    }
    if (!relativeUrlPath.startsWith('/') && relativeUrlPath !== '') {
      relativeUrlPath = `/${relativeUrlPath}`
    }
    // Ensure root path is correctly represented as an empty string for joining
    if (relativeUrlPath === '/') {
      relativeUrlPath = ''
    }

    // Construct the full base URL for the document
    const sourceBaseUrl = `${baseUrl}${relativeUrlPath}`

    // Create a unique base ID for chunks from this file
    const basePathForId = file.replace(/\.md$/, '').replace(/[\/\.]/g, '-')

    const fileChunks = await extractChunksFromAst(
      ast,
      documentTitle,
      sourceBaseUrl,
      basePathForId,
    )
    allChunks.push(...fileChunks)
  }

  return allChunks
}

// Example usage (for local testing, you might run this with `ts-node` or compile and run):
// async function main() {
//   // Adjust this path to where your documentation Markdoc files are located within your project.
//   // For example, if your docs are in `src/app/docs`, you'd use `path.resolve('./src/app/docs')`
//   const docsPath = path.resolve('./src/app');
//   const chunks = await readAndChunkMarkdocDocs(docsPath, 'https://docs.onboardjs.com');
//   console.log(`Generated ${chunks.length} chunks from documentation.`);
//   console.log('First 3 chunks:', JSON.stringify(chunks.slice(0, 3), null, 2));
// }

// If running as a script:
// main().catch(console.error);
