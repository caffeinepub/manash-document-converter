import {
  Bell,
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  ChevronRight,
  ExternalLink,
  FileText,
  GraduationCap,
  LogIn,
  Search,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import AdBanner from "../components/AdBanner";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { useInView } from "../hooks/useInView";
import {
  type AdmitCard,
  type Job,
  type JobResult,
  getAdmitCards,
  getJobs,
  getResults,
} from "../types";

const JOB_CATEGORIES = [
  "All",
  "Govt Jobs",
  "Railway",
  "Banking",
  "SSC",
  "Police",
  "Teaching",
  "Defence",
  "State PSC",
];

const statusConfig = (s: string) => {
  if (s === "Active")
    return {
      bg: "oklch(0.35 0.15 145)",
      text: "oklch(0.85 0.18 145)",
      border: "oklch(0.5 0.18 145 / 0.5)",
      dot: "oklch(0.72 0.2 145)",
    };
  if (s === "Result")
    return {
      bg: "oklch(0.3 0.12 240)",
      text: "oklch(0.75 0.15 240)",
      border: "oklch(0.5 0.15 240 / 0.5)",
      dot: "oklch(0.65 0.18 240)",
    };
  if (s === "Exam")
    return {
      bg: "oklch(0.35 0.15 55)",
      text: "oklch(0.85 0.18 55)",
      border: "oklch(0.5 0.18 55 / 0.5)",
      dot: "oklch(0.78 0.18 65)",
    };
  return {
    bg: "oklch(0.22 0.03 250)",
    text: "oklch(0.65 0.04 240)",
    border: "oklch(0.3 0.04 250 / 0.5)",
    dot: "oklch(0.5 0.04 240)",
  };
};

const categoryIcons: Record<string, React.ReactNode> = {
  "Govt Jobs": <Building2 size={12} />,
  Railway: <Zap size={12} />,
  Banking: <Star size={12} />,
  SSC: <GraduationCap size={12} />,
  Police: <Briefcase size={12} />,
  Teaching: <BookOpen size={12} />,
  Defence: <TrendingUp size={12} />,
  "State PSC": <Sparkles size={12} />,
};

function AnimatedCounter({ target, label }: { target: number; label: string }) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="text-center">
      <div
        className="text-2xl font-bold"
        style={{ color: "oklch(0.78 0.18 65)" }}
      >
        {count.toLocaleString()}+
      </div>
      <div className="text-xs" style={{ color: "oklch(0.55 0.04 240)" }}>
        {label}
      </div>
    </div>
  );
}

export function JobUpdatesPage() {
  const [jobs] = useState<Job[]>(() => getJobs());
  const [admitCards] = useState<AdmitCard[]>(() => getAdmitCards());
  const [results] = useState<JobResult[]>(() => getResults());
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [hoveredJob, setHoveredJob] = useState<string | null>(null);

  const { ref: heroRef, inView: heroInView } = useInView();
  const { ref: statsRef, inView: statsInView } = useInView();
  const { ref: gridRef, inView: gridInView } = useInView();
  const { ref: sidebarRef, inView: sidebarInView } = useInView();

  const filtered = jobs.filter((j) => {
    const matchCat = activeCategory === "All" || j.category === activeCategory;
    const matchSearch =
      !search ||
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.org.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const cscSettings = (() => {
    try {
      return JSON.parse(localStorage.getItem("cscSectionSettings") || "{}");
    } catch {
      return {};
    }
  })();

  const cscShow = cscSettings.show !== false;
  const cscTitle = cscSettings.title || "CSC - Common Service Centre";
  const cscSubtitle =
    cscSettings.subtitle ||
    "Digital India Network of Over 5 Lakh+ Service Points";
  const cscLoginUrl = cscSettings.cscLoginUrl || "https://www.csc.gov.in";
  const cscRegisterUrl =
    cscSettings.registerUrl || "https://register.csc.gov.in";
  const cscServices: Array<{ name: string; icon: string }> =
    cscSettings.services || [
      { name: "PAN Card", icon: "&#x1F4B3;" },
      { name: "Aadhaar Services", icon: "&#x1F510;" },
      { name: "Banking", icon: "&#x1F3E6;" },
      { name: "Insurance", icon: "&#x1F6E1;" },
      { name: "Passport", icon: "&#x1F4D8;" },
      { name: "Digital Literacy", icon: "&#x1F4BB;" },
    ];

  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(0.10 0.025 250)" }}
    >
      {/* CSC Bridge Section */}
      {cscShow && (
        <div
          className="animate-fade-in-up"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.14 0.05 260) 0%, oklch(0.11 0.04 250) 50%, oklch(0.13 0.06 270) 100%)",
            borderBottom: "1px solid oklch(0.22 0.06 255)",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              {/* Left: Title + Services */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.78 0.18 65), oklch(0.72 0.2 55))",
                      color: "oklch(0.12 0.03 250)",
                    }}
                  >
                    CSC
                  </div>
                  <div>
                    <h2 className="text-xl font-bold font-display gradient-text-gold">
                      {cscTitle}
                    </h2>
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.55 0.04 240)" }}
                    >
                      {cscSubtitle}
                    </p>
                  </div>
                </div>

                {/* Services grid */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {cscServices.map((svc) => (
                    <div
                      key={svc.name}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                      style={{
                        background: "oklch(0.18 0.05 255 / 0.8)",
                        border: "1px solid oklch(0.28 0.07 255 / 0.6)",
                        color: "oklch(0.82 0.04 240)",
                      }}
                    >
                      <span>{svc.icon}</span>
                      {svc.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Stats + CTAs */}
              <div className="flex flex-col items-start lg:items-end gap-4">
                {/* Stats */}
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div
                      className="text-lg font-bold"
                      style={{ color: "oklch(0.78 0.18 65)" }}
                    >
                      5 Lakh+
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: "oklch(0.5 0.04 240)" }}
                    >
                      Service Points
                    </div>
                  </div>
                  <div className="text-center">
                    <div
                      className="text-lg font-bold"
                      style={{ color: "oklch(0.78 0.18 65)" }}
                    >
                      300+
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: "oklch(0.5 0.04 240)" }}
                    >
                      Services
                    </div>
                  </div>
                  <div className="text-center">
                    <div
                      className="text-lg font-bold"
                      style={{ color: "oklch(0.78 0.18 65)" }}
                    >
                      6 Cr+
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: "oklch(0.5 0.04 240)" }}
                    >
                      Citizens Served
                    </div>
                  </div>
                </div>

                {/* CTA buttons */}
                <div className="flex items-center gap-3">
                  <a
                    href={cscLoginUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-105"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.78 0.18 65), oklch(0.72 0.2 55))",
                      color: "oklch(0.12 0.03 250)",
                      boxShadow: "0 4px 16px oklch(0.78 0.18 65 / 0.35)",
                    }}
                    data-ocid="csc.login.button"
                  >
                    <LogIn size={15} />
                    CSC Login
                  </a>
                  <a
                    href={cscRegisterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 hover:opacity-80"
                    style={{
                      background: "transparent",
                      color: "oklch(0.78 0.18 65)",
                      border: "1.5px solid oklch(0.78 0.18 65 / 0.6)",
                    }}
                    data-ocid="csc.register.button"
                  >
                    <Users size={15} />
                    Register as VLE
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animated Hero */}
      <div
        ref={heroRef as React.RefObject<HTMLDivElement>}
        className={`relative overflow-hidden py-12 px-4 transition-all duration-700 ${
          heroInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
        style={{
          background:
            "linear-gradient(135deg, oklch(0.12 0.04 255) 0%, oklch(0.15 0.07 260) 50%, oklch(0.13 0.05 270) 100%)",
          borderBottom: "1px solid oklch(0.22 0.06 255)",
        }}
      >
        {/* Background glow orbs */}
        <div
          className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{ background: "oklch(0.78 0.18 65)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-56 h-56 rounded-full blur-3xl opacity-8 pointer-events-none"
          style={{ background: "oklch(0.65 0.18 240)" }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Top bar with CSC button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div
                className="p-2.5 rounded-xl"
                style={{
                  background: "oklch(0.78 0.18 65 / 0.15)",
                  border: "1px solid oklch(0.78 0.18 65 / 0.3)",
                }}
              >
                <Briefcase style={{ color: "oklch(0.78 0.18 65)" }} size={24} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-display gradient-text-gold leading-tight">
                  Job Updates
                </h1>
                <p
                  className="text-xs"
                  style={{ color: "oklch(0.55 0.04 240)" }}
                >
                  Latest Govt Notifications • Updated Daily
                </p>
              </div>
            </div>

            {/* CSC Login Button */}
            <a
              href="https://www.csc.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 font-bold text-sm px-5 py-2.5 rounded-xl transition-all duration-300 group flex-shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.45 0.2 240) 0%, oklch(0.38 0.22 255) 100%)",
                color: "white",
                border: "1px solid oklch(0.55 0.2 240 / 0.6)",
                boxShadow:
                  "0 4px 20px oklch(0.45 0.2 240 / 0.4), inset 0 1px 0 oklch(0.7 0.1 240 / 0.2)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform =
                  "translateY(-2px) scale(1.02)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  "0 8px 30px oklch(0.45 0.2 240 / 0.6), inset 0 1px 0 oklch(0.7 0.1 240 / 0.2)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  "0 4px 20px oklch(0.45 0.2 240 / 0.4), inset 0 1px 0 oklch(0.7 0.1 240 / 0.2)";
              }}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black"
                style={{
                  background: "oklch(0.78 0.18 65)",
                  color: "oklch(0.12 0.03 250)",
                }}
              >
                CSC
              </div>
              <span>CSC Login</span>
              <LogIn
                size={15}
                className="group-hover:translate-x-1 transition-transform"
              />
            </a>
          </div>

          {/* Search */}
          <div className="relative max-w-2xl">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2"
              size={17}
              style={{ color: "oklch(0.5 0.04 240)" }}
            />
            <Input
              placeholder="Search jobs, board, organisation name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12 text-sm rounded-xl"
              style={{
                background: "oklch(0.16 0.04 250)",
                color: "oklch(0.88 0.02 240)",
                border: "1px solid oklch(0.28 0.06 255)",
              }}
              data-ocid="job.search_input"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2 py-0.5 rounded"
                style={{ color: "oklch(0.5 0.04 240)" }}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div
        ref={statsRef as React.RefObject<HTMLDivElement>}
        className={`transition-all duration-700 delay-100 ${
          statsInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
        style={{
          background: "oklch(0.13 0.035 252)",
          borderBottom: "1px solid oklch(0.20 0.05 252)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-3 md:grid-cols-6 gap-4 divide-x divide-white/5">
          <AnimatedCounter target={jobs.length} label="Active Jobs" />
          <AnimatedCounter target={admitCards.length} label="Admit Cards" />
          <AnimatedCounter target={results.length} label="Results" />
          <AnimatedCounter target={12} label="Categories" />
          <AnimatedCounter target={50000} label="Vacancies" />
          <AnimatedCounter target={24} label="Updated/Day" />
        </div>
      </div>

      <AdBanner slot="3758272057" className="max-w-7xl mx-auto px-4 mt-4" />

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div
          ref={gridRef as React.RefObject<HTMLDivElement>}
          className="lg:col-span-3 space-y-5"
        >
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {JOB_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200"
                  style={{
                    background: isActive
                      ? "linear-gradient(135deg, oklch(0.78 0.18 65), oklch(0.72 0.2 55))"
                      : "oklch(0.16 0.04 252)",
                    color: isActive
                      ? "oklch(0.12 0.03 250)"
                      : "oklch(0.65 0.04 240)",
                    borderColor: isActive
                      ? "oklch(0.78 0.18 65)"
                      : "oklch(0.25 0.06 252)",
                    boxShadow: isActive
                      ? "0 2px 12px oklch(0.78 0.18 65 / 0.35)"
                      : "none",
                    transform: isActive ? "scale(1.04)" : "scale(1)",
                  }}
                >
                  {categoryIcons[cat] && <span>{categoryIcons[cat]}</span>}
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Count */}
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: "oklch(0.55 0.04 240)" }}>
              Showing{" "}
              <strong style={{ color: "oklch(0.78 0.18 65)" }}>
                {filtered.length}
              </strong>{" "}
              job notifications
            </p>
            {search && (
              <span
                className="text-xs px-2 py-1 rounded-full"
                style={{
                  background: "oklch(0.78 0.18 65 / 0.12)",
                  color: "oklch(0.78 0.18 65)",
                  border: "1px solid oklch(0.78 0.18 65 / 0.3)",
                }}
              >
                Search: "{search}"
              </span>
            )}
          </div>

          {/* Job Cards */}
          {filtered.length === 0 ? (
            <div
              className="text-center py-20 rounded-2xl"
              style={{
                color: "oklch(0.5 0.04 240)",
                background: "oklch(0.14 0.04 252)",
                border: "1px solid oklch(0.22 0.05 252)",
              }}
              data-ocid="job.empty_state"
            >
              <Briefcase size={44} className="mx-auto mb-3 opacity-20" />
              <p className="text-base font-medium">No jobs found</p>
              <p className="text-sm mt-1 opacity-70">
                Try a different search or category
              </p>
            </div>
          ) : (
            filtered.map((job, idx) => {
              const sc = statusConfig(job.status);
              const isHovered = hoveredJob === job.id;
              return (
                <div
                  key={job.id}
                  className={`rounded-2xl transition-all duration-500 cursor-default ${
                    gridInView
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                  style={{
                    background: isHovered
                      ? "oklch(0.18 0.06 252)"
                      : "oklch(0.15 0.04 252)",
                    border: isHovered
                      ? "1px solid oklch(0.78 0.18 65 / 0.4)"
                      : "1px solid oklch(0.22 0.05 252)",
                    boxShadow: isHovered
                      ? "0 8px 32px oklch(0.78 0.18 65 / 0.1), 0 0 0 1px oklch(0.78 0.18 65 / 0.08)"
                      : "0 2px 8px oklch(0 0 0 / 0.3)",
                    transitionDelay: `${idx * 0.05}s`,
                    transform: isHovered ? "translateY(-2px)" : "translateY(0)",
                  }}
                  onMouseEnter={() => setHoveredJob(job.id)}
                  onMouseLeave={() => setHoveredJob(null)}
                  data-ocid={`job.item.${idx + 1}`}
                >
                  {/* Card top accent line */}
                  <div
                    className="h-0.5 rounded-t-2xl"
                    style={{
                      background: isHovered
                        ? "linear-gradient(90deg, oklch(0.78 0.18 65), oklch(0.65 0.18 240))"
                        : "transparent",
                      transition: "background 0.3s",
                    }}
                  />

                  <div className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {/* Icon badge */}
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{
                            background: "oklch(0.78 0.18 65 / 0.12)",
                            border: "1px solid oklch(0.78 0.18 65 / 0.25)",
                          }}
                        >
                          <Briefcase
                            size={18}
                            style={{ color: "oklch(0.78 0.18 65)" }}
                          />
                        </div>
                        <div className="min-w-0">
                          <h2
                            className="font-bold text-base leading-snug"
                            style={{ color: "oklch(0.92 0.02 240)" }}
                          >
                            {job.title}
                          </h2>
                          <p
                            className="text-xs mt-1 flex items-center gap-1"
                            style={{ color: "oklch(0.58 0.04 240)" }}
                          >
                            <Building2 size={11} />
                            {job.org}
                          </p>
                        </div>
                      </div>

                      {/* Status badge */}
                      <div
                        className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border"
                        style={{
                          background: sc.bg,
                          color: sc.text,
                          borderColor: sc.border,
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full animate-pulse"
                          style={{ background: sc.dot }}
                        />
                        {job.status}
                      </div>
                    </div>

                    <p
                      className="text-sm mb-4 leading-relaxed"
                      style={{ color: "oklch(0.65 0.04 240)" }}
                    >
                      {job.description}
                    </p>

                    {/* Meta info chips */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span
                        className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg"
                        style={{
                          background: "oklch(0.20 0.05 252)",
                          color: "oklch(0.7 0.05 240)",
                        }}
                      >
                        <GraduationCap size={11} />
                        {job.posts}
                      </span>
                      <span
                        className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg"
                        style={{
                          background: "oklch(0.20 0.05 252)",
                          color: "oklch(0.7 0.05 240)",
                        }}
                      >
                        <Calendar size={11} />
                        Last Date: {job.lastDate}
                      </span>
                      <Badge
                        variant="secondary"
                        className="text-xs font-normal px-2.5 py-1 rounded-lg h-auto"
                        style={{
                          background: "oklch(0.22 0.07 255)",
                          color: "oklch(0.72 0.1 255)",
                          border: "none",
                        }}
                      >
                        {job.type}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs font-normal px-2.5 py-1 rounded-lg h-auto"
                        style={{
                          background: "oklch(0.20 0.07 280)",
                          color: "oklch(0.72 0.1 280)",
                          border: "1px solid oklch(0.35 0.1 280 / 0.4)",
                        }}
                      >
                        {job.category}
                      </Badge>
                    </div>

                    {/* Apply button */}
                    <a
                      href={job.applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold px-5 py-2 rounded-xl transition-all duration-200"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.78 0.18 65), oklch(0.72 0.2 55))",
                        color: "oklch(0.12 0.03 250)",
                        boxShadow: "0 3px 12px oklch(0.78 0.18 65 / 0.35)",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.transform =
                          "scale(1.04)";
                        (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                          "0 5px 18px oklch(0.78 0.18 65 / 0.55)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.transform =
                          "";
                        (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                          "0 3px 12px oklch(0.78 0.18 65 / 0.35)";
                      }}
                    >
                      Apply Online
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar */}
        <div
          ref={sidebarRef as React.RefObject<HTMLDivElement>}
          className={`space-y-5 transition-all duration-700 delay-200 ${
            sidebarInView
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-8"
          }`}
        >
          {/* CSC Quick Access card */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.18 0.08 255), oklch(0.22 0.1 260))",
              border: "1px solid oklch(0.35 0.12 255 / 0.5)",
              boxShadow: "0 4px 20px oklch(0.45 0.2 240 / 0.2)",
            }}
          >
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black"
                  style={{
                    background: "oklch(0.78 0.18 65)",
                    color: "oklch(0.12 0.03 250)",
                  }}
                >
                  CSC
                </div>
                <div>
                  <p
                    className="font-bold text-sm"
                    style={{ color: "oklch(0.9 0.02 240)" }}
                  >
                    CSC Portal
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "oklch(0.6 0.06 255)" }}
                  >
                    Common Service Centre
                  </p>
                </div>
              </div>
              <p
                className="text-xs mb-3 leading-relaxed"
                style={{ color: "oklch(0.65 0.06 255)" }}
              >
                Access CSC services, apply for government schemes, and manage
                digital services.
              </p>
              <a
                href="https://www.csc.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-bold transition-all duration-200"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.45 0.2 240), oklch(0.38 0.22 255))",
                  color: "white",
                  boxShadow: "0 3px 12px oklch(0.45 0.2 240 / 0.4)",
                }}
              >
                <LogIn size={14} />
                Login to CSC
              </a>
            </div>
          </div>

          {/* Admit Cards */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "oklch(0.14 0.04 252)",
              border: "1px solid oklch(0.22 0.05 252)",
            }}
          >
            <div
              className="px-4 py-3 flex items-center gap-2"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.78 0.18 65), oklch(0.72 0.2 55))",
              }}
            >
              <FileText size={15} style={{ color: "oklch(0.12 0.03 250)" }} />
              <span
                className="font-bold text-sm"
                style={{ color: "oklch(0.12 0.03 250)" }}
              >
                Admit Cards
              </span>
              <span
                className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: "oklch(0.12 0.03 250 / 0.3)",
                  color: "oklch(0.12 0.03 250)",
                }}
              >
                {admitCards.length}
              </span>
            </div>
            <ul>
              {admitCards.map((item, i) => (
                <li
                  key={item.id}
                  style={{
                    borderBottom:
                      i < admitCards.length - 1
                        ? "1px solid oklch(0.19 0.04 252)"
                        : "none",
                  }}
                >
                  <a
                    href={item.link}
                    className="flex items-center justify-between px-4 py-3 transition-all duration-150 group"
                    style={{ color: "oklch(0.8 0.04 240)" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background =
                        "oklch(0.18 0.05 252)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background =
                        "";
                    }}
                  >
                    <div className="min-w-0">
                      <p
                        className="text-xs font-medium truncate"
                        style={{ color: "oklch(0.85 0.02 240)" }}
                      >
                        {item.title}
                      </p>
                      <p
                        className="text-[10px] font-semibold mt-0.5"
                        style={{ color: "oklch(0.72 0.18 145)" }}
                      >
                        {item.date}
                      </p>
                    </div>
                    <ChevronRight
                      size={13}
                      style={{ color: "oklch(0.45 0.04 240)" }}
                      className="flex-shrink-0 group-hover:translate-x-1 transition-transform"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Results */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "oklch(0.14 0.04 252)",
              border: "1px solid oklch(0.22 0.05 252)",
            }}
          >
            <div
              className="px-4 py-3 flex items-center gap-2"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.38 0.16 240), oklch(0.32 0.18 255))",
              }}
            >
              <BookOpen size={15} className="text-white" />
              <span className="font-bold text-sm text-white">Results</span>
              <span
                className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
                style={{
                  color: "white",
                  background: "oklch(1 0 0 / 0.15)",
                }}
              >
                {results.length}
              </span>
            </div>
            <ul>
              {results.map((item, i) => (
                <li
                  key={item.id}
                  style={{
                    borderBottom:
                      i < results.length - 1
                        ? "1px solid oklch(0.19 0.04 252)"
                        : "none",
                  }}
                >
                  <a
                    href={item.link}
                    className="flex items-center justify-between px-4 py-3 transition-all duration-150 group"
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background =
                        "oklch(0.18 0.05 252)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background =
                        "";
                    }}
                  >
                    <div className="min-w-0">
                      <p
                        className="text-xs font-medium truncate"
                        style={{ color: "oklch(0.85 0.02 240)" }}
                      >
                        {item.title}
                      </p>
                      <p
                        className="text-[10px] font-semibold mt-0.5"
                        style={{ color: "oklch(0.72 0.18 200)" }}
                      >
                        {item.date}
                      </p>
                    </div>
                    <ChevronRight
                      size={13}
                      style={{ color: "oklch(0.45 0.04 240)" }}
                      className="flex-shrink-0 group-hover:translate-x-1 transition-transform"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Stay Updated */}
          <div
            className="rounded-2xl p-4"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.15 0.05 252), oklch(0.18 0.07 260))",
              border: "1px solid oklch(0.78 0.18 65 / 0.25)",
              boxShadow: "0 2px 12px oklch(0.78 0.18 65 / 0.08)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Bell size={15} style={{ color: "oklch(0.78 0.18 65)" }} />
              <span
                className="font-bold text-sm"
                style={{ color: "oklch(0.78 0.18 65)" }}
              >
                Stay Updated
              </span>
            </div>
            <p className="text-xs" style={{ color: "oklch(0.55 0.04 240)" }}>
              Visit daily for latest government job notifications, exam
              schedules, and results.
            </p>
          </div>
        </div>
        <AdBanner slot="3758272057" className="max-w-7xl mx-auto px-4" />
      </div>
    </div>
  );
}
