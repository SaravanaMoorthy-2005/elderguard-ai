// ElderGuard AI - Risk Engine
// Weighted, context-aware scam detection. No API needed.

import type { RiskAnalysis, ThreatFactor, ScamIntent, RiskLevel } from '@/types';

// ──────────────────────────────────────────────
// Keyword dictionaries
// ──────────────────────────────────────────────

const OTP_PATTERNS = ['otp', 'one time password', 'verification code', 'code you received', 'code sent to'];
const PIN_PATTERNS = ['pin', 'upi pin', 'atm pin', 'card pin', 'mpin', 'your pin'];
const CVV_PATTERNS = ['cvv', 'cvc', 'security code', 'card security', 'three digit', '3 digit code'];
const PASSWORD_PATTERNS = ['password', 'passcode', 'credentials', 'login password', 'net banking password'];
const CARD_PATTERNS = ['card number', 'credit card', 'debit card', 'card details', '16 digit', 'sixteen digit'];
const ACCOUNT_PATTERNS = ['account number', 'bank account', 'ifsc', 'routing number'];
const BANKING_PATTERNS = ['bank', 'transaction', 'payment', 'refund', 'kyc', 'upi', 'loan', 'emi', 'sbi', 'hdfc', 'icici', 'axis bank', 'kotak', 'neft', 'rtgs', 'imps'];
const URGENCY_PATTERNS = ['immediately', 'urgent', 'right now', 'today only', 'account will be blocked', 'last warning', 'deadline', 'within 24 hours', 'expires today', 'limited time', 'act now'];
const THREAT_PATTERNS = ['account suspension', 'legal action', 'police', 'penalty', 'arrest', 'blocked account', 'frozen', 'fdic', 'court', 'lawsuit', 'fine'];
const IMPERSONATION_PATTERNS = ['calling from your bank', 'rbi', 'reserve bank', 'government', 'income tax', 'customer support', 'tech support', 'amazon', 'microsoft', 'flipkart', 'insurance company', 'helpdesk'];
const REMOTE_ACCESS_PATTERNS = ['install', 'download app', 'anydesk', 'teamviewer', 'remote access', 'screen share', 'give me access'];
const LINK_PATTERNS = ['click this link', 'visit this url', 'go to this website', 'http', 'bit.ly', 'tinyurl'];
const PAYMENT_TRANSFER_PATTERNS = ['send money', 'transfer money', 'pay now', 'wire transfer', 'google pay', 'phonepe', 'paytm', 'send to this number'];
const FAMILY_SCAM_PATTERNS = ['lost my phone', 'new number', 'emergency', 'accident', 'hospital', 'send immediately'];

// Safe context phrases that lower suspicion of nearby keywords
const SAFE_CONTEXT_PATTERNS = [
  'do not share your otp',
  'never share your pin',
  'we will never ask',
  'do not give your password',
  'protect your credentials',
  'reminder about your appointment',
  'doctor appointment',
  'delivery status',
];

// ──────────────────────────────────────────────
// Helper utilities
// ──────────────────────────────────────────────

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
}

function containsAny(text: string, patterns: string[]): boolean {
  const n = normalize(text);
  return patterns.some(p => n.includes(p));
}

function countMatches(text: string, patterns: string[]): number {
  const n = normalize(text);
  return patterns.filter(p => n.includes(p)).length;
}

function hasSafeContext(context: string[]): boolean {
  const combined = context.join(' ');
  return containsAny(combined, SAFE_CONTEXT_PATTERNS);
}

// ──────────────────────────────────────────────
// Redaction
// ──────────────────────────────────────────────

export function redactSensitiveValues(text: string): { redacted: string; sensitiveFound: boolean } {
  let redacted = text;
  let sensitiveFound = false;

  // Redact 4–8 digit numeric sequences near sensitive keywords
  const sensitiveNearby = /\b(otp|pin|cvv|password|code|number)\b.{0,30}?\b(\d{4,8})\b/gi;
  if (sensitiveNearby.test(text)) {
    sensitiveFound = true;
    redacted = redacted.replace(sensitiveNearby, (match, keyword) =>
      match.replace(/\b\d{4,8}\b/, '[REDACTED]')
    );
  }

  // Standalone 6-digit numbers (likely OTPs)
  const sixDigit = /\b\d{6}\b/g;
  if (sixDigit.test(redacted)) {
    sensitiveFound = true;
    redacted = redacted.replace(/\b\d{6}\b/g, '[REDACTED]');
  }

  // 16-digit card numbers
  const cardNum = /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g;
  if (cardNum.test(redacted)) {
    sensitiveFound = true;
    redacted = redacted.replace(cardNum, '[CARD REDACTED]');
  }

  // 3-4 digit CVV
  const cvvContext = /\b(cvv|cvc|security code)\b.{0,20}?\b(\d{3,4})\b/gi;
  if (cvvContext.test(redacted)) {
    sensitiveFound = true;
    redacted = redacted.replace(cvvContext, (m, kw) => m.replace(/\b\d{3,4}\b/, '[REDACTED]'));
  }

  return { redacted, sensitiveFound };
}

// ──────────────────────────────────────────────
// Factor definitions
// ──────────────────────────────────────────────

function buildFactors(
  callerText: string,
  userText: string,
  context: string[]
): ThreatFactor[] {
  const combined = callerText + ' ' + context.join(' ');
  const safe = hasSafeContext(context);

  const factors: ThreatFactor[] = [
    {
      id: 'otp_request',
      label: 'OTP Request',
      score: 30,
      detected: !safe && containsAny(callerText, OTP_PATTERNS),
      description: 'Caller is requesting your One-Time Password',
    },
    {
      id: 'pin_request',
      label: 'PIN / UPI PIN Request',
      score: 35,
      detected: !safe && containsAny(callerText, PIN_PATTERNS),
      description: 'Caller is requesting your PIN or UPI PIN',
    },
    {
      id: 'cvv_request',
      label: 'CVV Request',
      score: 35,
      detected: !safe && containsAny(callerText, CVV_PATTERNS),
      description: 'Caller is requesting your card CVV number',
    },
    {
      id: 'password_request',
      label: 'Password Request',
      score: 30,
      detected: !safe && containsAny(callerText, PASSWORD_PATTERNS),
      description: 'Caller is requesting your password or credentials',
    },
    {
      id: 'card_details',
      label: 'Card Details Request',
      score: 30,
      detected: !safe && containsAny(callerText, [...CARD_PATTERNS, ...ACCOUNT_PATTERNS]),
      description: 'Caller is requesting card or account details',
    },
    {
      id: 'banking_context',
      label: 'Banking Context',
      score: 20,
      detected: containsAny(combined, BANKING_PATTERNS),
      description: 'Conversation involves banking or financial topics',
    },
    {
      id: 'payment_request',
      label: 'Payment / Transfer Request',
      score: 25,
      detected: containsAny(callerText, PAYMENT_TRANSFER_PATTERNS),
      description: 'Caller is asking you to send or transfer money',
    },
    {
      id: 'urgency',
      label: 'Urgency / Pressure',
      score: 15,
      detected: containsAny(callerText, URGENCY_PATTERNS),
      description: 'Caller is creating artificial urgency or pressure',
    },
    {
      id: 'threat',
      label: 'Threat / Fear Tactic',
      score: 20,
      detected: containsAny(callerText, THREAT_PATTERNS),
      description: 'Caller is using threats or fear tactics',
    },
    {
      id: 'impersonation',
      label: 'Impersonation',
      score: 20,
      detected: containsAny(callerText, IMPERSONATION_PATTERNS),
      description: 'Caller may be impersonating an authority or company',
    },
    {
      id: 'remote_access',
      label: 'Remote Access Request',
      score: 35,
      detected: containsAny(callerText, REMOTE_ACCESS_PATTERNS),
      description: 'Caller wants to remotely access your device',
    },
    {
      id: 'suspicious_link',
      label: 'Suspicious Link',
      score: 20,
      detected: containsAny(callerText, LINK_PATTERNS),
      description: 'Caller is sending or requesting suspicious URLs',
    },
    {
      id: 'family_scam',
      label: 'Family Emergency Scam',
      score: 25,
      detected: containsAny(callerText, FAMILY_SCAM_PATTERNS),
      description: 'Caller may be impersonating a family member in distress',
    },
    {
      id: 'user_disclosure',
      label: 'Sensitive Disclosure by User',
      score: 40,
      detected: containsAny(userText, [...OTP_PATTERNS, ...PIN_PATTERNS, ...CVV_PATTERNS, ...PASSWORD_PATTERNS, ...CARD_PATTERNS]),
      description: 'User appears to be sharing sensitive information',
    },
  ];

  return factors;
}

// ──────────────────────────────────────────────
// Intent classifier
// ──────────────────────────────────────────────

function classifyIntents(factors: ThreatFactor[], callerText: string, userText: string): ScamIntent[] {
  const intents: ScamIntent[] = [];
  const activeFactors = new Set(factors.filter(f => f.detected).map(f => f.id));

  if (!activeFactors.size) return ['SAFE_CONVERSATION'];

  if (activeFactors.has('otp_request')) intents.push('OTP_REQUEST');
  if (activeFactors.has('pin_request')) intents.push('PIN_REQUEST');
  if (activeFactors.has('cvv_request') || activeFactors.has('card_details') || activeFactors.has('password_request')) intents.push('CREDENTIAL_REQUEST');
  if (activeFactors.has('payment_request')) intents.push('PAYMENT_REQUEST');
  if (activeFactors.has('remote_access')) intents.push('REMOTE_ACCESS_REQUEST');
  if (activeFactors.has('impersonation')) intents.push('IMPERSONATION');
  if (activeFactors.has('threat')) intents.push('THREAT');
  if (activeFactors.has('urgency')) intents.push('URGENCY');
  if (activeFactors.has('user_disclosure')) intents.push('SENSITIVE_DISCLOSURE');
  if (activeFactors.has('banking_context') && !intents.length) intents.push('BANKING_DISCUSSION');

  const score = calculateRawScore(factors);
  if (score > 40 && !intents.includes('SENSITIVE_DISCLOSURE')) intents.push('POSSIBLE_SCAM');

  return intents.length ? intents : ['SAFE_CONVERSATION'];
}

function calculateRawScore(factors: ThreatFactor[]): number {
  const raw = factors.filter(f => f.detected).reduce((sum, f) => sum + f.score, 0);
  return Math.min(100, raw);
}

function scoreToLevel(score: number): RiskLevel {
  if (score <= 30) return 'safe';
  if (score <= 60) return 'caution';
  if (score <= 80) return 'suspicious';
  return 'high-risk';
}

// ──────────────────────────────────────────────
// Main analysis function
// ──────────────────────────────────────────────

export function analyzeRisk(
  callerText: string,
  userText: string,
  context: string[] = [],
  isUnknownCaller = true
): RiskAnalysis {
  const factors = buildFactors(callerText, userText, context);

  // Unknown caller bonus
  if (isUnknownCaller) {
    factors.push({
      id: 'unknown_caller',
      label: 'Unknown Caller',
      score: 10,
      detected: true,
      description: 'Caller identity is unknown or unverified',
    });
  }

  const score = calculateRawScore(factors);
  const level = scoreToLevel(score);
  const intents = classifyIntents(factors, callerText, userText);

  const combined = callerText + ' ' + userText;
  const { redacted, sensitiveFound } = redactSensitiveValues(combined);

  return {
    score,
    level,
    intents,
    factors,
    redactedTranscript: redacted,
    sensitiveDetected: sensitiveFound,
    timestamp: Date.now(),
  };
}
