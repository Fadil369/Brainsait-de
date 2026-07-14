"use client";

import { useState } from "react";
import {
  Stethoscope, Bell, Bot, Home, Store, ClipboardList, User,
  Wallet, Banknote, Plus, Upload, CheckCircle2, Clock,
  FileText, ArrowRight, AlertCircle, Trash2,
} from "lucide-react";

const banks = [
  { name: "Al Rajhi Bank", account: "SA03 8000 0000 6080 1677 9001", type: "Current", primary: true },
  { name: "SNB (Saudi National Bank)", account: "SA12 1000 0020 1234 5678 9002", type: "Current", primary: false },
];

export default function StitchPayoutConfig() {
  const [schedule, setSchedule] = useState("monthly");

  return (
    <div className="stitch-body min-h-screen bg-clinical-surface pb-24" dir="rtl">
      <header className="bg-clinical-surface/70 backdrop-blur-md top-0 sticky z-50 border-b border-clinical-outline-variant/30 shadow-sm flex justify-between items-center px-6 w-full h-16">
        <div className="flex items-center gap-3">
          <Stethoscope className="w-6 h-6 text-clinical-primary" />
          <h1 className="text-2xl font-bold text-clinical-primary">إعدادات الدفع</h1>
        </div>
        <div className="flex items-center gap-4">
          <Bell className="w-5 h-5 text-clinical-primary cursor-pointer" />
          <div className="w-8 h-8 rounded-full bg-clinical-primary-container/10 flex items-center justify-center border border-clinical-primary/20">
            <User className="w-4 h-4 text-clinical-primary" />
          </div>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-4 md:px-16 py-6 space-y-8">
        <section className="bg-gradient-to-br from-clinical-primary to-clinical-primary/80 rounded-2xl p-6 md:p-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Wallet className="w-6 h-6" />
            <span className="text-white/80">رصيد المحفظة</span>
          </div>
          <p className="text-4xl md:text-5xl font-bold mb-4">42,850.00 <span className="text-xl">SAR</span></p>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-6 py-3 bg-white text-clinical-primary rounded-full text-sm font-bold hover:opacity-90 transition-all stitch-active-scale">
              <Banknote className="w-4 h-4" /> طلب دفع
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-full text-sm font-bold hover:bg-white/30 transition-all stitch-active-scale">
              <Plus className="w-4 h-4" /> إيداع
            </button>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-clinical-outline-variant/30 p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-4">جدول الدفع</h3>
          <div className="flex gap-4">
            {["monthly", "weekly"].map((s) => (
              <button key={s} onClick={() => setSchedule(s)} className={`flex-1 p-4 rounded-xl border-2 text-center transition-all ${schedule === s ? "border-clinical-primary bg-clinical-primary/5" : "border-clinical-outline-variant"}`}>
                <p className="font-bold capitalize">{s === "monthly" ? "شهري" : "أسبوعي"}</p>
                <p className="text-xs text-clinical-on-surface-variant">{s === "monthly" ? "كل 30 يوم" : "كل 7 أيام"}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-xl border border-clinical-outline-variant/30 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">الحسابات البنكية</h3>
            <button className="flex items-center gap-1 text-sm text-clinical-primary font-semibold hover:underline"><Plus className="w-4 h-4" /> إضافة حساب</button>
          </div>
          <div className="space-y-3">
            {banks.map((b) => (
              <div key={b.account} className={`p-4 rounded-xl border ${b.primary ? "border-clinical-primary bg-clinical-primary/5" : "border-clinical-outline-variant"} flex items-center justify-between`}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{b.name}</span>
                    {b.primary && <span className="text-[10px] bg-clinical-primary text-white px-2 py-0.5 rounded-full">أساسي</span>}
                  </div>
                  <p className="text-xs text-clinical-on-surface-variant font-mono mt-1">{b.account}</p>
                  <p className="text-xs text-clinical-on-surface-variant">{b.type}</p>
                </div>
                <div className="flex items-center gap-2">
                  {!b.primary && <button className="p-2 hover:bg-clinical-surface-container-high rounded-lg"><Trash2 className="w-4 h-4 text-clinical-error" /></button>}
                  <CheckCircle2 className={`w-5 h-5 ${b.primary ? "text-clinical-tertiary" : "text-clinical-outline"}`} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-xl border border-clinical-outline-variant/30 p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-clinical-primary" /> المستندات الضريبية</h3>
          <div className="flex items-center justify-between p-4 bg-clinical-surface-container-low rounded-lg mb-4">
            <div>
              <span className="text-sm font-semibold">الرقم الضريبي (VAT)</span>
              <p className="text-xs text-clinical-on-surface-variant">310123456700003</p>
            </div>
            <span className="text-xs bg-clinical-tertiary/10 text-clinical-tertiary px-3 py-1 rounded-full font-semibold">ZATCA متوافق</span>
          </div>
          <div className="border-2 border-dashed border-clinical-outline-variant rounded-xl p-6 text-center hover:border-clinical-primary transition-colors cursor-pointer">
            <Upload className="w-8 h-8 mx-auto mb-2 text-clinical-outline" />
            <p className="text-sm font-semibold">رفع مستند ضريبي</p>
            <p className="text-xs text-clinical-on-surface-variant">PDF, JPG — حد أقصى 10MB</p>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-clinical-outline-variant/30 overflow-hidden shadow-sm">
          <div className="p-6 pb-3">
            <h3 className="text-lg font-bold">آخر المعاملات</h3>
          </div>
          <table className="w-full text-left border-collapse">
            <thead className="bg-clinical-surface-container-low">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-clinical-on-surface-variant uppercase">التاريخ</th>
                <th className="px-6 py-3 text-xs font-semibold text-clinical-on-surface-variant uppercase">الوصف</th>
                <th className="px-6 py-3 text-xs font-semibold text-clinical-on-surface-variant uppercase text-right">المبلغ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-clinical-outline-variant/20">
              {[
                { date: "2026-07-10", desc: "دفعة شهرية — يونيو", amount: "+12,400 SAR" },
                { date: "2026-06-10", desc: "دفعة شهرية — مايو", amount: "+11,800 SAR" },
                { date: "2026-05-10", desc: "دفعة شهرية — أبريل", amount: "+10,200 SAR" },
              ].map((t) => (
                <tr key={t.date} className="stitch-table-row">
                  <td className="px-6 py-4 text-sm">{t.date}</td>
                  <td className="px-6 py-4 text-sm text-clinical-on-surface-variant">{t.desc}</td>
                  <td className="px-6 py-4 text-sm font-bold text-clinical-tertiary text-right">{t.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      <nav className="bg-clinical-surface/80 backdrop-blur-xl fixed bottom-0 left-0 w-full z-50 rounded-t-xl border-t border-clinical-outline-variant/20 flex justify-around items-center px-4 pt-2 pb-6 h-20 md:hidden">
        {[Home, Store, Bot, ClipboardList, User].map((Icon, i) => (
          <button key={i} className={`flex flex-col items-center px-4 py-1.5 stitch-active-scale ${i === 3 ? "bg-clinical-primary-container text-white rounded-full" : "text-clinical-on-surface-variant rounded-full"}`}>
            <Icon className="w-5 h-5" />
            <span className="text-xs font-semibold">{[ "الرئيسية", "السوق", "المساعد", "المدفوعات", "الملف" ][i]}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
