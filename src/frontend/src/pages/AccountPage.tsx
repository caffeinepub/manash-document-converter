import type { Page } from "../App";
import { Button } from "../components/ui/button";
import { getCustomerSession, getOrders } from "../types";

interface Props {
  navigate: (p: Page) => void;
}

export function AccountPage({ navigate }: Props) {
  const customer = getCustomerSession();

  if (!customer) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Please login to view your account</p>
        <Button
          onClick={() => navigate("auth")}
          className="bg-[#0B2A4A] hover:bg-[#1E88FF] text-white"
        >
          Login
        </Button>
      </div>
    );
  }

  const orders = getOrders().filter((o) => o.customerId === customer.id);

  const logout = () => {
    localStorage.removeItem("customerSession");
    navigate("home");
  };

  const statusColor = (s: string) =>
    ({
      pending: "bg-yellow-100 text-yellow-700",
      confirmed: "bg-blue-100 text-blue-700",
      shipped: "bg-purple-100 text-purple-700",
      delivered: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-600",
    })[s] ?? "bg-gray-100 text-gray-600";

  return (
    <div className="min-h-screen bg-[#F3F5F8] px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow p-6 mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-[#0B2A4A]">
              {customer.name}
            </h1>
            {customer.phone && (
              <p className="text-gray-500 text-sm">📱 {customer.phone}</p>
            )}
            {customer.email && (
              <p className="text-gray-500 text-sm">✉️ {customer.email}</p>
            )}
          </div>
          <Button
            onClick={logout}
            variant="outline"
            className="text-red-500 border-red-200 hover:bg-red-50 text-sm"
          >
            Logout
          </Button>
        </div>

        <h2 className="text-lg font-bold text-[#0B2A4A] mb-4">
          My Orders ({orders.length})
        </h2>
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <p className="text-gray-400">No orders yet</p>
            <Button
              onClick={() => navigate("shop")}
              className="mt-4 bg-[#0B2A4A] hover:bg-[#1E88FF] text-white"
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {[...orders].reverse().map((o) => (
              <div key={o.id} className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-bold text-[#0B2A4A] text-sm">
                      {o.id}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(o.createdAt).toLocaleDateString("en-IN")}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(o.status)}`}
                  >
                    {o.status}
                  </span>
                </div>
                {o.items.map((i) => (
                  <div
                    key={i.productId}
                    className="text-sm text-gray-600 py-0.5"
                  >
                    {i.productName} × {i.qty} — ₹
                    {(i.price * i.qty).toLocaleString("en-IN")}
                  </div>
                ))}
                <div className="font-bold text-[#1E88FF] mt-2">
                  Total: ₹{o.totalAmount.toLocaleString("en-IN")}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
