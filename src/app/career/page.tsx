"use client";

import { useState } from "react";
import FileUploader from "@/components/common/FileUploader";
import CareerForm from "@/components/career/CareerForm";
import CareerAdviceCard from "@/components/career/CareerAdviceCard";
import { careerApi } from "@/services/api";
import { CareerAdvice, JobPreferences } from "@/services/types";
import { toast } from "react-toastify";

export default function CareerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [advice, setAdvice] = useState<CareerAdvice | null>(null);

  const handleCVUpload = async (file: File) => {
    try {
      setIsLoading(true);
      const response = await careerApi.uploadCV(file);
      setAdvice(response.data);
      toast.success("CV analyzed successfully!");
    } catch (error) {
      toast.error("Failed to analyze CV. Please try again.");
      console.error("CV upload error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferencesSubmit = async (preferences: JobPreferences) => {
    try {
      setIsLoading(true);
      const response = await careerApi.getAdvice(preferences);
      setAdvice(response.data);
      toast.success("Career advice generated successfully!");
    } catch (error) {
      toast.error("Failed to generate advice. Please try again.");
      console.error("Get advice error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-8">
      <div className="mx-auto max-w-3xl">
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Career Advisor
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              Get personalized career advice based on your CV and preferences
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div>
            <div className="rounded-lg bg-white shadow">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Upload CV</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Upload your CV to get AI-powered analysis and recommendations
                </p>
                <div className="mt-6">
                  <FileUploader
                    onFileSelect={handleCVUpload}
                    acceptedFileTypes="application/pdf"
                    maxSize={5 * 1024 * 1024} // 5MB
                    label="Upload your CV (PDF)"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-lg bg-white shadow">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Job Preferences
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Tell us about your career goals and preferences
                </p>
                <div className="mt-6">
                  <CareerForm
                    onSubmit={handlePreferencesSubmit}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            {advice ? (
              <CareerAdviceCard advice={advice} />
            ) : (
              <div className="rounded-lg bg-gray-50 p-6">
                <p className="text-center text-gray-500">
                  Upload your CV or fill out the job preferences form to get
                  started
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
