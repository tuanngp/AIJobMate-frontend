'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { InterviewService } from '@/services/interview';
import { useToast } from '@/components/ui/use-toast';
import { Interview, InterviewQuestion, AnalysisResponse } from '@/services/types';
import { ArrowLeft, ChevronDown, ChevronUp, Mic, Send } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { formatDate } from '@/utils/date';

export default function InterviewDetailPage() {
  const params = useParams();
  const router = useRouter();
  const interviewId = parseInt(params.id as string);
  const interviewService = InterviewService();
  const { toast } = useToast();

  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedQuestions, setExpandedQuestions] = useState<Record<number, boolean>>({});
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [answerAnalysis, setAnswerAnalysis] = useState<Record<number, AnalysisResponse>>({});
  const [analyzingQuestion, setAnalyzingQuestion] = useState<number | null>(null);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  useEffect(() => {
    if (isNaN(interviewId)) {
      router.push('/interview');
      return;
    }
    loadInterview();
  }, [interviewId]);

  const loadInterview = async () => {
    setLoading(true);
    try {
      const response = await interviewService.getInterview(interviewId);
      if (response.code === 200) {
        const interviewData = response.data;
        setInterview(interviewData);

        // Initialize expanded state for all questions
        const expandedState: Record<number, boolean> = {};
        interviewData.questions?.forEach((q) => {
          expandedState[q.id] = false;
          if (q.user_answer) {
            setUserAnswers(prev => ({ ...prev, [q.id]: q.user_answer || '' }));
          }
          if (q.ai_feedback) {
            try {
              const feedback = JSON.parse(q.ai_feedback);
              setAnswerAnalysis(prev => ({
                ...prev,
                [q.id]: {
                  question_id: q.id,
                  feedback,
                  question: q.question,
                  question_type: q.question_type
                }
              }));
            } catch (e) {
              console.error("Failed to parse AI feedback", e);
            }
          }
        });
        setExpandedQuestions(expandedState);
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to load interview',
          variant: 'destructive',
        });
        router.push('/interview');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load interview',
        variant: 'destructive',
      });
      router.push('/interview');
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestion = (questionId: number) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const submitAnswer = async (questionId: number) => {
    const answer = userAnswers[questionId];
    if (!answer?.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide an answer before submitting',
        variant: 'destructive',
      });
      return;
    }

    setAnalyzingQuestion(questionId);
    try {
      const response = await interviewService.analyzeAnswer(interviewId, questionId, {
        user_answer: answer
      });

      if (response.code === 200) {
        setAnswerAnalysis(prev => ({
          ...prev,
          [questionId]: response.data
        }));
        toast({
          title: 'Success',
          description: 'Answer analyzed successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to analyze answer',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to analyze answer',
        variant: 'destructive',
      });
    } finally {
      setAnalyzingQuestion(null);
    }
  };

  const startRecording = async (questionId: number) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        try {
          const response = await interviewService.speechToText(interviewId, new File([audioBlob], 'recording.webm'));
          if (response.code === 200 && response.data.transcript) {
            setUserAnswers(prev => ({
              ...prev,
              [questionId]: response.data.transcript
            }));
          } else {
            toast({
              title: 'Error',
              description: 'Failed to transcribe audio',
              variant: 'destructive',
            });
          }
        } catch (error) {
          toast({
            title: 'Error',
            description: 'Failed to process audio',
            variant: 'destructive',
          });
        }
        setRecording(false);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not access microphone',
        variant: 'destructive',
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && recording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setMediaRecorder(null);
    }
  };

  const renderFeedbackScore = (score: number) => {
    let color = 'bg-red-500';
    if (score >= 8) color = 'bg-green-500';
    else if (score >= 5) color = 'bg-yellow-500';
    
    return (
      <div className="space-y-1">
        <Progress value={score * 10} className={`h-2 w-full ${color}`} />
        <p className="text-sm text-right">{score}/10</p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Interview not found</h1>
          <Button onClick={() => router.push('/interview')}>Back to Interviews</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => router.push('/interview')} className="mr-2">
            <ArrowLeft size={16} className="mr-2" /> Back
          </Button>
          <h1 className="text-2xl font-bold">{interview.title}</h1>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Job Title</p>
              <p className="font-medium">{interview.job_title}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Type</p>
              <p className="font-medium">
                <Badge variant="outline">{interview.interview_type}</Badge>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Difficulty</p>
              <p className="font-medium">
                <Badge variant="outline">{interview.difficulty_level}</Badge>
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Created</p>
              <p className="font-medium">{formatDate(interview.created_at)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium">
                <Badge variant="outline">{interview.status}</Badge>
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {interview.questions?.map((question) => (
            <Card key={question.id} className="shadow-sm">
              <CardHeader 
                className="cursor-pointer" 
                onClick={() => toggleQuestion(question.id)}
              >
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">
                    <Badge variant="outline" className="mr-2">{question.question_type}</Badge>
                    <Badge variant="outline" className="mr-2">{question.difficulty}</Badge>
                    {question.category && (
                      <Badge variant="outline" className="mr-2">{question.category}</Badge>
                    )}
                  </CardTitle>
                  {expandedQuestions[question.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
                <CardDescription className="text-base font-medium mt-2">
                  {question.question}
                </CardDescription>
              </CardHeader>
              
              {expandedQuestions[question.id] && (
                <>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="font-medium">Your Answer</p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => recording ? stopRecording() : startRecording(question.id)}
                          className={recording ? "bg-red-100" : ""}
                        >
                          <Mic size={16} className="mr-2" />
                          {recording ? "Stop Recording" : "Record Answer"}
                        </Button>
                      </div>
                      <Textarea
                        placeholder="Type your answer here..."
                        value={userAnswers[question.id] || ''}
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                        rows={5}
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button
                        onClick={() => submitAnswer(question.id)}
                        disabled={analyzingQuestion === question.id}
                      >
                        {analyzingQuestion === question.id ? 'Analyzing...' : 'Submit Answer'}
                        <Send size={16} className="ml-2" />
                      </Button>
                    </div>
                    
                    {answerAnalysis[question.id] && (
                      <div className="border rounded-lg p-4 mt-4 bg-gray-50">
                        <Tabs defaultValue="feedback">
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="feedback">Feedback</TabsTrigger>
                            <TabsTrigger value="scores">Scores</TabsTrigger>
                            <TabsTrigger value="sample">Sample Answer</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="feedback" className="space-y-4">
                            <div>
                              <h4 className="font-semibold text-green-600 mb-2">Strengths</h4>
                              <ul className="list-disc pl-5 space-y-1">
                                {answerAnalysis[question.id].feedback.strengths.map((strength, i) => (
                                  <li key={i}>{strength}</li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-red-600 mb-2">Areas for Improvement</h4>
                              <ul className="list-disc pl-5 space-y-1">
                                {answerAnalysis[question.id].feedback.weaknesses.map((weakness, i) => (
                                  <li key={i}>{weakness}</li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-blue-600 mb-2">Improvement Suggestions</h4>
                              <ul className="list-disc pl-5 space-y-1">
                                {answerAnalysis[question.id].feedback.improvement_suggestions.map((suggestion, i) => (
                                  <li key={i}>{suggestion}</li>
                                ))}
                              </ul>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="scores" className="space-y-4">
                            <div>
                              <h4 className="font-semibold mb-1">Structure & Clarity</h4>
                              {renderFeedbackScore(answerAnalysis[question.id].feedback.structure_clarity.score)}
                              <p className="text-sm text-gray-600 mt-1">{answerAnalysis[question.id].feedback.structure_clarity.comments}</p>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold mb-1">Relevance</h4>
                              {renderFeedbackScore(answerAnalysis[question.id].feedback.relevance.score)}
                              <p className="text-sm text-gray-600 mt-1">{answerAnalysis[question.id].feedback.relevance.comments}</p>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold mb-1">Expertise</h4>
                              {renderFeedbackScore(answerAnalysis[question.id].feedback.expertise_level.score)}
                              <p className="text-sm text-gray-600 mt-1">{answerAnalysis[question.id].feedback.expertise_level.comments}</p>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold mb-1">Overall Score</h4>
                              {renderFeedbackScore(answerAnalysis[question.id].feedback.overall_score)}
                              <p className="text-sm text-gray-600 mt-1">{answerAnalysis[question.id].feedback.feedback_summary}</p>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="sample">
                            <div className="bg-white p-4 border rounded">
                              <h4 className="font-semibold mb-2">Sample Answer</h4>
                              <p className="whitespace-pre-line">{answerAnalysis[question.id].feedback.sample_answer}</p>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                    )}
                  </CardContent>
                </>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 