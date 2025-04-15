'use client'

import { useState } from 'react'
import JobList from '@/components/jobs/JobList'
import SalaryPrediction from '@/components/jobs/SalaryPrediction'
import { jobsApi } from '@/services/apiService'
import type { Job, SalaryPrediction as SalaryPredictionType } from '@/services/types'
import { toast } from 'react-toastify'

const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote']

export default function JobsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [jobs, setJobs] = useState<Job[]>([])
  const [salaryPrediction, setSalaryPrediction] = useState<SalaryPredictionType | null>(null)

  const [formData, setFormData] = useState({
    skills: '',
    experience: '',
    location: '',
    jobType: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)

      // Convert skills string to array and clean up
      const skillsArray = formData.skills
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean)

      // Get job matches
      const jobResponse = await jobsApi.searchJobs({
        skills: skillsArray,
        experience: Number(formData.experience),
        location: formData.location,
        jobType: formData.jobType,
      })
      setJobs(jobResponse.data)

      // Get salary prediction
      const salaryResponse = await jobsApi.predictSalary(
        skillsArray,
        Number(formData.experience)
      )
      setSalaryPrediction(salaryResponse.data)

      toast.success('Search completed successfully!')
    } catch (error) {
      toast.error('Failed to fetch results. Please try again.')
      console.error('Job search error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="py-8">
      <div className="mx-auto max-w-7xl">
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Job Matching & Salary Prediction
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              Find jobs that match your skills and get personalized salary insights
            </p>
          </div>
        </div>

        <div className="mt-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <label
                  htmlFor="skills"
                  className="block text-sm font-medium text-gray-700"
                >
                  Skills
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="skills"
                    id="skills"
                    required
                    placeholder="e.g. React, TypeScript, Node.js"
                    value={formData.skills}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Separate multiple skills with commas
                </p>
              </div>

              <div>
                <label
                  htmlFor="experience"
                  className="block text-sm font-medium text-gray-700"
                >
                  Years of Experience
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="experience"
                    id="experience"
                    required
                    min="0"
                    max="50"
                    value={formData.experience}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700"
                >
                  Location
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="location"
                    id="location"
                    required
                    placeholder="e.g. New York, NY"
                    value={formData.location}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="jobType"
                  className="block text-sm font-medium text-gray-700"
                >
                  Job Type
                </label>
                <div className="mt-1">
                  <select
                    name="jobType"
                    id="jobType"
                    required
                    value={formData.jobType}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">Select job type</option>
                    {jobTypes.map((type) => (
                      <option key={type} value={type.toLowerCase()}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Searching...' : 'Search Jobs'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {jobs.length > 0 ? (
              <JobList jobs={jobs} />
            ) : (
              <div className="rounded-lg bg-gray-50 p-6">
                <p className="text-center text-gray-500">
                  Enter your skills and preferences to find matching jobs
                </p>
              </div>
            )}
          </div>

          <div>
            {salaryPrediction ? (
              <SalaryPrediction prediction={salaryPrediction} />
            ) : (
              <div className="rounded-lg bg-gray-50 p-6">
                <p className="text-center text-gray-500">
                  Submit the form to see salary predictions based on your skills and
                  experience
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
