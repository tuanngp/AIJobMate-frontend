'use client'

import { useState, useEffect } from 'react'
import useVideoRecorder from '@/hooks/useVideoRecorder'
import { toast } from 'react-toastify'
import { InterviewService } from '@/services/interview'
import { Interview, InterviewQuestion } from '@/services/types'
import { VideoCameraIcon, StopIcon } from '@heroicons/react/24/solid'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronRight, FileQuestion } from 'lucide-react'
import Link from 'next/link'
import Webcam from 'react-webcam'

export default function VideoInterviewPage() {
  const [currentQuestion, setCurrentQuestion] = useState<string>("Tell me about yourself and your experience.")
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [selectedInterviewId, setSelectedInterviewId] = useState<string>('')
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null)
  const [interviewQuestions, setInterviewQuestions] = useState<InterviewQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [useGeneratedQuestions, setUseGeneratedQuestions] = useState(false)

  const sampleQuestions = [
    "Tell me about yourself and your experience.",
    "What are your greatest strengths and weaknesses?",
    "Why do you want to work for this company?",
    "Where do you see yourself in five years?",
    "Describe a challenging situation at work and how you handled it.",
    "How do you handle pressure or stressful situations?",
    "What is your greatest professional achievement?",
    "Why should we hire you?",
    "Do you have any questions for us?"
  ]

  const interviewService = InterviewService()
  
  const {
    webcamRef,
    isRecording,
    videoUrl,
    startRecording,
    stopRecording,
    videoConstraints,
    duration,
    formatDuration,
  } = useVideoRecorder()

  useEffect(() => {
    loadInterviews()
  }, [])

  useEffect(() => {
    // Initialize with sample questions if no interview is selected
    if (!useGeneratedQuestions && sampleQuestions.length > 0) {
      setCurrentQuestion(sampleQuestions[0])
    }
  }, [])

  useEffect(() => {
    if (selectedInterviewId) {
      loadInterviewDetails(parseInt(selectedInterviewId))
    }
  }, [selectedInterviewId])

  useEffect(() => {
    if (selectedInterview && selectedInterview.questions && selectedInterview.questions.length > 0) {
      setInterviewQuestions(selectedInterview.questions)
      setCurrentQuestionIndex(0)
      setCurrentQuestion(selectedInterview.questions[0].question)
      setUseGeneratedQuestions(true)
    } else if (selectedInterview && (!selectedInterview.questions || selectedInterview.questions.length === 0)) {
      // Fallback to sample questions if the selected interview has no questions
      toast.warning('This interview has no questions. Using sample questions instead.')
      setUseGeneratedQuestions(false)
      setCurrentQuestion(sampleQuestions[0])
      setCurrentQuestionIndex(0)
    }
  }, [selectedInterview])

  const loadInterviews = async () => {
    setLoading(true)
    try {
      const response = await interviewService.getInterviews()
      if (response.code === 200) {
        setInterviews(response.data)
      } else {
        toast.error(response.message || 'Failed to load interviews')
      }
    } catch (error) {
      toast.error('Failed to load interviews')
      console.error('Load interviews error:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadInterviewDetails = async (interviewId: number) => {
    try {
      const response = await interviewService.getInterview(interviewId)
      if (response.code === 200) {
        setSelectedInterview(response.data)
      } else {
        toast.error(response.message || 'Failed to load interview details')
      }
    } catch (error) {
      toast.error('Failed to load interview details')
      console.error('Load interview details error:', error)
    }
  }

  const handleNextQuestion = () => {
    if (useGeneratedQuestions && interviewQuestions.length > 0) {
      const nextIndex = (currentQuestionIndex + 1) % interviewQuestions.length
      setCurrentQuestionIndex(nextIndex)
      setCurrentQuestion(interviewQuestions[nextIndex].question)
    } else {
      const currentIndex = sampleQuestions.indexOf(currentQuestion)
      const nextIndex = (currentIndex + 1) % sampleQuestions.length
      setCurrentQuestion(sampleQuestions[nextIndex])
    }
  }

  const handleSwitchToSampleQuestions = () => {
    setUseGeneratedQuestions(false)
    setCurrentQuestion(sampleQuestions[0])
    setCurrentQuestionIndex(0)
    setSelectedInterviewId('')
    setSelectedInterview(null)
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
              Practice your interview skills with realistic questions
            </p>
          </div>
        </div>

        {interviews.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Select Question Set</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm mb-2">Practice with your generated interview questions:</p>
                  <Select
                    value={selectedInterviewId}
                    onValueChange={setSelectedInterviewId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an interview question set" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="max-h-[300px] overflow-y-auto">
                      {interviews.filter((interview, index, self) => 
                        // Filter out duplicates based on ID
                        index === self.findIndex((i) => i.id === interview.id)
                      ).map((interview) => (
                        <SelectItem key={interview.id} value={interview.id.toString()}>
                          {interview.title || interview.job_title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {!useGeneratedQuestions && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm">Currently using: Default sample questions</p>
                  </div>
                )}
                
                {useGeneratedQuestions && selectedInterview && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm">Currently using: <span className="font-medium">{selectedInterview.title || selectedInterview.job_title}</span> ({interviewQuestions.length} questions)</p>
                    <Button variant="ghost" size="sm" onClick={handleSwitchToSampleQuestions}>
                      Use sample questions instead
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <p className="text-sm text-gray-500">Don't see your questions?</p>
              <Link href="/interview/create">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <FileQuestion size={16} />
                  Create New Question Set
                  <ChevronRight size={16} />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        )}

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
                    {useGeneratedQuestions && interviewQuestions.length > 0 && currentQuestionIndex < interviewQuestions.length && (
                      <div className="mt-2 text-xs text-indigo-500">
                        <span className="font-semibold">Type:</span> {interviewQuestions[currentQuestionIndex].question_type} | 
                        <span className="font-semibold ml-2">Difficulty:</span> {interviewQuestions[currentQuestionIndex].difficulty || 'Medium'}
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex justify-between">
                    <span className="text-sm text-gray-500">
                      {useGeneratedQuestions 
                        ? `Question ${currentQuestionIndex + 1} of ${interviewQuestions.length}`
                        : `Sample Question ${sampleQuestions.indexOf(currentQuestion) + 1} of ${sampleQuestions.length}`}
                    </span>
                    <Button 
                      variant="outline"
                      onClick={handleNextQuestion}
                    >
                      Next Question
                    </Button>
                  </div>
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
                    <Button
                      onClick={startRecording}
                      className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500"
                    >
                      <VideoCameraIcon className="h-5 w-5" />
                      Start Recording
                    </Button>
                  )}

                  {isRecording && (
                    <Button
                      onClick={stopRecording}
                      className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-500"
                    >
                      <StopIcon className="h-5 w-5" />
                      Stop Recording ({formatDuration(duration)})
                    </Button>
                  )}

                  {videoUrl && !isRecording && (
                    <Button
                      onClick={startRecording}
                      className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500"
                    >
                      <VideoCameraIcon className="h-5 w-5" />
                      Record Again
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="rounded-lg bg-white p-6 shadow">
              <h4 className="text-sm font-medium text-gray-900">Interview Tips</h4>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-gray-600">
                <li>Research the company before your interview</li>
                <li>Practice your answers to common questions</li>
                <li>Use the STAR method for behavioral questions</li>
                <li>Prepare thoughtful questions to ask the interviewer</li>
                <li>Follow up with a thank-you note after the interview</li>
              </ul>
            </div>
          </div>

          <div>
            <div className="rounded-lg bg-white p-6 shadow h-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Practice Instructions
              </h3>
              <div className="space-y-4 text-gray-600">
                <p>1. Select a question set from the dropdown or use the default sample questions.</p>
                <p>2. Record yourself answering each question as if you were in a real interview.</p>
                <p>3. Review your recordings to identify areas for improvement.</p>
                <p>4. Practice regularly to build confidence and improve your responses.</p>
                <p>5. Try different approaches to find what works best for you.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
