"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Loader2, Sparkles, ChevronRight, MessageSquare } from "lucide-react";

const SUGGESTIONS = [
  "I need to automate ICU documentation",
  "How do I integrate with NPHIES?",
  "Find AI solutions for radiology",
  "What funding is available for health tech?",
];

export function CopilotWidget() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        role: "assistant",
        text: "Hi! I'm your BrainSAIT AI Copilot. Describe your healthcare challenge and I'll find solutions, experts, and resources from our ecosystem.",
      }]);
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const handleSend = async (q?: string) => {
    const msg = q || query;
    if (!msg.trim() || loading) return;
    setQuery("");
    setMessages((m) => [...m, { role: "user", text: msg }]);
    setLoading(true);
    setTyping("");

    try {
      const res = await fetch("/api/marketplace/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");

      const analysis = data.analysis || `Based on "${data.query}" we found ${data.recommendations?.length || 0} relevant resources.`;
      const recommendations = data.recommendations?.slice(0, 3) || [];
      const roadmap = data.roadmap?.slice(0, 3) || [];

      let response = analysis;
      if (roadmap.length > 0) {
        response += "\n\n**Steps:**\n" + roadmap.map((s: string, i: number) => `${i + 1}. ${s}`).join("\n");
      }
      if (recommendations.length > 0) {
        response += "\n\n**Resources:** " + recommendations.map((r: any) => r.title || r.name).join(", ");
      }

      let i = 0;
      const timer = setInterval(() => {
        i++;
        setTyping(response.slice(0, i));
        if (i >= response.length) { clearInterval(timer); setTyping(""); }
      }, 10);
    } catch (err: any) {
      setMessages((m) => [...m, { role: "assistant", text: `Sorry, I couldn't process that. ${err.message || "Please try again."}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full grad-brand shadow-[var(--shadow-brand)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all animate-float"
          aria-label="Open AI Copilot"
        >
          <MessageSquare className="w-6 h-6 text-white" />
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-6rem)] flex flex-col rounded-2xl bg-white border border-[var(--border)] shadow-[var(--shadow-xl)] animate-fade-up overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border)] bg-gradient-to-r from-[#0a0c10] to-[#1a1d24] flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg grad-brand flex items-center justify-center">
                <Bot className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <span className="text-[14px] font-700 text-white">AI Copilot</span>
                <span className="block text-[10px] text-white/40">Healthcare-tuned assistant</span>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-lg hover:bg-white/[0.08] flex items-center justify-center transition-colors">
              <X className="w-4 h-4 text-white/60" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-[#f8f9fc]">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-[13.5px] leading-relaxed ${
                    m.role === "user"
                      ? "bg-[#1a56db] text-white rounded-br-md"
                      : "bg-white border border-[var(--border)] text-gray-700 rounded-bl-md shadow-[var(--shadow-xs)]"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl rounded-bl-md px-4 py-3 bg-white border border-[var(--border)] text-gray-700 text-[13.5px] leading-relaxed shadow-[var(--shadow-xs)]">
                  {typing}
                  <span className="inline-block w-1.5 h-3.5 bg-[#1a56db] ml-0.5 animate-pulse" />
                </div>
              </div>
            )}

            {loading && !typing && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 px-4 py-3 bg-white border border-[var(--border)] rounded-2xl rounded-bl-md text-[13px] text-gray-500">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1a56db]" />
                  Analyzing your challenge…
                </div>
              </div>
            )}

            {messages.length === 1 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSend(s)}
                    className="px-3 py-1.5 bg-white border border-[var(--border)] rounded-lg text-[12px] text-gray-500 hover:border-[#1a56db]/30 hover:text-[#1a56db] transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex-shrink-0 border-t border-[var(--border)] p-3 bg-white">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Describe your healthcare challenge…"
                className="flex-1 px-4 py-2.5 bg-[#f8f9fc] border border-[var(--border)] rounded-xl text-[13.5px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1a56db]/40 transition-colors"
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !query.trim()}
                className="w-10 h-10 rounded-xl grad-brand flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-all flex-shrink-0"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
