'use client';

import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { Document as DocxDocument, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import { CVAnalysisData } from '@/app/career/analyze/types';

interface ExportCVProps {
  data: CVAnalysisData;
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Times-Roman',
  },
  section: {
    margin: 10,
    padding: 10,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Times-Bold',
    letterSpacing: 0.02,
    padding: 2,
    textTransform: 'uppercase',
  },
  subheading: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    fontFamily: 'Times-Bold',
    letterSpacing: 0.01,
    padding: 1,
    color: 'rgb(55, 65, 81)',
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
    fontFamily: 'Times-Roman',
    letterSpacing: 0.005,
    lineHeight: 1.3,
    textAlign: 'justify',
    paddingHorizontal: 2,
  },
});

const PDFDocument = ({ data }: ExportCVProps) => (
  <Document>
    <Page size="A4" style={{
      ...styles.page,
      letterSpacing: 0.01,
      lineHeight: 1.2
    }} wrap={false}>
      <View style={styles.section}>
        <Text style={styles.heading}>Personal Information</Text>
        <Text style={styles.text}>Full name: {data.basic_analysis.personal_info.name}</Text>
        <Text style={styles.text}>Email: {data.basic_analysis.personal_info.email}</Text>
        <Text style={styles.text}>Phone number: {data.basic_analysis.personal_info.phone}</Text>
        <Text style={styles.text}>Address: {data.basic_analysis.personal_info.location}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Education</Text>
        {data.basic_analysis.education.map((edu, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.subheading}>{edu.degree}</Text>
            <Text style={styles.text}>{edu.institution}</Text>
            <Text style={styles.text}>{edu.year}</Text>
            {edu.achievements.map((achievement, idx) => (
              <Text key={idx} style={styles.text}>• {achievement}</Text>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Work Experience</Text>
        {data.basic_analysis.experiences.map((exp, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.subheading}>{exp.position}</Text>
            <Text style={styles.text}>{exp.company}</Text>
            <Text style={styles.text}>{exp.duration}</Text>
            <Text style={styles.subheading}>Responsibilities:</Text>
            {exp.responsibilities.map((resp, idx) => (
              <Text key={idx} style={styles.text}>• {resp}</Text>
            ))}
            {exp.achievements.length > 0 && (
              <>
                <Text style={styles.subheading}>Achievements:</Text>
                {exp.achievements.map((achievement, idx) => (
                  <Text key={idx} style={styles.text}>• {achievement}</Text>
                ))}
              </>
            )}
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Skills</Text>
        <Text style={styles.subheading}>Technical Skills:</Text>
        <Text style={styles.text}>{data.basic_analysis.skills.technical.join(', ')}</Text>
        
        <Text style={styles.subheading}>Soft Skills:</Text>
        <Text style={styles.text}>{data.basic_analysis.skills.soft.join(', ')}</Text>
        
        <Text style={styles.subheading}>Languages:</Text>
        <Text style={styles.text}>{data.basic_analysis.skills.languages.join(', ')}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Certifications</Text>
        {data.basic_analysis.certifications.map((cert, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.subheading}>{cert.name}</Text>
            <Text style={styles.text}>Issued by: {cert.issuer}</Text>
            <Text style={styles.text}>Year: {cert.year}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Career Analysis</Text>
        <Text style={styles.subheading}>Strengths:</Text>
        {data.career_analysis.strengths.map((strength, index) => (
          <Text key={index} style={styles.text}>• {strength}</Text>
        ))}
        
        <Text style={styles.subheading}>Weaknesses:</Text>
        {data.career_analysis.weaknesses.map((weakness, index) => (
          <Text key={index} style={styles.text}>• {weakness}</Text>
        ))}

        <Text style={styles.subheading}>Suitable Positions:</Text>
        {data.career_analysis.career_matches.map((match, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.text}>• {match.name}</Text>
            <Text style={styles.text}>  - Industry: {match.industry}</Text>
            <Text style={styles.text}>  - Required experience: {match.required_experience} years</Text>
            <Text style={styles.text}>  - Compatibility score: {(match.similarity_score * 100).toFixed(0)}%</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>CV Quality Assessment</Text>
        <Text style={styles.subheading}>Completeness:</Text>
        <Text style={styles.text}>Score: {data.quality_assessment.completeness.score}/100</Text>
        {data.quality_assessment.completeness.missing_sections.length > 0 && (
          <>
            <Text style={styles.text}>Missing sections:</Text>
            {data.quality_assessment.completeness.missing_sections.map((section, index) => (
              <Text key={index} style={styles.text}>• {section}</Text>
            ))}
          </>
        )}

        <Text style={styles.subheading}>Formatting:</Text>
        <Text style={styles.text}>Score: {data.quality_assessment.formatting.score}/100</Text>
        {data.quality_assessment.formatting.positive_points.map((point, index) => (
          <Text key={index} style={styles.text}>✓ {point}</Text>
        ))}
        {data.quality_assessment.formatting.issues.map((issue, index) => (
          <Text key={index} style={styles.text}>• {issue}</Text>
        ))}
      </View>

      {data.metrics && (
        <View style={styles.section}>
          <Text style={styles.heading}>Detailed Metrics</Text>
          <Text style={styles.text}>Word count: {data.metrics.word_count}</Text>
          <Text style={styles.text}>Number of sections: {data.metrics.sections_count}</Text>
          <Text style={styles.subheading}>Details:</Text>
          <Text style={styles.text}>• Action verbs used: {data.metrics.detailed.action_verbs_used}</Text>
          <Text style={styles.text}>• Quantified achievements: {data.metrics.detailed.quantified_achievements}</Text>
          <Text style={styles.text}>• Average bullets per role: {data.metrics.detailed.avg_bullets_per_role}</Text>
          <Text style={styles.text}>• Keyword density: {data.metrics.detailed.keyword_density.toFixed(2)}%</Text>
        </View>
      )}
    </Page>
  </Document>
);

const PrintableContent = React.forwardRef<HTMLDivElement, ExportCVProps>(({ data }, ref) => (
  <div ref={ref} style={{ padding: '20px', fontFamily: '"Times New Roman", Times, serif' }}>
    <h1 style={{ fontSize: '24px', marginBottom: '20px', fontFamily: '"Times New Roman", Times, serif' }}>CV Analysis Report</h1>
    
    <div style={{ marginBottom: '20px' }}>
      <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>Personal Information</h2>
      <p>Full name: {data.basic_analysis.personal_info.name}</p>
      <p>Email: {data.basic_analysis.personal_info.email}</p>
      <p>Phone number: {data.basic_analysis.personal_info.phone}</p>
      <p>Address: {data.basic_analysis.personal_info.location}</p>
    </div>

    <div style={{ marginBottom: '20px' }}>
      <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>Education</h2>
      {data.basic_analysis.education.map((edu, index) => (
        <div key={index} style={{ marginBottom: '15px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '5px' }}>{edu.degree}</h3>
          <p>{edu.institution}</p>
          <p>{edu.year}</p>
          {edu.achievements.map((achievement, idx) => (
            <p key={idx}>• {achievement}</p>
          ))}
        </div>
      ))}
    </div>

    <div style={{ marginBottom: '20px' }}>
      <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>Work Experience</h2>
      {data.basic_analysis.experiences.map((exp, index) => (
        <div key={index} style={{ marginBottom: '15px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '5px' }}>{exp.position}</h3>
          <p>{exp.company}</p>
          <p>{exp.duration}</p>
          <div>
            <h4 style={{ fontSize: '14px', marginBottom: '5px' }}>Responsibilities:</h4>
            {exp.responsibilities.map((resp, idx) => (
              <p key={idx}>• {resp}</p>
            ))}
          </div>
          {exp.achievements.length > 0 && (
            <div>
              <h4 style={{ fontSize: '14px', marginBottom: '5px' }}>Achievements:</h4>
              {exp.achievements.map((achievement, idx) => (
                <p key={idx}>• {achievement}</p>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>

    <div style={{ marginBottom: '20px' }}>
      <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>Skills</h2>
      <div>
        <h3 style={{ fontSize: '16px', marginBottom: '5px' }}>Technical Skills:</h3>
        <p>{data.basic_analysis.skills.technical.join(', ')}</p>
      </div>
      <div>
        <h3 style={{ fontSize: '16px', marginBottom: '5px' }}>Soft Skills:</h3>
        <p>{data.basic_analysis.skills.soft.join(', ')}</p>
      </div>
      <div>
        <h3 style={{ fontSize: '16px', marginBottom: '5px' }}>Languages:</h3>
        <p>{data.basic_analysis.skills.languages.join(', ')}</p>
      </div>
    </div>

    <div style={{ marginBottom: '20px' }}>
      <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>Certifications</h2>
      {data.basic_analysis.certifications.map((cert, index) => (
        <div key={index} style={{ marginBottom: '10px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '5px' }}>{cert.name}</h3>
          <p>Cấp bởi: {cert.issuer}</p>
          <p>Năm: {cert.year}</p>
        </div>
      ))}
    </div>

    <div style={{ marginBottom: '20px' }}>
      <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>Career Analysis</h2>
      <div style={{ marginBottom: '15px' }}>
        <h3 style={{ fontSize: '16px', marginBottom: '5px' }}>Strengths:</h3>
        {data.career_analysis.strengths.map((strength, index) => (
          <p key={index}>• {strength}</p>
        ))}
      </div>
      <div style={{ marginBottom: '15px' }}>
        <h3 style={{ fontSize: '16px', marginBottom: '5px' }}>Weaknesses:</h3>
        {data.career_analysis.weaknesses.map((weakness, index) => (
          <p key={index}>• {weakness}</p>
        ))}
      </div>
      <div style={{ marginBottom: '15px' }}>
        <h3 style={{ fontSize: '16px', marginBottom: '5px' }}>Suitable Positions:</h3>
        {data.career_analysis.career_matches.map((match, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <p style={{ fontWeight: '500' }}>• {match.name}</p>
            <p style={{ marginLeft: '20px' }}>- Industry: {match.industry}</p>
            <p style={{ marginLeft: '20px' }}>- Required experience: {match.required_experience} years</p>
            <p style={{ marginLeft: '20px' }}>- Compatibility score: {(match.similarity_score * 100).toFixed(0)}%</p>
          </div>
        ))}
      </div>
    </div>

    <div style={{ marginBottom: '20px' }}>
      <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>CV Quality Assessment</h2>
      <div style={{ marginBottom: '15px' }}>
        <h3 style={{ fontSize: '16px', marginBottom: '5px' }}>Completeness:</h3>
        <p>Score: {data.quality_assessment.completeness.score * 10}/10</p>
        {data.quality_assessment.completeness.missing_sections.length > 0 && (
          <>
            <p>Missing sections:</p>
            {data.quality_assessment.completeness.missing_sections.map((section, index) => (
              <p key={index}>• {section}</p>
            ))}
          </>
        )}
      </div>
      <div style={{ marginBottom: '15px' }}>
        <h3 style={{ fontSize: '16px', marginBottom: '5px' }}>Formatting:</h3>
        <p>Score: {data.quality_assessment.formatting.score * 10}/10</p>
        {data.quality_assessment.formatting.positive_points.map((point, index) => (
          <p key={index} style={{ color: 'green' }}>✓ {point}</p>
        ))}
        {data.quality_assessment.formatting.issues.map((issue, index) => (
          <p key={index}>• {issue}</p>
        ))}
      </div>
    </div>

    {data.metrics && (
      <div>
        <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>Detailed Metrics</h2>
        <p>Word count: {data.metrics.word_count}</p>
        <p>Sections count: {data.metrics.sections_count}</p>
        <h3 style={{ fontSize: '16px', marginBottom: '5px', marginTop: '10px' }}>Details:</h3>
        <p>• Action verbs used: {data.metrics.detailed.action_verbs_used}</p>
        <p>• Quantified achievements: {data.metrics.detailed.quantified_achievements}</p>
        <p>• Average bullets per role: {data.metrics.detailed.avg_bullets_per_role}</p>
        <p>• Keyword density: {data.metrics.detailed.keyword_density.toFixed(2)}%</p>
      </div>
    )}
  </div>
));

PrintableContent.displayName = 'PrintableContent';

const ExportCV: React.FC<ExportCVProps> = ({ data }) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `
      @media print {
        body {
          font-family: "Times New Roman", Times, serif;
        }
        @page {
          margin: 20mm;
          size: A4;
        }
      }
    `,
  } as any);

  const exportToDocx = async () => {
    const doc = new DocxDocument({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: 'CV ANALYSIS REPORT',
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            text: '\nPersonal Information',
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            children: [
              new TextRun(`Full name: ${data.basic_analysis.personal_info.name}\n`),
              new TextRun(`Email: ${data.basic_analysis.personal_info.email}\n`),
              new TextRun(`Phone number: ${data.basic_analysis.personal_info.phone}\n`),
              new TextRun(`Address: ${data.basic_analysis.personal_info.location}\n`),
            ],
          }),
          ...data.basic_analysis.education.flatMap(edu => [
            new Paragraph({
              text: edu.degree,
              heading: HeadingLevel.HEADING_3,
            }),
            new Paragraph({ text: edu.institution }),
            new Paragraph({ text: edu.year }),
            ...edu.achievements.map(achievement => 
              new Paragraph({ text: `• ${achievement}` })
            ),
          ]),
          new Paragraph({
            text: '\nWork Experience',
            heading: HeadingLevel.HEADING_2,
          }),
          ...data.basic_analysis.experiences.flatMap(exp => [
            new Paragraph({
              text: exp.position,
              heading: HeadingLevel.HEADING_3,
            }),
            new Paragraph({ text: exp.company }),
            new Paragraph({ text: exp.duration }),
            new Paragraph({ text: 'Responsibilities:' }),
            ...exp.responsibilities.map(resp => 
              new Paragraph({ text: `• ${resp}` })
            ),
            ...(exp.achievements.length > 0 ? [
              new Paragraph({ text: 'Achievements:' }),
              ...exp.achievements.map(achievement => 
                new Paragraph({ text: `• ${achievement}` })
              ),
            ] : []),
          ]),
          new Paragraph({
            text: '\nSkills',
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({ 
            text: 'Technical Skills:',
            heading: HeadingLevel.HEADING_3,
          }),
          new Paragraph({ text: data.basic_analysis.skills.technical.join(', ') }),
          new Paragraph({ 
            text: 'Soft Skills:',
            heading: HeadingLevel.HEADING_3,
          }),
          new Paragraph({ text: data.basic_analysis.skills.soft.join(', ') }),
          new Paragraph({ 
            text: 'Languages:',
            heading: HeadingLevel.HEADING_3,
          }),
          new Paragraph({ text: data.basic_analysis.skills.languages.join(', ') }),

          new Paragraph({
            text: '\nCertifications',
            heading: HeadingLevel.HEADING_2,
          }),
          ...data.basic_analysis.certifications.flatMap(cert => [
            new Paragraph({
              text: cert.name,
              heading: HeadingLevel.HEADING_3,
            }),
            new Paragraph({ text: `Issuer: ${cert.issuer}` }),
            new Paragraph({ text: `Year: ${cert.year}` }),
          ]),

          new Paragraph({
            text: '\nCareer Analysis',
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            text: 'Strengths:',
            heading: HeadingLevel.HEADING_3,
          }),
          ...data.career_analysis.strengths.map(strength =>
            new Paragraph({ text: `• ${strength}` })
          ),
          new Paragraph({
            text: '\nWeaknesses:',
            heading: HeadingLevel.HEADING_3,
          }),
          ...data.career_analysis.weaknesses.map(weakness =>
            new Paragraph({ text: `• ${weakness}` })
          ),
          new Paragraph({
            text: '\nSuitable Positions:',
            heading: HeadingLevel.HEADING_3,
          }),
          ...data.career_analysis.career_matches.map(match => [
            new Paragraph({ text: `• ${match.name}` }),
            new Paragraph({ text: `  - Industry: ${match.industry}` }),
            new Paragraph({ text: `  - Required experience: ${match.required_experience} years` }),
            new Paragraph({ text: `  - Similarity score: ${(match.similarity_score * 100).toFixed(0)}%` }),
          ]).flat(),

          new Paragraph({
            text: '\nCV Quality Assessment',
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            text: 'Completeness:',
            heading: HeadingLevel.HEADING_3,
          }),
          new Paragraph({ text: `Score: ${data.quality_assessment.completeness.score * 10}/10` }),
          ...(data.quality_assessment.completeness.missing_sections.length > 0 ? [
            new Paragraph({ text: 'Missing sections:' }),
            ...data.quality_assessment.completeness.missing_sections.map(section =>
              new Paragraph({ text: `• ${section}` })
            ),
          ] : []),

          new Paragraph({
            text: '\nFormatting:',
            heading: HeadingLevel.HEADING_3,
          }),
          new Paragraph({ text: `Score: ${data.quality_assessment.formatting.score * 10}/10` }),
          ...data.quality_assessment.formatting.positive_points.map(point =>
            new Paragraph({ text: `✓ ${point}` })
          ),
          ...data.quality_assessment.formatting.issues.map(issue =>
            new Paragraph({ text: `• ${issue}` })
          ),

          ...(data.metrics ? [
            new Paragraph({
              text: '\nDetailed Metrics',
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({ text: `Word count: ${data.metrics.word_count}` }),
            new Paragraph({ text: `Sections count: ${data.metrics.sections_count}` }),
            new Paragraph({ text: 'Details:' }),
            new Paragraph({ text: `• Action verbs used: ${data.metrics.detailed.action_verbs_used}` }),
            new Paragraph({ text: `• Quantified achievements: ${data.metrics.detailed.quantified_achievements}` }),
            new Paragraph({ text: `• Average bullets/roles: ${data.metrics.detailed.avg_bullets_per_role}` }),
            new Paragraph({ text: `• Keyword density: ${data.metrics.detailed.keyword_density.toFixed(2)}%` }),
          ] : []),
        ]
      }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, 'CV_Analysis.docx');
  };

  return (
    <div>
      <div className="flex space-x-4 justify-end mb-4">
        <button
          onClick={() => handlePrint()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          In PDF
        </button>

        <PDFDownloadLink
          document={<PDFDocument data={data} />}
          fileName="CV_Analysis.pdf"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          {({ loading }) => (loading ? 'Đang tạo PDF...' : 'Tải PDF')}
        </PDFDownloadLink>

        <button
          onClick={exportToDocx}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          Tải DOCX
        </button>
      </div>

      <div style={{ display: 'none' }}>
        <PrintableContent ref={componentRef} data={data} />
      </div>
    </div>
  );
};

export default ExportCV;