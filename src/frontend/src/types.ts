export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "electrical" | "internet-cafe" | "photo-binding";
  imageUrl: string;
  inStock: boolean;
}

export interface CartItem {
  productId: string;
  productName: string;
  price: number;
  qty: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  items: CartItem[];
  totalAmount: number;
  deliveryType: "pickup" | "delivery";
  deliveryAddress?: string;
  paymentMethod: "upi" | "card" | "cod" | "razorpay";
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

export interface CustomerSession {
  id: string;
  name: string;
  phone: string;
  email: string;
  isLoggedIn: boolean;
}

export interface AdminConfig {
  razorpayKeyId: string;
  razorpayKeySecret: string;
  shiprocketEmail: string;
  shiprocketPassword: string;
}

export const SEED_PRODUCTS: Product[] = [
  {
    id: "e1",
    name: "LED Bulb Pack 10W",
    description:
      "Energy-saving 10W LED bulb, pack of 4. Long lasting up to 25,000 hours.",
    price: 299,
    category: "electrical",
    imageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    inStock: true,
  },
  {
    id: "e2",
    name: "Ceiling Fan 48 inch",
    description:
      "High-speed 48 inch ceiling fan with 3 speed settings. Energy efficient motor.",
    price: 2499,
    category: "electrical",
    imageUrl:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80",
    inStock: true,
  },
  {
    id: "e3",
    name: "6-Socket Extension Board",
    description:
      "Heavy duty 6-socket extension board with surge protection and 5-meter cord.",
    price: 599,
    category: "electrical",
    imageUrl:
      "https://images.unsplash.com/photo-1625948515291-699e12b77e6d?w=400&q=80",
    inStock: true,
  },
  {
    id: "e4",
    name: "3-in-1 USB Charger",
    description:
      "Fast charging 3-in-1 USB charger compatible with all smartphones.",
    price: 349,
    category: "electrical",
    imageUrl:
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&q=80",
    inStock: true,
  },
  {
    id: "e5",
    name: "Smart WiFi Switch",
    description:
      "App-controlled smart switch. Works with Alexa and Google Home.",
    price: 1299,
    category: "electrical",
    imageUrl:
      "https://images.unsplash.com/photo-1558002038-1055907df827?w=400&q=80",
    inStock: true,
  },
  {
    id: "ic1",
    name: "1 Hour Internet Browsing",
    description:
      "High-speed internet access for 1 hour. Available at our internet cafe.",
    price: 30,
    category: "internet-cafe",
    imageUrl:
      "https://images.unsplash.com/photo-1606193144096-f18ab72e0a02?w=400&q=80",
    inStock: true,
  },
  {
    id: "ic2",
    name: "Gaming Session 2 Hours",
    description:
      "2-hour gaming session on our high-end gaming PCs with headphones.",
    price: 100,
    category: "internet-cafe",
    imageUrl:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80",
    inStock: true,
  },
  {
    id: "ic3",
    name: "Print / Scan per Page",
    description:
      "Color or black & white printing and scanning service per page.",
    price: 10,
    category: "internet-cafe",
    imageUrl:
      "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400&q=80",
    inStock: true,
  },
  {
    id: "pb1",
    name: "Spiral Binding",
    description:
      "Professional spiral binding for documents, reports, and presentations.",
    price: 150,
    category: "photo-binding",
    imageUrl:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80",
    inStock: true,
  },
  {
    id: "pb2",
    name: "A4 Lamination",
    description: "High gloss or matte lamination for A4 size documents.",
    price: 50,
    category: "photo-binding",
    imageUrl:
      "https://images.unsplash.com/photo-1596079890744-c1a0462d0975?w=400&q=80",
    inStock: true,
  },
  {
    id: "pb3",
    name: "4x6 Photo Print",
    description: "Vivid 4x6 inch photo prints on premium glossy paper.",
    price: 25,
    category: "photo-binding",
    imageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    inStock: true,
  },
];

export function getProducts(): Product[] {
  try {
    const stored = localStorage.getItem("products");
    if (stored) return JSON.parse(stored);
  } catch {}
  localStorage.setItem("products", JSON.stringify(SEED_PRODUCTS));
  return SEED_PRODUCTS;
}

export function saveProducts(products: Product[]) {
  localStorage.setItem("products", JSON.stringify(products));
}

export function getOrders(): Order[] {
  try {
    return JSON.parse(localStorage.getItem("orders") || "[]");
  } catch {
    return [];
  }
}

export function saveOrders(orders: Order[]) {
  localStorage.setItem("orders", JSON.stringify(orders));
}

export function getCustomerSession(): CustomerSession | null {
  try {
    return JSON.parse(localStorage.getItem("customerSession") || "null");
  } catch {
    return null;
  }
}

export function getAdminConfig(): AdminConfig {
  try {
    return JSON.parse(localStorage.getItem("adminConfig") || "{}");
  } catch {
    return {} as AdminConfig;
  }
}

// ─── Job Updates Types ───────────────────────────────────────────────────────

export interface Job {
  id: string;
  title: string;
  org: string;
  category: string;
  posts: string;
  lastDate: string;
  status: "Active" | "Result" | "Exam" | "Closed";
  type: string;
  description: string;
  applyLink: string;
}

export interface AdmitCard {
  id: string;
  title: string;
  date: string;
  link: string;
}

export interface JobResult {
  id: string;
  title: string;
  date: string;
  link: string;
}

export const SEED_JOBS: Job[] = [
  {
    id: "j1",
    title: "SSC CGL 2024 Recruitment",
    org: "Staff Selection Commission",
    category: "SSC",
    posts: "17727 Posts",
    lastDate: "31 Jul 2025",
    status: "Active",
    type: "Central Govt",
    description:
      "Combined Graduate Level Examination 2024. Graduate pass candidates can apply online.",
    applyLink: "https://ssc.gov.in",
  },
  {
    id: "j2",
    title: "RRB NTPC 2025 Recruitment",
    org: "Railway Recruitment Board",
    category: "Railway",
    posts: "11558 Posts",
    lastDate: "15 Aug 2025",
    status: "Active",
    type: "Central Govt",
    description:
      "Non-Technical Popular Categories recruitment for various railway zones across India.",
    applyLink: "https://indianrailways.gov.in",
  },
  {
    id: "j3",
    title: "IBPS PO 2025",
    org: "IBPS – Institute of Banking Personnel Selection",
    category: "Banking",
    posts: "4455 Posts",
    lastDate: "10 Aug 2025",
    status: "Active",
    type: "Banking Sector",
    description:
      "Probationary Officer recruitment for participating public sector banks.",
    applyLink: "https://ibps.in",
  },
  {
    id: "j4",
    title: "UP Police Constable 2025",
    org: "Uttar Pradesh Police Recruitment Board",
    category: "Police",
    posts: "60244 Posts",
    lastDate: "20 Jul 2025",
    status: "Active",
    type: "State Govt",
    description:
      "Constable Civil Police and PAC recruitment for Uttar Pradesh Police Department.",
    applyLink: "https://uppbpb.gov.in",
  },
  {
    id: "j5",
    title: "CTET July 2025",
    org: "Central Board of Secondary Education",
    category: "Teaching",
    posts: "Open",
    lastDate: "25 Jul 2025",
    status: "Active",
    type: "Central Govt",
    description:
      "Central Teacher Eligibility Test for Paper I (Class I-V) and Paper II (Class VI-VIII).",
    applyLink: "https://ctet.nic.in",
  },
  {
    id: "j6",
    title: "NDA & NA Exam II 2025",
    org: "Union Public Service Commission",
    category: "Defence",
    posts: "404 Posts",
    lastDate: "22 Jul 2025",
    status: "Active",
    type: "Central Govt",
    description:
      "National Defence Academy and Naval Academy Examination for Army, Navy and Air Force.",
    applyLink: "https://upsc.gov.in",
  },
  {
    id: "j7",
    title: "BPSC 70th CCE 2025",
    org: "Bihar Public Service Commission",
    category: "State PSC",
    posts: "1929 Posts",
    lastDate: "05 Aug 2025",
    status: "Active",
    type: "State Govt",
    description:
      "Bihar 70th Combined Competitive Examination for various Group A & B posts.",
    applyLink: "https://bpsc.bih.nic.in",
  },
  {
    id: "j8",
    title: "RRB Group D 2025",
    org: "Railway Recruitment Board",
    category: "Railway",
    posts: "32438 Posts",
    lastDate: "28 Jul 2025",
    status: "Active",
    type: "Central Govt",
    description:
      "Level-1 posts recruitment in various departments of Indian Railways.",
    applyLink: "https://indianrailways.gov.in",
  },
  {
    id: "j9",
    title: "SBI Clerk 2025 Junior Associate",
    org: "State Bank of India",
    category: "Banking",
    posts: "13735 Posts",
    lastDate: "18 Aug 2025",
    status: "Active",
    type: "Banking Sector",
    description:
      "Junior Associates (Customer Support & Sales) recruitment for SBI branches across India.",
    applyLink: "https://sbi.co.in",
  },
  {
    id: "j10",
    title: "UPSC Civil Services 2025",
    org: "Union Public Service Commission",
    category: "Govt Jobs",
    posts: "979 Posts",
    lastDate: "Closed – Result Awaited",
    status: "Result",
    type: "Central Govt",
    description:
      "IAS, IPS, IFS and allied services. Prelims held, Mains result awaited.",
    applyLink: "https://upsc.gov.in",
  },
  {
    id: "j11",
    title: "MP Police Constable 2025",
    org: "Madhya Pradesh Police Recruitment Board",
    category: "Police",
    posts: "7090 Posts",
    lastDate: "Closed – Exam Soon",
    status: "Exam",
    type: "State Govt",
    description:
      "MP Police Constable GD & Radio recruitment. Admit card available for download.",
    applyLink: "https://peb.mp.gov.in",
  },
  {
    id: "j12",
    title: "SSC MTS 2025",
    org: "Staff Selection Commission",
    category: "SSC",
    posts: "Open",
    lastDate: "12 Aug 2025",
    status: "Active",
    type: "Central Govt",
    description:
      "Multi-Tasking (Non-Technical) Staff & Havaldar (CBIC & CBN) Exam 2025.",
    applyLink: "https://ssc.gov.in",
  },
];

export const SEED_ADMIT_CARDS: AdmitCard[] = [
  {
    id: "ac1",
    title: "SSC CPO SI 2024 Admit Card",
    date: "Out Now",
    link: "#",
  },
  { id: "ac2", title: "RRB ALP 2024 Admit Card", date: "Out Now", link: "#" },
  {
    id: "ac3",
    title: "IBPS Clerk 2024 Admit Card",
    date: "Out Now",
    link: "#",
  },
  {
    id: "ac4",
    title: "UP Police 2024 Admit Card",
    date: "Expected Soon",
    link: "#",
  },
];

export const SEED_RESULTS: JobResult[] = [
  { id: "r1", title: "SSC CHSL 2024 Result", date: "Declared", link: "#" },
  { id: "r2", title: "UPSC NDA I 2025 Result", date: "Declared", link: "#" },
  { id: "r3", title: "SBI PO 2024 Final Result", date: "Declared", link: "#" },
  { id: "r4", title: "RRB NTPC 2024 Result", date: "Expected June", link: "#" },
];

export function getJobs(): Job[] {
  try {
    const stored = localStorage.getItem("jobs");
    if (stored) return JSON.parse(stored);
  } catch {}
  localStorage.setItem("jobs", JSON.stringify(SEED_JOBS));
  return SEED_JOBS;
}

export function saveJobs(jobs: Job[]) {
  localStorage.setItem("jobs", JSON.stringify(jobs));
}

export function getAdmitCards(): AdmitCard[] {
  try {
    const stored = localStorage.getItem("admitCards");
    if (stored) return JSON.parse(stored);
  } catch {}
  localStorage.setItem("admitCards", JSON.stringify(SEED_ADMIT_CARDS));
  return SEED_ADMIT_CARDS;
}

export function saveAdmitCards(cards: AdmitCard[]) {
  localStorage.setItem("admitCards", JSON.stringify(cards));
}

export function getResults(): JobResult[] {
  try {
    const stored = localStorage.getItem("jobResults");
    if (stored) return JSON.parse(stored);
  } catch {}
  localStorage.setItem("jobResults", JSON.stringify(SEED_RESULTS));
  return SEED_RESULTS;
}

export function saveResults(results: JobResult[]) {
  localStorage.setItem("jobResults", JSON.stringify(results));
}

// ─── Government Documents Admin Types ────────────────────────────────────────

export interface GovDocAdmin {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  hasGuide: boolean;
  actions: { label: string; url: string }[];
}

export const SEED_GOV_DOCS: GovDocAdmin[] = [
  {
    id: "aadhaar",
    title: "Aadhaar Card",
    subtitle: "UIDAI",
    description:
      "12-digit unique identity number issued by UIDAI for every Indian resident.",
    category: "Identity",
    hasGuide: true,
    actions: [
      { label: "Enroll / Update", url: "https://uidai.gov.in" },
      { label: "Download e-Aadhaar", url: "https://myaadhaar.uidai.gov.in" },
      {
        label: "Check Status",
        url: "https://resident.uidai.gov.in/check-aadhaar",
      },
    ],
  },
  {
    id: "pan",
    title: "PAN Card",
    subtitle: "Income Tax Dept",
    description:
      "Permanent Account Number — required for financial transactions and tax filing.",
    category: "Identity",
    hasGuide: true,
    actions: [
      {
        label: "Apply New PAN",
        url: "https://www.incometax.gov.in/iec/foportal/",
      },
      { label: "PAN Correction", url: "https://www.protean-tinpan.com" },
      { label: "Reprint PAN", url: "https://www.protean-tinpan.com" },
    ],
  },
  {
    id: "passport",
    title: "Passport",
    subtitle: "Ministry of External Affairs",
    description:
      "Official travel document for international travel issued by Government of India.",
    category: "Identity",
    hasGuide: false,
    actions: [
      { label: "Apply / Renew", url: "https://passportindia.gov.in" },
      {
        label: "Track Application",
        url: "https://passportindia.gov.in/AppOnlineProject/trackApplication/trackStatus",
      },
      { label: "Book Appointment", url: "https://passportindia.gov.in" },
    ],
  },
  {
    id: "voter-id",
    title: "Voter ID (EPIC)",
    subtitle: "Election Commission of India",
    description:
      "Electoral Photo Identity Card — required for voting in elections across India.",
    category: "Identity",
    hasGuide: false,
    actions: [
      { label: "Register as Voter", url: "https://voters.eci.gov.in" },
      { label: "Correction / Update", url: "https://voters.eci.gov.in" },
      { label: "Download e-EPIC", url: "https://voters.eci.gov.in" },
    ],
  },
  {
    id: "driving-licence",
    title: "Driving Licence",
    subtitle: "Parivahan Sewa",
    description:
      "Licence to operate motor vehicles on Indian roads. Also includes vehicle registration.",
    category: "Transport",
    hasGuide: true,
    actions: [
      { label: "Apply for DL", url: "https://parivahan.gov.in" },
      { label: "Renew Licence", url: "https://parivahan.gov.in" },
      { label: "Vehicle Registration (RC)", url: "https://parivahan.gov.in" },
    ],
  },
  {
    id: "birth-certificate",
    title: "Birth Certificate",
    subtitle: "Civil Registration System",
    description:
      "Official record of birth registered under the Registration of Births and Deaths Act.",
    category: "State Services",
    hasGuide: true,
    actions: [
      { label: "Apply Online", url: "https://crsorgi.gov.in" },
      { label: "Search Records", url: "https://crsorgi.gov.in" },
    ],
  },
  {
    id: "caste-certificate",
    title: "Caste / Income / Domicile",
    subtitle: "State Portals",
    description:
      "Certificates issued by state governments for caste, income, and domicile proof.",
    category: "State Services",
    hasGuide: false,
    actions: [
      { label: "Apply via UMANG", url: "https://web.umang.gov.in" },
      { label: "e-District Portal", url: "https://india.gov.in" },
    ],
  },
  {
    id: "ration-card",
    title: "Ration Card",
    subtitle: "National Food Security",
    description:
      "Document to avail subsidised food grains under the Public Distribution System.",
    category: "State Services",
    hasGuide: false,
    actions: [
      { label: "Apply / Update", url: "https://nfsa.gov.in" },
      { label: "e-KYC for Ration Card", url: "https://nfsa.gov.in" },
      { label: "Check Beneficiary List", url: "https://nfsa.gov.in" },
    ],
  },
  {
    id: "land-records",
    title: "Land Records (Bhulekh)",
    subtitle: "Revenue Dept",
    description:
      "Digital records of land ownership, mutation entries, and property details.",
    category: "Property",
    hasGuide: false,
    actions: [
      { label: "View Land Records", url: "https://bhulekh.mahabhumi.gov.in" },
      { label: "Apply for Mutation", url: "https://india.gov.in" },
    ],
  },
  {
    id: "gst",
    title: "GST Registration",
    subtitle: "GSTN Portal",
    description:
      "Goods and Services Tax registration for businesses above the turnover threshold.",
    category: "Business",
    hasGuide: false,
    actions: [
      { label: "New GST Registration", url: "https://www.gst.gov.in" },
      { label: "File Returns", url: "https://www.gst.gov.in" },
      { label: "Track Application", url: "https://www.gst.gov.in" },
    ],
  },
];

export function getGovDocs(): GovDocAdmin[] {
  try {
    const stored = localStorage.getItem("govDocs");
    if (stored) return JSON.parse(stored);
  } catch {}
  localStorage.setItem("govDocs", JSON.stringify(SEED_GOV_DOCS));
  return SEED_GOV_DOCS;
}

export function saveGovDocs(docs: GovDocAdmin[]): void {
  localStorage.setItem("govDocs", JSON.stringify(docs));
}

// ─── Contact Us Types ─────────────────────────────────────────────────────────

export interface ContactInfo {
  ownerName: string;
  ownerTitle: string;
  address: string;
  pincode: string;
  phone: string;
  email: string;
  youtubeUrl: string;
  whatsappNumber: string;
  instagramUrl: string;
  facebookUrl: string;
}

const DEFAULT_CONTACT_INFO: ContactInfo = {
  ownerName: "Mr. Manashjoyti Barman",
  ownerTitle: "Founder Manash PC World",
  address: "Chamata, Nalbari, Assam, India",
  pincode: "781306",
  phone: "9678311414",
  email: "manashpcworld@zohomail.in",
  youtubeUrl: "https://youtube.com",
  whatsappNumber: "919678311414",
  instagramUrl: "https://instagram.com",
  facebookUrl: "https://facebook.com",
};

export function getContactInfo(): ContactInfo {
  try {
    const stored = localStorage.getItem("contactInfo");
    if (stored) return { ...DEFAULT_CONTACT_INFO, ...JSON.parse(stored) };
  } catch {}
  return DEFAULT_CONTACT_INFO;
}

export function saveContactInfo(info: ContactInfo): void {
  localStorage.setItem("contactInfo", JSON.stringify(info));
}
