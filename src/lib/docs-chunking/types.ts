/**
 * Represents a single chunk of documentation content,
 * suitable for embedding and retrieval in a RAG system.
 */
export interface DocumentChunk {
  id: string // A unique identifier for this specific chunk (e.g., file-path-chunk-index)
  content: string // The textual content of the chunk that will be embedded.
  source_url: string // The absolute URL to the documentation page, including the section hash if applicable.
  document_title: string // The main title of the documentation page (from its frontmatter).
  section_heading?: string // The heading (e.g., H2) under which this chunk falls. Undefined for initial page content.
  section_hash?: string // The URL anchor hash for the `section_heading`. Undefined for initial page content.
}
