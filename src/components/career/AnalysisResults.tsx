'use client';

import React, { useState } from 'react';
import { Tabs, Tab, Box, CircularProgress } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBriefcase, FaGraduationCap, FaCertificate } from 'react-icons/fa';
import { CareerPath, CVAnalysisData } from '@/services/cv/types';
import { PieChartData } from '@/app/career/analyze/types';

interface AnalysisResultsProps {
  data: CVAnalysisData;
}

interface PieChartLabel {
  name: string;
  percent: number;
}

const COLORS = ['#6366f1', '#3b82f6', '#06b6d4', '#10b981'];

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const renderBasicInfo = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      <div className="space-y-6">
        <motion.div
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h3
            className="text-lg font-semibold mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Thông tin cá nhân
          </motion.h3>
          <motion.div
            className="space-y-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-all duration-300">
              <FaUser className="text-blue-500 text-xl" />
              <div>
                <p className="text-sm text-gray-500">Họ tên</p>
                <p className="font-medium">{data.basic_analysis.personal_info.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-all duration-300">
              <FaEnvelope className="text-blue-500 text-xl" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{data.basic_analysis.personal_info.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-all duration-300">
              <FaPhone className="text-blue-500 text-xl" />
              <div>
                <p className="text-sm text-gray-500">Số điện thoại</p>
                <p className="font-medium">{data.basic_analysis.personal_info.phone}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-all duration-300">
              <FaMapMarkerAlt className="text-blue-500 text-xl" />
              <div>
                <p className="text-sm text-gray-500">Địa chỉ</p>
                <p className="font-medium">{data.basic_analysis.personal_info.location}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center mb-6">
            <FaGraduationCap className="text-blue-500 text-2xl mr-2" />
            <h3 className="text-lg font-semibold">Học vấn</h3>
          </div>

          <div className="space-y-6">
            {data.basic_analysis.education.map((edu, index) => (
              <motion.div
                key={index}
                className="relative pl-8 pb-8 border-l-2 border-blue-200 last:border-l-0 last:pb-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <div className="absolute -left-[9px] top-0">
                  <div className="w-4 h-4 rounded-full bg-blue-500 border-4 border-blue-100" />
                </div>
                
                <div className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-4 hover:shadow-md transition-all duration-300">
                  <h4 className="font-semibold text-blue-600 mb-2">{edu.degree}</h4>
                  <p className="text-gray-700">{edu.institution}</p>
                  <p className="text-gray-500 text-sm mb-3">{edu.year}</p>
                  
                  <div className="mt-4">
                    <p className="font-medium text-gray-700 mb-2">Thành tích:</p>
                    <ul className="space-y-2">
                      {edu.achievements.map((achievement, idx) => (
                        <motion.li
                          key={idx}
                          className="flex items-start"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.4 + idx * 0.1 }}
                        >
                          <span className="inline-block w-2 h-2 rounded-full bg-blue-400 mt-2 mr-2" />
                          <span className="text-sm text-gray-600">{achievement}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center mb-6">
            <FaCertificate className="text-blue-500 text-2xl mr-2" />
            <h3 className="text-lg font-semibold">Chứng chỉ</h3>
          </div>
          
          <div className="grid gap-4">
            {data.basic_analysis.certifications.map((cert, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-r from-blue-50 to-white rounded-lg p-4 border-l-4 border-blue-500
                         hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <h4 className="font-medium text-blue-700 mb-2">{cert.name}</h4>
                <div className="space-y-1">
                  {cert.issuer !== "Not specified" && (
                    <p className="text-sm text-gray-600 flex items-center">
                      <span className="w-2 h-2 rounded-full bg-blue-400 mr-2"></span>
                      Cấp bởi: {cert.issuer}
                    </p>
                  )}
                  {cert.year !== "Not specified" && (
                    <p className="text-sm text-gray-500 flex items-center">
                      <span className="w-2 h-2 rounded-full bg-blue-300 mr-2"></span>
                      Năm: {cert.year}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="space-y-6">
        <motion.div
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center mb-6">
            <FaBriefcase className="text-blue-500 text-2xl mr-2" />
            <h3 className="text-lg font-semibold">Kinh nghiệm làm việc</h3>
          </div>

          <div className="space-y-8">
            {data.basic_analysis.experiences.map((exp, index) => (
              <motion.div
                key={index}
                className="relative pl-8 pb-8 border-l-2 border-blue-200 last:border-l-0 last:pb-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <div className="absolute -left-[9px] top-0">
                  <div className="w-4 h-4 rounded-full bg-blue-500 border-4 border-blue-100" />
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-4 hover:shadow-md transition-all duration-300">
                  <h4 className="font-semibold text-blue-600">{exp.position}</h4>
                  <p className="text-gray-700 font-medium mt-1">{exp.company}</p>
                  <p className="text-gray-500 text-sm mb-4">{exp.duration}</p>
                  
                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2 flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>
                        Trách nhiệm
                      </h5>
                      <ul className="space-y-2">
                        {exp.responsibilities.map((resp, idx) => (
                          <motion.li
                            key={idx}
                            className="flex items-start ml-4"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.5 + idx * 0.1 }}
                          >
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-300 mt-2 mr-2" />
                            <span className="text-sm text-gray-600">{resp}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {exp.achievements.length > 0 && (
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2 flex items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                          Thành tựu
                        </h5>
                        <ul className="space-y-2">
                          {exp.achievements.map((achievement, idx) => (
                            <motion.li
                              key={idx}
                              className="flex items-start ml-4"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: 0.6 + idx * 0.1 }}
                            >
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-300 mt-2 mr-2" />
                              <span className="text-sm text-gray-600">{achievement}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold mb-6">Kỹ năng</h3>
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div>
              <h4 className="font-medium mb-3 flex items-center text-blue-700">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>
                Kỹ năng chuyên môn
              </h4>
              <div className="flex flex-wrap gap-2">
                {data.basic_analysis.skills.technical.map((skill, index) => (
                  <motion.span
                    key={index}
                    className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 px-4 py-1.5 rounded-full text-sm
                             border border-blue-200 hover:shadow-sm transition-all duration-300 hover:-translate-y-0.5"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3 flex items-center text-green-700">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                Kỹ năng mềm
              </h4>
              <div className="flex flex-wrap gap-2">
                {data.basic_analysis.skills.soft.map((skill, index) => (
                  <motion.span
                    key={index}
                    className="bg-gradient-to-r from-green-50 to-green-100 text-green-800 px-4 py-1.5 rounded-full text-sm
                             border border-green-200 hover:shadow-sm transition-all duration-300 hover:-translate-y-0.5"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + 0.1 * index }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Ngôn ngữ</h4>
              <div className="flex flex-wrap gap-2">
                {data.basic_analysis.skills.languages.map((lang, index) => (
                  <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );

  const renderCareerAnalysis = () => {
    const careerData: PieChartData[] = data.career_analysis.career_paths.map((path: CareerPath) => ({
      name: path.path,
      value: path.fit_score * 10
    }));

    const renderCustomLabel = ({ name, percent }: PieChartLabel) => (
      `${name} (${(percent * 100).toFixed(0)}%)`
    );

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        <div>
          <motion.div
            className="bg-white rounded-lg shadow-lg p-6 mb-6 hover:shadow-xl transition-shadow duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-6">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Phân tích nghề nghiệp
              </h3>
            </div>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={careerData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={renderCustomLabel}
                    outerRadius={60}
                    innerRadius={30}
                    fill="#8884d8"
                    dataKey="value"
                    animationDuration={800}
                    animationBegin={100}
                  >
                    {careerData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`url(#colorGradient${index})`}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      border: 'none',
                      padding: '12px'
                    }}
                  />
                  <defs>
                    {COLORS.map((color, index) => (
                      <linearGradient key={`gradient-${index}`} id={`colorGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={0.8}/>
                        <stop offset="100%" stopColor={color} stopOpacity={0.5}/>
                      </linearGradient>
                    ))}
                  </defs>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-4">
              {data.career_analysis.career_paths.map((path, index) => (
                <motion.div
                  key={index}
                  className="p-4 rounded-lg bg-gradient-to-r from-gray-50 to-white hover:shadow-md transition-all duration-300"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="font-medium text-gray-800">{path.path}</span>
                    <span className="text-sm text-gray-600">({path.fit_score * 10}%)</span>
                  </div>
                  <p className="text-sm text-gray-600 ml-5">{path.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Điểm mạnh & Điểm yếu</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <h4 className="font-medium text-green-600 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Điểm mạnh
                  </h4>
                  <ul className="list-none space-y-2 ml-4">
                    {data.career_analysis.strengths.map((strength, index) => (
                      <li key={index} className="text-gray-700 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-300 mt-2"></span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-red-600 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    Điểm yếu
                  </h4>
                  <ul className="list-none space-y-2 ml-4">
                    {data.career_analysis.weaknesses.map((weakness, index) => (
                      <li key={index} className="text-gray-700 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-300 mt-2"></span>
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {data.career_analysis.career_matches && data.career_analysis.career_matches.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Công việc phù hợp</h3>
                <div className="space-y-3">
                  {data.career_analysis.career_matches.map((match, index) => (
                    <div key={index} className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-700">{match.name}</h4>
                      <p className="text-sm text-gray-600">{match.description}</p>
                      <p className="text-sm text-gray-500">Ngành: {match.industry}</p>
                      <p className="text-sm text-gray-500">Kinh nghiệm yêu cầu: {match.required_experience} năm</p>
                      <p className="text-sm text-gray-500">Điểm tương thích: {match.similarity_score*100}%</p>
                      <p className="text-sm text-gray-500">Điểm kỹ năng: {match.skill_match_score*100}%</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.career_analysis.preferred_industries && data.career_analysis.preferred_industries.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Ngành nghề phù hợp</h3>
                <div className="flex flex-wrap gap-2">
                  {data.career_analysis.preferred_industries.map((industry, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                    >
                      {industry}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Phân tích kỹ năng cần phát triển</h3>
            <div className="space-y-4">
              {data.career_analysis.skill_gaps.map((gap, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-medium">{gap.skill}</h4>
                  <p className="text-sm text-gray-600 mb-1">{gap.reason}</p>
                  <span className={`text-xs ${
                    gap.importance === 'High' ? 'text-red-500' :
                    gap.importance === 'Medium' ? 'text-yellow-500' : 'text-green-500'
                  }`}>
                    Mức độ quan trọng: {gap.importance}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Kỹ năng đề xuất</h3>
            <div className="space-y-4">
              {data.career_analysis.recommended_skills.map((skill, index) => (
                <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-white rounded-lg">
                  <h4 className="font-medium text-blue-700 mb-1">{skill.skill}</h4>
                  <p className="text-sm text-gray-600">{skill.reason}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Tóm tắt & Đề xuất hành động</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-700 mb-2">Tóm tắt phân tích</h4>
                <p className="text-gray-700">{data.career_analysis.analysis_summary}</p>
              </div>
              <div className="space-y-3">
                {data.career_analysis.recommended_actions.map((action, index) => (
                  <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">{action.action}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        action.priority === 'High'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {action.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderQualityAssessment = () => {
    const scores = [
      { name: 'Tổng quát', value: data.quality_assessment.overall },
      { name: 'Hoàn thiện', value: data.quality_assessment.completeness.score },
      { name: 'Định dạng', value: data.quality_assessment.formatting.score },
      { name: 'ATS', value: data.quality_assessment.ats_compatibility.score }
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        <div className="space-y-6">
          <motion.div
            className="bg-white rounded-lg shadow p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold mb-4">Đánh giá chất lượng</h3>
            <div className="grid grid-cols-2 gap-6">
              {scores.map((score, index) => (
                <motion.div
                  key={index}
                  className="text-center p-4 bg-gradient-to-b from-white to-gray-50 rounded-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <CircularProgress
                    variant="determinate"
                    value={score.value}
                    size={80}
                    thickness={4}
                    className="text-blue-500"
                  />
                  <p className="mt-3 font-medium text-gray-800">{score.name}</p>
                  <p className="text-sm text-gray-600">{score.value}%</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg shadow p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-4">Hoàn thiện</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-red-600 mb-2">Phần còn thiếu</h4>
                <div className="flex flex-wrap gap-2">
                  {data.quality_assessment.completeness.missing_sections.map((section, index) => (
                    <span key={index} className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm">
                      {section}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-green-600 mb-2">Đề xuất cải thiện</h4>
                <ul className="space-y-2">
                  {data.quality_assessment.completeness.improvement_suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2"></span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg shadow p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold mb-4">Định dạng</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-green-600 mb-2">Điểm tốt</h4>
                <ul className="space-y-2">
                  {data.quality_assessment.formatting.positive_points.map((point, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2"></span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-red-600 mb-2">Vấn đề</h4>
                <ul className="space-y-2">
                  {data.quality_assessment.formatting.issues.map((issue, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2"></span>
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg shadow p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold mb-4">Đánh giá từng phần</h3>
            <div className="space-y-4">
              {Object.entries(data.quality_assessment.section_scores).map(([key, value]) => (
                <div key={key} className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium capitalize">{key.replace('_', ' ')}</h4>
                    <span className="text-sm font-medium text-blue-600">{value.score}%</span>
                  </div>
                  <ul className="space-y-2">
                    {value.feedback.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div
            className="bg-white rounded-lg shadow p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold mb-4">Chất lượng ngôn ngữ</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-green-600 mb-2">Điểm mạnh</h4>
                <ul className="space-y-2">
                  {data.quality_assessment.language_quality.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2"></span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-600 mb-2">Đề xuất cải thiện</h4>
                <ul className="space-y-2">
                  {data.quality_assessment.language_quality.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2"></span>
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg shadow p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold mb-4">Tương thích với ATS</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-red-600 mb-2">Vấn đề</h4>
                <ul className="space-y-2">
                  {data.quality_assessment.ats_compatibility.issues.map((issue, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2"></span>
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-yellow-600 mb-2">Từ khóa còn thiếu</h4>
                <div className="flex flex-wrap gap-2">
                  {data.quality_assessment.ats_compatibility.keywords_missing.map((keyword, index) => (
                    <span key={index} className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-sm">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-blue-600 mb-2">Đề xuất định dạng</h4>
                <ul className="space-y-2">
                  {data.quality_assessment.ats_compatibility.format_suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2"></span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg shadow p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h3 className="text-lg font-semibold mb-4">Ưu tiên cải thiện</h3>
            <div className="space-y-4">
              {data.quality_assessment.improvement_priority.map((item, index) => (
                <div key={index} className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800">{item.area}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.priority === 'High'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {item.priority}
                    </span>
                  </div>
                  <div className="mb-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${item.current_score}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Điểm hiện tại: {item.current_score}/100
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {item.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2"></span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  const renderMetrics = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Số liệu chi tiết</h3>
        <div className="space-y-4">
          <p><span className="font-medium">Số từ:</span> {data.metrics.word_count}</p>
          <p><span className="font-medium">Số động từ hành động:</span> {data.metrics.detailed.action_verbs_used}</p>
          <p><span className="font-medium">Thành tích định lượng:</span> {data.metrics.detailed.quantified_achievements}</p>
          <p><span className="font-medium">Trung bình bullet points/vai trò:</span> {data.metrics.detailed.avg_bullets_per_role}</p>
          <p><span className="font-medium">Mật độ từ khóa:</span> {data.metrics.detailed.keyword_density}</p>
          <p><span className="font-medium">Số phần:</span> {data.metrics.sections_count}</p>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Thời gian phân tích</h3>
        <div className="space-y-2">
          <p><span className="font-medium">Trạng thái:</span> {data.status}</p>
          <p><span className="font-medium">Lần cuối phân tích:</span> {new Date(data.last_analyzed_at).toLocaleString()}</p>
          <p><span className="font-medium">Ngày tạo:</span> {new Date(data.created_at).toLocaleString()}</p>
          <p><span className="font-medium">Cập nhật lần cuối:</span> {new Date(data.updated_at).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto">
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
          <Tab label="Thông tin cơ bản" />
          <Tab label="Phân tích nghề nghiệp" />
          <Tab label="Đánh giá chất lượng" />
          <Tab label="Số liệu thống kê" />
        </Tabs>
      </Box>
      <div className="mt-6">
        {activeTab === 0 && renderBasicInfo()}
        {activeTab === 1 && renderCareerAnalysis()}
        {activeTab === 2 && renderQualityAssessment()}
        {activeTab === 3 && renderMetrics()}
      </div>
    </div>
  );
};

export default AnalysisResults;