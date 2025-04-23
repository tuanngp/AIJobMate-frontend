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
            formData.append('file', audioFile);
            
            if (interviewId > 0) {
                formData.append('interview_id', interviewId.toString());
            }

            const response = await api.post(INTERVIEW.SPEECH_TO_TEXT, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            });
            return response;
        }
    }
} 