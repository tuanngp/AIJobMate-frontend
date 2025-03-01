import { CareerAdvice } from '@/services/types'
import {
  AcademicCapIcon,
  BriefcaseIcon,
  LightBulbIcon,
} from '@heroicons/react/24/outline'

interface CareerAdviceCardProps {
  advice: CareerAdvice
}

export default function CareerAdviceCard({ advice }: CareerAdviceCardProps) {
  return (
    <div className="bg-white shadow sm:rounded-lg">
      {/* Suggestions Section */}
      <div className="px-4 py-5 sm:p-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex sm:items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-indigo-100">
              <LightBulbIcon
                className="h-6 w-6 text-indigo-600"
                aria-hidden="true"
              />
            </div>
            <h3 className="mt-4 text-lg font-medium leading-6 text-gray-900 sm:ml-4 sm:mt-0">
              Career Suggestions
            </h3>
          </div>
        </div>
        <div className="mt-4">
          <ul className="list-disc space-y-2 pl-5">
            {advice.suggestions.map((suggestion, index) => (
              <li key={index} className="text-sm text-gray-600">
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Skills Section */}
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <div className="sm:flex sm:items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-indigo-100">
            <AcademicCapIcon
              className="h-6 w-6 text-indigo-600"
              aria-hidden="true"
            />
          </div>
          <h3 className="mt-4 text-lg font-medium leading-6 text-gray-900 sm:ml-4 sm:mt-0">
            Skills Analysis
          </h3>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <h4 className="text-sm font-medium text-gray-900">
              Your Current Skills
            </h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {advice.skills.existing.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900">
              Recommended Skills
            </h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {advice.skills.recommended.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Job Titles Section */}
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <div className="sm:flex sm:items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-indigo-100">
            <BriefcaseIcon
              className="h-6 w-6 text-indigo-600"
              aria-hidden="true"
            />
          </div>
          <h3 className="mt-4 text-lg font-medium leading-6 text-gray-900 sm:ml-4 sm:mt-0">
            Recommended Job Titles
          </h3>
        </div>
        <div className="mt-4">
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {advice.jobTitles.map((title) => (
              <li
                key={title}
                className="rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-600"
              >
                {title}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
