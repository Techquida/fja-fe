// Type definitions for ResumeGenie platform

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  points: number;
  createdAt: string;
  referralCode: string;
  referredBy?: string;
  firstFreeUsed: boolean;
  streak: number;
  lastActiveDate: string;
}

export interface CVDocument {
  id: string;
  userId: string;
  name: string;
  originalContent: string;
  fixedContent?: string;
  jobDescription?: string;
  fixType?: 'basic' | 'smart' | 'full';
  matchScore?: number;
  improvements?: string[];
  createdAt: string;
  status: 'pending' | 'processing' | 'completed';
  fileType: 'pdf' | 'docx' | 'text';
}

export interface CoverLetter {
  id: string;
  userId: string;
  jobTitle: string;
  company: string;
  jobDescription: string;
  content: string;
  createdAt: string;
}

export interface InterviewPrep {
  id: string;
  userId: string;
  jobTitle: string;
  jobDescription: string;
  questions: InterviewQuestion[];
  tips: string[];
  createdAt: string;
}

export interface InterviewQuestion {
  question: string;
  suggestedAnswer: string;
  tips: string[];
}

export interface JobApplication {
  id: string;
  userId: string;
  cvId: string;
  coverLetterId?: string;
  jobTitle: string;
  company: string;
  jobDescription: string;
  appliedAt: string;
  status: 'applied' | 'reviewing' | 'interview' | 'rejected' | 'accepted';
  notes?: string;
}

export interface PointsTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'purchase' | 'referral' | 'welcome' | 'usage' | 'bonus';
  description: string;
  createdAt: string;
  balance: number;
}

export interface Referral {
  id: string;
  referrerId: string;
  referredEmail: string;
  status: 'pending' | 'completed';
  pointsEarned: number;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'promo';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface PricingPackage {
  id: string;
  price: number;
  points: number;
  bonus: number;
  popular?: boolean;
}

export type FixType = {
  id: 'basic' | 'smart' | 'full';
  name: string;
  description: string;
  points: number;
  features: string[];
};
