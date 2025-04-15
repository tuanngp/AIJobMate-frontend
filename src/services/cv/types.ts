export interface CvInfo {
  file_name: string;
  file_type: string;
  id: number;
  analysis_status: string;
  analysis_error: string;
  last_analyzed_at: string;
  created_at: string;
  updated_at: string;
}

export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
  major: string;
  achievements: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
}

export interface Experience {
  position: string;
  company: string;
  duration: string;
  responsibilities: string[];
  achievements: string[];
}

export interface Skills {
  technical: string[];
  soft: string[];
  languages: string[];
}

export interface CareerRecommendation {
  industry: string;
  position: string;
  description: string;
  reason: string;
  required_skills: string[];
  required_experience: number;
  score: number;
}

export interface DevelopmentSuggestion {
  area: string;
  suggestion: string;
  resources: string[];
}

export interface Analysis {
  experience_level: string;
  strengths: string[];
  weaknesses: string[];
  career_recommendations: CareerRecommendation[];
  career_goals: string[];
  development_suggestions: DevelopmentSuggestion[];
}

export interface BasicAnalysis {
  personal_info: PersonalInfo;
  education: Education[];
  certifications: Certification[];
  experiences: Experience[];
  skills: Skills;
  analysis: Analysis;
}

export interface SkillGap {
  skill: string;
  importance: string;
  reason: string;
}

export interface CareerPath {
  path: string;
  fit_score: number;
  description: string;
}

export interface RecommendedSkill {
  skill: string;
  reason: string;
}

export interface RecommendedAction {
  action: string;
  priority: string;
  description: string;
}

export interface CareerMatch {
  id: string;
  name: string;
  description: string;
  industry: string;
  required_skills: string[];
  required_experience: number;
  similarity_score: number;
  skill_match_score: number;
}

export interface CareerAnalysis {
  strengths: string[];
  weaknesses: string[];
  skill_gaps: SkillGap[];
  career_paths: CareerPath[];
  recommended_skills: RecommendedSkill[];
  recommended_actions: RecommendedAction[];
  analysis_summary: string;
  career_matches: CareerMatch[];
  preferred_industries: string[];
}

export interface SectionScore {
  score: number;
  feedback: string[];
}

export interface QualityAssessment {
  overall: number;
  completeness: {
    score: number;
    missing_sections: string[];
    improvement_suggestions: string[];
  };
  formatting: {
    score: number;
    issues: string[];
    positive_points: string[];
  };
  section_scores: {
    personal_info: SectionScore;
    education: SectionScore;
    experience: SectionScore;
    skills: SectionScore;
  };
  language_quality: {
    score: number;
    strengths: string[];
    improvements: string[];
  };
  ats_compatibility: {
    score: number;
    issues: string[];
    keywords_missing: string[];
    format_suggestions: string[];
  };
  improvement_priority: Array<{
    area: string;
    priority: string;
    current_score: number;
    potential_impact: number;
    suggestions: string[];
  }>;
}

export interface DetailedMetrics {
  action_verbs_used: number;
  quantified_achievements: number;
  avg_bullets_per_role: number;
  keyword_density: number;
}

export interface Metrics {
  detailed: DetailedMetrics;
  word_count: number;
  sections_count: number;
}

export interface CVAnalysisData {
  status: string;
  basic_analysis: BasicAnalysis;
  career_analysis: CareerAnalysis;
  quality_assessment: QualityAssessment;
  metrics: Metrics;
  analysis_status: string;
  last_analyzed_at: string;
  created_at: string;
  updated_at: string;
}
