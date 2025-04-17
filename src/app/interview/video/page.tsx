'use client'

import { useState } from 'react'
import useVideoRecorder from '@/hooks/useVideoRecorder'
import VideoAnalysisCard from '@/components/interview/VideoAnalysisCard'
import { toast } from 'react-toastify'
import type { VideoAnalysis } from '@/services/types'
import { VideoCameraIcon, StopIcon } from '@heroicons/react/24/solid'
import Webcam from 'react-webcam'

const sampleQuestions = [
  'Tell me about a project you are most proud of.',
  'How do you handle stress and pressure?',
  'Why should we hire you for this position?',
  'What are your career goals for the next five years?',
  'Describe your ideal work environment.',
]

export default function VideoInterviewPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(sampleQuestions[0])
  const [analysis, setAnalysis] = useState<VideoAnalysis | null>(null)
  const {
    webcamRef,
    isRecording,
    videoUrl,
    startRecording,
    stopRecording,
    getVideoBlob,
    videoConstraints,
    duration,
    formatDuration,
  } = useVideoRecorder()

  const handleRecordingComplete = async () => {
    const blob = getVideoBlob()
    if (!blob) return

    try {
      setIsAnalyzing(true)
      toast.success('Video analysis completed!')
    } catch (error) {
      toast.error('Failed to analyze video. Please try again.')
      console.error('Video analysis error:', error)
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
      <div className="mx-auto max-w-7xl">
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Video Interview Practice
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              Practice your interview with video analysis of your body language and
              facial expressions
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            {/* Question Card */}
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
              </div>
            </div>

            {/* Video Preview */}
            <div className="rounded-lg bg-white shadow">
              <div className="p-6">
                <div className="aspect-video overflow-hidden rounded-lg bg-gray-100">
                  {!videoUrl ? (
                    <Webcam
                      ref={webcamRef}
                      audio={true}
                      videoConstraints={videoConstraints}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <video
                      src={videoUrl}
                      className="h-full w-full object-cover"
                      controls
                    />
                  )}
                </div>

                {/* Recording Controls */}
                <div className="mt-4 flex items-center justify-center space-x-4">
                  {!isRecording && !videoUrl && (
                    <button
                      onClick={startRecording}
                      className="flex items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
                    >
                      <VideoCameraIcon className="h-5 w-5" />
                      Start Recording
                    </button>
                  )}

                  {isRecording && (
                    <button
                      onClick={stopRecording}
                      className="flex items-center justify-center gap-2 rounded-md bg-gray-600 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-500"
                    >
                      <StopIcon className="h-5 w-5" />
                      Stop Recording ({formatDuration(duration)})
                    </button>
                  )}

                  {videoUrl && !isRecording && (
                    <>
                      <button
                        onClick={startRecording}
                        className="flex items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
                      >
                        <VideoCameraIcon className="h-5 w-5" />
                        Record Again
                      </button>
                      <button
                        onClick={handleRecordingComplete}
                        disabled={isAnalyzing}
                        className="flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isAnalyzing ? 'Analyzing...' : 'Analyze Recording'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h4 className="text-sm font-medium text-gray-900">Video Tips</h4>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-gray-600">
                <li>Ensure good lighting and a neutral background</li>
                <li>Position yourself centrally in the frame</li>
                <li>Maintain good posture and eye contact</li>
                <li>Use natural hand gestures while speaking</li>
                <li>Show engagement through facial expressions</li>
              </ul>
            </div>
          </div>

          <div>
            {analysis ? (
              <VideoAnalysisCard analysis={analysis} />
            ) : (
              <div className="rounded-lg bg-gray-50 p-6">
                <p className="text-center text-gray-500">
                  Record and submit your video to see the analysis
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
