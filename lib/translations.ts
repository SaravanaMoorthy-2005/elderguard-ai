// ElderGuard AI - Translations (EN / Tamil / Hindi)

export type Language = 'en' | 'ta' | 'hi';

export interface Translations {
  appName: string;
  tagline: string;
  protection: {
    active: string;
    inactive: string;
    listening: string;
  };
  warning: {
    title: string;
    subtitle: string;
    doNotShare: string;
    endCall: string;
    alertGuardian: string;
    readAloud: string;
    voiceWarning: string;
  };
  call: {
    incoming: string;
    inProgress: string;
    ended: string;
    terminated: string;
    accept: string;
    reject: string;
    end: string;
    unknown: string;
  };
  risk: {
    safe: string;
    caution: string;
    suspicious: string;
    highRisk: string;
  };
  buttons: {
    startProtection: string;
    tryDemo: string;
    settings: string;
    guardian: string;
    useDemo: string;
  };
}

const translations: Record<Language, Translations> = {
  en: {
    appName: 'ElderGuard AI',
    tagline: 'Listen. Detect. Protect.',
    protection: {
      active: 'Protection Active',
      inactive: 'Protection Inactive',
      listening: 'Listening...',
    },
    warning: {
      title: '🚨 POSSIBLE SCAM CALL',
      subtitle: 'STOP.',
      doNotShare: 'DO NOT SHARE YOUR OTP, PIN OR PASSWORD.',
      endCall: 'END CALL',
      alertGuardian: 'ALERT GUARDIAN',
      readAloud: '🔊 READ WARNING ALOUD',
      voiceWarning: 'Warning! This may be a scam call. Do not share your OTP, PIN or password. End the call immediately.',
    },
    call: {
      incoming: 'INCOMING CALL',
      inProgress: 'CALL IN PROGRESS',
      ended: 'CALL ENDED',
      terminated: '🛑 CALL TERMINATED FOR YOUR SAFETY',
      accept: 'ACCEPT CALL',
      reject: 'REJECT',
      end: 'END CALL',
      unknown: 'Unknown Caller',
    },
    risk: {
      safe: '🟢 SAFE',
      caution: '🟡 CAUTION',
      suspicious: '🟠 SUSPICIOUS',
      highRisk: '🔴 HIGH RISK',
    },
    buttons: {
      startProtection: '🎙 START PROTECTION',
      tryDemo: '📞 TRY LIVE DEMO',
      settings: '⚙ Settings',
      guardian: '👨‍👩‍👦 Guardian',
      useDemo: 'Use Demo Conversation',
    },
  },
  ta: {
    appName: 'ElderGuard AI',
    tagline: 'கேளுங்கள். கண்டறியுங்கள். பாதுகாக்கவும்.',
    protection: {
      active: 'பாதுகாப்பு செயலில் உள்ளது',
      inactive: 'பாதுகாப்பு செயலில் இல்லை',
      listening: 'கேட்கிறது...',
    },
    warning: {
      title: '🚨 மோசடி அழைப்பு',
      subtitle: 'நிறுத்துங்கள்.',
      doNotShare: 'உங்கள் OTP, PIN அல்லது கடவுச்சொல்லை பகிர வேண்டாம்.',
      endCall: 'அழைப்பை நிறுத்து',
      alertGuardian: 'காவலரை அறிவி',
      readAloud: '🔊 எச்சரிக்கையை சத்தமாக படி',
      voiceWarning: 'கவனம்! இது மோசடி அழைப்பாக இருக்கலாம். உங்கள் OTP அல்லது கடவுச்சொல்லை பகிர வேண்டாம். உடனே அழைப்பை நிறுத்துங்கள்.',
    },
    call: {
      incoming: 'வரும் அழைப்பு',
      inProgress: 'அழைப்பு நடந்து கொண்டிருக்கிறது',
      ended: 'அழைப்பு முடிந்தது',
      terminated: '🛑 உங்கள் பாதுகாப்பிற்காக அழைப்பு நிறுத்தப்பட்டது',
      accept: 'அழைப்பை ஏற்கவும்',
      reject: 'மறுக்கவும்',
      end: 'அழைப்பை முடிக்கவும்',
      unknown: 'அறியப்படாத அழைப்பாளர்',
    },
    risk: {
      safe: '🟢 பாதுகாப்பானது',
      caution: '🟡 எச்சரிக்கை',
      suspicious: '🟠 சந்தேகாஸ்பதம்',
      highRisk: '🔴 அதிக ஆபத்து',
    },
    buttons: {
      startProtection: '🎙 பாதுகாப்பை தொடங்கு',
      tryDemo: '📞 டெமோ முயற்சி செய்',
      settings: '⚙ அமைப்புகள்',
      guardian: '👨‍👩‍👦 காவலர்',
      useDemo: 'டெமோ உரையாடலை பயன்படுத்து',
    },
  },
  hi: {
    appName: 'ElderGuard AI',
    tagline: 'सुनें। पहचानें। सुरक्षित करें।',
    protection: {
      active: 'सुरक्षा सक्रिय है',
      inactive: 'सुरक्षा निष्क्रिय है',
      listening: 'सुन रहा है...',
    },
    warning: {
      title: '🚨 संभावित धोखाधड़ी कॉल',
      subtitle: 'रुकिए।',
      doNotShare: 'अपना OTP, PIN या पासवर्ड साझा न करें।',
      endCall: 'कॉल समाप्त करें',
      alertGuardian: 'अभिभावक को सूचित करें',
      readAloud: '🔊 चेतावनी जोर से पढ़ें',
      voiceWarning: 'चेतावनी! यह एक धोखाधड़ी कॉल हो सकती है। अपना OTP या पासवर्ड साझा न करें। कॉल तुरंत समाप्त करें।',
    },
    call: {
      incoming: 'आने वाली कॉल',
      inProgress: 'कॉल जारी है',
      ended: 'कॉल समाप्त हुई',
      terminated: '🛑 आपकी सुरक्षा के लिए कॉल समाप्त की गई',
      accept: 'कॉल स्वीकार करें',
      reject: 'अस्वीकार करें',
      end: 'कॉल समाप्त करें',
      unknown: 'अज्ञात कॉलर',
    },
    risk: {
      safe: '🟢 सुरक्षित',
      caution: '🟡 सावधान',
      suspicious: '🟠 संदिग्ध',
      highRisk: '🔴 अत्यधिक जोखिम',
    },
    buttons: {
      startProtection: '🎙 सुरक्षा शुरू करें',
      tryDemo: '📞 लाइव डेमो आज़माएं',
      settings: '⚙ सेटिंग्स',
      guardian: '👨‍👩‍👦 अभिभावक',
      useDemo: 'डेमो वार्तालाप उपयोग करें',
    },
  },
};

export function getTranslations(lang: Language): Translations {
  return translations[lang] ?? translations.en;
}
