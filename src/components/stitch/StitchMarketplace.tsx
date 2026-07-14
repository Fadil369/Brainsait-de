"use client";

import {
  Stethoscope, Bell, Bot, Home, Store, ClipboardList, User,
  Search, Sparkles, ChevronDown, ArrowRight, Star,
  CheckCircle2, Clock, Monitor, Cpu, Users,
  BookOpen, Terminal,
} from "lucide-react";

const categories = [
  { icon: Terminal, label: "Software", color: "text-clinical-primary", bg: "bg-clinical-primary-container/20" },
  { icon: Cpu, label: "AI Agents", color: "text-clinical-secondary", bg: "bg-clinical-secondary-container/20" },
  { icon: Monitor, label: "Medical Devices", color: "text-clinical-tertiary", bg: "bg-clinical-tertiary-container/20" },
  { icon: Users, label: "Consulting", color: "text-clinical-on-surface-variant", bg: "bg-clinical-surface-container-highest" },
  { icon: BookOpen, label: "Training", color: "text-clinical-primary", bg: "bg-clinical-primary-container/20" },
];

const featured = [
  {
    category: "AI Agent",
    color: "text-clinical-secondary",
    title: "Neurolink Diagnostic Core",
    desc: "Autonomous neural mapping agent for real-time surgical guidance and pathology detection.",
    price: "$12,400/yr",
    rating: 4.9,
    img: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&h=400&fit=crop",
  },
  {
    category: "Software",
    color: "text-clinical-primary",
    title: "Epic Integration Layer",
    desc: "Secure, HIPAA-compliant API bridging for seamless EHR data exchange across provider networks.",
    price: "$4,200/mo",
    rating: 4.7,
    img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop",
  },
  {
    category: "Medical Device",
    color: "text-clinical-tertiary",
    title: "OmniDispense AI Unit",
    desc: "Precision robotic pharmacist for error-free medication management and inventory optimization.",
    price: "$45,000",
    rating: 5.0,
    img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop",
  },
];

const allItems = [
  { name: "GenomeX Analysis Tool", provider: "Bio-Systems Lab", type: "Software", typeColor: "text-clinical-primary bg-clinical-primary-container/20", status: "FDA Approved", priced: "$1,200/mo", icon: Terminal },
  { name: "Clinical Triage Bot", provider: "AssistAI Healthcare", type: "AI Agent", typeColor: "text-clinical-secondary bg-clinical-secondary-container/20", status: "Verified", priced: "$800/mo", icon: Cpu },
  { name: "Compliance Review", provider: "Global Med-Legal", type: "Consulting", typeColor: "text-clinical-on-surface-variant bg-clinical-surface-container-highest", status: "Pending", priced: "Inquire", icon: Users },
];

export default function StitchMarketplace() {
  return (
    <div className="stitch-body min-h-screen bg-clinical-surface pb-32">
      <header className="bg-clinical-surface/70 backdrop-blur-md top-0 sticky z-50 border-b border-clinical-outline-variant/30 shadow-sm flex justify-between items-center px-6 w-full h-16">
        <div className="flex items-center gap-3">
          <Stethoscope className="w-6 h-6 text-clinical-primary" />
          <h1 className="text-2xl font-bold text-clinical-primary">Health Exchange</h1>
        </div>
        <nav className="hidden md:flex items-center gap-4">
          <a className="text-clinical-on-surface-variant hover:bg-clinical-primary-container/20 transition-colors px-3 py-1 rounded-full text-sm font-semibold" href="#">Home</a>
          <a className="text-clinical-primary font-bold hover:bg-clinical-primary-container/20 transition-colors px-3 py-1 rounded-full text-sm font-semibold" href="#">Market</a>
          <a className="text-clinical-on-surface-variant hover:bg-clinical-primary-container/20 transition-colors px-3 py-1 rounded-full text-sm font-semibold" href="#">Copilot</a>
        </nav>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full hover:bg-clinical-primary-container/20 transition-colors">
            <Bell className="w-5 h-5 text-clinical-primary" />
          </button>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-clinical-primary/20 bg-clinical-primary-container/10 flex items-center justify-center">
            <User className="w-4 h-4 text-clinical-primary" />
          </div>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-4 md:px-16 py-6">
        <section className="mb-6">
          <div className="stitch-glass p-6 rounded-xl stitch-inner-glow border-2 border-clinical-secondary/10">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-grow w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-clinical-primary" />
                <input
                  className="w-full pl-12 pr-4 py-4 bg-white/50 border-clinical-outline-variant rounded-full text-base focus:ring-2 focus:ring-clinical-secondary/50 focus:border-clinical-secondary transition-all outline-none"
                  placeholder="Ask AI to compare procurement costs or find specific devices..."
                  type="text"
                />
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-clinical-primary text-white rounded-full text-sm font-semibold transition-transform hover:-translate-y-0.5 stitch-active-scale">
                  <Sparkles className="w-4 h-4" />
                  Filters
                </button>
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-clinical-secondary text-white rounded-full text-sm font-semibold transition-transform hover:-translate-y-0.5 stitch-active-scale shadow-lg">
                  <Bot className="w-4 h-4" />
                  AI Agent
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {["Category: All", "Region: North America", "Price: Standard"].map((f) => (
                <div key={f} className="px-4 py-2 bg-clinical-surface-container-high rounded-full text-xs text-clinical-on-surface-variant flex items-center gap-2 cursor-pointer hover:bg-clinical-primary-container/20 transition-colors">
                  {f} <ChevronDown className="w-3 h-3" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-6 overflow-x-auto pb-4">
          <div className="flex md:grid md:grid-cols-5 gap-4 min-w-[800px] md:min-w-0">
            {categories.map((cat) => (
              <div key={cat.label} className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-clinical-primary-container/10 transition-all cursor-pointer group border border-transparent hover:border-clinical-primary/20">
                <div className={`w-16 h-16 rounded-full ${cat.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <cat.icon className={`w-8 h-8 ${cat.color}`} />
                </div>
                <span className="text-sm font-semibold text-center">{cat.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-clinical-primary">Trending Healthcare Solutions</h2>
            <button className="text-clinical-primary text-sm font-semibold flex items-center gap-1 hover:underline">
              View all <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featured.map((item) => (
              <div key={item.title} className="group relative bg-white rounded-xl overflow-hidden border border-clinical-outline-variant/30 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                <div className="h-48 relative overflow-hidden">
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={item.img} alt={item.title} />
                  <div className="absolute top-3 right-3 stitch-verified-badge backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    <span className="text-white text-[10px] tracking-wider uppercase font-semibold">Verified</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-xs font-semibold uppercase tracking-widest ${item.color}`}>{item.category}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      <span className="text-xs font-semibold">{item.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                  <p className="text-sm text-clinical-on-surface-variant line-clamp-2 mb-4">{item.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">{item.price}</span>
                    <button className="px-4 py-2 border border-clinical-primary text-clinical-primary rounded-lg text-xs font-semibold hover:bg-clinical-primary hover:text-white transition-colors">Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-2xl font-semibold text-clinical-primary">All Marketplace Items</h2>
            <div className="h-px flex-grow bg-clinical-outline-variant/20"></div>
          </div>
          <div className="bg-white rounded-xl border border-clinical-outline-variant/30 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead className="bg-clinical-surface-container-low">
                <tr>
                  <th className="px-4 py-4 text-xs font-semibold text-clinical-on-surface-variant uppercase">Provider & Name</th>
                  <th className="px-4 py-4 text-xs font-semibold text-clinical-on-surface-variant uppercase hidden md:table-cell">Type</th>
                  <th className="px-4 py-4 text-xs font-semibold text-clinical-on-surface-variant uppercase">Status</th>
                  <th className="px-4 py-4 text-xs font-semibold text-clinical-on-surface-variant uppercase text-right">Pricing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-clinical-outline-variant/20">
                {allItems.map((item) => (
                  <tr key={item.name} className="stitch-table-row group">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-clinical-primary-container/10 flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-clinical-primary" />
                        </div>
                        <div>
                          <div className="font-bold text-base">{item.name}</div>
                          <div className="text-xs text-clinical-on-surface-variant">{item.provider}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.typeColor}`}>{item.type}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className={`flex items-center gap-1 ${item.status === "Pending" ? "opacity-50" : ""}`}>
                        {item.status === "Pending" ? (
                          <Clock className="w-[18px] h-[18px] text-clinical-outline" />
                        ) : (
                          <CheckCircle2 className="w-[18px] h-[18px] text-clinical-tertiary" />
                        )}
                        <span className={`text-xs font-semibold ${item.status === "Pending" ? "text-clinical-on-surface-variant" : "text-clinical-on-surface"}`}>
                          {item.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right font-bold text-sm">{item.priced}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-4 bg-clinical-surface-container-low flex justify-center">
              <button className="px-6 py-2 bg-white border border-clinical-outline-variant text-clinical-on-surface-variant rounded-lg text-sm font-semibold hover:bg-clinical-surface-container transition-colors">
                Load More Results
              </button>
            </div>
          </div>
        </section>
      </main>

      <nav className="md:hidden bg-clinical-surface/80 backdrop-blur-xl fixed bottom-0 left-0 w-full z-50 rounded-t-xl border-t border-clinical-outline-variant/20 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] flex justify-around items-center px-4 pt-2 pb-6 h-20">
        {[
          { icon: Home, label: "Home", active: false },
          { icon: Store, label: "Market", active: true },
          { icon: Bot, label: "Copilot", active: false },
          { icon: ClipboardList, label: "Projects", active: false },
          { icon: User, label: "Profile", active: false },
        ].map((tab) => (
          <button
            key={tab.label}
            className={`flex flex-col items-center justify-center px-4 py-1.5 transition-all stitch-active-scale ${
              tab.active
                ? "bg-clinical-primary-container text-white rounded-full"
                : "text-clinical-on-surface-variant hover:bg-clinical-surface-container-high rounded-full"
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span className="text-xs font-semibold">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
