import { SpeechAnalysis } from '@/services/types'
import {
  ChartBarIcon,
  ChatBubbleBottomCenterTextIcon,
  HeartIcon,
  SpeakerWaveIcon,
} from '@heroicons/react/24/outline'

interface SpeechAnalysisCardProps {
  analysis: SpeechAnalysis
}

export default function SpeechAnalysisCard({
  analysis,
}: SpeechAnalysisCardProps) {
  // Helper function to get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  // Helper function to format score as percentage
  const formatScore = (score: number) => `${Math.round(score)}%`

  return (
    <div className="bg-white shadow sm:rounded-lg">
      {/* Transcription Section */}
      <div className="px-4 py-5 sm:p-6">
        <div className="sm:flex sm:items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-indigo-100">
            <ChatBubbleBottomCenterTextIcon
              className="h-6 w-6 text-indigo-600"
              aria-hidden="true"
            />
          </div>
          <h3 className="mt-4 text-lg font-medium leading-6 text-gray-900 sm:ml-4 sm:mt-0">
            Speech Transcription
          </h3>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-600 whitespace-pre-wrap">
            {analysis.transcription}
          </p>
        </div>
      </div>

      {/* Scores Section */}
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <h4 className="text-base font-medium text-gray-900">Speech Analysis</h4>
        <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Fluency Score */}
          <div className="overflow-hidden rounded-lg bg-gray-50 px-4 py-5">
            <dt className="flex items-center gap-2 text-sm font-medium text-gray-500">
              <SpeakerWaveIcon className="h-5 w-5" />
              Fluency
            </dt>
            <dd
              className={`mt-1 text-3xl font-semibold tracking-tight ${getScoreColor(
                analysis.fluencyScore
              )}`}
            >
              {formatScore(analysis.fluencyScore)}
            </dd>
          </div>

          {/* Clarity Score */}
          <div className="overflow-hidden rounded-lg bg-gray-50 px-4 py-5">
            <dt className="flex items-center gap-2 text-sm font-medium text-gray-500">
              <ChartBarIcon className="h-5 w-5" />
              Clarity
            </dt>
            <dd
              className={`mt-1 text-3xl font-semibold tracking-tight ${getScoreColor(
                analysis.clarity
              )}`}
            >
              {formatScore(analysis.clarity)}
            </dd>
          </div>

          {/* Emotion Analysis */}
          <div className="overflow-hidden rounded-lg bg-gray-50 px-4 py-5">
            <dt className="flex items-center gap-2 text-sm font-medium text-gray-500">
              <HeartIcon className="h-5 w-5" />
              Emotion
            </dt>
            <dd className="mt-1">
              <span className="text-lg font-medium text-gray-900 capitalize">
                {analysis.emotion.tone}
              </span>
              <span className="ml-2 text-sm text-gray-500">
                ({formatScore(analysis.emotion.confidence)})
              </span>
            </dd>
          </div>
        </dl>
      </div>

      {/* Feedback Section */}
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <h4 className="text-base font-medium text-gray-900">
          Improvement Suggestions
        </h4>
        <ul className="mt-4 space-y-2">
          {analysis.feedback.map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-sm text-gray-600"
            >
              <span className="select-none">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
