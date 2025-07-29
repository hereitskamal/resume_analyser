/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/types.ts
export interface ResumeAnalysis {
  overallScore: number;
  atsScore: number;
  readabilityScore: number;
  keywordDensity: number;
  strengths: string[];
  improvements: string[];
  missingSkills: string[];
  keywordMatching: KeywordMatching;
  sections: ResumeSections;
  industryFit: IndustryFit;
  competitorComparison: CompetitorComparison;
  summary: string;
  recommendations: Recommendation[];
}

export interface KeywordMatching {
  matched: string[];
  missing: string[];
  suggestions: string[];
}

export interface ResumeSections {
  contact: SectionAnalysis;
  summary: SectionAnalysis;
  experience: SectionAnalysis;
  education: SectionAnalysis;
  skills: SectionAnalysis;
  projects: SectionAnalysis;
}

export interface SectionAnalysis {
  present: boolean;
  score: number;
  feedback: string;
  improvements: string[];
}

export interface IndustryFit {
  detectedIndustry: string;
  confidence: number;
  suggestions: string[];
}

export interface CompetitorComparison {
  percentile: number;
  similarProfiles: number;
  benchmark: string;
}

export interface Recommendation {
  type: 'critical' | 'important' | 'nice-to-have';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
}

// API Response Types
export interface AnalysisResponse {
  message: string;
  success: boolean;
  analysis: ResumeAnalysis;
  id: string;
  provider: string;
  version?: string;
}

export interface AnalysisRequest {
  resumeText: string;
  jobDescription?: string;
  targetIndustry?: string;
}

// History Types
export interface ResumeHistory {
  id: string;
  overallScore: number;
  atsScore: number;
  readabilityScore: number;
  keywordDensity: number;
  industryFit: {
    detectedIndustry: string;
    confidence: number;
  };
  competitorComparison: {
    percentile: number;
    benchmark: string;
  };
  createdAt: string;
  preview: string;
  version?: string;
}

export interface HistoryResponse {
  success: boolean;
  analyses: ResumeHistory[];
  total?: number;
  page?: number;
  limit?: number;
}

// Job Matching Types
export interface JobMatchAnalysis {
  jobTitle: string;
  company?: string;
  matchScore: number;
  requiredSkills: string[];
  matchedSkills: string[];
  missingSkills: string[];
  salaryRange?: SalaryRange;
  recommendations: string[];
  fitLevel: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
  location?: string;
}

// Template Types
export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  industry: IndustryType;
  level: ExperienceLevel;
  preview: string;
  features: string[];
  sections: string[];
  atsOptimized: boolean;
  downloadUrl?: string;
  rating: number;
  downloads: number;
}

// Enum Types
export type IndustryType = 
  | 'software' 
  | 'marketing' 
  | 'finance' 
  | 'design' 
  | 'sales' 
  | 'healthcare' 
  | 'education' 
  | 'consulting' 
  | 'general';

export type ExperienceLevel = 
  | 'entry' 
  | 'junior' 
  | 'mid' 
  | 'senior' 
  | 'lead' 
  | 'executive';

// Dashboard Types
export interface DashboardTab {
  id: string;
  label: string;
  icon: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component?: React.ComponentType<any>;
}

export interface ScoreCardProps {
  title: string;
  score: number;
  maxScore: number;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  icon: string;
  description: string;
  suffix?: string;
  trend?: 'up' | 'down' | 'stable';
  previousScore?: number;
}

// Upload Types
export interface UploadProgress {
  stage: 'uploading' | 'processing' | 'analyzing' | 'complete';
  percentage: number;
  message: string;
}

export interface FileUploadResult {
  success: boolean;
  text?: string;
  error?: string;
  fileName?: string;
  fileSize?: number;
}

// Settings Types
export interface UserPreferences {
  targetIndustry?: IndustryType;
  experienceLevel?: ExperienceLevel;
  preferredTemplates: string[];
  analysisHistory: boolean;
  emailNotifications: boolean;
  privacySettings: PrivacySettings;
}

export interface PrivacySettings {
  saveResumes: boolean;
  shareAnalytics: boolean;
  marketingEmails: boolean;
}

// Benchmark Types
export interface BenchmarkData {
  metric: string;
  your: number | string;
  average: number | string;
  percentile: number;
  status: 'excellent' | 'good' | 'average' | 'needs-improvement';
  trend?: 'improving' | 'declining' | 'stable';
}

export interface CompetitiveInsight {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  category: 'content' | 'keywords' | 'formatting' | 'sections';
}

// Industry Data Types
export interface IndustryTrend {
  trend: string;
  impact: 'high' | 'medium' | 'low';
  timeframe: string;
  source?: string;
}

export interface IndustryKeywords {
  technical: string[];
  soft: string[];
  trending: string[];
  deprecated: string[];
}

// Error Types
export interface ApiError {
  success: false;
  message: string;
  error?: string;
  code?: string;
  details?: Record<string, any>;
}

// Success Response Type
export interface ApiSuccess<T = any> {
  success: true;
  data: T;
  message?: string;
  metadata?: Record<string, any>;
}

// Generic API Response
export type ApiResponse<T = any> = ApiSuccess<T> | ApiError;

// Component Props Types
export interface DashboardProps {
  analysis: ResumeAnalysis;
  onNewAnalysis: () => void;
  onExport?: () => void;
  onShare?: () => void;
}

export interface RecommendationsListProps {
  recommendations: Recommendation[];
  onApplyRecommendation?: (recommendation: Recommendation) => void;
}

export interface IndustryInsightsProps {
  analysis: ResumeAnalysis;
  trends?: IndustryTrend[];
}

export interface CompetitorBenchmarkProps {
  analysis: ResumeAnalysis;
  benchmarkData?: BenchmarkData[];
}

export interface UploadComponentProps {
  onAnalysisComplete: (result: AnalysisResponse) => void;
  onProgress?: (progress: UploadProgress) => void;
  acceptedFormats?: string[];
  maxFileSize?: number;
}

// Rate Limiting Types
export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: Date;
}

// Database Document Types
export interface AnalysisDocument {
  _id?: string;
  resumeText: string;
  jobDescription?: string;
  targetIndustry?: string;
  analysis: ResumeAnalysis;
  createdAt: Date;
  updatedAt?: Date;
  ipAddress: string;
  userAgent: string;
  aiProvider: string;
  version: string;
  userId?: string;
  sessionId?: string;
}

// Export/Import Types
export interface ExportOptions {
  format: 'pdf' | 'json' | 'csv';
  sections: string[];
  includeRecommendations: boolean;
  includeAnalysis: boolean;
}

export interface ExportResult {
  success: boolean;
  downloadUrl?: string;
  error?: string;
  format: string;
  size?: number;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

// Search and Filter Types
export interface SearchFilters {
  industry?: IndustryType[];
  experienceLevel?: ExperienceLevel[];
  scoreRange?: [number, number];
  dateRange?: [Date, Date];
  keywords?: string[];
}

export interface SearchResult {
  analyses: ResumeHistory[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// A/B Testing Types
export interface ExperimentVariant {
  id: string;
  name: string;
  description: string;
  weight: number;
  config: Record<string, any>;
}

export interface ExperimentResult {
  variant: string;
  config: Record<string, any>;
  tracking: {
    experimentId: string;
    userId: string;
    timestamp: Date;
  };
}
