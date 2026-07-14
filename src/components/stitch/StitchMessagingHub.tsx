"use client";

import { useState } from "react";
import {
  Stethoscope, Bell, Bot, Home, Store, ClipboardList, User,
  Search, Send, Paperclip, CheckCircle2, Clock, Image, FileText,
  Menu, X, Circle, ArrowLeft,
} from "lucide-react";

type Thread = {
  id: number;
  name: string;
  avatar: string;
  message: string;
  time: string;
  unread: number;
  online: boolean;
};

const threads: Thread[] = [
  { id: 1, name: "Dr. Sarah Al-Qahtani", avatar: "SA", message: "The FHIR integration is ready for review.", time: "2m ago", unread: 2, online: true },
  { id: 2, name: "NPHIES Support Team", avatar: "NT", message: "Your eligibility request #8842 has been processed.", time: "15m ago", unread: 0, online: true },
  { id: 3, name: "BioTech Integrations", avatar: "BI", message: "Meeting scheduled for Wednesday at 10 AM.", time: "1h ago", unread: 1, online: false },
  { id: 4, name: "General Hospital Corp", avatar: "GH", message: "Please review the updated proposal.", time: "3h ago", unread: 0, online: false },
  { id: 5, name: "AI Copilot System", avatar: "🤖", message: "New match found for your orthopedic need.", time: "5h ago", unread: 3, online: true },
];

export default function StitchMessagingHub() {
  const [selected, setSelected] = useState<Thread | null>(null);
  const [input, setInput] = useState("");
  const [drawer, setDrawer] = useState(false);

  return (
    <div className="stitch-body h-screen bg-clinical-surface flex flex-col">
      <header className="bg-clinical-surface/70 backdrop-blur-md top-0 sticky z-50 border-b border-clinical-outline-variant/30 shadow-sm flex justify-between items-center px-6 w-full h-16">
        <div className="flex items-center gap-3">
          {selected && <ArrowLeft className="w-5 h-5 md:hidden cursor-pointer" onClick={() => setSelected(null)} />}
          <Stethoscope className="w-6 h-6 text-clinical-primary" />
          <h1 className="text-2xl font-bold text-clinical-primary">Messages</h1>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setDrawer(!drawer)} className="md:hidden p-2 rounded-full hover:bg-clinical-primary-container/20">
            {drawer ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Bell className="w-5 h-5 text-clinical-primary cursor-pointer hidden md:block" />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden max-w-[1280px] mx-auto w-full">
        <aside className={`${selected ? "hidden md:flex" : "flex"} flex-col w-full md:w-80 border-r border-clinical-outline-variant/20 bg-white`}>
          <div className="p-4 border-b border-clinical-outline-variant/20">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-clinical-outline" />
              <input className="w-full pl-10 pr-4 py-2.5 bg-clinical-surface-container-low rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-clinical-secondary/30" placeholder="Search messages..." />
            </div>
            <div className="flex gap-2 mt-3">
              {["Direct", "Groups", "System"].map((t) => (
                <button key={t} className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${t === "Direct" ? "bg-clinical-primary text-white" : "bg-clinical-surface-container-high text-clinical-on-surface-variant hover:bg-clinical-surface-container-highest"}`}>{t}</button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="p-3 mx-3 mt-2 rounded-xl bg-clinical-secondary/5 border border-clinical-secondary/20">
              <div className="flex items-center gap-2 mb-1">
                <Bot className="w-4 h-4 text-clinical-secondary" />
                <span className="text-xs font-bold text-clinical-secondary">Oncology Expansion Project</span>
              </div>
              <p className="text-xs text-clinical-on-surface-variant">8 members · 124 messages · Last active 1h ago</p>
            </div>
            {threads.map((t) => (
              <div key={t.id} onClick={() => setSelected(t)} className={`flex items-start gap-3 p-4 mx-2 rounded-xl cursor-pointer transition-colors ${selected?.id === t.id ? "bg-clinical-primary-container/10" : "hover:bg-clinical-surface-container-low"}`}>
                <div className="relative w-10 h-10 rounded-full bg-clinical-primary-container/20 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {t.avatar}
                  {t.online && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-clinical-tertiary border-2 border-white rounded-full" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold truncate">{t.name}</span>
                    <span className="text-xs text-clinical-on-surface-variant">{t.time}</span>
                  </div>
                  <p className="text-xs text-clinical-on-surface-variant truncate mt-0.5">{t.message}</p>
                </div>
                {t.unread > 0 && <span className="w-5 h-5 bg-clinical-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">{t.unread}</span>}
              </div>
            ))}
          </div>
        </aside>

        <main className={`${selected ? "flex" : "hidden md:flex"} flex-1 flex-col bg-white`}>
          {selected ? (
            <>
              <div className="p-4 border-b border-clinical-outline-variant/20 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-clinical-primary-container/20 flex items-center justify-center text-sm font-bold">{selected.avatar}</div>
                <div>
                  <h3 className="text-sm font-bold">{selected.name}</h3>
                  <span className="text-xs text-clinical-tertiary flex items-center gap-1"><Circle className="w-2 h-2 fill-current" /> Online</span>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-clinical-primary-container/20 flex items-center justify-center text-xs font-bold flex-shrink-0">{selected.avatar}</div>
                  <div className="bg-clinical-surface-container-low rounded-xl rounded-tl-none p-3 max-w-md">
                    <p className="text-sm">{selected.message}</p>
                    <span className="text-[10px] text-clinical-on-surface-variant mt-1 block">{selected.time}</span>
                  </div>
                </div>
                <div className="flex gap-3 items-start flex-row-reverse ml-auto max-w-md">
                  <div className="w-8 h-8 rounded-full bg-clinical-primary flex items-center justify-center text-xs text-white font-bold flex-shrink-0">ME</div>
                  <div className="bg-clinical-primary text-white rounded-xl rounded-tr-none p-3">
                    <p className="text-sm">I'll review it and get back to you before EOD.</p>
                    <span className="text-[10px] text-white/70 mt-1 block">Just now</span>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-clinical-outline-variant/20">
                <div className="flex items-center gap-3 bg-clinical-surface-container-low rounded-full px-4 py-2">
                  <Paperclip className="w-5 h-5 text-clinical-on-surface-variant cursor-pointer hover:text-clinical-primary" />
                  <input className="flex-1 bg-transparent text-sm focus:outline-none" placeholder="Type a message..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && setInput("")} />
                  <button className="w-9 h-9 bg-clinical-primary text-white rounded-full flex items-center justify-center hover:bg-clinical-primary-container transition-colors stitch-active-scale"><Send className="w-4 h-4" /></button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-clinical-on-surface-variant">
              <div className="text-center">
                <Bot className="w-16 h-16 mx-auto mb-4 text-clinical-outline" />
                <p className="text-lg font-semibold">Select a conversation</p>
                <p className="text-sm">Choose a contact to start messaging</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}



