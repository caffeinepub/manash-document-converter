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
  Search,
} from "lucide-react";
import { useState } from "react";
import AdBanner from "../components/AdBanner";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
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

const statusColor = (s: string) => {
  if (s === "Active") return "bg-green-100 text-green-700 border-green-200";
  if (s === "Result") return "bg-blue-100 text-blue-700 border-blue-200";
  if (s === "Exam") return "bg-orange-100 text-orange-700 border-orange-200";
  return "bg-gray-100 text-gray-700";
};

export function JobUpdatesPage() {
  const [jobs] = useState<Job[]>(() => getJobs());
  const [admitCards] = useState<AdmitCard[]>(() => getAdmitCards());
  const [results] = useState<JobResult[]>(() => getResults());
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const { ref: heroRef, inView: heroInView } = useInView();
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

  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(0.12 0.03 250)" }}
    >
      {/* Page Hero */}
      <div
        ref={heroRef as React.RefObject<HTMLDivElement>}
        className={`py-10 px-4 transition-all duration-700 ${
          heroInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
        style={{
          background:
            "linear-gradient(135deg, oklch(0.14 0.04 250) 0%, oklch(0.18 0.06 260) 100%)",
          borderBottom: "1px solid oklch(0.25 0.06 250)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Briefcase style={{ color: "oklch(0.78 0.18 65)" }} size={28} />
            <h1 className="text-2xl md:text-3xl font-bold font-display gradient-text-gold">
              Job Updates
            </h1>
          </div>
          <p
            className="text-sm md:text-base mb-6"
            style={{ color: "oklch(0.6 0.04 240)" }}
          >
            Latest Government Job Notifications, Admit Cards &amp; Results —
            Updated Daily
          </p>
          {/* Search */}
          <div className="relative max-w-xl">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2"
              size={18}
              style={{ color: "oklch(0.5 0.04 240)" }}
            />
            <Input
              placeholder="Search jobs, board, exam name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 text-sm"
              style={{
                background: "oklch(0.95 0.01 240)",
                color: "oklch(0.15 0.03 250)",
                border: "none",
              }}
              data-ocid="job.search_input"
            />
          </div>
        </div>
      </div>

      <AdBanner slot="3758272057" className="max-w-7xl mx-auto px-4" />
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div
          ref={gridRef as React.RefObject<HTMLDivElement>}
          className="lg:col-span-3 space-y-5"
        >
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {JOB_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className="px-3 py-1.5 rounded text-xs font-semibold border transition-all duration-200"
                style={{
                  background:
                    activeCategory === cat
                      ? "oklch(0.78 0.18 65)"
                      : "oklch(0.18 0.05 250)",
                  color:
                    activeCategory === cat
                      ? "oklch(0.12 0.03 250)"
                      : "oklch(0.75 0.04 240)",
                  borderColor:
                    activeCategory === cat
                      ? "oklch(0.78 0.18 65)"
                      : "oklch(0.25 0.06 250)",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Count */}
          <p className="text-sm" style={{ color: "oklch(0.6 0.04 240)" }}>
            Showing{" "}
            <strong style={{ color: "oklch(0.78 0.18 65)" }}>
              {filtered.length}
            </strong>{" "}
            job notifications
          </p>

          {/* Job Cards */}
          {filtered.length === 0 ? (
            <div
              className="text-center py-16"
              style={{ color: "oklch(0.5 0.04 240)" }}
              data-ocid="job.empty_state"
            >
              <Briefcase size={40} className="mx-auto mb-3 opacity-30" />
              <p>No jobs found for your search.</p>
            </div>
          ) : (
            filtered.map((job, idx) => (
              <div
                key={job.id}
                className={`rounded-lg hover-lift transition-all duration-700 ${
                  gridInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{
                  background: "oklch(0.16 0.04 250)",
                  border: "1px solid oklch(0.25 0.06 250)",
                  transitionDelay: `${idx * 0.07}s`,
                }}
                data-ocid={`job.item.${idx + 1}`}
              >
                <div className="p-4 md:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <h2
                        className="font-bold text-base leading-snug"
                        style={{ color: "oklch(0.92 0.02 240)" }}
                      >
                        {job.title}
                      </h2>
                      <p
                        className="text-xs mt-0.5 flex items-center gap-1"
                        style={{ color: "oklch(0.6 0.04 240)" }}
                      >
                        <Building2 size={12} />
                        {job.org}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded border ${statusColor(job.status)}`}
                    >
                      {job.status}
                    </span>
                  </div>

                  <p
                    className="text-sm mb-3"
                    style={{ color: "oklch(0.7 0.04 240)" }}
                  >
                    {job.description}
                  </p>

                  <div
                    className="flex flex-wrap gap-3 text-xs mb-3"
                    style={{ color: "oklch(0.6 0.04 240)" }}
                  >
                    <span className="flex items-center gap-1">
                      <GraduationCap size={13} />
                      {job.posts}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={13} />
                      Last Date: {job.lastDate}
                    </span>
                    <Badge
                      variant="secondary"
                      className="text-xs font-normal px-2 py-0"
                    >
                      {job.type}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-xs font-normal px-2 py-0"
                    >
                      {job.category}
                    </Badge>
                  </div>

                  <a
                    href={job.applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-white text-xs font-semibold px-4 py-1.5 rounded transition-all"
                    style={{
                      background: "oklch(0.78 0.18 65)",
                      color: "oklch(0.12 0.03 250)",
                    }}
                  >
                    Apply Online <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sidebar */}
        <div
          ref={sidebarRef as React.RefObject<HTMLDivElement>}
          className={`space-y-5 transition-all duration-700 ${
            sidebarInView
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-8"
          }`}
        >
          {/* Admit Cards */}
          <div
            className="rounded-lg overflow-hidden"
            style={{
              background: "oklch(0.16 0.04 250)",
              border: "1px solid oklch(0.25 0.06 250)",
            }}
          >
            <div
              className="px-4 py-3 flex items-center gap-2"
              style={{ background: "oklch(0.78 0.18 65)" }}
            >
              <FileText size={16} style={{ color: "oklch(0.12 0.03 250)" }} />
              <span
                className="font-semibold text-sm"
                style={{ color: "oklch(0.12 0.03 250)" }}
              >
                Admit Cards
              </span>
            </div>
            <ul>
              {admitCards.map((item) => (
                <li
                  key={item.id}
                  style={{ borderBottom: "1px solid oklch(0.20 0.04 250)" }}
                >
                  <a
                    href={item.link}
                    className="flex items-center justify-between px-4 py-3 transition-colors group"
                    style={{ color: "oklch(0.8 0.04 240)" }}
                  >
                    <div className="min-w-0">
                      <p
                        className="text-xs font-medium truncate"
                        style={{ color: "oklch(0.88 0.02 240)" }}
                      >
                        {item.title}
                      </p>
                      <p
                        className="text-[10px] font-semibold"
                        style={{ color: "oklch(0.72 0.18 145)" }}
                      >
                        {item.date}
                      </p>
                    </div>
                    <ChevronRight
                      size={14}
                      style={{ color: "oklch(0.5 0.04 240)" }}
                      className="flex-shrink-0"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Results */}
          <div
            className="rounded-lg overflow-hidden"
            style={{
              background: "oklch(0.16 0.04 250)",
              border: "1px solid oklch(0.25 0.06 250)",
            }}
          >
            <div
              className="px-4 py-3 flex items-center gap-2"
              style={{ background: "oklch(0.35 0.12 240)" }}
            >
              <BookOpen size={16} className="text-white" />
              <span className="font-semibold text-sm text-white">Results</span>
            </div>
            <ul>
              {results.map((item) => (
                <li
                  key={item.id}
                  style={{ borderBottom: "1px solid oklch(0.20 0.04 250)" }}
                >
                  <a
                    href={item.link}
                    className="flex items-center justify-between px-4 py-3 transition-colors"
                  >
                    <div className="min-w-0">
                      <p
                        className="text-xs font-medium truncate"
                        style={{ color: "oklch(0.88 0.02 240)" }}
                      >
                        {item.title}
                      </p>
                      <p
                        className="text-[10px] font-semibold"
                        style={{ color: "oklch(0.72 0.18 200)" }}
                      >
                        {item.date}
                      </p>
                    </div>
                    <ChevronRight
                      size={14}
                      style={{ color: "oklch(0.5 0.04 240)" }}
                      className="flex-shrink-0"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Subscribe notice */}
          <div
            className="rounded-lg p-4"
            style={{
              background: "oklch(0.18 0.05 250)",
              border: "1px solid oklch(0.78 0.18 65 / 0.3)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Bell size={16} style={{ color: "oklch(0.78 0.18 65)" }} />
              <span
                className="font-semibold text-sm"
                style={{ color: "oklch(0.78 0.18 65)" }}
              >
                Stay Updated
              </span>
            </div>
            <p className="text-xs" style={{ color: "oklch(0.6 0.04 240)" }}>
              Visit this page daily for the latest government job notifications,
              exam schedules, and results.
            </p>
          </div>
        </div>
        <AdBanner slot="3758272057" className="max-w-7xl mx-auto px-4" />
      </div>
    </div>
  );
}
