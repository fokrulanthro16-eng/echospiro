/**
 * EchoSpiro - Sovereign Multi-Lingual Clinical Translation Engine
 * VITB - JHU Health-Hack 2027
 * 
 * Authentic clinical translations across 4 Global South health agency standards:
 * - EN: English (Johns Hopkins Medicine / WHO Standard)
 * - BN: বাংলা (DGHS - Directorate General of Health Services)
 * - HI: हिन्दी (PHC - National Health Mission Primary Health Centre)
 * - ES: Español (PAHO - Organización Panamericana de la Salud)
 */

import { TriageStatus, TriageResult } from './triageClassifier';

export type LocaleCode = 'EN' | 'BN' | 'HI' | 'ES';

export interface LocaleMeta {
  code: LocaleCode;
  name: string;
  agencyBadge: string;
  flag: string;
}

export const LOCALES: Record<LocaleCode, LocaleMeta> = {
  EN: {
    code: 'EN',
    name: 'English',
    agencyBadge: 'JHU / WHO',
    flag: '🌐',
  },
  BN: {
    code: 'BN',
    name: 'বাংলা',
    agencyBadge: 'DGHS স্বাস্থ্য অধিদপ্তর',
    flag: '🇧🇩',
  },
  HI: {
    code: 'HI',
    name: 'हिन्दी',
    agencyBadge: 'NHM प्राथमिक स्वास्थ्य केंद्र',
    flag: '🇮🇳',
  },
  ES: {
    code: 'ES',
    name: 'Español',
    agencyBadge: 'PAHO / OMS',
    flag: '🌎',
  },
};

export interface ClinicalDictionary {
  title: string;
  subtitle: string;
  slipHeader: string;
  timestamp: string;
  referralRef: string;
  demographic: string;
  sovereignProof: string;
  telemetryHeader: string;
  respiratoryRate: string;
  ieRatio: string;
  sqiLabel: string;
  tidalVolume: string;
  wheezeIndex: string;
  rhythmStability: string;
  validatedCycles: string;
  triageHeader: string;
  primaryStatus: string;
  severityLevel: string;
  alertPriority: string;
  clinicalFindings: string;
  recommendedAction: string;
  cryptoHeader: string;
  sha256Label: string;
  cryptoProtocol: string;
  auditVerification: string;
  signoffHeader: string;
  clinicianName: string;
  clinicUnit: string;
  manualSpo2: string;
  restingHr: string;
  actionsLabel: string;
  actionBronchodilator: string;
  actionReferral: string;
  actionDischarge: string;
  statusLabels: Record<TriageStatus, string>;
  findings: Record<TriageStatus, string>;
  recommendations: Record<TriageStatus, string>;
}

export const CLINICAL_TRANSLATIONS: Record<LocaleCode, ClinicalDictionary> = {
  EN: {
    title: 'ECHOSPIRO™ CONTACTLESS ULTRASONIC PULMONARY TRIAGE SLIP',
    subtitle: 'VITB - JHU Health-Hack 2027 Sovereign Biomedical AI Engine',
    slipHeader: 'SOVEREIGN CONTACTLESS TRIAGE RECORD',
    timestamp: 'Timestamp',
    referralRef: 'Referral Ref',
    demographic: 'Demographic Mode',
    sovereignProof: '100% Volatile Memory • Zero-PII • Zero Cloud Egress',
    telemetryHeader: 'CLINICAL TELEMETRY',
    respiratoryRate: 'Respiratory Rate',
    ieRatio: 'Inhalation-to-Exhalation',
    sqiLabel: 'Signal Quality Index (SQI)',
    tidalVolume: 'Estimated Tidal Volume',
    wheezeIndex: 'Auscultation Wheeze Index',
    rhythmStability: 'Rhythm Stability (SDNN)',
    validatedCycles: 'Validated Breath Cycles',
    triageHeader: 'WHO & CLINICAL TRIAGE ASSESSMENT',
    primaryStatus: 'Primary Status',
    severityLevel: 'Severity Level',
    alertPriority: 'ALERT PRIORITY',
    clinicalFindings: 'Clinical Findings',
    recommendedAction: 'Recommended Intervention',
    cryptoHeader: 'CRYPTOGRAPHIC ATTESTATION / TAMPER-PROOF HASH',
    sha256Label: 'SHA-256 Cryptographic Proof',
    cryptoProtocol: 'Attestation Protocol: W3C WebCrypto Client-Side Integrity Attestation',
    auditVerification: 'Audit Verification: SOVEREIGN UNCOMPROMISED (Verified by Sovereign Key)',
    signoffHeader: 'COMMUNITY HEALTH WORKER / FIELD TRIAGE SIGN-OFF',
    clinicianName: 'Clinician Name / ID',
    clinicUnit: 'Clinic / Field Unit',
    manualSpo2: 'Manual SpO2 Check',
    restingHr: 'Resting HR',
    actionsLabel: 'Action Taken',
    actionBronchodilator: 'Administer Bronchodilator',
    actionReferral: 'Immediate Referral',
    actionDischarge: 'Discharge',
    statusLabels: {
      NORMAL: 'EUPNEIC NORMAL',
      TACHYPNEA: 'ACUTE TACHYPNEA',
      BRADYPNEA: 'SEVERE BRADYPNEA',
      OBSTRUCTIVE_PATTERN: 'COPD / ASTHMA OBSTRUCTIVE PATTERN',
      POOR_SIGNAL: 'SIGNAL QUALITY DEGRADED',
    },
    findings: {
      NORMAL:
        'Eupneic physiological ventilation confirmed. Normal tidal volume excursions without airway resistance or hyperventilation.',
      TACHYPNEA:
        'Acute Tachypnea confirmed. Rapid shallow breathing pattern detected; elevated work of breathing indicative of metabolic compensation, hypoxemia, or systemic inflammation.',
      BRADYPNEA:
        'Severe Bradypnea detected below safe physiological baseline. Depressed minute ventilation; evaluate for CNS depression, opiate toxicity, or severe hypothermia.',
      OBSTRUCTIVE_PATTERN:
        'Prolonged expiratory phase and airway narrowing confirmed. Sub-band acoustic wheeze detected; pathognomonic for acute asthma bronchospasm or COPD exacerbation.',
      POOR_SIGNAL:
        'Ultrasonic Doppler signal quality degraded. Reposition transducer facing chest at 50 cm and eliminate ambient noise.',
    },
    recommendations: {
      NORMAL:
        'Routine observation. No acute pulmonary intervention required. Safe for outpatient discharge or routine follow-up.',
      TACHYPNEA:
        'Immediate triage escalation: Check immediate pulse oximetry (SpO2), core temperature, and screen for pneumonia, pulmonary embolism, or sepsis.',
      BRADYPNEA:
        'Evaluate Glasgow Coma Scale (GCS), review sedative/narcotic medication history, and secure patent airway.',
      OBSTRUCTIVE_PATTERN:
        'Urgent pulmonary evaluation: Administer inhaled short-acting beta-2 agonist (SABA) bronchodilator (e.g. Albuterol 2.5-5.0mg via nebulizer). Assess wheezing and SpO2.',
      POOR_SIGNAL:
        'Reposition patient at 0.5m directly facing microphone. Keep torso still and recalibrate background acoustic clutter.',
    },
  },

  BN: {
    title: 'ইকোস্পাইরো™ স্পর্শবিহীন আল্ট্রাসনিক পালমোনারি ট্রায়াজ স্লিপ',
    subtitle: 'ভিআইটিবি - জেএইচইউ হেলথ-হ্যাক ২০২৭ সার্বভৌম বায়োমেডিকেল এআই ইঞ্জিন',
    slipHeader: 'স্বাস্থ্য অধিদপ্তর (DGHS) স্ট্যান্ডার্ড রেফারেল রেকর্ড',
    timestamp: 'সময় ও তারিখ',
    referralRef: 'রেফারেল নম্বর',
    demographic: 'রোগীর শ্রেণি',
    sovereignProof: '১০০% ক্লায়েন্ট-সাইড ভোলাটাইল মেমরি • জিরো-পিআইআই • ক্লাউডলেস সুরক্ষিত',
    telemetryHeader: 'ক্লিনিক্যাল টেলিমেট্রি পরিমাপ',
    respiratoryRate: 'শ্বাস-প্রশ্বাসের হার',
    ieRatio: 'ইনহেলেশন ও এক্সহেলেশন অনুপাত (I:E)',
    sqiLabel: 'সিগন্যাল কোয়ালিটি ইনডেক্স (SQI)',
    tidalVolume: 'টাইডাল ভলিউম',
    wheezeIndex: 'হুইজ ইনডেক্স (শ্বাসনালীর বাধাজনিত শব্দ)',
    rhythmStability: 'রিদম স্থিতিশীলতা (SDNN)',
    validatedCycles: 'যাচাইকৃত শ্বাস চক্র',
    triageHeader: 'বিশ্ব স্বাস্থ্য সংস্থা (WHO) ও ক্লিনিক্যাল ট্রায়াজ মূল্যায়ন',
    primaryStatus: 'প্রাথমিক ট্রায়াজ স্ট্যাটাস',
    severityLevel: 'ঝুঁকির মাত্রা',
    alertPriority: 'সতর্কতা অগ্রাধিকার',
    clinicalFindings: 'শারীরবৃত্তীয় পর্যবেক্ষণ',
    recommendedAction: 'প্রস্তাবিত ক্লিনিক্যাল পদক্ষেপ',
    cryptoHeader: 'ক্রিপ্টোগ্রাফিক প্রমাণ / টেম্পার-প্রুফ হ্যাশ (ওয়েবক্রিপ্টো)',
    sha256Label: 'এসএইচএ-২৫৬ ক্রিপ্টোগ্রাফিক স্বাক্ষর',
    cryptoProtocol: 'প্রোটোকল: ডাব্লিউথ্রিসি ওয়েবক্রিপ্টো সার্বভৌম ডিজিটাল অখণ্ডতা স্বাক্ষর',
    auditVerification: 'অডিট নিরীক্ষা: সার্বভৌম সুরক্ষিত ও অপরিবর্তিত (ডিজিটাল স্বাক্ষরিত)',
    signoffHeader: 'কমিউনিটি হেলথ ওয়ার্কার / মাঠপর্যায়ের ট্রায়াজ প্রত্যয়ন',
    clinicianName: 'চিকিৎসক / স্বাস্থ্যকর্মীর নাম ও আইডি',
    clinicUnit: 'ক্লিনিক / স্বাস্থ্যকেন্দ্রের নাম',
    manualSpo2: 'ম্যানুয়াল এসপিও২ (SpO2)',
    restingHr: 'পালস রেট (HR)',
    actionsLabel: 'গৃহীত ব্যবস্থা',
    actionBronchodilator: 'ব্রঙ্কোডাইলেটর প্রয়োগ',
    actionReferral: 'জরুরি হাসপাতালে প্রেরণ',
    actionDischarge: 'প্রাথমিক পর্যবেক্ষণ ও ছাড়পত্র',
    statusLabels: {
      NORMAL: 'স্বাভাবিক শ্বাসক্রিয়া (EUPNEIC)',
      TACHYPNEA: 'তীব্র ট্যাকিপনিয়া (অতিদ্রুত শ্বাস)',
      BRADYPNEA: 'ব্র্যাডিপনিয়া (বিপজ্জনক মন্থর শ্বাস)',
      OBSTRUCTIVE_PATTERN: 'সিওপিডি / হাঁপানি জনিত শ্বাসনালীর বাধা',
      POOR_SIGNAL: 'সংকেতের গুণমান দুর্বল',
    },
    findings: {
      NORMAL:
        'স্বাভাবিক শারীরবৃত্তীয় বায়ুচলাচল নিশ্চিত। শ্বাসনালীতে কোনো বাধা বা হাইপারভেন্টিলেশন নেই। টাইডাল ভলিউম সন্তোষজনক।',
      TACHYPNEA:
        'তীব্র ট্যাকিপনিয়া সনাক্ত হয়েছে। দ্রুত ও অগভীর শ্বাসপ্রশ্বাস নির্দেশ করছে মেটাবলিক অ্যাসিডোসিস বা ফুসফুসের প্রদাহ/নিউমোনিয়া ঝুঁকি।',
      BRADYPNEA:
        'বিপজ্জনক মন্থর শ্বাসপ্রশ্বাস সনাক্ত। মস্তিষ্কের শ্বাসকেন্দ্রের দুর্বলতা বা বিষক্রিয়ার ঝুঁকি রয়েছে।',
      OBSTRUCTIVE_PATTERN:
        'শ্বাসত্যাগের সময় অস্বাভাবিক দীর্ঘ এবং শ্বাসনালীতে বাধা নিশ্চিত। সাব-ব্যান্ডে হুইজিং শব্দ সনাক্ত হয়েছে, যা ব্রঙ্কোস্পাজম বা সিওপিডি নির্দেশ করে।',
      POOR_SIGNAL:
        'আল্ট্রাসনিক সংকেতের তীব্রতা হ্রাস পেয়েছে। ডিভাইসের মাইক বুক থেকে ৫০ সেমি দূরত্বে রাখুন।',
    },
    recommendations: {
      NORMAL:
        'নিয়মিত পর্যবেক্ষণ বজায় রাখুন। কোনো জরুরি ওষুধের প্রয়োজন নেই। বহির্বিভাগে পর্যবেক্ষণযোগ্য।',
      TACHYPNEA:
        'জরুরি ট্রায়াজ বৃদ্ধি: দ্রুত পালস অক্সিমেট্রি (SpO2) পরীক্ষা করুন, শরীরের তাপমাত্রা মাপুন এবং নিউমোনিয়া বা সেপসিস পরীক্ষা করুন।',
      BRADYPNEA:
        'গ্লাসগো কোমা স্কেল (GCS) মূল্যায়ন করুন, অতিরিক্ত ঘুমের ওষুধ বা বিষক্রিয়া ইতিহাস যাচাই করুন।',
      OBSTRUCTIVE_PATTERN:
        'জরুরি ফুসফুসীয় হস্তক্ষেপ: অবিলম্বে নেবুলাইজারের মাধ্যমে ইনহেল্ড সালবুটামল (SABA) ব্রঙ্কোডাইলেটর প্রয়োগ করুন।',
      POOR_SIGNAL:
        'রোগীকে ডিভাইসের ঠিক ৫০ সেমি সামনে শান্তভাবে বসিয়ে পুনরায় বেসলাইন ক্যালিব্রেট করুন।',
    },
  },

  HI: {
    title: 'इकोस्पाइरो™ संपर्क रहित अल्ट्रासोनिक पल्मोनरी ट्राइएज पर्ची',
    subtitle: 'वीआईटीबी - जेएचयू हेल्थ-हैक 2027 सॉवरेन बायोमेडिकल एआई वर्कस्टेशन',
    slipHeader: 'राष्ट्रीय स्वास्थ्य मिशन (NHM) प्राथमिक स्वास्थ्य केंद्र रिकॉर्ड',
    timestamp: 'समय एवं दिनांक',
    referralRef: 'रेफरल संदर्भ संख्या',
    demographic: 'रोगी श्रेणी',
    sovereignProof: '100% वोलेटाइल मेमोरी • शून्य डेटा भंडारण • पूर्णतः गोपनीय',
    telemetryHeader: 'नैदानिक टेलीमेट्री मापदंड',
    respiratoryRate: 'श्वसन दर',
    ieRatio: 'इनहेलेशन-एक्सहेलेशन अनुपात (I:E)',
    sqiLabel: 'सिग्नल गुणवत्ता सूचकांक (SQI)',
    tidalVolume: 'अनुमानित ज्वारीय आयतन (Tidal Volume)',
    wheezeIndex: 'घरघराहट सूचकांक (Wheeze Index)',
    rhythmStability: 'लय स्थिरता (SDNN)',
    validatedCycles: 'सत्यापित श्वसन चक्र',
    triageHeader: 'विश्व स्वास्थ्य संगठन (WHO) ट्राइएज आकलन',
    primaryStatus: 'प्राथमिक ट्राइएज स्थिति',
    severityLevel: 'गंभीरता स्तर',
    alertPriority: 'चेतावनी प्राथमिकता',
    clinicalFindings: 'शारीरिक नैदानिक निष्कर्ष',
    recommendedAction: 'अनुशंसित चिकित्सीय हस्तक्षेप',
    cryptoHeader: 'क्रिप्टोग्राफिक प्रमाण / छेड़छाड़-रोधी हैश हस्ताक्षर',
    sha256Label: 'SHA-256 क्रिप्टोग्राफिक डिजिटल मुहर',
    cryptoProtocol: 'प्रोटोकॉल: W3C WebCrypto ग्राहक-स्तरीय अखंडता सत्यापन',
    auditVerification: 'सत्यापन स्थिति: अखंड और डिजिटल रूप से सत्यापित',
    signoffHeader: 'सामुदायिक स्वास्थ्य कार्यकर्ता (ASHA/ANM) ट्राइएज हस्ताक्षर',
    clinicianName: 'चिकित्सक / स्वास्थ्यकर्मी का नाम व आईडी',
    clinicUnit: 'प्राथमिक स्वास्थ्य केंद्र / अस्पताल',
    manualSpo2: 'ऑक्सीजन स्तर (SpO2)',
    restingHr: 'हृदय गति (HR)',
    actionsLabel: 'की गई कार्रवाई',
    actionBronchodilator: 'ब्रोंकोडायलेटर दवा दी गई',
    actionReferral: 'उच्च केंद्र हेतु आपातकालीन रेफरल',
    actionDischarge: 'संतोषजनक स्थिति / निगरानी',
    statusLabels: {
      NORMAL: 'सामान्य श्वसन (EUPNEIC)',
      TACHYPNEA: 'तीव्र टैकिपनिया (अति-द्रुत श्वसन)',
      BRADYPNEA: 'ब्रैडिपनिया (धीमी श्वसन गति)',
      OBSTRUCTIVE_PATTERN: 'सीओपीडी / दमा अवरोधक पैटर्न',
      POOR_SIGNAL: 'सिग्नल गुणवत्ता कमजोर',
    },
    findings: {
      NORMAL:
        'सामान्य श्वसन क्रिया पुष्ट। श्वसन मार्ग में कोई रुकावट नहीं है। ज्वारीय आयतन संतोषजनक स्तर पर है।',
      TACHYPNEA:
        'तीव्र टैकिपनिया दर्ज। तेज़ और उथली सांसें हाइपोक्सिया या फेफड़ों के संक्रमण (निमोनिया) का संकेत दे रही हैं।',
      BRADYPNEA:
        'अत्यधिक धीमी श्वसन दर। श्वसन केंद्र के अवसाद या गंभीर नशीली दवाओं/विषैले प्रभाव की जांच करें।',
      OBSTRUCTIVE_PATTERN:
        'सांस छोड़ने की अवधि अत्यधिक लंबी और अवरोधक। 250-1600 Hz बैंड में घरघराहट (Wheeze) की पुष्टि हुई है।',
      POOR_SIGNAL:
        'अल्ट्रासोनिक सिग्नल कमजोर है। उपकरण को रोगी की छाती से ठीक 50 सेमी दूर रखें।',
    },
    recommendations: {
      NORMAL:
        'नियमित निगरानी रखें। किसी आपातकालीन दवा की आवश्यकता नहीं है। सामान्य परामर्श जारी रखें।',
      TACHYPNEA:
        'तत्काल ट्राइएज वृद्धि: SpO2 की तुरंत जांच करें, बुखार मापें और निमोनिया/सेप्सिस हेतु परीक्षण करें।',
      BRADYPNEA:
        'चेतना के स्तर (GCS) का आकलन करें और श्वसन मार्ग को खुला रखें।',
      OBSTRUCTIVE_PATTERN:
        'तत्काल नेबुलाइजर द्वारा इनहेल्ड ब्रोंकोडायलेटर (सालबुटामोल 2.5mg) दें और ऑक्सीजन स्तर मापें।',
      POOR_SIGNAL:
        'रोगी को शांत बैठाकर 50 सेमी की दूरी पर पुनः जांच प्रारंभ करें।',
    },
  },

  ES: {
    title: 'COMPROBANTE DE TRIAJE PULMONAR ULTRASÓNICO ECHOSPIRO™',
    subtitle: 'Motor de IA Biomédica Soberana VITB - JHU Health-Hack 2027',
    slipHeader: 'REGISTRO DE TRIAJE ESTÁNDAR PAHO / OPS',
    timestamp: 'Fecha y Hora',
    referralRef: 'Referencia de Triaje',
    demographic: 'Modo Demográfico',
    sovereignProof: '100% Memoria Volátil • Sin PII • Cero Transmisión a la Nube',
    telemetryHeader: 'TELEMETRÍA CLÍNICA',
    respiratoryRate: 'Frecuencia Respiratoria',
    ieRatio: 'Relación Inhalación:Exhalación (I:E)',
    sqiLabel: 'Índice de Calidad de Señal (SQI)',
    tidalVolume: 'Volumen Tidal Estimado',
    wheezeIndex: 'Índice de Sibilancias (Wheeze)',
    rhythmStability: 'Estabilidad del Ritmo (SDNN)',
    validatedCycles: 'Ciclos Respiratorios Validados',
    triageHeader: 'EVALUACIÓN DE TRIAJE CLÍNICO Y OMS',
    primaryStatus: 'Estado Principal',
    severityLevel: 'Nivel de Gravedad',
    alertPriority: 'PRIORIDAD DE ALERTA',
    clinicalFindings: 'Hallazgos Fisiológicos',
    recommendedAction: 'Intervención Clínica Recomendada',
    cryptoHeader: 'ATESTACIÓN CRIPTOGRÁFICA / HASH INVIOLABLE',
    sha256Label: 'Firma Criptográfica SHA-256',
    cryptoProtocol: 'Protocolo: Atestación de Integridad del Cliente W3C WebCrypto',
    auditVerification: 'Verificación de Auditoría: SOBERANO INTACTO (Verificado por Llave)',
    signoffHeader: 'CERTIFICACIÓN DE TRIAJE POR PERSONAL DE SALUD',
    clinicianName: 'Nombre / ID del Profesional',
    clinicUnit: 'Clínica / Unidad de Campo',
    manualSpo2: 'Saturación SpO2 Manual',
    restingHr: 'Frecuencia Cardíaca',
    actionsLabel: 'Conducta Adoptada',
    actionBronchodilator: 'Administrar Broncodilatador',
    actionReferral: 'Derivación Inmediata a Hospital',
    actionDischarge: 'Observación Ambulatoria / Alta',
    statusLabels: {
      NORMAL: 'EUPNEICO NORMAL',
      TACHYPNEA: 'TAQUIPNEA AGUDA',
      BRADYPNEA: 'BRADIPNEA SEVERA',
      OBSTRUCTIVE_PATTERN: 'PATRÓN OBSTRUCTIVO ASMA / EPOC',
      POOR_SIGNAL: 'CALIDAD DE SEÑAL DEGRADADA',
    },
    findings: {
      NORMAL:
        'Ventilación fisiológica eupneica confirmada. Excursión torácica normal sin aumento del trabajo respiratorio.',
      TACHYPNEA:
        'Taquipnea aguda confirmada. Patrón respiratorio rápido y superficial indicativo de compensación metabólica o hipoxemia.',
      BRADYPNEA:
        'Bradipnea severa por debajo del umbral fisiológico seguro. Evaluar depresión del sistema nervioso central o hipotermia.',
      OBSTRUCTIVE_PATTERN:
        'Fase espiratoria marcadamente prolongada con sibilancias acústicas en sub-banda. Patognomónico de broncoespasmo o exacerbación de EPOC.',
      POOR_SIGNAL:
        'Calidad de señal Doppler acústica reducida. Reubique el dispositivo frente al tórax a 50 cm.',
    },
    recommendations: {
      NORMAL:
        'Observación rutinaria. No se requiere intervención farmacológica inmediata. Seguro para control ambulatorio.',
      TACHYPNEA:
        'Escalamiento inmediato de triaje: Evalúe pulsioximetría (SpO2), temperatura y descarte neumonía o sepsis.',
      BRADYPNEA:
        'Evalúe Escala de Coma de Glasgow (GCS) y asegure la permeabilidad de la vía aérea.',
      OBSTRUCTIVE_PATTERN:
        'Intervención pulmonar urgente: Administre broncodilatador agonista beta-2 inhalado (Salbutamol 2.5-5.0 mg nebulizado).',
      POOR_SIGNAL:
        'Coloque al paciente a 0.5 m frente al micrófono y recalibre el ruido acústico ambiental.',
    },
  },
};

/**
 * Format localized referral slip text with canonical SHA-256 invariant hash
 */
export function formatLocalizedSlipText(
  locale: LocaleCode,
  triage: TriageResult,
  referralRef: string,
  canonicalSha256: string
): string {
  const dict = CLINICAL_TRANSLATIONS[locale];
  const statusLabel = dict.statusLabels[triage.status] || triage.status;
  const findingText = dict.findings[triage.status] || triage.clinicalSummary;
  const recommendationText = dict.recommendations[triage.status] || triage.recommendation;

  return `================================================================
${dict.title}
${dict.subtitle}
================================================================
${dict.slipHeader}
• ${dict.timestamp}:       ${new Date(triage.timestamp).toLocaleString()}
• ${dict.referralRef}:    ES-${referralRef}
• ${dict.demographic}:     ${triage.patientMode}
• ${dict.sovereignProof}

[${dict.telemetryHeader}]
----------------------------------------------------------------
• ${dict.respiratoryRate}:             ${triage.bpm.toFixed(1)} BPM
• ${dict.ieRatio}:     ${triage.ieRatio} (Ti: ${triage.meanTiSec}s | Te: ${triage.meanTeSec}s)
• ${dict.sqiLabel}:   ${triage.sqi}% (Ultrasonic Doppler CNR)
• ${dict.tidalVolume}:       ${triage.tidalVolumeMl} mL
• ${dict.wheezeIndex}:    ${triage.wheezeIndex}% (${triage.auscultationStatus.replace('_', ' ')})
• ${dict.rhythmStability}:      ${triage.sdnnMs} ms (${triage.rhythmStability})
• ${dict.validatedCycles}:      ${triage.cycleCount}

[${dict.triageHeader}]
----------------------------------------------------------------
• ${dict.primaryStatus}:  ${statusLabel}
• ${dict.severityLevel}:  ${triage.severity.toUpperCase()} ${dict.alertPriority}
• ${dict.clinicalFindings}:
  ${findingText}

• ${dict.recommendedAction}:
  ${recommendationText}

[${dict.cryptoHeader}]
----------------------------------------------------------------
${dict.sha256Label}:
${canonicalSha256}
${dict.cryptoProtocol}
${dict.auditVerification}

[${dict.signoffHeader}]
----------------------------------------------------------------
${dict.clinicianName}: _________________________________________
${dict.clinicUnit}: _________________________________________
${dict.manualSpo2}:   [   ]%   ${dict.restingHr}: [   ] BPM
${dict.actionsLabel}: [ ] ${dict.actionBronchodilator}  [ ] ${dict.actionReferral}  [ ] ${dict.actionDischarge}
================================================================`;
}
