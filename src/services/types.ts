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
