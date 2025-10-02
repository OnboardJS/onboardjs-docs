import { type Node } from '@markdoc/markdoc'

import { CopyMarkdownButton } from '@/components/copy-markdown-button'
import { DocsHeader } from '@/components/docs-header'
import { PrevNextLinks } from '@/components/prev-next-links'
import { Prose } from '@/components/prose'
import { TableOfContents } from '@/components/table-of-contents'
import { collectSections } from '@/lib/sections'

export function DocsLayout({
  children,
  frontmatter: { title },
  nodes,
  markdownContent,
}: {
  children: React.ReactNode
  frontmatter: { title?: string }
  nodes: Array<Node>
  markdownContent?: string
}) {
  let tableOfContents = collectSections(nodes)

  return (
    <>
      <div className="min-w-0 max-w-2xl flex-auto px-4 py-16 lg:max-w-none lg:pl-8 lg:pr-0 xl:px-16">
        <article>
          {markdownContent && (
            <div className="flex w-full items-center justify-end">
              <CopyMarkdownButton markdownContent={markdownContent} />
            </div>
          )}
          <DocsHeader title={title} />
          <Prose>{children}</Prose>
        </article>
        <PrevNextLinks />
      </div>
      <TableOfContents tableOfContents={tableOfContents} />
    </>
  )
}
