// Career Types
export interface CareerAdvice {
  suggestions: string[]
  skills: {
    existing: string[]
    recommended: string[]
  }
  jobTitles: string[]
}

export interface JobPreferences {
  desiredRole: string
  industry: string
  location: string
  experienceLevel: string
  expectedSalary: number
}

// Interview Types
export interface SpeechAnalysis {
  transcription: string
  fluencyScore: number
  clarity: number
  speed: number
  feedback: string[]
  emotion: {
    confidence: number
    tone: string
  }
}

export interface VideoAnalysis {
  expressions: {
    confidence: number
    emotion: string
    timestamp: number
  }[]
  bodyLanguage: {
    posture: string
    gestures: string[]
    overallScore: number
  }
  recommendations: string[]
}

export interface InterviewQuestion {
  id: number;
  interview_id: number;
  question: string;
  question_type: string;
  difficulty: string;
  category?: string;
  sample_answer?: string;
  created_at: string;
  ai_feedback?: string;
  user_answer?: string;
}

export interface Interview {
  id: number;
  user_id: number;
  title: string;
  job_title: string;
  job_description?: string;
  industry?: string;
  difficulty_level: string;
  interview_type: string;
  status: string;
  created_at: string;
  updated_at: string;
  questions?: InterviewQuestion[];
}

export interface GenerateQuestionsRequest {
  job_title: string;
  job_description?: string;
  industry?: string;
  difficulty_level: string;
  interview_type: string;
  num_questions?: number;
  skills_required?: string[];
}

export interface GenerateQuestionsResponse {
  interview_id: number;
  title: string;
  job_title: string;
  questions: InterviewQuestion[];
}

export interface FeedbackScore {
  score: number;
  comments: string;
}

export interface CategoryScores {
  content: number;
  delivery: number;
  relevance: number;
  expertise: number;
}

export interface AnswerRequest {
  user_answer: string;
}

export interface AnswerFeedback {
  strengths: string[];
  weaknesses: string[];
  structure_clarity: FeedbackScore;
  relevance: FeedbackScore;
  expertise_level: FeedbackScore;
  improvement_suggestions: string[];
  sample_answer: string;
  category_scores: CategoryScores;
  overall_score: number;
  feedback_summary: string;
}

export interface AnalysisResponse {
  question_id: number;
  feedback: AnswerFeedback;
  question: string;
  question_type: string;
}

// Practice Session Types
export interface PracticeSessionCreate {
  title: string;
  job_title: string;
  interview_type: string;
  difficulty_level: string;
  num_questions: number;
}

export interface PracticeSessionResponse {
  id: number;
  user_id: number;
  title: string;
  job_title: string;
  interview_type: string;
  difficulty_level: string;
  status: string;
  total_questions: number;
  completed_questions: number;
  created_at: string;
  updated_at: string;
}

export interface AnswerRecordingCreate {
  question_id: number;
  audio_data?: string;
  text_answer?: string;
}

export interface AnswerRecordingResponse {
  id: number;
  session_id: number;
  question_id: number;
  answer_text: string;
  feedback: string;
  created_at: string;
}

// Job Types
export interface Job {
  id: string
  title: string
  company: string
  location: string
  salary: {
    min: number
    max: number
    currency: string
  }
  description: string
  requirements: string[]
  matchScore: number
}

export interface SalaryPrediction {
  minimum: number
  maximum: number
  median: number
  currency: string
  factors: {
    name: string
    impact: number
  }[]
}

export interface JobSearchParams {
  skills: string[]
  experience: number
  location: string
  jobType: string
}
