// EmailJS via REST API (no package needed)
async function sendEmailJSOtp(params: {
  serviceId: string;
  templateId: string;
  publicKey: string;
  templateParams: Record<string, string>;
}): Promise<void> {
  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: params.serviceId,
      template_id: params.templateId,
      user_id: params.publicKey,
      template_params: params.templateParams,
    }),
  });
  if (!res.ok) {
    throw new Error(`EmailJS error: ${res.status}`);
  }
}

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Page } from "../App";
import { Label } from "../components/ui/label";
import { useInView } from "../hooks/useInView";
import type { CustomerSession } from "../types";

// ── EmailJS Config ──
const EMAILJS_SERVICE_ID = "service_f7pegwf";
const EMAILJS_OTP_TEMPLATE_ID = "template_03ut1un";
const EMAILJS_PUBLIC_KEY = "jhEUnVjrPDVHNP2SL";

interface Props {
  navigate: (p: Page) => void;
}

type Tab = "phone" | "email";
type Step = "input" | "otp" | "name";

// Secure OTP store in memory only (not localStorage)
interface OtpRecord {
  code: string;
  expiresAt: number;
  contact: string;
}
let otpStore: OtpRecord | null = null;

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function AuthPage({ navigate }: Props) {
  const [tab, setTab] = useState<Tab>("phone");
  const [step, setStep] = useState<Step>("input");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { ref: cardRef, inView: cardInView } = useInView();

  const contact = tab === "phone" ? phone : email;

  // Countdown timer
  useEffect(() => {
    if (step === "otp") {
      setCountdown(120);
      setCanResend(false);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const sendOtp = async (isResend = false) => {
    if (tab === "phone" && !/^[6-9]\d{9}$/.test(phone)) {
      toast.error("Enter valid 10-digit Indian mobile number");
      return;
    }
    if (tab === "email" && !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      toast.error("Enter valid email address");
      return;
    }

    setLoading(true);
    const newOtp = generateOTP();
    otpStore = {
      code: newOtp,
      expiresAt: Date.now() + 2 * 60 * 1000,
      contact,
    };

    try {
      if (tab === "email") {
        await sendEmailJSOtp({
          serviceId: EMAILJS_SERVICE_ID,
          templateId: EMAILJS_OTP_TEMPLATE_ID,
          publicKey: EMAILJS_PUBLIC_KEY,
          templateParams: {
            to_email: email,
            otp_code: newOtp,
            to_name: "Customer",
            from_name: "Manash PC World 2.0",
          },
        });
        setLoading(false);
        setStep("otp");
        setOtp("");
        setOtpAttempts(0);
        if (isResend) {
          toast.success(`New OTP sent to ${email}!`);
        } else {
          toast.success(`OTP sent to ${email}! Check your inbox.`);
        }
      } else {
        setTimeout(() => {
          setLoading(false);
          setStep("otp");
          setOtp("");
          setOtpAttempts(0);
          if (isResend) {
            toast.success(`New OTP: ${newOtp}`, { duration: 10000 });
          } else {
            toast.success(`Your OTP: ${newOtp}`, { duration: 10000 });
          }
        }, 800);
      }
    } catch (err) {
      setLoading(false);
      console.error("EmailJS error:", err);
      setStep("otp");
      setOtp("");
      setOtpAttempts(0);
      toast.error(`Email delivery failed. Your OTP: ${newOtp}`, {
        duration: 12000,
      });
    }
  };

  const verifyOtp = () => {
    if (!otpStore) {
      toast.error("No OTP generated. Please request again.");
      return;
    }
    if (Date.now() > otpStore.expiresAt) {
      toast.error("OTP expired. Please request a new one.");
      otpStore = null;
      setCanResend(true);
      setCountdown(0);
      return;
    }
    if (otpStore.contact !== contact) {
      toast.error("OTP mismatch. Please request again.");
      return;
    }
    if (otp !== otpStore.code) {
      const attempts = otpAttempts + 1;
      setOtpAttempts(attempts);
      if (attempts >= 3) {
        toast.error("Too many wrong attempts. Please request a new OTP.");
        otpStore = null;
        setCanResend(true);
        setCountdown(0);
        setOtp("");
      } else {
        toast.error(`Incorrect OTP. ${3 - attempts} attempt(s) remaining.`);
      }
      return;
    }

    otpStore = null;
    if (timerRef.current) clearInterval(timerRef.current);

    const existing = (() => {
      try {
        return JSON.parse(localStorage.getItem("customers") || "[]");
      } catch {
        return [];
      }
    })();
    const found = existing.find((c: CustomerSession) =>
      tab === "phone" ? c.phone === phone : c.email === email,
    );
    if (found) {
      localStorage.setItem(
        "customerSession",
        JSON.stringify({ ...found, isLoggedIn: true }),
      );
      toast.success(`Welcome back, ${found.name}!`);
      navigate("home");
    } else {
      setStep("name");
    }
  };

  const completeRegistration = () => {
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    const session: CustomerSession = {
      id: `cust_${Date.now()}`,
      name: name.trim(),
      phone: tab === "phone" ? phone : "",
      email: tab === "email" ? email : "",
      isLoggedIn: true,
    };
    const customers = (() => {
      try {
        return JSON.parse(localStorage.getItem("customers") || "[]");
      } catch {
        return [];
      }
    })();
    customers.push(session);
    localStorage.setItem("customers", JSON.stringify(customers));
    localStorage.setItem("customerSession", JSON.stringify(session));
    toast.success(`Welcome, ${session.name}!`);
    navigate("home");
  };

  const pinkBtn = {
    background:
      "linear-gradient(135deg, oklch(0.81 0.1 20), oklch(0.75 0.09 15))",
    color: "#fff",
    boxShadow: "0 4px 16px oklch(0.81 0.1 20 / 0.35)",
    borderRadius: "9999px",
  } as React.CSSProperties;

  const pinkBtnDisabled = {
    background: "oklch(0.9 0.02 250)",
    color: "oklch(0.65 0.02 250)",
    borderRadius: "9999px",
    cursor: "not-allowed",
  } as React.CSSProperties;

  const iosInput = {
    background: "oklch(0.97 0.01 20)",
    border: "1.5px solid oklch(0.88 0.04 15)",
    borderRadius: "12px",
    color: "oklch(0.25 0.02 250)",
    padding: "12px 16px",
    fontSize: "16px",
    width: "100%",
    outline: "none",
    transition: "border-color 0.2s",
  } as React.CSSProperties;

  return (
    <div
      className="min-h-[90vh] flex items-center justify-center px-4 py-12"
      style={{
        background:
          "linear-gradient(160deg, oklch(0.93 0.05 15) 0%, oklch(0.93 0.05 220) 100%)",
      }}
    >
      <div
        ref={cardRef as React.RefObject<HTMLDivElement>}
        data-ocid="auth.dialog"
        className={`w-full max-w-md p-8 transition-all duration-700 ${
          cardInView ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        style={{
          background: "oklch(1 0 0 / 0.85)",
          backdropFilter: "blur(20px)",
          border: "1px solid oklch(1 0 0 / 0.6)",
          borderRadius: "24px",
          boxShadow: "0 8px 40px oklch(0.81 0.1 20 / 0.18)",
        }}
      >
        {/* Logo & title */}
        <div className="text-center mb-6">
          <div className="text-2xl font-extrabold gradient-text-ios mb-1">
            Manash PC World 2.0
          </div>
          <p className="text-sm" style={{ color: "oklch(0.55 0.02 250)" }}>
            Secure Login — OTP Verification
          </p>
          <div
            className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-medium"
            style={{
              background: "oklch(0.92 0.06 145 / 0.35)",
              border: "1px solid oklch(0.75 0.1 145 / 0.35)",
              color: "oklch(0.42 0.12 145)",
            }}
          >
            🔒 Real-time OTP • 2 min expiry • 3 attempts
          </div>
        </div>

        {/* iOS-style tabs */}
        <div
          className="flex rounded-2xl overflow-hidden mb-6 p-1"
          style={{
            background: "oklch(0.93 0.02 15)",
            border: "1px solid oklch(0.88 0.03 15)",
          }}
        >
          {(["phone", "email"] as Tab[]).map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => {
                setTab(t);
                setStep("input");
                setOtp("");
                otpStore = null;
                if (timerRef.current) clearInterval(timerRef.current);
              }}
              className="flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200"
              style={{
                background:
                  tab === t
                    ? "linear-gradient(135deg, oklch(0.81 0.1 20), oklch(0.85 0.12 220))"
                    : "transparent",
                color: tab === t ? "#fff" : "oklch(0.6 0.02 250)",
                boxShadow:
                  tab === t ? "0 2px 8px oklch(0.81 0.1 20 / 0.25)" : "none",
              }}
            >
              {t === "phone" ? "📱 Phone" : "✉️ Email (Real OTP)"}
            </button>
          ))}
        </div>

        {/* Step: Input */}
        {step === "input" && (
          <div className="space-y-4">
            {tab === "phone" ? (
              <div>
                <Label
                  className="text-sm font-semibold mb-2 block"
                  style={{ color: "oklch(0.35 0.02 250)" }}
                >
                  Mobile Number
                </Label>
                <div className="flex">
                  <span
                    className="inline-flex items-center px-4 text-sm font-medium"
                    style={{
                      background: "oklch(0.93 0.02 15)",
                      border: "1.5px solid oklch(0.88 0.04 15)",
                      borderRight: "none",
                      borderRadius: "12px 0 0 12px",
                      color: "oklch(0.45 0.02 250)",
                    }}
                  >
                    +91
                  </span>
                  <input
                    type="tel"
                    placeholder="10-digit mobile"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    maxLength={10}
                    data-ocid="auth.input"
                    style={{ ...iosInput, borderRadius: "0 12px 12px 0" }}
                  />
                </div>
                <p
                  className="text-xs mt-1"
                  style={{ color: "oklch(0.6 0.02 250)" }}
                >
                  OTP will be displayed on screen
                </p>
              </div>
            ) : (
              <div>
                <Label
                  className="text-sm font-semibold mb-2 block"
                  style={{ color: "oklch(0.35 0.02 250)" }}
                >
                  Email Address
                </Label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-ocid="auth.input"
                  style={iosInput}
                />
                <p
                  className="text-xs mt-1"
                  style={{ color: "oklch(0.42 0.12 145)" }}
                >
                  ✅ Real OTP will be sent to your inbox
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => sendOtp(false)}
              disabled={loading}
              data-ocid="auth.submit_button"
              className="w-full py-4 font-semibold transition-all duration-200"
              style={loading ? pinkBtnDisabled : pinkBtn}
            >
              {loading ? "Sending OTP..." : "Send OTP →"}
            </button>

            <p
              className="text-center text-xs"
              style={{ color: "oklch(0.6 0.02 250)" }}
            >
              🔐 Unique OTP generated every time. No spam.
            </p>
          </div>
        )}

        {/* Step: OTP */}
        {step === "otp" && (
          <div className="space-y-5">
            <p
              className="text-sm text-center"
              style={{ color: "oklch(0.55 0.02 250)" }}
            >
              OTP sent to{" "}
              <span
                className="font-bold"
                style={{ color: "oklch(0.81 0.1 20)" }}
              >
                {contact}
              </span>
              {tab === "email" && (
                <span
                  className="block text-xs mt-0.5"
                  style={{ color: "oklch(0.42 0.12 145)" }}
                >
                  ✉️ Check your inbox (and spam folder)
                </span>
              )}
            </p>

            {/* Countdown */}
            <div
              className="flex items-center justify-between rounded-2xl px-4 py-3"
              style={{
                background:
                  countdown > 30
                    ? "oklch(0.92 0.06 145 / 0.2)"
                    : "oklch(0.94 0.06 30 / 0.25)",
                border: `1px solid ${
                  countdown > 30
                    ? "oklch(0.75 0.1 145 / 0.3)"
                    : "oklch(0.8 0.12 30 / 0.4)"
                }`,
              }}
            >
              <span
                className="text-xs font-medium"
                style={{
                  color:
                    countdown > 30
                      ? "oklch(0.42 0.12 145)"
                      : "oklch(0.55 0.15 30)",
                }}
              >
                {countdown > 0 ? "⏱ Expires in" : "⚠️ OTP expired"}
              </span>
              {countdown > 0 && (
                <span
                  className="text-sm font-bold tabular-nums"
                  style={{
                    color:
                      countdown > 30
                        ? "oklch(0.42 0.12 145)"
                        : "oklch(0.55 0.15 30)",
                  }}
                >
                  {formatTime(countdown)}
                </span>
              )}
            </div>

            {/* iOS-style OTP input — large single box */}
            <div>
              <Label
                className="text-sm font-semibold mb-2 block"
                style={{ color: "oklch(0.35 0.02 250)" }}
              >
                Enter 6-digit OTP
              </Label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="• • • • • •"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                onKeyDown={(e) =>
                  e.key === "Enter" && otp.length === 6 && verifyOtp()
                }
                maxLength={6}
                disabled={countdown === 0}
                data-ocid="auth.input"
                style={{
                  ...iosInput,
                  textAlign: "center",
                  fontSize: "28px",
                  letterSpacing: "0.5em",
                  fontWeight: "bold",
                  opacity: countdown === 0 ? 0.5 : 1,
                  borderColor:
                    otp.length === 6
                      ? "oklch(0.81 0.1 20)"
                      : "oklch(0.88 0.04 15)",
                }}
              />
              {otpAttempts > 0 && (
                <p
                  className="text-xs mt-1"
                  style={{ color: "oklch(0.55 0.15 30)" }}
                >
                  ⚠️ {otpAttempts}/3 wrong attempts
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={verifyOtp}
              disabled={otp.length !== 6 || countdown === 0}
              data-ocid="auth.submit_button"
              className="w-full py-4 font-semibold transition-all duration-200"
              style={
                otp.length === 6 && countdown > 0 ? pinkBtn : pinkBtnDisabled
              }
            >
              ✅ Verify OTP
            </button>

            {/* Resend / change */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep("input")}
                className="text-xs font-medium transition-colors"
                style={{ color: "oklch(0.6 0.02 250)" }}
              >
                ← Change {tab === "phone" ? "number" : "email"}
              </button>
              <button
                type="button"
                onClick={() => sendOtp(true)}
                disabled={!canResend || loading}
                className="text-xs font-semibold transition-all"
                style={{
                  color: canResend
                    ? "oklch(0.81 0.1 20)"
                    : "oklch(0.7 0.02 250)",
                  cursor: canResend ? "pointer" : "not-allowed",
                }}
              >
                🔄 Resend
                {!canResend && countdown > 0
                  ? ` (${formatTime(countdown)})`
                  : ""}
              </button>
            </div>
          </div>
        )}

        {/* Step: Name */}
        {step === "name" && (
          <div className="space-y-4">
            <div
              className="rounded-2xl p-3 text-center"
              style={{
                background: "oklch(0.92 0.06 145 / 0.2)",
                border: "1px solid oklch(0.75 0.1 145 / 0.3)",
              }}
            >
              <p
                className="text-sm font-medium"
                style={{ color: "oklch(0.42 0.12 145)" }}
              >
                ✅ OTP verified successfully!
              </p>
            </div>
            <p
              className="text-sm text-center"
              style={{ color: "oklch(0.55 0.02 250)" }}
            >
              New account — please tell us your name.
            </p>
            <div>
              <Label
                className="text-sm font-semibold mb-2 block"
                style={{ color: "oklch(0.35 0.02 250)" }}
              >
                Full Name
              </Label>
              <input
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && completeRegistration()}
                data-ocid="auth.input"
                style={iosInput}
              />
            </div>
            <button
              type="button"
              onClick={completeRegistration}
              data-ocid="auth.submit_button"
              className="w-full py-4 font-semibold transition-all duration-200"
              style={pinkBtn}
            >
              Create Account →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
