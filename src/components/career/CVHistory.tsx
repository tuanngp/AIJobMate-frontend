import React, { useEffect, useState } from 'react';
import { CvInfo } from '@/services/cv/types';
import { CvService } from '@/services/cv/cvService';

interface CVHistoryProps {
  onSelectCV: (cvId: number) => void;
  selectedCvId?: number;
  className?: string;
  isCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

const CVHistory: React.FC<CVHistoryProps> = ({
  onSelectCV,
  selectedCvId,
  isCollapsed: controlledIsCollapsed,
  onCollapsedChange
}) => {
  const [cvList, setCvList] = useState<CvInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);

  const isCollapsed = controlledIsCollapsed ?? internalIsCollapsed;
  const cvService = CvService();

  useEffect(() => {
    loadCVs();
  }, []);

  const loadCVs = async () => {
    try {
      const response = await cvService.getCVs(1, 10);
      if (response.data) {
        setCvList(response.data);
      }
    } catch (error) {
      console.error('Error loading CV history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCollapsedChange) {
      onCollapsedChange(!isCollapsed);
    } else {
      setInternalIsCollapsed(!isCollapsed);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-12 bg-gray-200 rounded mb-4"></div>
        <div className="h-12 bg-gray-200 rounded mb-4"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl w-full">

      <div className={`transition-all duration-300 ${isCollapsed ? 'hidden' : 'block'}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Lịch sử CV đã tải lên</h2>
          <div className="text-sm text-gray-500">
            {cvList.length} CV
          </div>
        </div>

        <div className={`space-y-3 ${isCollapsed ? 'hidden' : 'block'}`}>
          {cvList.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Chưa có CV nào được tải lên
            </p>
          ) : (
            cvList.map((cv) => (
              <div
                key={cv.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200
                  ${selectedCvId === cv.id
                    ? 'border-blue-500 bg-blue-50 shadow-md transform scale-[1.02]'
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-md hover:scale-[1.01]'
                  }`}
                onClick={() => onSelectCV(cv.id)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && onSelectCV(cv.id)}
                aria-selected={selectedCvId === cv.id}
              >
                <div className="flex justify-between items-center group">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {cv.file_name}
                    </h3>
                    <div className="mt-1 flex items-center space-x-2 text-sm">
                      <span className="text-gray-500">
                        <svg className="inline-block h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(cv.created_at)}
                      </span>
                      {cv.analysis_status === 'completed' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          Đã phân tích
                        </span>
                      )}
                    </div>
                  </div>
                  {selectedCvId === cv.id && (
                    <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg 
                        className="h-5 w-5" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                    </div>
                  )}
                  <div className="ml-4 flex-shrink-0">
                    <svg
                      className={`h-5 w-5 transform transition-transform duration-200
                        ${selectedCvId === cv.id ? 'rotate-90' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CVHistory;