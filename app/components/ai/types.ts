export interface UserPhoto {
  file: File;
  preview: string;
  timestamp: number;
}

export interface QuestionnaireData {
  skinTone: 'fair' | 'medium' | 'olive' | 'dark';
  lifestyle: 'professional' | 'creative' | 'casual' | 'glamorous';
  maintenance: 'low' | 'medium' | 'high';
  currentHairColor: 'blonde' | 'brunette' | 'black' | 'red' | 'other';
  desiredVibe: 'natural' | 'bold' | 'subtle' | 'dramatic';
  experience: 'first-time' | 'occasional' | 'regular' | 'expert';
}

export interface ColorRecommendation {
  id: string;
  name: string;
  description: string;
  hexCode: string;
  confidence: number;
  category: 'highlights' | 'full-color' | 'balayage' | 'ombre';
  maintenanceLevel: 'low' | 'medium' | 'high';
  process: string;
  estimatedTime: string;
  price: string;
  suitabilityScore: number;
}

export interface AIAnalysisStep {
  id: string;
  message: string;
  progress: number;
  duration: number;
}

export type WorkflowStep = 'upload' | 'questionnaire' | 'processing' | 'results';