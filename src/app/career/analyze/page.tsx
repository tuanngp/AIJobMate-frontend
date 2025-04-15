'use client';

import React, { useState } from 'react';
import CVUpload from '@/components/career/CVUpload';
import AnalysisProgress from '@/components/career/AnalysisProgress';
import AnalysisResults from '@/components/career/AnalysisResults';
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
  const cvService = CvService();
  const handleFileUpload = async (file: File) => {
    try {
      setAnalysisState(AnalysisState.UPLOADING);
      
      // 1. Upload CV file
      const uploadResponse = await cvService.uploadCV(file);
      
      if (uploadResponse.errors) {
        throw new Error(uploadResponse.errors);
      }
      
      const cvInfo = uploadResponse.data;
      
      // 2. Change to analyzing state
      setAnalysisState(AnalysisState.ANALYZING);
      
      // 3. Trigger CV analysis
      const analysisResponse = await cvService.analyzeCV(cvInfo.id);
      
      if (analysisResponse.errors) {
        throw new Error(analysisResponse.errors);
      }
      
      // 4. If analysis is in processing state, start polling
      if (analysisResponse.data.status === "processing") {
        pollAnalysisStatus(cvInfo.id);
      } else {
        setAnalysisData(analysisResponse.data);
        setAnalysisState(AnalysisState.COMPLETE);
      }
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
        
        if (statusResponse.data.status === "completed") {
          clearInterval(interval);
          setAnalysisData(statusResponse.data);
          setAnalysisState(AnalysisState.COMPLETE);
        }
      } catch (error) {
        console.error("Error checking analysis status:", error);
        clearInterval(interval);
        setErrorMessage("Có lỗi xảy ra khi kiểm tra trạng thái phân tích CV");
        setAnalysisState(AnalysisState.ERROR);
        toast.error("Có lỗi xảy ra khi kiểm tra trạng thái phân tích CV");
      }
    }, 3000); // Check every 3 seconds
  };

  const handleRetry = () => {
    setAnalysisState(AnalysisState.UPLOAD);
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Phân tích CV chuyên sâu
          </h1>
          <p className="mt-2 text-gray-600">
            Tải lên CV của bạn để nhận phân tích chi tiết và đề xuất cải thiện
          </p>
        </div>

        {analysisState === AnalysisState.UPLOAD && (
          <CVUpload 
            onFileUpload={handleFileUpload}
            isAnalyzing={false}
          />
        )}

        {analysisState === AnalysisState.UPLOADING && (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-lg">Đang tải CV lên...</p>
          </div>
        )}

        {analysisState === AnalysisState.ANALYZING && (
          <AnalysisProgress onComplete={() => {}} />
        )}

        {analysisState === AnalysisState.COMPLETE && analysisData && (
          <div className="mt-8">
            <AnalysisResults data={analysisData} />
          </div>
        )}

        {analysisState === AnalysisState.ERROR && (
          <div className="max-w-md mx-auto mt-8 p-6 bg-red-50 rounded-lg border border-red-200">
            <div className="text-center">
              <svg className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-lg font-medium text-red-800">Có lỗi xảy ra</h3>
              <p className="mt-2 text-red-700">{errorMessage}</p>
              <button 
                onClick={handleRetry}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Thử lại
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CVAnalyzePage;