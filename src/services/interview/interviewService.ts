import { ApiResponse, useApi } from "@/hooks/useApi";
import { INTERVIEW } from "../api";
import { AnalysisResponse, AnswerRequest, GenerateQuestionsRequest, GenerateQuestionsResponse, Interview } from "../types";

export const InterviewService = () => {
    const api = useApi();
    return {
        async generateQuestions(data: GenerateQuestionsRequest): Promise<ApiResponse<GenerateQuestionsResponse>> {
            const response = await api.post(INTERVIEW.GENERATE, data);
            return response;
        },

        async getInterviews(): Promise<ApiResponse<Interview[]>> {
            const response = await api.get(INTERVIEW.GET_LIST);
            return response;
        },

        async getInterview(id: number): Promise<ApiResponse<Interview>> {
            const response = await api.get(INTERVIEW.GET(id));
            return response;
        },

        async deleteInterview(id: number): Promise<ApiResponse<any>> {
            const response = await api.delete(INTERVIEW.DELETE(id));
            return response;
        },

        async analyzeAnswer(interviewId: number, questionId: number, data: AnswerRequest): Promise<ApiResponse<AnalysisResponse>> {
            const response = await api.post(INTERVIEW.ANALYZE_ANSWER(interviewId, questionId), data);
            return response;
        },

        async speechToText(interviewId: number, audioFile: File): Promise<ApiResponse<{transcript: string}>> {
            const formData = new FormData();
            
            // Make sure we're using the correct field name expected by the backend
            // Changed from 'file' to 'audio' as this is more commonly used for audio files
            formData.append('audio', audioFile);
            
            // Add interview_id only if it's a valid ID (greater than 0)
            if (interviewId > 0) {
                formData.append('interview_id', interviewId.toString());
            }
            
            // Add additional information that might be needed by the API
            formData.append('content_type', audioFile.type);
            formData.append('file_name', audioFile.name);
            
            // Make sure not to set Content-Type manually as the browser will set the correct
            // multipart boundary when sending FormData
            const response = await api.post(INTERVIEW.SPEECH_TO_TEXT, formData, {
                headers: {
                    // Let the browser set the Content-Type with the correct boundary
                    // 'Content-Type': 'multipart/form-data' - Don't set this manually
                },
            });
            return response;
        }
    }
} 