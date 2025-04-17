'use client';

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import CVUpload from '@/components/career/CVUpload';
import AnalysisProgress from '@/components/career/AnalysisProgress';
import AnalysisResults from '@/components/career/AnalysisResults';
import CVHistory from '@/components/career/CVHistory';
import { CVAnalysisData } from '@/services/cv/types';
import { toast } from 'react-toastify';
import { CvService } from '@/services/cv/cvService';

enum AnalysisState {
  UPLOAD,
  UPLOADING,
  ANALYZING,
  COMPLETE,
  ERROR
}

const CVAnalyzePage = () => {
  const [analysisState, setAnalysisState] = useState<AnalysisState>(AnalysisState.UPLOAD);
  const [analysisData, setAnalysisData] = useState<CVAnalysisData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [selectedCvId, setSelectedCvId] = useState<number | undefined>();
  const [isHistoryCollapsed, setIsHistoryCollapsed] = useState(false);
  const cvService = CvService();

  const handleSelectCV = async (cvId: number) => {
    try {
      setSelectedCvId(cvId);
      setAnalysisState(AnalysisState.ANALYZING);

      const response = await cvService.getAnalyzeCV(cvId);
      
      if (response.data) {
        setAnalysisData(response.data);
        setAnalysisState(AnalysisState.COMPLETE);
      }
    } catch (error: any) {
      console.error("Error loading CV analysis:", error);
      setErrorMessage(error.message || "Có lỗi xảy ra khi tải phân tích CV");
      setAnalysisState(AnalysisState.ERROR);
      toast.error("Có lỗi xảy ra khi tải phân tích CV");
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      setAnalysisState(AnalysisState.UPLOADING);
      
      // 1. Upload CV file
      const uploadResponse = await cvService.uploadCV(file);
      
      if (uploadResponse.errors) {
        throw new Error(uploadResponse.errors);
      }
      const cvInfo = uploadResponse.data;
      setAnalysisState(AnalysisState.ANALYZING);
      pollAnalysisStatus(cvInfo.id);
    } catch (error: any) {
      console.error("Error during CV upload and analysis:", error);
      setErrorMessage(error.message || "Có lỗi xảy ra khi xử lý CV");
      setAnalysisState(AnalysisState.ERROR);
      toast.error("Có lỗi xảy ra khi xử lý CV");
      toast.error(`Error details: ${error.stack}`);
    }
  };

  const pollAnalysisStatus = (cvId: number) => {
    const interval = setInterval(async () => {
      try {
        const statusResponse = await cvService.getAnalyzeCV(cvId);
        await new Promise(resolve => setTimeout(resolve, 75000));
        if (statusResponse.data.status === "completed") {
          clearInterval(interval);
          setAnalysisData(statusResponse.data);
          setAnalysisState(AnalysisState.COMPLETE);
        } else if (statusResponse.data.status === "error") {
          clearInterval(interval);
          setErrorMessage("Có lỗi xảy ra trong quá trình phân tích CV");
          setAnalysisState(AnalysisState.ERROR);
          toast.error("Có lỗi xảy ra trong quá trình phân tích CV");
        }
      } catch (error) {
        console.error("Error checking analysis status:", error);
        clearInterval(interval);
        setErrorMessage("Có lỗi xảy ra khi kiểm tra trạng thái phân tích CV");
        setAnalysisState(AnalysisState.ERROR);
        toast.error("Có lỗi xảy ra khi kiểm tra trạng thái phân tích CV");
      }
    }, 3000);
  };

  const handleRetry = () => {
    setAnalysisState(AnalysisState.UPLOAD);
    setErrorMessage("");
  };

  const content = (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex transition-all duration-300 relative">
          {/* Nút toggle luôn hiển thị */}
          <button
            onClick={() => setIsHistoryCollapsed(!isHistoryCollapsed)}
            className={`absolute top-4 z-20 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50
              ${isHistoryCollapsed ? 'left-0' : 'left-[calc(25%-12px)]'}
              transition-all duration-300`}
            aria-label={isHistoryCollapsed ? "Mở rộng" : "Thu gọn"}
          >
            <svg
              className={`h-5 w-5 transform transition-transform duration-200 ${isHistoryCollapsed ? 'rotate-180' : 'rotate-0'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Phần danh sách CV */}
          <div className={`transition-all duration-300 ${isHistoryCollapsed ? 'w-0 overflow-hidden' : 'w-1/4'}`}>
            <CVHistory
              onSelectCV={handleSelectCV}
              selectedCvId={selectedCvId}
              isCollapsed={isHistoryCollapsed}
              onCollapsedChange={setIsHistoryCollapsed}
            />
          </div>

          {/* Phần tải lên và phân tích CV */}
          <div className={`transition-all duration-300 ${isHistoryCollapsed ? 'w-full' : 'w-3/4'}
            ${isHistoryCollapsed ? 'pl-8' : 'pl-12'}`}>
            <div className="mb-8">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                  Phân tích CV chuyên sâu
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl">
                  Tải lên CV mới hoặc xem lại kết quả phân tích CV đã tải lên trước đó
                </p>
              </div>

              <div className="mt-6 flex justify-center lg:justify-start space-x-4 text-sm">
                <div className="flex items-center text-green-600">
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Phân tích chi tiết
                </div>
                <div className="flex items-center text-blue-600">
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Kết quả nhanh chóng
                </div>
              </div>
            </div>

            {analysisState === AnalysisState.UPLOAD && (
              <CVUpload
                onFileUpload={handleFileUpload}
                isAnalyzing={false}
              />
            )}

            {analysisState === AnalysisState.UPLOADING && (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-lg text-gray-700">Đang tải CV lên...</p>
                <p className="mt-2 text-sm text-gray-500">Vui lòng đợi trong giây lát</p>
              </div>
            )}

            {analysisState === AnalysisState.ANALYZING && (
              <div className="transition-all duration-300 transform">
                <AnalysisProgress onComplete={() => {}} />
              </div>
            )}

            {analysisState === AnalysisState.COMPLETE && analysisData && (
              <div className="mt-8 transition-all duration-500 animate-fadeIn">
                <AnalysisResults data={analysisData} />
              </div>
            )}

            {analysisState === AnalysisState.ERROR && (
              <div className="max-w-md mx-auto mt-8 p-6 bg-red-50 rounded-lg border border-red-200 shadow-lg transition-all duration-300 hover:shadow-xl">
                <div className="text-center space-y-4">
                  <svg className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <h3 className="text-lg font-medium text-red-800">Có lỗi xảy ra</h3>
                  <p className="mt-2 text-red-700">{errorMessage}</p>
                  <button
                    onClick={handleRetry}
                    className="mt-4 px-6 py-3 bg-red-600 text-white text-lg rounded-lg
                      hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                      transform transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    Thử lại
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return <ProtectedRoute>{content}</ProtectedRoute>;
};

export default CVAnalyzePage;