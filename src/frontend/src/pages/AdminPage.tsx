import {
  Award,
  Briefcase,
  Camera,
  CreditCard,
  Edit,
  FileText,
  Home,
  Library,
  Mail,
  MapPin,
  Monitor,
  Mountain,
  Phone,
  Plus,
  Save,
  Settings,
  Star,
  Trash2,
  Tv,
  Upload,
  User,
  Wifi,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Page } from "../App";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Textarea } from "../components/ui/textarea";
import {
  type AdminConfig,
  type AdmitCard,
  type ContactInfo,
  type GovDocAdmin,
  type Job,
  type JobResult,
  type Order,
  type Product,
  getAdminConfig,
  getAdmitCards,
  getContactInfo,
  getGovDocs,
  getJobs,
  getOrders,
  getProducts,
  getResults,
  saveAdmitCards,
  saveContactInfo,
  saveGovDocs,
  saveJobs,
  saveOrders,
  saveProducts,
  saveResults,
} from "../types";
import { CertificateAlbumPage } from "./CertificateAlbumPage";

interface Props {
  navigate: (p: Page) => void;
}

type Tab =
  | "dashboard"
  | "products"
  | "orders"
  | "settings"
  | "job-updates"
  | "gov-documents"
  | "contact"
  | "certificate"
  | "homepage"
  | "pan-card"
  | "govt-forms"
  | "entertainment"
  | "assam-tourism";

const ADMIN_EMAIL = "admin@nextgenit.com";
const ADMIN_PASSWORD = "Admin@123";

const JOB_CATEGORIES_LIST = [
  "Govt Jobs",
  "Railway",
  "Banking",
  "SSC",
  "Police",
  "Teaching",
  "Defence",
  "State PSC",
];

export function AdminPage({ navigate }: Props) {
  const [authed, setAuthed] = useState(() => {
    try {
      return !!JSON.parse(localStorage.getItem("adminSession") || "null")
        ?.isAdmin;
    } catch {
      return false;
    }
  });
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [tab, setTab] = useState<Tab>("dashboard");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [config, setConfig] = useState<AdminConfig>(() => getAdminConfig());
  const [contactInfo, setContactInfo] = useState<ContactInfo>(() =>
    getContactInfo(),
  );
  const [ownerPhotoPreview, setOwnerPhotoPreview] = useState<string | null>(
    () => localStorage.getItem("contactOwnerPhoto"),
  );

  // Job Updates state
  const [jobs, setJobs] = useState<Job[]>([]);
  const [admitCards, setAdmitCards] = useState<AdmitCard[]>([]);
  const [jobResults, setJobResults] = useState<JobResult[]>([]);
  const [jobDialogOpen, setJobDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [admitCardDialogOpen, setAdmitCardDialogOpen] = useState(false);
  const [editingAdmitCard, setEditingAdmitCard] = useState<AdmitCard | null>(
    null,
  );
  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<JobResult | null>(null);

  // Gov Docs state
  const [govDocs, setGovDocs] = useState<GovDocAdmin[]>([]);
  const [govDocDialogOpen, setGovDocDialogOpen] = useState(false);
  const [editingGovDoc, setEditingGovDoc] = useState<GovDocAdmin | null>(null);

  useEffect(() => {
    if (authed) {
      setProducts(getProducts());
      setOrders(getOrders());
      setJobs(getJobs());
      setAdmitCards(getAdmitCards());
      setJobResults(getResults());
      setGovDocs(getGovDocs());
    }
  }, [authed]);

  const login = () => {
    if (loginEmail === ADMIN_EMAIL && loginPass === ADMIN_PASSWORD) {
      localStorage.setItem(
        "adminSession",
        JSON.stringify({ isAdmin: true, email: ADMIN_EMAIL }),
      );
      setAuthed(true);
      toast.success("Welcome, Admin!");
    } else {
      toast.error("Invalid credentials");
    }
  };

  const logout = () => {
    localStorage.removeItem("adminSession");
    setAuthed(false);
  };

  const deleteProduct = (id: string) => {
    if (!confirm("Delete this product?")) return;
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    saveProducts(updated);
    toast.success("Product deleted");
  };

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    const updated = orders.map((o) =>
      o.id === orderId ? { ...o, status } : o,
    );
    setOrders(updated);
    saveOrders(updated);
    toast.success("Order status updated");
  };

  const saveConfig = () => {
    localStorage.setItem("adminConfig", JSON.stringify(config));
    toast.success("Settings saved!");
  };

  // Job CRUD
  const deleteJob = (id: string) => {
    if (!confirm("Delete this job listing?")) return;
    const updated = jobs.filter((j) => j.id !== id);
    setJobs(updated);
    saveJobs(updated);
    toast.success("Job deleted");
  };

  // Admit Card CRUD
  const deleteAdmitCard = (id: string) => {
    if (!confirm("Delete this admit card?")) return;
    const updated = admitCards.filter((c) => c.id !== id);
    setAdmitCards(updated);
    saveAdmitCards(updated);
    toast.success("Admit card deleted");
  };

  // Result CRUD
  const deleteResult = (id: string) => {
    if (!confirm("Delete this result?")) return;
    const updated = jobResults.filter((r) => r.id !== id);
    setJobResults(updated);
    saveResults(updated);
    toast.success("Result deleted");
  };

  if (!authed) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#F3F5F8] px-4">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-8">
          <div className="text-center mb-6">
            <div className="text-2xl font-extrabold text-[#0B2A4A]">
              Admin Login
            </div>
            <p className="text-gray-400 text-sm mt-1">
              NextGen IT Hub Admin Panel
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="admin@nextgenit.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="mt-1"
                onKeyDown={(e) => e.key === "Enter" && login()}
                data-ocid="admin.input"
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                className="mt-1"
                onKeyDown={(e) => e.key === "Enter" && login()}
                data-ocid="admin.input"
              />
            </div>
            <Button
              onClick={login}
              className="w-full bg-[#0B2A4A] hover:bg-[#1E88FF] text-white py-3 rounded-lg font-semibold"
              data-ocid="admin.submit_button"
            >
              Login to Admin Panel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const revenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + o.totalAmount, 0);

  return (
    <div className="min-h-screen bg-[#F3F5F8]">
      {/* Admin header */}
      <div className="bg-[#0B2A4A] text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <span className="font-bold text-lg">Admin Panel</span>
            <span className="text-blue-300 text-sm ml-3">NextGen IT Hub</span>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => navigate("home")}
              variant="ghost"
              className="text-blue-200 hover:text-white text-sm"
            >
              View Store
            </Button>
            <Button
              onClick={logout}
              variant="ghost"
              className="text-red-300 hover:text-red-100 text-sm"
              data-ocid="admin.secondary_button"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6 overflow-x-auto">
        <div className="max-w-7xl mx-auto flex gap-1 min-w-max">
          {(
            [
              "dashboard",
              "products",
              "orders",
              "settings",
              "job-updates",
              "gov-documents",
              "contact",
              "certificate",
              "homepage",
              "pan-card",
              "govt-forms",
              "entertainment",
              "assam-tourism",
            ] as Tab[]
          ).map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-4 text-sm font-semibold capitalize border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                tab === t
                  ? "border-[#1E88FF] text-[#0B2A4A]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              data-ocid={`admin.${t}.tab`}
            >
              {t === "job-updates" && <Briefcase size={14} />}
              {t === "gov-documents" && <FileText size={14} />}
              {t === "contact" && <MapPin size={14} />}
              {t === "certificate" && <Award size={14} />}
              {t === "homepage" && <Home size={14} />}
              {t === "pan-card" && <CreditCard size={14} />}
              {t === "govt-forms" && <Library size={14} />}
              {t === "entertainment" && <Tv size={14} />}
              {t === "assam-tourism" && <Mountain size={14} />}
              {t === "job-updates"
                ? "Job Updates"
                : t === "gov-documents"
                  ? "Govt Documents"
                  : t === "contact"
                    ? "Contact Us"
                    : t === "homepage"
                      ? "Homepage"
                      : t === "pan-card"
                        ? "PAN Card"
                        : t === "govt-forms"
                          ? "Govt Forms"
                          : t === "entertainment"
                            ? "Entertainment"
                            : t === "assam-tourism"
                              ? "Assam Tourism"
                              : t}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Dashboard */}
        {tab === "dashboard" && (
          <div>
            <h2 className="text-xl font-bold text-[#0B2A4A] mb-6">Dashboard</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  label: "Total Products",
                  value: products.length,
                  color: "bg-blue-50 text-blue-700",
                },
                {
                  label: "Total Orders",
                  value: orders.length,
                  color: "bg-purple-50 text-purple-700",
                },
                {
                  label: "Pending Orders",
                  value: pendingOrders,
                  color: "bg-yellow-50 text-yellow-700",
                },
                {
                  label: "Total Revenue",
                  value: `₹${revenue.toLocaleString("en-IN")}`,
                  color: "bg-green-50 text-green-700",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={`rounded-2xl p-6 ${stat.color}`}
                >
                  <div className="text-3xl font-extrabold">{stat.value}</div>
                  <div className="text-sm font-medium mt-1 opacity-80">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products */}
        {tab === "products" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#0B2A4A]">
                Products ({products.length})
              </h2>
              <Button
                onClick={() => {
                  setEditingProduct(null);
                  setProductDialogOpen(true);
                }}
                className="bg-[#0B2A4A] hover:bg-[#1E88FF] text-white"
                data-ocid="products.open_modal_button"
              >
                <Plus size={16} className="mr-2" /> Add Product
              </Button>
            </div>
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                      Product
                    </th>
                    <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                      Category
                    </th>
                    <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                      Price
                    </th>
                    <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                      Stock
                    </th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-[#0B2A4A]">
                        {p.name}
                      </td>
                      <td className="px-4 py-3 text-gray-500 capitalize">
                        {p.category.replace("-", " ")}
                      </td>
                      <td className="px-4 py-3 text-[#1E88FF] font-semibold">
                        ₹{p.price.toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            p.inStock
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {p.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProduct(p);
                              setProductDialogOpen(true);
                            }}
                            className="text-blue-500 hover:text-blue-700 p-1"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteProduct(p.id)}
                            className="text-red-400 hover:text-red-600 p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders */}
        {tab === "orders" && (
          <div>
            <h2 className="text-xl font-bold text-[#0B2A4A] mb-6">
              Orders ({orders.length})
            </h2>
            {orders.length === 0 ? (
              <div className="bg-white rounded-xl shadow p-12 text-center text-gray-400">
                No orders yet
              </div>
            ) : (
              <div className="space-y-3">
                {[...orders].reverse().map((o) => (
                  <div key={o.id} className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="font-bold text-[#0B2A4A]">{o.id}</div>
                        <div className="text-sm text-gray-500">
                          {o.customerName} ·{" "}
                          {o.customerPhone || o.customerEmail}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(o.createdAt).toLocaleDateString("en-IN")} ·{" "}
                          {o.deliveryType} · {o.paymentMethod}
                        </div>
                        <div className="mt-2 space-y-0.5">
                          {o.items.map((i) => (
                            <div
                              key={i.productId}
                              className="text-xs text-gray-600"
                            >
                              {i.productName} × {i.qty}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="font-bold text-[#1E88FF]">
                          ₹{o.totalAmount.toLocaleString("en-IN")}
                        </div>
                        <select
                          value={o.status}
                          onChange={(e) =>
                            updateOrderStatus(
                              o.id,
                              e.target.value as Order["status"],
                            )
                          }
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:border-[#1E88FF]"
                        >
                          {[
                            "pending",
                            "confirmed",
                            "shipped",
                            "delivered",
                            "cancelled",
                          ].map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings */}
        {tab === "settings" && (
          <div className="max-w-xl">
            <h2 className="text-xl font-bold text-[#0B2A4A] mb-6">
              API Settings
            </h2>
            <div className="bg-white rounded-xl shadow p-6 space-y-5">
              <div>
                <Label className="font-semibold text-gray-700">
                  Razorpay Key ID
                </Label>
                <Input
                  placeholder="rzp_live_xxxxxxxxxxxx"
                  value={config.razorpayKeyId || ""}
                  onChange={(e) =>
                    setConfig({ ...config, razorpayKeyId: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="font-semibold text-gray-700">
                  Razorpay Key Secret
                </Label>
                <Input
                  type="password"
                  placeholder="Your Razorpay key secret"
                  value={config.razorpayKeySecret || ""}
                  onChange={(e) =>
                    setConfig({ ...config, razorpayKeySecret: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div className="border-t pt-4">
                <Label className="font-semibold text-gray-700">
                  Shiprocket Email
                </Label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={config.shiprocketEmail || ""}
                  onChange={(e) =>
                    setConfig({ ...config, shiprocketEmail: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="font-semibold text-gray-700">
                  Shiprocket Password
                </Label>
                <Input
                  type="password"
                  placeholder="Shiprocket password"
                  value={config.shiprocketPassword || ""}
                  onChange={(e) =>
                    setConfig({ ...config, shiprocketPassword: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <Button
                onClick={saveConfig}
                className="bg-[#0B2A4A] hover:bg-[#1E88FF] text-white w-full rounded-lg py-3"
                data-ocid="settings.save_button"
              >
                <Save size={16} className="mr-2" /> Save Settings
              </Button>
            </div>
          </div>
        )}

        {/* Job Updates */}
        {tab === "job-updates" && (
          <div className="space-y-8">
            <h2 className="text-xl font-bold text-[#0B2A4A]">
              Job Updates Management
            </h2>

            {/* ── Job Listings ── */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-[#0B2A4A] flex items-center gap-2">
                  <Briefcase size={16} className="text-[#1E88FF]" />
                  Job Listings ({jobs.length})
                </h3>
                <Button
                  onClick={() => {
                    setEditingJob(null);
                    setJobDialogOpen(true);
                  }}
                  className="bg-[#0B2A4A] hover:bg-[#1E88FF] text-white text-xs px-3 py-1.5 h-auto"
                  data-ocid="jobs.open_modal_button"
                >
                  <Plus size={14} className="mr-1" /> Add Job
                </Button>
              </div>
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[640px]">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                          Title
                        </th>
                        <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                          Category
                        </th>
                        <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                          Posts
                        </th>
                        <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                          Last Date
                        </th>
                        <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                          Status
                        </th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.map((job, idx) => (
                        <tr
                          key={job.id}
                          className="border-b hover:bg-gray-50"
                          data-ocid={`jobs.row.item.${idx + 1}`}
                        >
                          <td className="px-4 py-3">
                            <div className="font-medium text-[#0B2A4A] text-xs leading-tight">
                              {job.title}
                            </div>
                            <div className="text-gray-400 text-[10px]">
                              {job.org}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-xs">
                            {job.category}
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-xs">
                            {job.posts}
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-xs">
                            {job.lastDate}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                                job.status === "Active"
                                  ? "bg-green-100 text-green-700 border-green-200"
                                  : job.status === "Result"
                                    ? "bg-blue-100 text-blue-700 border-blue-200"
                                    : job.status === "Exam"
                                      ? "bg-orange-100 text-orange-700 border-orange-200"
                                      : "bg-gray-100 text-gray-600 border-gray-200"
                              }`}
                            >
                              {job.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1 justify-end">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingJob(job);
                                  setJobDialogOpen(true);
                                }}
                                className="text-blue-500 hover:text-blue-700 p-1"
                                data-ocid={`jobs.edit_button.${idx + 1}`}
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteJob(job.id)}
                                className="text-red-400 hover:text-red-600 p-1"
                                data-ocid={`jobs.delete_button.${idx + 1}`}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* ── Admit Cards ── */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-[#0B2A4A]">
                  Admit Cards ({admitCards.length})
                </h3>
                <Button
                  onClick={() => {
                    setEditingAdmitCard(null);
                    setAdmitCardDialogOpen(true);
                  }}
                  className="bg-[#0B2A4A] hover:bg-[#1E88FF] text-white text-xs px-3 py-1.5 h-auto"
                  data-ocid="admitcards.open_modal_button"
                >
                  <Plus size={14} className="mr-1" /> Add Admit Card
                </Button>
              </div>
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                        Title
                      </th>
                      <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                        Date/Status
                      </th>
                      <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                        Link
                      </th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {admitCards.map((card, idx) => (
                      <tr
                        key={card.id}
                        className="border-b hover:bg-gray-50"
                        data-ocid={`admitcards.row.item.${idx + 1}`}
                      >
                        <td className="px-4 py-3 font-medium text-[#0B2A4A] text-sm">
                          {card.title}
                        </td>
                        <td className="px-4 py-3 text-green-600 text-sm font-semibold">
                          {card.date}
                        </td>
                        <td className="px-4 py-3 text-blue-500 text-xs truncate max-w-[120px]">
                          {card.link}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1 justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingAdmitCard(card);
                                setAdmitCardDialogOpen(true);
                              }}
                              className="text-blue-500 hover:text-blue-700 p-1"
                              data-ocid={`admitcards.edit_button.${idx + 1}`}
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteAdmitCard(card.id)}
                              className="text-red-400 hover:text-red-600 p-1"
                              data-ocid={`admitcards.delete_button.${idx + 1}`}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* ── Results ── */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-[#0B2A4A]">
                  Results ({jobResults.length})
                </h3>
                <Button
                  onClick={() => {
                    setEditingResult(null);
                    setResultDialogOpen(true);
                  }}
                  className="bg-[#0B2A4A] hover:bg-[#1E88FF] text-white text-xs px-3 py-1.5 h-auto"
                  data-ocid="results.open_modal_button"
                >
                  <Plus size={14} className="mr-1" /> Add Result
                </Button>
              </div>
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                        Title
                      </th>
                      <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                        Date/Status
                      </th>
                      <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                        Link
                      </th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {jobResults.map((result, idx) => (
                      <tr
                        key={result.id}
                        className="border-b hover:bg-gray-50"
                        data-ocid={`results.row.item.${idx + 1}`}
                      >
                        <td className="px-4 py-3 font-medium text-[#0B2A4A] text-sm">
                          {result.title}
                        </td>
                        <td className="px-4 py-3 text-blue-600 text-sm font-semibold">
                          {result.date}
                        </td>
                        <td className="px-4 py-3 text-blue-500 text-xs truncate max-w-[120px]">
                          {result.link}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1 justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingResult(result);
                                setResultDialogOpen(true);
                              }}
                              className="text-blue-500 hover:text-blue-700 p-1"
                              data-ocid={`results.edit_button.${idx + 1}`}
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteResult(result.id)}
                              className="text-red-400 hover:text-red-600 p-1"
                              data-ocid={`results.delete_button.${idx + 1}`}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
        {tab === "gov-documents" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#0B2A4A]">
                Govt Documents Management
              </h2>
              <Button
                onClick={() => {
                  setEditingGovDoc(null);
                  setGovDocDialogOpen(true);
                }}
                className="bg-[#0B2A4A] hover:bg-[#1E88FF] text-white text-xs px-3 py-1.5 h-auto"
                data-ocid="gov_docs.open_modal_button"
              >
                <Plus size={14} className="mr-1" /> Add Document
              </Button>
            </div>
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[640px]">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                        Title
                      </th>
                      <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                        Subtitle
                      </th>
                      <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                        Category
                      </th>
                      <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                        Has Guide
                      </th>
                      <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                        Actions
                      </th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {govDocs.map((doc, idx) => (
                      <tr
                        key={doc.id}
                        className="border-b last:border-0 hover:bg-gray-50"
                        data-ocid={`gov_docs.item.${idx + 1}`}
                      >
                        <td className="px-4 py-3 font-medium text-[#0B2A4A]">
                          {doc.title}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {doc.subtitle}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                            {doc.category}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${doc.hasGuide ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                          >
                            {doc.hasGuide ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {doc.actions.length} link
                          {doc.actions.length !== 1 ? "s" : ""}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2 justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingGovDoc(doc);
                                setGovDocDialogOpen(true);
                              }}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                              data-ocid={`gov_docs.edit_button.${idx + 1}`}
                            >
                              <Edit size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Delete "${doc.title}"?`)) {
                                  const updated = govDocs.filter(
                                    (d) => d.id !== doc.id,
                                  );
                                  setGovDocs(updated);
                                  saveGovDocs(updated);
                                  toast.success("Document deleted");
                                }
                              }}
                              className="text-red-500 hover:text-red-700 transition-colors"
                              data-ocid={`gov_docs.delete_button.${idx + 1}`}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {govDocs.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-8 text-center text-gray-400"
                          data-ocid="gov_docs.empty_state"
                        >
                          No documents yet. Click "Add Document" to add one.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab === "contact" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#0B2A4A]">
                  Contact Us Settings
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Update the contact information shown on the Contact Us page
                </p>
              </div>
              <Button
                onClick={() => {
                  saveContactInfo(contactInfo);
                  toast.success("Contact information saved!");
                }}
                className="flex items-center gap-2"
              >
                <Save size={15} /> Save Changes
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Owner Info */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                <h3 className="font-semibold text-[#0B2A4A] flex items-center gap-2">
                  <FileText size={16} className="text-[#1E88FF]" /> Owner
                  Information
                </h3>
                <div>
                  <Label htmlFor="ci-owner-name">Owner Name</Label>
                  <Input
                    id="ci-owner-name"
                    value={contactInfo.ownerName}
                    onChange={(e) =>
                      setContactInfo({
                        ...contactInfo,
                        ownerName: e.target.value,
                      })
                    }
                    placeholder="Mr. Manashjoyti Barman"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="ci-owner-title">Owner Title / Role</Label>
                  <Input
                    id="ci-owner-title"
                    value={contactInfo.ownerTitle}
                    onChange={(e) =>
                      setContactInfo({
                        ...contactInfo,
                        ownerTitle: e.target.value,
                      })
                    }
                    placeholder="Founder Manash PC World"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Profile Photo Upload */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                <h3 className="font-semibold text-[#0B2A4A] flex items-center gap-2">
                  <User size={16} className="text-[#1E88FF]" /> Owner Profile
                  Photo
                </h3>
                <div className="flex items-center gap-4">
                  <div
                    className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
                    style={{
                      border: "2px solid oklch(0.78 0.18 65)",
                      background: "#f0f4fa",
                    }}
                  >
                    {ownerPhotoPreview ? (
                      <img
                        src={ownerPhotoPreview}
                        alt="Owner Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={30} className="text-gray-400" />
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="owner-photo-upload"
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition text-sm font-medium text-[#0B2A4A]">
                        <Upload size={14} /> Upload Photo
                      </div>
                      <input
                        id="owner-photo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            const base64 = ev.target?.result as string;
                            localStorage.setItem("contactOwnerPhoto", base64);
                            setOwnerPhotoPreview(base64);
                            toast.success("Photo uploaded!");
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </Label>
                    {ownerPhotoPreview && (
                      <button
                        type="button"
                        onClick={() => {
                          localStorage.removeItem("contactOwnerPhoto");
                          setOwnerPhotoPreview(null);
                          toast.success("Photo removed");
                        }}
                        className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition"
                      >
                        <X size={12} /> Remove Photo
                      </button>
                    )}
                    <p className="text-xs text-gray-400">
                      Circular avatar shown on Contact Us page
                    </p>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                <h3 className="font-semibold text-[#0B2A4A] flex items-center gap-2">
                  <MapPin size={16} className="text-[#1E88FF]" /> Address
                </h3>
                <div>
                  <Label htmlFor="ci-address">Address</Label>
                  <Input
                    id="ci-address"
                    value={contactInfo.address}
                    onChange={(e) =>
                      setContactInfo({
                        ...contactInfo,
                        address: e.target.value,
                      })
                    }
                    placeholder="Chamata, Nalbari, Assam, India"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="ci-pincode">Pincode</Label>
                  <Input
                    id="ci-pincode"
                    value={contactInfo.pincode}
                    onChange={(e) =>
                      setContactInfo({
                        ...contactInfo,
                        pincode: e.target.value,
                      })
                    }
                    placeholder="781306"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Contact Details */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                <h3 className="font-semibold text-[#0B2A4A] flex items-center gap-2">
                  <Phone size={16} className="text-[#1E88FF]" /> Contact Details
                </h3>
                <div>
                  <Label htmlFor="ci-phone">Phone Number</Label>
                  <Input
                    id="ci-phone"
                    value={contactInfo.phone}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, phone: e.target.value })
                    }
                    placeholder="9678311414"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="ci-email">Email Address</Label>
                  <Input
                    id="ci-email"
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, email: e.target.value })
                    }
                    placeholder="manashpcworld@zohomail.in"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="ci-whatsapp">
                    WhatsApp Number (with country code)
                  </Label>
                  <Input
                    id="ci-whatsapp"
                    value={contactInfo.whatsappNumber}
                    onChange={(e) =>
                      setContactInfo({
                        ...contactInfo,
                        whatsappNumber: e.target.value,
                      })
                    }
                    placeholder="919678311414"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                <h3 className="font-semibold text-[#0B2A4A] flex items-center gap-2">
                  <Mail size={16} className="text-[#1E88FF]" /> Social Media
                  Links
                </h3>
                <div>
                  <Label htmlFor="ci-youtube">YouTube URL</Label>
                  <Input
                    id="ci-youtube"
                    value={contactInfo.youtubeUrl}
                    onChange={(e) =>
                      setContactInfo({
                        ...contactInfo,
                        youtubeUrl: e.target.value,
                      })
                    }
                    placeholder="https://youtube.com/@yourchannel"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="ci-instagram">Instagram URL</Label>
                  <Input
                    id="ci-instagram"
                    value={contactInfo.instagramUrl}
                    onChange={(e) =>
                      setContactInfo({
                        ...contactInfo,
                        instagramUrl: e.target.value,
                      })
                    }
                    placeholder="https://instagram.com/yourprofile"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="ci-facebook">Facebook URL</Label>
                  <Input
                    id="ci-facebook"
                    value={contactInfo.facebookUrl}
                    onChange={(e) =>
                      setContactInfo({
                        ...contactInfo,
                        facebookUrl: e.target.value,
                      })
                    }
                    placeholder="https://facebook.com/yourpage"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "certificate" && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#0B2A4A]">
                Certificate & Album Sheet
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Manage certificate and album sheet content
              </p>
            </div>
            <CertificateAlbumPage />
          </div>
        )}
        {/* ── HOMEPAGE TAB ── */}
        {tab === "homepage" && <HomepageAdminTab />}

        {/* ── PAN CARD TAB ── */}
        {tab === "pan-card" && <PanCardAdminTab />}

        {/* ── GOVT FORMS TAB ── */}
        {tab === "govt-forms" && <GovFormsAdminTab />}

        {/* ── ENTERTAINMENT TAB ── */}
        {tab === "entertainment" && <EntertainmentAdminTab />}

        {/* ── ASSAM TOURISM TAB ── */}
        {tab === "assam-tourism" && <AssamTourismAdminTab />}
      </div>
      <GovDocDialog
        open={govDocDialogOpen}
        onClose={() => setGovDocDialogOpen(false)}
        doc={editingGovDoc}
        onSave={(d) => {
          let updated: GovDocAdmin[];
          if (editingGovDoc) {
            updated = govDocs.map((x) => (x.id === d.id ? d : x));
          } else {
            updated = [...govDocs, d];
          }
          setGovDocs(updated);
          saveGovDocs(updated);
          setGovDocDialogOpen(false);
          toast.success(editingGovDoc ? "Document updated" : "Document added");
        }}
      />
      <ProductDialog
        open={productDialogOpen}
        onClose={() => setProductDialogOpen(false)}
        product={editingProduct}
        onSave={(p) => {
          let updated: Product[];
          if (editingProduct) {
            updated = products.map((x) => (x.id === p.id ? p : x));
          } else {
            updated = [...products, p];
          }
          setProducts(updated);
          saveProducts(updated);
          setProductDialogOpen(false);
          toast.success(editingProduct ? "Product updated" : "Product added");
        }}
      />
      <JobDialog
        open={jobDialogOpen}
        onClose={() => setJobDialogOpen(false)}
        job={editingJob}
        onSave={(j) => {
          let updated: Job[];
          if (editingJob) {
            updated = jobs.map((x) => (x.id === j.id ? j : x));
          } else {
            updated = [...jobs, j];
          }
          setJobs(updated);
          saveJobs(updated);
          setJobDialogOpen(false);
          toast.success(editingJob ? "Job updated" : "Job added");
        }}
      />
      <SimpleItemDialog
        open={admitCardDialogOpen}
        onClose={() => setAdmitCardDialogOpen(false)}
        title={editingAdmitCard ? "Edit Admit Card" : "Add Admit Card"}
        item={editingAdmitCard}
        dateLabel="Date / Status"
        datePlaceholder="e.g. Out Now, Expected Soon"
        onSave={(item) => {
          let updated: AdmitCard[];
          if (editingAdmitCard) {
            updated = admitCards.map((x) => (x.id === item.id ? item : x));
          } else {
            updated = [...admitCards, item];
          }
          setAdmitCards(updated);
          saveAdmitCards(updated);
          setAdmitCardDialogOpen(false);
          toast.success(
            editingAdmitCard ? "Admit card updated" : "Admit card added",
          );
        }}
      />
      <SimpleItemDialog
        open={resultDialogOpen}
        onClose={() => setResultDialogOpen(false)}
        title={editingResult ? "Edit Result" : "Add Result"}
        item={editingResult}
        dateLabel="Date / Status"
        datePlaceholder="e.g. Declared, Expected June"
        onSave={(item) => {
          let updated: JobResult[];
          if (editingResult) {
            updated = jobResults.map((x) => (x.id === item.id ? item : x));
          } else {
            updated = [...jobResults, item];
          }
          setJobResults(updated);
          saveResults(updated);
          setResultDialogOpen(false);
          toast.success(editingResult ? "Result updated" : "Result added");
        }}
      />
    </div>
  );
}

// ─── Product Dialog ───────────────────────────────────────────────────────────

interface ProductDialogProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onSave: (p: Product) => void;
}

function ProductDialog({ open, onClose, product, onSave }: ProductDialogProps) {
  const [form, setForm] = useState<Omit<Product, "id"> & { id: string }>({
    id: "",
    name: "",
    description: "",
    price: 0,
    category: "electrical",
    imageUrl: "",
    inStock: true,
  });

  useEffect(() => {
    if (product) {
      setForm({ ...product });
    } else {
      setForm({
        id: "",
        name: "",
        description: "",
        price: 0,
        category: "electrical",
        imageUrl: "",
        inStock: true,
      });
    }
  }, [product]);

  const handleSave = () => {
    if (!form.name || !form.price) {
      toast.error("Name and price are required");
      return;
    }
    const finalId = form.id || `p_${Date.now()}`;
    onSave({ ...form, id: finalId });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add Product"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          <div>
            <Label>Product Name *</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Product name"
              className="mt-1"
              data-ocid="products.input"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Input
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Short description"
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Price (₹) *</Label>
              <Input
                type="number"
                value={form.price || ""}
                onChange={(e) =>
                  setForm({ ...form, price: Number(e.target.value) })
                }
                placeholder="0"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Category</Label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value as Product["category"],
                  })
                }
                className="mt-1 w-full border border-input rounded-md px-3 py-2 text-sm bg-white"
              >
                <option value="electrical">Electrical</option>
                <option value="internet-cafe">Internet Cafe</option>
                <option value="photo-binding">Photo & Binding</option>
              </select>
            </div>
          </div>
          <div>
            <Label>Image URL</Label>
            <Input
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="https://..."
              className="mt-1"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.inStock}
              onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium">In Stock</span>
          </label>
          <Button
            onClick={handleSave}
            className="w-full bg-[#0B2A4A] hover:bg-[#1E88FF] text-white"
            data-ocid="products.submit_button"
          >
            {product ? "Update Product" : "Add Product"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Job Dialog ───────────────────────────────────────────────────────────────

interface JobDialogProps {
  open: boolean;
  onClose: () => void;
  job: Job | null;
  onSave: (j: Job) => void;
}

const BLANK_JOB: Job = {
  id: "",
  title: "",
  org: "",
  category: "Govt Jobs",
  posts: "",
  lastDate: "",
  status: "Active",
  type: "",
  description: "",
  applyLink: "",
};

function JobDialog({ open, onClose, job, onSave }: JobDialogProps) {
  const [form, setForm] = useState<Job>(BLANK_JOB);

  useEffect(() => {
    setForm(job ? { ...job } : { ...BLANK_JOB });
  }, [job]);

  const handleSave = () => {
    if (!form.title || !form.org) {
      toast.error("Title and organisation are required");
      return;
    }
    const finalId = form.id || `j_${Date.now()}`;
    onSave({ ...form, id: finalId });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-lg max-h-[90vh] overflow-y-auto"
        data-ocid="jobs.dialog"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {job ? "Edit Job" : "Add Job Listing"}
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          <div>
            <Label>Job Title *</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. SSC CGL 2025 Recruitment"
              className="mt-1"
              data-ocid="jobs.input"
            />
          </div>
          <div>
            <Label>Organisation *</Label>
            <Input
              value={form.org}
              onChange={(e) => setForm({ ...form, org: e.target.value })}
              placeholder="e.g. Staff Selection Commission"
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Category</Label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="mt-1 w-full border border-input rounded-md px-3 py-2 text-sm bg-white"
                data-ocid="jobs.select"
              >
                {JOB_CATEGORIES_LIST.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Status</Label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value as Job["status"] })
                }
                className="mt-1 w-full border border-input rounded-md px-3 py-2 text-sm bg-white"
              >
                {(
                  ["Active", "Result", "Exam", "Closed"] as Job["status"][]
                ).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>No. of Posts</Label>
              <Input
                value={form.posts}
                onChange={(e) => setForm({ ...form, posts: e.target.value })}
                placeholder="e.g. 1234 Posts"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Last Date</Label>
              <Input
                value={form.lastDate}
                onChange={(e) => setForm({ ...form, lastDate: e.target.value })}
                placeholder="e.g. 31 Jul 2025"
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <Label>Job Type</Label>
            <Input
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              placeholder="e.g. Central Govt, State Govt, Banking Sector"
              className="mt-1"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Brief description of the recruitment..."
              className="mt-1 resize-none"
              rows={3}
            />
          </div>
          <div>
            <Label>Apply Link</Label>
            <Input
              value={form.applyLink}
              onChange={(e) => setForm({ ...form, applyLink: e.target.value })}
              placeholder="https://ssc.gov.in"
              className="mt-1"
            />
          </div>
          <Button
            onClick={handleSave}
            className="w-full bg-[#0B2A4A] hover:bg-[#1E88FF] text-white"
            data-ocid="jobs.submit_button"
          >
            {job ? "Update Job" : "Add Job"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Simple Item Dialog (Admit Card / Result) ─────────────────────────────────

interface SimpleItem {
  id: string;
  title: string;
  date: string;
  link: string;
}

interface SimpleItemDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  item: SimpleItem | null;
  dateLabel: string;
  datePlaceholder: string;
  onSave: (item: SimpleItem) => void;
}

function SimpleItemDialog({
  open,
  onClose,
  title,
  item,
  dateLabel,
  datePlaceholder,
  onSave,
}: SimpleItemDialogProps) {
  const [form, setForm] = useState<SimpleItem>({
    id: "",
    title: "",
    date: "",
    link: "",
  });

  useEffect(() => {
    setForm(item ? { ...item } : { id: "", title: "", date: "", link: "" });
  }, [item]);

  const handleSave = () => {
    if (!form.title) {
      toast.error("Title is required");
      return;
    }
    const finalId = form.id || `item_${Date.now()}`;
    onSave({ ...form, id: finalId });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md" data-ocid="admin.dialog">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          <div>
            <Label>Title *</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. SSC CHSL 2024 Result"
              className="mt-1"
              data-ocid="admin.input"
            />
          </div>
          <div>
            <Label>{dateLabel}</Label>
            <Input
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              placeholder={datePlaceholder}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Link / URL</Label>
            <Input
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              placeholder="https://... or #"
              className="mt-1"
            />
          </div>
          <Button
            onClick={handleSave}
            className="w-full bg-[#0B2A4A] hover:bg-[#1E88FF] text-white"
            data-ocid="admin.submit_button"
          >
            {item ? "Update" : "Add"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Gov Doc Dialog ───────────────────────────────────────────────────────────

interface GovDocDialogProps {
  open: boolean;
  onClose: () => void;
  doc: GovDocAdmin | null;
  onSave: (d: GovDocAdmin) => void;
}

const BLANK_GOV_DOC: GovDocAdmin = {
  id: "",
  title: "",
  subtitle: "",
  description: "",
  category: "",
  hasGuide: false,
  actions: [{ label: "", url: "" }],
};

function GovDocDialog({ open, onClose, doc, onSave }: GovDocDialogProps) {
  const [form, setForm] = useState<GovDocAdmin>(BLANK_GOV_DOC);
  const [actionKeys, setActionKeys] = useState<string[]>(["k0"]);

  useEffect(() => {
    const actions = doc
      ? doc.actions.length > 0
        ? [...doc.actions]
        : [{ label: "", url: "" }]
      : [{ label: "", url: "" }];
    setForm(
      doc ? { ...doc, actions } : { ...BLANK_GOV_DOC, id: `doc-${Date.now()}` },
    );
    setActionKeys(actions.map((_, i) => `k${i}-${Date.now()}`));
  }, [doc]);

  const setAction = (idx: number, field: "label" | "url", value: string) => {
    const updated = form.actions.map((a, i) =>
      i === idx ? { ...a, [field]: value } : a,
    );
    setForm({ ...form, actions: updated });
  };

  const addAction = () => {
    if (form.actions.length < 4) {
      setForm({ ...form, actions: [...form.actions, { label: "", url: "" }] });
      setActionKeys((prev) => [...prev, `k${prev.length}-${Date.now()}`]);
    }
  };

  const removeAction = (idx: number) => {
    setForm({ ...form, actions: form.actions.filter((_, i) => i !== idx) });
    setActionKeys((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    const cleanActions = form.actions.filter(
      (a) => a.label.trim() && a.url.trim(),
    );
    onSave({ ...form, actions: cleanActions });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-lg max-h-[90vh] overflow-y-auto"
        data-ocid="gov_docs.dialog"
      >
        <DialogHeader>
          <DialogTitle>{doc ? "Edit Document" : "Add Document"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          <div>
            <Label>Title *</Label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Aadhaar Card"
              className="mt-1"
              data-ocid="gov_docs.input"
            />
          </div>
          <div>
            <Label>Subtitle / Authority</Label>
            <Input
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              placeholder="e.g. UIDAI"
              className="mt-1"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Short description of this document"
              className="mt-1"
              rows={2}
            />
          </div>
          <div>
            <Label>Category</Label>
            <Input
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="e.g. Identity, Transport, Business"
              className="mt-1"
            />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="hasGuide"
              checked={form.hasGuide}
              onChange={(e) => setForm({ ...form, hasGuide: e.target.checked })}
              className="w-4 h-4 accent-[#0B2A4A]"
              data-ocid="gov_docs.checkbox"
            />
            <Label htmlFor="hasGuide" className="cursor-pointer">
              Has Application Guide
            </Label>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Action Links (max 4)</Label>
              {form.actions.length < 4 && (
                <button
                  type="button"
                  onClick={addAction}
                  className="text-xs text-[#1E88FF] hover:underline"
                >
                  + Add Link
                </button>
              )}
            </div>
            {form.actions.map((action, idx) => (
              <div key={actionKeys[idx] ?? idx} className="flex gap-2 mb-2">
                <Input
                  value={action.label}
                  onChange={(e) => setAction(idx, "label", e.target.value)}
                  placeholder="Label"
                  className="flex-1"
                />
                <Input
                  value={action.url}
                  onChange={(e) => setAction(idx, "url", e.target.value)}
                  placeholder="https://..."
                  className="flex-1"
                />
                {form.actions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAction(idx)}
                    className="text-red-400 hover:text-red-600 flex-shrink-0"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <Button
            onClick={handleSave}
            className="w-full bg-[#0B2A4A] hover:bg-[#1E88FF] text-white"
            data-ocid="gov_docs.submit_button"
          >
            {doc ? "Update Document" : "Add Document"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ══════════════════════════════════════════════════════════
// HOMEPAGE ADMIN TAB
// ══════════════════════════════════════════════════════════

interface HomeService {
  id: string;
  iconKey: string;
  title: string;
  desc: string;
}

interface HomeTestimonial {
  id: string;
  name: string;
  rating: number;
  review: string;
}

interface HomepageSettings {
  heroBannerUrl: string;
  siteLogo: string;
  tributeEnabled: boolean;
  tributePhoto: string;
  announcementVisible: boolean;
  announcementText: string;
  adslotHomepage: string;
  adslotFluid: string;
}

const DEFAULT_HOMEPAGE_SETTINGS: HomepageSettings = {
  heroBannerUrl:
    "/assets/uploads/1774353229398-019d3a15-c257-750f-9a66-8798cd7598e4-1.png",
  siteLogo:
    "/assets/uploads/picsart_26-03-20_17-21-03-596-019d37d3-67cb-70ae-b887-e779e514ed62-1.png",
  tributeEnabled: true,
  tributePhoto: "",
  announcementVisible: false,
  announcementText: "",
  adslotHomepage: "2549132160",
  adslotFluid: "4240548434",
};

const DEFAULT_HOME_SERVICES: HomeService[] = [
  {
    id: "svc-1",
    iconKey: "zap",
    title: "Electrical Solutions",
    desc: "Wide range of quality electrical products and solutions for home and office.",
  },
  {
    id: "svc-2",
    iconKey: "wifi",
    title: "Internet Cafe",
    desc: "High-speed internet, printing, scanning, and computer services.",
  },
  {
    id: "svc-3",
    iconKey: "camera",
    title: "Photo & Binding",
    desc: "Professional photo printing, lamination, and binding services.",
  },
];

const DEFAULT_HOME_TESTIMONIALS: HomeTestimonial[] = [
  {
    id: "t-1",
    name: "Rahul Sharma",
    rating: 5,
    review:
      "Excellent service! Got my documents done quickly and professionally.",
  },
  {
    id: "t-2",
    name: "Priya Singh",
    rating: 5,
    review:
      "Best internet cafe in the area. Fast connection and helpful staff.",
  },
  {
    id: "t-3",
    name: "Amit Kumar",
    rating: 4,
    review:
      "Great products at reasonable prices. Highly recommend for electrical items.",
  },
];

function getIcon(iconKey: string) {
  if (iconKey === "wifi") return <Wifi size={18} />;
  if (iconKey === "camera") return <Camera size={18} />;
  if (iconKey === "monitor") return <Monitor size={18} />;
  if (iconKey === "settings") return <Settings size={18} />;
  return <Zap size={18} />;
}

function HomepageAdminTab() {
  const [settings, setSettings] = useState<HomepageSettings>(() => {
    try {
      return {
        ...DEFAULT_HOMEPAGE_SETTINGS,
        ...JSON.parse(localStorage.getItem("homepageSettings") || "{}"),
      };
    } catch {
      return DEFAULT_HOMEPAGE_SETTINGS;
    }
  });

  const [services, setServices] = useState<HomeService[]>(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("homepageServices") || "null") ||
        DEFAULT_HOME_SERVICES
      );
    } catch {
      return DEFAULT_HOME_SERVICES;
    }
  });

  const [testimonials, setTestimonials] = useState<HomeTestimonial[]>(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("homepageTestimonials") || "null") ||
        DEFAULT_HOME_TESTIMONIALS
      );
    } catch {
      return DEFAULT_HOME_TESTIMONIALS;
    }
  });

  // Service dialog
  const [svcDialogOpen, setSvcDialogOpen] = useState(false);
  const [editingSvc, setEditingSvc] = useState<HomeService | null>(null);
  const [svcForm, setSvcForm] = useState({
    iconKey: "zap",
    title: "",
    desc: "",
  });

  // Testimonial dialog
  const [testimonialDialogOpen, setTestimonialDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] =
    useState<HomeTestimonial | null>(null);
  const [testimonialForm, setTestimonialForm] = useState({
    name: "",
    rating: 5,
    review: "",
  });

  const saveSettings = () => {
    localStorage.setItem("homepageSettings", JSON.stringify(settings));
    toast.success("Homepage settings saved!");
  };

  const saveServices = (updated: HomeService[]) => {
    setServices(updated);
    localStorage.setItem("homepageServices", JSON.stringify(updated));
  };

  const saveTestimonials = (updated: HomeTestimonial[]) => {
    setTestimonials(updated);
    localStorage.setItem("homepageTestimonials", JSON.stringify(updated));
  };

  const openAddSvc = () => {
    setEditingSvc(null);
    setSvcForm({ iconKey: "zap", title: "", desc: "" });
    setSvcDialogOpen(true);
  };

  const openEditSvc = (svc: HomeService) => {
    setEditingSvc(svc);
    setSvcForm({ iconKey: svc.iconKey, title: svc.title, desc: svc.desc });
    setSvcDialogOpen(true);
  };

  const saveSvc = () => {
    if (!svcForm.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (editingSvc) {
      saveServices(
        services.map((s) =>
          s.id === editingSvc.id ? { ...editingSvc, ...svcForm } : s,
        ),
      );
      toast.success("Service updated");
    } else {
      saveServices([...services, { id: `svc-${Date.now()}`, ...svcForm }]);
      toast.success("Service added");
    }
    setSvcDialogOpen(false);
  };

  const deleteSvc = (id: string) => {
    if (!confirm("Delete this service?")) return;
    saveServices(services.filter((s) => s.id !== id));
    toast.success("Service deleted");
  };

  const openAddTestimonial = () => {
    setEditingTestimonial(null);
    setTestimonialForm({ name: "", rating: 5, review: "" });
    setTestimonialDialogOpen(true);
  };

  const openEditTestimonial = (t: HomeTestimonial) => {
    setEditingTestimonial(t);
    setTestimonialForm({ name: t.name, rating: t.rating, review: t.review });
    setTestimonialDialogOpen(true);
  };

  const saveTestimonial = () => {
    if (!testimonialForm.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (editingTestimonial) {
      saveTestimonials(
        testimonials.map((t) =>
          t.id === editingTestimonial.id
            ? { ...editingTestimonial, ...testimonialForm }
            : t,
        ),
      );
      toast.success("Testimonial updated");
    } else {
      saveTestimonials([
        ...testimonials,
        { id: `t-${Date.now()}`, ...testimonialForm },
      ]);
      toast.success("Testimonial added");
    }
    setTestimonialDialogOpen(false);
  };

  const deleteTestimonial = (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    saveTestimonials(testimonials.filter((t) => t.id !== id));
    toast.success("Testimonial deleted");
  };

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Home size={22} className="text-[#1E88FF]" />
        <div>
          <h2 className="text-xl font-bold text-[#0B2A4A]">Homepage Editor</h2>
          <p className="text-sm text-gray-500">
            Manage all homepage content and settings
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Section 1: Hero & Banner */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold text-[#0B2A4A] mb-4 flex items-center gap-2">
            <span className="text-lg">🖼️</span> Hero Banner & Logo
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label className="text-sm font-medium mb-1 block">
                Hero Banner Image URL
              </Label>
              <Input
                value={settings.heroBannerUrl}
                onChange={(e) =>
                  setSettings({ ...settings, heroBannerUrl: e.target.value })
                }
                placeholder="/assets/uploads/banner.png"
                data-ocid="homepage.banner.input"
              />
              {settings.heroBannerUrl && (
                <img
                  src={settings.heroBannerUrl}
                  alt="Banner preview"
                  className="mt-2 rounded-lg w-full object-cover h-24 border border-gray-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
            </div>
            <div>
              <Label className="text-sm font-medium mb-1 block">
                Site Logo URL
              </Label>
              <Input
                value={settings.siteLogo}
                onChange={(e) =>
                  setSettings({ ...settings, siteLogo: e.target.value })
                }
                placeholder="/assets/uploads/logo.png"
                data-ocid="homepage.logo.input"
              />
              {settings.siteLogo && (
                <img
                  src={settings.siteLogo}
                  alt="Logo preview"
                  className="mt-2 h-14 object-contain border border-gray-200 rounded p-1 bg-gray-50"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              )}
            </div>
          </div>
          <Button
            onClick={saveSettings}
            className="bg-[#0B2A4A] hover:bg-[#1E88FF] text-white"
            data-ocid="homepage.settings.save_button"
          >
            <Save size={14} className="mr-1" /> Save Banner & Logo
          </Button>
        </div>

        {/* Section 2: Tribute Popup */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold text-[#0B2A4A] mb-4 flex items-center gap-2">
            <span className="text-lg">🙏</span> Tribute Popup (Zubeen Daa)
          </h3>
          <div className="flex items-center gap-3 mb-4">
            <Switch
              checked={settings.tributeEnabled}
              onCheckedChange={(v) =>
                setSettings({ ...settings, tributeEnabled: v })
              }
              data-ocid="homepage.tribute.switch"
            />
            <Label className="cursor-pointer">
              {settings.tributeEnabled ? "Popup Enabled" : "Popup Disabled"}
            </Label>
          </div>
          {settings.tributeEnabled && (
            <div className="mb-4">
              <Label className="text-sm font-medium mb-1 block">
                Tribute Photo URL (optional override)
              </Label>
              <Input
                value={settings.tributePhoto}
                onChange={(e) =>
                  setSettings({ ...settings, tributePhoto: e.target.value })
                }
                placeholder="Leave blank to use default photo"
                data-ocid="homepage.tribute.input"
              />
            </div>
          )}
          <Button
            onClick={saveSettings}
            className="bg-[#0B2A4A] hover:bg-[#1E88FF] text-white"
            data-ocid="homepage.tribute.save_button"
          >
            <Save size={14} className="mr-1" /> Save Tribute Settings
          </Button>
        </div>

        {/* Section 3: Announcement Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold text-[#0B2A4A] mb-4 flex items-center gap-2">
            <span className="text-lg">📢</span> Announcement Bar
          </h3>
          <div className="flex items-center gap-3 mb-4">
            <Switch
              checked={settings.announcementVisible}
              onCheckedChange={(v) =>
                setSettings({ ...settings, announcementVisible: v })
              }
              data-ocid="homepage.announcement.switch"
            />
            <Label className="cursor-pointer">
              {settings.announcementVisible
                ? "Announcement Visible"
                : "Announcement Hidden"}
            </Label>
          </div>
          {settings.announcementVisible && (
            <div className="mb-4">
              <Label className="text-sm font-medium mb-1 block">
                Announcement Text
              </Label>
              <Textarea
                value={settings.announcementText}
                onChange={(e) =>
                  setSettings({ ...settings, announcementText: e.target.value })
                }
                placeholder="Enter your announcement here..."
                rows={2}
                data-ocid="homepage.announcement.textarea"
              />
            </div>
          )}
          <Button
            onClick={saveSettings}
            className="bg-[#0B2A4A] hover:bg-[#1E88FF] text-white"
            data-ocid="homepage.announcement.save_button"
          >
            <Save size={14} className="mr-1" /> Save Announcement
          </Button>
        </div>

        {/* Section 4: AdSense Slots */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold text-[#0B2A4A] mb-4 flex items-center gap-2">
            <span className="text-lg">💰</span> AdSense Slot IDs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label className="text-sm font-medium mb-1 block">
                Homepage Banner Slot ID
              </Label>
              <Input
                value={settings.adslotHomepage}
                onChange={(e) =>
                  setSettings({ ...settings, adslotHomepage: e.target.value })
                }
                placeholder="e.g. 2549132160"
                data-ocid="homepage.adsense.banner.input"
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-1 block">
                Homepage Fluid/In-feed Slot ID
              </Label>
              <Input
                value={settings.adslotFluid}
                onChange={(e) =>
                  setSettings({ ...settings, adslotFluid: e.target.value })
                }
                placeholder="e.g. 4240548434"
                data-ocid="homepage.adsense.fluid.input"
              />
            </div>
          </div>
          <Button
            onClick={saveSettings}
            className="bg-[#0B2A4A] hover:bg-[#1E88FF] text-white"
            data-ocid="homepage.adsense.save_button"
          >
            <Save size={14} className="mr-1" /> Save AdSense Settings
          </Button>
        </div>

        {/* Section 5: Services CRUD */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#0B2A4A] flex items-center gap-2">
              <span className="text-lg">⚙️</span> Services
            </h3>
            <Button
              onClick={openAddSvc}
              size="sm"
              className="bg-[#0B2A4A] hover:bg-[#1E88FF] text-white"
              data-ocid="homepage.services.open_modal_button"
            >
              <Plus size={14} className="mr-1" /> Add Service
            </Button>
          </div>
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-[#0B2A4A]">
                    Icon
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-[#0B2A4A]">
                    Title
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-[#0B2A4A] hidden md:table-cell">
                    Description
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-[#0B2A4A]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {services.map((svc, i) => (
                  <tr
                    key={svc.id}
                    className="border-b border-gray-100 last:border-0"
                    data-ocid={`homepage.services.item.${i + 1}`}
                  >
                    <td className="px-4 py-3 text-[#1E88FF]">
                      {getIcon(svc.iconKey)}
                    </td>
                    <td className="px-4 py-3 font-medium text-[#0B2A4A]">
                      {svc.title}
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell line-clamp-1">
                      {svc.desc}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => openEditSvc(svc)}
                          className="text-blue-500 hover:text-blue-700 p-1"
                          data-ocid={`homepage.services.edit_button.${i + 1}`}
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteSvc(svc.id)}
                          className="text-red-400 hover:text-red-600 p-1"
                          data-ocid={`homepage.services.delete_button.${i + 1}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {services.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center text-gray-400 py-6"
                      data-ocid="homepage.services.empty_state"
                    >
                      No services yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 6: Testimonials CRUD */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#0B2A4A] flex items-center gap-2">
              <span className="text-lg">⭐</span> Customer Testimonials
            </h3>
            <Button
              onClick={openAddTestimonial}
              size="sm"
              className="bg-[#0B2A4A] hover:bg-[#1E88FF] text-white"
              data-ocid="homepage.testimonials.open_modal_button"
            >
              <Plus size={14} className="mr-1" /> Add Review
            </Button>
          </div>
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-[#0B2A4A]">
                    Name
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-[#0B2A4A]">
                    Rating
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-[#0B2A4A] hidden md:table-cell">
                    Review
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-[#0B2A4A]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {testimonials.map((t, i) => (
                  <tr
                    key={t.id}
                    className="border-b border-gray-100 last:border-0"
                    data-ocid={`homepage.testimonials.item.${i + 1}`}
                  >
                    <td className="px-4 py-3 font-medium text-[#0B2A4A]">
                      {t.name}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-0.5">
                        {Array.from({ length: t.rating }, (_, idx) => (
                          <Star
                            key={`star-${t.id}-${idx}`}
                            size={13}
                            className="text-yellow-400 fill-yellow-400"
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell line-clamp-1">
                      {t.review}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => openEditTestimonial(t)}
                          className="text-blue-500 hover:text-blue-700 p-1"
                          data-ocid={`homepage.testimonials.edit_button.${i + 1}`}
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteTestimonial(t.id)}
                          className="text-red-400 hover:text-red-600 p-1"
                          data-ocid={`homepage.testimonials.delete_button.${i + 1}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {testimonials.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center text-gray-400 py-6"
                      data-ocid="homepage.testimonials.empty_state"
                    >
                      No testimonials yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Service Dialog */}
      <Dialog open={svcDialogOpen} onOpenChange={setSvcDialogOpen}>
        <DialogContent
          className="max-w-md"
          data-ocid="homepage.services.dialog"
        >
          <DialogHeader>
            <DialogTitle>
              {editingSvc ? "Edit Service" : "Add Service"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="mb-1 block">Icon Key</Label>
              <select
                value={svcForm.iconKey}
                onChange={(e) =>
                  setSvcForm({ ...svcForm, iconKey: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E88FF]"
                data-ocid="homepage.services.select"
              >
                <option value="zap">⚡ Zap (Electrical)</option>
                <option value="wifi">📶 Wifi (Internet)</option>
                <option value="camera">📷 Camera (Photo)</option>
                <option value="monitor">🖥️ Monitor (Computer)</option>
                <option value="settings">⚙️ Settings (General)</option>
              </select>
            </div>
            <div>
              <Label className="mb-1 block">Title *</Label>
              <Input
                value={svcForm.title}
                onChange={(e) =>
                  setSvcForm({ ...svcForm, title: e.target.value })
                }
                placeholder="Service title"
                data-ocid="homepage.services.title.input"
              />
            </div>
            <div>
              <Label className="mb-1 block">Description</Label>
              <Textarea
                value={svcForm.desc}
                onChange={(e) =>
                  setSvcForm({ ...svcForm, desc: e.target.value })
                }
                placeholder="Service description"
                rows={3}
                data-ocid="homepage.services.desc.textarea"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setSvcDialogOpen(false)}
                data-ocid="homepage.services.cancel_button"
              >
                Cancel
              </Button>
              <Button
                onClick={saveSvc}
                className="bg-[#0B2A4A] hover:bg-[#1E88FF] text-white"
                data-ocid="homepage.services.submit_button"
              >
                {editingSvc ? "Update" : "Add"} Service
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Testimonial Dialog */}
      <Dialog
        open={testimonialDialogOpen}
        onOpenChange={setTestimonialDialogOpen}
      >
        <DialogContent
          className="max-w-md"
          data-ocid="homepage.testimonials.dialog"
        >
          <DialogHeader>
            <DialogTitle>
              {editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="mb-1 block">Customer Name *</Label>
              <Input
                value={testimonialForm.name}
                onChange={(e) =>
                  setTestimonialForm({
                    ...testimonialForm,
                    name: e.target.value,
                  })
                }
                placeholder="e.g. Rahul Sharma"
                data-ocid="homepage.testimonials.name.input"
              />
            </div>
            <div>
              <Label className="mb-1 block">Rating (1–5)</Label>
              <Input
                type="number"
                min={1}
                max={5}
                value={testimonialForm.rating}
                onChange={(e) =>
                  setTestimonialForm({
                    ...testimonialForm,
                    rating: Math.min(5, Math.max(1, Number(e.target.value))),
                  })
                }
                data-ocid="homepage.testimonials.rating.input"
              />
            </div>
            <div>
              <Label className="mb-1 block">Review Text</Label>
              <Textarea
                value={testimonialForm.review}
                onChange={(e) =>
                  setTestimonialForm({
                    ...testimonialForm,
                    review: e.target.value,
                  })
                }
                placeholder="Customer review..."
                rows={3}
                data-ocid="homepage.testimonials.review.textarea"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setTestimonialDialogOpen(false)}
                data-ocid="homepage.testimonials.cancel_button"
              >
                Cancel
              </Button>
              <Button
                onClick={saveTestimonial}
                className="bg-[#0B2A4A] hover:bg-[#1E88FF] text-white"
                data-ocid="homepage.testimonials.submit_button"
              >
                {editingTestimonial ? "Update" : "Add"} Testimonial
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// PAN CARD ADMIN TAB
// ══════════════════════════════════════════════════════════

interface PanHeroText {
  title: string;
  subtitle: string;
}

interface PanService {
  id: string;
  title: string;
  desc: string;
  fee: string;
  badge: string;
}

interface PanFaq {
  id: string;
  q: string;
  a: string;
}

interface PanFeeRow {
  id: string;
  service: string;
  indian: string;
  foreign: string;
  notes: string;
}

interface PanLink {
  id: string;
  title: string;
  sub: string;
  url: string;
}

const DEFAULT_PAN_HERO: PanHeroText = {
  title: "PAN Card Services",
  subtitle: "Government of India — Income Tax Department",
};

const DEFAULT_PAN_SERVICES: PanService[] = [
  {
    id: "apply-49a",
    title: "Apply New PAN (Form 49A)",
    desc: "For Indian citizens...",
    fee: "₹107",
    badge: "Indian Citizens",
  },
  {
    id: "apply-49aa",
    title: "Apply New PAN (Form 49AA)",
    desc: "For foreign nationals/NRIs...",
    fee: "₹1,017",
    badge: "Foreign Nationals",
  },
  {
    id: "correction",
    title: "PAN Correction / Update",
    desc: "Update name, DOB...",
    fee: "₹110",
    badge: "",
  },
  {
    id: "reprint",
    title: "Reprint PAN Card",
    desc: "Lost or damaged card...",
    fee: "₹50",
    badge: "",
  },
  {
    id: "know-pan",
    title: "Know Your PAN",
    desc: "Find your PAN number...",
    fee: "Free",
    badge: "",
  },
  {
    id: "track",
    title: "Track Application Status",
    desc: "Check status of your application...",
    fee: "Free",
    badge: "",
  },
  {
    id: "link-aadhaar",
    title: "Link PAN with Aadhaar",
    desc: "Mandatory linking...",
    fee: "₹1,000",
    badge: "Mandatory",
  },
  {
    id: "epan",
    title: "Download e-PAN",
    desc: "Download digital PAN...",
    fee: "Free (30 days)",
    badge: "",
  },
];

const DEFAULT_PAN_FAQS: PanFaq[] = [
  {
    id: "faq-1",
    q: "What is a PAN Card?",
    a: "PAN (Permanent Account Number) is a 10-digit alphanumeric identifier issued by the Income Tax Department of India.",
  },
  {
    id: "faq-2",
    q: "Who needs a PAN Card?",
    a: "Anyone liable to pay income tax, or conducting financial transactions above prescribed limits.",
  },
  {
    id: "faq-3",
    q: "What is the validity of a PAN Card?",
    a: "A PAN Card is valid for a lifetime and does not expire.",
  },
  {
    id: "faq-4",
    q: "How long does it take to get a PAN Card?",
    a: "Physical PAN card takes 15-20 working days. e-PAN is available within 30 minutes to 2 hours.",
  },
  {
    id: "faq-5",
    q: "What documents are required for a new PAN Card?",
    a: "Proof of Identity (Aadhaar, Passport, Voter ID), Proof of Address, Proof of Date of Birth, and 2 passport-size photos.",
  },
  {
    id: "faq-6",
    q: "Can I have two PAN Cards?",
    a: "No. Having more than one PAN is illegal and subject to penalty of ₹10,000 under Section 272B.",
  },
  {
    id: "faq-7",
    q: "Is linking PAN with Aadhaar mandatory?",
    a: "Yes, linking PAN with Aadhaar is mandatory. PAN becomes inoperative if not linked by the due date.",
  },
];

const DEFAULT_PAN_FEE_TABLE: PanFeeRow[] = [
  {
    id: "fee-1",
    service: "New PAN (Form 49A)",
    indian: "₹107",
    foreign: "₹1,017",
    notes: "Includes GST + dispatch charges",
  },
  {
    id: "fee-2",
    service: "New PAN (Form 49AA)",
    indian: "₹107",
    foreign: "₹1,017",
    notes: "For foreign nationals/NRIs",
  },
  {
    id: "fee-3",
    service: "PAN Correction/Update",
    indian: "₹110",
    foreign: "₹1,020",
    notes: "Change in name, DOB, address",
  },
  {
    id: "fee-4",
    service: "Reprint PAN Card",
    indian: "₹50",
    foreign: "₹959",
    notes: "Lost/damaged card replacement",
  },
  {
    id: "fee-5",
    service: "e-PAN Download",
    indian: "Free",
    foreign: "Free",
    notes: "Within 30 days of allotment",
  },
  {
    id: "fee-6",
    service: "PAN-Aadhaar Link",
    indian: "₹1,000",
    foreign: "₹1,000",
    notes: "Late fee applicable",
  },
];

const DEFAULT_PAN_LINKS: PanLink[] = [
  {
    id: "link-1",
    title: "NSDL PAN Portal",
    sub: "onlineservices.nsdl.com",
    url: "https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html",
  },
  {
    id: "link-2",
    title: "UTIITSL PAN Portal",
    sub: "utiitsl.com",
    url: "https://www.utiitsl.com/UTIITSL_SITE/pan/",
  },
  {
    id: "link-3",
    title: "Income Tax e-Filing",
    sub: "incometax.gov.in",
    url: "https://www.incometax.gov.in/iec/foportal/",
  },
  {
    id: "link-4",
    title: "PAN-Aadhaar Link Status",
    sub: "eportal.incometax.gov.in",
    url: "https://eportal.incometax.gov.in/iec/foservices/#/pre-login/bl-link-aadhaar-with-pan",
  },
];

function PanCardAdminTab() {
  const [heroText, setHeroText] = useState<PanHeroText>(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("panHeroText") || "null") ||
        DEFAULT_PAN_HERO
      );
    } catch {
      return DEFAULT_PAN_HERO;
    }
  });

  const [services, setServices] = useState<PanService[]>(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("panServices") || "null") ||
        DEFAULT_PAN_SERVICES
      );
    } catch {
      return DEFAULT_PAN_SERVICES;
    }
  });

  const [faqs, setFaqs] = useState<PanFaq[]>(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("panFaqs") || "null") ||
        DEFAULT_PAN_FAQS
      );
    } catch {
      return DEFAULT_PAN_FAQS;
    }
  });

  const [feeTable, setFeeTable] = useState<PanFeeRow[]>(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("panFeeTable") || "null") ||
        DEFAULT_PAN_FEE_TABLE
      );
    } catch {
      return DEFAULT_PAN_FEE_TABLE;
    }
  });

  const [links, setLinks] = useState<PanLink[]>(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("panLinks") || "null") ||
        DEFAULT_PAN_LINKS
      );
    } catch {
      return DEFAULT_PAN_LINKS;
    }
  });

  // Dialog states
  const [svcDialog, setSvcDialog] = useState(false);
  const [editingSvc, setEditingSvc] = useState<PanService | null>(null);
  const [svcForm, setSvcForm] = useState<Omit<PanService, "id">>({
    title: "",
    desc: "",
    fee: "",
    badge: "",
  });

  const [faqDialog, setFaqDialog] = useState(false);
  const [editingFaq, setEditingFaq] = useState<PanFaq | null>(null);
  const [faqForm, setFaqForm] = useState({ q: "", a: "" });

  const [feeDialog, setFeeDialog] = useState(false);
  const [editingFee, setEditingFee] = useState<PanFeeRow | null>(null);
  const [feeForm, setFeeForm] = useState({
    service: "",
    indian: "",
    foreign: "",
    notes: "",
  });

  const [linkDialog, setLinkDialog] = useState(false);
  const [editingLink, setEditingLink] = useState<PanLink | null>(null);
  const [linkForm, setLinkForm] = useState({ title: "", sub: "", url: "" });

  const saveHero = () => {
    localStorage.setItem("panHeroText", JSON.stringify(heroText));
    toast.success("PAN portal hero text saved!");
  };

  // Service CRUD
  const saveSvc = () => {
    if (!svcForm.title.trim()) {
      toast.error("Title required");
      return;
    }
    let updated: PanService[];
    if (editingSvc) {
      updated = services.map((s) =>
        s.id === editingSvc.id ? { ...editingSvc, ...svcForm } : s,
      );
      toast.success("Service updated");
    } else {
      updated = [...services, { id: `svc-${Date.now()}`, ...svcForm }];
      toast.success("Service added");
    }
    setServices(updated);
    localStorage.setItem("panServices", JSON.stringify(updated));
    setSvcDialog(false);
  };

  const deleteSvc = (id: string) => {
    if (!confirm("Delete this service?")) return;
    const updated = services.filter((s) => s.id !== id);
    setServices(updated);
    localStorage.setItem("panServices", JSON.stringify(updated));
    toast.success("Service deleted");
  };

  // FAQ CRUD
  const saveFaq = () => {
    if (!faqForm.q.trim()) {
      toast.error("Question required");
      return;
    }
    let updated: PanFaq[];
    if (editingFaq) {
      updated = faqs.map((f) =>
        f.id === editingFaq.id ? { ...editingFaq, ...faqForm } : f,
      );
      toast.success("FAQ updated");
    } else {
      updated = [...faqs, { id: `faq-${Date.now()}`, ...faqForm }];
      toast.success("FAQ added");
    }
    setFaqs(updated);
    localStorage.setItem("panFaqs", JSON.stringify(updated));
    setFaqDialog(false);
  };

  const deleteFaq = (id: string) => {
    if (!confirm("Delete this FAQ?")) return;
    const updated = faqs.filter((f) => f.id !== id);
    setFaqs(updated);
    localStorage.setItem("panFaqs", JSON.stringify(updated));
    toast.success("FAQ deleted");
  };

  // Fee CRUD
  const saveFee = () => {
    if (!feeForm.service.trim()) {
      toast.error("Service name required");
      return;
    }
    let updated: PanFeeRow[];
    if (editingFee) {
      updated = feeTable.map((f) =>
        f.id === editingFee.id ? { ...editingFee, ...feeForm } : f,
      );
      toast.success("Fee row updated");
    } else {
      updated = [...feeTable, { id: `fee-${Date.now()}`, ...feeForm }];
      toast.success("Fee row added");
    }
    setFeeTable(updated);
    localStorage.setItem("panFeeTable", JSON.stringify(updated));
    setFeeDialog(false);
  };

  const deleteFee = (id: string) => {
    if (!confirm("Delete this fee row?")) return;
    const updated = feeTable.filter((f) => f.id !== id);
    setFeeTable(updated);
    localStorage.setItem("panFeeTable", JSON.stringify(updated));
    toast.success("Fee row deleted");
  };

  // Link CRUD
  const saveLink = () => {
    if (!linkForm.title.trim()) {
      toast.error("Title required");
      return;
    }
    let updated: PanLink[];
    if (editingLink) {
      updated = links.map((l) =>
        l.id === editingLink.id ? { ...editingLink, ...linkForm } : l,
      );
      toast.success("Link updated");
    } else {
      updated = [...links, { id: `link-${Date.now()}`, ...linkForm }];
      toast.success("Link added");
    }
    setLinks(updated);
    localStorage.setItem("panLinks", JSON.stringify(updated));
    setLinkDialog(false);
  };

  const deleteLink = (id: string) => {
    if (!confirm("Delete this link?")) return;
    const updated = links.filter((l) => l.id !== id);
    setLinks(updated);
    localStorage.setItem("panLinks", JSON.stringify(updated));
    toast.success("Link deleted");
  };

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <CreditCard size={22} className="text-[#1E88FF]" />
        <div>
          <h2 className="text-xl font-bold text-[#0B2A4A]">
            PAN Card Portal Editor
          </h2>
          <p className="text-sm text-gray-500">
            Manage PAN Card portal content, services, fees and FAQs
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Section 1: Hero Text */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold text-[#0B2A4A] mb-4 flex items-center gap-2">
            <span className="text-lg">🏛️</span> Hero Section Text
          </h3>
          <div className="space-y-3 mb-4">
            <div>
              <Label className="mb-1 block">Page Title</Label>
              <Input
                value={heroText.title}
                onChange={(e) =>
                  setHeroText({ ...heroText, title: e.target.value })
                }
                placeholder="PAN Card Services"
                data-ocid="pan.hero.title.input"
              />
            </div>
            <div>
              <Label className="mb-1 block">Page Subtitle / Description</Label>
              <Input
                value={heroText.subtitle}
                onChange={(e) =>
                  setHeroText({ ...heroText, subtitle: e.target.value })
                }
                placeholder="Government of India — Income Tax Department"
                data-ocid="pan.hero.subtitle.input"
              />
            </div>
          </div>
          <Button
            onClick={saveHero}
            className="bg-[#0B2A4A] hover:bg-[#1E88FF] text-white"
            data-ocid="pan.hero.save_button"
          >
            <Save size={14} className="mr-1" /> Save Hero Text
          </Button>
        </div>

        {/* Section 2: Services CRUD */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#0B2A4A] flex items-center gap-2">
              <span className="text-lg">🃏</span> Services
            </h3>
            <Button
              size="sm"
              className="bg-[#0B2A4A] hover:bg-[#1E88FF] text-white"
              onClick={() => {
                setEditingSvc(null);
                setSvcForm({ title: "", desc: "", fee: "", badge: "" });
                setSvcDialog(true);
              }}
              data-ocid="pan.services.open_modal_button"
            >
              <Plus size={14} className="mr-1" /> Add Service
            </Button>
          </div>
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-[#0B2A4A]">
                    Title
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-[#0B2A4A]">
                    Fee
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-[#0B2A4A] hidden md:table-cell">
                    Badge
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-[#0B2A4A]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {services.map((svc, i) => (
                  <tr
                    key={svc.id}
                    className="border-b border-gray-100 last:border-0"
                    data-ocid={`pan.services.item.${i + 1}`}
                  >
                    <td className="px-4 py-3 font-medium text-[#0B2A4A]">
                      {svc.title}
                    </td>
                    <td className="px-4 py-3 text-green-700 font-semibold">
                      {svc.fee}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {svc.badge && (
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                          {svc.badge}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingSvc(svc);
                            setSvcForm({
                              title: svc.title,
                              desc: svc.desc,
                              fee: svc.fee,
                              badge: svc.badge,
                            });
                            setSvcDialog(true);
                          }}
                          className="text-blue-500 hover:text-blue-700 p-1"
                          data-ocid={`pan.services.edit_button.${i + 1}`}
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteSvc(svc.id)}
                          className="text-red-400 hover:text-red-600 p-1"
                          data-ocid={`pan.services.delete_button.${i + 1}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {services.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center text-gray-400 py-6"
                      data-ocid="pan.services.empty_state"
                    >
                      No services yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: FAQ CRUD */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#0B2A4A] flex items-center gap-2">
              <span className="text-lg">❓</span> FAQ
            </h3>
            <Button
              size="sm"
              className="bg-[#0B2A4A] hover:bg-[#1E88FF] text-white"
              onClick={() => {
                setEditingFaq(null);
                setFaqForm({ q: "", a: "" });
                setFaqDialog(true);
              }}
              data-ocid="pan.faq.open_modal_button"
            >
              <Plus size={14} className="mr-1" /> Add FAQ
            </Button>
          </div>
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-[#0B2A4A]">
                    #
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-[#0B2A4A]">
                    Question
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-[#0B2A4A]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {faqs.map((faq, i) => (
                  <tr
                    key={faq.id}
                    className="border-b border-gray-100 last:border-0"
                    data-ocid={`pan.faq.item.${i + 1}`}
                  >
                    <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                    <td className="px-4 py-3 text-[#0B2A4A]">{faq.q}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingFaq(faq);
                            setFaqForm({ q: faq.q, a: faq.a });
                            setFaqDialog(true);
                          }}
                          className="text-blue-500 hover:text-blue-700 p-1"
                          data-ocid={`pan.faq.edit_button.${i + 1}`}
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteFaq(faq.id)}
                          className="text-red-400 hover:text-red-600 p-1"
                          data-ocid={`pan.faq.delete_button.${i + 1}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {faqs.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="text-center text-gray-400 py-6"
                      data-ocid="pan.faq.empty_state"
                    >
                      No FAQs yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: Fee Table CRUD */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#0B2A4A] flex items-center gap-2">
              <span className="text-lg">💳</span> Fee Table
            </h3>
            <Button
              size="sm"
              className="bg-[#0B2A4A] hover:bg-[#1E88FF] text-white"
              onClick={() => {
                setEditingFee(null);
                setFeeForm({ service: "", indian: "", foreign: "", notes: "" });
                setFeeDialog(true);
              }}
              data-ocid="pan.fees.open_modal_button"
            >
              <Plus size={14} className="mr-1" /> Add Fee Row
            </Button>
          </div>
          <div className="rounded-lg border border-gray-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-[#0B2A4A]">
                    Service
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-[#0B2A4A]">
                    Indian
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-[#0B2A4A]">
                    Foreign
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-[#0B2A4A] hidden md:table-cell">
                    Notes
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-[#0B2A4A]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {feeTable.map((fee, i) => (
                  <tr
                    key={fee.id}
                    className="border-b border-gray-100 last:border-0"
                    data-ocid={`pan.fees.item.${i + 1}`}
                  >
                    <td className="px-4 py-3 font-medium text-[#0B2A4A]">
                      {fee.service}
                    </td>
                    <td className="px-4 py-3 text-green-700 font-semibold">
                      {fee.indian}
                    </td>
                    <td className="px-4 py-3 text-blue-700 font-semibold">
                      {fee.foreign}
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                      {fee.notes}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingFee(fee);
                            setFeeForm({
                              service: fee.service,
                              indian: fee.indian,
                              foreign: fee.foreign,
                              notes: fee.notes,
                            });
                            setFeeDialog(true);
                          }}
                          className="text-blue-500 hover:text-blue-700 p-1"
                          data-ocid={`pan.fees.edit_button.${i + 1}`}
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteFee(fee.id)}
                          className="text-red-400 hover:text-red-600 p-1"
                          data-ocid={`pan.fees.delete_button.${i + 1}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {feeTable.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center text-gray-400 py-6"
                      data-ocid="pan.fees.empty_state"
                    >
                      No fee rows yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 5: Official Links CRUD */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#0B2A4A] flex items-center gap-2">
              <span className="text-lg">🔗</span> Official Links
            </h3>
            <Button
              size="sm"
              className="bg-[#0B2A4A] hover:bg-[#1E88FF] text-white"
              onClick={() => {
                setEditingLink(null);
                setLinkForm({ title: "", sub: "", url: "" });
                setLinkDialog(true);
              }}
              data-ocid="pan.links.open_modal_button"
            >
              <Plus size={14} className="mr-1" /> Add Link
            </Button>
          </div>
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-[#0B2A4A]">
                    Title
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-[#0B2A4A] hidden md:table-cell">
                    Subtitle
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-[#0B2A4A] hidden md:table-cell">
                    URL
                  </th>
                  <th className="text-right px-4 py-3 font-semibold text-[#0B2A4A]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {links.map((link, i) => (
                  <tr
                    key={link.id}
                    className="border-b border-gray-100 last:border-0"
                    data-ocid={`pan.links.item.${i + 1}`}
                  >
                    <td className="px-4 py-3 font-medium text-[#0B2A4A]">
                      {link.title}
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                      {link.sub}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline text-xs truncate block max-w-[200px]"
                      >
                        {link.url}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingLink(link);
                            setLinkForm({
                              title: link.title,
                              sub: link.sub,
                              url: link.url,
                            });
                            setLinkDialog(true);
                          }}
                          className="text-blue-500 hover:text-blue-700 p-1"
                          data-ocid={`pan.links.edit_button.${i + 1}`}
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteLink(link.id)}
                          className="text-red-400 hover:text-red-600 p-1"
                          data-ocid={`pan.links.delete_button.${i + 1}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {links.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center text-gray-400 py-6"
                      data-ocid="pan.links.empty_state"
                    >
                      No links yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Service Dialog */}
      <Dialog open={svcDialog} onOpenChange={setSvcDialog}>
        <DialogContent className="max-w-md" data-ocid="pan.services.dialog">
          <DialogHeader>
            <DialogTitle>
              {editingSvc ? "Edit Service" : "Add Service"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="mb-1 block">Title *</Label>
              <Input
                value={svcForm.title}
                onChange={(e) =>
                  setSvcForm({ ...svcForm, title: e.target.value })
                }
                placeholder="Service title"
                data-ocid="pan.services.title.input"
              />
            </div>
            <div>
              <Label className="mb-1 block">Description</Label>
              <Textarea
                value={svcForm.desc}
                onChange={(e) =>
                  setSvcForm({ ...svcForm, desc: e.target.value })
                }
                placeholder="Short description"
                rows={2}
                data-ocid="pan.services.desc.textarea"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="mb-1 block">Fee</Label>
                <Input
                  value={svcForm.fee}
                  onChange={(e) =>
                    setSvcForm({ ...svcForm, fee: e.target.value })
                  }
                  placeholder="e.g. ₹107 or Free"
                  data-ocid="pan.services.fee.input"
                />
              </div>
              <div>
                <Label className="mb-1 block">Badge (optional)</Label>
                <Input
                  value={svcForm.badge}
                  onChange={(e) =>
                    setSvcForm({ ...svcForm, badge: e.target.value })
                  }
                  placeholder="e.g. Mandatory"
                  data-ocid="pan.services.badge.input"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button
                variant="outline"
                onClick={() => setSvcDialog(false)}
                data-ocid="pan.services.cancel_button"
              >
                Cancel
              </Button>
              <Button
                onClick={saveSvc}
                className="bg-[#0B2A4A] hover:bg-[#1E88FF] text-white"
                data-ocid="pan.services.submit_button"
              >
                {editingSvc ? "Update" : "Add"} Service
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* FAQ Dialog */}
      <Dialog open={faqDialog} onOpenChange={setFaqDialog}>
        <DialogContent className="max-w-md" data-ocid="pan.faq.dialog">
          <DialogHeader>
            <DialogTitle>{editingFaq ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="mb-1 block">Question *</Label>
              <Input
                value={faqForm.q}
                onChange={(e) => setFaqForm({ ...faqForm, q: e.target.value })}
                placeholder="FAQ question"
                data-ocid="pan.faq.question.input"
              />
            </div>
            <div>
              <Label className="mb-1 block">Answer</Label>
              <Textarea
                value={faqForm.a}
                onChange={(e) => setFaqForm({ ...faqForm, a: e.target.value })}
                placeholder="Detailed answer..."
                rows={4}
                data-ocid="pan.faq.answer.textarea"
              />
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button
                variant="outline"
                onClick={() => setFaqDialog(false)}
                data-ocid="pan.faq.cancel_button"
              >
                Cancel
              </Button>
              <Button
                onClick={saveFaq}
                className="bg-[#0B2A4A] hover:bg-[#1E88FF] text-white"
                data-ocid="pan.faq.submit_button"
              >
                {editingFaq ? "Update" : "Add"} FAQ
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Fee Dialog */}
      <Dialog open={feeDialog} onOpenChange={setFeeDialog}>
        <DialogContent className="max-w-md" data-ocid="pan.fees.dialog">
          <DialogHeader>
            <DialogTitle>
              {editingFee ? "Edit Fee Row" : "Add Fee Row"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="mb-1 block">Service Name *</Label>
              <Input
                value={feeForm.service}
                onChange={(e) =>
                  setFeeForm({ ...feeForm, service: e.target.value })
                }
                placeholder="e.g. New PAN (Form 49A)"
                data-ocid="pan.fees.service.input"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="mb-1 block">Indian Address Fee</Label>
                <Input
                  value={feeForm.indian}
                  onChange={(e) =>
                    setFeeForm({ ...feeForm, indian: e.target.value })
                  }
                  placeholder="e.g. ₹107"
                  data-ocid="pan.fees.indian.input"
                />
              </div>
              <div>
                <Label className="mb-1 block">Foreign Address Fee</Label>
                <Input
                  value={feeForm.foreign}
                  onChange={(e) =>
                    setFeeForm({ ...feeForm, foreign: e.target.value })
                  }
                  placeholder="e.g. ₹1,017"
                  data-ocid="pan.fees.foreign.input"
                />
              </div>
            </div>
            <div>
              <Label className="mb-1 block">Notes</Label>
              <Input
                value={feeForm.notes}
                onChange={(e) =>
                  setFeeForm({ ...feeForm, notes: e.target.value })
                }
                placeholder="Additional notes"
                data-ocid="pan.fees.notes.input"
              />
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button
                variant="outline"
                onClick={() => setFeeDialog(false)}
                data-ocid="pan.fees.cancel_button"
              >
                Cancel
              </Button>
              <Button
                onClick={saveFee}
                className="bg-[#0B2A4A] hover:bg-[#1E88FF] text-white"
                data-ocid="pan.fees.submit_button"
              >
                {editingFee ? "Update" : "Add"} Fee Row
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Link Dialog */}
      <Dialog open={linkDialog} onOpenChange={setLinkDialog}>
        <DialogContent className="max-w-md" data-ocid="pan.links.dialog">
          <DialogHeader>
            <DialogTitle>{editingLink ? "Edit Link" : "Add Link"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="mb-1 block">Title *</Label>
              <Input
                value={linkForm.title}
                onChange={(e) =>
                  setLinkForm({ ...linkForm, title: e.target.value })
                }
                placeholder="e.g. NSDL PAN Portal"
                data-ocid="pan.links.title.input"
              />
            </div>
            <div>
              <Label className="mb-1 block">Subtitle (domain)</Label>
              <Input
                value={linkForm.sub}
                onChange={(e) =>
                  setLinkForm({ ...linkForm, sub: e.target.value })
                }
                placeholder="e.g. onlineservices.nsdl.com"
                data-ocid="pan.links.subtitle.input"
              />
            </div>
            <div>
              <Label className="mb-1 block">URL</Label>
              <Input
                value={linkForm.url}
                onChange={(e) =>
                  setLinkForm({ ...linkForm, url: e.target.value })
                }
                placeholder="https://..."
                data-ocid="pan.links.url.input"
              />
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button
                variant="outline"
                onClick={() => setLinkDialog(false)}
                data-ocid="pan.links.cancel_button"
              >
                Cancel
              </Button>
              <Button
                onClick={saveLink}
                className="bg-[#0B2A4A] hover:bg-[#1E88FF] text-white"
                data-ocid="pan.links.submit_button"
              >
                {editingLink ? "Update" : "Add"} Link
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── GOVT FORMS ADMIN TAB ────────────────────────────────────────────────────

interface GovFormAdmin {
  id: string;
  title: string;
  category: string;
  description: string;
  language: string;
  pdfUrl: string;
  fileSize?: string;
}

const GOV_FORM_CATEGORIES = [
  "PAN Card",
  "Aadhaar",
  "Assam edistrict",
  "Passport",
  "Voter ID",
  "Driving Licence",
  "Income Tax",
  "Ration Card",
  "RTI",
];

const LANG_OPTIONS = ["English", "Assamese", "Hindi", "Bilingual"];

const LS_KEY = "govFormsLibrary";

function loadForms(): GovFormAdmin[] {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveForms(forms: GovFormAdmin[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(forms));
}

function GovFormsAdminTab() {
  const [forms, setForms] = useState<GovFormAdmin[]>(loadForms);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<GovFormAdmin | null>(null);
  const emptyForm: GovFormAdmin = {
    id: "",
    title: "",
    category: "PAN Card",
    description: "",
    language: "English",
    pdfUrl: "",
    fileSize: "",
  };
  const [form, setForm] = useState<GovFormAdmin>(emptyForm);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyForm, id: `custom-${Date.now()}` });
    setDialogOpen(true);
  };

  const openEdit = (f: GovFormAdmin) => {
    setEditing(f);
    setForm({ ...f });
    setDialogOpen(true);
  };

  const deleteForm = (id: string) => {
    const updated = forms.filter((f) => f.id !== id);
    setForms(updated);
    saveForms(updated);
    toast.success("Form deleted");
  };

  const saveForm = () => {
    if (!form.title.trim() || !form.pdfUrl.trim()) {
      toast.error("Title and PDF URL are required");
      return;
    }
    let updated: GovFormAdmin[];
    if (editing) {
      updated = forms.map((f) => (f.id === editing.id ? { ...form } : f));
      toast.success("Form updated");
    } else {
      updated = [{ ...form }, ...forms];
      toast.success("Form added");
    }
    setForms(updated);
    saveForms(updated);
    setDialogOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#0B2A4A]">
            Government Forms Library
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Add custom forms to the library. Default forms are pre-loaded on the
            public page.
          </p>
        </div>
        <Button
          onClick={openAdd}
          className="bg-[#0B2A4A] hover:bg-[#1E88FF] text-white gap-2"
          data-ocid="govforms.add_button"
        >
          <Plus size={15} />
          Add Form
        </Button>
      </div>

      {/* Info notice */}
      <div className="mb-5 p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800">
        <strong>Note:</strong> Default forms (PAN 49A, Aadhaar, Passport, etc.)
        are already pre-loaded on the public forms library page. Use this panel
        to add <strong>custom or additional forms</strong> that will appear at
        the top of the list.
      </div>

      {forms.length === 0 ? (
        <div
          className="text-center py-16 text-gray-400"
          data-ocid="govforms.empty_state"
        >
          <span className="text-5xl block mb-3">📂</span>
          <p className="text-lg font-medium">No custom forms added yet</p>
          <p className="text-sm mt-1">
            Click "Add Form" to add a new government form PDF link to the
            library
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm" data-ocid="govforms.table">
            <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Title</th>
                <th className="text-left px-4 py-3 font-semibold">Category</th>
                <th className="text-left px-4 py-3 font-semibold">Language</th>
                <th className="text-left px-4 py-3 font-semibold">PDF URL</th>
                <th className="text-left px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {forms.map((f, idx) => (
                <tr
                  key={f.id}
                  className="hover:bg-gray-50"
                  data-ocid={`govforms.item.${idx + 1}`}
                >
                  <td className="px-4 py-3 font-medium text-[#0B2A4A] max-w-xs truncate">
                    {f.title}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{f.category}</td>
                  <td className="px-4 py-3 text-gray-500">{f.language}</td>
                  <td className="px-4 py-3 max-w-[200px] truncate">
                    <a
                      href={f.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-xs"
                    >
                      {f.pdfUrl}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEdit(f)}
                        className="h-7 px-2 text-xs"
                        data-ocid={`govforms.edit_button.${idx + 1}`}
                      >
                        <Edit size={12} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteForm(f.id)}
                        className="h-7 px-2 text-xs text-red-600 hover:bg-red-50 border-red-200"
                        data-ocid={`govforms.delete_button.${idx + 1}`}
                      >
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg" data-ocid="govforms.dialog">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Form" : "Add New Form"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="mb-1.5 block text-sm font-medium">
                Form Title *
              </Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Form 49A – Application for PAN"
                data-ocid="govforms.title.input"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="mb-1.5 block text-sm font-medium">
                  Category *
                </Label>
                <select
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  data-ocid="govforms.category.select"
                >
                  {GOV_FORM_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="mb-1.5 block text-sm font-medium">
                  Language *
                </Label>
                <select
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.language}
                  onChange={(e) =>
                    setForm({ ...form, language: e.target.value })
                  }
                  data-ocid="govforms.language.select"
                >
                  {LANG_OPTIONS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <Label className="mb-1.5 block text-sm font-medium">
                Description
              </Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Brief description of the form and when it is used..."
                rows={3}
                data-ocid="govforms.description.textarea"
              />
            </div>
            <div>
              <Label className="mb-1.5 block text-sm font-medium">
                PDF URL *
              </Label>
              <Input
                value={form.pdfUrl}
                onChange={(e) => setForm({ ...form, pdfUrl: e.target.value })}
                placeholder="https://..."
                data-ocid="govforms.pdfurl.input"
              />
              <p className="text-xs text-gray-400 mt-1">
                Direct link to the official government PDF file
              </p>
            </div>
            <div>
              <Label className="mb-1.5 block text-sm font-medium">
                File Size (optional)
              </Label>
              <Input
                value={form.fileSize ?? ""}
                onChange={(e) => setForm({ ...form, fileSize: e.target.value })}
                placeholder="e.g. ~200 KB"
                data-ocid="govforms.filesize.input"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              data-ocid="govforms.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={saveForm}
              className="bg-[#0B2A4A] hover:bg-[#1E88FF] text-white"
              data-ocid="govforms.submit_button"
            >
              {editing ? "Update" : "Add"} Form
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── Entertainment Admin Tab ──────────────────────────────────────────────────

interface EntertainmentAdminData {
  newsHeadlines: string[];
  youtubeVideos: { id: string; title: string }[];
  bihuVideos: { id: string; title: string }[];
  funFacts: string[];
  jokes: { setup: string; punchline: string }[];
}

const ENT_LS_KEY = "entertainment_admin_data";

function loadEntData(): EntertainmentAdminData {
  try {
    return JSON.parse(localStorage.getItem(ENT_LS_KEY) || "{}");
  } catch {
    return {} as EntertainmentAdminData;
  }
}

function saveEntData(data: EntertainmentAdminData) {
  localStorage.setItem(ENT_LS_KEY, JSON.stringify(data));
}

const DEFAULT_HEADLINES = [
  "India launches new digital infrastructure initiative across rural Assam",
  "Kaziranga rhino population reaches record high of 3,000+",
  "Guwahati selected as Smart City for 2026 development plan",
  "Assam tea exports hit all-time high this quarter",
  "India becomes 3rd largest economy — GDP surpasses Japan",
  "New railway line connecting Nalbari to Guwahati approved",
  "ISRO successfully launches 100th satellite from Sriharikota",
  "Digital India initiative reaches 80 crore internet users",
  "Bihu festival to be nominated for UNESCO heritage listing",
  "Assam government launches free broadband for rural schools",
];

const DEFAULT_YOUTUBE = [
  { id: "RgKAFK5djSk", title: "Wiz Khalifa — See You Again" },
  { id: "JGwWNGJdvx8", title: "Ed Sheeran — Shape of You" },
  { id: "ktvTqknDobU", title: "Pharrell Williams — Happy" },
  { id: "YQHsXMglC9A", title: "Adele — Hello" },
  { id: "OPf0YbXqDm0", title: "Mark Ronson ft. Bruno Mars — Uptown Funk" },
  { id: "hT_nvWreIhg", title: "OneRepublic — Counting Stars" },
];

const DEFAULT_BIHU = [
  { id: "dQw4w9WgXcQ", title: "Traditional Bihu Songs" },
  { id: "9bZkp7q19f0", title: "Bihu Dance Performance" },
  { id: "60ItHLz5WEA", title: "Assamese Folk Music" },
];

const DEFAULT_FACTS = [
  "The human brain can process images in as little as 13 milliseconds.",
  "Honey never spoils — 3,000-year-old honey found in Egyptian tombs is still edible.",
  "Assam produces more than 50% of India's total tea output.",
  "A group of flamingos is called a 'flamboyance'.",
  "The Brahmaputra River is one of the few rivers in the world that flows both west and east.",
];

const DEFAULT_JOKES = [
  {
    setup: "Why don't scientists trust atoms?",
    punchline: "Because they make up everything!",
  },
  {
    setup: "Why did the math book look so sad?",
    punchline: "Because it had too many problems.",
  },
  { setup: "What do you call a fish without eyes?", punchline: "A fsh!" },
];

type EntSubTab = "headlines" | "youtube" | "bihu" | "facts" | "jokes";

function EntertainmentAdminTab() {
  const saved = loadEntData();

  const [subTab, setSubTab] = useState<EntSubTab>("headlines");

  const [headlines, setHeadlines] = useState<string[]>(
    saved.newsHeadlines ?? DEFAULT_HEADLINES,
  );
  const [youtubeVideos, setYoutubeVideos] = useState<
    { id: string; title: string }[]
  >(saved.youtubeVideos ?? DEFAULT_YOUTUBE);
  const [bihuVideos, setBihuVideos] = useState<{ id: string; title: string }[]>(
    saved.bihuVideos ?? DEFAULT_BIHU,
  );
  const [funFacts, setFunFacts] = useState<string[]>(
    saved.funFacts ?? DEFAULT_FACTS,
  );
  const [jokes, setJokes] = useState<{ setup: string; punchline: string }[]>(
    saved.jokes ?? DEFAULT_JOKES,
  );

  function saveAll(overrides: Partial<EntertainmentAdminData> = {}) {
    const data: EntertainmentAdminData = {
      newsHeadlines: overrides.newsHeadlines ?? headlines,
      youtubeVideos: overrides.youtubeVideos ?? youtubeVideos,
      bihuVideos: overrides.bihuVideos ?? bihuVideos,
      funFacts: overrides.funFacts ?? funFacts,
      jokes: overrides.jokes ?? jokes,
    };
    saveEntData(data);
    toast.success("Entertainment content saved!");
  }

  const subTabs: { key: EntSubTab; label: string }[] = [
    { key: "headlines", label: "News Headlines" },
    { key: "youtube", label: "YouTube Videos" },
    { key: "bihu", label: "Bihu Videos" },
    { key: "facts", label: "Fun Facts" },
    { key: "jokes", label: "Jokes" },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-[#0B2A4A] mb-6 flex items-center gap-2">
        <Tv size={20} className="text-[#1E88FF]" /> Entertainment Hub
      </h2>

      {/* Sub-tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
        {subTabs.map((s) => (
          <button
            type="button"
            key={s.key}
            onClick={() => setSubTab(s.key)}
            className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
              subTab === s.key
                ? "border-[#1E88FF] text-[#0B2A4A]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            data-ocid={`entertainment.${s.key}.tab`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* ── Headlines ── */}
      {subTab === "headlines" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-[#0B2A4A] mb-4">News Headlines</h3>
          <div className="space-y-2 mb-4">
            {headlines.map((h, i) => (
              <div key={h || `h-${i}`} className="flex gap-2">
                <input
                  type="text"
                  value={h}
                  onChange={(e) => {
                    const updated = [...headlines];
                    updated[i] = e.target.value;
                    setHeadlines(updated);
                  }}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E88FF]"
                  data-ocid={`entertainment.headlines.input.${i + 1}`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setHeadlines(headlines.filter((_, j) => j !== i))
                  }
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  data-ocid={`entertainment.headlines.delete_button.${i + 1}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setHeadlines([...headlines, ""])}
              className="flex items-center gap-1.5 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              data-ocid="entertainment.headlines.secondary_button"
            >
              <Plus size={14} /> Add Headline
            </button>
            <button
              type="button"
              onClick={() => saveAll({ newsHeadlines: headlines })}
              className="flex items-center gap-1.5 px-4 py-2 text-sm bg-[#1E88FF] hover:bg-[#1565C0] text-white rounded-lg font-medium transition-colors"
              data-ocid="entertainment.headlines.save_button"
            >
              <Save size={14} /> Save Headlines
            </button>
          </div>
        </div>
      )}

      {/* ── YouTube Videos ── */}
      {subTab === "youtube" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-[#0B2A4A] mb-4">YouTube Videos</h3>
          <div className="space-y-2 mb-4">
            <div className="grid grid-cols-[1fr_2fr_auto] gap-2 text-xs font-semibold text-gray-500 px-1">
              <span>YouTube ID</span>
              <span>Title</span>
              <span />
            </div>
            {youtubeVideos.map((v, i) => (
              <div
                key={v.id || `yt-${i}`}
                className="grid grid-cols-[1fr_2fr_auto] gap-2"
              >
                <input
                  type="text"
                  value={v.id}
                  placeholder="e.g. RgKAFK5djSk"
                  onChange={(e) => {
                    const updated = [...youtubeVideos];
                    updated[i] = { ...updated[i], id: e.target.value };
                    setYoutubeVideos(updated);
                  }}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E88FF]"
                  data-ocid={`entertainment.youtube.input.${i + 1}`}
                />
                <input
                  type="text"
                  value={v.title}
                  placeholder="Video title"
                  onChange={(e) => {
                    const updated = [...youtubeVideos];
                    updated[i] = { ...updated[i], title: e.target.value };
                    setYoutubeVideos(updated);
                  }}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E88FF]"
                />
                <button
                  type="button"
                  onClick={() =>
                    setYoutubeVideos(youtubeVideos.filter((_, j) => j !== i))
                  }
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  data-ocid={`entertainment.youtube.delete_button.${i + 1}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() =>
                setYoutubeVideos([...youtubeVideos, { id: "", title: "" }])
              }
              className="flex items-center gap-1.5 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              data-ocid="entertainment.youtube.secondary_button"
            >
              <Plus size={14} /> Add Video
            </button>
            <button
              type="button"
              onClick={() => saveAll({ youtubeVideos })}
              className="flex items-center gap-1.5 px-4 py-2 text-sm bg-[#1E88FF] hover:bg-[#1565C0] text-white rounded-lg font-medium transition-colors"
              data-ocid="entertainment.youtube.save_button"
            >
              <Save size={14} /> Save Videos
            </button>
          </div>
        </div>
      )}

      {/* ── Bihu Videos ── */}
      {subTab === "bihu" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-[#0B2A4A] mb-4">
            Bihu Cultural Videos
          </h3>
          <div className="space-y-2 mb-4">
            <div className="grid grid-cols-[1fr_2fr_auto] gap-2 text-xs font-semibold text-gray-500 px-1">
              <span>YouTube ID</span>
              <span>Title</span>
              <span />
            </div>
            {bihuVideos.map((v, i) => (
              <div
                key={v.id || `bh-${i}`}
                className="grid grid-cols-[1fr_2fr_auto] gap-2"
              >
                <input
                  type="text"
                  value={v.id}
                  placeholder="e.g. dQw4w9WgXcQ"
                  onChange={(e) => {
                    const updated = [...bihuVideos];
                    updated[i] = { ...updated[i], id: e.target.value };
                    setBihuVideos(updated);
                  }}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E88FF]"
                  data-ocid={`entertainment.bihu.input.${i + 1}`}
                />
                <input
                  type="text"
                  value={v.title}
                  placeholder="Video title"
                  onChange={(e) => {
                    const updated = [...bihuVideos];
                    updated[i] = { ...updated[i], title: e.target.value };
                    setBihuVideos(updated);
                  }}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E88FF]"
                />
                <button
                  type="button"
                  onClick={() =>
                    setBihuVideos(bihuVideos.filter((_, j) => j !== i))
                  }
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  data-ocid={`entertainment.bihu.delete_button.${i + 1}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() =>
                setBihuVideos([...bihuVideos, { id: "", title: "" }])
              }
              className="flex items-center gap-1.5 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              data-ocid="entertainment.bihu.secondary_button"
            >
              <Plus size={14} /> Add Video
            </button>
            <button
              type="button"
              onClick={() => saveAll({ bihuVideos })}
              className="flex items-center gap-1.5 px-4 py-2 text-sm bg-[#1E88FF] hover:bg-[#1565C0] text-white rounded-lg font-medium transition-colors"
              data-ocid="entertainment.bihu.save_button"
            >
              <Save size={14} /> Save Bihu Videos
            </button>
          </div>
        </div>
      )}

      {/* ── Fun Facts ── */}
      {subTab === "facts" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-[#0B2A4A] mb-4">Fun Facts</h3>
          <div className="space-y-2 mb-4">
            {funFacts.map((fact, i) => (
              <div key={fact || `f-${i}`} className="flex gap-2">
                <input
                  type="text"
                  value={fact}
                  onChange={(e) => {
                    const updated = [...funFacts];
                    updated[i] = e.target.value;
                    setFunFacts(updated);
                  }}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E88FF]"
                  data-ocid={`entertainment.facts.input.${i + 1}`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setFunFacts(funFacts.filter((_, j) => j !== i))
                  }
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  data-ocid={`entertainment.facts.delete_button.${i + 1}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setFunFacts([...funFacts, ""])}
              className="flex items-center gap-1.5 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              data-ocid="entertainment.facts.secondary_button"
            >
              <Plus size={14} /> Add Fact
            </button>
            <button
              type="button"
              onClick={() => saveAll({ funFacts })}
              className="flex items-center gap-1.5 px-4 py-2 text-sm bg-[#1E88FF] hover:bg-[#1565C0] text-white rounded-lg font-medium transition-colors"
              data-ocid="entertainment.facts.save_button"
            >
              <Save size={14} /> Save Facts
            </button>
          </div>
        </div>
      )}

      {/* ── Jokes ── */}
      {subTab === "jokes" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-[#0B2A4A] mb-4">Jokes</h3>
          <div className="space-y-2 mb-4">
            <div className="grid grid-cols-[1fr_1fr_auto] gap-2 text-xs font-semibold text-gray-500 px-1">
              <span>Setup (Question)</span>
              <span>Punchline (Answer)</span>
              <span />
            </div>
            {jokes.map((joke, i) => (
              <div
                key={joke.setup || `j-${i}`}
                className="grid grid-cols-[1fr_1fr_auto] gap-2"
              >
                <input
                  type="text"
                  value={joke.setup}
                  placeholder="Why did the...?"
                  onChange={(e) => {
                    const updated = [...jokes];
                    updated[i] = { ...updated[i], setup: e.target.value };
                    setJokes(updated);
                  }}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E88FF]"
                  data-ocid={`entertainment.jokes.input.${i + 1}`}
                />
                <input
                  type="text"
                  value={joke.punchline}
                  placeholder="Because..."
                  onChange={(e) => {
                    const updated = [...jokes];
                    updated[i] = { ...updated[i], punchline: e.target.value };
                    setJokes(updated);
                  }}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E88FF]"
                />
                <button
                  type="button"
                  onClick={() => setJokes(jokes.filter((_, j) => j !== i))}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  data-ocid={`entertainment.jokes.delete_button.${i + 1}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setJokes([...jokes, { setup: "", punchline: "" }])}
              className="flex items-center gap-1.5 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              data-ocid="entertainment.jokes.secondary_button"
            >
              <Plus size={14} /> Add Joke
            </button>
            <button
              type="button"
              onClick={() => saveAll({ jokes })}
              className="flex items-center gap-1.5 px-4 py-2 text-sm bg-[#1E88FF] hover:bg-[#1565C0] text-white rounded-lg font-medium transition-colors"
              data-ocid="entertainment.jokes.save_button"
            >
              <Save size={14} /> Save Jokes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Assam Tourism Admin Tab ────────────────────────────────────────────────
const ASSAM_TOURISM_LS_KEY = "assamTourismPlaces";

interface CustomPlace {
  id: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  bestTime: string;
  howToReach: string;
  localFood: string;
  culturalInfo: string;
  category: string;
}

const EMPTY_PLACE: CustomPlace = {
  id: "",
  name: "",
  tagline: "",
  description: "",
  image: "",
  bestTime: "",
  howToReach: "",
  localFood: "",
  culturalInfo: "",
  category: "Nature",
};

const ASSAM_CATEGORIES = [
  "Wildlife",
  "Culture & Heritage",
  "Spiritual",
  "Nature",
  "History & Heritage",
  "Festival & Culture",
  "Tea & Culture",
  "Nature & Hill Station",
];

function AssamTourismAdminTab() {
  const [places, setPlaces] = useState<CustomPlace[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(ASSAM_TOURISM_LS_KEY) || "[]");
    } catch {
      return [];
    }
  });
  const [form, setForm] = useState<CustomPlace>({ ...EMPTY_PLACE });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const save = () => {
    if (!form.name.trim()) {
      toast.error("Place name is required");
      return;
    }
    let updated: CustomPlace[];
    if (editingId) {
      updated = places.map((p) =>
        p.id === editingId ? { ...form, id: editingId } : p,
      );
      toast.success("Place updated!");
    } else {
      const newPlace = { ...form, id: `custom-${Date.now()}` };
      updated = [newPlace, ...places];
      toast.success("Place added!");
    }
    setPlaces(updated);
    localStorage.setItem(ASSAM_TOURISM_LS_KEY, JSON.stringify(updated));
    setForm({ ...EMPTY_PLACE });
    setEditingId(null);
    setShowForm(false);
  };

  const remove = (id: string) => {
    const updated = places.filter((p) => p.id !== id);
    setPlaces(updated);
    localStorage.setItem(ASSAM_TOURISM_LS_KEY, JSON.stringify(updated));
    toast.success("Place removed");
  };

  const startEdit = (place: CustomPlace) => {
    setForm({ ...place });
    setEditingId(place.id);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#0B2A4A] flex items-center gap-2">
            <Mountain size={20} className="text-[#1E88FF]" />
            Manage Assam Tourism Places
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            10 built-in places are always shown. Add custom places below — they
            appear at the top of the tourism page.
          </p>
        </div>
        <Button
          onClick={() => {
            setForm({ ...EMPTY_PLACE });
            setEditingId(null);
            setShowForm(true);
          }}
          className="flex items-center gap-1.5 bg-[#1E88FF] hover:bg-[#1565C0]"
          data-ocid="assam-tourism.open_modal_button"
        >
          <Plus size={16} /> Add New Place
        </Button>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm text-blue-800">
        <strong>Built-in places (10):</strong> Kaziranga, Majuli, Kamakhya
        Temple, Brahmaputra River, Sivasagar, Manas National Park, Haflong,
        Tezpur, Jorhat Tea Gardens, Bihu Festival — these cannot be deleted.
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div
          className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6"
          data-ocid="assam-tourism.dialog"
        >
          <h3 className="text-lg font-bold text-[#0B2A4A] mb-4">
            {editingId ? "Edit Place" : "Add New Place"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1 block">
                Place Name *
              </Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Dipor Bil"
                data-ocid="assam-tourism.input"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1 block">
                Tagline
              </Label>
              <Input
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                placeholder="Short catchy tagline"
                data-ocid="assam-tourism.input"
              />
            </div>
            <div className="md:col-span-2">
              <Label className="text-sm font-medium text-gray-700 mb-1 block">
                Description
              </Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Full description of the place..."
                rows={3}
                data-ocid="assam-tourism.textarea"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1 block">
                Image URL
              </Label>
              <Input
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://... or /assets/..."
                data-ocid="assam-tourism.input"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1 block">
                Category
              </Label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                data-ocid="assam-tourism.select"
              >
                {ASSAM_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1 block">
                Best Time to Visit
              </Label>
              <Input
                value={form.bestTime}
                onChange={(e) => setForm({ ...form, bestTime: e.target.value })}
                placeholder="e.g. October to March"
                data-ocid="assam-tourism.input"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1 block">
                How to Reach
              </Label>
              <Input
                value={form.howToReach}
                onChange={(e) =>
                  setForm({ ...form, howToReach: e.target.value })
                }
                placeholder="Airport, railway, road info..."
                data-ocid="assam-tourism.input"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1 block">
                Local Food
              </Label>
              <Input
                value={form.localFood}
                onChange={(e) =>
                  setForm({ ...form, localFood: e.target.value })
                }
                placeholder="Must-try local dishes..."
                data-ocid="assam-tourism.input"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-1 block">
                Cultural Info
              </Label>
              <Input
                value={form.culturalInfo}
                onChange={(e) =>
                  setForm({ ...form, culturalInfo: e.target.value })
                }
                placeholder="Cultural significance, activities..."
                data-ocid="assam-tourism.input"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <Button
              onClick={save}
              className="bg-[#1E88FF] hover:bg-[#1565C0]"
              data-ocid="assam-tourism.save_button"
            >
              <Save size={14} className="mr-1.5" />
              {editingId ? "Update Place" : "Add Place"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setForm({ ...EMPTY_PLACE });
              }}
              data-ocid="assam-tourism.cancel_button"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Custom Places Table */}
      {places.length === 0 ? (
        <div
          className="text-center py-16 text-gray-400"
          data-ocid="assam-tourism.empty_state"
        >
          <Mountain size={40} className="mx-auto mb-3 opacity-30" />
          <p>No custom places added yet.</p>
          <p className="text-sm mt-1">Click "Add New Place" to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                  Name
                </th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                  Category
                </th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                  Tagline
                </th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">
                  Best Time
                </th>
                <th className="text-right px-4 py-3 text-gray-600 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {places.map((place, i) => (
                <tr
                  key={place.id}
                  className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                  data-ocid={`assam-tourism.row.${i + 1}`}
                >
                  <td className="px-4 py-3 font-medium text-[#0B2A4A]">
                    {place.name}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                      {place.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 max-w-[200px] truncate">
                    {place.tagline}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{place.bestTime}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(place)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        data-ocid={`assam-tourism.edit_button.${i + 1}`}
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(place.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        data-ocid={`assam-tourism.delete_button.${i + 1}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
