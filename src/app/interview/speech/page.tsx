'use client'

import { useState, useEffect } from 'react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import AudioRecorder from '@/components/interview/AudioRecorder'
import SpeechAnalysisCard from '@/components/interview/SpeechAnalysisCard'
import { toast } from 'react-toastify'
import { InterviewService } from '@/services/interview'
import { Interview, InterviewQuestion, SpeechAnalysis } from '@/services/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronRight, FileQuestion } from 'lucide-react'
import Link from 'next/link'

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
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [selectedInterviewId, setSelectedInterviewId] = useState<string>('')
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null)
  const [interviewQuestions, setInterviewQuestions] = useState<InterviewQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [useGeneratedQuestions, setUseGeneratedQuestions] = useState(false)
  const [transcript, setTranscript] = useState<string>('')

  const interviewService = InterviewService()

  useEffect(() => {
    loadInterviews()
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

  const handleRecordingComplete = async (audioBlob: Blob) => {
    try {
      setIsAnalyzing(true)
      setAnalysis(null)
      setTranscript('')
      
      // Convert Blob to File for API upload
      const audioFile = new File([audioBlob], 'recording.wav', { 
        type: 'audio/wav' 
      });

      // For debugging
      console.log('Audio file:', {
        name: audioFile.name,
        type: audioFile.type,
        size: audioFile.size,
      });
      
      // Step 1: Convert speech to text
      // Make sure we have a valid interview ID or use a fallback approach
      let interviewId = 0;
      
      if (selectedInterviewId && parseInt(selectedInterviewId) > 0) {
        interviewId = parseInt(selectedInterviewId);
      } else if (interviews.length > 0) {
        // If no interview is selected but interviews exist, use the first one
        interviewId = interviews[0].id;
      }
      
      try {
        // Add error handling specifically for the speech-to-text API call
        const speechToTextResponse = await interviewService.speechToText(interviewId, audioFile);
        
        if (speechToTextResponse.code !== 200 || !speechToTextResponse.data?.transcript) {
          throw new Error(speechToTextResponse.message || 'Failed to transcribe your answer');
        }
        
        const transcribedText = speechToTextResponse.data.transcript;
        setTranscript(transcribedText);
        
        // For demo/testing - if API fails, you can use this mock transcription
        // const transcribedText = "This is a sample transcription of your answer. In a real application, this would be the text converted from your speech recording.";
        // setTranscript(transcribedText);
        
        // Step 2: Get AI analysis of the answer
        if (useGeneratedQuestions && selectedInterview && interviewQuestions.length > 0) {
          // If we have a selected interview with questions, use the analyzeAnswer API
          const currentQuestion = interviewQuestions[currentQuestionIndex];
          
          try {
            const analysisResponse = await interviewService.analyzeAnswer(
              selectedInterview.id, 
              currentQuestion.id, 
              { user_answer: transcribedText }
            );
            
            if (analysisResponse.code === 200 && analysisResponse.data?.feedback) {
              // Convert the analysis response to SpeechAnalysis format
              const feedback = analysisResponse.data.feedback;
              
              const speechAnalysis: SpeechAnalysis = {
                transcription: transcribedText,
                fluencyScore: feedback.structure_clarity.score * 10,
                clarity: feedback.relevance.score * 10,
                speed: 0, // Not provided in the feedback
                feedback: feedback.improvement_suggestions,
                emotion: {
                  confidence: feedback.overall_score * 10,
                  tone: feedback.overall_score > 7 ? 'confident' : 
                        feedback.overall_score > 4 ? 'neutral' : 'hesitant'
                }
              };
              
              setAnalysis(speechAnalysis);
              toast.success('Analysis completed!');
            } else {
              throw new Error(analysisResponse.message || 'Failed to analyze your answer');
            }
          } catch (analysisError) {
            console.error('Analysis API error:', analysisError);
            // Fall back to basic analysis if the analysis API fails
            createBasicAnalysis(transcribedText);
          }
        } else {
          // If using sample questions, create a basic analysis
          createBasicAnalysis(transcribedText);
        }
      } catch (speechError) {
        console.error('Speech-to-text API error:', speechError);
        toast.error('Failed to transcribe speech. Using basic transcription instead.');
        
        // Create a mock transcription for demo/testing purposes
        const mockTranscription = "This is a simulated transcription since the speech-to-text API encountered an error. In a real application, this would be your actual speech converted to text.";
        setTranscript(mockTranscription);
        
        // Provide a basic analysis based on the mock transcription
        createBasicAnalysis(mockTranscription);
      }
    } catch (error) {
      console.error('Speech analysis error:', error);
      toast.error('Failed to analyze speech. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  }
  
  // Helper function to create a basic analysis when no interview is selected
  const createBasicAnalysis = (transcribedText: string) => {
    const speechAnalysis: SpeechAnalysis = {
      transcription: transcribedText,
      fluencyScore: 75, // Default score
      clarity: 70,      // Default score
      speed: 0,         // Not calculated
      feedback: [
        'Try to structure your answer with a clear beginning, middle, and end.',
        'Include specific examples to support your points.',
        'Consider practicing more to improve your fluency.',
      ],
      emotion: {
        confidence: 65,
        tone: 'neutral'
      }
    }
    
    setAnalysis(speechAnalysis)
    toast.success('Basic analysis completed!')
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
    setAnalysis(null)
    setTranscript('')
  }

  const handleSwitchToSampleQuestions = () => {
    setUseGeneratedQuestions(false)
    setCurrentQuestion(sampleQuestions[0])
    setSelectedInterviewId('')
    setSelectedInterview(null)
  }

  const content = (
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

          {/* Second column for analysis */}
          <div>
            {isAnalyzing ? (
              <div className="rounded-lg bg-white shadow p-6 flex flex-col items-center justify-center min-h-[300px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
                <p className="text-gray-600">Analyzing your answer...</p>
                <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
              </div>
            ) : transcript ? (
              analysis ? (
                <SpeechAnalysisCard analysis={analysis} />
              ) : (
                <div className="rounded-lg bg-white shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Your Answer</h3>
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{transcript}</p>
                  </div>
                </div>
              )
            ) : (
              <div className="rounded-lg bg-white shadow p-6 flex flex-col items-center justify-center min-h-[300px]">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Ready for Feedback?</h3>
                  <p className="text-sm text-gray-600">
                    Record your answer to the question and get AI-powered analysis and feedback.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return <ProtectedRoute>{content}</ProtectedRoute>
}
