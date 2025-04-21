import { ApiResponse, useApi } from "@/hooks/useApi";
import { CV } from "../api";
import { CVAnalysisData, CvInfo } from "./types";

export const CvService = () => {
  const api = useApi();

  return {
    // Tải CV lên
    async uploadCV(file: File): Promise<ApiResponse<CvInfo>> {
      const formData = new FormData();
      formData.append("file", file);

      return await api.post<CvInfo>(CV.UPLOAD, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },

    // Lấy danh sách CV với phân trang
    async getCVs(
      page: number = 1,
      limit: number = 10
    ): Promise<ApiResponse<CvInfo[]>> {
      return await api.get<CvInfo[]>(CV.GET_LIST, {
        page: page.toString(),
        limit: limit.toString(),
      });
    },

    // Lấy thông tin một CV
    async getCV(id: number): Promise<ApiResponse<CvInfo>> {
      return await api.get<CvInfo>(CV.GET(id));
    },

    // Phân tích CV
    async analyzeCV(id: number): Promise<ApiResponse<CVAnalysisData>> {
      return await api.post<CVAnalysisData>(CV.ANALYZE(id));
    },

    // Lấy phân tích CV
    async getAnalyzeCV(id: number): Promise<ApiResponse<CVAnalysisData>> {
      return await api.get<CVAnalysisData>(CV.ANALYZE(id));
    },
  };
};
