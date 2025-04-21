'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline';

interface CVUploadProps {
  onFileUpload: (file: File) => void;
  isAnalyzing: boolean;
}

const CVUpload: React.FC<CVUploadProps> = ({ onFileUpload, isAnalyzing }) => {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    disabled: isAnalyzing,
    multiple: false
  });

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <motion.div
        {...getRootProps({
          onDragEnter: () => setDragActive(true),
          onDragLeave: () => setDragActive(false),
          onDrop: () => setDragActive(false)
        })}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
          ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={!isAnalyzing ? { scale: 1.02 } : {}}
      >
        <input {...getInputProps()} />
        
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ 
        type: "spring",
        duration: 0.5
          }}
          className="flex flex-col items-center justify-center"
        >
          <DocumentArrowUpIcon className="h-16 w-16 text-blue-500 mb-4" />
          <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
          >
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Kéo và thả CV của bạn vào đây
        </h3>
        <p className="text-gray-600 mb-4">
          hoặc click để chọn file
        </p>
        <p className="text-sm text-gray-400">
          Định dạng hỗ trợ: PDF, DOC, DOCX
        </p>
          </motion.div>
        </motion.div>

        {isDragActive && (
          <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-blue-500 bg-opacity-10 rounded-xl flex items-center justify-center"
          >
        <p className="text-lg font-medium text-blue-600">
          Thả file để tải lên
        </p>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-4 text-center"
      >
        <p className="text-sm text-gray-500">
          Chúng tôi sẽ phân tích CV của bạn và đưa ra các đề xuất để cải thiện
        </p>
      </motion.div>
    </div>
  );
};

export default CVUpload;