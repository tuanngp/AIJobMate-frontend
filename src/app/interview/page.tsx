'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Interview } from '@/services/types';
import { InterviewService } from '@/services/interview';
import Link from 'next/link';
import { Plus, Trash2, Mic, Video } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/utils/date';

export default function InterviewPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const interviewService = InterviewService();
  const { toast } = useToast();

  useEffect(() => {
    loadInterviews();
  }, []);

  const loadInterviews = async () => {
    setLoading(true);
    try {
      const response = await interviewService.getInterviews();
      if (response.code === 200) {
        setInterviews(response.data);
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to load interviews',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load interviews',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await interviewService.deleteInterview(id);
      if (response.code === 200) {
        toast({
          title: 'Success',
          description: 'Interview deleted successfully',
        });
        setInterviews(interviews.filter(interview => interview.id !== id));
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to delete interview',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete interview',
        variant: 'destructive',
      });
    }
  };

  const getDifficultyColor = (level: string) => {
    switch(level.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Interview Hub</h1>
        <p className="text-gray-600 mb-6">Choose how you want to practice for your interviews</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Generate Interview Questions</CardTitle>
              <CardDescription>Create custom interview questions based on job positions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Get AI-generated questions tailored to specific job roles, industries, and difficulty levels.</p>
            </CardContent>
            <CardFooter>
              <Link href="/interview/create" className="w-full">
                <Button className="w-full flex items-center gap-2">
                  <Plus size={16} />
                  Create New Interview
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Speech Practice</CardTitle>
              <CardDescription>Practice with voice recording and feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Record your answers to interview questions and receive AI feedback on your responses.</p>
            </CardContent>
            <CardFooter>
              <Link href="/interview/speech" className="w-full">
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <Mic size={16} />
                  Practice with Speech
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Video Interview</CardTitle>
              <CardDescription>Practice with video recording and analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Record video responses and receive feedback on body language and presentation skills.</p>
            </CardContent>
            <CardFooter>
              <Link href="/interview/video" className="w-full">
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <Video size={16} />
                  Practice with Video
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Interview Question Sets</h2>
        <Link href="/interview/create">
          <Button className="flex items-center gap-2">
            <Plus size={16} />
            New Question Set
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : interviews.length === 0 ? (
        <div className="text-center p-10 border rounded-lg bg-gray-50">
          <h3 className="text-xl font-semibold">No question sets yet</h3>
          <p className="text-gray-500 mt-2">Get started by creating your first interview question set</p>
          <Link href="/interview/create">
            <Button className="mt-4">Create Question Set</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviews.map((interview) => (
            <Card key={interview.id} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl truncate">{interview.title}</CardTitle>
                <CardDescription className="flex gap-2 flex-wrap mt-2">
                  <Badge variant="outline" className={getDifficultyColor(interview.difficulty_level)}>
                    {interview.difficulty_level}
                  </Badge>
                  <Badge variant="outline">{interview.interview_type}</Badge>
                  <Badge variant="outline">{interview.status}</Badge>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">Job Title: {interview.job_title}</p>
                <p className="text-sm text-gray-500">Created: {formatDate(interview.created_at)}</p>
                <p className="text-sm text-gray-500">Questions: {interview.questions?.length || 0}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href={`/interview/${interview.id}`}>
                  <Button variant="outline">View Questions</Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(interview.id)}
                >
                  <Trash2 size={18} />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 