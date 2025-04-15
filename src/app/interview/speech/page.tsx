'use client'

import { useState } from 'react'
import AudioRecorder from '@/components/interview/AudioRecorder'
import SpeechAnalysisCard from '@/components/interview/SpeechAnalysisCard'
import { toast } from 'react-toastify'
import { interviewApi } from '@/services/apiService'
import type { SpeechAnalysis } from '@/services/types'

const sampleQuestions = [
  'Tell me about yourself and your background.',
  'Why are you interested in this position?',
  'What are your greatest strengths and weaknesses?',
  'Where do you see yourself in five years?',
  'Describe a challenging situation and how you handled it.',
]

export default function InterviewPracticePage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(sampleQuestions[0])
  const [analysis, setAnalysis] = useState<SpeechAnalysis | null>(null)

  const handleRecordingComplete = async (audioBlob: Blob) => {
    try {
      setIsAnalyzing(true)
      const response = await interviewApi.analyzeSpeech(audioBlob)
      setAnalysis(response.data)
      toast.success('Speech analysis completed!')
    } catch (error) {
      toast.error('Failed to analyze speech. Please try again.')
      console.error('Speech analysis error:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleNewQuestion = () => {
    const currentIndex = sampleQuestions.indexOf(currentQuestion)
    const nextIndex = (currentIndex + 1) % sampleQuestions.length
    setCurrentQuestion(sampleQuestions[nextIndex])
    setAnalysis(null)
  }

  return (
    <div className="py-8">
      <div className="mx-auto max-w-4xl">
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Interview Practice
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              Practice your interview skills and get AI-powered feedback
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div>
            <div className="rounded-lg bg-white shadow">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Practice Question
                </h3>
                <div className="mt-4">
                  <div className="rounded-md bg-indigo-50 p-4">
                    <p className="text-sm text-indigo-700">{currentQuestion}</p>
                  </div>
                  <button
                    onClick={handleNewQuestion}
                    className="mt-4 inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Next Question
                  </button>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900">
                    Record Your Answer
                  </h4>
                  <div className="mt-2">
                    <AudioRecorder
                      onRecordingComplete={handleRecordingComplete}
                      isAnalyzing={isAnalyzing}
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900">Tips</h4>
                  <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-gray-600">
                    <li>Speak clearly and at a moderate pace</li>
                    <li>Use specific examples to support your answers</li>
                    <li>Keep your answers focused and concise</li>
                    <li>Show enthusiasm in your voice</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div>
            {analysis ? (
              <SpeechAnalysisCard analysis={analysis} />
            ) : (
              <div className="rounded-lg bg-gray-50 p-6">
                <p className="text-center text-gray-500">
                  Record and submit your answer to see the analysis
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
