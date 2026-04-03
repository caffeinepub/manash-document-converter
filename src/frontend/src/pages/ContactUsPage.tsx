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
            className="flex-shrink-0 w-[160px] md:w-[200px] rounded-xl shadow-md flex items-center justify-center p-4"
            style={{
              height: "90px",
              background: "oklch(0.16 0.04 250)",
              border: "1px solid oklch(0.25 0.06 250)",
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
            background: "oklch(0.78 0.18 65 / 0.15)",
            border: "1px solid oklch(0.78 0.18 65 / 0.4)",
            color: "oklch(0.78 0.18 65)",
          }}
        >
          <Globe size={12} /> Partner Websites
        </div>
        <h2
          className="text-2xl md:text-3xl font-extrabold mb-2 font-display"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.78 0.18 65), oklch(0.92 0.10 80))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Our Partner Websites
        </h2>
        <p
          className="text-sm max-w-md mx-auto"
          style={{ color: "oklch(0.6 0.04 240)" }}
        >
          Trusted government portals and digital services we work with
        </p>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {websites.map((site, idx) => (
          <div
            key={site.id}
            className="group rounded-2xl overflow-hidden transition-all duration-300"
            style={{
              background: "oklch(0.14 0.04 250)",
              border: "1px solid oklch(0.25 0.06 250)",
              transitionDelay: `${idx * 80}ms`,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.border =
                "1px solid oklch(0.78 0.18 65)";
              (e.currentTarget as HTMLDivElement).style.boxShadow =
                "0 0 24px oklch(0.78 0.18 65 / 0.25)";
              (e.currentTarget as HTMLDivElement).style.transform =
                "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.border =
                "1px solid oklch(0.25 0.06 250)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              (e.currentTarget as HTMLDivElement).style.transform =
                "translateY(0)";
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
                      "linear-gradient(135deg, oklch(0.18 0.06 250), oklch(0.22 0.08 260))",
                  }}
                >
                  {site.logoUrl ? (
                    <img
                      src={site.logoUrl}
                      alt={site.name}
                      className="w-16 h-16 object-contain rounded-xl"
                      style={{
                        filter:
                          "drop-shadow(0 0 12px oklch(0.78 0.18 65 / 0.5))",
                      }}
                    />
                  ) : (
                    <Globe
                      size={48}
                      style={{ color: "oklch(0.78 0.18 65 / 0.6)" }}
                    />
                  )}
                  {/* Decorative glow orb */}
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      background:
                        "radial-gradient(circle at 50% 50%, oklch(0.78 0.18 65), transparent 65%)",
                    }}
                  />
                </div>
              )}
              {/* Shimmer overlay on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.78 0.18 65 / 0.05), transparent)",
                }}
              />
            </div>

            {/* Card body */}
            <div className="p-4 space-y-3">
              {/* Logo + name row */}
              <div className="flex items-center gap-3">
                {site.logoUrl ? (
                  <img
                    src={site.logoUrl}
                    alt={site.name}
                    className="w-8 h-8 rounded-lg object-contain flex-shrink-0"
                    style={{
                      background: "oklch(0.20 0.05 250)",
                      padding: "2px",
                    }}
                  />
                ) : (
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "oklch(0.20 0.05 250)" }}
                  >
                    <Globe size={16} style={{ color: "oklch(0.78 0.18 65)" }} />
                  </div>
                )}
                <h3
                  className="font-bold text-sm leading-tight"
                  style={{ color: "oklch(0.78 0.18 65)" }}
                >
                  {site.name}
                </h3>
              </div>

              {/* Description */}
              <p
                className="text-xs leading-relaxed line-clamp-2"
                style={{ color: "oklch(0.65 0.04 240)" }}
              >
                {site.description}
              </p>

              {/* Visit button */}
              <a
                href={site.url}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-xs font-semibold transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-95"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.72 0.18 60), oklch(0.82 0.16 70))",
                  color: "oklch(0.12 0.03 250)",
                  boxShadow: "0 2px 8px oklch(0.78 0.18 65 / 0.3)",
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
  const ownerPhoto = localStorage.getItem("contactOwnerPhoto");

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
      style={{ background: "oklch(0.12 0.03 250)" }}
    >
      {/* Hero Banner */}
      <div
        ref={heroRef as React.RefObject<HTMLDivElement>}
        className={`relative w-full h-48 md:h-64 bg-cover bg-center flex items-center justify-center transition-all duration-700 ${
          heroInView ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        style={{
          backgroundImage:
            "url('/assets/uploads/1774353229398-019d3a15-c257-750f-9a66-8798cd7598e4-1.png')",
        }}
      >
        <div
          className="absolute inset-0"
          style={{ background: "oklch(0 0 0 / 0.6)" }}
        />
        <h1 className="relative text-3xl md:text-4xl font-bold text-white tracking-wide font-display">
          Contact Us
        </h1>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Left — Info */}
          <div
            ref={infoRef as React.RefObject<HTMLDivElement>}
            className={`space-y-8 transition-all duration-700 ${
              infoInView
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-8"
            }`}
          >
            <div
              className="rounded-xl p-6 flex gap-6"
              style={{
                background: "oklch(0.16 0.04 250)",
                border: "1px solid oklch(0.25 0.06 250)",
              }}
            >
              <div className="flex-1 space-y-4">
                <div>
                  <h2
                    className="text-xl font-bold mb-2"
                    style={{ color: "oklch(0.72 0.18 200)" }}
                  >
                    Address
                  </h2>
                  <p
                    className="text-sm"
                    style={{ color: "oklch(0.8 0.03 240)" }}
                  >
                    <span className="font-medium">Name : </span>
                    <strong>{contactInfo.ownerName}</strong>
                  </p>
                  <p
                    className="text-xs italic ml-12"
                    style={{ color: "oklch(0.6 0.04 240)" }}
                  >
                    ( {contactInfo.ownerTitle} )
                  </p>
                  <p
                    className="text-sm mt-1"
                    style={{ color: "oklch(0.8 0.03 240)" }}
                  >
                    <span className="font-medium">Address : </span>
                    <strong>
                      {contactInfo.address} Pin code - {contactInfo.pincode}
                    </strong>
                  </p>
                </div>

                <div>
                  <h2
                    className="text-xl font-bold mb-2"
                    style={{ color: "oklch(0.72 0.18 200)" }}
                  >
                    Information
                  </h2>
                  <div
                    className="flex items-center gap-2 text-sm"
                    style={{ color: "oklch(0.8 0.03 240)" }}
                  >
                    <Phone size={14} style={{ color: "oklch(0.78 0.18 65)" }} />
                    <span>
                      Phone Number: <strong>{contactInfo.phone}</strong>
                    </span>
                  </div>
                  <div
                    className="flex items-center gap-2 text-sm mt-1"
                    style={{ color: "oklch(0.8 0.03 240)" }}
                  >
                    <Mail size={14} style={{ color: "oklch(0.78 0.18 65)" }} />
                    <span>
                      Email us :{" "}
                      <a
                        href={`mailto:${contactInfo.email}`}
                        className="hover:underline"
                        style={{ color: "oklch(0.72 0.18 200)" }}
                      >
                        manashpcworld@zohomail.in
                      </a>
                    </span>
                  </div>
                  <div
                    className="flex items-center gap-2 text-sm mt-1"
                    style={{ color: "oklch(0.8 0.03 240)" }}
                  >
                    <MapPin
                      size={14}
                      style={{ color: "oklch(0.78 0.18 65)" }}
                    />
                    <span>
                      {contactInfo.address} - {contactInfo.pincode}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 flex flex-col items-center gap-2">
                <div
                  className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center"
                  style={{
                    border: "3px solid oklch(0.78 0.18 65)",
                    background: "oklch(0.12 0.03 250)",
                    boxShadow: "0 0 16px oklch(0.78 0.18 65 / 0.3)",
                  }}
                >
                  {ownerPhoto ? (
                    <img
                      src={ownerPhoto}
                      alt="Owner Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={40} style={{ color: "oklch(0.78 0.18 65)" }} />
                  )}
                </div>
                <span
                  className="text-xs font-medium text-center"
                  style={{ color: "oklch(0.78 0.18 65)" }}
                >
                  Owner
                </span>
              </div>
            </div>

            <div
              className="rounded-xl p-6"
              style={{
                background: "oklch(0.14 0.04 250)",
                border: "1px solid oklch(0.25 0.06 250)",
              }}
            >
              <h2
                className="text-lg font-bold mb-4"
                style={{ color: "oklch(0.95 0.02 240)" }}
              >
                Follow Us
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={contactInfo.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-white px-4 py-2 rounded-lg hover:opacity-80 transition text-sm font-medium"
                  style={{ background: "#c4302b" }}
                >
                  <Youtube size={18} /> YouTube
                </a>
                <a
                  href={`https://wa.me/${contactInfo.whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-white px-4 py-2 rounded-lg hover:opacity-80 transition text-sm font-medium"
                  style={{ background: "#25d366" }}
                >
                  <MessageCircle size={18} /> WhatsApp
                </a>
                <a
                  href={contactInfo.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-white px-4 py-2 rounded-lg hover:opacity-90 transition text-sm font-medium"
                  style={{
                    background:
                      "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)",
                  }}
                >
                  <Instagram size={18} /> Instagram
                </a>
                <a
                  href={contactInfo.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-white px-4 py-2 rounded-lg hover:opacity-80 transition text-sm font-medium"
                  style={{ background: "#1877f2" }}
                >
                  <Facebook size={18} /> Facebook
                </a>
              </div>
            </div>
          </div>

          {/* Right — Contact Form */}
          <div
            ref={formRef as React.RefObject<HTMLDivElement>}
            className={`rounded-xl p-6 transition-all duration-700 ${
              formInView
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-8"
            }`}
            style={{
              background: "oklch(0.16 0.04 250)",
              border: "1px solid oklch(0.25 0.06 250)",
            }}
          >
            <h2
              className="text-xl font-bold mb-1 font-display"
              style={{ color: "oklch(0.95 0.02 240)" }}
            >
              Send a Message
            </h2>
            <p
              className="text-xs mb-5"
              style={{ color: "oklch(0.55 0.04 240)" }}
            >
              Note: Please fill out the fields marked with an asterisk.
            </p>

            {sent && (
              <div
                className="mb-4 text-sm rounded-lg px-4 py-3"
                style={{
                  background: "oklch(0.20 0.08 145 / 0.3)",
                  border: "1px solid oklch(0.55 0.15 145 / 0.5)",
                  color: "oklch(0.75 0.15 145)",
                }}
              >
                Message sent successfully! We'll get back to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="cf-name"
                  className="block text-sm font-medium mb-1"
                  style={{ color: "oklch(0.8 0.03 240)" }}
                >
                  Name <span style={{ color: "oklch(0.65 0.2 25)" }}>*</span>
                </label>
                <input
                  id="cf-name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
                  style={{
                    background: "oklch(0.20 0.05 250)",
                    border: "1px solid oklch(0.25 0.06 250)",
                    color: "oklch(0.95 0.02 240)",
                  }}
                  placeholder="Your full name"
                  data-ocid="contact.input"
                />
              </div>

              <div>
                <label
                  htmlFor="cf-email"
                  className="block text-sm font-medium mb-1"
                  style={{ color: "oklch(0.8 0.03 240)" }}
                >
                  Email <span style={{ color: "oklch(0.65 0.2 25)" }}>*</span>
                </label>
                <input
                  id="cf-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
                  style={{
                    background: "oklch(0.20 0.05 250)",
                    border: "1px solid oklch(0.25 0.06 250)",
                    color: "oklch(0.95 0.02 240)",
                  }}
                  placeholder="your@email.com"
                  data-ocid="contact.input"
                />
              </div>

              <div>
                <label
                  htmlFor="cf-message"
                  className="block text-sm font-medium mb-1"
                  style={{ color: "oklch(0.8 0.03 240)" }}
                >
                  Message <span style={{ color: "oklch(0.65 0.2 25)" }}>*</span>
                </label>
                <textarea
                  id="cf-message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none resize-none"
                  style={{
                    background: "oklch(0.20 0.05 250)",
                    border: "1px solid oklch(0.25 0.06 250)",
                    color: "oklch(0.95 0.02 240)",
                  }}
                  placeholder="Write your message here..."
                  data-ocid="contact.textarea"
                />
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-all hover-lift"
                style={{
                  background: "oklch(0.78 0.18 65)",
                  color: "oklch(0.12 0.03 250)",
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
            "linear-gradient(180deg, oklch(0.12 0.03 250) 0%, oklch(0.15 0.05 260) 100%)",
          borderTop: "1px solid oklch(0.25 0.06 250)",
        }}
      >
        <div className="max-w-5xl mx-auto">
          {/* Headline */}
          <div className="text-center mb-10">
            <div
              className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider"
              style={{
                background: "oklch(0.78 0.18 65 / 0.15)",
                border: "1px solid oklch(0.78 0.18 65 / 0.4)",
                color: "oklch(0.78 0.18 65)",
              }}
            >
              ✅ Officially Recognised
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3 font-display gradient-text-gold">
              We Are Authorised
            </h2>
            <div className="flex items-center justify-center gap-3">
              <div
                className="h-px w-16"
                style={{
                  background:
                    "linear-gradient(to right, transparent, oklch(0.78 0.18 65))",
                }}
              />
              <span className="text-2xl">🏅</span>
              <div
                className="h-px w-16"
                style={{
                  background:
                    "linear-gradient(to left, transparent, oklch(0.78 0.18 65))",
                }}
              />
            </div>
            <p
              className="text-sm mt-3 max-w-lg mx-auto"
              style={{ color: "oklch(0.6 0.04 240)" }}
            >
              NextGen IT Hub is an authorised service provider for these
              government and banking institutions
            </p>
          </div>

          {/* Carousel */}
          <AuthorisedCarousel />
        </div>
      </div>

      {/* Partner Websites Section */}
      <div
        style={{
          borderTop: "1px solid oklch(0.20 0.05 250)",
          paddingTop: "3rem",
        }}
      >
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
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid oklch(0.25 0.06 250)" }}
        >
          <div
            className="px-6 py-4 flex items-center gap-2"
            style={{
              borderBottom: "1px solid oklch(0.25 0.06 250)",
              background: "oklch(0.16 0.04 250)",
            }}
          >
            <MapPin size={20} style={{ color: "oklch(0.78 0.18 65)" }} />
            <h2
              className="text-lg font-bold"
              style={{ color: "oklch(0.95 0.02 240)" }}
            >
              Our Location
            </h2>
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
