import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react'
import clsx from 'clsx'
import { DarkIcon, LightIcon, SystemIcon } from './icons'

const themes = [
  { name: 'Light', value: 'light', icon: LightIcon },
  { name: 'Dark', value: 'dark', icon: DarkIcon },
  { name: 'System', value: 'system', icon: SystemIcon },
]

export function ThemeSelector(
  props: React.ComponentPropsWithoutRef<typeof Listbox<'div'>>,
) {
  let { theme, setTheme } = useTheme()
  let [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-6 w-6" />
  }

  return (
    <Listbox as="div" value={theme} onChange={setTheme} {...props}>
      <Label className="sr-only">Theme</Label>
      <ListboxButton
        className="flex h-6 w-6 items-center justify-center rounded-lg shadow-md ring-1 shadow-black/5 ring-black/5 dark:bg-slate-700 dark:ring-white/5 dark:ring-inset"
        aria-label="Theme"
      >
        <LightIcon
          className={clsx(
            'h-4 w-4 dark:hidden',
            theme === 'system' ? 'fill-slate-400' : 'fill-sky-400',
          )}
        />
        <DarkIcon
          className={clsx(
            'hidden h-4 w-4 dark:block',
            theme === 'system' ? 'fill-slate-400' : 'fill-sky-400',
          )}
        />
      </ListboxButton>
      <ListboxOptions className="absolute top-full left-1/2 mt-3 w-36 -translate-x-1/2 space-y-1 rounded-xl bg-white p-3 text-sm font-medium shadow-md ring-1 shadow-black/5 ring-black/5 dark:bg-slate-800 dark:ring-white/5">
        {themes.map((theme) => (
          <ListboxOption
            key={theme.value}
            value={theme.value}
            className={({ focus, selected }) =>
              clsx(
                'flex cursor-pointer items-center rounded-[0.625rem] p-1 select-none',
                {
                  'text-sky-500': selected,
                  'text-slate-900 dark:text-white': focus && !selected,
                  'text-slate-700 dark:text-slate-400': !focus && !selected,
                  'bg-slate-100 dark:bg-slate-900/40': focus,
                },
              )
            }
          >
            {({ selected }) => (
              <>
                <div className="rounded-md bg-white p-1 shadow-sm ring-1 ring-slate-900/5 dark:bg-slate-700 dark:ring-white/5 dark:ring-inset">
                  <theme.icon
                    className={clsx(
                      'h-4 w-4',
                      selected
                        ? 'fill-sky-400 dark:fill-sky-400'
                        : 'fill-slate-400',
                    )}
                  />
                </div>
                <div className="ml-3">{theme.name}</div>
              </>
            )}
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  )
}
