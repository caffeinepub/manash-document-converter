import {
  Briefcase,
  Edit,
  FileText,
  Mail,
  MapPin,
  Phone,
  Plus,
  Save,
  Trash2,
  Upload,
  User,
  X,
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
  | "contact";

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
              {t === "job-updates"
                ? "Job Updates"
                : t === "gov-documents"
                  ? "Govt Documents"
                  : t === "contact"
                    ? "Contact Us"
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
