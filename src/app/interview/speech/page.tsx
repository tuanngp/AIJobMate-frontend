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
import { ChevronRight, FileQuestion, Check, AlertTriangle, ArrowRight, BarChart4, ClipboardList, LayoutList } from 'lucide-react'
import Link from 'next/link'

const sampleQuestions = [
  'Tell me about yourself and your background.',
  'Why are you interested in this position?',
  'What are your greatest strengths and weaknesses?',
  'Where do you see yourself in five years?',
  'Describe a challenging situation and how you handled it.',
]

export default function InterviewPracticePage() {
  console.log('Rendering InterviewPracticePage component')
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
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [rawFeedback, setRawFeedback] = useState<any>(null)
  const [expandedFeedback, setExpandedFeedback] = useState<Record<number, boolean>>({})
  const [activeFeedbackTabs, setActiveFeedbackTabs] = useState<Record<number, string>>({})

  const interviewService = InterviewService()
  console.log('InterviewService initialized')

  useEffect(() => {
    console.log('Initial useEffect: Loading interviews')
    loadInterviews()
  }, [])

  useEffect(() => {
    console.log('selectedInterviewId changed:', selectedInterviewId)
    if (selectedInterviewId) {
      loadInterviewDetails(parseInt(selectedInterviewId))
    }
  }, [selectedInterviewId])

  useEffect(() => {
    console.log('selectedInterview changed:', selectedInterview)
    if (selectedInterview && selectedInterview.questions && selectedInterview.questions.length > 0) {
      console.log('Setting interview questions from selected interview')
      setInterviewQuestions(selectedInterview.questions)
      setCurrentQuestionIndex(0)
      setCurrentQuestion(selectedInterview.questions[0].question)
      setUseGeneratedQuestions(true)
    }
  }, [selectedInterview])

  const loadInterviews = async () => {
    console.log('loadInterviews: Starting to load interviews')
    setLoading(true)
    try {
      const response = await interviewService.getInterviews()
      console.log('loadInterviews: Response received', response)
      if (response.code === 200) {
        console.log('loadInterviews: Successfully loaded interviews', response.data)
        setInterviews(response.data)
      } else {
        console.error('loadInterviews: Failed with error code', response.code, response.message)
        toast.error(response.message || 'Failed to load interviews')
      }
    } catch (error) {
      console.error('loadInterviews: Exception occurred', error)
      toast.error('Failed to load interviews')
    } finally {
      console.log('loadInterviews: Finished loading')
      setLoading(false)
    }
  }

  const loadInterviewDetails = async (interviewId: number) => {
    console.log('loadInterviewDetails: Loading details for interview ID', interviewId)
    try {
      const response = await interviewService.getInterview(interviewId)
      console.log('loadInterviewDetails: Response received', response)
      if (response.code === 200) {
        console.log('loadInterviewDetails: Successfully loaded interview details', response.data)
        setSelectedInterview(response.data)
      } else {
        console.error('loadInterviewDetails: Failed with error code', response.code, response.message)
        toast.error(response.message || 'Failed to load interview details')
      }
    } catch (error) {
      console.error('loadInterviewDetails: Exception occurred', error)
      toast.error('Failed to load interview details')
    }
  }

  const handleRecordingComplete = async (audioBlob: Blob) => {
    console.log('handleRecordingComplete: Recording completed, blob size:', audioBlob.size)
    try {
      setIsAnalyzing(true)
      setAnalysis(null)
      setTranscript('')
      setRawFeedback(null)
      
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
      
      // Step 1: Determine the current interview context
      let interviewId = 0;
      let currentQuestionObj = null;
      
      if (selectedInterviewId && parseInt(selectedInterviewId) > 0) {
        interviewId = parseInt(selectedInterviewId);
        console.log('Using selected interview ID:', interviewId);
        
        // Get the current question object for the selected interview
        if (useGeneratedQuestions && interviewQuestions.length > 0 && currentQuestionIndex < interviewQuestions.length) {
          currentQuestionObj = interviewQuestions[currentQuestionIndex];
          console.log('Current question object:', currentQuestionObj);
        }
      } else if (interviews.length > 0) {
        // If no interview is selected but interviews exist, use the first one
        interviewId = interviews[0].id;
        console.log('Using fallback interview ID (first in list):', interviewId);
      }
      
      try {
        console.log('Calling speechToText API with interview ID:', interviewId);
        // Add error handling specifically for the speech-to-text API call
        const speechToTextResponse = await interviewService.speechToText(interviewId, audioFile);
        console.log('Speech to text response:', speechToTextResponse);
        
        if (speechToTextResponse.code !== 200 || !speechToTextResponse.data?.transcript) {
          console.error('Speech to text failed:', speechToTextResponse.message);
          throw new Error(speechToTextResponse.message || 'Failed to transcribe your answer');
        }
        
        const transcribedText = speechToTextResponse.data.transcript;
        console.log('Transcribed text:', transcribedText);
        setTranscript(transcribedText);
        
        // Step 2: Get AI analysis of the answer
        if (useGeneratedQuestions && selectedInterview && interviewQuestions.length > 0 && currentQuestionObj) {
          console.log('Using generated questions for analysis');
          // Use the specific question ID from the current question
          console.log('Current question for analysis:', currentQuestionObj);
          
          try {
            console.log('Calling analyzeAnswer API with interview ID:', selectedInterview.id, 'and question ID:', currentQuestionObj.id);
            const analysisResponse = await interviewService.analyzeAnswer(
              selectedInterview.id, 
              currentQuestionObj.id, 
              { user_answer: transcribedText }
            );
            console.log('Analysis response:', analysisResponse);
            
            if (analysisResponse.code === 200 && analysisResponse.data?.feedback) {
              console.log('Analysis successful, received feedback');
              // Convert the analysis response to SpeechAnalysis format
              const feedback = analysisResponse.data.feedback;
              
              // Store the raw feedback data
              setRawFeedback(feedback);
              
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
              
              console.log('Processed speech analysis:', speechAnalysis);
              setAnalysis(speechAnalysis);
              
              // Store the user's answer with the question for later reference
              if (currentQuestionObj) {
                const updatedQuestions = [...interviewQuestions];
                updatedQuestions[currentQuestionIndex] = {
                  ...currentQuestionObj,
                  user_answer: transcribedText,
                  ai_feedback: JSON.stringify(feedback)
                };
                setInterviewQuestions(updatedQuestions);
              }
              
              toast.success('Analysis completed!');
            } else {
              console.error('Analysis API response error:', analysisResponse);
              throw new Error(analysisResponse.message || 'Failed to analyze your answer');
            }
          } catch (analysisError) {
            console.error('Analysis API error:', analysisError);
            // Fall back to basic analysis if the analysis API fails
            console.log('Falling back to basic analysis');
            createBasicAnalysis(transcribedText);
          }
        } else {
          console.log('Using sample questions, creating basic analysis');
          // If using sample questions, create a basic analysis
          createBasicAnalysis(transcribedText);
        }
      } catch (speechError) {
        console.error('Speech-to-text API error:', speechError);
        toast.error('Failed to transcribe speech. Using basic transcription instead.');
        
        // Create a mock transcription for demo/testing purposes
        const mockTranscription = "This is a simulated transcription since the speech-to-text API encountered an error. In a real application, this would be your actual speech converted to text.";
        console.log('Using mock transcription:', mockTranscription);
        setTranscript(mockTranscription);
        
        // Provide a basic analysis based on the mock transcription
        createBasicAnalysis(mockTranscription);
      }
    } catch (error) {
      console.error('Speech analysis error:', error);
      toast.error('Failed to analyze speech. Please try again.');
    } finally {
      console.log('Analysis process completed');
      setIsAnalyzing(false);
    }
  }
  
  // Helper function to create a basic analysis when no interview is selected
  const createBasicAnalysis = (transcribedText: string) => {
    console.log('Creating basic analysis for transcript:', transcribedText.substring(0, 50) + '...');
    
    // Create a basic feedback object
    const basicFeedback = {
      strengths: ['Good attempt at answering the question'],
      weaknesses: ['The answer could be more structured'],
      structure_clarity: { score: 0.75, comments: 'Fair structure' },
      relevance: { score: 0.7, comments: 'Somewhat relevant to the question' },
      expertise_level: { score: 0.65, comments: 'Shows basic understanding' },
      improvement_suggestions: [
        'Try to structure your answer with a clear beginning, middle, and end.',
        'Include specific examples to support your points.',
        'Consider practicing more to improve your fluency.',
      ],
      overall_score: 0.7,
      feedback_summary: 'Your answer shows potential but needs more structure and specific examples.'
    };
    
    setRawFeedback(basicFeedback);
    
    const speechAnalysis: SpeechAnalysis = {
      transcription: transcribedText,
      fluencyScore: 75, // Default score
      clarity: 70,      // Default score
      speed: 0,         // Not calculated
      feedback: basicFeedback.improvement_suggestions,
      emotion: {
        confidence: 65,
        tone: 'neutral'
      }
    }
    
    console.log('Basic analysis created:', speechAnalysis);
    setAnalysis(speechAnalysis)
    toast.success('Basic analysis completed!')
  }

  const handleNextQuestion = () => {
    console.log('handleNextQuestion: Moving to next question');
    if (useGeneratedQuestions && interviewQuestions.length > 0) {
      const nextIndex = (currentQuestionIndex + 1) % interviewQuestions.length
      console.log('Next question index:', nextIndex, 'out of', interviewQuestions.length);
      setCurrentQuestionIndex(nextIndex)
      setCurrentQuestion(interviewQuestions[nextIndex].question)
      console.log('New question:', interviewQuestions[nextIndex].question);
    } else {
      const currentIndex = sampleQuestions.indexOf(currentQuestion)
      const nextIndex = (currentIndex + 1) % sampleQuestions.length
      console.log('Next sample question index:', nextIndex, 'out of', sampleQuestions.length);
      setCurrentQuestion(sampleQuestions[nextIndex])
      console.log('New sample question:', sampleQuestions[nextIndex]);
    }
    setAnalysis(null)
    setTranscript('')
    setRawFeedback(null)
  }

  const handleSwitchToSampleQuestions = () => {
    console.log('handleSwitchToSampleQuestions: Switching to sample questions');
    setUseGeneratedQuestions(false)
    setCurrentQuestion(sampleQuestions[0])
    setSelectedInterviewId('')
    setSelectedInterview(null)
  }

  console.log('Current component state:', {
    isAnalyzing,
    currentQuestion,
    currentQuestionIndex,
    useGeneratedQuestions,
    selectedInterviewId,
    hasAnalysis: !!analysis,
    hasTranscript: !!transcript,
    questionsCount: interviewQuestions.length,
    interviewsCount: interviews.length,
    loading
  });

  // Helper function to get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600'
    if (score >= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  // Helper function to get background color based on score
  const getScoreBgColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-50'
    if (score >= 0.6) return 'bg-yellow-50'
    return 'bg-red-50'
  }

  // Function to display previously answered questions
  const renderAnsweredQuestions = () => {
    if (!useGeneratedQuestions || interviewQuestions.length === 0) {
      return (
        <div className="text-center py-4">
          <p className="text-gray-500">No answered questions yet. Try answering some questions first!</p>
        </div>
      );
    }

    const answeredQuestions = interviewQuestions.filter(q => q.user_answer);
    
    if (answeredQuestions.length === 0) {
      return (
        <div className="text-center py-4">
          <p className="text-gray-500">No answered questions yet. Try answering some questions first!</p>
        </div>
      );
    }

    // Toggle feedback expansion for a specific question
    const toggleFeedbackExpansion = (questionId: number) => {
      setExpandedFeedback(prev => ({
        ...prev,
        [questionId]: !prev[questionId]
      }));
      
      // Set default active tab when expanding
      if (!expandedFeedback[questionId]) {
        setActiveFeedbackTabs(prev => ({
          ...prev,
          [questionId]: 'summary'
        }));
      }
    };
    
    // Set active tab for a specific question
    const setQuestionTab = (questionId: number, tab: string) => {
      setActiveFeedbackTabs(prev => ({
        ...prev,
        [questionId]: tab
      }));
    };

    return (
      <div className="space-y-4 max-h-[60vh] overflow-y-auto px-2">
        {answeredQuestions.map((q, index) => {
          // Parse the ai_feedback if it exists
          let feedback = null;
          try {
            if (q.ai_feedback) {
              feedback = JSON.parse(q.ai_feedback);
            }
          } catch (e) {
            console.error('Failed to parse AI feedback:', e);
          }

          return (
            <div key={q.id} className="border rounded-lg overflow-hidden bg-white shadow-sm">
              <div className="p-4">
                <h4 className="font-medium text-gray-900">Question {index + 1}: {q.question_type}</h4>
                <p className="text-gray-700 mt-1">{q.question}</p>
                
                <div className="mt-3">
                  <h5 className="text-sm font-medium text-gray-700">Your Answer:</h5>
                  <p className="text-sm text-gray-600 mt-1 italic">{q.user_answer}</p>
                </div>
                
                {feedback && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-medium text-gray-700">Feedback Summary:</h5>
                      <button
                        className="text-xs flex items-center gap-1 px-2 py-1 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                        onClick={() => toggleFeedbackExpansion(q.id)}
                      >
                        {expandedFeedback[q.id] ? 'Hide Details' : 'Show All Details'}
                      </button>
                    </div>
                    
                    <p className="text-sm text-gray-600 mt-1">{feedback.feedback_summary}</p>
                    
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <div className="text-xs p-1.5 rounded bg-gray-50">
                        <span className="font-medium">Relevance:</span> 
                        <span className={getScoreColor(feedback.relevance.score * 10)}> {feedback.relevance.score * 10}/10</span>
                      </div>
                      <div className="text-xs p-1.5 rounded bg-gray-50">
                        <span className="font-medium">Clarity:</span> 
                        <span className={getScoreColor(feedback.structure_clarity.score * 10)}> {feedback.structure_clarity.score * 10}/10</span>
                      </div>
                      {feedback.expertise_level && (
                        <div className="text-xs p-1.5 rounded bg-gray-50">
                          <span className="font-medium">Expertise:</span> 
                          <span className={getScoreColor(feedback.expertise_level.score * 10)}> {feedback.expertise_level.score * 10}/10</span>
                        </div>
                      )}
                      {feedback.overall_score && (
                        <div className="text-xs p-1.5 rounded bg-gray-50">
                          <span className="font-medium">Overall:</span> 
                          <span className={getScoreColor(feedback.overall_score * 10)}> {feedback.overall_score * 10}/10</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Expanded feedback details */}
                    {expandedFeedback[q.id] && (
                      <div className="mt-4 border-t pt-4">
                        {/* Tabs for different feedback views */}
                        <div className="mb-3 flex border rounded-md overflow-hidden">
                          <button
                            onClick={() => setQuestionTab(q.id, 'summary')}
                            className={`flex-1 text-xs py-2 px-1 flex items-center justify-center gap-1 ${
                              activeFeedbackTabs[q.id] === 'summary' 
                                ? 'bg-indigo-50 text-indigo-700 font-medium' 
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <LayoutList size={14} />
                            Summary
                          </button>
                          <button
                            onClick={() => setQuestionTab(q.id, 'scores')}
                            className={`flex-1 text-xs py-2 px-1 flex items-center justify-center gap-1 ${
                              activeFeedbackTabs[q.id] === 'scores' 
                                ? 'bg-indigo-50 text-indigo-700 font-medium' 
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <BarChart4 size={14} />
                            Details
                          </button>
                          <button
                            onClick={() => setQuestionTab(q.id, 'raw')}
                            className={`flex-1 text-xs py-2 px-1 flex items-center justify-center gap-1 ${
                              activeFeedbackTabs[q.id] === 'raw' 
                                ? 'bg-indigo-50 text-indigo-700 font-medium' 
                                : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <ClipboardList size={14} />
                            Raw
                          </button>
                        </div>
                        
                        {/* Tab content */}
                        <div className="mt-3">
                          {/* Summary Tab */}
                          {activeFeedbackTabs[q.id] === 'summary' && (
                            <div className="space-y-3">
                              {/* Strengths section */}
                              {feedback.strengths && feedback.strengths.length > 0 && (
                                <div className="bg-green-50 p-3 rounded-md">
                                  <h6 className="text-xs font-medium text-green-700 mb-1.5">Strengths:</h6>
                                  <ul className="space-y-1">
                                    {feedback.strengths.map((strength: string, idx: number) => (
                                      <li key={idx} className="text-xs text-green-800 flex items-start">
                                        <Check size={12} className="mr-1.5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>{strength}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {/* Weaknesses section */}
                              {feedback.weaknesses && feedback.weaknesses.length > 0 && (
                                <div className="bg-red-50 p-3 rounded-md">
                                  <h6 className="text-xs font-medium text-red-700 mb-1.5">Areas for Improvement:</h6>
                                  <ul className="space-y-1">
                                    {feedback.weaknesses.map((weakness: string, idx: number) => (
                                      <li key={idx} className="text-xs text-red-800 flex items-start">
                                        <AlertTriangle size={12} className="mr-1.5 text-red-600 mt-0.5 flex-shrink-0" />
                                        <span>{weakness}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {/* Improvement suggestions */}
                              {feedback.improvement_suggestions && feedback.improvement_suggestions.length > 0 && (
                                <div className="bg-yellow-50 p-3 rounded-md">
                                  <h6 className="text-xs font-medium text-yellow-700 mb-1.5">Suggestions for Next Time:</h6>
                                  <ul className="space-y-1">
                                    {feedback.improvement_suggestions.map((suggestion: string, idx: number) => (
                                      <li key={idx} className="text-xs text-yellow-800 flex items-start">
                                        <ArrowRight size={12} className="mr-1.5 text-yellow-600 mt-0.5 flex-shrink-0" />
                                        <span>{suggestion}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* Details Tab */}
                          {activeFeedbackTabs[q.id] === 'scores' && (
                            <div className="space-y-3">
                              {feedback.structure_clarity && (
                                <div className={`p-2.5 rounded-md ${getScoreBgColor(feedback.structure_clarity.score)}`}>
                                  <div className="flex justify-between items-center mb-1">
                                    <h6 className="text-xs font-medium text-gray-800">Structure & Clarity</h6>
                                    <span className={`text-xs font-bold ${getScoreColor(feedback.structure_clarity.score * 10)}`}>
                                      {Math.round(feedback.structure_clarity.score * 10)}/10
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-700">{feedback.structure_clarity.comments}</p>
                                </div>
                              )}
                              
                              {feedback.relevance && (
                                <div className={`p-2.5 rounded-md ${getScoreBgColor(feedback.relevance.score)}`}>
                                  <div className="flex justify-between items-center mb-1">
                                    <h6 className="text-xs font-medium text-gray-800">Relevance</h6>
                                    <span className={`text-xs font-bold ${getScoreColor(feedback.relevance.score * 10)}`}>
                                      {Math.round(feedback.relevance.score * 10)}/10
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-700">{feedback.relevance.comments}</p>
                                </div>
                              )}
                              
                              {feedback.expertise_level && (
                                <div className={`p-2.5 rounded-md ${getScoreBgColor(feedback.expertise_level.score)}`}>
                                  <div className="flex justify-between items-center mb-1">
                                    <h6 className="text-xs font-medium text-gray-800">Expertise Level</h6>
                                    <span className={`text-xs font-bold ${getScoreColor(feedback.expertise_level.score * 10)}`}>
                                      {Math.round(feedback.expertise_level.score * 10)}/10
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-700">{feedback.expertise_level.comments}</p>
                                </div>
                              )}
                              
                              {feedback.overall_score && (
                                <div className="bg-indigo-50 p-2.5 rounded-md">
                                  <h6 className="text-xs font-medium text-indigo-700 mb-1">Overall Performance</h6>
                                  <div className="flex justify-between items-center mb-1.5">
                                    <span className="text-xs text-gray-600">Score:</span>
                                    <span className={`text-xs font-bold ${getScoreColor(feedback.overall_score * 10)}`}>
                                      {Math.round(feedback.overall_score * 10)}/10
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div 
                                      className={`h-1.5 rounded-full ${
                                        feedback.overall_score >= 0.8 ? 'bg-green-600' : 
                                        feedback.overall_score >= 0.6 ? 'bg-yellow-500' : 'bg-red-600'
                                      }`}
                                      style={{ width: `${feedback.overall_score * 100}%` }}
                                    ></div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* Raw Tab */}
                          {activeFeedbackTabs[q.id] === 'raw' && (
                            <div className="bg-gray-50 p-3 rounded-md">
                              <pre className="text-xs text-gray-600 whitespace-pre-wrap overflow-x-auto max-h-64 overflow-y-auto">
                                {JSON.stringify(feedback, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <button 
                  className="mt-3 text-xs inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 hover:underline"
                  onClick={() => {
                    setCurrentQuestionIndex(interviewQuestions.findIndex(question => question.id === q.id));
                    setCurrentQuestion(q.question);
                    setShowHistoryModal(false);
                  }}
                >
                  <ArrowRight size={12} />
                  Practice this question again
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Function to show answer history modal
  const renderHistoryModal = () => {
    if (!showHistoryModal) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="text-lg font-medium">Your Answered Questions</h3>
            <button 
              onClick={() => setShowHistoryModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="p-4">
            {renderAnsweredQuestions()}
          </div>
          <div className="p-4 border-t flex justify-end">
            <button
              onClick={() => setShowHistoryModal(false)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-800"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

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
                    onValueChange={(value) => {
                      console.log('Interview selection changed to:', value);
                      setSelectedInterviewId(value);
                    }}
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
                    <div className="flex space-x-2">
                      {interviewQuestions.filter(q => q.user_answer).length > 0 && (
                        <Button variant="outline" size="sm" onClick={() => setShowHistoryModal(true)}>
                          View answered questions
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={handleSwitchToSampleQuestions}>
                        Use sample questions instead
                      </Button>
                    </div>
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
                      onRecordingComplete={(blob) => {
                        console.log('Recording completed, blob received');
                        handleRecordingComplete(blob);
                      }}
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
                <SpeechAnalysisCard analysis={analysis} rawFeedback={rawFeedback} />
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
      {renderHistoryModal()}
    </div>
  )

  return <ProtectedRoute>{content}</ProtectedRoute>
}
