// lib/advanced-analyzer.ts
import { HfInference } from '@huggingface/inference';
import { ResumeAnalysis, SectionAnalysis, Recommendation } from './types';

// const hf = new HfInference(process.env.HUGGINGFACE_API_TOKEN);

// Industry keywords database
export const INDUSTRY_KEYWORDS = {
  'software': ['javascript', 'python', 'react', 'node', 'aws', 'docker', 'git', 'api', 'database'],
  'marketing': ['seo', 'analytics', 'campaign', 'social media', 'content', 'brand', 'conversion'],
  'finance': ['excel', 'financial modeling', 'analysis', 'risk', 'bloomberg', 'trading', 'compliance'],
  'design': ['figma', 'adobe', 'ui/ux', 'typography', 'branding', 'prototype', 'user research'],
  'sales': ['crm', 'pipeline', 'quotas', 'b2b', 'negotiation', 'relationship', 'revenue']
};

const ATS_KEYWORDS = [
  'experience', 'skills', 'education', 'achievements', 'responsibilities',
  'managed', 'developed', 'implemented', 'created', 'improved', 'increased',
  'reduced', 'led', 'collaborated', 'analyzed', 'designed'
];

export async function analyzeResumeAdvanced(
  resumeText: string, 
  jobDescription?: string,
  targetIndustry?: string
): Promise<ResumeAnalysis> {
  const text = resumeText.toLowerCase();
  
  // Detect industry if not provided
  const detectedIndustry = targetIndustry || detectIndustry(text);
  
  // Analyze sections
  const sections = analyzeSections(resumeText);
  
  // Calculate scores
  const scores = calculateAdvancedScores(resumeText, sections, detectedIndustry);
  
  // Generate recommendations
  const recommendations = generateRecommendations(resumeText, sections, scores);
  
  // Keyword analysis
  const keywordAnalysis = analyzeKeywords(text, detectedIndustry, jobDescription);
  
  // Industry fit analysis
  const industryFit = analyzeIndustryFit(text, detectedIndustry);
  
  // Competitor comparison (simulated)
  const competitorComparison = generateCompetitorComparison(scores.overallScore);

  return {
    overallScore: scores.overallScore,
    atsScore: scores.atsScore,
    readabilityScore: scores.readabilityScore,
    keywordDensity: scores.keywordDensity,
    strengths: generateStrengths(resumeText, sections),
    improvements: generateImprovements(resumeText, sections),
    missingSkills: keywordAnalysis.missing.slice(0, 5),
    keywordMatching: keywordAnalysis,
    sections,
    industryFit,
    competitorComparison,
    summary: generateAdvancedSummary(scores, sections, industryFit),
    recommendations
  };
}

function detectIndustry(text: string): string {
  let maxScore = 0;
  let detectedIndustry = 'general';
  
  Object.entries(INDUSTRY_KEYWORDS).forEach(([industry, keywords]) => {
    const score = keywords.reduce((acc, keyword) => {
      return acc + (text.includes(keyword) ? 1 : 0);
    }, 0);
    
    if (score > maxScore) {
      maxScore = score;
      detectedIndustry = industry;
    }
  });
  
  return detectedIndustry;
}

function analyzeSections(resumeText: string): ResumeAnalysis['sections'] {
  const text = resumeText.toLowerCase();
  
  return {
    contact: analyzeContactSection(text),
    summary: analyzeSummarySection(text),
    experience: analyzeExperienceSection(text),
    education: analyzeEducationSection(text),
    skills: analyzeSkillsSection(text),
    projects: analyzeProjectsSection(text)
  };
}

function analyzeContactSection(text: string): SectionAnalysis {
  const hasEmail = /@/.test(text);
  const hasPhone = /\d{3}[-.]?\d{3}[-.]?\d{4}/.test(text);
  const hasLinkedIn = text.includes('linkedin');
  const hasLocation = text.includes('city') || text.includes('state');
  
  const score = [hasEmail, hasPhone, hasLinkedIn, hasLocation].filter(Boolean).length * 2.5;
  
  return {
    present: hasEmail || hasPhone,
    score: Math.min(score, 10),
    feedback: score >= 7 ? 'Contact information is comprehensive' : 'Contact section needs improvement',
    improvements: [
      ...(!hasEmail ? ['Add professional email address'] : []),
      ...(!hasPhone ? ['Include phone number'] : []),
      ...(!hasLinkedIn ? ['Add LinkedIn profile URL'] : []),
      ...(!hasLocation ? ['Include location (city, state)'] : [])
    ]
  };
}

function calculateAdvancedScores(
  resumeText: string, 
  sections: ResumeAnalysis['sections'], 
  industry: string
) {
  const text = resumeText.toLowerCase();
  const wordCount = resumeText.split(/\s+/).length;
  
  // Overall score calculation
  const sectionScores = Object.values(sections).map(s => s.score);
  const avgSectionScore = sectionScores.reduce((a, b) => a + b, 0) / sectionScores.length;
  
  // ATS score
  const atsKeywordCount = ATS_KEYWORDS.filter(keyword => text.includes(keyword)).length;
  const atsScore = Math.min((atsKeywordCount / ATS_KEYWORDS.length) * 10, 10);
  
  // Readability score (based on sentence length, word complexity)
  const sentences = resumeText.split(/[.!?]+/).length;
  const avgWordsPerSentence = wordCount / sentences;
  const readabilityScore = Math.max(10 - (avgWordsPerSentence / 5), 1);
  
  // Keyword density
  const industryKeywords: string[] = INDUSTRY_KEYWORDS[industry as keyof typeof INDUSTRY_KEYWORDS] || [];
  const keywordCount = industryKeywords.filter((keyword: string) => text.includes(keyword)).length;
  const keywordDensity = (keywordCount / industryKeywords.length) * 100;
  
  return {
    overallScore: Math.round(avgSectionScore),
    atsScore: Math.round(atsScore),
    readabilityScore: Math.round(readabilityScore),
    keywordDensity: Math.round(keywordDensity)
  };
}

// lib/advanced-analyzer.ts (continued with all helper functions)

function analyzeSummarySection(text: string): SectionAnalysis {
  const hasSummary = text.includes('summary') || text.includes('objective') || text.includes('profile');
  const hasCareerGoal = text.includes('seeking') || text.includes('looking') || text.includes('passionate');
  const hasKeySkills = text.includes('experienced') || text.includes('skilled') || text.includes('proficient');
  
  const score = [hasSummary, hasCareerGoal, hasKeySkills].filter(Boolean).length * 3.33;
  
  return {
    present: hasSummary,
    score: Math.min(score, 10),
    feedback: score >= 7 ? 'Professional summary is well-crafted' : 'Consider adding a compelling professional summary',
    improvements: [
      ...(!hasSummary ? ['Add a professional summary or objective statement'] : []),
      ...(!hasCareerGoal ? ['Include clear career goals and aspirations'] : []),
      ...(!hasKeySkills ? ['Highlight key skills and expertise in summary'] : [])
    ]
  };
}

function analyzeExperienceSection(text: string): SectionAnalysis {
  const hasExperience = text.includes('experience') || text.includes('work') || text.includes('employment');
  const hasJobTitles = text.includes('manager') || text.includes('developer') || text.includes('analyst') || text.includes('coordinator');
  const hasCompanies = text.includes('company') || text.includes('inc') || text.includes('corp') || text.includes('ltd');
  const hasDates = /\d{4}/.test(text) || text.includes('present') || text.includes('current');
  const hasAchievements = text.includes('achieved') || text.includes('improved') || text.includes('increased') || text.includes('%');
  
  const score = [hasExperience, hasJobTitles, hasCompanies, hasDates, hasAchievements].filter(Boolean).length * 2;
  
  return {
    present: hasExperience,
    score: Math.min(score, 10),
    feedback: score >= 8 ? 'Work experience section is comprehensive' : 'Work experience needs more detail',
    improvements: [
      ...(!hasExperience ? ['Add work experience section'] : []),
      ...(!hasJobTitles ? ['Include specific job titles and roles'] : []),
      ...(!hasCompanies ? ['Add company names and details'] : []),
      ...(!hasDates ? ['Include employment dates'] : []),
      ...(!hasAchievements ? ['Add quantifiable achievements and results'] : [])
    ]
  };
}

function analyzeEducationSection(text: string): SectionAnalysis {
  const hasEducation = text.includes('education') || text.includes('degree') || text.includes('university') || text.includes('college');
  const hasDegree = text.includes('bachelor') || text.includes('master') || text.includes('phd') || text.includes('diploma');
  const hasInstitution = text.includes('university') || text.includes('college') || text.includes('institute');
  const hasGradYear = /\d{4}/.test(text) && (text.includes('graduated') || text.includes('degree'));
  const hasGPA = text.includes('gpa') || text.includes('grade') || text.includes('honors');
  
  const score = [hasEducation, hasDegree, hasInstitution, hasGradYear, hasGPA].filter(Boolean).length * 2;
  
  return {
    present: hasEducation,
    score: Math.min(score, 10),
    feedback: score >= 6 ? 'Education section is well-documented' : 'Education section could be more detailed',
    improvements: [
      ...(!hasEducation ? ['Add education section'] : []),
      ...(!hasDegree ? ['Specify degree type and field of study'] : []),
      ...(!hasInstitution ? ['Include institution names'] : []),
      ...(!hasGradYear ? ['Add graduation dates'] : []),
      ...(!hasGPA ? ['Consider adding GPA if above 3.5 or relevant honors'] : [])
    ]
  };
}

function analyzeSkillsSection(text: string): SectionAnalysis {
  const hasSkills = text.includes('skills') || text.includes('competencies') || text.includes('proficiencies');
  const hasTechnicalSkills = text.includes('programming') || text.includes('software') || text.includes('technical');
  const hasSoftSkills = text.includes('communication') || text.includes('leadership') || text.includes('teamwork');
  const hasTools = text.includes('microsoft') || text.includes('adobe') || text.includes('google') || text.includes('salesforce');
  const hasLanguages = text.includes('language') || text.includes('spanish') || text.includes('french') || text.includes('bilingual');
  
  const score = [hasSkills, hasTechnicalSkills, hasSoftSkills, hasTools, hasLanguages].filter(Boolean).length * 2;
  
  return {
    present: hasSkills,
    score: Math.min(score, 10),
    feedback: score >= 6 ? 'Skills section showcases diverse competencies' : 'Skills section needs expansion',
    improvements: [
      ...(!hasSkills ? ['Add a dedicated skills section'] : []),
      ...(!hasTechnicalSkills ? ['Include relevant technical skills'] : []),
      ...(!hasSoftSkills ? ['Add important soft skills'] : []),
      ...(!hasTools ? ['List software tools and platforms you know'] : []),
      ...(!hasLanguages ? ['Include language proficiencies if applicable'] : [])
    ]
  };
}

function analyzeProjectsSection(text: string): SectionAnalysis {
  const hasProjects = text.includes('project') || text.includes('portfolio') || text.includes('personal work');
  const hasProjectTitles = text.includes('built') || text.includes('developed') || text.includes('created');
  const hasTechnologies = text.includes('using') || text.includes('with') || text.includes('technologies');
  const hasResults = text.includes('result') || text.includes('outcome') || text.includes('impact');
  const hasLinks = text.includes('github') || text.includes('demo') || text.includes('live') || text.includes('http');
  
  const score = [hasProjects, hasProjectTitles, hasTechnologies, hasResults, hasLinks].filter(Boolean).length * 2;
  
  return {
    present: hasProjects,
    score: Math.min(score, 10),
    feedback: score >= 6 ? 'Projects section demonstrates practical experience' : 'Consider adding relevant projects',
    improvements: [
      ...(!hasProjects ? ['Add a projects section to showcase your work'] : []),
      ...(!hasProjectTitles ? ['Include specific project names and descriptions'] : []),
      ...(!hasTechnologies ? ['List technologies and tools used in projects'] : []),
      ...(!hasResults ? ['Describe project outcomes and impact'] : []),
      ...(!hasLinks ? ['Add links to GitHub repos or live demos'] : [])
    ]
  };
}

function generateRecommendations(
  resumeText: string,
  sections: ResumeAnalysis['sections'],
  scores: { overallScore: number; atsScore: number; readabilityScore: number; keywordDensity: number }
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  
  // Critical recommendations (score-based)
  if (scores.overallScore < 6) {
    recommendations.push({
      type: 'critical',
      title: 'Resume Needs Major Improvements',
      description: 'Your resume score is below average. Focus on strengthening core sections and adding more relevant content.',
      impact: 'high',
      category: 'Overall Quality'
    });
  }
  
  if (scores.atsScore < 5) {
    recommendations.push({
      type: 'critical',
      title: 'Poor ATS Compatibility',
      description: 'Your resume may not pass Applicant Tracking Systems. Add more industry keywords and action verbs.',
      impact: 'high',
      category: 'ATS Optimization'
    });
  }
  
  // Section-based recommendations
  Object.entries(sections).forEach(([sectionName, section]) => {
    if (!section.present) {
      recommendations.push({
        type: 'important',
        title: `Missing ${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)} Section`,
        description: `Add a ${sectionName} section to provide comprehensive information about your background.`,
        impact: 'medium',
        category: 'Content Structure'
      });
    } else if (section.score < 5) {
      recommendations.push({
        type: 'important',
        title: `Improve ${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)} Section`,
        description: section.improvements[0] || `Enhance your ${sectionName} section with more detailed information.`,
        impact: 'medium',
        category: 'Content Quality'
      });
    }
  });
  
  // Keyword density recommendations
  if (scores.keywordDensity < 30) {
    recommendations.push({
      type: 'important',
      title: 'Low Keyword Density',
      description: 'Include more industry-specific keywords to improve relevance and searchability.',
      impact: 'medium',
      category: 'SEO & Keywords'
    });
  }
  
  // Readability recommendations
  if (scores.readabilityScore < 6) {
    recommendations.push({
      type: 'nice-to-have',
      title: 'Improve Readability',
      description: 'Use shorter sentences and simpler language to improve readability.',
      impact: 'low',
      category: 'Writing Style'
    });
  }
  
  // General improvements
  const text = resumeText.toLowerCase();
  if (!text.includes('http') && !text.includes('portfolio')) {
    recommendations.push({
      type: 'nice-to-have',
      title: 'Add Portfolio Links',
      description: 'Include links to your portfolio, GitHub, or professional profiles.',
      impact: 'medium',
      category: 'Professional Presence'
    });
  }
  
  if (resumeText.length < 1000) {
    recommendations.push({
      type: 'important',
      title: 'Expand Resume Content',
      description: 'Your resume is quite short. Add more details about your experience and achievements.',
      impact: 'high',
      category: 'Content Length'
    });
  }
  
  return recommendations.slice(0, 8); // Limit to top 8 recommendations
}

function analyzeKeywords(
  text: string,
  industry: string,
  jobDescription?: string
): { matched: string[]; missing: string[]; suggestions: string[] } {
  const industryKeywords: string[] = INDUSTRY_KEYWORDS[industry as keyof typeof INDUSTRY_KEYWORDS] || [];
  const jobKeywords = jobDescription ? extractKeywordsFromJobDescription(jobDescription) : [];
  const allRelevantKeywords = [...new Set([...industryKeywords, ...jobKeywords])];
  
  const matched = allRelevantKeywords.filter(keyword => text.includes(keyword.toLowerCase()));
  const missing = allRelevantKeywords.filter(keyword => !text.includes(keyword.toLowerCase()));
  
  // Generate keyword suggestions based on industry and common gaps
  const suggestions = generateKeywordSuggestions(industry, matched, missing);
  
  return { matched, missing: missing.slice(0, 10), suggestions };
}

function extractKeywordsFromJobDescription(jobDescription: string): string[] {
  const text = jobDescription.toLowerCase();
  const commonKeywords = [
    // Technical skills
    'javascript', 'python', 'react', 'node', 'sql', 'aws', 'docker', 'kubernetes',
    'git', 'api', 'database', 'mongodb', 'postgresql', 'redis', 'elasticsearch',
    
    // Soft skills
    'leadership', 'communication', 'teamwork', 'problem-solving', 'analytical',
    'project management', 'agile', 'scrum', 'collaboration', 'mentoring',
    
    // Business skills
    'strategy', 'analysis', 'reporting', 'optimization', 'automation', 'testing',
    'deployment', 'monitoring', 'security', 'performance', 'scalability'
  ];
  
  return commonKeywords.filter(keyword => text.includes(keyword));
}

function generateKeywordSuggestions(industry: string, matched: string[], missing: string[]): string[] {
  const suggestions: string[] = [];
  
  // Industry-specific suggestions
  const industrySpecificSuggestions = {
    'software': ['microservices', 'ci/cd', 'testing', 'debugging', 'code review'],
    'marketing': ['a/b testing', 'customer acquisition', 'retention', 'roi', 'kpi'],
    'finance': ['forecasting', 'budgeting', 'valuation', 'portfolio management', 'derivatives'],
    'design': ['wireframing', 'user testing', 'accessibility', 'design systems', 'prototyping'],
    'sales': ['lead generation', 'customer success', 'account management', 'forecasting', 'closing']
  };
  
  const specificSuggestions =
    industrySpecificSuggestions[industry as keyof typeof industrySpecificSuggestions] || [];
  suggestions.push(...specificSuggestions.filter(s => !matched.includes(s)));
  
  // Common professional keywords
  const commonSuggestions = [
    'results-driven', 'cross-functional', 'stakeholder management', 'process improvement',
    'data-driven', 'innovative', 'strategic thinking', 'customer-focused'
  ];
  
  suggestions.push(...commonSuggestions.filter(s => !matched.includes(s)));
  
  return suggestions.slice(0, 8);
}

function analyzeIndustryFit(text: string, detectedIndustry: string): {
  detectedIndustry: string;
  confidence: number;
  suggestions: string[];
} {
  const industryKeywords = INDUSTRY_KEYWORDS[detectedIndustry as keyof typeof INDUSTRY_KEYWORDS] || [];
  const matchedKeywords = industryKeywords.filter(keyword => text.includes(keyword));
  const confidence = (matchedKeywords.length / industryKeywords.length) * 100;
  
  const suggestions = [];
  if (confidence < 50) {
    suggestions.push(`Add more ${detectedIndustry}-specific keywords and terminology`);
    suggestions.push(`Include relevant tools and technologies used in ${detectedIndustry}`);
    suggestions.push(`Highlight ${detectedIndustry} industry experience and projects`);
  }
  
  if (confidence < 30) {
    suggestions.push(`Consider targeting a different industry that better matches your background`);
  }
  
  return {
    detectedIndustry,
    confidence: Math.round(confidence),
    suggestions
  };
}

function generateCompetitorComparison(overallScore: number): {
  percentile: number;
  similarProfiles: number;
  benchmark: string;
} {
  // Simulated competitor data based on score
  let percentile = 50;
  let benchmark = 'Average';
  
  if (overallScore >= 9) {
    percentile = 95;
    benchmark = 'Exceptional';
  } else if (overallScore >= 8) {
    percentile = 85;
    benchmark = 'Excellent';
  } else if (overallScore >= 7) {
    percentile = 70;
    benchmark = 'Good';
  } else if (overallScore >= 6) {
    percentile = 55;
    benchmark = 'Above Average';
  } else if (overallScore >= 5) {
    percentile = 40;
    benchmark = 'Below Average';
  } else {
    percentile = 20;
    benchmark = 'Needs Improvement';
  }
  
  const similarProfiles = Math.floor(Math.random() * 1000) + 500; // Simulated data
  
  return {
    percentile,
    similarProfiles,
    benchmark
  };
}

function generateStrengths(resumeText: string, sections: ResumeAnalysis['sections']): string[] {
  const strengths: string[] = [];
  const text = resumeText.toLowerCase();
  
  // Section-based strengths
  Object.entries(sections).forEach(([sectionName, section]) => {
    if (section.score >= 8) {
      strengths.push(`Excellent ${sectionName} section with comprehensive information`);
    }
  });
  
  // Content-based strengths
  if (text.includes('%') || text.includes('increased') || text.includes('improved')) {
    strengths.push('Quantified achievements with measurable results');
  }
  
  if (text.includes('led') || text.includes('managed') || text.includes('supervised')) {
    strengths.push('Demonstrates leadership and management experience');
  }
  
  if (text.includes('project') && text.includes('team')) {
    strengths.push('Shows collaborative project experience');
  }
  
  if (resumeText.length > 1500) {
    strengths.push('Comprehensive and detailed professional presentation');
  }
  
  if (text.includes('certification') || text.includes('certified')) {
    strengths.push('Professional certifications enhance credibility');
  }
  
  // Default strengths if none found
  const defaultStrengths = [
    'Professional presentation and formatting',
    'Clear communication of qualifications',
    'Relevant industry experience highlighted',
    'Strong technical skill set demonstrated',
    'Professional development and growth shown'
  ];
  
  // Ensure we have at least 3 strengths
  while (strengths.length < 3) {
    strengths.push(defaultStrengths[strengths.length % defaultStrengths.length]);
  }
  
  return strengths.slice(0, 5);
}

function generateImprovements(resumeText: string, sections: ResumeAnalysis['sections']): string[] {
  const improvements: string[] = [];
  const text = resumeText.toLowerCase();
  
  // Section-based improvements
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Object.entries(sections).forEach(([sectionName, section]) => {
    if (section.score < 6 && section.improvements.length > 0) {
      improvements.push(section.improvements[0]);
    }
  });
  
  // Content-based improvements
  if (!text.includes('%') && !text.includes('increased') && !text.includes('reduced')) {
    improvements.push('Add quantifiable achievements with specific metrics and percentages');
  }
  
  if (!text.includes('award') && !text.includes('recognition') && !text.includes('achievement')) {
    improvements.push('Include notable awards, recognitions, or achievements');
  }
  
  if (resumeText.length < 1000) {
    improvements.push('Expand content with more detailed descriptions and examples');
  }
  
  if (!text.includes('volunteer') && !text.includes('community')) {
    improvements.push('Consider adding volunteer work or community involvement');
  }
  
  if (!text.includes('http') && !text.includes('github') && !text.includes('portfolio')) {
    improvements.push('Add portfolio links or professional online presence');
  }
  
  // Default improvements if none found
  const defaultImprovements = [
    'Optimize with more industry-specific keywords',
    'Use stronger action verbs to describe accomplishments',
    'Include a professional summary at the top',
    'Add more context about company size and industry',
    'Highlight transferable skills for career changes'
  ];
  
  // Ensure we have at least 3 improvements
  while (improvements.length < 3) {
    improvements.push(defaultImprovements[improvements.length % defaultImprovements.length]);
  }
  
  return improvements.slice(0, 5);
}

function generateAdvancedSummary(
  scores: { overallScore: number; atsScore: number; readabilityScore: number; keywordDensity: number },
  sections: ResumeAnalysis['sections'],
  industryFit: { detectedIndustry: string; confidence: number; suggestions: string[] }
): string {
  let summary = `Your resume receives an overall score of ${scores.overallScore}/10, `;
  
  // Overall assessment
  if (scores.overallScore >= 8) {
    summary += 'indicating an excellent professional presentation that should perform well in competitive job markets. ';
  } else if (scores.overallScore >= 6) {
    summary += 'showing a solid foundation with room for strategic improvements to enhance competitiveness. ';
  } else {
    summary += 'suggesting significant opportunities for improvement to meet current industry standards. ';
  }
  
  // ATS compatibility
  summary += `Your ATS compatibility score of ${scores.atsScore}/10 `;
  if (scores.atsScore >= 7) {
    summary += 'indicates strong keyword optimization for applicant tracking systems. ';
  } else {
    summary += 'suggests the need for better keyword integration to pass initial screening filters. ';
  }
  
  // Industry fit
  summary += `The analysis detected a ${industryFit.confidence}% fit for the ${industryFit.detectedIndustry} industry. `;
  if (industryFit.confidence >= 70) {
    summary += 'Your background aligns well with industry expectations. ';
  } else {
    summary += 'Consider strengthening industry-specific keywords and relevant experience. ';
  }
  
  // Section analysis
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const strongSections = Object.entries(sections).filter(([_, section]) => section.score >= 8);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const weakSections = Object.entries(sections).filter(([_, section]) => section.score < 5);
  
  if (strongSections.length > 0) {
    summary += `Your strongest sections include ${strongSections.map(([name]) => name).join(', ')}, which effectively showcase your qualifications. `;
  }
  
  if (weakSections.length > 0) {
    summary += `Priority improvements should focus on ${weakSections.map(([name]) => name).join(', ')} sections. `;
  }
  
  // Final recommendations
  summary += 'Focus on adding quantifiable achievements, optimizing for relevant keywords, and ensuring all sections provide comprehensive information about your professional background.';
  
  return summary;
}

// Fix the typo in calculateAdvancedScores function
// Replace "atsScore: Math.round(ats Core)," with:
// atsScore: Math.round(atsScore),

