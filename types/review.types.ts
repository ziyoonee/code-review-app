/**
 * Review-related type definitions
 */

export type SeverityLevel = 'info' | 'minor' | 'major' | 'critical';
export type ReviewStyle = 'detail' | 'bug' | 'refactor' | 'test';
export type SuggestionStatus = 'pending' | 'accepted' | 'rejected';
export type ReviewStatus = 'pending' | 'processing' | 'partial' | 'complete' | 'error';

export interface CodeRange {
  start: number;
  end: number;
  startColumn?: number;
  endColumn?: number;
}

export interface SuggestionFix {
  diff: string;
  description?: string;
}

export interface Suggestion {
  id: string;
  severity: SeverityLevel;
  title: string;
  rationale: string;
  range: CodeRange;
  fix?: SuggestionFix;
  tags: string[];
  confidence: number;
  status: SuggestionStatus;
  createdAt: Date;
  appliedAt?: Date;
}

export interface Review {
  id: string;
  code: string;
  language: string;
  style: ReviewStyle;
  status: ReviewStatus;
  suggestions: Suggestion[];
  summary?: string;
  metrics?: ReviewMetrics;
  createdAt: Date;
  completedAt?: Date;
  error?: ReviewError;
}

export interface ReviewMetrics {
  totalSuggestions: number;
  acceptedSuggestions: number;
  rejectedSuggestions: number;
  processingTime: number;
  modelName: string;
  codeSize: number;
}

export interface ReviewError {
  code: 'MODEL_TIMEOUT' | 'SCHEMA_INVALID' | 'PATCH_CONFLICT' | 'RATE_LIMIT' | 'NETWORK_ERROR';
  message: string;
  retryable: boolean;
}

export interface ReviewSession {
  id: string;
  title: string;
  language: string;
  createdAt: Date;
  suggestionsCount: number;
}

export interface FilterState {
  severity: SeverityLevel[];
  tags: string[];
  status: SuggestionStatus[];
}

export interface ReviewStartRequest {
  code: string;
  language?: string;
  style: ReviewStyle;
}

export interface SuggestionDecision {
  suggestionId: string;
  decision: 'accept' | 'reject';
  timestamp: Date;
}

export interface ExportOptions {
  type: 'patch' | 'zip';
  sessionId: string;
  includeRejected?: boolean;
}