import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";

const courseData: Record<string, {
  title: string;
  tagline: string;
  price: string;
  description: string;
  longDescription: string;
  features: string[];
  curriculum: { module: string; lessons: string[] }[];
  level: string;
  duration: string;
  language: string;
  icon: string;
  color: string;
  image?: string;
  outcomes: string[];
  audience: string[];
  includes: string[];
}> = {
  "ecourse-nphies": {
    title: "NPHIES Mastery",
    tagline: "Saudi Health Information Exchange Certification",
    price: "SAR 4,499",
    description: "Complete NPHIES technical certification — FHIR R4 transactions, claims submission, eligibility, prior auth, error resolution, and provider portal operations.",
    longDescription: `The definitive technical certification for Saudi Arabia's National Platform for Health Information Exchange Services (NPHIES). This course covers every transaction type, error code, and operational workflow you'll encounter when integrating with the Kingdom's central health information exchange.

Built by engineers who architected production NPHIES integrations, this isn't theory — it's battle-tested implementation knowledge. You'll master FHIR R4 Bundle(MessageHeader) construction, all 16 transaction types, error code resolution (including the infamous BR-B0041 DRG validation), provider portal operations, and polling patterns for asynchronous responses.

Every module includes interactive decision trees, real Bundle JSON examples, and quizzes that mirror actual NPHIES validation logic.`,
    features: [
      "FHIR R4 Bundle(MessageHeader) Mastery",
      "All 16 Transaction Types Covered",
      "Provider Portal Walkthrough",
      "Error Code Resolution (BR-B0041+)",
      "Polling & Async Response Patterns",
      "Real Bundle JSON Examples",
      "Interactive Decision Trees",
      "Completion Certificate",
    ],
    curriculum: [
      { module: "Introduction & Architecture", lessons: ["What is NPHIES?", "Roles: HCP, HIC, TPA, CNHI", "Centralized vs Decentralized", "FHIR R4 Foundation"] },
      { module: "Technical Architecture", lessons: ["Bundle(type=message) Structure", "MessageHeader Deep Dive", "Endpoint: $process-message", "Data Type Constraints (AR/EN lengths)"] },
      { module: "Financial Transactions", lessons: ["Eligibility Request/Response", "Prior Authorization", "Claim Submission (5 Types)", "Claim Response & Adjudication", "Status Check & Cancellation", "Payment Notice & Reconciliation"] },
      { module: "Advanced Transactions", lessons: ["Communication Request/Response", "Fraud Notification", "Advanced Authorization", "Referral Request", "Transfer of Care"] },
      { module: "Provider Portal Operations", lessons: ["Dashboard Navigation", "Eligibility Verification Workflow", "Prior Auth Submission", "Claims Batch Submission", "Transaction Viewer & Polling"] },
      { module: "Error Resolution & Best Practices", lessons: ["Common Error Codes (BR-B0041, etc.)", "Batch vs Individual Resubmission", "Polling Strategies", "Monitoring & Alerting"] },
      { module: "Certification Exam", lessons: ["Practice Quiz (50 Questions)", "Timed Final Exam", "Certificate Generation"] },
    ],
    level: "Intermediate",
    duration: "12 hrs",
    language: "AR/EN",
    icon: "🏛️",
    color: "from-blue-900 via-blue-700 to-cyan-600",
    outcomes: [
      "Submit production-ready FHIR Bundles to NPHIES",
      "Resolve all common error codes without vendor support",
      "Operate the Provider Portal for end-to-end workflows",
      "Design polling strategies for async responses",
      "Pass the NPHIES Technical Certification exam",
    ],
    audience: [
      "Integration Engineers",
      "Health IT Developers",
      "Revenue Cycle Analysts",
      "Hospital IT Directors",
      "Insurance Technical Teams",
    ],
    includes: [
      "Lifetime access to all modules",
      "Downloadable Bundle JSON templates",
      "Error code reference PDF",
      "Provider portal cheat sheet",
      "Certificate of completion",
      "Private Discord community",
    ],
  },
  "ecourse-emergency-medicine": {
    title: "Emergency Medicine Pro",
    tagline: "Emergency Medicine Mastery",
    price: "SAR 3,499",
    description: "Comprehensive emergency medicine course with interactive cases, algorithm trainers, and Arabic/English bilingual clinical scenarios.",
    longDescription: `Master emergency medicine through interactive clinical simulations. This course goes beyond textbook algorithms — you'll make real-time decisions in evolving patient scenarios, receive instant feedback on your clinical reasoning, and build muscle memory for high-stakes scenarios.

Features bilingual (AR/EN) content with Saudi clinical guidelines, ACLS/PALS algorithm trainers with interactive decision trees, and 50+ simulated cases covering trauma, cardiac, toxicology, pediatric, and environmental emergencies.`,
    features: [
      "50+ Interactive Clinical Cases",
      "ACLS/PALS Algorithm Trainers",
      "Bilingual Clinical Scenarios (AR/EN)",
      "Real-time Decision Feedback",
      "Trauma Assessment Simulations",
      "Toxicology Decision Trees",
      "Pediatric Emergency Protocols",
      "CME-Eligible Certificate",
    ],
    curriculum: [
      { module: "Foundations & Triage", lessons: ["Saudi Triage Guidelines", "Primary Survey (ABCDE)", "Vital Signs Interpretation", "Documentation Standards"] },
      { module: "Cardiac Emergencies", lessons: ["ACS Recognition", "ACLS Algorithm Trainer", "Arrhythmia Management", "Post-ROSC Care"] },
      { module: "Trauma & Surgical", lessons: ["ATLS Primary/Secondary Survey", "Chest/Abdominal Trauma", "Burn Assessment", "Orthopedic Emergencies"] },
      { module: "Medical Emergencies", lessons: ["Respiratory Failure", "Sepsis & Septic Shock", "DKA/HHS", "Stroke & TIA"] },
      { module: "Toxicology & Environmental", lessons: ["Toxidrome Recognition", "Common Overdoses", "Heat Stroke", "Envenomation"] },
      { module: "Pediatric Emergencies", lessons: ["PALS Algorithm", "Respiratory Distress", "Seizure Management", "Non-Accidental Trauma"] },
      { module: "Procedural Skills", lessons: ["Airway Management", "Vascular Access", "Chest Tube", "Pericardiocentesis"] },
      { module: "Final Assessment", lessons: ["20 Case Simulation Exam", "Algorithm Proficiency Test", "Certificate Generation"] },
    ],
    level: "Advanced",
    duration: "24 hrs",
    language: "AR/EN",
    icon: "🚑",
    color: "from-red-900 via-red-700 to-orange-600",
    outcomes: [
      "Confidently manage any ED presentation",
      "Execute ACLS/PALS algorithms without hesitation",
      "Communicate effectively in AR/EN during crises",
      "Pass Saudi Board emergency medicine written/oral exams",
    ],
    audience: [
      "Emergency Medicine Residents",
      "ER Physicians",
      "Critical Care Nurses",
      "Paramedics & EMTs",
      "Medical Students (Clinical Years)",
    ],
    includes: [
      "Lifetime access to all modules",
      "Algorithm trainer mobile app",
      "Case library with new cases quarterly",
      "CME certificate (24 hours)",
      "Arabic/English quick-reference cards",
      "Private study group access",
    ],
  },
  "ecourse-lean-healthcare": {
    title: "Lean Healthcare Operations",
    tagline: "Lean Six Sigma for Healthcare",
    price: "SAR 2,999",
    description: "Lean and Six Sigma methodology tailored for Saudi hospitals — value stream mapping, waste reduction, and quality improvement with local case studies.",
    longDescription: `Transform healthcare operations with Lean Six Sigma methodology specifically adapted for Saudi Arabia's healthcare system. Learn from real CBAHI-aligned case studies from Ministry of Health and private hospitals.

This course teaches DMAIC (Define, Measure, Analyze, Improve, Control) with healthcare-specific tools: value stream mapping for patient flow, spaghetti diagrams for clinic layout, Pareto analysis for denial reduction, and statistical process control for lab turnaround times. Includes templates for CBAHI/JCI accreditation preparation.`,
    features: [
      "DMAIC Framework for Healthcare",
      "Value Stream Mapping (Patient Flow)",
      "Saudi Hospital Case Studies",
      "CBAHI/JCI Alignment Templates",
      "Statistical Process Control",
      "Denial Reduction Pareto Analysis",
      "Spaghetti Diagram Clinic Layout",
      "Green Belt Certificate",
    ],
    curriculum: [
      { module: "Lean Foundations in Healthcare", lessons: ["History: Toyota to Healthcare", "8 Wastes (TIMWOODS) in Hospitals", "Voice of Patient vs Voice of Process", "Lean Leadership Behaviors"] },
      { module: "Define Phase", lessons: ["Project Charter Creation", "SIPOC for Clinical Pathways", "Stakeholder Analysis", "Problem Statement Formulation"] },
      { module: "Measure Phase", lessons: ["Process Mapping (Swimlane)", "Data Collection Plans", "Baseline Metrics (LOS, TAT, Denial Rate)", "Process Capability (Cp/Cpk)"] },
      { module: "Analyze Phase", lessons: ["Root Cause Analysis (5 Whys, Fishbone)", "Pareto Analysis for Denials", "Value Stream Mapping Current State", "Bottleneck Identification"] },
      { module: "Improve Phase", lessons: ["Future State VSM Design", "Kaizen Events in Clinical Settings", "Standard Work for Nurses/Physicians", "Visual Management Boards"] },
      { module: "Control Phase", lessons: ["Statistical Process Control Charts", "Control Plans & SOPs", "Mistake Proofing (Poka-Yoke)", "Sustaining Gains"] },
      { module: "Saudi Healthcare Case Studies", lessons: ["MOH Hospital LOS Reduction", "Private Hospital Denial Reduction", "Lab Turnaround Time Improvement", "Outpatient Flow Optimization"] },
      { module: "Green Belt Certification", lessons: ["Project Submission Guidelines", "Mentor Review Process", "Final Presentation", "Certificate Issuance"] },
    ],
    level: "Intermediate",
    duration: "16 hrs",
    language: "AR/EN",
    icon: "📊",
    color: "from-green-900 via-green-700 to-teal-600",
    outcomes: [
      "Lead DMAIC projects in clinical settings",
      "Reduce patient LOS by 20-30%",
      "Cut claim denial rates by 40%+",
      "Prepare for CBAHI/JCI surveys",
      "Earn Lean Six Sigma Green Belt",
    ],
    audience: [
      "Hospital Quality Directors",
      "Clinical Operations Managers",
      "Nurse Leaders",
      "Healthcare Consultants",
      "Medical Directors",
    ],
    includes: [
      "Lifetime access to all modules",
      "DMAIC template library (Excel/PowerPoint)",
      "CBAHI/JCI readiness checklists",
      "Green Belt certificate",
      "Monthly office hours with instructors",
      "Project mentorship (3 months)",
    ],
  },
  "ecourse-coding-ksa": {
    title: "Coding KSA",
    tagline: "Programming for Saudi Healthcare",
    price: "SAR 2,499",
    description: "Interactive bilingual (AR/EN) programming course — Python, healthcare APIs, FHIR integration, and AI-assisted coding with gamified challenges.",
    longDescription: `Learn to code by building real healthcare applications for the Saudi market. This isn't a generic Python course — every lesson uses healthcare data: patient records (synthetic), FHIR resources, NPHIES transaction structures, and ICD-10-AM coding logic.

Built for clinicians, health IT staff, and career-switchers. Start with Python basics, progress to FHIR client development, build an NPHIES eligibility checker, create a DRG grouper CLI, and deploy a coding assistant with AI. Fully bilingual with Arabic variable names and comments supported.`,
    features: [
      "Python for Healthcare Data",
      "FHIR R4 Client Development",
      "NPHIES Integration Patterns",
      "AI-Assisted Coding (Copilot/GPT)",
      "Gamified Coding Challenges",
      "Bilingual Code (AR/EN Variables)",
      "DRG Grouper CLI Project",
      "Portfolio-Ready GitHub Repo",
    ],
    curriculum: [
      { module: "Python Foundations for Healthcare", lessons: ["Variables & Data Types (Medical Records)", "Control Flow (Clinical Logic)", "Functions (Reusable Clinical Algorithms)", "Data Structures (Patient Lists, Encounters)"] },
      { module: "Healthcare Data Formats", lessons: ["CSV/Excel (Lab Results)", "JSON (FHIR Resources)", "XML (HL7 v2/CDA)", "Parquet (Analytics)"] },
      { module: "FHIR R4 & NPHIES APIs", lessons: ["FHIR RESTful API Basics", "Patient/Encounter/Claim Resources", "NPHIES Bundle Construction", "Authentication & Error Handling"] },
      { module: "Building Healthcare Apps", lessons: ["Eligibility Checker CLI", "Claim Validator", "DRG Grouper Tool", "ICD-10-AM Search Engine"] },
      { module: "AI-Assisted Development", lessons: ["GitHub Copilot for Medical Code", "Prompt Engineering for Clinical Logic", "Test Generation for Clinical Algorithms", "Documentation Generation"] },
      { module: "Capstone Project", lessons: ["Design: NPHIES Claim Auto-Submitter", "Build: End-to-End Pipeline", "Test: Synthetic Patient Data", "Deploy: GitHub Actions CI/CD"] },
    ],
    level: "Beginner",
    duration: "20 hrs",
    language: "AR/EN",
    icon: "💻",
    color: "from-purple-900 via-purple-700 to-indigo-600",
    outcomes: [
      "Write production Python for healthcare data",
      "Build FHIR clients for NPHIES/EMR integration",
      "Use AI tools to accelerate clinical software",
      "Publish a portfolio project on GitHub",
    ],
    audience: [
      "Clinicians Learning to Code",
      "Health IT Staff",
      "Medical Students",
      "Career Switchers to Health Tech",
      "Biomedical Engineers",
    ],
    includes: [
      "Lifetime access to all modules",
      "GitHub template repositories",
      "Synthetic patient dataset (10k records)",
      "VS Code healthcare snippets pack",
      "Certificate of completion",
      "Code review sessions (monthly)",
    ],
  },
  "ecourse-medical-manual": {
    title: "دليل الطالب الطبي الحديث",
    tagline: "Modern Medical Student Guide",
    price: "SAR 1,499",
    description: "Premium Arabic interactive guide for medical students — study techniques, clinical rotations, exam prep, and career planning with Amiri/Tajawal typography.",
    longDescription: `The definitive Arabic-language companion for medical students in Saudi Arabia and the Gulf. Built with premium Amiri (serif) and Tajawal (sans) typography, this interactive guide covers the entire medical school journey — from first-year anatomy to residency matching.

Modules include evidence-based study techniques (spaced repetition, active recall, Feynman method), clinical rotation survival guides for each specialty, Saudi Board/SMLE exam strategies, research methodology for medical students, and career pathway planning for Saudi Vision 2030 healthcare roles.`,
    features: [
      "Amiri/Tajawal Premium Typography",
      "Evidence-Based Study Methods",
      "Clinical Rotation Guides (All Specialties)",
      "Saudi Board/SMLE Exam Strategies",
      "Research Methodology Module",
      "Career Pathway Planning (Vision 2030)",
      "Interactive Flashcard System",
      "Progress Tracking Dashboard",
    ],
    curriculum: [
      { module: "أساسيات النجاح في كلية الطب", lessons: ["تقنيات المذاكرة الفعالة", "إدارة الوقت للطالب الطبي", "التوازن بين الدراسة والحياة", "بناء الشبكات الأكاديمية"] },
      { module: "السنوات ما قبل السريرية", lessons: ["تشريح: استراتيجيات الحفظ", "فيزيولوجيا: الفهم قبل الحفظ", "كيمياء حيوية: الخرائط المفاهيمية", "أجهزة الجسم: التكامل السريري"] },
      { module: "الدورات السريرية (الكليركنشيب)", lessons: ["الطب الباطني: النهج المنظم", "الجراحة: أساسيات غرفة العمليات", "الأطفال: النمو والتطور", "النساء والتوليد: المتابعة والولادة", "النفسية: المقابلة النفسية", "طوارئ: الأولويات والقرارات"] },
      { module: "استراتيجيات الامتحانات", lessons: ["SMLE: خريطة المنهج", "Saudi Board: التنسيق الشفهي", "USMLE Step 1/2: للخريجين الدوليين", "أسئلة الاختيار من متعدد: استراتيجيات الحل"] },
      { module: "البحث العلمي للطالب الطبي", lessons: ["أنواع الدراسات الطبية", "إحصاء أساسي للباحثين", "كتابة الورقة العلمية", "النشر في المجلات المحكمة"] },
      { module: "التخطيط المهني ورؤية 2030", lessons: ["التخصصات المطلوبة في السعودية", "برامج الإقامة: المقارنة", "الزمالات والتخصص الدقيق", "ريادة الأعمال الطبية"] },
      { module: "أدوات تفاعلية", lessons: ["نظام البطاقات الذكية (Spaced Repetition)", "مخطط الدورات السريرية", "متتبع التقدم اليومي", "مكتبة الملخصات الجاهزة"] },
    ],
    level: "Beginner",
    duration: "10 hrs",
    language: "AR",
    icon: "🩺",
    color: "from-amber-900 via-amber-700 to-yellow-600",
    outcomes: [
      "Master evidence-based study techniques",
      "Excel in all clinical rotations",
      "Pass SMLE/Saudi Board with confidence",
      "Publish research as a student",
      "Match into your desired residency",
    ],
    audience: [
      "Medical Students (Years 1-6)",
      "Interns & Residents",
      "International Medical Graduates",
      "Pre-med Students",
    ],
    includes: [
      "Lifetime access to all modules",
      "Anki deck (5000+ cards, Arabic/English)",
      "Rotation schedule templates",
      "Exam question bank access",
      "Certificate of completion",
      "Alumni mentorship network",
    ],
  },
  "ecourse-designing-life": {
    title: "Designing Life",
    tagline: "Life Design & Career Mastery",
    price: "SAR 1,899",
    description: "Stanford-style life design methodology adapted for healthcare professionals — career pivoting, purpose mapping, and sustainable growth.",
    longDescription: `Apply Stanford's renowned Life Design curriculum (Burnett & Evans) specifically for healthcare professionals. Whether you're a physician considering admin leadership, a nurse exploring informatics, or a resident choosing fellowship — this course gives you the design thinking toolkit to prototype your future.

Built with healthcare-specific archetypes: Clinical Leader, Physician-Executive, Clinical Informaticist, Medical Entrepreneur, Academic Clinician, Global Health Specialist. Includes Odyssey Planning (3 alternative 5-year lives), Energy Engagement Audit, Good Time Journal, and Failure Immunity exercises.`,
    features: [
      "Stanford Life Design Methodology",
      "Healthcare Career Archetypes",
      "Odyssey Planning (3 Lives)",
      "Energy Engagement Audit",
      "Good Time Journal Template",
      "Failure Immunity Framework",
      "Prototyping Conversations",
      "Coaching Session Included",
    ],
    curriculum: [
      { module: "Introduction to Life Design", lessons: ["Design Thinking for Life", "Reframing Dysfunctional Beliefs", "The Life Design Mindsets", "Healthcare Context"] },
      { module: "Empathize with Yourself", lessons: ["Health Assessment (Physical/Mental)", "Workview & Lifeview", "Good Time Journal (2 Weeks)", "Energy Engagement Audit"] },
      { module: "Define Your Problems", lessons: ["Gravity Problems vs Anchor Problems", "Problem Reframing Workshop", "Healthcare-Specific Problem Types", "Choosing Your Design Challenge"] },
      { module: "Ideate: Odyssey Planning", lessons: ["Three Alternative 5-Year Lives", "Healthcare Archetype Mapping", "Dashboard Metrics for Each Life", "Sharing & Feedback Circles"] },
      { module: "Prototype Your Future", lessons: ["Prototyping Conversations", "Life Design Interviews", "Small Experiments (1 Week)", "Iterating Based on Data"] },
      { module: "Test & Choose", lessons: ["Decision Matrix for Career Moves", "Overcoming Fear of Failure", "Building Your Support Team", "Creating Your Action Plan"] },
      { module: "Healthcare Career Archetypes", lessons: ["Clinical Leader", "Physician-Executive", "Clinical Informaticist", "Medical Entrepreneur", "Academic Clinician", "Global Health Specialist"] },
      { module: "Sustaining Your Design", lessons: ["Quarterly Life Reviews", "Building Resilience", "Mentorship & Sponsorship", "Legacy & Impact"] },
    ],
    level: "All Levels",
    duration: "8 hrs",
    language: "AR/EN",
    icon: "🧭",
    color: "from-indigo-900 via-indigo-700 to-blue-600",
    outcomes: [
      "Design 3 viable 5-year career paths",
      "Conduct 10+ life design interviews",
      "Build a personal advisory board",
      "Launch your first career prototype",
      "Create a sustainable decision-making framework",
    ],
    audience: [
      "Physicians at Career Crossroads",
      "Nurses Seeking Leadership",
      "Residents Choosing Fellowship",
      "Health Admin Professionals",
      "Medical Students (Years 4-6)",
    ],
    includes: [
      "Lifetime access to all modules",
      "Odyssey Planning workbook (PDF + Notion)",
      "Good Time Journal template",
      "1:1 coaching session (45 min)",
      "Alumni community access",
      "Quarterly life review template",
    ],
  },
  "ecourse-republic-of-cells": {
    title: "Republic of Cells",
    tagline: "Cell Biology & Systems Thinking",
    price: "SAR 1,799",
    description: "Interactive cell biology course with systems thinking — organelles as city infrastructure, metabolic pathways as supply chains, DNA as code repositories.",
    longDescription: `Revolutionary approach to cell biology using systems thinking and city metaphors. The cell as a self-governing republic: nucleus = central government (DNA = constitution/laws), mitochondria = power plants, ribosomes = factories, Golgi = post office/logistics, lysosomes = recycling centers, cytoskeleton = transportation infrastructure.

Learn metabolism as supply chain management (glycolysis = raw material processing, TCA cycle = refinery, oxidative phosphorylation = power grid). DNA replication as CI/CD pipeline. Signal transduction as microservices architecture. Perfect for bioengineers, computational biologists, med students, and curious minds who think in systems.`,
    features: [
      "City Metaphor Architecture",
      "Metabolic Supply Chain Mapping",
      "DNA as Code Repository",
      "Systems Thinking Framework",
      "Interactive Pathway Simulators",
      "Microservices Signal Transduction",
      "CRISPR as Code Deployment",
      "Certificate of Completion",
    ],
    curriculum: [
      { module: "The Cell Republic: Governance", lessons: ["Nucleus = Central Government", "DNA = Constitution & Laws", "Chromatin = Archive System", "Nuclear Pore = Border Control"] },
      { module: "Energy Infrastructure", lessons: ["Mitochondria = Power Plants", "Glycolysis = Raw Material Processing", "TCA Cycle = Refinery", "ETC = Power Grid"] },
      { module: "Manufacturing & Logistics", lessons: ["Ribosomes = Factories", "ER = Assembly Lines", "Golgi = Post Office", "Vesicles = Delivery Trucks"] },
      { module: "Waste Management & Recycling", lessons: ["Lysosomes = Recycling Centers", "Proteasomes = Shredders", "Autophagy = Circular Economy", "Peroxisomes = Hazardous Waste"] },
      { module: "Information Technology", lessons: ["DNA Replication = CI/CD Pipeline", "Transcription = Compilation", "Translation = Deployment", "Splicing = Code Refactoring"] },
      { module: "Communication Networks", lessons: ["Signal Transduction = Microservices", "Receptors = API Endpoints", "Second Messengers = Message Queues", "Transcription Factors = Config Management"] },
      { module: "Defense & Border Security", lessons: ["Membrane = Firewall", "MHC = Identity Verification", "Immune Synapse = Security Audit", "Apoptosis = Graceful Shutdown"] },
      { module: "Engineering Biology", lessons: ["CRISPR = Code Deployment", "Synthetic Biology = Platform Engineering", "Metabolic Engineering = Supply Chain Opt", "Cell-Free Systems = Serverless"] },
    ],
    level: "Beginner",
    duration: "12 hrs",
    language: "EN",
    icon: "🔬",
    color: "from-teal-900 via-teal-700 to-cyan-600",
    outcomes: [
      "Explain any cellular process using systems metaphors",
      "Map metabolic pathways as supply chains",
      "Design genetic circuits like software architecture",
      "Apply systems thinking to biological problems",
    ],
    audience: [
      "Bioengineering Students",
      "Computational Biologists",
      "Medical Students (Systems View)",
      "Software Engineers in Bio",
      "Synthetic Biology Researchers",
    ],
    includes: [
      "Lifetime access to all modules",
      "Interactive pathway simulators (web-based)",
      "Cell Republic poster (PDF, printable)",
      "Metabolic supply chain templates",
      "Certificate of completion",
      "Research paper reading list",
    ],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ courseId: string }> }): Promise<Metadata> {
  const { courseId } = await params;
  const course = courseData[courseId];
  if (!course) return { title: "Course Not Found" };
  return {
    title: `${course.title} — BrainSAIT Education`,
    description: course.description,
    openGraph: {
      title: course.title,
      description: course.description,
      images: [`/og/education/${courseId}.png`],
    },
  };
}

export default async function CourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const course = courseData[courseId];

  if (!course) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden">
        <div className={`absolute inset-0 ${course.color}`} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/20" />
        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-2 rounded-full bg-white/20 backdrop-blur border border-white/30 text-sm font-medium mb-6">
              {course.language} • {course.level} • {course.duration}
            </span>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-5xl">{course.icon}</span>
              <div>
                <h1 className="text-4xl md:text-6xl font-bold font-serif text-white mb-2">
                  {course.title}
                </h1>
                <p className="text-xl text-white/90">{course.tagline}</p>
              </div>
            </div>
            <p className="text-lg text-white/80 max-w-2xl mb-8 leading-relaxed">
              {course.description}
            </p>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{course.price}</div>
                <div className="text-white/70 text-sm">Lifetime Access</div>
              </div>
              <div className="w-px h-12 bg-white/30" />
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{course.duration}</div>
                <div className="text-white/70 text-sm">Total Duration</div>
              </div>
              <div className="w-px h-12 bg-white/30" />
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{course.curriculum.length}</div>
                <div className="text-white/70 text-sm">Modules</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold font-serif text-slate-900 mb-6">What You'll Learn</h2>
              <ul className="space-y-3">
                {course.outcomes.map((outcome, i) => (
                  <li key={i} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <svg className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-700 leading-relaxed">{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold font-serif text-slate-900 mb-6">Curriculum</h2>
              <div className="space-y-4">
                {course.curriculum.map((mod, modIndex) => (
                  <details key={mod.module} className="group border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                    <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                      <div className="flex items-center gap-4">
                        <span className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-700">
                          {modIndex + 1}
                        </span>
                        <div>
                          <h4 className="font-semibold text-slate-900">{mod.module}</h4>
                          <p className="text-sm text-slate-500">{mod.lessons.length} lessons</p>
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <div className="px-5 pb-5 border-t border-slate-200 bg-white">
                      <ul className="space-y-2 pl-14">
                        {mod.lessons.map((lesson, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-slate-600 py-1">
                            <span className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-xs font-medium text-slate-500">
                              {i + 1}
                            </span>
                            {lesson}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </details>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold font-serif text-slate-900 mb-6">What's Included</h2>
              <ul className="grid md:grid-cols-2 gap-4">
                {course.includes.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 sticky top-24">
              <div className="text-center mb-8">
                <span className="text-6xl">{course.icon}</span>
                <h3 className="text-2xl font-bold font-serif text-slate-900 mt-4">{course.title}</h3>
                <p className="text-slate-600 mt-2">{course.tagline}</p>
              </div>

              <div className="space-y-4 mb-8 p-6 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-center">
                  <div className="text-4xl font-bold text-slate-900">{course.price}</div>
                  <div className="text-slate-500 text-sm">Lifetime Access</div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-white rounded-lg border border-slate-100">
                    <div className="text-xl font-bold text-slate-900">{course.duration}</div>
                    <div className="text-xs text-slate-500">Duration</div>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-100">
                    <div className="text-xl font-bold text-slate-900">{course.curriculum.length}</div>
                    <div className="text-xs text-slate-500">Modules</div>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-100">
                    <div className="text-xl font-bold text-slate-900">{course.language}</div>
                    <div className="text-xs text-slate-500">Language</div>
                  </div>
                </div>
              </div>

              <button className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-colors text-lg">
                Enroll Now — {course.price}
              </button>

              <p className="text-center text-sm text-slate-500 mt-4">
                Lifetime access · 30-day money-back guarantee · Certificate included
              </p>

              <div className="mt-6 pt-6 border-t border-slate-200 space-y-3 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Instant access to all modules
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Mobile & desktop compatible
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Certificate on completion
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  Private community access
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h4 className="font-semibold text-slate-900 mb-4">Perfect For</h4>
              <ul className="space-y-2">
                {course.audience.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                    <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold font-serif mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            Join thousands of healthcare professionals mastering the technology shaping Saudi healthcare.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-lg transition-all shadow-lg shadow-amber-500/25 text-lg">
              Enroll in {course.title} — {course.price}
            </button>
            <Link href="/marketplace/education" className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-white font-semibold rounded-lg transition-all text-lg">
              Browse Other Courses
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}