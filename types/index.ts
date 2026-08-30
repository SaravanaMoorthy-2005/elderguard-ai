// ElderGuard AI - Core Type Definitions

export type RiskLevel = 'safe' | 'caution' | 'suspicious' | 'high-risk';

export type ScamIntent =
  | 'SAFE_CONVERSATION'
  | 'BANKING_DISCUSSION'
  | 'OTP_REQUEST'
  | 'PIN_REQUEST'
  | 'CREDENTIAL_REQUEST'
  | 'PAYMENT_REQUEST'
  | 'REMOTE_ACCESS_REQUEST'
  | 'IMPERSONATION'
  | 'THREAT'
  | 'URGENCY'
  | 'SENSITIVE_DISCLOSURE'
  | 'POSSIBLE_SCAM';

export interface ThreatFactor {
  id: string;
  label: string;
  score: number;
  detected: boolean;
  description: string;
}

export interface RiskAnalysis {
  score: number;
  level: RiskLevel;
  intents: ScamIntent[];
  factors: ThreatFactor[];
  redactedTranscript: string;
  sensitiveDetected: boolean;
  timestamp: number;
}

export interface TranscriptEntry {
  speaker: 'caller' | 'user' | 'system';
  text: string;
  timestamp: number;
  redacted?: boolean;
}

export interface CallSession {
  id: string;
  startTime: number;
  endTime?: number;
  callerNumber: string;
  status: 'ringing' | 'active' | 'ended' | 'terminated';
  transcript: TranscriptEntry[];
  riskHistory: number[];
  finalRisk?: number;
  terminated?: boolean;
  guardianAlerted?: boolean;
  incidentSummary?: IncidentSummary;
}

export interface IncidentSummary {
  callId: string;
  timestamp: number;
  duration: number;
  finalRisk: number;
  riskLevel: RiskLevel;
  detectedThreats: string[];
  action: string;
  guardianAlerted: boolean;
  sensitiveRedacted: boolean;
}

export interface GuardianAlert {
  id: string;
  timestamp: number;
  riskScore: number;
  riskLevel: RiskLevel;
  threatCategories: string[];
  action: string;
  resolved: boolean;
}

export interface DashboardStats {
  callsProtected: number;
  threatsDetected: number;
  threatsPrevented: number;
  highRiskCalls: number;
  guardianAlerts: number;
}

export interface AppSettings {
  language: 'en' | 'ta' | 'hi';
  textSize: 'small' | 'medium' | 'large' | 'extra-large';
  highContrast: boolean;
  voiceAlerts: boolean;
  autoEnd: boolean;
  riskThreshold: number;
  simpleMode: boolean;
}

export interface DemoScenario {
  id: string;
  name: string;
  description: string;
  expectedRisk: RiskLevel;
  expectedScore: number;
  conversation: DemoLine[];
}

export interface DemoLine {
  speaker: 'caller' | 'user';
  text: string;
  delay: number; // ms
}
