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
      bg: "rgba(34,197,94,0.15)",
      text: "#16a34a",
      border: "rgba(34,197,94,0.4)",
      dot: "#22c55e",
    };
  if (s === "Result")
    return {
      bg: "rgba(59,130,246,0.15)",
      text: "#2563eb",
      border: "rgba(59,130,246,0.4)",
      dot: "#3b82f6",
    };
  if (s === "Exam")
    return {
      bg: "rgba(251,146,60,0.15)",
      text: "#ea580c",
      border: "rgba(251,146,60,0.4)",
      dot: "#f97316",
    };
  return {
    bg: "rgba(148,163,184,0.1)",
    text: "#64748b",
    border: "rgba(148,163,184,0.3)",
    dot: "#94a3b8",
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
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="text-center px-2"
    >
      <div
        className="text-2xl font-bold"
        style={{
          background: "linear-gradient(135deg, #FFB6D9, #B4E7FF)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {count.toLocaleString()}+
      </div>
      <div className="text-xs text-slate-500 mt-0.5">{label}</div>
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
  const cscTitle = cscSettings.title || "CSC – Common Service Centre";
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
      style={{
        background:
          "linear-gradient(160deg, #FFF0F6 0%, #F0F8FF 50%, #FFF0F6 100%)",
      }}
    >
      {/* CSC Bridge Section */}
      {cscShow && (
        <div
          className="animate-fade-in-up"
          style={{
            background:
              "linear-gradient(135deg, #FFB6D9 0%, #d4a0f5 50%, #B4E7FF 100%)",
            boxShadow: "0 4px 24px rgba(255,182,217,0.4)",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              {/* Left: Title + Services */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-lg"
                    style={{
                      background: "rgba(255,255,255,0.9)",
                      color: "#be185d",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    CSC
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white drop-shadow-sm">
                      {cscTitle}
                    </h2>
                    <p className="text-sm text-white/80">{cscSubtitle}</p>
                  </div>
                </div>

                {/* Services grid */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {cscServices.map((svc) => (
                    <div
                      key={svc.name}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                      style={{
                        background: "rgba(255,255,255,0.85)",
                        color: "#9d174d",
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      <span>
                        {svc.name.split(" ")[0] === "PAN"
                          ? "💳"
                          : svc.name.includes("Aadhaar")
                            ? "🔐"
                            : svc.name.includes("Banking")
                              ? "🏦"
                              : svc.name.includes("Insurance")
                                ? "🛡️"
                                : svc.name.includes("Passport")
                                  ? "📘"
                                  : "💻"}
                      </span>
                      {svc.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Stats + CTAs */}
              <div className="flex flex-col items-start lg:items-end gap-4">
                <div className="flex items-center gap-6">
                  {[
                    { val: "5 Lakh+", lbl: "Service Points" },
                    { val: "300+", lbl: "Services" },
                    { val: "6 Cr+", lbl: "Citizens Served" },
                  ].map(({ val, lbl }) => (
                    <div key={lbl} className="text-center">
                      <div className="text-lg font-bold text-white">{val}</div>
                      <div className="text-xs text-white/70">{lbl}</div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={cscLoginUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold text-sm transition-all duration-200 hover:scale-105 hover:shadow-xl"
                    style={{
                      background: "rgba(255,255,255,0.95)",
                      color: "#be185d",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
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
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl font-bold text-sm transition-all duration-200 hover:opacity-80"
                    style={{
                      background: "rgba(255,255,255,0.2)",
                      color: "white",
                      border: "2px solid rgba(255,255,255,0.6)",
                      backdropFilter: "blur(10px)",
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
        className={`relative overflow-hidden py-10 px-4 transition-all duration-700 ${
          heroInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
        style={{
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,182,217,0.3)",
        }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ background: "#FFB6D9" }}
        />
        <div
          className="absolute bottom-0 left-0 w-56 h-56 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: "#B4E7FF" }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div
                className="p-3 rounded-2xl shadow-md"
                style={{
                  background: "linear-gradient(135deg, #FFB6D9, #B4E7FF)",
                  boxShadow: "0 4px 16px rgba(255,182,217,0.5)",
                }}
              >
                <Briefcase className="text-white" size={24} />
              </div>
              <div>
                <h1
                  className="text-2xl md:text-3xl font-bold leading-tight"
                  style={{
                    background: "linear-gradient(135deg, #be185d, #0369a1)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Job Updates
                </h1>
                <p className="text-xs text-slate-500">
                  Latest Govt Notifications • Updated Daily
                </p>
              </div>
            </div>

            {/* CSC Login Button */}
            <a
              href="https://www.csc.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 font-bold text-sm px-5 py-2.5 rounded-2xl transition-all duration-300 group flex-shrink-0 hover:scale-105 hover:shadow-xl"
              style={{
                background: "linear-gradient(135deg, #FFB6D9, #B4E7FF)",
                color: "#7c3aed",
                boxShadow: "0 4px 16px rgba(255,182,217,0.5)",
              }}
            >
              <div
                className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black"
                style={{
                  background: "rgba(255,255,255,0.9)",
                  color: "#be185d",
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
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400"
              size={17}
            />
            <Input
              placeholder="Search jobs, board, organisation name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12 text-sm rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.9)",
                border: "1.5px solid rgba(255,182,217,0.5)",
                color: "#1e293b",
                backdropFilter: "blur(10px)",
                boxShadow: "0 2px 12px rgba(255,182,217,0.2)",
              }}
              data-ocid="job.search_input"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2 py-0.5 rounded-lg text-slate-400 hover:text-pink-500"
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
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(180,231,255,0.4)",
          boxShadow: "0 2px 16px rgba(180,231,255,0.2)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-3 md:grid-cols-6 gap-4 divide-x divide-pink-100">
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
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 hover:scale-105"
                  style={{
                    background: isActive
                      ? "linear-gradient(135deg, #FFB6D9, #B4E7FF)"
                      : "rgba(255,255,255,0.85)",
                    color: isActive ? "#7c3aed" : "#64748b",
                    border: isActive
                      ? "1.5px solid rgba(255,182,217,0.7)"
                      : "1.5px solid rgba(226,232,240,0.8)",
                    boxShadow: isActive
                      ? "0 2px 12px rgba(255,182,217,0.5)"
                      : "0 1px 4px rgba(0,0,0,0.05)",
                    backdropFilter: "blur(10px)",
                    transform: isActive ? "scale(1.05)" : "scale(1)",
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
            <p className="text-sm text-slate-500">
              Showing{" "}
              <strong
                style={{
                  background: "linear-gradient(135deg, #be185d, #0369a1)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {filtered.length}
              </strong>{" "}
              job notifications
            </p>
            {search && (
              <span
                className="text-xs px-2 py-1 rounded-full"
                style={{
                  background: "rgba(255,182,217,0.15)",
                  color: "#be185d",
                  border: "1px solid rgba(255,182,217,0.4)",
                }}
              >
                Search: "{search}"
              </span>
            )}
          </div>

          {/* Job Cards */}
          {filtered.length === 0 ? (
            <div
              className="text-center py-20 rounded-3xl"
              style={{
                background: "rgba(255,255,255,0.85)",
                border: "1.5px solid rgba(255,182,217,0.3)",
                backdropFilter: "blur(10px)",
              }}
              data-ocid="job.empty_state"
            >
              <Briefcase size={44} className="mx-auto mb-3 text-pink-300" />
              <p className="text-base font-medium text-slate-600">
                No jobs found
              </p>
              <p className="text-sm mt-1 text-slate-400">
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
                  className={`rounded-3xl transition-all duration-300 cursor-default ${
                    gridInView
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                  style={{
                    background: isHovered
                      ? "rgba(255,255,255,0.98)"
                      : "rgba(255,255,255,0.88)",
                    border: isHovered
                      ? "1.5px solid rgba(255,182,217,0.7)"
                      : "1.5px solid rgba(226,232,240,0.7)",
                    boxShadow: isHovered
                      ? "0 12px 40px rgba(255,182,217,0.25)"
                      : "0 2px 12px rgba(0,0,0,0.05)",
                    backdropFilter: "blur(10px)",
                    transitionDelay: `${idx * 0.05}s`,
                    transform: isHovered ? "translateY(-3px)" : "translateY(0)",
                  }}
                  onMouseEnter={() => setHoveredJob(job.id)}
                  onMouseLeave={() => setHoveredJob(null)}
                  data-ocid={`job.item.${idx + 1}`}
                >
                  {/* Pink-Sky top accent */}
                  <div
                    className="h-1 rounded-t-3xl"
                    style={{
                      background: isHovered
                        ? "linear-gradient(90deg, #FFB6D9, #B4E7FF)"
                        : "transparent",
                      transition: "background 0.3s",
                    }}
                  />

                  <div className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div
                          className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(255,182,217,0.2), rgba(180,231,255,0.2))",
                            border: "1.5px solid rgba(255,182,217,0.4)",
                          }}
                        >
                          <Briefcase size={18} className="text-pink-500" />
                        </div>
                        <div className="min-w-0">
                          <h2 className="font-bold text-base leading-snug text-slate-800">
                            {job.title}
                          </h2>
                          <p className="text-xs mt-1 flex items-center gap-1 text-slate-500">
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

                    <p className="text-sm mb-4 leading-relaxed text-slate-600">
                      {job.description}
                    </p>

                    {/* Meta info chips */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span
                        className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-xl"
                        style={{
                          background: "rgba(255,182,217,0.12)",
                          color: "#be185d",
                        }}
                      >
                        <GraduationCap size={11} />
                        {job.posts}
                      </span>
                      <span
                        className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-xl"
                        style={{
                          background: "rgba(180,231,255,0.2)",
                          color: "#0369a1",
                        }}
                      >
                        <Calendar size={11} />
                        Last Date: {job.lastDate}
                      </span>
                      <Badge
                        variant="secondary"
                        className="text-xs font-normal px-2.5 py-1 rounded-xl h-auto"
                        style={{
                          background: "rgba(180,231,255,0.2)",
                          color: "#0369a1",
                          border: "none",
                        }}
                      >
                        {job.type}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs font-normal px-2.5 py-1 rounded-xl h-auto"
                        style={{
                          background: "rgba(255,182,217,0.1)",
                          color: "#be185d",
                          border: "1px solid rgba(255,182,217,0.4)",
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
                      className="inline-flex items-center gap-2 text-xs font-bold px-5 py-2 rounded-2xl transition-all duration-200 hover:scale-105 hover:shadow-lg"
                      style={{
                        background: "linear-gradient(135deg, #FFB6D9, #B4E7FF)",
                        color: "#7c3aed",
                        boxShadow: "0 3px 12px rgba(255,182,217,0.4)",
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
            className="rounded-3xl overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,182,217,0.15), rgba(180,231,255,0.15))",
              border: "1.5px solid rgba(255,182,217,0.4)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 4px 20px rgba(255,182,217,0.2)",
            }}
          >
            <div
              className="px-4 py-3"
              style={{
                background: "linear-gradient(135deg, #FFB6D9, #B4E7FF)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black"
                  style={{
                    background: "rgba(255,255,255,0.9)",
                    color: "#be185d",
                  }}
                >
                  CSC
                </div>
                <div>
                  <p className="font-bold text-sm text-white">CSC Portal</p>
                  <p className="text-xs text-white/80">Common Service Centre</p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs mb-3 leading-relaxed text-slate-600">
                Access CSC services, apply for government schemes, and manage
                digital services.
              </p>
              <a
                href="https://www.csc.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2 rounded-2xl text-sm font-bold transition-all duration-200 hover:scale-105 hover:shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #FFB6D9, #B4E7FF)",
                  color: "#7c3aed",
                  boxShadow: "0 3px 12px rgba(255,182,217,0.4)",
                }}
              >
                <LogIn size={14} />
                Login to CSC
              </a>
            </div>
          </div>

          {/* Admit Cards */}
          <div
            className="rounded-3xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.88)",
              border: "1.5px solid rgba(255,182,217,0.3)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            }}
          >
            <div
              className="px-4 py-3 flex items-center gap-2"
              style={{
                background: "linear-gradient(135deg, #FFB6D9, #f9a8d4)",
              }}
            >
              <FileText size={15} className="text-white" />
              <span className="font-bold text-sm text-white">Admit Cards</span>
              <span
                className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(255,255,255,0.3)", color: "white" }}
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
                        ? "1px solid rgba(255,182,217,0.2)"
                        : "none",
                  }}
                >
                  <a
                    href={item.link}
                    className="flex items-center justify-between px-4 py-3 transition-all duration-150 group hover:bg-pink-50"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate text-slate-700">
                        {item.title}
                      </p>
                      <p className="text-[10px] font-semibold mt-0.5 text-emerald-600">
                        {item.date}
                      </p>
                    </div>
                    <ChevronRight
                      size={13}
                      className="flex-shrink-0 text-pink-400 group-hover:translate-x-1 transition-transform"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Results */}
          <div
            className="rounded-3xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.88)",
              border: "1.5px solid rgba(180,231,255,0.4)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            }}
          >
            <div
              className="px-4 py-3 flex items-center gap-2"
              style={{
                background: "linear-gradient(135deg, #B4E7FF, #93c5fd)",
              }}
            >
              <BookOpen size={15} className="text-white" />
              <span className="font-bold text-sm text-white">Results</span>
              <span
                className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(255,255,255,0.3)", color: "white" }}
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
                        ? "1px solid rgba(180,231,255,0.3)"
                        : "none",
                  }}
                >
                  <a
                    href={item.link}
                    className="flex items-center justify-between px-4 py-3 transition-all duration-150 group hover:bg-sky-50"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate text-slate-700">
                        {item.title}
                      </p>
                      <p className="text-[10px] font-semibold mt-0.5 text-sky-600">
                        {item.date}
                      </p>
                    </div>
                    <ChevronRight
                      size={13}
                      className="flex-shrink-0 text-sky-400 group-hover:translate-x-1 transition-transform"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Stay Updated */}
          <div
            className="rounded-3xl p-4"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,182,217,0.12), rgba(180,231,255,0.12))",
              border: "1.5px solid rgba(255,182,217,0.3)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Bell size={15} className="text-pink-400" />
              <span className="font-bold text-sm text-pink-600">
                Stay Updated
              </span>
            </div>
            <p className="text-xs text-slate-500">
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
