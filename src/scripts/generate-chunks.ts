// scripts/generate-chunks.ts
import * as path from 'path'

// Supabase client setup
import { createClient } from '@supabase/supabase-js'

// Embedding model setup - Using OpenAI
import { OpenAIEmbeddings } from '@langchain/openai' // <-- Use this for OpenAI

// Load environment variables
import * as dotenv from 'dotenv'
import type { Database } from '../database.types'
import { readAndChunkMarkdocDocs } from '../lib/docs-chunking/markdoc-parser.ts'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

// Initialize Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    'Supabase URL and Service Role Key must be provided in environment variables.',
  )
}
const supabase = createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false },
})

// Initialize Embedding Model for OpenAI
let embeddings: OpenAIEmbeddings

// --- Using OpenAI Embeddings ---
// Make sure to set process.env.OPENAI_API_KEY in your .env file
if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY must be set in environment variables.')
}
embeddings = new OpenAIEmbeddings({
  modelName: 'text-embedding-ada-002', // This model outputs 1536-dimensional vectors
  openAIApiKey: process.env.OPENAI_API_KEY,
})

async function generateAndSaveChunksToSupabase() {
  // Adjust this path to where your documentation Markdoc files are located within your project.
  const docsPath = path.resolve('./src/app')
  const baseUrl = 'https://docs.onboardjs.com'

  console.log(`Starting documentation chunking from: ${docsPath}`)
  const chunks = await readAndChunkMarkdocDocs(docsPath, baseUrl)
  console.log(`Successfully generated ${chunks.length} chunks.`)

  console.log(
    'Generating embeddings with OpenAI and inserting into Supabase...',
  )

  for (const chunk of chunks) {
    try {
      // Generate embedding for the chunk content using OpenAI
      const embeddingArray = await embeddings.embedQuery(chunk.content)

      // Prepare data for upsertion
      const {
        id,
        content,
        source_url,
        document_title,
        section_heading,
        section_hash,
      } = chunk

      const { error } = await supabase.from('documentation_chunks').upsert(
        {
          id: id,
          content: content,
          embedding: embeddingArray as any, // Store the generated vector
          source_url: source_url,
          document_title: document_title,
          section_heading: section_heading,
          section_hash: section_hash,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }, // If a chunk with this ID already exists, update it.
      )

      if (error) {
        console.error(`Error upserting chunk ${chunk.id}:`, error)
      } else {
        // console.log(`Chunk ${chunk.id} upserted successfully.`); // Too verbose for many chunks
      }
    } catch (embeddingError) {
      console.error(
        `Error generating embedding for chunk ${chunk.id}:`,
        embeddingError,
      )
    }
  }

  console.log('Finished processing all chunks and inserting into Supabase.')
}

generateAndSaveChunksToSupabase().catch(console.error)
