import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import {
  ApiResponse,
  CareerAdvice,
  JobPreferences,
  SpeechAnalysis,
  VideoAnalysis,
  Job,
  SalaryPrediction,
  JobSearchParams,
} from "./types";

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const message =
      (error.response?.data as { message?: string })?.message ||
      error.message ||
      "An error occurred";
    toast.error(message);
    return Promise.reject(error);
  }
);

// Career API
export const careerApi = {
  async uploadCV(file: File): Promise<ApiResponse<CareerAdvice>> {
    const formData = new FormData();
    formData.append("cv", file);
    const { data } = await api.post<ApiResponse<CareerAdvice>>(
      "/career/upload-cv",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  },

  async getAdvice(
    preferences: JobPreferences
  ): Promise<ApiResponse<CareerAdvice>> {
    const { data } = await api.post<ApiResponse<CareerAdvice>>(
      "/career/advice",
      preferences
    );
    return data;
  },
};

// Interview API
export const interviewApi = {
  async analyzeSpeech(audioBlob: Blob): Promise<ApiResponse<SpeechAnalysis>> {
    const formData = new FormData();
    formData.append("audio", audioBlob);
    const { data } = await api.post<ApiResponse<SpeechAnalysis>>(
      "/interview/speech-analyze",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  },

  async analyzeVideo(videoBlob: Blob): Promise<ApiResponse<VideoAnalysis>> {
    const formData = new FormData();
    formData.append("video", videoBlob);
    const { data } = await api.post<ApiResponse<VideoAnalysis>>(
      "/interview/video-analyze",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  },
};

// Jobs API
export const jobsApi = {
  async searchJobs(params: JobSearchParams): Promise<ApiResponse<Job[]>> {
    const { data } = await api.get<ApiResponse<Job[]>>("/jobs/search", {
      params,
    });
    return data;
  },

  async predictSalary(
    skills: string[],
    experience: number
  ): Promise<ApiResponse<SalaryPrediction>> {
    const { data } = await api.post<ApiResponse<SalaryPrediction>>(
      "/salary/predict",
      {
        skills,
        experience,
      }
    );
    return data;
  },
};

// Helper function to handle file uploads
export const uploadFile = async (
  file: File,
  onProgress?: (progress: number) => void
) => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onProgress) {
        const progress = (progressEvent.loaded * 100) / progressEvent.total;
        onProgress(progress);
      }
    },
  });

  return data;
};

export default api;
