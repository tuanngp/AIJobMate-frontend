import { SalaryPrediction as SalaryPredictionType } from '@/services/types'
import {
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  ScaleIcon,
} from '@heroicons/react/24/outline'

interface SalaryPredictionProps {
  prediction: SalaryPredictionType
}

export default function SalaryPrediction({
  prediction,
}: SalaryPredictionProps) {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getImpactColor = (impact: number) => {
    if (impact >= 0.7) return 'text-green-600'
    if (impact >= 0.4) return 'text-yellow-600'
    return 'text-gray-600'
  }

  return (
    <div className="rounded-lg bg-white shadow">
      <div className="p-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex sm:items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-indigo-100">
              <CurrencyDollarIcon
                className="h-6 w-6 text-indigo-600"
                aria-hidden="true"
              />
            </div>
            <h3 className="mt-4 text-lg font-medium leading-6 text-gray-900 sm:ml-4 sm:mt-0">
              Salary Prediction
            </h3>
          </div>
        </div>

        <div className="mt-6">
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="overflow-hidden rounded-lg bg-gray-50 px-4 py-5">
              <dt className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <ArrowTrendingUpIcon className="h-5 w-5" />
                Maximum
              </dt>
              <dd className="mt-1 text-2xl font-semibold tracking-tight text-indigo-600">
                {formatCurrency(prediction.maximum, prediction.currency)}
              </dd>
            </div>

            <div className="overflow-hidden rounded-lg bg-gray-50 px-4 py-5">
              <dt className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <ScaleIcon className="h-5 w-5" />
                Median
              </dt>
              <dd className="mt-1 text-2xl font-semibold tracking-tight text-indigo-600">
                {formatCurrency(prediction.median, prediction.currency)}
              </dd>
            </div>

            <div className="overflow-hidden rounded-lg bg-gray-50 px-4 py-5">
              <dt className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <ArrowTrendingUpIcon className="h-5 w-5 rotate-180" />
                Minimum
              </dt>
              <dd className="mt-1 text-2xl font-semibold tracking-tight text-indigo-600">
                {formatCurrency(prediction.minimum, prediction.currency)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900">Salary Factors</h4>
          <ul className="mt-4 space-y-4">
            {prediction.factors.map((factor, index) => (
              <li key={index}>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{factor.name}</span>
                  <span
                    className={`text-sm font-medium ${getImpactColor(
                      factor.impact
                    )}`}
                  >
                    {Math.round(factor.impact * 100)}% Impact
                  </span>
                </div>
                <div className="mt-1">
                  <div className="flex h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="bg-indigo-600"
                      style={{ width: `${factor.impact * 100}%` }}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 rounded-md bg-gray-50 p-4">
          <p className="text-xs text-gray-500">
            Predictions are based on market data, your skills, and experience
            level. Actual salaries may vary depending on company, location, and
            other factors.
          </p>
        </div>
      </div>
    </div>
  )
}
