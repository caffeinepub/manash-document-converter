import { useState } from "react";
import { toast } from "sonner";
import type { Page } from "../App";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useInView } from "../hooks/useInView";
import type { CustomerSession } from "../types";

interface Props {
  navigate: (p: Page) => void;
}

type Tab = "phone" | "email";
type Step = "input" | "otp" | "name";

export function AuthPage({ navigate }: Props) {
  const [tab, setTab] = useState<Tab>("phone");
  const [step, setStep] = useState<Step>("input");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const { ref: cardRef, inView: cardInView } = useInView();

  const contact = tab === "phone" ? phone : email;

  const sendOtp = () => {
    if (tab === "phone" && !/^[6-9]\d{9}$/.test(phone)) {
      toast.error("Enter valid 10-digit Indian mobile number");
      return;
    }
    if (tab === "email" && !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      toast.error("Enter valid email address");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
      toast.success(`OTP sent to ${contact}`);
    }, 1000);
  };

  const verifyOtp = () => {
    if (otp !== "123456") {
      toast.error("Incorrect OTP. Use demo OTP: 123456");
      return;
    }
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
            NextGen IT Hub
          </div>
          <p className="text-sm mt-1" style={{ color: "oklch(0.6 0.04 240)" }}>
            Login or create your account
          </p>
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
              }}
              className="flex-1 py-2.5 text-sm font-semibold transition-all"
              style={{
                background: tab === t ? "oklch(0.78 0.18 65)" : "transparent",
                color:
                  tab === t ? "oklch(0.12 0.03 250)" : "oklch(0.6 0.04 240)",
              }}
            >
              {t === "phone" ? "📱 Phone OTP" : "✉️ Email OTP"}
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
              </div>
            )}
            <Button
              onClick={sendOtp}
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
              No spam. No robot verification required.
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
            </p>
            <div>
              <Label
                className="text-sm font-medium"
                style={{ color: "oklch(0.8 0.03 240)" }}
              >
                Enter 6-digit OTP
              </Label>
              <Input
                type="text"
                placeholder="6-digit OTP"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="mt-1 text-center text-lg tracking-widest font-bold"
                maxLength={6}
                data-ocid="auth.input"
              />
            </div>
            <div
              className="rounded-lg p-3 text-center"
              style={{
                background: "oklch(0.20 0.05 250)",
                border: "1px solid oklch(0.78 0.18 65 / 0.3)",
              }}
            >
              <p
                className="text-xs font-medium"
                style={{ color: "oklch(0.78 0.18 65)" }}
              >
                Demo OTP: <span className="text-lg font-bold">123456</span>
              </p>
            </div>
            <Button
              onClick={verifyOtp}
              className="w-full py-3 rounded-lg font-semibold"
              style={{
                background: "oklch(0.78 0.18 65)",
                color: "oklch(0.12 0.03 250)",
              }}
              data-ocid="auth.submit_button"
            >
              Verify OTP
            </Button>
            <button
              type="button"
              onClick={() => setStep("input")}
              className="w-full text-xs transition-colors"
              style={{ color: "oklch(0.6 0.04 240)" }}
            >
              ← Go back
            </button>
          </div>
        )}

        {/* Step: Name */}
        {step === "name" && (
          <div className="space-y-4">
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
