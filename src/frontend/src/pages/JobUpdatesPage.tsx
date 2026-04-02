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

  const filtered = jobs.filter((j) => {
    const matchCat = activeCategory === "All" || j.category === activeCategory;
    const matchSearch =
      !search ||
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.org.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Hero */}
      <div className="bg-[#0B2A4A] text-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Briefcase className="text-blue-300" size={28} />
            <h1 className="text-2xl md:text-3xl font-bold">Job Updates</h1>
          </div>
          <p className="text-blue-200 text-sm md:text-base mb-6">
            Latest Government Job Notifications, Admit Cards & Results — Updated
            Daily
          </p>
          {/* Search */}
          <div className="relative max-w-xl">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              placeholder="Search jobs, board, exam name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white text-gray-900 border-0 h-11 text-sm"
            />
          </div>
        </div>
      </div>

      <AdBanner slot="3758272057" className="max-w-7xl mx-auto px-4" />
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-5">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {JOB_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded text-xs font-semibold border transition-colors ${
                  activeCategory === cat
                    ? "bg-[#0B2A4A] text-white border-[#0B2A4A]"
                    : "bg-white text-gray-700 border-gray-200 hover:border-[#0B2A4A] hover:text-[#0B2A4A]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Count */}
          <p className="text-sm text-gray-500">
            Showing <strong>{filtered.length}</strong> job notifications
          </p>

          {/* Job Cards */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Briefcase size={40} className="mx-auto mb-3 opacity-30" />
              <p>No jobs found for your search.</p>
            </div>
          ) : (
            filtered.map((job, idx) => (
              <div
                key={job.id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow hover-lift animate-fade-up"
                style={{ animationDelay: `${idx * 0.07}s` }}
              >
                <div className="p-4 md:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <h2 className="font-bold text-[#0B2A4A] text-base leading-snug">
                        {job.title}
                      </h2>
                      <p className="text-gray-500 text-xs mt-0.5 flex items-center gap-1">
                        <Building2 size={12} />
                        {job.org}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded border ${statusColor(
                        job.status,
                      )}`}
                    >
                      {job.status}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-3">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
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
                    className="inline-flex items-center gap-1.5 bg-[#1E88FF] hover:bg-[#1565C0] text-white text-xs font-semibold px-4 py-1.5 rounded transition-colors"
                  >
                    Apply Online <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Admit Cards */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="bg-[#0B2A4A] text-white px-4 py-3 flex items-center gap-2">
              <FileText size={16} />
              <span className="font-semibold text-sm">Admit Cards</span>
            </div>
            <ul className="divide-y divide-gray-100">
              {admitCards.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.link}
                    className="flex items-center justify-between px-4 py-3 hover:bg-blue-50 transition-colors group"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-800 group-hover:text-[#0B2A4A] truncate">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-green-600 font-semibold">
                        {item.date}
                      </p>
                    </div>
                    <ChevronRight
                      size={14}
                      className="text-gray-400 flex-shrink-0"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Results */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="bg-[#0B2A4A] text-white px-4 py-3 flex items-center gap-2">
              <BookOpen size={16} />
              <span className="font-semibold text-sm">Results</span>
            </div>
            <ul className="divide-y divide-gray-100">
              {results.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.link}
                    className="flex items-center justify-between px-4 py-3 hover:bg-blue-50 transition-colors group"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-800 group-hover:text-[#0B2A4A] truncate">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-blue-600 font-semibold">
                        {item.date}
                      </p>
                    </div>
                    <ChevronRight
                      size={14}
                      className="text-gray-400 flex-shrink-0"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Subscribe notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Bell size={16} className="text-[#0B2A4A]" />
              <span className="font-semibold text-[#0B2A4A] text-sm">
                Stay Updated
              </span>
            </div>
            <p className="text-xs text-gray-600">
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
