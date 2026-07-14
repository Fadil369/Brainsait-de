import Link from "next/link";

const educationCourses = [
  {
    id: "ecourse-nphies",
    title: "NPHIES Mastery",
    tagline: "Saudi Health Information Exchange Certification",
    price: "SAR 4,499",
    description: "Complete NPHIES technical certification — FHIR R4 transactions, claims submission, eligibility, prior auth, error resolution, and provider portal operations.",
    duration: "12 hrs",
    level: "Intermediate",
    language: "AR/EN",
    icon: "🏛️",
    color: "from-blue-900 via-blue-700 to-cyan-600",
    features: ["FHIR R4 Bundle Mastery", "All 16 Transaction Types", "Provider Portal Walkthrough", "Error Code Resolution", "Polling & Async Patterns", "Real Bundle JSON Examples"],
    outcomes: ["Submit production-ready FHIR Bundles", "Resolve all common error codes", "Operate Provider Portal end-to-end", "Pass NPHIES Technical Certification"],
    audience: ["Integration Engineers", "Health IT Developers", "Revenue Cycle Analysts"],
  },
  {
    id: "ecourse-emergency-medicine",
    title: "Emergency Medicine Pro",
    tagline: "Emergency Medicine Mastery",
    price: "SAR 3,499",
    description: "Comprehensive emergency medicine course with interactive cases, algorithm trainers, and Arabic/English bilingual clinical scenarios.",
    duration: "24 hrs",
    level: "Advanced",
    language: "AR/EN",
    icon: "🚑",
    color: "from-red-900 via-red-700 to-orange-600",
    features: ["50+ Interactive Clinical Cases", "ACLS/PALS Algorithm Trainers", "Bilingual Scenarios", "Real-time Decision Feedback", "Trauma Simulations", "CME-Eligible Certificate"],
    outcomes: ["Confidently manage any ED presentation", "Execute ACLS/PALS without hesitation", "Pass Saudi Board emergency medicine exams"],
    audience: ["ER Physicians", "Critical Care Nurses", "Paramedics & EMTs"],
  },
  {
    id: "ecourse-lean-healthcare",
    title: "Lean Healthcare Operations",
    tagline: "Lean Six Sigma for Healthcare",
    price: "SAR 2,999",
    description: "Lean and Six Sigma methodology tailored for Saudi hospitals — value stream mapping, waste reduction, and quality improvement with local case studies.",
    duration: "16 hrs",
    level: "Intermediate",
    language: "AR/EN",
    icon: "📊",
    color: "from-green-900 via-green-700 to-teal-600",
    features: ["DMAIC for Healthcare", "Value Stream Mapping", "Saudi Hospital Case Studies", "CBAHI/JCI Templates", "Statistical Process Control", "Green Belt Certificate"],
    outcomes: ["Lead DMAIC projects in clinical settings", "Reduce patient LOS by 20-30%", "Cut claim denial rates by 40%+", "Earn Lean Six Sigma Green Belt"],
    audience: ["Hospital Quality Directors", "Clinical Ops Managers", "Nurse Leaders"],
  },
  {
    id: "ecourse-coding-ksa",
    title: "Coding KSA",
    tagline: "Programming for Saudi Healthcare",
    price: "SAR 2,499",
    description: "Interactive bilingual (AR/EN) programming course — Python, healthcare APIs, FHIR integration, and AI-assisted coding with gamified challenges.",
    duration: "20 hrs",
    level: "Beginner",
    language: "AR/EN",
    icon: "💻",
    color: "from-purple-900 via-purple-700 to-indigo-600",
    features: ["Python for Healthcare Data", "FHIR R4 & NPHIES APIs", "AI-Assisted Development", "Gamified Challenges", "10K Synthetic Dataset", "VS Code Snippets"],
    outcomes: ["Write production Python for healthcare", "Build FHIR clients for NPHIES", "Use AI tools for clinical software", "Publish portfolio project on GitHub"],
    audience: ["Clinicians Learning to Code", "Health IT Staff", "Medical Students"],
  },
  {
    id: "ecourse-medical-manual",
    title: "دليل الطالب الطبي الحديث",
    tagline: "Modern Medical Student Guide",
    price: "SAR 1,499",
    description: "Premium Arabic interactive guide for medical students — study techniques, clinical rotations, exam prep, and career planning with Amiri/Tajawal typography.",
    duration: "10 hrs",
    level: "Beginner",
    language: "AR",
    icon: "🩺",
    color: "from-amber-900 via-amber-700 to-yellow-600",
    features: ["Amiri/Tajawal Typography", "Evidence-Based Study Methods", "Clinical Rotation Guides", "Saudi Board/SMLE Strategies", "Research Methodology", "Career Pathway (Vision 2030)"],
    outcomes: ["Master evidence-based study techniques", "Excel in all clinical rotations", "Pass SMLE/Saudi Board confidently", "Publish research as a student"],
    audience: ["Medical Students (Years 1-6)", "Interns & Residents", "International Medical Grads"],
  },
  {
    id: "ecourse-designing-life",
    title: "Designing Life",
    tagline: "Life Design & Career Mastery",
    price: "SAR 1,899",
    description: "Stanford-style life design methodology adapted for healthcare professionals — career pivoting, purpose mapping, and sustainable growth.",
    duration: "8 hrs",
    level: "All Levels",
    language: "AR/EN",
    icon: "🧭",
    color: "from-indigo-900 via-indigo-700 to-blue-600",
    features: ["Stanford Life Design Method", "Healthcare Career Archetypes", "Odyssey Planning (3 Lives)", "Energy Engagement Audit", "1:1 Coaching Session", "Alumni Community"],
    outcomes: ["Design 3 viable 5-year career paths", "Conduct 10+ life design interviews", "Build personal advisory board", "Launch first career prototype"],
    audience: ["Physicians at Career Crossroads", "Nurses Seeking Leadership", "Residents Choosing Fellowship"],
  },
  {
    id: "ecourse-republic-of-cells",
    title: "Republic of Cells",
    tagline: "Cell Biology & Systems Thinking",
    price: "SAR 1,799",
    description: "Interactive cell biology with systems thinking — organelles as city infrastructure, metabolic pathways as supply chains, DNA as code repositories.",
    duration: "12 hrs",
    level: "Beginner",
    language: "EN",
    icon: "🔬",
    color: "from-teal-900 via-teal-700 to-cyan-600",
    features: ["City Metaphor Architecture", "Metabolic Supply Chain Mapping", "DNA as Code Repository", "Systems Thinking Framework", "Interactive Pathway Simulators", "CRISPR as Code Deployment"],
    outcomes: ["Explain cellular processes via systems metaphors", "Map metabolic pathways as supply chains", "Design genetic circuits like software", "Apply systems thinking to biology"],
    audience: ["Bioengineering Students", "Computational Biologists", "Med Students (Systems View)", "Software Engineers in Bio"],
  },
];

export default function EducationMarketplacePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-indigo-700 to-purple-800" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-32">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-2 rounded-full bg-white/20 backdrop-blur border border-white/30 text-sm font-medium mb-6">
              BrainSAIT Academy — Education & Certification
            </span>
            <h1 className="text-4xl md:text-6xl font-bold font-serif text-white mb-6">
              Master the Skills Shaping
              <br />
              <span className="text-amber-400">Saudi Healthcare</span>
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mb-10 leading-relaxed">
              Premium interactive courses for clinicians, engineers, and leaders.
              Built by practitioners. Designed for the Kingdom's Vision 2030 healthcare transformation.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/marketplace/education/ecourse-nphies" className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-lg transition-all shadow-lg shadow-amber-500/25 text-lg">
                Start NPHIES Certification
              </Link>
              <Link href="#courses" className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-white font-semibold rounded-lg transition-all text-lg">
                Browse All Courses
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      <section id="courses" className="py-16 max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-slate-900 mb-4">
            Education & Certification Courses
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl">
            Interactive, bilingual, and built by practitioners. Every course includes lifetime access, certificates, and private community.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {educationCourses.map((course) => (
            <Link
              key={course.id}
              href={`/marketplace/education/${course.id}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:border-amber-500/50 transition-all duration-500"
            >
              <div className={`relative h-48 ${course.color}`}>
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-5xl">{course.icon}</span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur text-white text-xs font-medium rounded-full">
                    {course.language}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-600">
                    {course.level}
                  </span>
                  <span className="text-sm text-slate-500">{course.duration}</span>
                </div>

                <h3 className="text-xl font-bold font-serif text-slate-900 group-hover:text-amber-600 transition-colors">
                  {course.title}
                </h3>
                <p className="text-slate-600 line-clamp-2">{course.tagline}</p>
                <p className="text-slate-600 line-clamp-3 text-sm">{course.description}</p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {course.features.slice(0, 3).map((f, i) => (
                    <span key={i} className="px-2 py-1 text-xs bg-slate-50 text-slate-600 rounded-full border border-slate-100">
                      {f}
                    </span>
                  ))}
                  {course.features.length > 3 && (
                    <span className="px-2 py-1 text-xs bg-slate-100 text-slate-500 rounded-full">
                      +{course.features.length - 3} more
                    </span>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">{course.price}</div>
                    <div className="text-xs text-slate-500">Lifetime Access</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">{course.duration}</div>
                    <div className="text-xs text-slate-500">Duration</div>
                  </div>
                  <span className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-colors text-center text-sm group-hover:bg-amber-500 group-hover:text-slate-950">
                    View Course →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-16">
            {[
              { icon: "🎮", title: "Interactive by Design", desc: "Splash screens, progress rings, sidebar nav, animated slides — every course feels like a premium app." },
              { icon: "🌐", title: "True Bilingual (AR/EN)", desc: "RTL Arabic with Amiri/Tajawal fonts, seamless code-switching, culturally relevant examples." },
              { icon: "🧠", title: "Active Learning", desc: "Quizzes with instant feedback, decision trees, algorithm trainers — not passive watching." },
              { icon: "📜", title: "Certification Ready", desc: "Completion certificates, progress tracking, downloadable resources, CBAHI/NPHIES alignment." },
            ].map((item, i) => (
              <div key={i} className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-amber-500/50 transition-colors">
                <span className="text-4xl mb-4 block">{item.icon}</span>
                <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                <p className="text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <h3 className="text-3xl md:text-4xl font-bold font-serif mb-4">
              Enterprise & Bulk Licensing
            </h3>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-12">
              Train your entire team. Volume discounts, LMS integration (SCORM/xAPI), SSO, custom branding, and dedicated success manager.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Team (10-50)", features: ["20% volume discount", "Admin dashboard", "Progress reports", "Email support"], price: "Custom" },
                { title: "Organization (50-500)", features: ["35% volume discount", "LMS integration (SCORM)", "SSO (SAML/OIDC)", "Custom branding", "Priority support"], price: "Custom", popular: true },
                { title: "Enterprise (500+)", features: ["50% volume discount", "Dedicated success manager", "Custom course authoring", "API access", "SLA guarantee", "On-premise option"], price: "Custom" },
              ].map((tier, i) => (
                <div key={i} className={`p-8 rounded-2xl border-2 relative ${tier.popular ? 'border-amber-500 bg-amber-50' : 'border-slate-700 bg-slate-800/50'}`}>
                  {tier.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 text-white text-sm font-semibold rounded-full">Most Popular</div>}
                  <h4 className="text-2xl font-bold mb-2">{tier.title}</h4>
                  <p className="text-4xl font-bold mb-6">{tier.price}</p>
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-slate-300">
                        <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-3 rounded-lg font-semibold transition-colors ${tier.popular ? 'bg-amber-500 hover:bg-amber-400 text-white' : 'bg-amber-500 hover:bg-amber-400 text-white'}`}>
                    Contact Sales
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold font-serif mb-4">
            Ready to Transform Your Healthcare Career?
          </h3>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto">
            Join thousands of healthcare professionals mastering the technology shaping Saudi healthcare.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/marketplace/education/ecourse-nphies" className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-lg transition-all shadow-lg">
              Start NPHIES Certification
            </Link>
            <Link href="/contact" className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-white font-semibold rounded-lg transition-all">
              Enterprise Inquiry
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}