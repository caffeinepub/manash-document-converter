import { useState } from "react";
import { toast } from "sonner";
import type { Page } from "../App";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
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
    // Check if existing customer
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
    <div className="min-h-[80vh] flex items-center justify-center bg-[#F3F5F8] px-4 py-12">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="text-2xl font-extrabold text-[#0B2A4A]">
            NextGen IT Hub
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Login or create your account
          </p>
        </div>

        {/* Tabs */}
        <div className="flex rounded-lg overflow-hidden border border-gray-200 mb-6">
          {(["phone", "email"] as Tab[]).map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => {
                setTab(t);
                setStep("input");
                setOtp("");
              }}
              className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                tab === t
                  ? "bg-[#0B2A4A] text-white"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
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
                <Label className="text-sm font-medium text-gray-700">
                  Mobile Number
                </Label>
                <div className="flex mt-1">
                  <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-600 text-sm">
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
                  />
                </div>
              </div>
            ) : (
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                />
              </div>
            )}
            <Button
              onClick={sendOtp}
              disabled={loading}
              className="w-full bg-[#0B2A4A] hover:bg-[#1E88FF] text-white py-3 rounded-lg font-semibold"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </Button>
            <p className="text-center text-xs text-gray-400">
              No spam. No robot verification required.
            </p>
          </div>
        )}

        {/* Step: OTP */}
        {step === "otp" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 text-center">
              OTP sent to{" "}
              <span className="font-semibold text-[#0B2A4A]">{contact}</span>
            </p>
            <div>
              <Label className="text-sm font-medium text-gray-700">
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
              />
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
              <p className="text-xs text-blue-700 font-medium">
                Demo OTP: <span className="text-lg font-bold">123456</span>
              </p>
            </div>
            <Button
              onClick={verifyOtp}
              className="w-full bg-[#1E88FF] hover:bg-blue-600 text-white py-3 rounded-lg font-semibold"
            >
              Verify OTP
            </Button>
            <button
              type="button"
              onClick={() => setStep("input")}
              className="w-full text-sm text-gray-500 hover:text-gray-700"
            >
              ← Change {tab === "phone" ? "number" : "email"}
            </button>
          </div>
        )}

        {/* Step: Name */}
        {step === "name" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 text-center">
              One last step — what's your name?
            </p>
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Full Name
              </Label>
              <Input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
              />
            </div>
            <Button
              onClick={completeRegistration}
              className="w-full bg-[#0B2A4A] hover:bg-[#1E88FF] text-white py-3 rounded-lg font-semibold"
            >
              Create Account
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
