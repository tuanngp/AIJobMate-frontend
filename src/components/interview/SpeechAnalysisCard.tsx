import { SpeechAnalysis } from '@/services/types'
import {
  ChartBarIcon,
  ChatBubbleBottomCenterTextIcon,
  HeartIcon,
  SpeakerWaveIcon,
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentListIcon,
  ChartPieIcon,
} from '@heroicons/react/24/outline'
import { useState } from 'react'

interface SpeechAnalysisCardProps {
  analysis: SpeechAnalysis
  rawFeedback?: any // Add prop for raw feedback data
}

export default function SpeechAnalysisCard({
  analysis,
  rawFeedback,
}: SpeechAnalysisCardProps) {
  const [activeTab, setActiveTab] = useState<string>('summary')

  // Helper function to get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  // Helper function to get background color based on score
  const getScoreBgColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-50'
    if (score >= 0.6) return 'bg-yellow-50'
    return 'bg-red-50'
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

      {/* Raw Feedback Data Section */}
      {rawFeedback && (
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="sm:flex sm:items-center">
            <h3 className="text-base font-medium text-gray-900 flex items-center">
              <DocumentTextIcon className="h-5 w-5 mr-2 text-indigo-600" />
              Complete AI Feedback Data
            </h3>
          </div>
          
          {/* Tabs for different feedback views */}
          <div className="mt-4 border-b border-gray-200">
            <nav className="-mb-px flex space-x-4" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('summary')}
                className={`${
                  activeTab === 'summary'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } flex whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium`}
              >
                <ClipboardDocumentCheckIcon className="h-5 w-5 mr-1" />
                Summary
              </button>
              <button
                onClick={() => setActiveTab('scores')}
                className={`${
                  activeTab === 'scores'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } flex whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium`}
              >
                <ChartPieIcon className="h-5 w-5 mr-1" />
                Detailed Scores
              </button>
              <button
                onClick={() => setActiveTab('raw')}
                className={`${
                  activeTab === 'raw'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } flex whitespace-nowrap border-b-2 py-2 px-1 text-sm font-medium`}
              >
                <ClipboardDocumentListIcon className="h-5 w-5 mr-1" />
                Raw Data
              </button>
            </nav>
          </div>
          
          <div className="mt-4">
            {/* Summary View */}
            {activeTab === 'summary' && (
              <div className="space-y-4">
                {/* Summary section */}
                {rawFeedback.feedback_summary && (
                  <div className="bg-indigo-50 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-indigo-700 mb-2">Overall Assessment</h4>
                    <p className="text-sm text-indigo-900">{rawFeedback.feedback_summary}</p>
                  </div>
                )}
                
                {/* Strengths section */}
                {rawFeedback.strengths && rawFeedback.strengths.length > 0 && (
                  <div className="bg-green-50 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-green-700 mb-2">Strengths</h4>
                    <ul className="space-y-1">
                      {rawFeedback.strengths.map((strength: string, idx: number) => (
                        <li key={idx} className="text-sm text-green-800 flex items-start">
                          <span className="mr-2 text-green-600">✓</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Weaknesses section */}
                {rawFeedback.weaknesses && rawFeedback.weaknesses.length > 0 && (
                  <div className="bg-red-50 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-red-700 mb-2">Areas for Improvement</h4>
                    <ul className="space-y-1">
                      {rawFeedback.weaknesses.map((weakness: string, idx: number) => (
                        <li key={idx} className="text-sm text-red-800 flex items-start">
                          <span className="mr-2 text-red-600">!</span>
                          {weakness}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Improvement suggestions */}
                {rawFeedback.improvement_suggestions && rawFeedback.improvement_suggestions.length > 0 && (
                  <div className="bg-yellow-50 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-yellow-700 mb-2">Suggestions for Next Time</h4>
                    <ul className="space-y-1">
                      {rawFeedback.improvement_suggestions.map((suggestion: string, idx: number) => (
                        <li key={idx} className="text-sm text-yellow-800 flex items-start">
                          <span className="mr-2 text-yellow-600">→</span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            {/* Detailed Scores View */}
            {activeTab === 'scores' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rawFeedback.structure_clarity && (
                  <div className={`p-4 rounded-md ${getScoreBgColor(rawFeedback.structure_clarity.score)}`}>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-gray-800">Structure & Clarity</h4>
                      <span className={`text-sm font-bold ${getScoreColor(rawFeedback.structure_clarity.score * 100)}`}>
                        {Math.round(rawFeedback.structure_clarity.score * 10)}/10
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{rawFeedback.structure_clarity.comments}</p>
                  </div>
                )}
                
                {rawFeedback.relevance && (
                  <div className={`p-4 rounded-md ${getScoreBgColor(rawFeedback.relevance.score)}`}>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-gray-800">Relevance</h4>
                      <span className={`text-sm font-bold ${getScoreColor(rawFeedback.relevance.score * 100)}`}>
                        {Math.round(rawFeedback.relevance.score * 10)}/10
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{rawFeedback.relevance.comments}</p>
                  </div>
                )}
                
                {rawFeedback.expertise_level && (
                  <div className={`p-4 rounded-md ${getScoreBgColor(rawFeedback.expertise_level.score)}`}>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-gray-800">Expertise Level</h4>
                      <span className={`text-sm font-bold ${getScoreColor(rawFeedback.expertise_level.score * 100)}`}>
                        {Math.round(rawFeedback.expertise_level.score * 10)}/10
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{rawFeedback.expertise_level.comments}</p>
                  </div>
                )}
                
                {rawFeedback.overall_score && (
                  <div className={`p-4 rounded-md ${getScoreBgColor(rawFeedback.overall_score)}`}>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-gray-800">Overall Rating</h4>
                      <span className={`text-sm font-bold ${getScoreColor(rawFeedback.overall_score * 100)}`}>
                        {Math.round(rawFeedback.overall_score * 10)}/10
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div 
                        className={`h-2.5 rounded-full ${rawFeedback.overall_score >= 0.8 ? 'bg-green-600' : 
                                   rawFeedback.overall_score >= 0.6 ? 'bg-yellow-500' : 'bg-red-600'}`}
                        style={{ width: `${rawFeedback.overall_score * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Raw Data View */}
            {activeTab === 'raw' && (
              <div className="bg-gray-50 p-4 rounded-md">
                <pre className="text-xs text-gray-800 whitespace-pre-wrap overflow-x-auto max-h-96 overflow-y-auto">
                  {JSON.stringify(rawFeedback, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
