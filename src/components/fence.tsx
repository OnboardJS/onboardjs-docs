'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/utils/utils'
import { randomWords } from '@/utils/words'
import clsx from 'clsx'
import { CheckIcon, CopyIcon } from 'lucide-react'
import posthog from 'posthog-js'
import { Highlight } from 'prism-react-renderer'
import { Fragment, useEffect, useMemo, useState } from 'react'

export function Fence({
  children = '',
  language = 'typescript',
  className: componentClassName,
  bodyClassName,
  showLineNumbers = true,
  plain = false,
}: {
  children?: string
  language?: string
  className?: string
  bodyClassName?: string
  showLineNumbers?: boolean
  plain?: boolean
}) {
  const [isCopied, setIsCopied] = useState(false)
  const code = children?.trimEnd() || ''

  const [fullHash, setFullHash] = useState<string | null>(null)

  useEffect(() => {
    const generateHash = async () => {
      if (!code) {
        setFullHash(null)
        return
      }
      try {
        const textEncoder = new TextEncoder()
        const data = textEncoder.encode(code)
        const hashBuffer = await crypto.subtle.digest('SHA-256', data)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const hexHash = hashArray
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('')
        setFullHash(hexHash)
      } catch (error) {
        console.error('Failed to generate hash:', error)
        setFullHash(null)
      }
    }
    generateHash()
  }, [code])

  const humanReadableId = useMemo(() => {
    if (!fullHash) return 'generating-id'

    const numWords = 3
    const wordListSize = randomWords.length
    if (wordListSize === 0) {
      console.warn('Word list is empty. Cannot generate human-readable ID.')
      return `no-wordlist-${fullHash.substring(0, 8)}`
    }

    const words: string[] = []
    const hashBytes = Array.from(
      new Uint8Array(
        (fullHash.match(/.{1,2}/g) || []).map((byte) => parseInt(byte, 16)),
      ),
    ) // Convert hex string to byte array

    // To ensure determinism and spread entropy, we'll slice the hash
    // and use different parts for different words.
    // SHA-256 produces 32 bytes (256 bits).

    for (let i = 0; i < numWords; i++) {
      // Pick a different starting point in the hash for each word
      // to avoid using the same bits if the hash is short or has patterns.
      const startIndex =
        (i * Math.floor(hashBytes.length / numWords)) % hashBytes.length

      // Take a few bytes to form a larger number
      // This helps in generating a more diverse index within a larger word list.
      let value = 0
      for (let j = 0; j < Math.min(4, hashBytes.length - startIndex); j++) {
        value = (value << 8) | hashBytes[startIndex + j]
      }

      // Use modulo to get an index within the word list size
      const wordIndex = Math.abs(value) % wordListSize // Math.abs is defensive, hash bytes are positive
      words.push(randomWords[wordIndex])
    }

    return words.join('-')
  }, [fullHash])

  return (
    <Highlight
      code={code}
      language={language}
      theme={{ plain: {}, styles: [] }}
    >
      {({ className, style, tokens, getTokenProps }) => {
        return (
          <div
            data-human-readable-id={humanReadableId}
            className={clsx(
              className,
              !plain && 'overflow-x-auto rounded-md bg-[#362d3d]',
              componentClassName,
            )}
          >
            <div
              className={clsx(
                'flex w-full items-center justify-between font-mono',
                plain ? 'p-0' : 'p-2 px-4',
              )}
            >
              <span className="text-md text-gray-300">{language}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">
                  {tokens.length} lines
                </span>

                <Button
                  variant="ghost"
                  className="text-xs text-white dark:text-white"
                  onClick={() => {
                    posthog.capture('copy_code_snippet', {
                      humanReadableId,
                      language,
                    })
                    navigator.clipboard.writeText(code)
                    setIsCopied(true)
                    setTimeout(() => setIsCopied(false), 2000)
                  }}
                >
                  {isCopied ? (
                    <CheckIcon className="size-4 text-green-500" />
                  ) : (
                    <CopyIcon className="size-4" />
                  )}
                </Button>
              </div>
            </div>

            <pre
              style={{ ...style, margin: 0 }}
              className={cn(bodyClassName, 'rounded-md! rounded-t-none!')}
            >
              <code className="text-wrap">
                {tokens.map((line, lineIndex) => (
                  <Fragment key={lineIndex}>
                    {showLineNumbers && (
                      <span className="mr-4 w-8 flex-shrink-0 select-none text-right text-gray-400">
                        {lineIndex + 1}
                      </span>
                    )}
                    {line
                      .filter((token) => !token.empty)
                      .map((token, tokenIndex) => (
                        <span key={tokenIndex} {...getTokenProps({ token })} />
                      ))}
                    {'\n'}
                  </Fragment>
                ))}
              </code>
            </pre>
          </div>
        )
      }}
    </Highlight>
  )
}
