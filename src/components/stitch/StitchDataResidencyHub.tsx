"use client";

import {
  Stethoscope, Bell, Bot, Home, Store, ClipboardList, User,
  Server, Globe, Activity, HardDrive, Wifi, CheckCircle2,
  AlertTriangle, Clock, MapPin,
} from "lucide-react";

const regions = [
  { name: "Jeddah (Main)", uptime: 99.97, latency: 12, storage: 68, status: "operational" },
  { name: "Dammam (DR)", uptime: 99.89, latency: 18, storage: 42, status: "operational" },
];

const services = [
  { name: "FHIR R4 Server", status: "healthy", uptime: "99.99%", pods: 4 },
  { name: "IRIS Database", status: "healthy", uptime: "99.97%", pods: 2 },
  { name: "LINC Agent Runtime", status: "healthy", uptime: "99.95%", pods: 6 },
  { name: "API Gateway", status: "healthy", uptime: "99.99%", pods: 3 },
  { name: "Message Queue", status: "degraded", uptime: "99.80%", pods: 2 },
];

export default function StitchDataResidencyHub() {
  return (
    <div className="stitch-body min-h-screen bg-clinical-surface pb-24" dir="rtl">
      <header className="bg-clinical-surface/70 backdrop-blur-md top-0 sticky z-50 border-b border-clinical-outline-variant/30 shadow-sm flex justify-between items-center px-6 w-full h-16">
        <div className="flex items-center gap-3">
          <Stethoscope className="w-6 h-6 text-clinical-primary" />
          <h1 className="text-2xl font-bold text-clinical-primary">مركز صحة الخادم</h1>
        </div>
        <div className="flex items-center gap-4">
          <Bell className="w-5 h-5 text-clinical-primary cursor-pointer" />
          <div className="w-8 h-8 rounded-full bg-clinical-primary-container/10 flex items-center justify-center border border-clinical-primary/20">
            <User className="w-4 h-4 text-clinical-primary" />
          </div>
        </div>
      </header>

      <div className="flex max-w-[1280px] mx-auto">
        <aside className="hidden md:flex flex-col w-60 border-l border-clinical-outline-variant/20 min-h-[calc(100vh-4rem)] p-4 space-y-1">
          {[
            { icon: Activity, label: "لوحة التحكم", active: true },
            { icon: Server, label: "الخدمات" },
            { icon: Globe, label: "المناطق" },
            { icon: HardDrive, label: "التخزين" },
            { icon: Wifi, label: "الشبكة" },
          ].map((item) => (
            <button key={item.label} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${item.active ? "bg-clinical-primary-container/10 text-clinical-primary" : "text-clinical-on-surface-variant hover:bg-clinical-surface-container-high"}`}>
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </aside>

        <main className="flex-1 px-4 md:px-8 py-6 space-y-8">
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "الخدمات النشطة", value: "5 / 5", icon: Server, color: "text-clinical-tertiary bg-clinical-tertiary/10" },
              { label: "زمن الاستجابة", value: "12ms", icon: Activity, color: "text-clinical-primary bg-clinical-primary/10" },
              { label: "نشاط اليوم", value: "142.5K", icon: Wifi, color: "text-clinical-secondary bg-clinical-secondary/10" },
            ].map((kpi) => (
              <div key={kpi.label} className="bg-white rounded-xl border border-clinical-outline-variant/30 p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${kpi.color}`}>
                    <kpi.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm text-clinical-on-surface-variant">{kpi.label}</span>
                </div>
                <p className="text-2xl font-bold">{kpi.value}</p>
              </div>
            ))}
          </section>

          <section>
            <h3 className="text-lg font-bold mb-4">حالة الخدمات</h3>
            <div className="space-y-2">
              {services.map((s) => (
                <div key={s.name} className="bg-white rounded-xl border border-clinical-outline-variant/30 p-4 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${s.status === "healthy" ? "bg-clinical-tertiary" : "bg-yellow-500"}`} />
                    <div>
                      <span className="text-sm font-semibold">{s.name}</span>
                      <p className="text-xs text-clinical-on-surface-variant">{s.pods} pods · {s.uptime} uptime</p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${s.status === "healthy" ? "bg-clinical-tertiary/10 text-clinical-tertiary" : "bg-yellow-100 text-yellow-700"}`}>
                    {s.status === "healthy" ? "سليم" : "منخفض"}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {regions.map((r) => (
              <div key={r.name} className="bg-white rounded-xl border border-clinical-outline-variant/30 p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-clinical-primary" />
                  <h4 className="font-bold">{r.name}</h4>
                  <span className={`mr-auto text-xs font-semibold px-3 py-1 rounded-full ${r.status === "operational" ? "bg-clinical-tertiary/10 text-clinical-tertiary" : "bg-yellow-100 text-yellow-700"}`}>
                    {r.status === "operational" ? "نشط" : "قيد الصيانة"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold">{r.uptime}%</p>
                    <p className="text-xs text-clinical-on-surface-variant">زمن التشغيل</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">{r.latency}ms</p>
                    <p className="text-xs text-clinical-on-surface-variant">زمن الاستجابة</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">{r.storage}%</p>
                    <p className="text-xs text-clinical-on-surface-variant">سعة التخزين</p>
                  </div>
                </div>
                <div className="mt-3 h-2 bg-clinical-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-clinical-primary rounded-full" style={{ width: `${r.storage}%` }} />
                </div>
              </div>
            ))}
          </section>

          <section className="bg-white rounded-xl border border-clinical-outline-variant/30 p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Globe className="w-5 h-5 text-clinical-primary" /> تواجد البيانات</h3>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-48 h-32 rounded-xl bg-clinical-surface-container-high flex items-center justify-center border">
                <Globe className="w-12 h-12 text-clinical-primary/40" />
              </div>
              <div className="flex-1">
                <p className="text-sm mb-2">جميع البيانات الصحية مخزنة في مراكز بيانات داخل المملكة العربية السعودية</p>
                <div className="flex flex-wrap gap-2">
                  {["SDAIA", "NDMO", "ISO 27001", "HIPAA"].map((cert) => (
                    <span key={cert} className="px-3 py-1 rounded-full text-xs font-semibold bg-clinical-tertiary/10 text-clinical-tertiary border border-clinical-tertiary/20">{cert}</span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <nav className="bg-clinical-surface/80 backdrop-blur-xl fixed bottom-0 left-0 w-full z-50 rounded-t-xl border-t border-clinical-outline-variant/20 flex justify-around items-center px-4 pt-2 pb-6 h-20 md:hidden">
        {[Home, Store, Bot, ClipboardList, User].map((Icon, i) => (
          <button key={i} className={`flex flex-col items-center px-4 py-1.5 stitch-active-scale ${i === 0 ? "bg-clinical-primary-container text-white rounded-full" : "text-clinical-on-surface-variant rounded-full"}`}>
            <Icon className="w-5 h-5" />
            <span className="text-xs font-semibold">{[ "الرئيسية", "السوق", "المساعد", "الامتثال", "الملف" ][i]}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
