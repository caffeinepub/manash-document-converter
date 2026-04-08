import {
  CheckCircle,
  Clock,
  Loader2,
  Package,
  Search,
  Truck,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "../components/ui/input";
import type { Order } from "../types";
import { getOrders } from "../types";

// Local status type matching Order["status"]
type OrderStatus = Order["status"];

export function OrderTrackingPage() {
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    setLoading(true);
    try {
      const allOrders = getOrders();
      const result = allOrders.filter(
        (o) => o.customerEmail.toLowerCase() === email.toLowerCase(),
      );
      setOrders(result);
      setSearched(true);
      if (result.length === 0) toast.info("No orders found for this email");
    } catch {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const statusConfig: Record<
    OrderStatus,
    { label: string; icon: typeof Package; bg: string; text: string }
  > = {
    pending: {
      label: "Pending",
      icon: Clock,
      bg: "oklch(0.96 0.05 80 / 0.5)",
      text: "oklch(0.5 0.12 80)",
    },
    confirmed: {
      label: "Confirmed",
      icon: Truck,
      bg: "oklch(0.94 0.05 220 / 0.5)",
      text: "oklch(0.45 0.12 220)",
    },
    shipped: {
      label: "Shipped",
      icon: Truck,
      bg: "oklch(0.94 0.05 200 / 0.5)",
      text: "oklch(0.45 0.12 200)",
    },
    delivered: {
      label: "Delivered",
      icon: CheckCircle,
      bg: "oklch(0.92 0.08 145 / 0.5)",
      text: "oklch(0.42 0.12 145)",
    },
    cancelled: {
      label: "Cancelled",
      icon: XCircle,
      bg: "oklch(0.94 0.05 25 / 0.5)",
      text: "oklch(0.5 0.15 25)",
    },
  };

  const formatPrice = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const glassCard = {
    background: "oklch(1 0 0 / 0.8)",
    backdropFilter: "blur(10px)",
    border: "1px solid oklch(0.92 0.03 15)",
    boxShadow: "0 2px 12px oklch(0.81 0.1 20 / 0.08)",
    borderRadius: "16px",
  } as React.CSSProperties;

  return (
    <div
      className="min-h-screen px-4 py-10"
      style={{ background: "oklch(0.98 0.02 15)" }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold gradient-text-ios mb-2">
            Track Your Order
          </h1>
          <p style={{ color: "oklch(0.55 0.02 250)" }}>
            Enter your email to view order history
          </p>
        </div>

        {/* Search */}
        <div
          className="flex gap-2 mb-8 p-2 rounded-2xl"
          style={{
            background: "oklch(1 0 0 / 0.8)",
            backdropFilter: "blur(10px)",
            border: "1px solid oklch(0.92 0.03 15)",
            boxShadow: "0 2px 12px oklch(0.81 0.1 20 / 0.08)",
          }}
        >
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="your@email.com"
            data-ocid="tracking.email_input"
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            style={{ color: "oklch(0.25 0.02 250)" }}
          />
          <button
            type="button"
            onClick={handleSearch}
            disabled={loading}
            data-ocid="tracking.search"
            className="shrink-0 flex items-center justify-center w-11 h-11 rounded-xl font-semibold text-white transition-all"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.81 0.1 20), oklch(0.85 0.12 220))",
              boxShadow: "0 2px 8px oklch(0.81 0.1 20 / 0.3)",
            }}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Empty state */}
        {searched && orders.length === 0 && (
          <div className="text-center py-16 rounded-2xl" style={glassCard}>
            <Package
              className="h-12 w-12 mx-auto mb-3"
              style={{ color: "oklch(0.81 0.1 20 / 0.4)" }}
            />
            <p style={{ color: "oklch(0.55 0.02 250)" }}>
              No orders found for{" "}
              <span style={{ color: "oklch(0.81 0.1 20)", fontWeight: 600 }}>
                {email}
              </span>
            </p>
          </div>
        )}

        {/* Orders list */}
        <div className="space-y-4">
          {orders.map((order) => {
            const sc = statusConfig[order.status] ?? statusConfig.pending;
            const StatusIcon = sc.icon;

            return (
              <div
                key={order.id}
                data-ocid="tracking.order_card"
                style={glassCard}
                className="p-5 animate-scale-in"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div
                      className="font-bold text-base"
                      style={{ color: "oklch(0.25 0.02 250)" }}
                    >
                      Order #{order.id}
                    </div>
                    <div
                      className="text-xs mt-0.5"
                      style={{ color: "oklch(0.6 0.02 250)" }}
                    >
                      {formatDate(order.createdAt)}
                    </div>
                  </div>
                  {/* Status pill */}
                  <span
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{ background: sc.bg, color: sc.text }}
                  >
                    <StatusIcon className="h-3.5 w-3.5" />
                    {sc.label}
                  </span>
                </div>

                {/* Details */}
                <div
                  className="border-t pt-3 space-y-1"
                  style={{ borderColor: "oklch(0.92 0.03 15)" }}
                >
                  <div
                    className="text-xs"
                    style={{ color: "oklch(0.55 0.02 250)" }}
                  >
                    Payment:{" "}
                    <span
                      style={{ color: "oklch(0.35 0.02 250)", fontWeight: 600 }}
                    >
                      {order.paymentMethod.toUpperCase()}
                    </span>
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "oklch(0.55 0.02 250)" }}
                  >
                    Delivery:{" "}
                    <span
                      style={{ color: "oklch(0.35 0.02 250)", fontWeight: 600 }}
                    >
                      {order.deliveryType === "delivery"
                        ? `Home · ${order.deliveryAddress ?? ""}`
                        : "Store Pickup"}
                    </span>
                  </div>
                  <div
                    className="flex justify-between items-center pt-2"
                    style={{ borderTop: "1px solid oklch(0.94 0.02 15)" }}
                  >
                    <span
                      className="text-xs"
                      style={{ color: "oklch(0.6 0.02 250)" }}
                    >
                      {order.items.length} item(s)
                    </span>
                    <span className="font-bold text-sm gradient-text-pink">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
