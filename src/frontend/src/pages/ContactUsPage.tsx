import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Youtube,
} from "lucide-react";
import { useState } from "react";

export function ContactUsPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div
        className="relative w-full h-48 md:h-64 bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage:
            "url('/assets/uploads/1774353229398-019d3a15-c257-750f-9a66-8798cd7598e4-1.png')",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <h1 className="relative text-3xl md:text-4xl font-bold text-white tracking-wide">
          Contact Us
        </h1>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Left — Info */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow p-6 flex gap-6">
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-[#008080] mb-2">
                    Address
                  </h2>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Name : </span>
                    <strong>Mr. Manashjoyti Barman</strong>
                  </p>
                  <p className="text-xs text-gray-500 italic ml-12">
                    ( Founder Manash PC World )
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    <span className="font-medium">Address : </span>
                    <strong>
                      Chamata, Nalbari, Assam, India Pin code - 781306
                    </strong>
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[#008080] mb-2">
                    Information
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Phone size={14} className="text-[#0B2A4A]" />
                    <span>
                      Phone Number: <strong>9678311414</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700 mt-1">
                    <Mail size={14} className="text-[#0B2A4A]" />
                    <span>
                      Email us :{" "}
                      <a
                        href="mailto:manashpcworld@zohomail.in"
                        className="text-blue-600 hover:underline"
                      >
                        manashpcworld@zohomail.in
                      </a>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700 mt-1">
                    <MapPin size={14} className="text-[#0B2A4A]" />
                    <span>Chamata, Nalbari, Assam - 781306</span>
                  </div>
                </div>
              </div>

              <div className="w-28 h-36 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                <img
                  src="/assets/uploads/picsart_26-03-20_17-21-03-596-019d37d3-67cb-70ae-b887-e779e514ed62-1.png"
                  alt="Mr. Manashjoyti Barman"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            </div>

            <div className="bg-[#0B2A4A] rounded-xl shadow p-6">
              <h2 className="text-lg font-bold text-white mb-4">Follow Us</h2>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-medium"
                >
                  <Youtube size={18} /> YouTube
                </a>
                <a
                  href="https://wa.me/919678311414"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition text-sm font-medium"
                >
                  <MessageCircle size={18} /> WhatsApp
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition text-sm font-medium"
                >
                  <Instagram size={18} /> Instagram
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                >
                  <Facebook size={18} /> Facebook
                </a>
              </div>
            </div>
          </div>

          {/* Right — Contact Form */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-[#0B2A4A] mb-1">
              Send a Message
            </h2>
            <p className="text-xs text-gray-500 mb-5">
              Note: Please fill out the fields marked with an asterisk.
            </p>

            {sent && (
              <div className="mb-4 bg-green-50 border border-green-300 text-green-700 text-sm rounded-lg px-4 py-3">
                Message sent successfully! We'll get back to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="cf-name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="cf-name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label
                  htmlFor="cf-email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="cf-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="cf-message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="cf-message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2A4A] resize-none"
                  placeholder="Write your message here..."
                />
              </div>

              <p className="text-xs text-gray-500">
                Our{" "}
                <span className="text-blue-600 cursor-pointer hover:underline">
                  Privacy Policy
                </span>{" "}
                applies.
              </p>

              <button
                type="submit"
                className="flex items-center gap-2 bg-[#0B2A4A] hover:bg-[#1E4A7A] text-white px-6 py-2 rounded-lg text-sm font-semibold transition"
              >
                <Send size={16} /> send
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Google Maps Embed */}
      <div className="max-w-5xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <MapPin size={20} className="text-[#0B2A4A]" />
            <h2 className="text-lg font-bold text-[#0B2A4A]">Our Location</h2>
          </div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3580.7!2d91.4398!3d26.4456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375a67c9b0b0b0b0%3A0x0!2sChamata%2C+Nalbari%2C+Assam+781306!5e0!3m2!1sen!2sin!4v1"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Our Location"
          />
        </div>
      </div>
    </div>
  );
}
