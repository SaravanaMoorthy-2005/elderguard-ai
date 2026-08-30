// ElderGuard AI - Demo Scenarios

import type { DemoScenario } from '@/types';

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'bank-otp-scam',
    name: 'Bank OTP Scam',
    description: 'Caller impersonates a bank official and requests OTP verification',
    expectedRisk: 'high-risk',
    expectedScore: 92,
    conversation: [
      { speaker: 'caller', text: 'Hello sir, I am calling from your bank\'s customer care department.', delay: 0 },
      { speaker: 'caller', text: 'Your account requires urgent KYC verification to avoid suspension.', delay: 2500 },
      { speaker: 'user', text: 'Oh okay, what do I need to do?', delay: 4500 },
      { speaker: 'caller', text: 'Don\'t worry sir, it\'s a simple process. I have sent an OTP to your registered mobile number.', delay: 6000 },
      { speaker: 'caller', text: 'Please tell me the six digit OTP you just received to complete the verification immediately.', delay: 8500 },
      { speaker: 'user', text: 'Yes, I got an OTP. Let me read it to you...', delay: 11000 },
    ],
  },
  {
    id: 'kyc-scam',
    name: 'Fake KYC Scam',
    description: 'Caller threatens account blocking unless KYC is updated immediately',
    expectedRisk: 'high-risk',
    expectedScore: 78,
    conversation: [
      { speaker: 'caller', text: 'This is an urgent notice from your bank\'s compliance department.', delay: 0 },
      { speaker: 'caller', text: 'Your KYC documents have expired. Your account will be blocked within 24 hours if not updated.', delay: 2500 },
      { speaker: 'user', text: 'Oh no! What should I do?', delay: 5000 },
      { speaker: 'caller', text: 'Please give me your account number and we will update it right now to avoid legal action.', delay: 6500 },
      { speaker: 'caller', text: 'Also I need the CVV of your debit card for identity verification. This is urgent.', delay: 9000 },
    ],
  },
  {
    id: 'remote-access-scam',
    name: 'Remote Access Scam',
    description: 'Caller from fake customer support requests remote access to device',
    expectedRisk: 'high-risk',
    expectedScore: 85,
    conversation: [
      { speaker: 'caller', text: 'Hello, I am calling from Microsoft customer support team.', delay: 0 },
      { speaker: 'caller', text: 'We have detected suspicious activity on your computer. Your banking information may be at risk.', delay: 2500 },
      { speaker: 'user', text: 'Really? That sounds serious.', delay: 5000 },
      { speaker: 'caller', text: 'Yes, it is very urgent. Please download AnyDesk or TeamViewer immediately so I can fix the issue.', delay: 6500 },
      { speaker: 'caller', text: 'Once you install it, give me the remote access code and I will resolve everything right now.', delay: 9500 },
    ],
  },
  {
    id: 'safe-conversation',
    name: 'Safe Conversation',
    description: 'Normal call - doctor appointment reminder',
    expectedRisk: 'safe',
    expectedScore: 10,
    conversation: [
      { speaker: 'caller', text: 'Good morning, am I speaking with Mrs. Lakshmi?', delay: 0 },
      { speaker: 'user', text: 'Yes, speaking.', delay: 2000 },
      { speaker: 'caller', text: 'This is City Hospital calling. I am calling to remind you about your doctor\'s appointment tomorrow at 10 AM.', delay: 3000 },
      { speaker: 'user', text: 'Oh yes, thank you for the reminder.', delay: 5500 },
      { speaker: 'caller', text: 'Please remember to bring your previous reports. Have a good day!', delay: 7000 },
    ],
  },
  {
    id: 'family-scam',
    name: 'Family Emergency Scam',
    description: 'Caller impersonates a grandchild in financial distress',
    expectedRisk: 'high-risk',
    expectedScore: 72,
    conversation: [
      { speaker: 'caller', text: 'Grandpa! It\'s me, Ravi. I lost my phone and I\'m calling from a friend\'s number.', delay: 0 },
      { speaker: 'user', text: 'Ravi? Is everything okay?', delay: 2500 },
      { speaker: 'caller', text: 'I had an accident and I\'m in trouble. I need money urgently. Please send money to this new account immediately.', delay: 3500 },
      { speaker: 'caller', text: 'Don\'t tell mom and dad. Send it on Google Pay right now. It is very urgent please.', delay: 6500 },
    ],
  },
  {
    id: 'otp-disclosure',
    name: 'OTP Disclosure (Critical)',
    description: 'User is about to share their OTP — ElderGuard intervenes',
    expectedRisk: 'high-risk',
    expectedScore: 95,
    conversation: [
      { speaker: 'caller', text: 'I am from SBI bank. We need to verify your account to prevent it from being blocked.', delay: 0 },
      { speaker: 'caller', text: 'Tell me the OTP you just received on your phone. It is required for verification.', delay: 2500 },
      { speaker: 'user', text: 'Okay, I just received an OTP. The OTP is 482913.', delay: 5000 },
    ],
  },
];

export const FULL_DEMO_SCRIPT = DEMO_SCENARIOS[0]; // Bank OTP Scam for main demo
