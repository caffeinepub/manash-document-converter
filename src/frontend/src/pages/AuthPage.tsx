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
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
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
      setCountdown(120); // 2 minutes
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
      expiresAt: Date.now() + 2 * 60 * 1000, // 2 minutes
      contact,
    };

    try {
      if (tab === "email") {
        // Send real email OTP via EmailJS REST API
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
        // Phone OTP — show in toast (SMS gateway not configured)
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
      // Fallback: show OTP in toast if email delivery fails
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

    // OTP correct — clear store
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

  return (
    <div
      className="min-h-[80vh] flex items-center justify-center px-4 py-12"
      style={{ background: "oklch(0.12 0.03 250)" }}
    >
      <div
        ref={cardRef as React.RefObject<HTMLDivElement>}
        className={`rounded-2xl w-full max-w-md p-8 transition-all duration-700 ${
          cardInView ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        style={{
          background: "oklch(0.16 0.04 250)",
          border: "1px solid oklch(0.25 0.06 250)",
          boxShadow: "0 24px 64px oklch(0 0 0 / 0.5)",
        }}
        data-ocid="auth.dialog"
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="text-2xl font-extrabold font-display gradient-text-gold">
            Manash PC World 2.0
          </div>
          <p className="text-sm mt-1" style={{ color: "oklch(0.6 0.04 240)" }}>
            Secure Login — OTP Verification
          </p>
          {/* Security badge */}
          <div
            className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-medium"
            style={{
              background: "oklch(0.22 0.06 140 / 0.4)",
              border: "1px solid oklch(0.5 0.15 140 / 0.4)",
              color: "oklch(0.7 0.15 140)",
            }}
          >
            <span>🔒</span> Real-time OTP • 2 min expiry • 3 attempts
          </div>
        </div>

        {/* Tabs */}
        <div
          className="flex rounded-lg overflow-hidden mb-6"
          style={{ border: "1px solid oklch(0.25 0.06 250)" }}
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
              className="flex-1 py-2.5 text-sm font-semibold transition-all"
              style={{
                background: tab === t ? "oklch(0.78 0.18 65)" : "transparent",
                color:
                  tab === t ? "oklch(0.12 0.03 250)" : "oklch(0.6 0.04 240)",
              }}
            >
              {t === "phone" ? "📱 Phone OTP" : "✉️ Email OTP (Real)"}
            </button>
          ))}
        </div>

        {/* Step: Input */}
        {step === "input" && (
          <div className="space-y-4">
            {tab === "phone" ? (
              <div>
                <Label
                  className="text-sm font-medium"
                  style={{ color: "oklch(0.8 0.03 240)" }}
                >
                  Mobile Number
                </Label>
                <div className="flex mt-1">
                  <span
                    className="inline-flex items-center px-3 text-sm rounded-l-lg"
                    style={{
                      background: "oklch(0.20 0.05 250)",
                      border: "1px solid oklch(0.25 0.06 250)",
                      borderRight: "none",
                      color: "oklch(0.7 0.04 240)",
                    }}
                  >
                    +91
                  </span>
                  <Input
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    className="rounded-l-none"
                    maxLength={10}
                    data-ocid="auth.input"
                  />
                </div>
                <p
                  className="text-xs mt-1"
                  style={{ color: "oklch(0.5 0.03 240)" }}
                >
                  OTP will be displayed on screen (SMS gateway not configured)
                </p>
              </div>
            ) : (
              <div>
                <Label
                  className="text-sm font-medium"
                  style={{ color: "oklch(0.8 0.03 240)" }}
                >
                  Email Address
                </Label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                  data-ocid="auth.input"
                />
                <p
                  className="text-xs mt-1"
                  style={{ color: "oklch(0.6 0.15 140)" }}
                >
                  ✅ Real OTP will be sent to your email inbox
                </p>
              </div>
            )}
            <Button
              onClick={() => sendOtp(false)}
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold"
              style={{
                background: "oklch(0.78 0.18 65)",
                color: "oklch(0.12 0.03 250)",
              }}
              data-ocid="auth.submit_button"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </Button>
            <p
              className="text-center text-xs"
              style={{ color: "oklch(0.5 0.03 240)" }}
            >
              🔐 Unique OTP generated every time. No spam.
            </p>
          </div>
        )}

        {/* Step: OTP */}
        {step === "otp" && (
          <div className="space-y-4">
            <p
              className="text-sm text-center"
              style={{ color: "oklch(0.7 0.04 240)" }}
            >
              OTP sent to{" "}
              <span
                className="font-semibold"
                style={{ color: "oklch(0.95 0.02 240)" }}
              >
                {contact}
              </span>
              {tab === "email" && (
                <span
                  className="block text-xs mt-0.5"
                  style={{ color: "oklch(0.6 0.15 140)" }}
                >
                  ✉️ Check your inbox (and spam folder)
                </span>
              )}
            </p>

            {/* Countdown timer */}
            <div
              className="flex items-center justify-between rounded-lg px-4 py-2.5"
              style={{
                background:
                  countdown > 30
                    ? "oklch(0.22 0.06 140 / 0.3)"
                    : "oklch(0.22 0.06 30 / 0.3)",
                border: `1px solid ${
                  countdown > 30
                    ? "oklch(0.5 0.15 140 / 0.4)"
                    : "oklch(0.6 0.18 30 / 0.5)"
                }`,
              }}
            >
              <span
                className="text-xs font-medium"
                style={{
                  color:
                    countdown > 30
                      ? "oklch(0.7 0.15 140)"
                      : "oklch(0.75 0.18 30)",
                }}
              >
                {countdown > 0 ? "⏱ OTP expires in" : "⚠️ OTP expired"}
              </span>
              {countdown > 0 && (
                <span
                  className="text-sm font-bold tabular-nums"
                  style={{
                    color:
                      countdown > 30
                        ? "oklch(0.7 0.15 140)"
                        : "oklch(0.75 0.18 30)",
                  }}
                >
                  {formatTime(countdown)}
                </span>
              )}
            </div>

            <div>
              <Label
                className="text-sm font-medium"
                style={{ color: "oklch(0.8 0.03 240)" }}
              >
                Enter 6-digit OTP
              </Label>
              <Input
                type="text"
                placeholder="• • • • • •"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                onKeyDown={(e) =>
                  e.key === "Enter" && otp.length === 6 && verifyOtp()
                }
                className="mt-1 text-center text-2xl tracking-[0.5em] font-bold"
                maxLength={6}
                disabled={countdown === 0}
                data-ocid="auth.input"
              />
              {otpAttempts > 0 && (
                <p
                  className="text-xs mt-1"
                  style={{ color: "oklch(0.65 0.18 30)" }}
                >
                  ⚠️ {otpAttempts}/3 wrong attempts
                </p>
              )}
            </div>

            <Button
              onClick={verifyOtp}
              disabled={otp.length !== 6 || countdown === 0}
              className="w-full py-3 rounded-lg font-semibold"
              style={{
                background:
                  otp.length === 6 && countdown > 0
                    ? "oklch(0.78 0.18 65)"
                    : "oklch(0.3 0.04 250)",
                color:
                  otp.length === 6 && countdown > 0
                    ? "oklch(0.12 0.03 250)"
                    : "oklch(0.5 0.03 240)",
              }}
              data-ocid="auth.submit_button"
            >
              ✅ Verify OTP
            </Button>

            {/* Resend */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep("input")}
                className="text-xs transition-colors"
                style={{ color: "oklch(0.6 0.04 240)" }}
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
                    ? "oklch(0.78 0.18 65)"
                    : "oklch(0.4 0.03 240)",
                  cursor: canResend ? "pointer" : "not-allowed",
                }}
              >
                🔄 Resend OTP
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
              className="rounded-lg p-3 text-center"
              style={{
                background: "oklch(0.22 0.06 140 / 0.3)",
                border: "1px solid oklch(0.5 0.15 140 / 0.4)",
              }}
            >
              <p
                className="text-sm font-medium"
                style={{ color: "oklch(0.7 0.15 140)" }}
              >
                ✅ OTP verified successfully!
              </p>
            </div>
            <p
              className="text-sm text-center"
              style={{ color: "oklch(0.7 0.04 240)" }}
            >
              New account. Please tell us your name.
            </p>
            <div>
              <Label
                className="text-sm font-medium"
                style={{ color: "oklch(0.8 0.03 240)" }}
              >
                Full Name
              </Label>
              <Input
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && completeRegistration()}
                className="mt-1"
                data-ocid="auth.input"
              />
            </div>
            <Button
              onClick={completeRegistration}
              className="w-full py-3 rounded-lg font-semibold"
              style={{
                background: "oklch(0.78 0.18 65)",
                color: "oklch(0.12 0.03 250)",
              }}
              data-ocid="auth.submit_button"
            >
              Create Account
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
