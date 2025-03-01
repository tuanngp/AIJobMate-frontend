import { useState } from 'react'
import { JobPreferences } from '@/services/types'

interface CareerFormProps {
  onSubmit: (preferences: JobPreferences) => void
  isLoading?: boolean
}

export default function CareerForm({ onSubmit, isLoading }: CareerFormProps) {
  const [preferences, setPreferences] = useState<JobPreferences>({
    desiredRole: '',
    industry: '',
    location: '',
    experienceLevel: '',
    expectedSalary: 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(preferences)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setPreferences((prev) => ({
      ...prev,
      [name]: name === 'expectedSalary' ? Number(value) : value,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="desiredRole"
          className="block text-sm font-medium text-gray-700"
        >
          Desired Role
        </label>
        <input
          type="text"
          name="desiredRole"
          id="desiredRole"
          required
          placeholder="e.g. Software Engineer"
          value={preferences.desiredRole}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        />
      </div>

      <div>
        <label
          htmlFor="industry"
          className="block text-sm font-medium text-gray-700"
        >
          Industry
        </label>
        <input
          type="text"
          name="industry"
          id="industry"
          required
          placeholder="e.g. Technology"
          value={preferences.industry}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        />
      </div>

      <div>
        <label
          htmlFor="location"
          className="block text-sm font-medium text-gray-700"
        >
          Preferred Location
        </label>
        <input
          type="text"
          name="location"
          id="location"
          required
          placeholder="e.g. New York, NY"
          value={preferences.location}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        />
      </div>

      <div>
        <label
          htmlFor="experienceLevel"
          className="block text-sm font-medium text-gray-700"
        >
          Experience Level
        </label>
        <select
          name="experienceLevel"
          id="experienceLevel"
          required
          value={preferences.experienceLevel}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        >
          <option value="">Select experience level</option>
          <option value="entry">Entry Level (0-2 years)</option>
          <option value="mid">Mid Level (3-5 years)</option>
          <option value="senior">Senior Level (6+ years)</option>
          <option value="lead">Lead/Manager</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="expectedSalary"
          className="block text-sm font-medium text-gray-700"
        >
          Expected Annual Salary (USD)
        </label>
        <input
          type="number"
          name="expectedSalary"
          id="expectedSalary"
          required
          min="0"
          step="1000"
          value={preferences.expectedSalary}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Analyzing...' : 'Get Career Advice'}
        </button>
      </div>
    </form>
  )
}
