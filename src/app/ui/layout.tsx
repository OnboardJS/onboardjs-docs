import type { PropsWithChildren } from 'react'

export default function ExamplesLayout({ children }: PropsWithChildren) {
  return (
    <main className="max-w-2xl min-w-0 flex-auto flex-col px-4 py-16 lg:max-w-none lg:pr-0 lg:pl-8 xl:px-16">
      {children}
    </main>
  )
}
