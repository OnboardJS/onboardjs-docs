import { nodes as defaultNodes, Tag } from '@markdoc/markdoc'
import { slugifyWithCounter } from '@sindresorhus/slugify'
import yaml from 'js-yaml'

import { DocsLayout } from '@/components/docs-layout'
import { Fence } from '@/components/fence'

let documentSlugifyMap = new Map()

// Helper function to reconstruct markdown from Markdoc AST
function astToMarkdown(node, depth = 0) {
  if (!node) return ''

  if (typeof node === 'string') return node

  if (Array.isArray(node)) {
    return node.map((n) => astToMarkdown(n, depth)).join('')
  }

  let result = ''

  switch (node.type) {
    case 'heading':
      const level = node.attributes?.level || 1
      const headingText = astToMarkdown(node.children, depth + 1)
      result = '#'.repeat(level) + ' ' + headingText + '\n\n'
      break

    case 'paragraph':
      result = astToMarkdown(node.children, depth + 1) + '\n\n'
      break

    case 'text':
      result = node.attributes?.content || ''
      break

    case 'fence':
      const lang = node.attributes?.language || ''
      const code = node.attributes?.content || ''
      result = '```' + lang + '\n' + code + '\n```\n\n'
      break

    case 'list':
      const ordered = node.attributes?.ordered
      node.children.forEach((item, idx) => {
        const prefix = ordered ? `${idx + 1}. ` : '- '
        result += prefix + astToMarkdown(item.children, depth + 1).trim() + '\n'
      })
      result += '\n'
      break

    case 'item':
      result = astToMarkdown(node.children, depth + 1)
      break

    case 'strong':
      result = '**' + astToMarkdown(node.children, depth + 1) + '**'
      break

    case 'em':
      result = '*' + astToMarkdown(node.children, depth + 1) + '*'
      break

    case 'code':
      // Inline code - check for content in attributes or children
      const codeContent =
        node.attributes?.content || astToMarkdown(node.children, depth + 1)
      result = '`' + codeContent + '`'
      break

    case 'link':
      const linkText = astToMarkdown(node.children, depth + 1)
      const href = node.attributes?.href || ''
      result = `[${linkText}](${href})`
      break

    case 'image':
      const alt = node.attributes?.alt || ''
      const src = node.attributes?.src || ''
      result = `![${alt}](${src})\n\n`
      break

    case 'blockquote':
      const quoteText = astToMarkdown(node.children, depth + 1)
      result =
        quoteText
          .split('\n')
          .map((line) => '> ' + line)
          .join('\n') + '\n\n'
      break

    case 'hr':
      result = '---\n\n'
      break

    case 'table':
      // Basic table reconstruction
      if (node.children && node.children.length > 0) {
        node.children.forEach((row, rowIdx) => {
          if (row.children) {
            result += '|'
            row.children.forEach((cell) => {
              result +=
                ' ' + astToMarkdown(cell.children, depth + 1).trim() + ' |'
            })
            result += '\n'

            // Add separator after header row
            if (rowIdx === 0) {
              result += '|'
              row.children.forEach(() => {
                result += ' --- |'
              })
              result += '\n'
            }
          }
        })
        result += '\n'
      }
      break

    case 'tag':
      // Handle custom Markdoc tags (like callout, quick-links, etc.)
      const tagName = node.tag
      const attrs = node.attributes || {}
      const children = node.children

      // Special handling for inline code tags
      if (tagName === 'code') {
        const codeContent =
          node.attributes?.content || astToMarkdown(children, depth + 1)
        result = '`' + codeContent + '`'
        break
      }

      if (children && children.length > 0) {
        result += `{% ${tagName}`
        // Add attributes
        Object.entries(attrs).forEach(([key, value]) => {
          if (typeof value === 'string') {
            result += ` ${key}="${value}"`
          } else {
            result += ` ${key}=${JSON.stringify(value)}`
          }
        })
        result += ' %}\n'
        result += astToMarkdown(children, depth + 1)
        result += `{% /${tagName} %}\n\n`
      } else {
        // Self-closing tag
        result += `{% ${tagName}`
        Object.entries(attrs).forEach(([key, value]) => {
          if (typeof value === 'string') {
            result += ` ${key}="${value}"`
          } else {
            result += ` ${key}=${JSON.stringify(value)}`
          }
        })
        result += ' /%}\n\n'
      }
      break

    default:
      // For unknown types, just recurse through children
      if (depth === 0) {
        console.log(
          'Unknown node type:',
          node.type,
          'attributes:',
          node.attributes,
          'children:',
          node.children,
        )
      }
      if (node.children) {
        result = astToMarkdown(node.children, depth + 1)
      }
  }

  return result
}

const nodes = {
  document: {
    ...defaultNodes.document,
    render: DocsLayout,
    transform(node, config) {
      documentSlugifyMap.set(config, slugifyWithCounter())

      // Reconstruct markdown from AST (excluding frontmatter)
      const markdownContent = astToMarkdown(node.children).trim()

      return new Tag(
        this.render,
        {
          frontmatter: yaml.load(node.attributes.frontmatter),
          nodes: node.children,
          markdownContent: markdownContent,
        },
        node.transformChildren(config),
      )
    },
  },
  heading: {
    ...defaultNodes.heading,
    transform(node, config) {
      let slugify = documentSlugifyMap.get(config)
      let attributes = node.transformAttributes(config)
      let children = node.transformChildren(config)
      let text = children.filter((child) => typeof child === 'string').join(' ')
      let id = attributes.id ?? slugify(text)

      return new Tag(
        `h${node.attributes.level}`,
        { ...attributes, id },
        children,
      )
    },
  },
  th: {
    ...defaultNodes.th,
    attributes: {
      ...defaultNodes.th.attributes,
      scope: {
        type: String,
        default: 'col',
      },
    },
  },
  fence: {
    render: Fence,
    attributes: {
      language: {
        type: String,
      },
    },
  },
}

export default nodes
