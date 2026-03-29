import { Edit, Plus, Save, Trash2 } from "lucide-react";
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
import {
  type AdminConfig,
  type Order,
  type Product,
  getAdminConfig,
  getOrders,
  getProducts,
  saveOrders,
  saveProducts,
} from "../types";

interface Props {
  navigate: (p: Page) => void;
}

type Tab = "dashboard" | "products" | "orders" | "settings";

const ADMIN_EMAIL = "admin@nextgenit.com";
const ADMIN_PASSWORD = "Admin@123";

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

  useEffect(() => {
    if (authed) {
      setProducts(getProducts());
      setOrders(getOrders());
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
              />
            </div>
            <Button
              onClick={login}
              className="w-full bg-[#0B2A4A] hover:bg-[#1E88FF] text-white py-3 rounded-lg font-semibold"
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
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="max-w-7xl mx-auto flex gap-1">
          {(["dashboard", "products", "orders", "settings"] as Tab[]).map(
            (t) => (
              <button
                type="button"
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-4 text-sm font-semibold capitalize border-b-2 transition-colors ${
                  tab === t
                    ? "border-[#1E88FF] text-[#0B2A4A]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {t}
              </button>
            ),
          )}
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
              >
                <Save size={16} className="mr-2" /> Save Settings
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Product dialog */}
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
    </div>
  );
}

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
          >
            {product ? "Update Product" : "Add Product"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
