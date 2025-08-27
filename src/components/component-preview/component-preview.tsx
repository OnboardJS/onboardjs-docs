'use client'

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import { Fence } from '../fence'

type ExtraCode = {
  name: string
  code: string
}

interface ComponentPreviewProps {
  component: React.ReactNode
  code?: string
  language?: string
  className?: string
  previewClassName?: string
  codeClassName?: string
  extras?: ExtraCode[]
}

export default function ComponentPreview({
  component: Component,
  code,
  language = 'tsx',
  className = '',
  previewClassName = '',
  codeClassName = '',
  extras = [],
}: ComponentPreviewProps) {
  return (
    <div
      className={`mx-auto w-full max-w-4xl rounded-lg border border-gray-200 shadow-sm dark:border-gray-500 ${className}`}
    >
      <TabGroup>
        <div>
          <TabList className="flex space-x-0 overflow-x-auto px-6">
            <Tab
              className={({ selected }) =>
                `px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  selected
                    ? 'border-b-2 border-blue-500'
                    : 'text-gray-700 hover:text-gray-800 dark:text-gray-200 dark:hover:text-gray-400'
                }`
              }
            >
              Preview
            </Tab>
            {code ? (
              <Tab
                className={({ selected }) =>
                  `px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    selected
                      ? 'border-b-2 border-blue-500'
                      : 'text-gray-700 hover:text-gray-800 dark:text-gray-200 dark:hover:text-gray-400'
                  }`
                }
              >
                Code
              </Tab>
            ) : null}
            {extras.map((extra) => (
              <Tab
                key={extra.name}
                className={({ selected }) =>
                  `px-4 py-2 text-sm font-medium text-nowrap transition-colors duration-200 ${
                    selected
                      ? 'border-b-2 border-blue-500'
                      : 'text-gray-700 hover:text-gray-800 dark:text-gray-200 dark:hover:text-gray-400'
                  }`
                }
              >
                {extra.name}
              </Tab>
            ))}
          </TabList>
        </div>

        <TabPanels className="flex max-h-[600px] min-h-[450px] flex-col overflow-y-auto">
          <TabPanel
            className={`shadcn flex grow items-center justify-center p-6 focus:outline-none ${previewClassName}`}
          >
            {Component}
          </TabPanel>
          {code ? (
            <TabPanel
              className={`flex grow flex-col focus:outline-none ${codeClassName}`}
            >
              <Fence className="grow" language={language} bodyClassName="px-4">
                {code.trim()}
              </Fence>
            </TabPanel>
          ) : null}
          {extras.map((extra) => (
            <TabPanel
              key={extra.name}
              className={`flex grow flex-col focus:outline-none ${codeClassName}`}
            >
              <Fence className="grow" language={language} bodyClassName="px-4">
                {extra.code.trim()}
              </Fence>
            </TabPanel>
          ))}
        </TabPanels>
      </TabGroup>
    </div>
  )
}
