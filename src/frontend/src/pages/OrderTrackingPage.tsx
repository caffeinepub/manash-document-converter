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
import { type Order, OrderStatus } from "../backend";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useActor } from "../hooks/useActor";

export function OrderTrackingPage() {
  const { actor } = useActor();
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    if (!actor) {
      toast.error("Loading...");
      return;
    }
    setLoading(true);
    try {
      const result = await actor.getOrdersByCustomer(email);
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
    { label: string; icon: typeof Package; color: string }
  > = {
    [OrderStatus.Pending]: {
      label: "Pending",
      icon: Clock,
      color: "text-yellow-400",
    },
    [OrderStatus.Processing]: {
      label: "Processing",
      icon: Truck,
      color: "text-blue-400",
    },
    [OrderStatus.Completed]: {
      label: "Completed",
      icon: CheckCircle,
      color: "text-green-400",
    },
    [OrderStatus.Cancelled]: {
      label: "Cancelled",
      icon: XCircle,
      color: "text-red-400",
    },
  };

  const formatPrice = (paise: bigint) =>
    `₹${(Number(paise) / 100).toLocaleString("en-IN")}`;
  const formatDate = (ns: bigint) =>
    new Date(Number(ns) / 1_000_000).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Track Your Order</h1>
        <p className="text-gray-400">Enter your email to view order history</p>
      </div>

      <div className="flex gap-2 mb-8">
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="your@email.com"
          className="bg-gray-800 border-gray-700 text-white"
        />
        <Button
          onClick={handleSearch}
          disabled={loading}
          className="bg-cyan-600 hover:bg-cyan-500 text-white px-6"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>

      {searched && orders.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <Package className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>
            No orders found for <span className="text-gray-300">{email}</span>
          </p>
        </div>
      )}

      <div className="space-y-4">
        {orders.map((order) => {
          const sc =
            statusConfig[order.orderStatus] ??
            statusConfig[OrderStatus.Pending];
          return (
            <div
              key={String(order.id)}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-bold text-white">
                    Order #{String(order.id)}
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatDate(order.timestamp)}
                  </div>
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${sc.color}`}
                >
                  <sc.icon className="h-4 w-4" />
                  {sc.label}
                </div>
              </div>
              <div className="text-sm text-gray-400 space-y-1">
                <div>
                  Payment:{" "}
                  <span className="text-gray-300">{order.paymentMethod}</span>
                </div>
                <div>
                  Delivery:{" "}
                  <span className="text-gray-300">
                    {order.deliveryType === "Delivery"
                      ? `Home · ${order.deliveryAddress ?? ""}`
                      : "Store Pickup"}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-gray-800">
                  <span>{order.items.length} item(s)</span>
                  <span className="text-cyan-400 font-semibold">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
