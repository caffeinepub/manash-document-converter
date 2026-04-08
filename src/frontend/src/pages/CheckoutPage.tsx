import { CheckCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Page } from "../App";
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

const STEPS = ["delivery", "payment"] as Step[];

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
      <div
        className="min-h-[60vh] flex flex-col items-center justify-center gap-4"
        style={{ background: "oklch(0.98 0.02 15)" }}
      >
        <p style={{ color: "oklch(0.55 0.02 250)" }}>Cart is empty</p>
        <button
          type="button"
          onClick={() => navigate("shop")}
          className="px-6 py-3 rounded-full font-semibold text-white"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.81 0.1 20), oklch(0.85 0.12 220))",
          }}
        >
          Go to Shop
        </button>
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

  const glassCard = {
    background: "oklch(1 0 0 / 0.82)",
    backdropFilter: "blur(10px)",
    border: "1px solid oklch(0.92 0.03 15)",
    boxShadow: "0 2px 16px oklch(0.81 0.1 20 / 0.08)",
  } as React.CSSProperties;

  const inputStyle = {
    borderRadius: "12px",
    border: "1.5px solid oklch(0.88 0.03 15)",
    background: "oklch(0.98 0.01 15)",
  } as React.CSSProperties;

  return (
    <div
      className="min-h-screen px-4 py-8"
      style={{ background: "oklch(0.98 0.02 15)" }}
    >
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-extrabold gradient-text-ios mb-6">
          Checkout
        </h1>

        {/* iOS-style progress bar */}
        {step !== "confirm" && (
          <div className="flex items-center gap-3 mb-8">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all duration-300"
                  style={
                    step === s
                      ? {
                          background:
                            "linear-gradient(135deg, oklch(0.81 0.1 20), oklch(0.85 0.12 220))",
                          color: "#fff",
                          boxShadow: "0 2px 8px oklch(0.81 0.1 20 / 0.4)",
                        }
                      : STEPS.indexOf(step) > i
                        ? {
                            background: "oklch(0.88 0.08 145)",
                            color: "oklch(0.4 0.12 145)",
                          }
                        : {
                            background: "oklch(0.92 0.02 250)",
                            color: "oklch(0.6 0.02 250)",
                          }
                  }
                >
                  {STEPS.indexOf(step) > i ? "✓" : i + 1}
                </div>
                <span
                  className="text-sm font-medium capitalize"
                  style={{
                    color:
                      step === s ? "oklch(0.81 0.1 20)" : "oklch(0.6 0.02 250)",
                    fontWeight: step === s ? 700 : 500,
                  }}
                >
                  {s}
                </span>
                {i < STEPS.length - 1 && (
                  <div
                    className="w-8 h-1 rounded-full"
                    style={{
                      background:
                        STEPS.indexOf(step) > i
                          ? "linear-gradient(90deg, oklch(0.81 0.1 20), oklch(0.85 0.12 220))"
                          : "oklch(0.9 0.02 250)",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Step 1: Delivery */}
        {step === "delivery" && (
          <div className="rounded-2xl p-6 space-y-6" style={glassCard}>
            <h2
              className="font-bold text-lg"
              style={{ color: "oklch(0.25 0.02 250)" }}
            >
              Delivery Option
            </h2>
            <div className="space-y-3">
              {(["pickup", "delivery"] as DeliveryType[]).map((dt) => (
                <label
                  key={dt}
                  data-ocid={`checkout.delivery_${dt}`}
                  className="flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200"
                  style={{
                    borderColor:
                      deliveryType === dt
                        ? "oklch(0.81 0.1 20)"
                        : "oklch(0.9 0.03 15)",
                    background:
                      deliveryType === dt
                        ? "oklch(0.95 0.04 15 / 0.5)"
                        : "transparent",
                  }}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value={dt}
                    checked={deliveryType === dt}
                    onChange={() => setDeliveryType(dt)}
                    className="mt-0.5 accent-pink-400"
                  />
                  <div>
                    <div
                      className="font-semibold"
                      style={{ color: "oklch(0.25 0.02 250)" }}
                    >
                      {dt === "pickup"
                        ? "🏪 Pickup from Store"
                        : "🚚 Home Delivery"}
                    </div>
                    <div
                      className="text-xs mt-0.5"
                      style={{ color: "oklch(0.55 0.02 250)" }}
                    >
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
                <h3
                  className="font-semibold"
                  style={{ color: "oklch(0.35 0.02 250)" }}
                >
                  Delivery Address
                </h3>
                <Input
                  placeholder="Full Name"
                  value={address.name}
                  onChange={(e) =>
                    setAddress({ ...address, name: e.target.value })
                  }
                  style={inputStyle}
                />
                <Input
                  placeholder="Street Address"
                  value={address.address}
                  onChange={(e) =>
                    setAddress({ ...address, address: e.target.value })
                  }
                  style={inputStyle}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="City"
                    value={address.city}
                    onChange={(e) =>
                      setAddress({ ...address, city: e.target.value })
                    }
                    style={inputStyle}
                  />
                  <Input
                    placeholder="Pincode"
                    value={address.pincode}
                    onChange={(e) =>
                      setAddress({ ...address, pincode: e.target.value })
                    }
                    style={inputStyle}
                  />
                </div>
                <Input
                  placeholder="Phone Number"
                  value={address.phone}
                  onChange={(e) =>
                    setAddress({ ...address, phone: e.target.value })
                  }
                  style={inputStyle}
                />
              </div>
            )}

            <button
              type="button"
              onClick={() => setStep("payment")}
              data-ocid="checkout.continue"
              className="w-full py-4 rounded-full font-semibold text-white transition-all duration-200"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.81 0.1 20), oklch(0.85 0.12 220))",
                boxShadow: "0 4px 16px oklch(0.81 0.1 20 / 0.3)",
              }}
            >
              Continue to Payment →
            </button>
          </div>
        )}

        {/* Step 2: Payment */}
        {step === "payment" && (
          <div className="rounded-2xl p-6 space-y-6" style={glassCard}>
            <h2
              className="font-bold text-lg"
              style={{ color: "oklch(0.25 0.02 250)" }}
            >
              Payment Method
            </h2>

            {/* Order summary */}
            <div
              className="rounded-2xl p-4"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.95 0.04 15 / 0.5), oklch(0.94 0.04 220 / 0.5))",
                border: "1px solid oklch(0.9 0.03 15)",
              }}
            >
              <div
                className="font-semibold mb-2 text-sm"
                style={{ color: "oklch(0.35 0.02 250)" }}
              >
                Order Summary
              </div>
              {cart.map((i) => (
                <div
                  key={i.productId}
                  className="flex justify-between text-sm py-1"
                  style={{ color: "oklch(0.55 0.02 250)" }}
                >
                  <span>
                    {i.productName} × {i.qty}
                  </span>
                  <span>₹{(i.price * i.qty).toLocaleString("en-IN")}</span>
                </div>
              ))}
              <div
                className="flex justify-between font-bold mt-2 pt-2 text-sm"
                style={{
                  borderTop: "1px solid oklch(0.88 0.03 15)",
                  color: "oklch(0.25 0.02 250)",
                }}
              >
                <span>Total</span>
                <span className="gradient-text-ios">
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* iOS radio card tiles */}
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
                  data-ocid={`checkout.payment_${method}`}
                  className="flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200"
                  style={{
                    borderColor:
                      paymentMethod === method
                        ? "oklch(0.81 0.1 20)"
                        : "oklch(0.9 0.03 15)",
                    background:
                      paymentMethod === method
                        ? "oklch(0.95 0.04 15 / 0.5)"
                        : "transparent",
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={paymentMethod === (method as PaymentMethod)}
                    onChange={() => setPaymentMethod(method as PaymentMethod)}
                    className="accent-pink-400"
                  />
                  <span
                    className="font-semibold text-sm"
                    style={{ color: "oklch(0.25 0.02 250)" }}
                  >
                    {label}
                  </span>
                </label>
              ))}
            </div>

            {paymentMethod === "upi" && (
              <div>
                <Label
                  className="text-sm font-medium"
                  style={{ color: "oklch(0.35 0.02 250)" }}
                >
                  UPI ID
                </Label>
                <Input
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="mt-1"
                  style={inputStyle}
                />
              </div>
            )}

            {paymentMethod === "card" && (
              <div className="space-y-3">
                <div>
                  <Label
                    className="text-sm font-medium"
                    style={{ color: "oklch(0.35 0.02 250)" }}
                  >
                    Card Number
                  </Label>
                  <Input
                    placeholder="1234 5678 9012 3456"
                    value={card.number}
                    onChange={(e) =>
                      setCard({ ...card, number: e.target.value })
                    }
                    className="mt-1"
                    style={inputStyle}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label
                      className="text-sm font-medium"
                      style={{ color: "oklch(0.35 0.02 250)" }}
                    >
                      Expiry (MM/YY)
                    </Label>
                    <Input
                      placeholder="12/28"
                      value={card.expiry}
                      onChange={(e) =>
                        setCard({ ...card, expiry: e.target.value })
                      }
                      className="mt-1"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <Label
                      className="text-sm font-medium"
                      style={{ color: "oklch(0.35 0.02 250)" }}
                    >
                      CVV
                    </Label>
                    <Input
                      placeholder="123"
                      type="password"
                      value={card.cvv}
                      onChange={(e) =>
                        setCard({ ...card, cvv: e.target.value })
                      }
                      className="mt-1"
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep("delivery")}
                className="flex-1 py-4 rounded-full font-semibold text-sm transition-all duration-200"
                style={{
                  background: "oklch(1 0 0 / 0.8)",
                  border: "1.5px solid oklch(0.88 0.04 15)",
                  color: "oklch(0.45 0.03 250)",
                }}
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={placeOrder}
                disabled={placing}
                data-ocid="checkout.place_order"
                className="flex-1 py-4 rounded-full font-semibold text-sm text-white transition-all duration-200"
                style={{
                  background: placing
                    ? "oklch(0.88 0.03 250)"
                    : "linear-gradient(135deg, oklch(0.81 0.1 20), oklch(0.85 0.12 220))",
                  boxShadow: placing
                    ? "none"
                    : "0 4px 16px oklch(0.81 0.1 20 / 0.35)",
                }}
              >
                {placing
                  ? "Placing..."
                  : `Place Order • ₹${total.toLocaleString("en-IN")}`}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === "confirm" && (
          <div className="rounded-2xl p-8 text-center" style={glassCard}>
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.88 0.08 145), oklch(0.82 0.12 145))",
                boxShadow: "0 4px 20px oklch(0.7 0.15 145 / 0.3)",
              }}
            >
              <CheckCircle
                size={40}
                style={{ color: "oklch(0.38 0.12 145)" }}
              />
            </div>
            <h2 className="text-2xl font-extrabold mb-2 gradient-text-ios">
              Order Placed! 🎉
            </h2>
            <p
              className="text-sm mb-6"
              style={{ color: "oklch(0.55 0.02 250)" }}
            >
              Your order has been successfully placed.
            </p>
            <div
              className="rounded-2xl p-4 mb-6"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.95 0.04 15 / 0.5), oklch(0.94 0.04 220 / 0.5))",
                border: "1px solid oklch(0.9 0.03 15)",
              }}
            >
              <div
                className="text-xs font-medium mb-1"
                style={{ color: "oklch(0.6 0.02 250)" }}
              >
                Order ID
              </div>
              <div
                className="text-lg font-bold"
                style={{ color: "oklch(0.25 0.02 250)" }}
              >
                {orderId}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => navigate("account")}
                className="w-full py-4 rounded-full font-semibold text-white"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.81 0.1 20), oklch(0.85 0.12 220))",
                  boxShadow: "0 4px 16px oklch(0.81 0.1 20 / 0.3)",
                }}
              >
                View My Orders
              </button>
              <button
                type="button"
                onClick={() => navigate("shop")}
                className="w-full py-4 rounded-full font-semibold text-sm"
                style={{
                  background: "oklch(1 0 0 / 0.8)",
                  border: "1.5px solid oklch(0.88 0.04 15)",
                  color: "oklch(0.45 0.03 250)",
                }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
