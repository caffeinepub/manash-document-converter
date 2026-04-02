import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  BookOpen,
  Building2,
  Car,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck,
  Globe,
  IndianRupee,
  Landmark,
  Link2,
  ListChecks,
  Search,
  ShieldCheck,
  Smartphone,
  Store,
  User,
  Wheat,
} from "lucide-react";
import { useState } from "react";
import { getGovDocs } from "../types";

type Category =
  | "All"
  | "Identity"
  | "Property"
  | "Business"
  | "Transport"
  | "State Services";

interface DocAction {
  label: string;
  url: string;
}

interface GovDoc {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: Category;
  icon: React.ReactNode;
  color: string;
  actions: DocAction[];
  hasGuide?: boolean;
}

// ─── Application Guide Data ───────────────────────────────────────────────────

interface GuideStep {
  title: string;
  detail: string;
}

interface FeeRow {
  service: string;
  fee: string;
}

interface OfficialLink {
  label: string;
  url: string;
  description: string;
}

interface ApplicationGuide {
  id: string;
  title: string;
  overview: string;
  applySteps: { heading: string; steps: GuideStep[] }[];
  documents: { category: string; items: string[] }[];
  fees: FeeRow[];
  processingTime: { service: string; time: string }[];
  notes?: string[];
  officialLinks: OfficialLink[];
}

const applicationGuides: ApplicationGuide[] = [
  {
    id: "aadhaar",
    title: "Aadhaar Card Application Guide",
    overview:
      "Aadhaar is a 12-digit unique identity number issued by UIDAI to every resident of India. It serves as proof of identity and address, and is mandatory for availing government subsidies, filing taxes, opening bank accounts, obtaining SIM cards, and numerous other services.",
    applySteps: [
      {
        heading: "New Aadhaar Enrollment",
        steps: [
          {
            title: "Find Enrollment Centre",
            detail:
              "Visit uidai.gov.in and use the 'Locate Enrolment Centre' feature to find a centre near you.",
          },
          {
            title: "Book Appointment",
            detail:
              "Book a slot online at appointments.uidai.gov.in or visit the centre directly (walk-in allowed at most centres).",
          },
          {
            title: "Visit Centre with Documents",
            detail:
              "Carry original documents for Proof of Identity and Proof of Address (any 1 from each list). Children under 5 need parent's Aadhaar.",
          },
          {
            title: "Biometric Capture",
            detail:
              "Your fingerprints, iris scan, and photograph will be captured at the centre by the operator.",
          },
          {
            title: "Receive Enrollment ID (EID)",
            detail:
              "You will receive a 28-digit Enrollment ID slip. Store this safely — it is used to track your Aadhaar status.",
          },
          {
            title: "Download e-Aadhaar",
            detail:
              "After 90 days, download your e-Aadhaar from myaadhaar.uidai.gov.in using your EID or mobile number.",
          },
        ],
      },
      {
        heading: "Updating Aadhaar Details",
        steps: [
          {
            title: "Online Update (Name / Address)",
            detail:
              "Visit myaadhaar.uidai.gov.in → 'Update Your Aadhaar' → Login with mobile OTP → Select field → Upload supporting document.",
          },
          {
            title: "Offline Update (any field)",
            detail:
              "Visit your nearest Aadhaar Seva Kendra or enrollment centre with original supporting documents.",
          },
          {
            title: "Date of Birth Correction",
            detail:
              "DOB can only be corrected once. Visit an enrollment centre with valid proof (birth certificate, school certificate, passport).",
          },
        ],
      },
    ],
    documents: [
      {
        category: "Proof of Identity (any 1)",
        items: [
          "Passport",
          "PAN Card",
          "Voter ID / EPIC",
          "Driving Licence",
          "Government Employee Photo ID",
          "NREGS Job Card",
        ],
      },
      {
        category: "Proof of Address (any 1)",
        items: [
          "Utility Bill (Electricity, Water, Gas — not older than 3 months)",
          "Bank Passbook / Statement (last 3 months)",
          "Rental / Lease Agreement",
          "Passport (with address)",
          "Voter ID (with address)",
          "Aadhaar Letter from UIDAI",
        ],
      },
    ],
    fees: [
      { service: "New Enrollment", fee: "Free" },
      { service: "Aadhaar Update (online)", fee: "₹50" },
      { service: "Aadhaar Update (offline)", fee: "₹100" },
      { service: "e-Aadhaar Download", fee: "Free" },
    ],
    processingTime: [
      { service: "New Enrollment", time: "Up to 90 days" },
      { service: "Address / Name Update", time: "30 days" },
      { service: "e-Aadhaar Download (after generation)", time: "Instant" },
    ],
    notes: [
      "Aadhaar enrollment is mandatory for all residents, including NRIs.",
      "Children's biometrics are updated at age 5 and 15 (mandatory).",
      "Lost Aadhaar can be retrieved online using registered mobile number.",
    ],
    officialLinks: [
      {
        label: "UIDAI Official Portal",
        url: "https://uidai.gov.in",
        description: "Enroll, update, and manage your Aadhaar",
      },
      {
        label: "myAadhaar Portal",
        url: "https://myaadhaar.uidai.gov.in",
        description: "Self-service portal for Aadhaar updates",
      },
      {
        label: "Locate Enrollment Centre",
        url: "https://uidai.gov.in/en/ecosystem/enrolment-ecosystem/find-enrolment-centre.html",
        description: "Find nearest Aadhaar Seva Kendra",
      },
      {
        label: "Check Aadhaar Status",
        url: "https://resident.uidai.gov.in/check-aadhaar",
        description: "Track enrollment status using EID",
      },
    ],
  },
  {
    id: "pan",
    title: "PAN Card Application Guide",
    overview:
      "PAN (Permanent Account Number) is a 10-digit alphanumeric code issued by the Income Tax Department of India. It is mandatory for filing income tax returns, opening bank accounts, financial transactions above ₹50,000, buying/selling property, and more.",
    applySteps: [
      {
        heading: "Apply for Physical PAN Card",
        steps: [
          {
            title: "Visit Official Portal",
            detail:
              "Go to incometaxindia.gov.in or the Protean (formerly NSDL) portal at protean-tinpan.com or UTI Infrastructure.",
          },
          {
            title: "Fill Application Form",
            detail:
              "Indian citizens: Fill Form 49A. Foreign citizens/entities: Fill Form 49AA. Available online on both portals.",
          },
          {
            title: "Upload Documents",
            detail:
              "Upload scanned copies of Proof of Identity, Proof of Address, Proof of Date of Birth, and 2 passport-size photographs.",
          },
          {
            title: "Pay the Fee Online",
            detail:
              "Pay ₹93 (Indian address) or ₹864 (foreign address) via credit/debit card, net banking, or UPI.",
          },
          {
            title: "Submit & Get Acknowledgement",
            detail:
              "After submission, you will receive a 15-digit acknowledgement number. Use this to track your application status.",
          },
          {
            title: "Receive PAN Card",
            detail:
              "Physical PAN card will be delivered to your registered address within 15–20 working days by post.",
          },
        ],
      },
      {
        heading: "Instant e-PAN (Free & Instant)",
        steps: [
          {
            title: "Visit Income Tax Portal",
            detail: "Go to incometaxindia.gov.in and click on 'Instant e-PAN'.",
          },
          {
            title: "Enter Aadhaar Number",
            detail:
              "Enter your Aadhaar number. Your Aadhaar must be linked to your mobile number for OTP verification.",
          },
          {
            title: "OTP Verification",
            detail:
              "Enter the OTP received on your Aadhaar-linked mobile number.",
          },
          {
            title: "Download e-PAN PDF",
            detail:
              "Your e-PAN is generated instantly. Download the PDF — it is a valid PAN card accepted everywhere.",
          },
        ],
      },
    ],
    documents: [
      {
        category: "Proof of Identity (any 1)",
        items: [
          "Aadhaar Card",
          "Passport",
          "Voter ID / EPIC",
          "Driving Licence",
          "Photo ID card issued by Central/State Government",
        ],
      },
      {
        category: "Proof of Address (any 1)",
        items: [
          "Aadhaar Card",
          "Passport",
          "Voter ID",
          "Driving Licence",
          "Utility Bill (not older than 3 months)",
          "Bank Account Statement",
        ],
      },
      {
        category: "Proof of Date of Birth (any 1)",
        items: [
          "Birth Certificate",
          "Matriculation Certificate",
          "Passport",
          "Aadhaar Card",
          "Driving Licence",
        ],
      },
      {
        category: "Other Requirements",
        items: [
          "2 recent passport-size colour photographs",
          "Mobile number linked to Aadhaar (for e-PAN)",
        ],
      },
    ],
    fees: [
      { service: "Physical PAN (Indian address)", fee: "₹93" },
      { service: "Physical PAN (Foreign address)", fee: "₹864" },
      { service: "Instant e-PAN (via Aadhaar)", fee: "Free" },
      { service: "PAN Correction / Reprint", fee: "₹93" },
    ],
    processingTime: [
      { service: "Physical PAN Card", time: "15–20 working days" },
      { service: "Instant e-PAN", time: "Instant" },
      { service: "PAN Correction", time: "15–20 working days" },
    ],
    notes: [
      "e-PAN is valid and accepted just like a physical PAN card.",
      "Linking Aadhaar with PAN is mandatory as per Income Tax Act.",
      "Duplicate/multiple PAN cards attract a penalty of ₹10,000.",
    ],
    officialLinks: [
      {
        label: "Income Tax India Portal",
        url: "https://www.incometax.gov.in",
        description: "Official IT portal — apply for e-PAN, link Aadhaar",
      },
      {
        label: "Protean (NSDL) PAN Portal",
        url: "https://www.protean-tinpan.com",
        description: "Apply/reprint PAN via NSDL",
      },
      {
        label: "UTI Infrastructure",
        url: "https://www.utiitsl.com/UTIITSL_SITE/pan",
        description: "Apply/reprint PAN via UTI",
      },
      {
        label: "Instant e-PAN",
        url: "https://eportal.incometax.gov.in/iec/foservices/#/pre-login/instant-e-pan",
        description: "Get e-PAN instantly using Aadhaar OTP",
      },
    ],
  },
  {
    id: "driving-licence",
    title: "Driving Licence Application Guide",
    overview:
      "A Driving Licence (DL) is a mandatory document to legally operate motor vehicles on Indian roads. Categories include LMV (Light Motor Vehicle — car), MCWG (Motorcycle with gear), MCWOG (without gear), HMV (Heavy Motor Vehicle — trucks), and more. Apply through Parivahan Sewa portal.",
    applySteps: [
      {
        heading: "Step 1: Get Learner's Licence (LL)",
        steps: [
          {
            title: "Apply Online at Parivahan",
            detail:
              "Visit parivahan.gov.in → 'Sarathi Parivahan' → Select your state → Apply for Learner's Licence.",
          },
          {
            title: "Fill Form & Upload Documents",
            detail:
              "Fill Form 1 (medical fitness) and Form 2 (LL application). Upload age proof, address proof, and photos.",
          },
          {
            title: "Pay Fee & Book Test Slot",
            detail:
              "Pay LL fee (₹150–200) online and book your test slot at the RTO.",
          },
          {
            title: "Appear for LL Test",
            detail:
              "Take an online/computer-based test on basic road rules and traffic signs at the RTO. Pass to receive your Learner's Licence.",
          },
        ],
      },
      {
        heading: "Step 2: Apply for Permanent Driving Licence",
        steps: [
          {
            title: "Wait 30 Days After LL",
            detail:
              "After getting your Learner's Licence, you must wait at least 30 days before applying for the permanent DL.",
          },
          {
            title: "Apply Online for Permanent DL",
            detail:
              "Visit parivahan.gov.in → Apply for Driving Licence → Upload LL number and required documents.",
          },
          {
            title: "Pay Fee & Book Driving Test Slot",
            detail:
              "Pay the Permanent DL fee (₹200–300) and book your driving test date at the RTO.",
          },
          {
            title: "Appear for Driving Test at RTO",
            detail:
              "Take your vehicle to the RTO on the scheduled date. A motor vehicle inspector will test your driving skills.",
          },
          {
            title: "Receive Driving Licence",
            detail:
              "If you pass the test, your DL will be issued within 1–3 weeks and delivered to your address.",
          },
        ],
      },
    ],
    documents: [
      {
        category: "Age Proof (any 1)",
        items: [
          "Birth Certificate",
          "PAN Card",
          "Passport",
          "Matriculation Certificate (Class 10)",
          "Aadhaar Card",
        ],
      },
      {
        category: "Address Proof (any 1)",
        items: [
          "Aadhaar Card",
          "Utility Bill (Electricity/Gas — not older than 3 months)",
          "Voter ID",
          "Passport",
          "Bank Passbook",
        ],
      },
      {
        category: "Other Documents",
        items: [
          "3 recent passport-size colour photographs",
          "Learner's Licence copy (for Permanent DL)",
          "Medical Certificate — Form 1A (for commercial/transport vehicles)",
          "Form 1 — Medical Fitness Declaration",
        ],
      },
    ],
    fees: [
      { service: "Learner's Licence (per class)", fee: "₹150–200" },
      { service: "Permanent DL (per class)", fee: "₹200–300" },
      { service: "Driving Licence Renewal", fee: "₹200–300" },
      { service: "Duplicate DL", fee: "₹200" },
      { service: "Address Change", fee: "₹200" },
    ],
    processingTime: [
      { service: "Learner's Licence", time: "Same day (at RTO)" },
      { service: "Permanent DL (after test)", time: "1–3 weeks" },
      { service: "Renewal", time: "1–2 weeks" },
    ],
    notes: [
      "Fees vary by state and vehicle category.",
      "You must hold LL for at least 30 days before applying for Permanent DL.",
      "Learner's Licence is valid for 6 months from the date of issue.",
      "For HMV/transport vehicles, minimum age is 18 years.",
    ],
    officialLinks: [
      {
        label: "Parivahan Sewa",
        url: "https://parivahan.gov.in",
        description: "Apply LL/DL, renew, duplicate, address change",
      },
      {
        label: "Sarathi Parivahan",
        url: "https://sarathi.parivahan.gov.in",
        description: "Driving licence services portal",
      },
      {
        label: "mParivahan App",
        url: "https://mparivahan.in",
        description: "Mobile app for virtual DL and vehicle RC",
      },
      {
        label: "Vehicle Registration (RC)",
        url: "https://vahan.parivahan.gov.in",
        description: "VAHAN portal for vehicle registration services",
      },
    ],
  },
  {
    id: "birth-certificate",
    title: "Birth Certificate Application Guide",
    overview:
      "A Birth Certificate is an official government document that records and certifies the birth of a person. It is mandatory for school admission, obtaining a passport, marriage registration, Aadhaar enrollment, voter ID, and other identity documents. Issued under the Registration of Births and Deaths Act, 1969.",
    applySteps: [
      {
        heading: "Hospital Birth (within 21 days)",
        steps: [
          {
            title: "Auto-Registration at Hospital",
            detail:
              "Births in hospitals/nursing homes are usually auto-registered by the hospital with the local municipal authority within 21 days.",
          },
          {
            title: "Collect Certificate",
            detail:
              "Parents can collect the birth certificate from the hospital or the local Municipal Corporation / Gram Panchayat office.",
          },
          {
            title: "Verify Details",
            detail:
              "Verify all details (name, date of birth, parents' names) carefully. Corrections require a formal application.",
          },
        ],
      },
      {
        heading: "Late Registration (after 21 days)",
        steps: [
          {
            title: "Visit Local Authority Office",
            detail:
              "Go to your local Municipal Corporation, Municipal Council, or Gram Panchayat office based on your area.",
          },
          {
            title: "Fill Application Form",
            detail:
              "Obtain and fill the birth registration application form. Submit with all required supporting documents.",
          },
          {
            title: "Pay Late Registration Fine",
            detail:
              "If registering after 21 days, a late fee is charged. Registration after 1 year requires an order from the Executive Magistrate.",
          },
          {
            title: "Verification & Issuance",
            detail:
              "The authority will verify the documents and issue the birth certificate within 7–21 working days.",
          },
        ],
      },
      {
        heading: "Online Application via crsorgi.gov.in",
        steps: [
          {
            title: "Visit CRS Portal",
            detail:
              "Go to crsorgi.gov.in — the Central Registration System portal.",
          },
          {
            title: "Select State & Register",
            detail:
              "Select your state → Register a new birth event → Fill in all details of the child and parents.",
          },
          {
            title: "Submit & Get Reference Number",
            detail:
              "Submit the form and note the reference/acknowledgement number for tracking.",
          },
          {
            title: "Download Certificate",
            detail:
              "Once approved, download the birth certificate from the portal or collect from your local authority.",
          },
        ],
      },
    ],
    documents: [
      {
        category: "Required Documents",
        items: [
          "Hospital Discharge Summary / Birth Report from hospital",
          "Parents' Aadhaar Card / Voter ID / Passport",
          "Proof of Residential Address",
          "Declaration / Affidavit from parents (notarized for late registration)",
          "Marriage Certificate of parents (in some states)",
        ],
      },
      {
        category: "For Late Registration (>1 year)",
        items: [
          "Sworn affidavit from parents/guardian",
          "School admission record mentioning date of birth",
          "Order from Executive Magistrate (First Class)",
          "Any other proof of date of birth",
        ],
      },
    ],
    fees: [
      { service: "Registration within 21 days", fee: "Free" },
      { service: "Late registration (21 days to 1 year)", fee: "₹50–100" },
      { service: "Very late registration (>1 year)", fee: "₹100 + fine" },
      { service: "Certified copy / duplicate", fee: "₹50–100" },
    ],
    processingTime: [
      { service: "Registration at hospital (timely)", time: "7–21 days" },
      { service: "Late registration at office", time: "7–21 working days" },
      { service: "Online (CRS portal)", time: "Varies by state" },
    ],
    notes: [
      "Birth registration is mandatory within 21 days of birth in India.",
      "DigiLocker includes birth certificates if already registered digitally.",
      "Each state may have its own portal (e.g., MahaBMS for Maharashtra).",
      "UMANG App also provides birth certificate services for select states.",
    ],
    officialLinks: [
      {
        label: "CRS Online (Central)",
        url: "https://crsorgi.gov.in",
        description: "Central Registration System for births and deaths",
      },
      {
        label: "DigiLocker",
        url: "https://digilocker.gov.in",
        description: "Access your registered birth certificate digitally",
      },
      {
        label: "UMANG App",
        url: "https://web.umang.gov.in",
        description: "Unified government services app",
      },
      {
        label: "India.gov.in",
        url: "https://india.gov.in",
        description: "Find your state's birth certificate portal",
      },
    ],
  },
];

// ─── Document List ──────────────────────────────────────────────────────────

const govDocs: GovDoc[] = [
  {
    id: "aadhaar",
    title: "Aadhaar Card",
    subtitle: "UIDAI",
    description:
      "12-digit unique identity number issued by UIDAI for every Indian resident.",
    category: "Identity",
    icon: <User size={28} />,
    color: "bg-orange-50 text-orange-600 border-orange-200",
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
    icon: <FileCheck size={28} />,
    color: "bg-blue-50 text-blue-600 border-blue-200",
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
    icon: <Globe size={28} />,
    color: "bg-indigo-50 text-indigo-600 border-indigo-200",
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
    icon: <ShieldCheck size={28} />,
    color: "bg-green-50 text-green-600 border-green-200",
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
    icon: <Car size={28} />,
    color: "bg-yellow-50 text-yellow-600 border-yellow-200",
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
    icon: <BookOpen size={28} />,
    color: "bg-pink-50 text-pink-600 border-pink-200",
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
    icon: <Landmark size={28} />,
    color: "bg-purple-50 text-purple-600 border-purple-200",
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
    icon: <Wheat size={28} />,
    color: "bg-amber-50 text-amber-600 border-amber-200",
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
    icon: <Building2 size={28} />,
    color: "bg-teal-50 text-teal-600 border-teal-200",
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
    icon: <Store size={28} />,
    color: "bg-cyan-50 text-cyan-600 border-cyan-200",
    actions: [
      { label: "New GST Registration", url: "https://www.gst.gov.in" },
      { label: "File Returns", url: "https://www.gst.gov.in" },
      { label: "Track Application", url: "https://www.gst.gov.in" },
    ],
  },
];

const usefulLinks = [
  {
    label: "DigiLocker",
    desc: "Store & share official documents",
    url: "https://digilocker.gov.in",
    icon: "📂",
  },
  {
    label: "UMANG App",
    desc: "Unified govt services app",
    url: "https://web.umang.gov.in",
    icon: "📱",
  },
  {
    label: "mParivahan",
    desc: "Vehicle & DL services",
    url: "https://mparivahan.in",
    icon: "🚗",
  },
  {
    label: "NIC India",
    desc: "National Informatics Centre",
    url: "https://nic.in",
    icon: "🖥️",
  },
  {
    label: "India.gov.in",
    desc: "Official India portal",
    url: "https://india.gov.in",
    icon: "🇮🇳",
  },
  {
    label: "NDSL / Protean",
    desc: "PAN & TAN services",
    url: "https://www.protean-tinpan.com",
    icon: "📋",
  },
];

const categories: Category[] = [
  "All",
  "Identity",
  "Property",
  "Business",
  "Transport",
  "State Services",
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function StepCircle({ number }: { number: number }) {
  return (
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1E88FF] text-white flex items-center justify-center text-sm font-bold shadow-sm">
      {number}
    </div>
  );
}

function GuideDetailView({
  guide,
  onBack,
}: {
  guide: ApplicationGuide;
  onBack: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-blue-100 shadow-md overflow-hidden">
      {/* Guide Header */}
      <div className="bg-gradient-to-r from-[#0B2A4A] to-[#1565C0] px-6 py-5">
        <button
          type="button"
          onClick={onBack}
          data-ocid="gov.guide.button"
          className="flex items-center gap-2 text-blue-200 hover:text-white text-sm mb-4 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to All Documents
        </button>
        <h2 className="text-xl md:text-2xl font-bold text-white">
          {guide.title}
        </h2>
        <p className="text-blue-200 text-sm mt-2 leading-relaxed max-w-3xl">
          {guide.overview}
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="apply" className="p-5 md:p-6">
        <TabsList className="flex flex-wrap gap-1 h-auto bg-gray-100 p-1 rounded-xl mb-6">
          <TabsTrigger
            value="apply"
            className="flex items-center gap-1.5 text-xs md:text-sm data-[state=active]:bg-[#0B2A4A] data-[state=active]:text-white"
            data-ocid="gov.guide.tab"
          >
            <ListChecks size={14} /> How to Apply
          </TabsTrigger>
          <TabsTrigger
            value="docs"
            className="flex items-center gap-1.5 text-xs md:text-sm data-[state=active]:bg-[#0B2A4A] data-[state=active]:text-white"
            data-ocid="gov.guide.tab"
          >
            <FileCheck size={14} /> Documents Required
          </TabsTrigger>
          <TabsTrigger
            value="fees"
            className="flex items-center gap-1.5 text-xs md:text-sm data-[state=active]:bg-[#0B2A4A] data-[state=active]:text-white"
            data-ocid="gov.guide.tab"
          >
            <IndianRupee size={14} /> Fees & Timeline
          </TabsTrigger>
          <TabsTrigger
            value="links"
            className="flex items-center gap-1.5 text-xs md:text-sm data-[state=active]:bg-[#0B2A4A] data-[state=active]:text-white"
            data-ocid="gov.guide.tab"
          >
            <Link2 size={14} /> Official Links
          </TabsTrigger>
        </TabsList>

        {/* How to Apply */}
        <TabsContent value="apply" className="space-y-8 mt-0">
          {guide.applySteps.map((section) => (
            <div key={section.heading}>
              <h3 className="text-base font-bold text-[#0B2A4A] mb-4 pb-2 border-b border-blue-100">
                {section.heading}
              </h3>
              <ol className="space-y-4">
                {section.steps.map((step, i) => (
                  <li key={step.title} className="flex gap-4">
                    <StepCircle number={i + 1} />
                    <div className="flex-1 pt-0.5">
                      <p className="font-semibold text-gray-900 text-sm">
                        {step.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                        {step.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </TabsContent>

        {/* Documents Required */}
        <TabsContent value="docs" className="space-y-6 mt-0">
          {guide.documents.map((docGroup) => (
            <div key={docGroup.category}>
              <h3 className="text-sm font-bold text-[#0B2A4A] mb-3 pb-2 border-b border-blue-100 uppercase tracking-wide">
                {docGroup.category}
              </h3>
              <ul className="space-y-2">
                {docGroup.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2
                      size={16}
                      className="text-green-500 mt-0.5 flex-shrink-0"
                    />
                    <span className="text-sm text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </TabsContent>

        {/* Fees & Timeline */}
        <TabsContent value="fees" className="mt-0">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Fees */}
            <div>
              <h3 className="text-sm font-bold text-[#0B2A4A] mb-3 flex items-center gap-2">
                <IndianRupee size={15} /> Fee Structure
              </h3>
              <div className="rounded-xl overflow-hidden border border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#0B2A4A] text-white">
                      <th className="text-left px-4 py-2.5 font-semibold">
                        Service
                      </th>
                      <th className="text-right px-4 py-2.5 font-semibold">
                        Fee
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {guide.fees.map((row, i) => (
                      <tr
                        key={row.service}
                        className={i % 2 === 0 ? "bg-white" : "bg-blue-50"}
                      >
                        <td className="px-4 py-2.5 text-gray-700">
                          {row.service}
                        </td>
                        <td className="px-4 py-2.5 text-right font-semibold text-[#0B2A4A]">
                          {row.fee}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Processing Time */}
            <div>
              <h3 className="text-sm font-bold text-[#0B2A4A] mb-3 flex items-center gap-2">
                <Clock size={15} /> Processing Time
              </h3>
              <div className="space-y-3">
                {guide.processingTime.map((row) => (
                  <div
                    key={row.service}
                    className="flex items-center justify-between p-3 rounded-xl border border-gray-200 bg-white"
                  >
                    <span className="text-sm text-gray-700">{row.service}</span>
                    <Badge className="bg-[#1E88FF] text-white border-0 text-xs">
                      {row.time}
                    </Badge>
                  </div>
                ))}
              </div>

              {/* Notes */}
              {guide.notes && guide.notes.length > 0 && (
                <div className="mt-5 p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <p className="text-xs font-bold text-amber-800 mb-2 uppercase tracking-wide">
                    ⚠️ Important Notes
                  </p>
                  <ul className="space-y-1.5">
                    {guide.notes.map((note) => (
                      <li
                        key={note}
                        className="text-xs text-amber-700 leading-relaxed"
                      >
                        • {note}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Official Links */}
        <TabsContent value="links" className="mt-0">
          <div className="grid sm:grid-cols-2 gap-4">
            {guide.officialLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 hover:border-[#1E88FF] hover:bg-blue-50 transition-all group"
                data-ocid="gov.guide.link"
              >
                <div className="w-9 h-9 rounded-lg bg-[#0B2A4A] flex items-center justify-center flex-shrink-0 group-hover:bg-[#1E88FF] transition-colors">
                  <ExternalLink size={16} className="text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-[#1E88FF] transition-colors">
                    {link.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    {link.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function GovDocumentsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [activeGuideId, setActiveGuideId] = useState<string | null>(null);

  // Merge managed docs (from admin panel) with the static icon/color data
  const managedDocs = getGovDocs();
  const mergedDocs = govDocs.map((doc) => {
    const managed = managedDocs.find((m) => m.id === doc.id);
    if (!managed) return doc;
    return {
      ...doc,
      title: managed.title,
      subtitle: managed.subtitle,
      description: managed.description,
      category: managed.category as typeof doc.category,
      hasGuide: managed.hasGuide,
      actions: managed.actions,
    };
  });

  const activeGuide = activeGuideId
    ? (applicationGuides.find((g) => g.id === activeGuideId) ?? null)
    : null;

  const filtered = mergedDocs.filter((doc) => {
    const matchesSearch =
      search === "" ||
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.subtitle.toLowerCase().includes(search.toLowerCase()) ||
      doc.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || doc.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main
      className="min-h-screen"
      style={{ background: "oklch(0.12 0.03 250)" }}
    >
      {/* Hero Section */}
      <section
        className="py-12 px-4 animate-fade-in-up"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.14 0.04 250) 0%, oklch(0.18 0.06 260) 100%)",
          borderBottom: "1px solid oklch(0.25 0.06 250)",
        }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-4xl">🏛️</span>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-display gradient-text-gold">
              Government Documents Portal
            </h1>
          </div>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto mb-8">
            Find, apply, and manage all your official Indian government
            documents in one place. Direct links to official portals — safe,
            quick, and trusted.
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              type="text"
              placeholder="Search documents (e.g. Aadhaar, Passport, Ration Card...)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white text-gray-900 border-0 h-12 rounded-xl text-base"
              data-ocid="gov.search_input"
            />
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="bg-white border-b border-gray-200 sticky top-[88px] z-10">
        <div className="max-w-5xl mx-auto px-4 overflow-x-auto">
          <div className="flex gap-1 py-3 min-w-max">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                data-ocid={`gov.${cat.toLowerCase().replace(" ", "_")}.tab`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-[#0B2A4A] text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Doc Grid OR Guide Detail */}
          <div className="flex-1 min-w-0">
            {activeGuide ? (
              <GuideDetailView
                guide={activeGuide}
                onBack={() => setActiveGuideId(null)}
              />
            ) : filtered.length === 0 ? (
              <div
                className="text-center py-16 text-gray-400"
                data-ocid="gov.empty_state"
              >
                <span className="text-5xl block mb-3">🔍</span>
                <p className="text-lg font-medium">No documents found</p>
                <p className="text-sm mt-1">
                  Try a different search term or category
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {filtered.map((doc, idx) => (
                  <Card
                    key={doc.id}
                    className="border border-gray-200 hover:shadow-md transition-shadow"
                    data-ocid={`gov.item.${idx + 1}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3">
                        <div className={`p-2.5 rounded-xl border ${doc.color}`}>
                          {doc.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base font-bold text-gray-900 leading-snug">
                            {doc.title}
                          </CardTitle>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {doc.subtitle}
                          </p>
                          <Badge variant="outline" className="mt-1.5 text-xs">
                            {doc.category}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                        {doc.description}
                      </p>

                      {/* Application Guide Button (for 4 docs) */}
                      {doc.hasGuide && (
                        <Button
                          size="sm"
                          className="w-full mb-3 bg-[#1E88FF] hover:bg-[#1565C0] text-white font-semibold text-xs h-9"
                          onClick={() => setActiveGuideId(doc.id)}
                          data-ocid={`gov.${doc.id}.button`}
                        >
                          <BookOpen size={13} className="mr-1.5" />
                          Application Guide
                        </Button>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {doc.actions.map((action) => (
                          <Button
                            key={action.label}
                            variant="outline"
                            size="sm"
                            asChild
                            className="text-[#0B2A4A] border-[#0B2A4A] hover:bg-[#0B2A4A] hover:text-white transition-colors text-xs h-8"
                          >
                            <a
                              href={action.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink size={11} className="mr-1" />
                              {action.label}
                            </a>
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar: Useful Links */}
          <aside className="lg:w-72 shrink-0">
            <div className="bg-white border border-gray-200 rounded-xl p-5 sticky top-40">
              <h2 className="font-bold text-[#0B2A4A] text-base mb-4 flex items-center gap-2">
                <Smartphone size={16} />
                Useful Portals & Apps
              </h2>
              <div className="space-y-3">
                {usefulLinks.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group"
                  >
                    <span className="text-xl">{link.icon}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 group-hover:text-[#1E88FF] transition-colors">
                        {link.label}
                      </p>
                      <p className="text-xs text-gray-500">{link.desc}</p>
                    </div>
                    <ExternalLink
                      size={12}
                      className="ml-auto text-gray-300 group-hover:text-[#1E88FF] shrink-0"
                    />
                  </a>
                ))}
              </div>

              <div className="mt-5 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs text-blue-700 font-medium mb-1">
                  💡 Pro Tip
                </p>
                <p className="text-xs text-blue-600 leading-relaxed">
                  Store all your documents digitally on{" "}
                  <strong>DigiLocker</strong> — the official government document
                  wallet accepted across India.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0B2A4A] text-blue-200 text-center text-xs py-4 mt-8">
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white"
        >
          caffeine.ai
        </a>
      </footer>
    </main>
  );
}
