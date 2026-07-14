"use client";

import { useState } from "react";
import { X, CreditCard, CheckCircle2, Copy, ExternalLink, ArrowRight, Loader2 } from "lucide-react";
import { SADAD_INFO, formatSAR } from "@/lib/sadad-pricing";

interface SadadPaymentProps {
  amount: number;
  productName: string;
  productId?: string;
  onClose: () => void;
  onComplete?: (reference: string) => void;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[var(--border)] text-[12px] text-gray-600 hover:border-[#1a56db]/30 hover:text-[#1a56db] transition-all"
    >
      {copied ? (
        <><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Copied</>
      ) : (
        <><Copy className="w-3.5 h-3.5" /> Copy</>
      )}
    </button>
  );
}

export function SadadPaymentModal({ amount, productName, productId, onClose, onComplete }: SadadPaymentProps) {
  const [step, setStep] = useState<"details" | "confirm">("details");
  const [reference, setReference] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!reference.trim()) return;
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const verifyRes = await fetch("/api/sadad/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: `INV-${Date.now()}`,
          sadadReference: reference,
          amount,
          customerEmail: "customer@example.com",
          customerName: "Customer",
          productIds: productId ? [productId] : [],
          description: productName,
        }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) {
        throw new Error(verifyData.error || "Payment verification failed");
      }

      const invoiceRes = await fetch("/api/sadad/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, productName, amount, sadadReference: reference }),
      });
      if (!invoiceRes.ok) throw new Error("Failed to create invoice");
      setDone(true);
      onComplete?.(reference);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-[var(--shadow-xl)] max-w-lg w-full max-h-[90vh] overflow-y-auto animate-fade-up" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-[15px] font-700 text-gray-900">SADAD Payment</h3>
              <p className="text-[11px] text-gray-400">stc pay · Biller 207</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {!done ? (
          <div className="p-6 space-y-6">
            {/* Product summary */}
            <div className="bg-[#f8f9fc] rounded-xl p-4 border border-[var(--border)]">
              <p className="text-[12px] text-gray-500 mb-1">Product</p>
              <p className="text-[15px] font-700 text-gray-900">{productName}</p>
              <div className="flex items-center justify-between mt-2 pt-3 border-t border-[var(--border)]">
                <span className="text-[13px] text-gray-500">Amount Due</span>
                <span className="text-[22px] font-800 text-grad-brand">{formatSAR(amount)}</span>
              </div>
            </div>

            {step === "details" && (
              <>
                {/* SADAD instructions */}
                <div>
                  <h4 className="text-[14px] font-700 text-gray-900 mb-3">Pay via SADAD</h4>
                  <ol className="space-y-2.5 text-[13.5px] text-gray-600">
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#1a56db] text-white text-[11px] font-700 flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                      <span>Open your bank's mobile app or internet banking</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#1a56db] text-white text-[11px] font-700 flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                      <span>Select <strong>SADAD</strong> payment service</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#1a56db] text-white text-[11px] font-700 flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                      <span>Enter the biller details below</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#1a56db] text-white text-[11px] font-700 flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                      <span>Pay the exact amount of <strong>{formatSAR(amount)}</strong></span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#1a56db] text-white text-[11px] font-700 flex items-center justify-center flex-shrink-0 mt-0.5">5</span>
                      <span>Enter the SADAD reference number below to confirm</span>
                    </li>
                  </ol>
                </div>

                {/* Biller details */}
                <div className="bg-[#f8f9fc] rounded-xl border border-[var(--border)] divide-y divide-[var(--border)]">
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-[13px] text-gray-500">Biller Name</span>
                    <span className="text-[14px] font-600 text-gray-900">{SADAD_INFO.billerName}</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-[13px] text-gray-500">Biller Code</span>
                    <span className="text-[14px] font-600 text-gray-900">{SADAD_INFO.billerCode}</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-[13px] text-gray-500">SADAD Number</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[16px] font-800 text-gray-900 tracking-wide">{SADAD_INFO.sadadNumber}</span>
                      <CopyButton text={SADAD_INFO.sadadNumber} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-[13px] text-gray-500">Amount</span>
                    <span className="text-[16px] font-800 text-gray-900">{formatSAR(amount)}</span>
                  </div>
                </div>

                <button
                  onClick={() => setStep("confirm")}
                  className="btn btn-primary w-full justify-center"
                >
                  I Have Made the Payment <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}

            {step === "confirm" && (
              <div className="space-y-4">
                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-[13px]">
                    {errorMsg}
                  </div>
                )}
                <p className="text-[14px] text-gray-600">
                  Enter the SADAD reference number from your payment confirmation:
                </p>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="SADAD reference number"
                  className="w-full px-4 py-3 bg-white border border-[var(--border)] rounded-xl text-[15px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1a56db]/40 transition-colors font-mono"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => { setStep("details"); setErrorMsg(null); }}
                    className="btn btn-ghost flex-1 justify-center"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={!reference.trim() || submitting}
                    className="btn btn-primary flex-1 justify-center disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Payment"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-[20px] font-800 text-gray-900">Payment Confirmed!</h3>
            <p className="text-[14px] text-gray-500">
              Your payment of <strong className="text-gray-700">{formatSAR(amount)}</strong> for <strong className="text-gray-700">{productName}</strong> has been received.
            </p>
            <p className="text-[13px] text-gray-400">
              Reference: <span className="font-mono text-gray-600">{reference}</span>
            </p>
            <p className="text-[13px] text-gray-400">
              You will receive access within 24 hours. A confirmation email has been sent to your registered email.
            </p>
            <button onClick={onClose} className="btn btn-primary mt-4">
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function SadadBuyButton({ product, label = "Buy Now" }: { product: { id?: string; name: string; priceSAR: number }; label?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="btn btn-primary w-full justify-center shadow-[var(--shadow-brand)]"
      >
        <CreditCard className="w-4 h-4" />
        {label} — SAR {product.priceSAR.toLocaleString()}
      </button>
      {open && (
        <SadadPaymentModal
          amount={product.priceSAR}
          productName={product.name}
          productId={product.id}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
