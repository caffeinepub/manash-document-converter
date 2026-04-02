import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Download, FileText, Info, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface GovForm {
  id: string;
  title: string;
  category: string;
  description: string;
  language: string;
  pdfUrl: string;
  fileSize?: string;
}

const CATEGORIES = [
  "All",
  "PAN Card",
  "Aadhaar",
  "Assam edistrict",
  "Passport",
  "Voter ID",
  "Driving Licence",
  "Income Tax",
  "Ration Card",
  "RTI",
];

const CATEGORY_COLORS: Record<string, string> = {
  "PAN Card": "bg-amber-500/20 text-amber-300 border-amber-500/30",
  Aadhaar: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  "Assam edistrict": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  Passport: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  "Voter ID": "bg-rose-500/20 text-rose-300 border-rose-500/30",
  "Driving Licence": "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "Income Tax": "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  "Ration Card": "bg-purple-500/20 text-purple-300 border-purple-500/30",
  RTI: "bg-teal-500/20 text-teal-300 border-teal-500/30",
};

const defaultForms: GovForm[] = [
  // ── PAN Card ──────────────────────────────────────────────────────────────
  {
    id: "pan-49a",
    title: "Form 49A – Application for PAN (Indian Citizens)",
    category: "PAN Card",
    description:
      "Application form for allotment of Permanent Account Number (PAN) for Indian citizens. Required for first-time PAN applicants.",
    language: "English",
    pdfUrl:
      "https://www.incometax.gov.in/iec/foportal/sites/default/files/Form49A.pdf",
    fileSize: "~180 KB",
  },
  {
    id: "pan-49aa",
    title: "Form 49AA – Application for PAN (Foreign Citizens)",
    category: "PAN Card",
    description:
      "Application form for allotment of PAN for foreign citizens, foreign companies and entities.",
    language: "English",
    pdfUrl:
      "https://www.incometax.gov.in/iec/foportal/sites/default/files/Form49AA.pdf",
    fileSize: "~175 KB",
  },
  {
    id: "pan-csf",
    title: "Form CSF – Request for New PAN / Correction / Change",
    category: "PAN Card",
    description:
      "Form for requesting changes or corrections in PAN data, or reprint of PAN card. Use for name change, DOB correction, address update.",
    language: "Bilingual",
    pdfUrl: "https://www.tin-nsdl.com/downloads/pan/CSF.pdf",
    fileSize: "~200 KB",
  },
  {
    id: "pan-49a-bilingual",
    title: "Form 49A – Bilingual (Hindi + English)",
    category: "PAN Card",
    description:
      "Bilingual version of Form 49A for allotment of PAN, available in both Hindi and English for ease of filling.",
    language: "Bilingual",
    pdfUrl:
      "https://www.incometax.gov.in/iec/foportal/sites/default/files/Form49A.pdf",
    fileSize: "~180 KB",
  },
  // ── Aadhaar ───────────────────────────────────────────────────────────────
  {
    id: "aadhaar-enrolment",
    title: "Aadhaar Enrolment / Correction Form (v2.7)",
    category: "Aadhaar",
    description:
      "Official UIDAI form for new Aadhaar enrollment and correction of demographic details (name, address, DOB, etc.).",
    language: "Bilingual",
    pdfUrl:
      "https://uidai.gov.in/images/enrollment_doc/aadhaar_enrolment_correction_form_version_2.7.pdf",
    fileSize: "~320 KB",
  },
  {
    id: "aadhaar-data-update",
    title: "Request for Aadhaar Data Update",
    category: "Aadhaar",
    description:
      "Form to request update of demographic or biometric data in the Aadhaar database at an enrollment centre.",
    language: "Bilingual",
    pdfUrl:
      "https://uidai.gov.in/images/enrollment_doc/aadhaar_data_update_request_form.pdf",
    fileSize: "~280 KB",
  },
  {
    id: "aadhaar-mobile-update",
    title: "Aadhaar Mobile Number Update Form",
    category: "Aadhaar",
    description:
      "Form to update or register a new mobile number linked with your Aadhaar at an Aadhaar Seva Kendra.",
    language: "Bilingual",
    pdfUrl:
      "https://uidai.gov.in/images/enrollment_doc/aadhaar_data_update_request_form.pdf",
    fileSize: "~280 KB",
  },
  {
    id: "aadhaar-child",
    title: "Child Aadhaar Enrolment Form (Below 5 Years)",
    category: "Aadhaar",
    description:
      "Enrolment form for children below 5 years of age. Biometrics not required; linked to parent's Aadhaar.",
    language: "Bilingual",
    pdfUrl:
      "https://uidai.gov.in/images/enrollment_doc/aadhaar_enrolment_correction_form_version_2.7.pdf",
    fileSize: "~320 KB",
  },
  {
    id: "aadhaar-biometric",
    title: "Aadhaar Biometric Update Form",
    category: "Aadhaar",
    description:
      "Form to request update of biometric data (fingerprints/iris) in Aadhaar. Mandatory at ages 5 and 15 for children.",
    language: "Bilingual",
    pdfUrl:
      "https://uidai.gov.in/images/enrollment_doc/aadhaar_data_update_request_form.pdf",
    fileSize: "~280 KB",
  },
  // ── Assam edistrict – Income & Residence ─────────────────────────────────
  {
    id: "assam-income-cert",
    title: "Income Certificate Application Form",
    category: "Assam edistrict",
    description:
      "Official form to apply for Income Certificate from the Assam edistrict portal. Required for scholarships, reservations, and welfare schemes.",
    language: "Assamese",
    pdfUrl: "https://edistrict.assam.gov.in/forms/income_certificate.pdf",
    fileSize: "~150 KB",
  },
  {
    id: "assam-prc",
    title: "Permanent Resident Certificate (PRC) Form",
    category: "Assam edistrict",
    description:
      "Form to apply for Permanent Resident Certificate (PRC) of Assam, required for state government jobs and benefits.",
    language: "Assamese",
    pdfUrl: "https://edistrict.assam.gov.in/forms/prc_form.pdf",
    fileSize: "~145 KB",
  },
  {
    id: "assam-residence",
    title: "Residence / Domicile Certificate Form",
    category: "Assam edistrict",
    description:
      "Application form for Residence/Domicile Certificate proving permanent residence in Assam.",
    language: "Assamese",
    pdfUrl: "https://edistrict.assam.gov.in/forms/residence_certificate.pdf",
    fileSize: "~140 KB",
  },
  {
    id: "assam-employment",
    title: "Employment Certificate Form",
    category: "Assam edistrict",
    description:
      "Form for obtaining Employment Certificate from the Assam edistrict portal for job and welfare purposes.",
    language: "Assamese",
    pdfUrl: "https://edistrict.assam.gov.in/forms/employment_certificate.pdf",
    fileSize: "~138 KB",
  },
  // ── Assam edistrict – Caste Certificates ─────────────────────────────────
  {
    id: "assam-obc",
    title: "OBC Certificate Application Form",
    category: "Assam edistrict",
    description:
      "Application form for Other Backward Classes (OBC) certificate from Assam government, required for reservations and concessions.",
    language: "Assamese",
    pdfUrl: "https://edistrict.assam.gov.in/forms/obc_certificate.pdf",
    fileSize: "~152 KB",
  },
  {
    id: "assam-sc",
    title: "SC Certificate Application Form",
    category: "Assam edistrict",
    description:
      "Application form for Scheduled Caste (SC) certificate issued by Assam government for reservations and welfare benefits.",
    language: "Assamese",
    pdfUrl: "https://edistrict.assam.gov.in/forms/sc_certificate.pdf",
    fileSize: "~150 KB",
  },
  {
    id: "assam-st-hills",
    title: "ST (Hills) Certificate Form",
    category: "Assam edistrict",
    description:
      "Form for Scheduled Tribe (Hills) certificate for residents of hill areas of Assam.",
    language: "Assamese",
    pdfUrl: "https://edistrict.assam.gov.in/forms/st_hills_certificate.pdf",
    fileSize: "~148 KB",
  },
  {
    id: "assam-st-plains",
    title: "ST (Plains) Certificate Form",
    category: "Assam edistrict",
    description:
      "Form for Scheduled Tribe (Plains) certificate for residents of plains areas of Assam.",
    language: "Assamese",
    pdfUrl: "https://edistrict.assam.gov.in/forms/st_plains_certificate.pdf",
    fileSize: "~148 KB",
  },
  {
    id: "assam-mobc",
    title: "MOBC Certificate Form",
    category: "Assam edistrict",
    description:
      "Application form for More Other Backward Classes (MOBC) certificate in Assam, required for state-level reservations.",
    language: "Assamese",
    pdfUrl: "https://edistrict.assam.gov.in/forms/mobc_certificate.pdf",
    fileSize: "~149 KB",
  },
  // ── Assam edistrict – Birth/Death ─────────────────────────────────────────
  {
    id: "assam-birth",
    title: "Birth Certificate Application Form",
    category: "Assam edistrict",
    description:
      "Official form for new birth certificate registration or delayed registration through Assam edistrict services.",
    language: "Assamese",
    pdfUrl: "https://edistrict.assam.gov.in/forms/birth_certificate.pdf",
    fileSize: "~135 KB",
  },
  {
    id: "assam-death",
    title: "Death Certificate Application Form",
    category: "Assam edistrict",
    description:
      "Form for applying for a Death Certificate from Assam edistrict. Required for legal and administrative purposes.",
    language: "Assamese",
    pdfUrl: "https://edistrict.assam.gov.in/forms/death_certificate.pdf",
    fileSize: "~133 KB",
  },
  {
    id: "assam-birth-correction",
    title: "Birth Certificate Correction Form",
    category: "Assam edistrict",
    description:
      "Form to request correction of name, date, or other details in an existing Birth Certificate in Assam.",
    language: "Assamese",
    pdfUrl: "https://edistrict.assam.gov.in/forms/birth_correction.pdf",
    fileSize: "~130 KB",
  },
  // ── Assam edistrict – Land Records ────────────────────────────────────────
  {
    id: "assam-land-holding",
    title: "Land Holding Certificate Form",
    category: "Assam edistrict",
    description:
      "Form to obtain Land Holding Certificate from Assam edistrict, used to prove land ownership.",
    language: "Assamese",
    pdfUrl: "https://edistrict.assam.gov.in/forms/land_holding.pdf",
    fileSize: "~142 KB",
  },
  {
    id: "assam-mutation",
    title: "Mutation Application Form",
    category: "Assam edistrict",
    description:
      "Application form for mutation of land records in Assam after purchase, inheritance, or gift deed.",
    language: "Assamese",
    pdfUrl: "https://edistrict.assam.gov.in/forms/mutation_form.pdf",
    fileSize: "~145 KB",
  },
  {
    id: "assam-encumbrance",
    title: "Encumbrance Certificate Form",
    category: "Assam edistrict",
    description:
      "Form to apply for Encumbrance Certificate showing land/property transaction history in Assam.",
    language: "Assamese",
    pdfUrl: "https://edistrict.assam.gov.in/forms/encumbrance_certificate.pdf",
    fileSize: "~140 KB",
  },
  // ── Assam edistrict – Marriage & Other ────────────────────────────────────
  {
    id: "assam-marriage",
    title: "Marriage Certificate Application Form",
    category: "Assam edistrict",
    description:
      "Form for registering a marriage and obtaining an official Marriage Certificate from Assam edistrict.",
    language: "Assamese",
    pdfUrl: "https://edistrict.assam.gov.in/forms/marriage_certificate.pdf",
    fileSize: "~138 KB",
  },
  {
    id: "assam-bpl",
    title: "BPL Certificate Application Form",
    category: "Assam edistrict",
    description:
      "Application form for Below Poverty Line (BPL) certificate in Assam to access welfare schemes and subsidies.",
    language: "Assamese",
    pdfUrl: "https://edistrict.assam.gov.in/forms/bpl_certificate.pdf",
    fileSize: "~136 KB",
  },
  {
    id: "assam-character",
    title: "Character Certificate Form",
    category: "Assam edistrict",
    description:
      "Form to apply for a Character Certificate from Assam edistrict, required for employment and higher education.",
    language: "Assamese",
    pdfUrl: "https://edistrict.assam.gov.in/forms/character_certificate.pdf",
    fileSize: "~132 KB",
  },
  {
    id: "assam-noc",
    title: "NOC Certificate Form",
    category: "Assam edistrict",
    description:
      "No Objection Certificate (NOC) application form from Assam government for various administrative purposes.",
    language: "Assamese",
    pdfUrl: "https://edistrict.assam.gov.in/forms/noc_form.pdf",
    fileSize: "~130 KB",
  },
  // ── Passport ──────────────────────────────────────────────────────────────
  {
    id: "passport-sp-en",
    title: "Passport Application Form SP (Fresh / Renewal) – English",
    category: "Passport",
    description:
      "Official application form for fresh and renewal of Indian passport (SP form). Used at Passport Seva Kendra.",
    language: "English",
    pdfUrl:
      "https://www.passportindia.gov.in/AppOnlineProject/pdf/SP_Form_English.pdf",
    fileSize: "~420 KB",
  },
  {
    id: "passport-sp-as",
    title: "Passport Application Form SP – Assamese",
    category: "Passport",
    description:
      "Assamese language version of the SP passport application form for residents of Assam.",
    language: "Assamese",
    pdfUrl:
      "https://www.passportindia.gov.in/AppOnlineProject/pdf/SP_Form_Assamese.pdf",
    fileSize: "~430 KB",
  },
  {
    id: "passport-minor",
    title: "Minor Passport Application Form",
    category: "Passport",
    description:
      "Passport application form for children below 18 years. Requires consent of both parents/guardian.",
    language: "English",
    pdfUrl:
      "https://www.passportindia.gov.in/AppOnlineProject/pdf/SP_Form_English.pdf",
    fileSize: "~420 KB",
  },
  {
    id: "passport-police-verification",
    title: "Police Verification Form",
    category: "Passport",
    description:
      "Form for police verification required for passport issuance. Submitted to the local police station.",
    language: "English",
    pdfUrl:
      "https://www.passportindia.gov.in/AppOnlineProject/pdf/policeVerificationForm.pdf",
    fileSize: "~210 KB",
  },
  // ── Voter ID ──────────────────────────────────────────────────────────────
  {
    id: "voter-form6",
    title: "Form 6 – New Voter Registration",
    category: "Voter ID",
    description:
      "Form for registration as a new elector in the Electoral Roll. Required for first-time voters.",
    language: "Bilingual",
    pdfUrl:
      "https://www.eci.gov.in/files/file/8879-form-6-new-elector-registration/",
    fileSize: "~180 KB",
  },
  {
    id: "voter-form6a",
    title: "Form 6A – NRI Voter Registration",
    category: "Voter ID",
    description:
      "Form for Non-Resident Indians (NRI) to register as overseas electors in the Indian Electoral Roll.",
    language: "English",
    pdfUrl: "https://www.eci.gov.in/files/file/8880-form-6a-overseas-elector/",
    fileSize: "~175 KB",
  },
  {
    id: "voter-form7",
    title: "Form 7 – Deletion from Electoral Roll",
    category: "Voter ID",
    description:
      "Form to request deletion of a name from the Electoral Roll (e.g. if person is deceased or shifted permanently).",
    language: "Bilingual",
    pdfUrl: "https://www.eci.gov.in/files/file/8881-form-7/",
    fileSize: "~170 KB",
  },
  {
    id: "voter-form8",
    title: "Form 8 – Correction of Entries in Electoral Roll",
    category: "Voter ID",
    description:
      "Form to request correction of any entry in the Electoral Roll, including name, photo, address corrections.",
    language: "Bilingual",
    pdfUrl: "https://www.eci.gov.in/files/file/8882-form-8/",
    fileSize: "~172 KB",
  },
  {
    id: "voter-form8a",
    title: "Form 8A – Transposition of Entries",
    category: "Voter ID",
    description:
      "Form to shift voter registration from one constituency to another within the same district.",
    language: "Bilingual",
    pdfUrl: "https://www.eci.gov.in/files/file/8883-form-8a/",
    fileSize: "~168 KB",
  },
  // ── Driving Licence ───────────────────────────────────────────────────────
  {
    id: "dl-form1",
    title: "Form 1 – Medical Certificate",
    category: "Driving Licence",
    description:
      "Medical fitness declaration form (Form 1) required for Learner's Licence and Driving Licence applications.",
    language: "English",
    pdfUrl:
      "https://parivahan.gov.in/parivahan/sites/default/files/pdf/Form_1.pdf",
    fileSize: "~160 KB",
  },
  {
    id: "dl-form2",
    title: "Form 2 – Application for Learner's Licence",
    category: "Driving Licence",
    description:
      "Application form to obtain a Learner's Licence (LL) from the Regional Transport Office (RTO).",
    language: "English",
    pdfUrl:
      "https://parivahan.gov.in/parivahan/sites/default/files/pdf/Form_2.pdf",
    fileSize: "~165 KB",
  },
  {
    id: "dl-form4",
    title: "Form 4 – Application for Driving Licence",
    category: "Driving Licence",
    description:
      "Application form for issue of a permanent Driving Licence after obtaining the Learner's Licence.",
    language: "English",
    pdfUrl:
      "https://parivahan.gov.in/parivahan/sites/default/files/pdf/Form_4.pdf",
    fileSize: "~163 KB",
  },
  {
    id: "dl-form7",
    title: "Form 7 – Application for DL Renewal",
    category: "Driving Licence",
    description:
      "Application form for renewal of an expired or expiring Driving Licence at the RTO.",
    language: "English",
    pdfUrl:
      "https://parivahan.gov.in/parivahan/sites/default/files/pdf/Form_7.pdf",
    fileSize: "~158 KB",
  },
  {
    id: "dl-form9",
    title: "Form 9 – Application for International DL",
    category: "Driving Licence",
    description:
      "Application form for obtaining an International Driving Permit (IDP) valid for driving abroad.",
    language: "English",
    pdfUrl:
      "https://parivahan.gov.in/parivahan/sites/default/files/pdf/Form_9.pdf",
    fileSize: "~156 KB",
  },
  // ── Income Tax ────────────────────────────────────────────────────────────
  {
    id: "it-itr1",
    title: "ITR-1 (SAHAJ) – Income Tax Return",
    category: "Income Tax",
    description:
      "Simplified ITR form for salaried individuals with income up to ₹50 lakh from salary, one house property, and other sources.",
    language: "English",
    pdfUrl:
      "https://www.incometax.gov.in/iec/foportal/sites/default/files/2024-05/ITR1_2024.pdf",
    fileSize: "~390 KB",
  },
  {
    id: "it-itr2",
    title: "ITR-2 – Income Tax Return",
    category: "Income Tax",
    description:
      "ITR form for individuals and HUFs having income from capital gains, more than one house property, or foreign assets.",
    language: "English",
    pdfUrl:
      "https://www.incometax.gov.in/iec/foportal/sites/default/files/2024-05/ITR2_2024.pdf",
    fileSize: "~410 KB",
  },
  {
    id: "it-itr4",
    title: "ITR-4 (SUGAM) – Presumptive Income",
    category: "Income Tax",
    description:
      "ITR form for individuals, HUFs, and firms using presumptive taxation scheme under Sections 44AD, 44ADA, 44AE.",
    language: "English",
    pdfUrl:
      "https://www.incometax.gov.in/iec/foportal/sites/default/files/2024-05/ITR4_2024.pdf",
    fileSize: "~400 KB",
  },
  {
    id: "it-form16",
    title: "Form 16 – TDS Certificate (Salary)",
    category: "Income Tax",
    description:
      "TDS certificate issued by employer showing tax deducted at source from salary. Required for filing ITR.",
    language: "English",
    pdfUrl:
      "https://www.incometax.gov.in/iec/foportal/sites/default/files/Form_16.pdf",
    fileSize: "~185 KB",
  },
  {
    id: "it-form15g",
    title: "Form 15G – Declaration for Non-Deduction of TDS",
    category: "Income Tax",
    description:
      "Declaration form (below 60 years) to prevent TDS deduction on bank interest, PF, etc., when income is below taxable limit.",
    language: "English",
    pdfUrl:
      "https://www.incometax.gov.in/iec/foportal/sites/default/files/Form15G.pdf",
    fileSize: "~176 KB",
  },
  {
    id: "it-form15h",
    title: "Form 15H – Declaration for Senior Citizens",
    category: "Income Tax",
    description:
      "Declaration form for senior citizens (60+ years) to prevent TDS on interest income when total tax liability is nil.",
    language: "English",
    pdfUrl:
      "https://www.incometax.gov.in/iec/foportal/sites/default/files/Form15H.pdf",
    fileSize: "~174 KB",
  },
  // ── Ration Card ───────────────────────────────────────────────────────────
  {
    id: "ration-new",
    title: "Ration Card New Application Form (Assam)",
    category: "Ration Card",
    description:
      "Application form for a new Ration Card in Assam under the National Food Security Act (NFSA).",
    language: "Assamese",
    pdfUrl: "https://fcscaassam.gov.in/forms/ration_card_new.pdf",
    fileSize: "~145 KB",
  },
  {
    id: "ration-correction",
    title: "Ration Card Correction Form",
    category: "Ration Card",
    description:
      "Form to request changes or corrections in an existing Ration Card in Assam (name, address, member addition/deletion).",
    language: "Assamese",
    pdfUrl: "https://fcscaassam.gov.in/forms/ration_card_correction.pdf",
    fileSize: "~140 KB",
  },
  {
    id: "ration-surrender",
    title: "Ration Card Surrender Form",
    category: "Ration Card",
    description:
      "Form to surrender / cancel a Ration Card in Assam when relocating, income threshold crossed, or card no longer needed.",
    language: "Assamese",
    pdfUrl: "https://fcscaassam.gov.in/forms/ration_card_surrender.pdf",
    fileSize: "~135 KB",
  },
  // ── RTI ───────────────────────────────────────────────────────────────────
  {
    id: "rti-application",
    title: "RTI Application Form",
    category: "RTI",
    description:
      "Standard application form to file a Right to Information (RTI) request to any public authority in India.",
    language: "English",
    pdfUrl: "https://rtionline.gov.in/forms/RTI_Application_Form.pdf",
    fileSize: "~125 KB",
  },
  {
    id: "rti-first-appeal",
    title: "RTI First Appeal Form",
    category: "RTI",
    description:
      "Form to file the First Appeal under RTI Act when not satisfied with the response from the Public Information Officer.",
    language: "English",
    pdfUrl: "https://rtionline.gov.in/forms/RTI_First_Appeal_Form.pdf",
    fileSize: "~122 KB",
  },
];

function useInViewAnim(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function FormCard({ form }: { form: GovForm }) {
  const { ref, visible } = useInViewAnim();
  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div
        className="rounded-xl p-5 flex flex-col gap-3 h-full border transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
        style={{
          background: "oklch(0.17 0.03 250)",
          borderColor: "oklch(0.28 0.06 250)",
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <div
            className="p-2 rounded-lg"
            style={{ background: "oklch(0.22 0.05 250)" }}
          >
            <FileText size={18} className="text-amber-400" />
          </div>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
              CATEGORY_COLORS[form.category] ??
              "bg-gray-500/20 text-gray-300 border-gray-500/30"
            }`}
          >
            {form.category}
          </span>
        </div>

        <div className="flex-1">
          <h3 className="text-sm font-semibold text-white leading-snug mb-1">
            {form.title}
          </h3>
          <p className="text-xs text-blue-200/70 leading-relaxed line-clamp-3">
            {form.description}
          </p>
        </div>

        <div
          className="flex items-center justify-between gap-2 mt-auto pt-2 border-t"
          style={{ borderColor: "oklch(0.25 0.05 250)" }}
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: "oklch(0.22 0.04 250)",
                color: "oklch(0.75 0.08 240)",
              }}
            >
              {form.language}
            </span>
            {form.fileSize && (
              <span className="text-xs text-gray-400">{form.fileSize}</span>
            )}
          </div>
          <div className="flex gap-1.5 items-center flex-wrap">
            <Button
              size="sm"
              className="text-xs font-semibold gap-1 shrink-0 bg-blue-600 hover:bg-blue-700 text-white border-0"
              onClick={() => window.open(`/form-guide?id=${form.id}`, "_blank")}
              data-ocid="forms.more_info_button"
            >
              <Info size={13} />
              More Info
            </Button>
            <a
              href={form.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="forms.download_button"
            >
              <Button
                size="sm"
                className="text-xs font-semibold gap-1.5 shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.72 0.15 65), oklch(0.62 0.18 55))",
                  color: "oklch(0.12 0.03 250)",
                  border: "none",
                }}
              >
                <Download size={13} />
                Download PDF
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AssamFormsPage({
  navigate,
}: {
  navigate: (p: any) => void;
}) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Merge admin-added forms from localStorage (admin forms appear on top)
  const adminForms: GovForm[] = (() => {
    try {
      return JSON.parse(localStorage.getItem("govFormsLibrary") || "[]");
    } catch {
      return [];
    }
  })();

  const allForms = [...adminForms, ...defaultForms];

  const filtered = allForms.filter((f) => {
    const matchesCat =
      activeCategory === "All" || f.category === activeCategory;
    const q = search.toLowerCase();
    const matchesSearch =
      search === "" ||
      f.title.toLowerCase().includes(q) ||
      f.description.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q) ||
      f.language.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <main
      className="min-h-screen"
      style={{ background: "oklch(0.12 0.03 250)" }}
    >
      {/* Hero */}
      <section
        className="py-12 px-4 animate-fade-in-up"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.14 0.04 250) 0%, oklch(0.18 0.07 265) 100%)",
          borderBottom: "1px solid oklch(0.25 0.06 250)",
        }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Back */}
          <button
            type="button"
            onClick={() => navigate("gov-documents")}
            className="flex items-center gap-2 text-sm text-blue-300 hover:text-amber-300 transition-colors mb-6"
            data-ocid="forms.back_button"
          >
            <ArrowLeft size={16} />
            Back to Gov Documents
          </button>

          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="text-4xl">📂</span>
              <h1
                className="text-3xl md:text-4xl font-bold tracking-tight"
                style={{
                  background:
                    "linear-gradient(90deg, oklch(0.85 0.15 80), oklch(0.75 0.18 65))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Government Forms Library
              </h1>
            </div>
            <p className="text-blue-200 text-base max-w-2xl mx-auto mb-6">
              Download official government PDF forms — PAN Card, Aadhaar, Assam
              edistrict services, Passport, Voter ID, Driving Licence, Income
              Tax, and more. All forms sourced directly from official government
              portals.
            </p>

            {/* Notice */}
            <div
              className="inline-flex items-center gap-2 text-xs px-4 py-2 rounded-full mb-6"
              style={{
                background: "oklch(0.22 0.06 80 / 0.3)",
                border: "1px solid oklch(0.55 0.12 80 / 0.4)",
                color: "oklch(0.82 0.12 75)",
              }}
            >
              <Info size={13} />
              Note: These are official government PDF forms. Links redirect to
              official government portals.
            </div>

            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                type="text"
                placeholder="Search forms (e.g. PAN 49A, Income Certificate, ITR...)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-white text-gray-900 border-0 h-12 rounded-xl text-base"
                data-ocid="forms.search_input"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <div
        className="sticky top-[88px] z-10 border-b"
        style={{
          background: "oklch(0.15 0.04 250)",
          borderColor: "oklch(0.25 0.06 250)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 overflow-x-auto">
          <div className="flex gap-1 py-3 min-w-max">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                data-ocid={`forms.${cat.toLowerCase().replace(/ /g, "_")}.tab`}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap"
                style={
                  activeCategory === cat
                    ? {
                        background:
                          "linear-gradient(135deg, oklch(0.72 0.15 65), oklch(0.62 0.18 55))",
                        color: "oklch(0.12 0.03 250)",
                        fontWeight: 700,
                      }
                    : {
                        background: "oklch(0.20 0.04 250)",
                        color: "oklch(0.70 0.06 240)",
                      }
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="max-w-6xl mx-auto px-4 pt-5 pb-2">
        <p className="text-sm text-blue-300/70">
          Showing{" "}
          <span className="text-amber-400 font-semibold">
            {filtered.length}
          </span>{" "}
          form{filtered.length !== 1 ? "s" : ""}
          {activeCategory !== "All" && (
            <>
              {" "}
              in{" "}
              <span className="text-white font-medium">{activeCategory}</span>
            </>
          )}
          {search && (
            <>
              {" "}
              matching{" "}
              <span className="text-white font-medium">"{search}"</span>
            </>
          )}
        </p>
      </div>

      {/* Forms Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        {filtered.length === 0 ? (
          <div
            className="text-center py-20 text-gray-400"
            data-ocid="forms.empty_state"
          >
            <span className="text-5xl block mb-4">🔍</span>
            <p className="text-lg font-semibold">No forms found</p>
            <p className="text-sm mt-1">
              Try a different search term or select another category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-2">
            {filtered.map((form, i) => (
              <div key={form.id} data-ocid={`forms.item.${i + 1}`}>
                <FormCard form={form} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Note */}
      <div
        className="border-t py-8 text-center"
        style={{ borderColor: "oklch(0.22 0.05 250)" }}
      >
        <p className="text-xs text-blue-300/50 max-w-lg mx-auto">
          All PDF forms are sourced from official government portals
          (incometax.gov.in, uidai.gov.in, parivahan.gov.in,
          edistrict.assam.gov.in, etc.). Manash PC World 2.0 is not affiliated
          with any government body.
        </p>
      </div>
    </main>
  );
}
