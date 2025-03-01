import { Job } from '@/services/types'
import { BriefcaseIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { CurrencyDollarIcon } from '@heroicons/react/24/solid'

interface JobListProps {
  jobs: Job[]
}

export default function JobList({ jobs }: JobListProps) {
  const formatSalaryRange = (min: number, max: number, currency: string) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    })
    return `${formatter.format(min)} - ${formatter.format(max)}`
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800'
    if (score >= 60) return 'bg-yellow-100 text-yellow-800'
    return 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <div
          key={job.id}
          className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2"
        >
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium text-gray-900">
                  {job.title}
                </h3>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getMatchScoreColor(
                    job.matchScore
                  )}`}
                >
                  {Math.round(job.matchScore)}% Match
                </span>
              </div>
              <p className="mt-1 flex items-center text-sm text-gray-500">
                <BriefcaseIcon className="mr-1.5 h-4 w-4 flex-shrink-0" />
                {job.company}
              </p>
              <p className="mt-1 flex items-center text-sm text-gray-500">
                <MapPinIcon className="mr-1.5 h-4 w-4 flex-shrink-0" />
                {job.location}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center text-sm font-medium text-gray-900">
                <CurrencyDollarIcon className="mr-1.5 h-4 w-4 text-gray-500" />
                {formatSalaryRange(
                  job.salary.min,
                  job.salary.max,
                  job.salary.currency
                )}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-sm text-gray-700">
              <h4 className="font-medium text-gray-900">Requirements:</h4>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {job.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          </div>

          <button
            type="button"
            className="mt-4 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Apply Now
          </button>
        </div>
      ))}
    </div>
  )
}
