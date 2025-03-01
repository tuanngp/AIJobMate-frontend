import { VideoAnalysis } from "@/services/types";
import {
  ChartBarIcon,
  FaceSmileIcon,
  UserIcon,
  LightBulbIcon,
} from "@heroicons/react/24/outline";

interface VideoAnalysisCardProps {
  analysis: VideoAnalysis;
}

export default function VideoAnalysisCard({
  analysis,
}: VideoAnalysisCardProps) {
  // Helper function to get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      {/* Overall Score Section */}
      <div className="px-4 py-5 sm:p-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex sm:items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-indigo-100">
              <ChartBarIcon
                className="h-6 w-6 text-indigo-600"
                aria-hidden="true"
              />
            </div>
            <h3 className="mt-4 text-lg font-medium leading-6 text-gray-900 sm:ml-4 sm:mt-0">
              Overall Performance
            </h3>
          </div>
          <div
            className={`mt-4 text-3xl font-bold sm:mt-0 ${getScoreColor(
              analysis.bodyLanguage.overallScore
            )}`}
          >
            {Math.round(analysis.bodyLanguage.overallScore)}%
          </div>
        </div>
      </div>

      {/* Body Language Analysis */}
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <div className="sm:flex sm:items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-indigo-100">
            <UserIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
          </div>
          <h3 className="mt-4 text-lg font-medium leading-6 text-gray-900 sm:ml-4 sm:mt-0">
            Body Language Analysis
          </h3>
        </div>
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900">Posture</h4>
          <p className="mt-2 text-sm text-gray-600">
            {analysis.bodyLanguage.posture}
          </p>

          <h4 className="mt-4 text-sm font-medium text-gray-900">
            Key Gestures
          </h4>
          <ul className="mt-2 space-y-2">
            {analysis.bodyLanguage.gestures.map((gesture, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-gray-600"
              >
                <span className="select-none">•</span>
                {gesture}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Facial Expressions Timeline */}
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <div className="sm:flex sm:items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-indigo-100">
            <FaceSmileIcon
              className="h-6 w-6 text-indigo-600"
              aria-hidden="true"
            />
          </div>
          <h3 className="mt-4 text-lg font-medium leading-6 text-gray-900 sm:ml-4 sm:mt-0">
            Expression Analysis
          </h3>
        </div>
        <div className="mt-4 space-y-4">
          {analysis.expressions.map((expr, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-gray-900 capitalize">
                  {expr.emotion}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(expr.timestamp * 1000).toISOString().substr(14, 5)}
                </p>
              </div>
              <div
                className={`text-sm font-medium ${getScoreColor(
                  expr.confidence * 100
                )}`}
              >
                {Math.round(expr.confidence * 100)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <div className="sm:flex sm:items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-indigo-100">
            <LightBulbIcon
              className="h-6 w-6 text-indigo-600"
              aria-hidden="true"
            />
          </div>
          <h3 className="mt-4 text-lg font-medium leading-6 text-gray-900 sm:ml-4 sm:mt-0">
            Improvement Suggestions
          </h3>
        </div>
        <div className="mt-4">
          <ul className="space-y-2">
            {analysis.recommendations.map((recommendation, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-gray-600"
              >
                <span className="select-none">•</span>
                {recommendation}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
