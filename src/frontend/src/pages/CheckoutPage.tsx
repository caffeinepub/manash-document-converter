import { CheckCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Page } from "../App";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import type { CartItem, Order } from "../types";
import {
  getAdminConfig,
  getCustomerSession,
  getOrders,
  saveOrders,
} from "../types";

interface Props {
  navigate: (p: Page) => void;
  cart: CartItem[];
  setCart: (c: CartItem[]) => void;
}

type Step = "delivery" | "payment" | "confirm";
type DeliveryType = "pickup" | "delivery";
type PaymentMethod = "upi" | "card" | "cod";

export function CheckoutPage({ navigate, cart, setCart }: Props) {
  const [step, setStep] = useState<Step>("delivery");
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("pickup");
  const [address, setAddress] = useState({
    name: "",
    address: "",
    city: "",
    pincode: "",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [upiId, setUpiId] = useState("");
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "" });
  const [orderId, setOrderId] = useState("");
  const [placing, setPlacing] = useState(false);

  const customer = getCustomerSession();
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const config = getAdminConfig();

  if (cart.length === 0 && step !== "confirm") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">Cart is empty</p>
        <Button onClick={() => navigate("shop")}>Go to Shop</Button>
      </div>
    );
  }

  const placeOrder = () => {
    if (!customer) {
      toast.error("Please login to place an order");
      navigate("auth");
      return;
    }
    if (
      deliveryType === "delivery" &&
      (!address.address || !address.city || !address.pincode)
    ) {
      toast.error("Please fill delivery address");
      return;
    }
    setPlacing(true);
    setTimeout(() => {
      const oid = `ORD${Date.now()}`;
      const order: Order = {
        id: oid,
        customerId: customer.id,
        customerName: customer.name,
        customerPhone: customer.phone,
        customerEmail: customer.email,
        items: cart,
        totalAmount: total,
        deliveryType,
        deliveryAddress:
          deliveryType === "delivery"
            ? `${address.name}, ${address.address}, ${address.city} - ${address.pincode}, ${address.phone}`
            : "Store Pickup",
        paymentMethod,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      const orders = getOrders();
      saveOrders([...orders, order]);
      setOrderId(oid);
      setCart([]);
      setStep("confirm");
      setPlacing(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F3F5F8] px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-extrabold text-[#0B2A4A] mb-6">
          Checkout
        </h1>

        {/* Steps indicator */}
        {step !== "confirm" && (
          <div className="flex items-center gap-2 mb-8">
            {(["delivery", "payment"] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step === s
                      ? "bg-[#0B2A4A] text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {i + 1}
                </div>
                <span
                  className={`text-sm font-medium capitalize ${
                    step === s ? "text-[#0B2A4A]" : "text-gray-400"
                  }`}
                >
                  {s}
                </span>
                {i < 1 && <div className="w-8 h-px bg-gray-300" />}
              </div>
            ))}
          </div>
        )}

        {/* Step 1: Delivery */}
        {step === "delivery" && (
          <div className="bg-white rounded-2xl shadow p-6 space-y-6">
            <h2 className="font-bold text-[#0B2A4A] text-lg">
              Delivery Option
            </h2>
            <div className="space-y-3">
              {(["pickup", "delivery"] as DeliveryType[]).map((dt) => (
                <label
                  key={dt}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer ${
                    deliveryType === dt
                      ? "border-[#0B2A4A] bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value={dt}
                    checked={deliveryType === dt}
                    onChange={() => setDeliveryType(dt)}
                    className="mt-0.5"
                  />
                  <div>
                    <div className="font-semibold text-[#0B2A4A]">
                      {dt === "pickup"
                        ? "🏪 Pickup from Store"
                        : "🚚 Home Delivery"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {dt === "pickup"
                        ? "Collect from NextGen IT Hub store"
                        : "Delivered to your address"}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {deliveryType === "delivery" && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700">
                  Delivery Address
                </h3>
                <Input
                  placeholder="Full Name"
                  value={address.name}
                  onChange={(e) =>
                    setAddress({ ...address, name: e.target.value })
                  }
                />
                <Input
                  placeholder="Street Address"
                  value={address.address}
                  onChange={(e) =>
                    setAddress({ ...address, address: e.target.value })
                  }
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="City"
                    value={address.city}
                    onChange={(e) =>
                      setAddress({ ...address, city: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Pincode"
                    value={address.pincode}
                    onChange={(e) =>
                      setAddress({ ...address, pincode: e.target.value })
                    }
                  />
                </div>
                <Input
                  placeholder="Phone Number"
                  value={address.phone}
                  onChange={(e) =>
                    setAddress({ ...address, phone: e.target.value })
                  }
                />
              </div>
            )}

            <Button
              onClick={() => setStep("payment")}
              className="w-full bg-[#0B2A4A] hover:bg-[#1E88FF] text-white rounded-xl py-3"
            >
              Continue to Payment
            </Button>
          </div>
        )}

        {/* Step 2: Payment */}
        {step === "payment" && (
          <div className="bg-white rounded-2xl shadow p-6 space-y-6">
            <h2 className="font-bold text-[#0B2A4A] text-lg">Payment Method</h2>

            {/* Order summary */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="font-semibold text-gray-700 mb-2">
                Order Summary
              </div>
              {cart.map((i) => (
                <div
                  key={i.productId}
                  className="flex justify-between text-sm text-gray-600 py-1"
                >
                  <span>
                    {i.productName} × {i.qty}
                  </span>
                  <span>₹{(i.price * i.qty).toLocaleString("en-IN")}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-[#0B2A4A] mt-2 pt-2 border-t">
                <span>Total</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="space-y-3">
              {(config.razorpayKeyId
                ? [["razorpay", "💳 Pay via Razorpay (UPI/Card)"]]
                : [
                    ["upi", "📲 UPI"],
                    ["card", "💳 Debit/Credit Card"],
                    ["cod", "💵 Cash on Delivery"],
                  ]
              ).map(([method, label]) => (
                <label
                  key={method}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer ${
                    paymentMethod === method
                      ? "border-[#0B2A4A] bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={paymentMethod === (method as PaymentMethod)}
                    onChange={() => setPaymentMethod(method as PaymentMethod)}
                  />
                  <span className="font-semibold text-[#0B2A4A]">{label}</span>
                </label>
              ))}
            </div>

            {paymentMethod === "upi" && (
              <div>
                <Label>UPI ID</Label>
                <Input
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="mt-1"
                />
              </div>
            )}

            {paymentMethod === "card" && (
              <div className="space-y-3">
                <div>
                  <Label>Card Number</Label>
                  <Input
                    placeholder="1234 5678 9012 3456"
                    value={card.number}
                    onChange={(e) =>
                      setCard({ ...card, number: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Expiry (MM/YY)</Label>
                    <Input
                      placeholder="12/28"
                      value={card.expiry}
                      onChange={(e) =>
                        setCard({ ...card, expiry: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>CVV</Label>
                    <Input
                      placeholder="123"
                      type="password"
                      value={card.cvv}
                      onChange={(e) =>
                        setCard({ ...card, cvv: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep("delivery")}
                className="flex-1 rounded-xl"
              >
                ← Back
              </Button>
              <Button
                onClick={placeOrder}
                disabled={placing}
                className="flex-1 bg-[#1E88FF] hover:bg-blue-600 text-white rounded-xl py-3 font-semibold"
              >
                {placing
                  ? "Placing Order..."
                  : `Place Order • ₹${total.toLocaleString("en-IN")}`}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === "confirm" && (
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-extrabold text-[#0B2A4A] mb-2">
              Order Placed!
            </h2>
            <p className="text-gray-500 mb-2">
              Your order has been successfully placed.
            </p>
            <div className="bg-gray-50 rounded-xl p-4 my-6">
              <div className="text-sm text-gray-500">Order ID</div>
              <div className="text-lg font-bold text-[#0B2A4A]">{orderId}</div>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => navigate("account")}
                className="bg-[#0B2A4A] hover:bg-[#1E88FF] text-white rounded-xl"
              >
                View My Orders
              </Button>
              <Button
                onClick={() => navigate("shop")}
                variant="outline"
                className="rounded-xl"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
