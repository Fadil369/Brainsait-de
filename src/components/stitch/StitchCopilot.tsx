"use client";

import { useState } from "react";
import {
  Stethoscope, Bell, Bot, Home, Store, ClipboardList, User,
  Verified, CheckCircle2, Star, Search, Send, ArrowRight,
  ThumbsUp, ThumbsDown, RefreshCw, Paperclip, Mic, Brain,
  Sparkles, Network, Clock, DollarSign,
} from "lucide-react";

const suggestions = [
  { icon: Verified, text: "Reduce denied insurance claims" },
  { icon: Network, text: "Find FHIR experts" },
  { icon: Search, text: "Procure medical imaging AI" },
];

const initialMessages = [
  {
    role: "assistant",
    text: "Hello! I'm your **Health Copilot**. I can help you find verified providers, optimize your clinical workflows, and navigate the healthcare marketplace. What problem are we solving today?",
  },
  {
    role: "user",
    text: "I'm seeing a 14% increase in denied claims due to missing documentation in the orthopedic department. How can we fix this?",
  },
  {
    role: "assistant",
    text: "I've analyzed your RCM workflow. Based on the documentation gap, here is a verified solution and a consulting partner specializing in Orthopedic FHIR implementation:",
    cards: [
      {
        type: "tool",
        title: "DocuShield AI",
        desc: "Automated orthopaedic clinical documentation integrity (CDI) platform.",
        price: "$1.20 / per claim",
        badge: "TOP MATCH",
      },
      {
        type: "expert",
        title: "InterOp Pros",
        desc: "Certified FHIR implementation experts with 10+ years in orthopedic EHR systems.",
        rating: "4.9/5 Rating",
        badge: "EXPERT",
      },
    ],
  },
];

export default function StitchCopilot() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Let me look into that for you. I'm searching the marketplace for matching providers and solutions...",
        },
      ]);
    }, 800);
  };

  return (
    <div className="stitch-body min-h-screen flex flex-col bg-clinical-surface">
      <header className="bg-clinical-surface/70 backdrop-blur-md top-0 sticky z-50 border-b border-clinical-outline-variant/30 shadow-sm flex justify-between items-center px-6 w-full h-16">
        <div className="flex items-center gap-3">
          <Stethoscope className="w-6 h-6 text-clinical-primary" />
          <h1 className="text-2xl font-bold text-clinical-primary">Health Exchange</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-clinical-primary-container/20 transition-colors">
            <Bell className="w-5 h-5 text-clinical-primary" />
          </button>
          <nav className="hidden md:flex gap-4">
            <span className="text-sm text-clinical-on-surface-variant hover:bg-clinical-primary-container/20 px-2 py-1 rounded transition-colors cursor-pointer">Home</span>
            <span className="text-sm text-clinical-on-surface-variant hover:bg-clinical-primary-container/20 px-2 py-1 rounded transition-colors cursor-pointer">Market</span>
            <span className="text-sm text-clinical-primary font-bold px-2 py-1 rounded cursor-pointer">Copilot</span>
          </nav>
        </div>
      </header>

      <main className="flex-grow flex flex-col max-w-[1280px] mx-auto w-full px-4 md:px-16 py-6">
        <div className="flex flex-wrap gap-3 mb-6 justify-center">
          {suggestions.map((s) => (
            <button
              key={s.text}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-clinical-outline-variant/50 bg-white text-clinical-on-surface hover:bg-clinical-primary-container/10 transition-all hover:-translate-y-0.5 shadow-sm stitch-active-scale"
            >
              <s.icon className="w-[18px] h-[18px] text-clinical-primary" />
              <span className="text-xs font-semibold">{s.text}</span>
            </button>
          ))}
        </div>

        <div className="flex-grow flex flex-col bg-clinical-surface-container-low rounded-xl border border-clinical-outline-variant/20 shadow-sm relative overflow-hidden mb-4">
          <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-6">
            {messages.map((msg, i) => (
              <div key={i}>
                <div className={`flex gap-4 items-start max-w-3xl ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                      msg.role === "assistant"
                        ? "bg-clinical-secondary shadow-lg"
                        : "bg-clinical-primary"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <Bot className="w-5 h-5 text-white" />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div
                    className={`stitch-glass p-4 rounded-xl ${
                      msg.role === "assistant" ? "rounded-tl-none stitch-inner-glow" : "rounded-tr-none border-clinical-primary/10"
                    }`}
                  >
                    <p className="text-base text-clinical-on-surface">{msg.text}</p>
                    {"cards" in msg && msg.cards && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {msg.cards.map((card: any) => (
                          <div
                            key={card.title}
                            className={`bg-white rounded-xl border overflow-hidden hover:border-clinical-primary/40 transition-all group flex flex-col ${
                              card.type === "expert" ? "hover:border-clinical-secondary/40 border-clinical-outline-variant/30" : "border-clinical-outline-variant/30"
                            }`}
                          >
                            <div className={`h-32 relative overflow-hidden ${card.type === "expert" ? "bg-clinical-secondary/5" : "bg-clinical-primary/5"}`}>
                              <div className={`absolute top-2 right-2 px-2 py-1 rounded flex items-center gap-1 text-white text-[10px] font-bold ${
                                card.type === "expert" ? "bg-clinical-secondary-container" : "stitch-verified-badge"
                              }`}>
                                {card.type === "expert" ? (
                                  <Brain className="w-3.5 h-3.5" />
                                ) : (
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                )}
                                <span>{card.badge}</span>
                              </div>
                            </div>
                            <div className="p-3 flex-grow">
                              <h4 className="text-base font-bold mb-1">{card.title}</h4>
                              <p className="text-sm text-clinical-on-surface-variant mb-3">{card.desc}</p>
                              <div className="flex justify-between items-center">
                                <span className={`text-xs font-semibold ${card.type === "expert" ? "text-clinical-on-surface-variant" : "text-clinical-primary"}`}>
                                  {card.price || card.rating}
                                </span>
                                <button className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                                  card.type === "expert"
                                    ? "border border-clinical-secondary text-clinical-secondary hover:bg-clinical-secondary-container hover:text-white"
                                    : "bg-clinical-primary text-white hover:bg-clinical-primary-container"
                                }`}>
                                  {card.type === "expert" ? "Chat with Rep" : "View Tool"}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {msg.role === "assistant" && "cards" in msg === false && (
                  <div className="flex gap-3 ml-14 mt-2">
                    <ThumbsUp className="w-4 h-4 text-clinical-on-surface-variant hover:text-clinical-primary cursor-pointer transition-colors" />
                    <ThumbsDown className="w-4 h-4 text-clinical-on-surface-variant hover:text-clinical-error cursor-pointer transition-colors" />
                    <RefreshCw className="w-4 h-4 text-clinical-on-surface-variant hover:text-clinical-primary cursor-pointer transition-colors" />
                  </div>
                )}
                {msg.role === "assistant" && (
                  <span className="text-[10px] text-clinical-on-surface-variant uppercase tracking-widest ml-14 mt-1 block">AI Agent &bull; Online</span>
                )}
              </div>
            ))}
          </div>

          <div className="p-4 md:p-6 border-t border-clinical-outline-variant/20 bg-clinical-surface/50 backdrop-blur-md">
            <div className="max-w-4xl mx-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-clinical-primary/10 to-clinical-secondary/10 blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
                <div className="relative flex items-center bg-white border-2 border-clinical-outline-variant/40 rounded-full px-6 py-2 shadow-lg group-focus-within:border-clinical-secondary transition-all">
                  <Paperclip className="w-5 h-5 text-clinical-on-surface-variant hover:text-clinical-primary transition-colors mr-3 shrink-0 cursor-pointer" />
                  <input
                    className="flex-grow bg-transparent border-none focus:outline-none text-base placeholder:text-clinical-on-surface-variant/50 py-3"
                    placeholder="Ask AI to compare procurement costs..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  />
                  <div className="flex items-center gap-2 ml-3">
                    <Mic className="w-5 h-5 text-clinical-on-surface-variant hover:text-clinical-secondary transition-colors cursor-pointer p-1 rounded-full stitch-active-scale" />
                    <button
                      onClick={handleSend}
                      className="bg-clinical-primary text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-clinical-primary-container shadow-md stitch-active-scale transition-all"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-clinical-on-surface-variant/60 uppercase tracking-tighter text-center mt-1">
                AI may generate inaccurate information. Always verify medical and financial data.
              </p>
            </div>
          </div>
        </div>
      </main>

      <nav className="bg-clinical-surface/80 backdrop-blur-xl fixed bottom-0 left-0 w-full z-50 rounded-t-xl border-t border-clinical-outline-variant/20 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] flex justify-around items-center px-4 pt-2 pb-6 h-20 md:hidden">
        {[
          { icon: Home, label: "Home", active: false },
          { icon: Store, label: "Market", active: false },
          { icon: Bot, label: "Copilot", active: true },
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
