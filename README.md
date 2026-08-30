🛡️ ElderGuard AI
"Listen. Detect. Protect."

AI-Powered Real-Time Scam Call Protection for Elderly Users
Open : https://elderguard-ai-26t279-techwizards.vercel.app/ [for visit the Project]

What is ElderGuard AI?

ElderGuard AI is a browser-based web application that demonstrates real-time AI-powered scam call detection and intervention, specifically designed to protect elderly users from voice-based social engineering attacks.

Core Innovation:
            Context-aware conversation analysis + Dynamic risk scoring + Real-time intervention + Elderly-first accessibility

 Quick Start

Prerequisites
-> Node.js 18+
- >npm

Installation

```bash
cd elderguard-ai
npm install
```

Local Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

---

 Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

| Variable | Description | Required |
|----------|-------------|----------|
| `AI_API_KEY` | AI API key for enhanced analysis | Optional |
| `NEXT_PUBLIC_APP_NAME` | App display name | Optional |

> **Note:** If `AI_API_KEY` is not set, the app automatically uses the local rule-based engine. The demo works 100% without any API key.

---

## 📱 Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with hero, comparison, and impact sections |
| `/protection` | Live call protection with microphone + demo mode |
| `/demo` | Scam call simulator with 6 predefined scenarios |
| `/dashboard` | Security dashboard with stats and incident history |
| `/guardian` | Family guardian dashboard |
| `/settings` | Accessibility and safety settings |
| `/about` | Technical explanation and future scope |

---

## 🎬 60-Second Demo Flow (For Judges)

1. Open the Vercel URL
2. Click **"TRY LIVE DEMO"** on the landing page
3. Select the **"Bank OTP Scam"** scenario
4. Click **"▶ Play Scenario"**
5. Watch the transcript appear gradually
6. See the risk score climb: 20% → 45% → 72% → 92%
7. At 80%+: Full-screen warning appears
8. Voice alert reads the warning
9. Auto-end simulation triggers
10. Incident summary shown with threats listed

Total demo time: ~30 seconds

---

## 🧠 Risk Engine

The local risk engine (no API needed) analyzes:

- **14 threat factor categories** weighted by severity
- **12 scam intent classifications**
- **Conversation context** (last 5 statements)
- **Automatic redaction** of OTP/PIN/CVV/password values

Risk Levels:
- 🟢 0–30: SAFE
- 🟡 31–60: CAUTION  
- 🟠 61–80: SUSPICIOUS
- 🔴 81–100: HIGH RISK

---

## ♿ Accessibility

- Minimum 18px body text (configurable up to 22px)
- Large, labeled buttons with icons
- Color-independent status indicators
- Voice alerts (English, Tamil, Hindi)
- High-contrast mode
- Simple mode for elderly users

---

## 🔒 Privacy

- No OTP/PIN/CVV/password storage
- Sensitive values auto-redacted
- Audio not stored
- Local processing where possible
- API keys server-side only

---

## 🌍 Language Support

- 🇬🇧 English
- 🇮🇳 Tamil
- 🇮🇳 Hindi

---

## ⚠️ Important Technical Note

This is a **browser-based prototype**. A website cannot intercept arbitrary cellular phone calls. This prototype uses:

- **Browser microphone** (Web Speech API) for real conversation analysis
- **Simulated call scenarios** for demonstration

Native telephony integration would require a dedicated mobile application using OS-level telephony APIs.

---

## 🏗️ Project Structure

```
elderguard-ai/
├── app/
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   ├── protection/page.tsx   # Live call protection
│   ├── demo/page.tsx         # Scam simulator
│   ├── dashboard/page.tsx    # Dashboard
│   ├── guardian/page.tsx     # Guardian dashboard
│   ├── settings/page.tsx     # Settings
│   ├── about/page.tsx        # About
│   └── api/analyze/route.ts  # Analysis API
├── components/
│   ├── Header.tsx
│   ├── RiskMeter.tsx
│   └── WarningModal.tsx
├── lib/
│   ├── risk-engine.ts        # Core risk analysis
│   ├── demo-scenarios.ts     # Predefined scenarios
│   └── translations.ts       # i18n
├── hooks/
│   └── useSettings.tsx       # Settings context
├── types/
│   └── index.ts              # TypeScript types
├── .env.example
└── README.md
```

---

## 🌐 Browser Compatibility

| Browser | Speech Recognition | Speech Synthesis |
|---------|-------------------|-----------------|
| Chrome  | ✅ Full support   | ✅ Full support  |
| Edge    | ✅ Full support   | ✅ Full support  |
| Firefox | ⚠️ Limited       | ✅ Full support  |
| Safari  | ⚠️ Limited       | ✅ Full support  |

> The demo mode works in all browsers regardless of speech recognition support.

---

## 📋 Hackathon Demo Steps

```
STEP 1: Judge opens Vercel URL
STEP 2: Landing page immediately communicates the problem
STEP 3: Click "TRY LIVE DEMO"  
STEP 4: Bank OTP Scam scenario loads
STEP 5: Click "▶ Play Scenario"
STEP 6: Transcript builds gradually — scammer requests OTP
STEP 7: Risk factors detected: OTP Request, Banking Context, Urgency, Impersonation
STEP 8: Risk score: 20% → 45% → 72% → 92%
STEP 9: At 80%: Full-screen warning: "🚨 POSSIBLE SCAM CALL — DO NOT SHARE YOUR OTP"
STEP 10: Browser reads warning aloud
STEP 11: Auto-End Protection triggers
STEP 12: Incident summary shows: Risk 92%, threats listed, sensitive info REDACTED
```

---

*ElderGuard AI — Protecting elderly users from voice-based scam calls using AI-powered conversation analysis.*
=======
# elderguard-ai
>>>>>>> 0e8b27b81162b210179b81c0c253caff500f1031
