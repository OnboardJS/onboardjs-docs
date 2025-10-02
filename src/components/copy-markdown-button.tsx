'use client'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

interface CopyMarkdownButtonProps {
  markdownContent: string
}

export function CopyMarkdownButton({
  markdownContent,
}: CopyMarkdownButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdownContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleCopy}
            className="shadcn transition-all hover:shadow-xl"
            variant={'outline'}
            aria-label={
              copied ? 'Copied to clipboard' : 'Copy markdown for LLM'
            }
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
            ) : (
              <Copy className="h-4 w-4" />
            )}{' '}
            copy for llm
          </Button>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className="bg-slate-200 dark:bg-slate-800"
        >
          <p>{copied ? 'Copied!' : 'Copy for LLM'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
