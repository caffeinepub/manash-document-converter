import { LogOut, Mail, Package, Phone, ShoppingBag, User } from "lucide-react";
import type { Page } from "../App";
import { getCustomerSession, getOrders } from "../types";

interface Props {
  navigate: (p: Page) => void;
}

export function AccountPage({ navigate }: Props) {
  const customer = getCustomerSession();

  if (!customer) {
    return (
      <div
        className="min-h-[70vh] flex flex-col items-center justify-center gap-5"
        style={{ background: "oklch(0.98 0.02 15)" }}
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-2"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.88 0.06 15), oklch(0.88 0.06 220))",
          }}
        >
          <User size={36} style={{ color: "oklch(0.81 0.1 20)" }} />
        </div>
        <h2
          className="text-xl font-bold"
          style={{ color: "oklch(0.25 0.02 250)" }}
        >
          Not logged in
        </h2>
        <p className="text-sm" style={{ color: "oklch(0.55 0.02 250)" }}>
          Please login to view your account
        </p>
        <button
          type="button"
          onClick={() => navigate("auth")}
          data-ocid="account.login"
          className="px-8 py-3 rounded-full font-semibold text-white transition-all duration-200"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.81 0.1 20), oklch(0.85 0.12 220))",
            boxShadow: "0 4px 16px oklch(0.81 0.1 20 / 0.3)",
          }}
        >
          Login
        </button>
      </div>
    );
  }

  const orders = getOrders().filter((o) => o.customerId === customer.id);

  const logout = () => {
    localStorage.removeItem("customerSession");
    navigate("home");
  };

  const statusStyle = (s: string): React.CSSProperties =>
    ({
      pending: {
        background: "oklch(0.96 0.05 80 / 0.5)",
        color: "oklch(0.5 0.12 80)",
      },
      confirmed: {
        background: "oklch(0.94 0.05 220 / 0.5)",
        color: "oklch(0.45 0.12 220)",
      },
      shipped: {
        background: "oklch(0.93 0.06 300 / 0.4)",
        color: "oklch(0.45 0.1 300)",
      },
      delivered: {
        background: "oklch(0.92 0.08 145 / 0.5)",
        color: "oklch(0.42 0.12 145)",
      },
      cancelled: {
        background: "oklch(0.94 0.05 25 / 0.5)",
        color: "oklch(0.5 0.15 25)",
      },
    })[s] ?? {
      background: "oklch(0.93 0.01 250 / 0.5)",
      color: "oklch(0.5 0.02 250)",
    };

  const glassCard = {
    background: "oklch(1 0 0 / 0.82)",
    backdropFilter: "blur(10px)",
    border: "1px solid oklch(0.92 0.03 15)",
    boxShadow: "0 2px 12px oklch(0.81 0.1 20 / 0.08)",
    borderRadius: "16px",
  } as React.CSSProperties;

  return (
    <div
      className="min-h-screen px-4 py-8"
      style={{ background: "oklch(0.98 0.02 15)" }}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Profile card */}
        <div
          className="p-6 flex items-center justify-between"
          style={glassCard}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.88 0.06 15), oklch(0.88 0.06 220))",
              }}
            >
              <User size={26} style={{ color: "oklch(0.81 0.1 20)" }} />
            </div>
            <div>
              <h1
                className="text-lg font-extrabold"
                style={{ color: "oklch(0.25 0.02 250)" }}
                data-ocid="account.name"
              >
                {customer.name}
              </h1>
              {customer.phone && (
                <p
                  className="text-sm flex items-center gap-1 mt-0.5"
                  style={{ color: "oklch(0.55 0.02 250)" }}
                >
                  <Phone size={12} /> {customer.phone}
                </p>
              )}
              {customer.email && (
                <p
                  className="text-sm flex items-center gap-1 mt-0.5"
                  style={{ color: "oklch(0.55 0.02 250)" }}
                >
                  <Mail size={12} /> {customer.email}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            data-ocid="account.logout"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all"
            style={{
              background: "oklch(0.95 0.05 25 / 0.4)",
              border: "1px solid oklch(0.85 0.08 25 / 0.4)",
              color: "oklch(0.55 0.15 25)",
            }}
          >
            <LogOut size={14} /> Logout
          </button>
        </div>

        {/* Orders section */}
        <div>
          <h2
            className="text-lg font-bold mb-4 flex items-center gap-2"
            style={{ color: "oklch(0.25 0.02 250)" }}
          >
            <ShoppingBag size={18} style={{ color: "oklch(0.81 0.1 20)" }} />
            My Orders ({orders.length})
          </h2>

          {orders.length === 0 ? (
            <div className="p-10 text-center" style={glassCard}>
              <Package
                size={40}
                className="mx-auto mb-3"
                style={{ color: "oklch(0.81 0.1 20 / 0.4)" }}
              />
              <p className="mb-4" style={{ color: "oklch(0.55 0.02 250)" }}>
                No orders yet
              </p>
              <button
                type="button"
                onClick={() => navigate("shop")}
                className="px-8 py-3 rounded-full font-semibold text-white"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.81 0.1 20), oklch(0.85 0.12 220))",
                  boxShadow: "0 4px 14px oklch(0.81 0.1 20 / 0.3)",
                }}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {[...orders].reverse().map((o) => (
                <div
                  key={o.id}
                  data-ocid="account.order_card"
                  style={glassCard}
                  className="p-4"
                >
                  {/* Order header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div
                        className="font-bold text-sm"
                        style={{ color: "oklch(0.25 0.02 250)" }}
                      >
                        {o.id}
                      </div>
                      <div
                        className="text-xs mt-0.5"
                        style={{ color: "oklch(0.6 0.02 250)" }}
                      >
                        {new Date(o.createdAt).toLocaleDateString("en-IN")}
                      </div>
                    </div>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={statusStyle(o.status)}
                    >
                      {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                    </span>
                  </div>

                  {/* Items list */}
                  <div
                    className="space-y-0.5 pb-3 mb-3"
                    style={{ borderBottom: "1px solid oklch(0.93 0.02 15)" }}
                  >
                    {o.items.map((i) => (
                      <div
                        key={i.productId}
                        className="text-sm flex justify-between"
                        style={{ color: "oklch(0.55 0.02 250)" }}
                      >
                        <span>
                          {i.productName} × {i.qty}
                        </span>
                        <span>
                          ₹{(i.price * i.qty).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <span
                      className="text-xs"
                      style={{ color: "oklch(0.6 0.02 250)" }}
                    >
                      {o.deliveryType === "delivery"
                        ? "🚚 Home delivery"
                        : "🏪 Store pickup"}
                    </span>
                    <span className="font-bold text-sm gradient-text-ios">
                      Total: ₹{o.totalAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
