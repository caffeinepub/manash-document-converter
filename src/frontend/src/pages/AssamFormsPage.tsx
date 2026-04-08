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

const CATEGORY_COLORS: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  "PAN Card": {
    bg: "rgba(255,182,217,0.15)",
    text: "#be185d",
    border: "rgba(255,182,217,0.4)",
  },
  Aadhaar: {
    bg: "rgba(180,231,255,0.2)",
    text: "#0369a1",
    border: "rgba(180,231,255,0.5)",
  },
  "Assam edistrict": {
    bg: "rgba(110,231,183,0.15)",
    text: "#065f46",
    border: "rgba(110,231,183,0.4)",
  },
  Passport: {
    bg: "rgba(167,139,250,0.15)",
    text: "#6d28d9",
    border: "rgba(167,139,250,0.4)",
  },
  "Voter ID": {
    bg: "rgba(253,164,175,0.15)",
    text: "#9f1239",
    border: "rgba(253,164,175,0.4)",
  },
  "Driving Licence": {
    bg: "rgba(253,186,116,0.15)",
    text: "#9a3412",
    border: "rgba(253,186,116,0.4)",
  },
  "Income Tax": {
    bg: "rgba(103,232,249,0.15)",
    text: "#155e75",
    border: "rgba(103,232,249,0.4)",
  },
  "Ration Card": {
    bg: "rgba(196,181,253,0.15)",
    text: "#5b21b6",
    border: "rgba(196,181,253,0.4)",
  },
  RTI: {
    bg: "rgba(110,231,183,0.1)",
    text: "#065f46",
    border: "rgba(110,231,183,0.3)",
  },
};

const defaultForms: GovForm[] = [
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
  const catColors = CATEGORY_COLORS[form.category] ?? {
    bg: "rgba(226,232,240,0.3)",
    text: "#475569",
    border: "rgba(226,232,240,0.6)",
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div
        className="rounded-3xl p-5 flex flex-col gap-3 h-full transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
        style={{
          background: "rgba(255,255,255,0.92)",
          border: "1.5px solid rgba(255,182,217,0.25)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 2px 12px rgba(255,182,217,0.08)",
        }}
      >
        <div className="flex items-start justify-between gap-2">
          <div
            className="p-2.5 rounded-2xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,182,217,0.2), rgba(180,231,255,0.2))",
            }}
          >
            <FileText size={18} className="text-pink-500" />
          </div>
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full border"
            style={{
              background: catColors.bg,
              color: catColors.text,
              borderColor: catColors.border,
            }}
          >
            {form.category}
          </span>
        </div>

        <div className="flex-1">
          <h3 className="text-sm font-semibold text-slate-800 leading-snug mb-1">
            {form.title}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
            {form.description}
          </p>
        </div>

        <div
          className="flex items-center justify-between gap-2 mt-auto pt-3"
          style={{ borderTop: "1px solid rgba(255,182,217,0.2)" }}
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: "rgba(180,231,255,0.2)", color: "#0369a1" }}
            >
              {form.language}
            </span>
            {form.fileSize && (
              <span className="text-xs text-slate-400">{form.fileSize}</span>
            )}
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <Button
              size="sm"
              className="text-xs font-semibold gap-1 shrink-0 rounded-2xl transition-all hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #FFB6D9, #f9a8d4)",
                color: "#9d174d",
                border: "none",
                boxShadow: "0 2px 8px rgba(255,182,217,0.4)",
              }}
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
                className="text-xs font-semibold gap-1.5 shrink-0 rounded-2xl transition-all hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #B4E7FF, #93c5fd)",
                  color: "#0369a1",
                  border: "none",
                  boxShadow: "0 2px 8px rgba(180,231,255,0.4)",
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

export function AssamFormsPage({ navigate }: { navigate: (p: any) => void }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

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
      style={{
        background:
          "linear-gradient(160deg, #FFF0F6 0%, #F0F8FF 50%, #FFF0F6 100%)",
      }}
    >
      {/* Hero */}
      <section
        className="py-12 px-4 animate-fade-in-up"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,182,217,0.2) 0%, rgba(180,231,255,0.2) 100%)",
          borderBottom: "1.5px solid rgba(255,182,217,0.3)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Back */}
          <button
            type="button"
            onClick={() => navigate("gov-documents")}
            className="flex items-center gap-2 text-sm text-pink-500 hover:text-pink-700 transition-colors mb-6 font-medium"
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
                    "linear-gradient(135deg, #be185d, #7c3aed, #0369a1)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Government Forms Library
              </h1>
            </div>
            <p className="text-slate-600 text-base max-w-2xl mx-auto mb-6">
              Download official government PDF forms — PAN Card, Aadhaar, Assam
              edistrict services, Passport, Voter ID, Driving Licence, Income
              Tax, and more. All forms sourced directly from official government
              portals.
            </p>

            {/* Notice */}
            <div
              className="inline-flex items-center gap-2 text-xs px-4 py-2 rounded-full mb-6"
              style={{
                background: "rgba(180,231,255,0.2)",
                border: "1px solid rgba(180,231,255,0.5)",
                color: "#0369a1",
              }}
            >
              <Info size={13} />
              Note: These are official government PDF forms. Links redirect to
              official government portals.
            </div>

            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400"
                size={18}
              />
              <Input
                type="text"
                placeholder="Search forms (e.g. PAN 49A, Income Certificate, ITR...)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-12 rounded-2xl text-base text-slate-800"
                style={{
                  background: "rgba(255,255,255,0.95)",
                  border: "1.5px solid rgba(255,182,217,0.4)",
                  boxShadow: "0 2px 12px rgba(255,182,217,0.15)",
                }}
                data-ocid="forms.search_input"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <div
        className="sticky top-[88px] z-10"
        style={{
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,182,217,0.25)",
          boxShadow: "0 2px 12px rgba(255,182,217,0.1)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 overflow-x-auto">
          <div className="flex gap-2 py-3 min-w-max">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                data-ocid={`forms.${cat.toLowerCase().replace(/ /g, "_")}.tab`}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap hover:scale-105"
                style={{
                  background:
                    activeCategory === cat
                      ? "linear-gradient(135deg, #FFB6D9, #B4E7FF)"
                      : "rgba(255,240,246,0.8)",
                  color: activeCategory === cat ? "#7c3aed" : "#64748b",
                  border:
                    activeCategory === cat
                      ? "1.5px solid rgba(255,182,217,0.6)"
                      : "1.5px solid rgba(226,232,240,0.8)",
                  boxShadow:
                    activeCategory === cat
                      ? "0 2px 12px rgba(255,182,217,0.4)"
                      : "none",
                  fontWeight: activeCategory === cat ? 700 : 500,
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="max-w-6xl mx-auto px-4 pt-5 pb-2">
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span
            className="font-semibold"
            style={{
              background: "linear-gradient(135deg, #be185d, #0369a1)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {filtered.length}
          </span>{" "}
          form{filtered.length !== 1 ? "s" : ""}
          {activeCategory !== "All" && (
            <>
              {" "}
              in{" "}
              <span className="font-medium text-slate-700">
                {activeCategory}
              </span>
            </>
          )}
          {search && (
            <>
              {" "}
              matching{" "}
              <span className="font-medium text-slate-700">"{search}"</span>
            </>
          )}
        </p>
      </div>

      {/* Forms Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        {filtered.length === 0 ? (
          <div
            className="text-center py-20 text-slate-400"
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
        className="py-8 text-center"
        style={{ borderTop: "1px solid rgba(255,182,217,0.2)" }}
      >
        <p className="text-xs text-slate-400 max-w-lg mx-auto">
          All PDF forms are sourced from official government portals
          (incometax.gov.in, uidai.gov.in, parivahan.gov.in,
          edistrict.assam.gov.in, etc.). Manash PC World 2.0 is not affiliated
          with any government body.
        </p>
      </div>
    </main>
  );
}
