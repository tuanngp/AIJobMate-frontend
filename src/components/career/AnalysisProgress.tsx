'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface AnalysisProgressProps {
  onComplete: () => void;
}

const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 1;
        if (newProgress >= 100) {
          clearInterval(interval);
          onComplete();
        }
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Đang phân tích CV của bạn...
        </h2>
        <p className="text-gray-600">
          Quá trình này có thể mất vài phút. Vui lòng chờ chúng tôi phân tích CV của bạn.
        </p>
      </div>

      <motion.div
        className="w-full bg-gray-200 rounded-full h-4 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="bg-blue-600 h-4 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        ></motion.div>
      </motion.div>

      <div className="flex justify-between text-sm text-gray-600">
        <span>Đang xử lý...</span>
        <span>{progress}%</span>
      </div>

      <div className="mt-8">
        <div className="flex flex-col space-y-4">
          {progress >= 20 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center"
            >
              <div className="bg-blue-100 p-2 rounded-full">
                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="ml-3 text-gray-700">Đang trích xuất thông tin từ CV</span>
            </motion.div>
          )}
          
          {progress >= 50 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center"
            >
              <div className="bg-blue-100 p-2 rounded-full">
                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="ml-3 text-gray-700">Phân tích kỹ năng và kinh nghiệm</span>
            </motion.div>
          )}
          
          {progress >= 80 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center"
            >
              <div className="bg-blue-100 p-2 rounded-full">
                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="ml-3 text-gray-700">Đánh giá chất lượng và đề xuất cải thiện</span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisProgress;