import { DependencyComponent } from './dependency'

type ShadcnDependency = 'progress' | 'badge' | 'button' | 'card' | 'label' | 'input'

type DepsProps = {
  dependencies: ShadcnDependency[]
}

const shadcnDeps: Record<ShadcnDependency, { name: string; href: string }> = {
  progress: {
    name: '@shadcn/progress',
    href: 'https://ui.shadcn.com/docs/components/progress',
  },
  badge: {
    name: '@shadcn/badge',
    href: 'https://ui.shadcn.com/docs/components/badge',
  },
  button: {
    name: '@shadcn/button',
    href: 'https://ui.shadcn.com/docs/components/button',
  },
  card: {
    name: '@shadcn/card',
    href: 'https://ui.shadcn.com/docs/components/card',
  },
  label: {
    name: '@shadcn/label',
    href: 'https://ui.shadcn.com/docs/components/label',
  },
  input: {
    name: '@shadcn/input',
    href: 'https://ui.shadcn.com/docs/components/input',
  },
}

export function Deps({ dependencies }: DepsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {dependencies.map((dep) => (
        <DependencyComponent key={dep} {...shadcnDeps[dep]} />
      ))}
    </div>
  )
}
