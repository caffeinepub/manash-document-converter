import {
  Facebook,
  Globe,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  User,
  Youtube,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ExternalBlob } from "../backend";
import { useActor } from "../hooks/useActor";
import { useInView } from "../hooks/useInView";
import { getContactInfo } from "../types";

const AUTHORISED_LOGOS = [
  {
    src: "/assets/generated/logo-airtel-payments-bank.dim_200x80.png",
    alt: "Airtel Payment Bank",
  },
  { src: "/assets/generated/logo-sbi-bank.dim_200x80.png", alt: "SBI Bank" },
  {
    src: "/assets/generated/logo-csc-service.dim_200x80.png",
    alt: "CSC Service",
  },
  {
    src: "/assets/generated/logo-digital-india.dim_200x80.png",
    alt: "Digital India",
  },
  { src: "/assets/generated/logo-aadhaar.dim_200x80.png", alt: "Aadhaar" },
  {
    src: "/assets/generated/logo-income-tax.dim_200x80.png",
    alt: "Income Tax",
  },
  {
    src: "/assets/generated/logo-assam-govt.dim_200x80.png",
    alt: "Assam Government",
  },
];

interface OtherWebsite {
  id: string;
  name: string;
  description: string;
  url: string;
  logoUrl: string;
  previewUrl: string;
}

const DEFAULT_WEBSITES: OtherWebsite[] = [
  {
    id: "1",
    name: "CSC Portal",
    description: "Common Service Centre - Digital India services for citizens",
    url: "https://www.csc.gov.in",
    logoUrl: "https://www.google.com/s2/favicons?domain=csc.gov.in&sz=64",
    previewUrl: "",
  },
  {
    id: "2",
    name: "Digital India",
    description:
      "Government of India's digital initiative for empowering citizens",
    url: "https://www.digitalindia.gov.in",
    logoUrl:
      "https://www.google.com/s2/favicons?domain=digitalindia.gov.in&sz=64",
    previewUrl: "",
  },
  {
    id: "3",
    name: "Income Tax Portal",
    description:
      "Official Income Tax e-filing portal for tax returns and PAN services",
    url: "https://www.incometax.gov.in",
    logoUrl: "https://www.google.com/s2/favicons?domain=incometax.gov.in&sz=64",
    previewUrl: "",
  },
];

function getOtherWebsites(): OtherWebsite[] {
  try {
    const stored = localStorage.getItem("otherWebsites");
    if (!stored) return DEFAULT_WEBSITES;
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed
      : DEFAULT_WEBSITES;
  } catch {
    return DEFAULT_WEBSITES;
  }
}

function AuthorisedCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const logos = [...AUTHORISED_LOGOS, ...AUTHORISED_LOGOS, ...AUTHORISED_LOGOS];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let pos = 0;
    const cardWidth = 200 + 24;
    const totalOriginal = AUTHORISED_LOGOS.length * cardWidth;
    let raf: number;
    const step = () => {
      pos += 0.6;
      if (pos >= totalOriginal) pos = 0;
      track.style.transform = `translateX(-${pos}px)`;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className="overflow-hidden w-full"
      aria-label="Authorised logos carousel"
    >
      <div ref={trackRef} className="flex gap-6 will-change-transform">
        {logos.map((logo, i) => (
          <div
            key={`${logo.alt}-${i}`}
            className="flex-shrink-0 w-[160px] md:w-[200px] rounded-2xl shadow-sm flex items-center justify-center p-4"
            style={{
              height: "90px",
              background: "rgba(255,255,255,0.9)",
              border: "1.5px solid rgba(255,182,217,0.25)",
              backdropFilter: "blur(10px)",
            }}
          >
            <img
              src={logo.src}
              alt={logo.alt}
              className="max-w-full max-h-full object-contain"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function OtherWebsitesSection() {
  const [websites] = useState<OtherWebsite[]>(() => getOtherWebsites());
  const { ref: sectionRef, inView: sectionInView } = useInView();

  if (websites.length === 0) return null;

  return (
    <div
      ref={sectionRef as React.RefObject<HTMLDivElement>}
      className={`max-w-5xl mx-auto px-4 pb-12 transition-all duration-700 ${
        sectionInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {/* Section heading */}
      <div className="text-center mb-8">
        <div
          className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider"
          style={{
            background: "rgba(255,182,217,0.15)",
            border: "1px solid rgba(255,182,217,0.4)",
            color: "#be185d",
          }}
        >
          <Globe size={12} /> Partner Websites
        </div>
        <h2
          className="text-2xl md:text-3xl font-extrabold mb-2"
          style={{
            background: "linear-gradient(135deg, #be185d, #7c3aed, #0369a1)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Our Partner Websites
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Trusted government portals and digital services we work with
        </p>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {websites.map((site, idx) => (
          <div
            key={site.id}
            className="group rounded-3xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
            style={{
              background: "rgba(255,255,255,0.92)",
              border: "1.5px solid rgba(255,182,217,0.3)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 2px 12px rgba(255,182,217,0.1)",
              transitionDelay: `${idx * 80}ms`,
            }}
          >
            {/* Preview area */}
            <div
              className="relative w-full overflow-hidden"
              style={{ height: "160px" }}
            >
              {site.previewUrl ? (
                <img
                  src={site.previewUrl}
                  alt={`${site.name} preview`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255,182,217,0.2), rgba(180,231,255,0.2))",
                  }}
                >
                  {site.logoUrl ? (
                    <img
                      src={site.logoUrl}
                      alt={site.name}
                      className="w-16 h-16 object-contain rounded-2xl"
                      style={{
                        filter: "drop-shadow(0 0 12px rgba(255,182,217,0.6))",
                      }}
                    />
                  ) : (
                    <Globe size={48} className="text-pink-300" />
                  )}
                  {/* Decorative glow */}
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      background:
                        "radial-gradient(circle at 50% 50%, #FFB6D9, transparent 65%)",
                    }}
                  />
                </div>
              )}
              {/* Hover shimmer */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,182,217,0.07), transparent)",
                }}
              />
            </div>

            {/* Card body */}
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                {site.logoUrl ? (
                  <img
                    src={site.logoUrl}
                    alt={site.name}
                    className="w-8 h-8 rounded-xl object-contain flex-shrink-0"
                    style={{
                      background: "rgba(255,182,217,0.1)",
                      padding: "2px",
                    }}
                  />
                ) : (
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(255,182,217,0.15)" }}
                  >
                    <Globe size={16} className="text-pink-500" />
                  </div>
                )}
                <h3 className="font-bold text-sm leading-tight text-pink-600">
                  {site.name}
                </h3>
              </div>

              <p className="text-xs leading-relaxed line-clamp-2 text-slate-500">
                {site.description}
              </p>

              <a
                href={site.url}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center justify-center gap-2 w-full py-2 rounded-2xl text-xs font-semibold transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #FFB6D9, #B4E7FF)",
                  color: "#7c3aed",
                  boxShadow: "0 2px 8px rgba(255,182,217,0.4)",
                }}
                data-ocid="contact.link"
              >
                <Globe size={12} />
                Visit Website →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ContactUsPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const contactInfo = getContactInfo();
  const [ownerPhoto, setOwnerPhoto] = useState<string | null>(null);
  const { actor } = useActor();

  useEffect(() => {
    if (actor) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (actor as any)
        .getFounderPhotoHash()
        .then((hash: Uint8Array<ArrayBuffer>) => {
          if (hash && hash.length > 0) {
            const blob = ExternalBlob.fromBytes(
              hash as Uint8Array<ArrayBuffer>,
            );
            setOwnerPhoto(blob.getDirectURL());
          }
        })
        .catch(() => {});
    }
  }, [actor]);

  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("contact_admin_data") || "{}",
      );
      if (saved.ownerPhotoUrl && !ownerPhoto) {
        setOwnerPhoto(saved.ownerPhotoUrl);
      }
    } catch {
      /* ignore */
    }
  }, [ownerPhoto]);

  const { ref: heroRef, inView: heroInView } = useInView();
  const { ref: infoRef, inView: infoInView } = useInView();
  const { ref: formRef, inView: formInView } = useInView();
  const { ref: authorisedRef, inView: authorisedInView } = useInView();
  const { ref: mapRef, inView: mapInView } = useInView();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(160deg, #FFF0F6 0%, #F0F8FF 50%, #FFF0F6 100%)",
      }}
    >
      {/* Hero Banner */}
      <div
        ref={heroRef as React.RefObject<HTMLDivElement>}
        className={`relative w-full h-48 md:h-64 bg-cover bg-center flex items-center justify-center transition-all duration-700 rounded-b-3xl overflow-hidden ${
          heroInView ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        style={{
          backgroundImage:
            "url('/assets/uploads/1774353229398-019d3a15-c257-750f-9a66-8798cd7598e4-1.png')",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,182,217,0.4) 0%, rgba(0,0,0,0.55) 100%)",
          }}
        />
        <h1 className="relative text-3xl md:text-4xl font-bold text-white tracking-wide drop-shadow-lg">
          Contact Us
        </h1>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Left — Info */}
          <div
            ref={infoRef as React.RefObject<HTMLDivElement>}
            className={`space-y-6 transition-all duration-700 ${
              infoInView
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-8"
            }`}
          >
            {/* Owner Card with Pink gradient border */}
            <div
              className="rounded-3xl p-6 flex gap-6"
              style={{
                background: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(20px)",
                border: "2px solid transparent",
                backgroundClip: "padding-box",
                boxShadow:
                  "0 0 0 2px rgba(255,182,217,0.5), 0 8px 32px rgba(255,182,217,0.15)",
              }}
            >
              <div className="flex-1 space-y-4">
                <div>
                  <h2
                    className="text-xl font-bold mb-2"
                    style={{
                      background: "linear-gradient(135deg, #be185d, #7c3aed)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Address
                  </h2>
                  <p className="text-sm text-slate-700">
                    <span className="font-medium">Name : </span>
                    <strong>{contactInfo.ownerName}</strong>
                  </p>
                  <p className="text-xs italic ml-12 text-slate-500">
                    ( {contactInfo.ownerTitle} )
                  </p>
                  <p className="text-sm mt-1 text-slate-700">
                    <span className="font-medium">Address : </span>
                    <strong>
                      {contactInfo.address} Pin code - {contactInfo.pincode}
                    </strong>
                  </p>
                </div>

                <div>
                  <h2
                    className="text-xl font-bold mb-2"
                    style={{
                      background: "linear-gradient(135deg, #0369a1, #7c3aed)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Information
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <Phone size={14} className="text-pink-500" />
                    <span>
                      Phone Number: <strong>{contactInfo.phone}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm mt-1 text-slate-700">
                    <Mail size={14} className="text-sky-500" />
                    <span>
                      Email us:{" "}
                      <a
                        href={`mailto:${contactInfo.email}`}
                        className="hover:underline text-sky-600 font-medium"
                      >
                        manashpcworld@zohomail.in
                      </a>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm mt-1 text-slate-600">
                    <MapPin size={14} className="text-pink-400" />
                    <span>
                      {contactInfo.address} - {contactInfo.pincode}
                    </span>
                  </div>
                </div>
              </div>

              {/* Founder photo with Pink gradient ring */}
              <div className="flex-shrink-0 flex flex-col items-center gap-2">
                <div
                  className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #FFB6D9, #B4E7FF)",
                    padding: "3px",
                    boxShadow: "0 4px 20px rgba(255,182,217,0.5)",
                  }}
                >
                  <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                    {ownerPhoto ? (
                      <img
                        src={ownerPhoto}
                        alt="Owner Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={40} className="text-pink-400" />
                    )}
                  </div>
                </div>
                <span
                  className="text-xs font-semibold"
                  style={{
                    background: "linear-gradient(135deg, #be185d, #7c3aed)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Owner
                </span>
              </div>
            </div>

            {/* Social Links */}
            <div
              className="rounded-3xl p-6"
              style={{
                background: "rgba(255,255,255,0.88)",
                border: "1.5px solid rgba(180,231,255,0.4)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 4px 20px rgba(180,231,255,0.1)",
              }}
            >
              <h2 className="text-lg font-bold mb-4 text-slate-700">
                Follow Us
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={contactInfo.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-white px-4 py-2.5 rounded-2xl hover:scale-105 transition-all text-sm font-semibold shadow-md"
                  style={{
                    background: "#c4302b",
                    boxShadow: "0 3px 12px rgba(196,48,43,0.4)",
                  }}
                >
                  <Youtube size={18} /> YouTube
                </a>
                <a
                  href={`https://wa.me/${contactInfo.whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-white px-4 py-2.5 rounded-2xl hover:scale-105 transition-all text-sm font-semibold shadow-md"
                  style={{
                    background: "#25d366",
                    boxShadow: "0 3px 12px rgba(37,211,102,0.4)",
                  }}
                >
                  <MessageCircle size={18} /> WhatsApp
                </a>
                <a
                  href={contactInfo.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-white px-4 py-2.5 rounded-2xl hover:scale-105 transition-all text-sm font-semibold shadow-md"
                  style={{
                    background:
                      "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)",
                    boxShadow: "0 3px 12px rgba(131,58,180,0.4)",
                  }}
                >
                  <Instagram size={18} /> Instagram
                </a>
                <a
                  href={contactInfo.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-white px-4 py-2.5 rounded-2xl hover:scale-105 transition-all text-sm font-semibold shadow-md"
                  style={{
                    background: "#1877f2",
                    boxShadow: "0 3px 12px rgba(24,119,242,0.4)",
                  }}
                >
                  <Facebook size={18} /> Facebook
                </a>
              </div>
            </div>
          </div>

          {/* Right — Contact Form */}
          <div
            ref={formRef as React.RefObject<HTMLDivElement>}
            className={`rounded-3xl p-6 transition-all duration-700 ${
              formInView
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-8"
            }`}
            style={{
              background: "rgba(255,255,255,0.92)",
              border: "1.5px solid rgba(255,182,217,0.3)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 8px 32px rgba(255,182,217,0.15)",
            }}
          >
            {/* Pink-Sky top accent */}
            <div
              className="h-1 w-full rounded-full mb-5"
              style={{ background: "linear-gradient(90deg, #FFB6D9, #B4E7FF)" }}
            />

            <h2 className="text-xl font-bold mb-1 text-slate-800">
              Send a Message
            </h2>
            <p className="text-xs mb-5 text-slate-400">
              Note: Please fill out the fields marked with an asterisk.
            </p>

            {sent && (
              <div
                className="mb-4 text-sm rounded-2xl px-4 py-3"
                style={{
                  background: "rgba(180,231,255,0.2)",
                  border: "1px solid rgba(180,231,255,0.5)",
                  color: "#0369a1",
                }}
              >
                Message sent successfully! We'll get back to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="cf-name"
                  className="block text-sm font-medium mb-1 text-slate-600"
                >
                  Name <span className="text-pink-500">*</span>
                </label>
                <input
                  id="cf-name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all"
                  style={{
                    background: "rgba(255,240,246,0.6)",
                    border: "1.5px solid rgba(255,182,217,0.4)",
                    color: "#1e293b",
                  }}
                  placeholder="Your full name"
                  data-ocid="contact.input"
                />
              </div>

              <div>
                <label
                  htmlFor="cf-email"
                  className="block text-sm font-medium mb-1 text-slate-600"
                >
                  Email <span className="text-pink-500">*</span>
                </label>
                <input
                  id="cf-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all"
                  style={{
                    background: "rgba(240,248,255,0.6)",
                    border: "1.5px solid rgba(180,231,255,0.5)",
                    color: "#1e293b",
                  }}
                  placeholder="your@email.com"
                  data-ocid="contact.input"
                />
              </div>

              <div>
                <label
                  htmlFor="cf-message"
                  className="block text-sm font-medium mb-1 text-slate-600"
                >
                  Message <span className="text-pink-500">*</span>
                </label>
                <textarea
                  id="cf-message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all resize-none"
                  style={{
                    background: "rgba(255,240,246,0.4)",
                    border: "1.5px solid rgba(255,182,217,0.35)",
                    color: "#1e293b",
                  }}
                  placeholder="Write your message here..."
                  data-ocid="contact.textarea"
                />
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold transition-all hover:scale-105 hover:shadow-xl"
                style={{
                  background: "linear-gradient(135deg, #FFB6D9, #B4E7FF)",
                  color: "#7c3aed",
                  boxShadow: "0 4px 16px rgba(255,182,217,0.4)",
                }}
                data-ocid="contact.submit_button"
              >
                <Send size={16} /> Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* We Are Authorised Section */}
      <div
        ref={authorisedRef as React.RefObject<HTMLDivElement>}
        className={`py-12 px-4 transition-all duration-700 ${
          authorisedInView
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8"
        }`}
        style={{
          background:
            "linear-gradient(135deg, rgba(255,182,217,0.1) 0%, rgba(180,231,255,0.1) 100%)",
          borderTop: "1px solid rgba(255,182,217,0.2)",
          borderBottom: "1px solid rgba(180,231,255,0.2)",
        }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div
              className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider"
              style={{
                background: "rgba(255,182,217,0.15)",
                border: "1px solid rgba(255,182,217,0.4)",
                color: "#be185d",
              }}
            >
              ✅ Officially Recognised
            </div>
            <h2
              className="text-3xl md:text-4xl font-extrabold mb-3"
              style={{
                background:
                  "linear-gradient(135deg, #be185d, #7c3aed, #0369a1)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              We Are Authorised
            </h2>
            <div className="flex items-center justify-center gap-3">
              <div
                className="h-px w-16"
                style={{
                  background: "linear-gradient(to right, transparent, #FFB6D9)",
                }}
              />
              <span className="text-2xl">🏅</span>
              <div
                className="h-px w-16"
                style={{
                  background: "linear-gradient(to left, transparent, #FFB6D9)",
                }}
              />
            </div>
            <p className="text-sm mt-3 max-w-lg mx-auto text-slate-500">
              NextGen IT Hub is an authorised service provider for these
              government and banking institutions
            </p>
          </div>

          <AuthorisedCarousel />
        </div>
      </div>

      {/* Partner Websites Section */}
      <div className="pt-12">
        <OtherWebsitesSection />
      </div>

      {/* Google Maps Embed */}
      <div
        ref={mapRef as React.RefObject<HTMLDivElement>}
        className={`max-w-5xl mx-auto px-4 pb-12 transition-all duration-700 ${
          mapInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            border: "1.5px solid rgba(180,231,255,0.4)",
            boxShadow: "0 4px 20px rgba(180,231,255,0.15)",
          }}
        >
          <div
            className="px-6 py-4 flex items-center gap-2"
            style={{
              borderBottom: "1px solid rgba(255,182,217,0.2)",
              background:
                "linear-gradient(135deg, rgba(255,182,217,0.1), rgba(180,231,255,0.1))",
            }}
          >
            <MapPin size={20} className="text-pink-500" />
            <h2 className="text-lg font-bold text-slate-700">Our Location</h2>
          </div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3580.7!2d91.4398!3d26.4456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375a67c9b0b0b0b0%3A0x0!2sChamata%2C+Nalbari%2C+Assam+781306!5e0!3m2!1sen!2sin!4v1"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Our Location"
          />
        </div>
      </div>
    </div>
  );
}
