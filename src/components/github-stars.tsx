'use client'

import { motion } from 'framer-motion'
import { StarIcon } from 'lucide-react'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function GitHubStars() {
  const { data } = useSWR<{ stargazers_count: number }>(
    'https://api.github.com/repos/Somafet/onboardjs',
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 3600000, // 1 hour
    },
  )

  const stars = data?.stargazers_count

  if (!stars) return null

  const formattedStars = stars >= 1000 ? `${(stars / 1000).toFixed(1)}k` : stars

  return (
    <motion.span
      className="relative ml-1.5 inline-flex items-center gap-0.5 overflow-hidden rounded-full bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
      animate={{
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 0.6,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatDelay: 5,
      }}
    >
      <motion.span
        className="bg-linear-to-r absolute inset-0 -translate-x-full from-transparent via-white/60 to-transparent dark:via-slate-900/60"
        animate={{
          translateX: ['-100%', '100%'],
        }}
        transition={{
          duration: 0.8,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatDelay: 5,
        }}
      />
      <motion.span
        animate={{
          rotate: [0, -20, 20, -20, 0],
          scale: [1, 1.2, 1.2, 1.2, 1],
        }}
        transition={{
          duration: 0.6,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatDelay: 5,
        }}
      >
        <StarIcon className="size-3 fill-amber-500 text-amber-500" />
      </motion.span>
      <span className="relative">{formattedStars}</span>
    </motion.span>
  )
}
