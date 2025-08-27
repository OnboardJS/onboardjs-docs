import { ExternalLinkIcon } from 'lucide-react'
import { Link } from '../link'
import { Badge } from '../ui/badge'

type DependencyProps = {
  name: string
  href: string
}

export function DependencyComponent({ name, href }: DependencyProps) {
  return (
    <Badge asChild className="shadcn" variant="outline">
      <Link href={href} target="_blank">
        {name} <ExternalLinkIcon className="inline size-3 ml-1" />
      </Link>
    </Badge>
  )
}
