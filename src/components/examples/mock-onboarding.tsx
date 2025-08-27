import { OnboardingProvider } from '@onboardjs/react'

export const mockSteps = [
  {
    id: 'step1',
  },
  {
    id: 'step2',
  },
  {
    id: 'step3',
  },
  {
    id: 'step4',
  },
]

export const MockOnboardingProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <OnboardingProvider steps={mockSteps} componentRegistry={{}}>
      {children}
    </OnboardingProvider>
  )
}
