// ─── Mock data for the Health Exchange platform ───

export type UserRole =
  | "hospital"
  | "vendor"
  | "researcher"
  | "startup"
  | "consultant"
  | "physician"
  | "nurse"
  | "investor"
  | "government"
  | "student"
  | "freelancer";

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  organization: string;
  verified: boolean;
  reputation: number;
  location: string;
  specialties: string[];
  bio: string;
}

export interface Need {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: string;
  deadline: string;
  postedBy: User;
  postedAt: string;
  proposals: number;
  urgency: "low" | "medium" | "high" | "critical";
  tags: string[];
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  category: string;
  price: string;
  postedBy: User;
  rating: number;
  reviews: number;
  tags: string[];
  verified: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  budget: string;
  duration: string;
  status: "open" | "in-progress" | "completed";
  postedBy: User;
  proposals: number;
  skills: string[];
  postedAt: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  prize: string;
  deadline: string;
  sponsor: string;
  submissions: number;
  status: "open" | "judging" | "completed";
  tags: string[];
}

export interface Expert {
  id: string;
  user: User;
  hourlyRate: string;
  availability: "available" | "busy" | "offline";
  specialties: string[];
  consultations: number;
  rating: number;
}

export interface AIProduct {
  id: string;
  name: string;
  description: string;
  vendor: User;
  category: string;
  price: string;
  rating: number;
  deployments: number;
  tags: string[];
  demo: boolean;
}

export interface Job {
  id: string;
  title: string;
  organization: string;
  location: string;
  type: "full-time" | "part-time" | "freelance" | "remote" | "contract";
  salary: string;
  postedAt: string;
  postedBy: User;
  skills: string[];
  urgent: boolean;
}

export interface Course {
  id: string;
  title: string;
  provider: string;
  duration: string;
  price: string;
  rating: number;
  students: number;
  level: "beginner" | "intermediate" | "advanced";
  tags: string[];
}

export interface Equipment {
  id: string;
  name: string;
  category: string;
  condition: "new" | "refurbished" | "used";
  price: string;
  location: string;
  seller: User;
  images: string[];
}

export interface Dataset {
  id: string;
  name: string;
  description: string;
  size: string;
  format: string;
  compliance: string[];
  price: string;
  provider: User;
  downloads: number;
}

export interface API {
  id: string;
  name: string;
  description: string;
  provider: User;
  category: string;
  price: string;
  uptime: string;
  latency: string;
  version: string;
}

// ─── Mock Users ───
export const mockUsers: User[] = [
  {
    id: "u1",
    name: "King Fahad Medical City",
    role: "hospital",
    avatar: "KF",
    organization: "KFMC",
    verified: true,
    reputation: 98,
    location: "Riyadh",
    specialties: ["Tertiary Care", "Research", "AI"],
    bio: "Leading tertiary care center and research hospital in Saudi Arabia.",
  },
  {
    id: "u2",
    name: "MedAI Solutions",
    role: "startup",
    avatar: "MA",
    organization: "MedAI",
    verified: true,
    reputation: 92,
    location: "Jeddah",
    specialties: ["Clinical AI", "NLP", "Imaging"],
    bio: "Building the next generation of clinical AI copilots.",
  },
  {
    id: "u3",
    name: "Dr. Nora Al-Qahtani",
    role: "physician",
    avatar: "NQ",
    organization: "KAMC",
    verified: true,
    reputation: 96,
    location: "Riyadh",
    specialties: ["Cardiology", "Digital Health", "Research"],
    bio: "Interventional cardiologist with focus on digital health innovation.",
  },
  {
    id: "u4",
    name: "HealthTech Consulting",
    role: "consultant",
    avatar: "HC",
    organization: "HTC",
    verified: true,
    reputation: 94,
    location: "Dammam",
    specialties: ["FHIR", "NPHIES", "Interoperability"],
    bio: "Healthcare IT consulting specializing in Saudi health informatics.",
  },
  {
    id: "u5",
    name: "Ministry of Health",
    role: "government",
    avatar: "MOH",
    organization: "MOH",
    verified: true,
    reputation: 100,
    location: "Riyadh",
    specialties: ["Policy", "Regulation", "Innovation"],
    bio: "Saudi Arabia Ministry of Health — Vision 2030 health transformation.",
  },
  {
    id: "u6",
    name: "Sarah Al-Mutairi",
    role: "freelancer",
    avatar: "SM",
    organization: "Independent",
    verified: true,
    reputation: 89,
    location: "Remote",
    specialties: ["Medical Coding", "ICD-10", "Revenue Cycle"],
    bio: "Certified medical coder with 8 years of experience in GCC healthcare.",
  },
  {
    id: "u7",
    name: "Saudi Health Ventures",
    role: "investor",
    avatar: "SHV",
    organization: "SHV",
    verified: true,
    reputation: 95,
    location: "Riyadh",
    specialties: ["HealthTech", "Digital Health", "MedTech"],
    bio: "Leading healthcare venture capital firm in Saudi Arabia.",
  },
  {
    id: "u8",
    name: "FHIR Academy",
    role: "consultant",
    avatar: "FA",
    organization: "FHIR Academy",
    verified: true,
    reputation: 91,
    location: "Riyadh",
    specialties: ["FHIR", "HL7", "Training"],
    bio: "Premier healthcare interoperability training and consulting.",
  },
];

// ─── Mock Needs ───
export const mockNeeds: Need[] = [
  {
    id: "n1",
    title: "AI-Powered Radiology Diagnostic Assistant",
    description:
      "We need an AI solution that can assist radiologists in detecting anomalies in chest X-rays and CT scans. Must be FDA-cleared or equivalent, support Arabic reporting, and integrate with our PACS system.",
    category: "Clinical AI",
    budget: "SAR 500,000 - 1,000,000",
    deadline: "2025-03-01",
    postedBy: mockUsers[0],
    postedAt: "2025-01-15",
    proposals: 8,
    urgency: "high",
    tags: ["AI", "Radiology", "PACS", "Diagnostics"],
  },
  {
    id: "n2",
    title: "NPHIES Integration for Claims Processing",
    description:
      "Looking for a vendor to integrate our hospital management system with NPHIES for real-time eligibility verification and claims submission. Must support Arabic and English.",
    category: "Integration",
    budget: "SAR 200,000 - 400,000",
    deadline: "2025-02-28",
    postedBy: mockUsers[0],
    postedAt: "2025-01-10",
    proposals: 12,
    urgency: "critical",
    tags: ["NPHIES", "Claims", "Integration", "Insurance"],
  },
  {
    id: "n3",
    title: "Arabic-Speaking Patient Chatbot",
    description:
      "Need an AI chatbot that can handle appointment scheduling, medication reminders, and basic triage in Arabic (Gulf dialect). Must be PDPL compliant.",
    category: "Patient Engagement",
    budget: "SAR 150,000 - 300,000",
    deadline: "2025-04-01",
    postedBy: mockUsers[0],
    postedAt: "2025-01-20",
    proposals: 6,
    urgency: "medium",
    tags: ["Chatbot", "Arabic", "Patient", "AI"],
  },
  {
    id: "n4",
    title: "ICD-10 Medical Coding Team",
    description:
      "Need a team of 10 certified medical coders for emergency department coding. Must have GCC experience and be available for remote work.",
    category: "Revenue Cycle",
    budget: "SAR 50,000/month",
    deadline: "2025-02-15",
    postedBy: mockUsers[0],
    postedAt: "2025-01-18",
    proposals: 15,
    urgency: "high",
    tags: ["ICD-10", "Coding", "Revenue Cycle", "Remote"],
  },
  {
    id: "n5",
    title: "FHIR R4 Implementation Consultant",
    description:
      "Seeking a FHIR R4 implementation expert to help us build a patient access API compliant with Saudi regulations. 6-month engagement.",
    category: "Interoperability",
    budget: "SAR 300,000",
    deadline: "2025-03-15",
    postedBy: mockUsers[0],
    postedAt: "2025-01-22",
    proposals: 4,
    urgency: "medium",
    tags: ["FHIR", "API", "Interoperability", "Consulting"],
  },
  {
    id: "n6",
    title: "ICU Clinical Documentation AI",
    description:
      "Need an AI system to automate ICU clinical documentation, reducing physician documentation burden by at least 40%.",
    category: "Clinical AI",
    budget: "SAR 800,000 - 1,500,000",
    deadline: "2025-06-01",
    postedBy: mockUsers[0],
    postedAt: "2025-01-25",
    proposals: 3,
    urgency: "medium",
    tags: ["AI", "ICU", "Documentation", "NLP"],
  },
];

// ─── Mock Offers ───
export const mockOffers: Offer[] = [
  {
    id: "o1",
    title: "Complete Hospital Analytics Dashboard Suite",
    description:
      "Real-time dashboards for clinical, operational, and financial KPIs. Pre-built connectors for major HIS systems in Saudi Arabia.",
    category: "Analytics",
    price: "From SAR 250,000",
    postedBy: mockUsers[1],
    rating: 4.8,
    reviews: 23,
    tags: ["Analytics", "Dashboard", "HIS", "KPI"],
    verified: true,
  },
  {
    id: "o2",
    title: "Medical Coding & Revenue Cycle Optimization",
    description:
      "End-to-end medical coding services with certified AAPC/AHIMA coders. Specialized in ED, IP, and surgical coding for GCC.",
    category: "Revenue Cycle",
    price: "From SAR 30,000/month",
    postedBy: mockUsers[5],
    rating: 4.9,
    reviews: 45,
    tags: ["Coding", "Revenue Cycle", "ICD-10", "CPT"],
    verified: true,
  },
  {
    id: "o3",
    title: "Oracle Health (Cerner) Integration Services",
    description:
      "Complete integration services for Oracle Health (Cerner) Millennium HIS. HL7, FHIR, and custom interface development.",
    category: "Integration",
    price: "Project-based",
    postedBy: mockUsers[3],
    rating: 4.7,
    reviews: 18,
    tags: ["Oracle", "Cerner", "Integration", "HL7"],
    verified: true,
  },
  {
    id: "o4",
    title: "Clinical AI Copilot for Physicians",
    description:
      "AI-powered clinical decision support that integrates with EHR. Supports Arabic clinical notes, drug interaction checks, and evidence-based recommendations.",
    category: "Clinical AI",
    price: "From SAR 100,000/year",
    postedBy: mockUsers[1],
    rating: 4.6,
    reviews: 12,
    tags: ["AI", "Clinical", "Copilot", "CDS"],
    verified: true,
  },
  {
    id: "o5",
    title: "NPHIES & FHIR Integration Platform",
    description:
      "Pre-built NPHIES connector with FHIR R4 support. Eligibility, prior auth, claims, and remittance in one platform.",
    category: "Integration",
    price: "From SAR 180,000",
    postedBy: mockUsers[3],
    rating: 4.9,
    reviews: 31,
    tags: ["NPHIES", "FHIR", "Insurance", "Claims"],
    verified: true,
  },
  {
    id: "o6",
    title: "Clinician Training & Simulation Lab",
    description:
      "Comprehensive training programs for EMR adoption, clinical workflows, and digital health literacy. Available in Arabic and English.",
    category: "Education",
    price: "From SAR 5,000/participant",
    postedBy: mockUsers[7],
    rating: 4.8,
    reviews: 28,
    tags: ["Training", "Simulation", "EMR", "Education"],
    verified: true,
  },
];

// ─── Mock Projects ───
export const mockProjects: Project[] = [
  {
    id: "p1",
    title: "Build Prior Authorization AI System",
    description:
      "Develop an AI-powered prior authorization system that auto-submits, tracks, and appeals insurance prior auth requests. Must integrate with NPHIES.",
    budget: "SAR 600,000 - 900,000",
    duration: "6 months",
    status: "open",
    postedBy: mockUsers[0],
    proposals: 7,
    skills: ["AI/ML", "NPHIES", "FHIR", "Insurance", "Arabic NLP"],
    postedAt: "2025-01-12",
  },
  {
    id: "p2",
    title: "Hospital-Wide FHIR API Gateway",
    description:
      "Build a FHIR R4 compliant API gateway that connects all hospital systems (HIS, LIS, RIS, PACS) and exposes standardized APIs for patient access.",
    budget: "SAR 400,000 - 700,000",
    duration: "8 months",
    status: "open",
    postedBy: mockUsers[0],
    proposals: 5,
    skills: ["FHIR", "API", "Integration", "Security", "Architecture"],
    postedAt: "2025-01-08",
  },
  {
    id: "p3",
    title: "Telemedicine Platform for Rural Clinics",
    description:
      "Build a telemedicine platform connecting rural clinics with specialist physicians. Video, chat, e-prescription, and lab ordering.",
    budget: "SAR 350,000 - 500,000",
    duration: "5 months",
    status: "in-progress",
    postedBy: mockUsers[0],
    proposals: 11,
    skills: ["Telemedicine", "Video", "Mobile", "Integration"],
    postedAt: "2024-11-20",
  },
  {
    id: "p4",
    title: "Patient Experience Analytics Platform",
    description:
      "Build a real-time patient experience analytics platform with NLP-based sentiment analysis of patient feedback in Arabic and English.",
    budget: "SAR 250,000 - 400,000",
    duration: "4 months",
    status: "open",
    postedBy: mockUsers[0],
    proposals: 9,
    skills: ["Analytics", "NLP", "Arabic", "Dashboard", "UX"],
    postedAt: "2025-01-20",
  },
];

// ─── Mock Challenges ───
export const mockChallenges: Challenge[] = [
  {
    id: "c1",
    title: "Reduce Emergency Department Waiting Time",
    description:
      "Develop innovative solutions to reduce ED patient waiting time by at least 30% using AI, process optimization, or digital tools.",
    prize: "SAR 1,000,000",
    deadline: "2025-04-30",
    sponsor: "Ministry of Health",
    submissions: 24,
    status: "open",
    tags: ["Emergency", "AI", "Operations", "Patient Flow"],
  },
  {
    id: "c2",
    title: "Arabic Clinical NLP Challenge",
    description:
      "Build the most accurate Arabic clinical NLP model for medical concept extraction, negation detection, and temporal reasoning.",
    prize: "SAR 500,000",
    deadline: "2025-05-31",
    sponsor: "Saudi Data & AI Authority",
    submissions: 18,
    status: "open",
    tags: ["NLP", "Arabic", "AI", "Clinical"],
  },
  {
    id: "c3",
    title: "Medication Adherence Innovation",
    description:
      "Create solutions that improve medication adherence for chronic disease patients in Saudi Arabia. Consider cultural and linguistic factors.",
    prize: "SAR 750,000",
    deadline: "2025-03-31",
    sponsor: "KFMC",
    submissions: 15,
    status: "judging",
    tags: ["Medication", "Adherence", "Chronic Disease", "mHealth"],
  },
  {
    id: "c4",
    title: "Hospital Readmission Prediction",
    description:
      "Develop an AI model to predict 30-day hospital readmissions for heart failure patients. Must be validated on Saudi patient populations.",
    prize: "SAR 600,000",
    deadline: "2025-06-30",
    sponsor: "National Guard Health Affairs",
    submissions: 9,
    status: "open",
    tags: ["Readmission", "AI", "Cardiology", "Prediction"],
  },
];

// ─── Mock Experts ───
export const mockExperts: Expert[] = [
  {
    id: "e1",
    user: mockUsers[3],
    hourlyRate: "SAR 1,500/hr",
    availability: "available",
    specialties: ["FHIR R4", "NPHIES", "HL7", "Integration"],
    consultations: 156,
    rating: 4.9,
  },
  {
    id: "e2",
    user: mockUsers[2],
    hourlyRate: "SAR 2,000/hr",
    availability: "available",
    specialties: ["Cardiology", "Digital Health", "Clinical AI"],
    consultations: 89,
    rating: 4.8,
  },
  {
    id: "e3",
    user: mockUsers[5],
    hourlyRate: "SAR 800/hr",
    availability: "busy",
    specialties: ["ICD-10", "CPT", "Revenue Cycle", "Coding Audit"],
    consultations: 234,
    rating: 4.9,
  },
  {
    id: "e4",
    user: mockUsers[7],
    hourlyRate: "SAR 1,200/hr",
    availability: "available",
    specialties: ["FHIR", "HL7", "Training", "Architecture"],
    consultations: 178,
    rating: 4.8,
  },
];

// ─── Mock AI Products ───
export const mockAIProducts: AIProduct[] = [
  {
    id: "ai1",
    name: "RadiologyAI Pro",
    description:
      "AI-powered diagnostic assistant for chest X-ray, CT, and MRI analysis. FDA-cleared with Arabic reporting.",
    vendor: mockUsers[1],
    category: "Imaging AI",
    price: "From SAR 200,000/year",
    rating: 4.7,
    deployments: 45,
    tags: ["Radiology", "Imaging", "Diagnostics", "Arabic"],
    demo: true,
  },
  {
    id: "ai2",
    name: "ClinicalNLP Arabic",
    description:
      "Arabic clinical NLP engine for medical concept extraction, coding assistance, and clinical documentation.",
    vendor: mockUsers[1],
    category: "NLP",
    price: "From SAR 150,000/year",
    rating: 4.6,
    deployments: 32,
    tags: ["NLP", "Arabic", "Clinical", "Documentation"],
    demo: true,
  },
  {
    id: "ai3",
    name: "Sepsis Early Warning",
    description:
      "Real-time sepsis prediction and early warning system. Integrates with ICU monitors and EHR systems.",
    vendor: mockUsers[1],
    category: "Clinical Decision Support",
    price: "From SAR 300,000/year",
    rating: 4.8,
    deployments: 28,
    tags: ["Sepsis", "ICU", "Early Warning", "Monitoring"],
    demo: false,
  },
  {
    id: "ai4",
    name: "Revenue Cycle Optimizer",
    description:
      "AI-powered coding suggestion, denial prediction, and revenue cycle optimization. Supports ICD-10-AM and CPT.",
    vendor: mockUsers[1],
    category: "Revenue Cycle",
    price: "From SAR 180,000/year",
    rating: 4.5,
    deployments: 56,
    tags: ["Revenue Cycle", "Coding", "Denials", "AI"],
    demo: true,
  },
];

// ─── Mock Jobs ───
export const mockJobs: Job[] = [
  {
    id: "j1",
    title: "Chief Medical Information Officer (CMIO)",
    organization: "National Health System",
    location: "Riyadh",
    type: "full-time",
    salary: "SAR 60,000 - 80,000/month",
    postedAt: "2025-01-20",
    postedBy: mockUsers[0],
    skills: ["Clinical Informatics", "Leadership", "Strategy", "EMR"],
    urgent: false,
  },
  {
    id: "j2",
    title: "FHIR Integration Developer",
    organization: "HealthTech Consulting",
    location: "Remote",
    type: "remote",
    salary: "SAR 25,000 - 40,000/month",
    postedAt: "2025-01-22",
    postedBy: mockUsers[3],
    skills: ["FHIR R4", "Node.js", "Integration", "HL7"],
    urgent: true,
  },
  {
    id: "j3",
    title: "ICU Registered Nurse",
    organization: "King Faisal Hospital",
    location: "Jeddah",
    type: "full-time",
    salary: "SAR 15,000 - 22,000/month",
    postedAt: "2025-01-18",
    postedBy: mockUsers[0],
    skills: ["ICU", "Critical Care", "BLS", "ACLS"],
    urgent: true,
  },
  {
    id: "j4",
    title: "Medical Coder (Remote)",
    organization: "Revenue Cycle Solutions",
    location: "Remote",
    type: "freelance",
    salary: "SAR 8,000 - 15,000/month",
    postedAt: "2025-01-25",
    postedBy: mockUsers[5],
    skills: ["ICD-10", "CPT", "ED Coding", "IP Coding"],
    urgent: false,
  },
  {
    id: "j5",
    title: "Healthcare AI Research Scientist",
    organization: "Saudi Health AI Lab",
    location: "Riyadh",
    type: "full-time",
    salary: "SAR 35,000 - 55,000/month",
    postedAt: "2025-01-15",
    postedBy: mockUsers[0],
    skills: ["ML", "NLP", "Clinical Data", "Python", "Research"],
    urgent: false,
  },
];

// ─── Mock Courses ───
export const mockCourses: Course[] = [
  {
    id: "cr1",
    title: "ICD-10-CM/PCS Certification Program",
    provider: "Health Exchange Academy",
    duration: "12 weeks",
    price: "SAR 8,500",
    rating: 4.9,
    students: 1250,
    level: "intermediate",
    tags: ["ICD-10", "Coding", "Certification"],
  },
  {
    id: "cr2",
    title: "FHIR R4 Fundamentals & Implementation",
    provider: "FHIR Academy",
    duration: "8 weeks",
    price: "SAR 6,000",
    rating: 4.8,
    students: 890,
    level: "beginner",
    tags: ["FHIR", "Interoperability", "API"],
  },
  {
    id: "cr3",
    title: "AI in Healthcare: From Concept to Deployment",
    provider: "BrainSAIT Academy",
    duration: "10 weeks",
    price: "SAR 12,000",
    rating: 4.7,
    students: 650,
    level: "advanced",
    tags: ["AI", "Healthcare", "Deployment", "Ethics"],
  },
  {
    id: "cr4",
    title: "Saudi Healthcare Regulations & Compliance",
    provider: "Health Exchange Academy",
    duration: "6 weeks",
    price: "SAR 4,500",
    rating: 4.9,
    students: 2100,
    level: "beginner",
    tags: ["Regulations", "PDPL", "Compliance", "Saudi"],
  },
];

// ─── Mock Equipment ───
export const mockEquipment: Equipment[] = [
  {
    id: "eq1",
    name: "GE Revolution CT Scanner",
    category: "Imaging",
    condition: "refurbished",
    price: "SAR 2,500,000",
    location: "Riyadh",
    seller: mockUsers[0],
    images: [],
  },
  {
    id: "eq2",
    name: "Philips IntelliVue MX800 Monitor",
    category: "Monitoring",
    condition: "new",
    price: "SAR 45,000",
    location: "Jeddah",
    seller: mockUsers[0],
    images: [],
  },
  {
    id: "eq3",
    name: "Ventilator - Hamilton C6",
    category: "Respiratory",
    condition: "used",
    price: "SAR 85,000",
    location: "Dammam",
    seller: mockUsers[0],
    images: [],
  },
];

// ─── Mock Datasets ───
export const mockDatasets: Dataset[] = [
  {
    id: "ds1",
    name: "Synthetic Saudi Patient Records (100K)",
    description:
      "Synthetic dataset mimicking Saudi patient demographics, diagnoses, and treatments. PDPL compliant.",
    size: "2.5 GB",
    format: "FHIR JSON / CSV",
    compliance: ["PDPL", "HIPAA", "Synthetic"],
    price: "SAR 15,000",
    provider: mockUsers[1],
    downloads: 234,
  },
  {
    id: "ds2",
    name: "Arabic Medical Text Corpus",
    description:
      "1M+ Arabic clinical notes with medical concept annotations. De-identified and expert-validated.",
    size: "1.8 GB",
    format: "JSON / CoNLL",
    compliance: ["PDPL", "De-identified"],
    price: "SAR 25,000",
    provider: mockUsers[1],
    downloads: 189,
  },
];

// ─── Mock APIs ───
export const mockAPIs: API[] = [
  {
    id: "api1",
    name: "NPHIES Connector API",
    description:
      "Full NPHIES integration: eligibility, prior auth, claims, remittance. REST + FHIR.",
    provider: mockUsers[3],
    category: "Insurance",
    price: "SAR 5,000/month",
    uptime: "99.95%",
    latency: "120ms",
    version: "2.1.0",
  },
  {
    id: "api2",
    name: "FHIR R4 Patient Access API",
    description:
      "Standards-compliant FHIR R4 patient access API. Supports Patient, Encounter, Condition, Observation, and more.",
    provider: mockUsers[3],
    category: "FHIR",
    price: "SAR 3,000/month",
    uptime: "99.99%",
    latency: "85ms",
    version: "4.0.1",
  },
  {
    id: "api3",
    name: "Smart Scheduling API",
    description:
      "Healthcare scheduling API with provider availability, appointment booking, reminders, and waitlist management.",
    provider: mockUsers[1],
    category: "Scheduling",
    price: "SAR 2,000/month",
    uptime: "99.9%",
    latency: "95ms",
    version: "1.5.0",
  },
];
