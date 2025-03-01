import Link from 'next/link'
import {
  DocumentTextIcon,
  MicrophoneIcon,
  VideoCameraIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline'

const features = [
  {
    name: 'Career Advisor',
    description:
      'Upload your CV and get personalized career advice and skill recommendations from AI.',
    icon: DocumentTextIcon,
    href: '/career',
  },
  {
    name: 'Interview Practice',
    description:
      'Practice your interview skills with AI speech analysis and get real-time feedback.',
    icon: MicrophoneIcon,
    href: '/interview/speech',
  },
  {
    name: 'Video Interview Coach',
    description:
      'Get feedback on your body language and presentation skills through AI video analysis.',
    icon: VideoCameraIcon,
    href: '/interview/video',
  },
  {
    name: 'Job Matching',
    description:
      'Find the perfect job match based on your skills and get salary predictions.',
    icon: BriefcaseIcon,
    href: '/jobs',
  },
]

export default function Home() {
  return (
    <div className="relative isolate">
      {/* Background gradient */}
      <div
        className="absolute inset-x-0 -z-10 transform-gpu overflow-hidden blur-3xl"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-500 to-purple-500 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      {/* Hero section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Your AI Career Assistant
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Get personalized career advice, practice interviews, and find your
              perfect job match with AI-powered assistance.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/career"
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Get Started
              </Link>
              <Link
                href="/interview/speech"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Try Interview Practice <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">
            Accelerate Your Career
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to advance your career
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            AI JobMate provides comprehensive tools and insights to help you make
            better career decisions and succeed in your job search.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
            {features.map((feature) => (
              <Link
                key={feature.name}
                href={feature.href}
                className="flex flex-col rounded-lg border border-gray-200 p-6 hover:border-indigo-500 transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                  <feature.icon
                    className="h-6 w-6 text-white"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold leading-7 tracking-tight text-gray-900">
                    {feature.name}
                  </h3>
                  <p className="mt-2 text-base leading-7 text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Background gradient */}
      <div
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        aria-hidden="true"
      >
        <div
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-indigo-500 to-purple-500 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>
    </div>
  )
}
