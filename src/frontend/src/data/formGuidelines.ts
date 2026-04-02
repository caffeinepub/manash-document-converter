export interface FormGuideline {
  formId: string;
  title: string;
  category: string;
  whatIsThisForm: string;
  whoCanApply: string;
  documentsRequired: string[];
  stepByStep: string[];
  whereToSubmit: string;
  fee: string;
  officialLink: string;
}

export const formGuidelines: Record<string, FormGuideline> = {
  "pan-49a": {
    formId: "pan-49a",
    title: "Form 49A – Application for PAN (Indian Citizens)",
    category: "PAN Card",
    whatIsThisForm:
      "Form 49A is the official application form for allotment of Permanent Account Number (PAN) issued by the Income Tax Department of India. PAN is a 10-digit alphanumeric identifier required for all financial and tax-related transactions in India.",
    whoCanApply:
      "Any Indian citizen who does not already have a PAN card. This includes salaried employees, business owners, students, senior citizens, and anyone who needs to file income tax returns or conduct financial transactions.",
    documentsRequired: [
      "Proof of Identity: Aadhaar Card / Voter ID / Passport / Driving Licence",
      "Proof of Address: Aadhaar Card / Bank Statement / Utility Bill (not older than 3 months)",
      "Proof of Date of Birth: Birth Certificate / Aadhaar Card / Matriculation Certificate",
      "2 recent passport-size photographs",
      "Aadhaar Card (mandatory for e-PAN and online application)",
    ],
    stepByStep: [
      "Download Form 49A from the Income Tax website or visit NSDL/UTIITSL portal.",
      "Fill in your full name exactly as it appears on your identity proof — in BLOCK LETTERS.",
      "Enter your date of birth, gender, and father's name correctly.",
      "Mention your address for communication and provide your Aadhaar number.",
      "Attach two passport-size photographs and sign across one photograph.",
      "Attach self-attested photocopies of identity proof, address proof, and date of birth proof.",
      "Submit the form at the nearest NSDL TIN Facilitation Centre or apply online at onlineservices.nsdl.com.",
      "Pay the processing fee. You will receive an acknowledgment number to track your application.",
    ],
    whereToSubmit:
      "NSDL TIN Facilitation Centres, UTIITSL PAN Service Centres, or online at onlineservices.nsdl.com / www.utiitsl.com.",
    fee: "₹107 (for delivery within India) or ₹1,017 (for delivery outside India). Online payment via net banking, debit/credit card, or demand draft.",
    officialLink:
      "https://onlineservices.nsdl.com/paam/endUserRegisterContact.html",
  },

  "pan-49aa": {
    formId: "pan-49aa",
    title: "Form 49AA – Application for PAN (Foreign Citizens)",
    category: "PAN Card",
    whatIsThisForm:
      "Form 49AA is the PAN application form for foreign citizens, foreign companies, foreign entities, and Non-Resident Indians (NRIs) who need a PAN for conducting financial or business activities in India.",
    whoCanApply:
      "Foreign nationals (individuals), foreign companies, foreign firms, associations of persons (AOP), or any entity formed or incorporated outside India that has taxable income in India or needs to conduct financial transactions in India.",
    documentsRequired: [
      "Proof of Identity: Passport (mandatory for foreign citizens)",
      "Proof of Address: Bank statement of the residential country or Certificate of Residence",
      "Proof of Date of Birth: Passport copy",
      "Copy of OCI/PIO card (if applicable)",
      "Attestation by Indian Embassy or authorized authority",
      "2 passport-size photographs",
    ],
    stepByStep: [
      "Download Form 49AA from NSDL or UTIITSL portal.",
      "Fill the form in BLOCK LETTERS — name as per passport.",
      "Enter your residential address in the country of residence.",
      "Attach a notarized/apostilled copy of your passport as identity and address proof.",
      "Attach two passport-size photographs.",
      "Submit the form at a NSDL TIN centre or through the Indian Embassy in your country.",
      "Pay the application fee and note down the acknowledgment number.",
    ],
    whereToSubmit:
      "NSDL TIN Facilitation Centres, Indian Embassy/Consulate offices, or online via NSDL/UTIITSL portals.",
    fee: "₹1,017 (for delivery outside India). Payment via demand draft or online payment.",
    officialLink:
      "https://onlineservices.nsdl.com/paam/endUserRegisterContact.html",
  },

  "pan-csf": {
    formId: "pan-csf",
    title: "Form CSF – Request for New PAN / Correction / Change",
    category: "PAN Card",
    whatIsThisForm:
      "Form CSF (Change/Correction in PAN data) is used to request changes or corrections in your existing PAN card details — such as name correction, date of birth correction, address update, or to get a reprint of a lost/damaged PAN card.",
    whoCanApply:
      "Any existing PAN card holder who wants to: correct their name, date of birth, or other details; update their address; get a duplicate/reprint of a lost or damaged PAN card; or link Aadhaar with PAN.",
    documentsRequired: [
      "Existing PAN card copy (for correction/reprint requests)",
      "Proof of Identity showing the correct details (Aadhaar / Passport / Voter ID)",
      "Proof of Address (Aadhaar / Bank Statement / Utility Bill)",
      "Proof of Date of Birth if DOB correction is needed (Birth Certificate / Aadhaar)",
      "2 passport-size photographs",
    ],
    stepByStep: [
      "Download Form CSF from the NSDL or UTIITSL website.",
      "Tick the boxes for the fields you want to correct (e.g., name, DOB, address).",
      "Write the corrected information clearly in the relevant fields.",
      "Attach supporting documents for the correction (e.g., Aadhaar for name correction).",
      "Paste photographs and sign across one photograph.",
      "Submit at NSDL TIN centre or apply online at the NSDL/UTIITSL portal.",
      "Pay the fee and note your acknowledgment number for tracking.",
    ],
    whereToSubmit:
      "NSDL TIN Facilitation Centres, UTIITSL PAN Service Centres, or online via onlineservices.nsdl.com.",
    fee: "₹107 (delivery within India). Pay online or via demand draft.",
    officialLink:
      "https://onlineservices.nsdl.com/paam/endUserRegisterContact.html",
  },

  "pan-49a-bilingual": {
    formId: "pan-49a-bilingual",
    title: "Form 49A – Bilingual (Hindi + English)",
    category: "PAN Card",
    whatIsThisForm:
      "This is the bilingual (Hindi and English) version of Form 49A for allotment of a Permanent Account Number (PAN). It is the same as Form 49A but available in both Hindi and English for ease of understanding and filling.",
    whoCanApply:
      "Any Indian citizen applying for a PAN card for the first time. Ideal for those more comfortable reading in Hindi.",
    documentsRequired: [
      "Proof of Identity: Aadhaar Card / Voter ID / Passport / Driving Licence",
      "Proof of Address: Aadhaar / Bank Statement / Utility Bill",
      "Proof of Date of Birth: Birth Certificate / Aadhaar / School Certificate",
      "2 recent passport-size photographs",
      "Aadhaar Card number (mandatory)",
    ],
    stepByStep: [
      "Download the bilingual Form 49A.",
      "Fill in your full name in BLOCK LETTERS in both Hindi and English sections.",
      "Enter date of birth, father's name, and Aadhaar number.",
      "Paste two passport-size photographs and sign across one.",
      "Attach self-attested copies of required documents.",
      "Submit at NSDL TIN centre or online at NSDL/UTIITSL portal.",
      "Pay the fee and collect the acknowledgment slip.",
    ],
    whereToSubmit:
      "NSDL TIN Facilitation Centres or UTIITSL PAN Service Centres.",
    fee: "₹107 (within India). Online or demand draft payment accepted.",
    officialLink:
      "https://onlineservices.nsdl.com/paam/endUserRegisterContact.html",
  },

  "aadhaar-enrolment": {
    formId: "aadhaar-enrolment",
    title: "Aadhaar Enrolment / Correction Form (v2.7)",
    category: "Aadhaar",
    whatIsThisForm:
      "This is the official UIDAI form for new Aadhaar enrollment or for correcting existing demographic details (name, address, date of birth, gender, mobile number, email) in the Aadhaar database.",
    whoCanApply:
      "Any Indian resident who does not have an Aadhaar number, or any existing Aadhaar holder who wants to correct or update their demographic information.",
    documentsRequired: [
      "Proof of Identity: Passport / Voter ID / PAN Card / Driving Licence / Bank Passbook",
      "Proof of Address: Aadhaar of head of family / Bank Statement / Passport / Voter ID",
      "Proof of Date of Birth: Birth Certificate / Passport / School Certificate",
      "Mobile number (for OTP during enrolment)",
      "For correction: Existing Aadhaar number and document supporting the correction",
    ],
    stepByStep: [
      "Visit the nearest Aadhaar Enrolment Centre or Aadhaar Seva Kendra with original documents.",
      "Fill the Aadhaar Enrolment/Correction form with your correct details.",
      "Submit the form to the operator at the enrolment centre.",
      "The operator will scan your documents, capture your photo, fingerprints, and iris scan.",
      "Verify your details on the screen and confirm.",
      "Collect the Enrolment ID (EID) slip — keep it safe for tracking.",
      "Your Aadhaar will be generated and sent by post within 90 days, or download e-Aadhaar from uidai.gov.in.",
    ],
    whereToSubmit:
      "Nearest Aadhaar Enrolment Centre or Aadhaar Seva Kendra. Find centres at appointments.uidai.gov.in.",
    fee: "Free for first enrolment. Corrections: ₹50 per update.",
    officialLink: "https://uidai.gov.in",
  },

  "aadhaar-data-update": {
    formId: "aadhaar-data-update",
    title: "Request for Aadhaar Data Update",
    category: "Aadhaar",
    whatIsThisForm:
      "This form is used to request an update of demographic data (name, address, gender, date of birth, mobile, email) or biometric data (fingerprints, iris) in the Aadhaar database at an Aadhaar Enrolment Centre.",
    whoCanApply:
      "Any Aadhaar card holder whose details have changed or contain errors — for example, name spelling correction, new address after relocation, or mobile number change.",
    documentsRequired: [
      "Existing Aadhaar card / Aadhaar number (EID)",
      "Document supporting the update (e.g., new address proof, court order for name change)",
      "Proof of Identity with the correct information",
      "Proof of Address (for address update): Bank statement / Utility bill / Lease agreement",
      "Mobile number linked to Aadhaar for OTP verification",
    ],
    stepByStep: [
      "Visit the nearest Aadhaar Seva Kendra with your Aadhaar card and supporting documents.",
      "Fill the Aadhaar Data Update Request form with the field(s) you want to update.",
      "Submit the form and documents to the operator.",
      "The operator will verify your biometrics (fingerprint/iris) for authentication.",
      "Confirm the details on screen and get a URN (Update Request Number).",
      "Track the update status at uidai.gov.in using the URN.",
      "Updated Aadhaar letter will be sent by post, or download e-Aadhaar after update is processed.",
    ],
    whereToSubmit:
      "Aadhaar Seva Kendra or Aadhaar Enrolment Centre. Book appointment at appointments.uidai.gov.in.",
    fee: "₹50 per demographic update at the centre.",
    officialLink: "https://uidai.gov.in/en/my-aadhaar/update-aadhaar.html",
  },

  "aadhaar-mobile-update": {
    formId: "aadhaar-mobile-update",
    title: "Aadhaar Mobile Number Update Form",
    category: "Aadhaar",
    whatIsThisForm:
      "This form is used to update or register a new mobile number linked with your Aadhaar. A linked mobile number is essential for receiving OTPs for Aadhaar-based authentication and online services.",
    whoCanApply:
      "Any Aadhaar holder whose mobile number is not linked with Aadhaar, or who wants to change their existing registered mobile number.",
    documentsRequired: [
      "Aadhaar card / Aadhaar number",
      "New mobile number to be registered",
      "Biometric verification (fingerprint/iris) at the centre — no separate document needed",
    ],
    stepByStep: [
      "Visit the nearest Aadhaar Seva Kendra in person (mobile update requires physical presence).",
      "Fill the Aadhaar Data Update form and enter your new mobile number.",
      "Submit the form to the operator.",
      "The operator will verify your identity using biometrics.",
      "Confirm the new mobile number on screen.",
      "You will receive an SMS confirmation on the new number once updated.",
      "Mobile update is usually processed within 3–7 working days.",
    ],
    whereToSubmit:
      "Aadhaar Seva Kendra only (mobile update cannot be done online). Book at appointments.uidai.gov.in.",
    fee: "₹50 per update.",
    officialLink: "https://uidai.gov.in/en/my-aadhaar/update-aadhaar.html",
  },

  "aadhaar-child": {
    formId: "aadhaar-child",
    title: "Child Aadhaar Enrolment Form (Below 5 Years)",
    category: "Aadhaar",
    whatIsThisForm:
      "This is the enrolment form for children below 5 years of age (Baal Aadhaar — blue coloured). Biometrics (fingerprints and iris) are not captured for children below 5; the Aadhaar is linked to a parent's Aadhaar instead.",
    whoCanApply:
      "Parents or guardians enrolling a child below 5 years of age who does not yet have an Aadhaar number.",
    documentsRequired: [
      "Child's birth certificate (from hospital or municipality)",
      "Parent's Aadhaar card (mandatory for linking)",
      "Proof of relationship: Birth certificate mentioning parent's name",
      "Child's photograph (taken at the enrolment centre)",
    ],
    stepByStep: [
      "Visit the nearest Aadhaar Enrolment Centre with the child and parent.",
      "Fill the Child Aadhaar Enrolment form with child's name and date of birth.",
      "Provide parent's Aadhaar number for linking.",
      "Submit the birth certificate and parent's Aadhaar copy.",
      "The operator will photograph the child — no fingerprints or iris needed.",
      "Collect the EID slip. Baal Aadhaar (blue card) will be sent by post.",
      "Note: When the child turns 5 and again at 15, biometric update is mandatory.",
    ],
    whereToSubmit:
      "Nearest Aadhaar Enrolment Centre. Find at appointments.uidai.gov.in.",
    fee: "Free.",
    officialLink: "https://uidai.gov.in",
  },

  "aadhaar-biometric": {
    formId: "aadhaar-biometric",
    title: "Aadhaar Biometric Update Form",
    category: "Aadhaar",
    whatIsThisForm:
      "This form is used to update biometric data (fingerprints and iris scan) in the Aadhaar database. Biometric update is mandatory for children who got Baal Aadhaar at ages 5 and 15. Adults can also update biometrics if they have degraded fingerprints.",
    whoCanApply:
      "Children who enrolled before age 5 (mandatory update at age 5 and 15), or adults whose fingerprint quality has degraded and biometric authentication is failing.",
    documentsRequired: [
      "Existing Aadhaar card / EID",
      "Date of birth proof if doing age-based mandatory update",
      "Parent's Aadhaar for children under 18",
    ],
    stepByStep: [
      "Visit the nearest Aadhaar Seva Kendra or Enrolment Centre.",
      "Fill the Aadhaar Biometric Update form.",
      "Provide your Aadhaar number to the operator.",
      "The operator will capture your 10 fingerprints and iris scan.",
      "Verify on screen and collect the acknowledgment slip with URN.",
      "Track status at uidai.gov.in using the URN.",
    ],
    whereToSubmit: "Aadhaar Seva Kendra or Aadhaar Enrolment Centre.",
    fee: "Free for mandatory age-based updates. ₹100 for voluntary biometric updates.",
    officialLink: "https://uidai.gov.in",
  },

  "assam-income-cert": {
    formId: "assam-income-cert",
    title: "Income Certificate Application Form",
    category: "Assam edistrict",
    whatIsThisForm:
      "An Income Certificate is an official document issued by the Assam government that certifies the annual income of an individual or family. It is required for obtaining scholarships, welfare scheme benefits, fee concessions, and government reservations.",
    whoCanApply:
      "Any permanent resident of Assam who needs proof of their annual family income for educational scholarships, government welfare schemes, EWS reservations, or other benefits.",
    documentsRequired: [
      "Aadhaar Card of the applicant",
      "Proof of residence in Assam (Voter ID / PRC / Ration Card)",
      "Salary slip or income declaration (for salaried persons)",
      "Self-declaration of income (for farmers and daily labourers)",
      "Passbook copy showing income deposits (if applicable)",
      "Passport-size photograph",
    ],
    stepByStep: [
      "Download the Income Certificate application form from the Assam edistrict portal or this library.",
      "Fill in your name, address, and annual income details correctly.",
      "Attach Aadhaar card copy and residence proof.",
      "Attach income proof (salary slip, income declaration, or passbook).",
      "Submit the filled form at the Circle Office or SDO (Sub Divisional Officer) office in your area.",
      "You may also apply online at edistrict.assam.gov.in.",
      "After verification, the certificate is issued within 7–15 working days.",
    ],
    whereToSubmit:
      "Circle Office, Revenue Circle Office, or Sub Divisional Officer (SDO) office in your district. Online: edistrict.assam.gov.in.",
    fee: "₹30 service charge (online). Free at government counters in some districts.",
    officialLink: "https://edistrict.assam.gov.in",
  },

  "assam-prc": {
    formId: "assam-prc",
    title: "Permanent Resident Certificate (PRC) Form",
    category: "Assam edistrict",
    whatIsThisForm:
      "A Permanent Resident Certificate (PRC) of Assam is an official document that certifies that the holder is a permanent resident of Assam. It is required for applying to state government jobs, educational seats under reserved quota, and other state-level benefits.",
    whoCanApply:
      "Permanent residents of Assam who are citizens of India and have been residents of the state for a significant period. Required mainly for state government job applications under reserved quotas.",
    documentsRequired: [
      "Aadhaar Card",
      "Voter ID / Passport as additional identity proof",
      "Land documents or rent agreement showing residence in Assam",
      "Ration Card or Electricity Bill as address proof",
      "School/College leaving certificate (proof of studying in Assam)",
      "Passport-size photograph",
      "Birth Certificate (if available)",
    ],
    stepByStep: [
      "Download the PRC application form.",
      "Fill in personal details, address, and period of residence in Assam.",
      "Attach all required documents (Aadhaar, address proof, land records/rent agreement).",
      "Submit the form at the Circle Office or SDO office of your district.",
      "The officer will verify your documents and conduct local enquiry if needed.",
      "PRC is issued within 15–30 working days after verification.",
    ],
    whereToSubmit:
      "Circle Office or Sub Divisional Officer (SDO) office of your district. Online: edistrict.assam.gov.in.",
    fee: "₹30–₹50 (online service charge). May vary by district.",
    officialLink: "https://edistrict.assam.gov.in",
  },

  "assam-residence": {
    formId: "assam-residence",
    title: "Residence / Domicile Certificate Form",
    category: "Assam edistrict",
    whatIsThisForm:
      "A Residence or Domicile Certificate is an official document issued by the Assam government certifying that the person is a resident of a particular place in Assam. It is commonly required for school/college admissions, job applications, and government schemes.",
    whoCanApply:
      "Any person residing in Assam who needs proof of their residential address for official purposes such as school/college admission, job applications, visa applications, or availing government services.",
    documentsRequired: [
      "Aadhaar Card",
      "Voter ID / PAN Card as identity proof",
      "Electricity bill / Water bill / Ration card as address proof",
      "Land records or rent/lease agreement",
      "Passport-size photograph",
    ],
    stepByStep: [
      "Download the Residence/Domicile Certificate application form.",
      "Fill in your full name, permanent address, and period of residence.",
      "Attach Aadhaar card and address proof documents.",
      "Submit at the Circle Office or SDO office in your area.",
      "The local authority will verify your address (sometimes through a local enquiry).",
      "Certificate is issued within 7–15 working days.",
    ],
    whereToSubmit:
      "Circle Office or Sub Divisional Officer office. Online: edistrict.assam.gov.in.",
    fee: "₹30 (online). Nominal fee at office counter.",
    officialLink: "https://edistrict.assam.gov.in",
  },

  "assam-employment": {
    formId: "assam-employment",
    title: "Employment Certificate Form",
    category: "Assam edistrict",
    whatIsThisForm:
      "An Employment Certificate from the Assam edistrict portal is an official document certifying the employment status or employment history of an individual. It is used for job applications, loan applications, visa processing, and welfare schemes.",
    whoCanApply:
      "Employed or self-employed residents of Assam who need an official document certifying their employment status or nature of work.",
    documentsRequired: [
      "Aadhaar Card",
      "Voter ID or PAN Card",
      "Employer's letter or business registration (for self-employed)",
      "Salary certificate or last 3 months' salary slips",
      "Passport-size photograph",
    ],
    stepByStep: [
      "Download the Employment Certificate application form.",
      "Fill in your employment details, employer name, and designation.",
      "Attach identity proof and employer letter / salary slip.",
      "Submit at the Circle Office or relevant authority.",
      "The authority will verify your employment details.",
      "Certificate is issued within 7–10 working days.",
    ],
    whereToSubmit: "Circle Office, SDO office, or edistrict.assam.gov.in.",
    fee: "₹30 (online service charge).",
    officialLink: "https://edistrict.assam.gov.in",
  },

  "assam-obc": {
    formId: "assam-obc",
    title: "OBC Certificate Application Form",
    category: "Assam edistrict",
    whatIsThisForm:
      "An OBC (Other Backward Classes) Certificate is an official document issued by the Assam government certifying that the applicant belongs to the OBC category. It is required for availing reservations in educational institutions and government jobs under the OBC quota.",
    whoCanApply:
      "Residents of Assam who belong to communities listed in the OBC category by the central or state government and whose annual family income is below the prescribed creamy layer limit.",
    documentsRequired: [
      "Aadhaar Card",
      "Proof of caste/community: Self-declaration or parent's caste certificate",
      "Income Certificate (to prove non-creamy layer status)",
      "Permanent Resident Certificate of Assam",
      "Passport-size photograph",
      "School certificate / Birth certificate as age proof",
    ],
    stepByStep: [
      "Download the OBC Certificate application form.",
      "Fill in personal details and community/caste name.",
      "Attach all required documents including income certificate.",
      "Submit at the Sub Divisional Officer (SDO) or Circle Officer office.",
      "The officer will verify caste/community membership through records.",
      "OBC certificate is issued within 15–30 working days.",
    ],
    whereToSubmit:
      "Sub Divisional Officer (SDO) office or Circle Office of your district. Online: edistrict.assam.gov.in.",
    fee: "₹30–₹50 (online). May vary.",
    officialLink: "https://edistrict.assam.gov.in",
  },

  "assam-sc": {
    formId: "assam-sc",
    title: "SC Certificate Application Form",
    category: "Assam edistrict",
    whatIsThisForm:
      "An SC (Scheduled Caste) Certificate is an official document issued by the Assam government certifying that the applicant belongs to a Scheduled Caste community. It is required for availing SC reservations in education, government jobs, and welfare schemes.",
    whoCanApply:
      "Permanent residents of Assam who belong to communities listed in the Scheduled Caste list notified by the Government of India.",
    documentsRequired: [
      "Aadhaar Card",
      "Proof of SC community membership: Parent's SC certificate or self-declaration",
      "Permanent Resident Certificate (PRC) of Assam",
      "Birth Certificate or School Certificate as age proof",
      "Passport-size photograph",
    ],
    stepByStep: [
      "Download the SC Certificate application form.",
      "Fill in your name, community name, address, and family details.",
      "Attach Aadhaar card, PRC, parent's SC certificate/caste evidence.",
      "Submit at the Circle Office or SDO office in your area.",
      "Verification is done through revenue records and local enquiry.",
      "SC certificate is issued within 15–30 working days.",
    ],
    whereToSubmit:
      "Circle Office or Sub Divisional Officer (SDO) office. Online: edistrict.assam.gov.in.",
    fee: "₹30 online service charge.",
    officialLink: "https://edistrict.assam.gov.in",
  },

  "assam-st-hills": {
    formId: "assam-st-hills",
    title: "ST (Hills) Certificate Form",
    category: "Assam edistrict",
    whatIsThisForm:
      "An ST (Hills) Certificate certifies that the applicant belongs to a Scheduled Tribe community from the hill areas of Assam. It is required for ST (Hills) reservation benefits in education, government employment, and welfare schemes.",
    whoCanApply:
      "Residents of hill areas of Assam (e.g., Karbi Anglong, Dima Hasao) who belong to Scheduled Tribe communities specifically listed under the ST (Hills) category.",
    documentsRequired: [
      "Aadhaar Card",
      "Parent's ST certificate or community membership proof",
      "Proof of residence in hill district of Assam",
      "PRC of Assam",
      "Birth Certificate or School Certificate",
      "Passport-size photograph",
    ],
    stepByStep: [
      "Download the ST (Hills) Certificate form.",
      "Fill in personal details and tribal community name.",
      "Attach Aadhaar, PRC, parent's ST document, and community proof.",
      "Submit at the Circle Officer or SDO office in the relevant hill district.",
      "Verification is done through community and revenue records.",
      "Certificate issued within 15–30 working days.",
    ],
    whereToSubmit:
      "Circle Officer or SDO office in hill district (Karbi Anglong, Dima Hasao). Online: edistrict.assam.gov.in.",
    fee: "₹30–₹50 online service charge.",
    officialLink: "https://edistrict.assam.gov.in",
  },

  "assam-st-plains": {
    formId: "assam-st-plains",
    title: "ST (Plains) Certificate Form",
    category: "Assam edistrict",
    whatIsThisForm:
      "An ST (Plains) Certificate certifies that the applicant belongs to a Scheduled Tribe community from the plains areas of Assam. It is required for ST (Plains) reservation benefits in education, government employment, and welfare schemes.",
    whoCanApply:
      "Residents of plains districts of Assam (e.g., Bodo, Mising, Rabha communities) who belong to Scheduled Tribe communities listed under ST (Plains) category.",
    documentsRequired: [
      "Aadhaar Card",
      "Parent's ST certificate or tribal community membership proof",
      "PRC of Assam (plains district)",
      "Proof of residence in plains area",
      "Birth Certificate or School Certificate",
      "Passport-size photograph",
    ],
    stepByStep: [
      "Download the ST (Plains) Certificate application form.",
      "Fill in personal details and tribal community name.",
      "Attach Aadhaar, PRC, parent's ST certificate, and community proof.",
      "Submit at the Circle Office or SDO office in your plains district.",
      "Verification through community and revenue records.",
      "Certificate issued within 15–30 working days.",
    ],
    whereToSubmit:
      "Circle Office or Sub Divisional Officer office in plains district. Online: edistrict.assam.gov.in.",
    fee: "₹30 online service charge.",
    officialLink: "https://edistrict.assam.gov.in",
  },

  "assam-mobc": {
    formId: "assam-mobc",
    title: "MOBC Certificate Form",
    category: "Assam edistrict",
    whatIsThisForm:
      "A MOBC (More Other Backward Classes) Certificate certifies that the applicant belongs to the MOBC category as notified by the Assam government. It is required for MOBC reservations in state-level education and government employment.",
    whoCanApply:
      "Permanent residents of Assam who belong to communities listed in the MOBC category by the Assam state government and whose family income is below the creamy layer limit.",
    documentsRequired: [
      "Aadhaar Card",
      "Community membership proof / parent's MOBC certificate",
      "Income Certificate (non-creamy layer)",
      "PRC of Assam",
      "Passport-size photograph",
      "Birth Certificate or School Certificate",
    ],
    stepByStep: [
      "Download the MOBC Certificate application form.",
      "Fill in personal details and MOBC community name.",
      "Attach income certificate, Aadhaar, PRC, and community proof.",
      "Submit at the Circle Office or SDO office.",
      "Officer verifies community membership and income.",
      "MOBC certificate issued within 15–30 days.",
    ],
    whereToSubmit:
      "Circle Office or SDO office of your district. Online: edistrict.assam.gov.in.",
    fee: "₹30–₹50 online service charge.",
    officialLink: "https://edistrict.assam.gov.in",
  },

  "assam-birth": {
    formId: "assam-birth",
    title: "Birth Certificate Application Form",
    category: "Assam edistrict",
    whatIsThisForm:
      "A Birth Certificate is an official government document that records the birth of a person. It is required for school admissions, passport applications, voter ID registration, and many other official purposes.",
    whoCanApply:
      "Parents or guardians of a child born in Assam who need to register the birth. Also, adults whose birth was not registered can apply for late/delayed registration.",
    documentsRequired: [
      "Hospital birth record or discharge summary (for hospital births)",
      "Aadhaar Cards of both parents",
      "Marriage Certificate of parents",
      "For delayed registration (after 1 year): Affidavit and local enquiry report",
      "Proof of address (Voter ID / Aadhaar)",
    ],
    stepByStep: [
      "For hospital births: The hospital usually registers the birth automatically — collect the registration receipt.",
      "For home births or delayed registration: Download the Birth Certificate application form.",
      "Fill in the child's name, date, time, place of birth, and parents' details.",
      "Attach hospital document / affidavit and parents' identity proof.",
      "Submit at the nearest Municipal Board, Village Panchayat, or Circle Office.",
      "Pay the applicable fee.",
      "Birth Certificate is issued within 7–15 working days after verification.",
    ],
    whereToSubmit:
      "Municipal Board office, Village Development Block, or Circle Office. Online: edistrict.assam.gov.in.",
    fee: "₹10–₹30 for timely registration. Late registration fees may be higher.",
    officialLink: "https://edistrict.assam.gov.in",
  },

  "assam-death": {
    formId: "assam-death",
    title: "Death Certificate Application Form",
    category: "Assam edistrict",
    whatIsThisForm:
      "A Death Certificate is an official government document certifying the death of a person. It is required for claiming insurance, transferring property, pension, bank accounts, and many other legal purposes.",
    whoCanApply:
      "Family members or relatives of the deceased who need an official record of death. Usually filed by the head of family, hospital, or local authority.",
    documentsRequired: [
      "Hospital death record or doctor's certificate stating cause and time of death",
      "Aadhaar Card / identity proof of the deceased (if available)",
      "Applicant's Aadhaar Card (family member applying)",
      "Proof of relationship with the deceased",
      "For delayed registration: Affidavit and supporting evidence",
    ],
    stepByStep: [
      "For hospital deaths: Hospital may issue a death notice. Collect it immediately.",
      "Download the Death Certificate application form or get it from the local body.",
      "Fill in the deceased's name, date, time, and place of death.",
      "Attach the hospital death record / doctor's certificate and family ID proof.",
      "Submit at the nearest Municipal Board, Panchayat, or Circle Office within 21 days.",
      "Pay the applicable fee.",
      "Death Certificate is issued within 7–15 working days.",
    ],
    whereToSubmit:
      "Municipal Board, Village Development Block, or Circle Office. Online: edistrict.assam.gov.in.",
    fee: "₹10–₹30 for timely registration.",
    officialLink: "https://edistrict.assam.gov.in",
  },

  "assam-marriage": {
    formId: "assam-marriage",
    title: "Marriage Certificate Application Form",
    category: "Assam edistrict",
    whatIsThisForm:
      "A Marriage Certificate is an official document issued by the government certifying the legal marriage of two individuals. It is required for passport applications, visa, name change, joint bank accounts, and various legal purposes.",
    whoCanApply:
      "Married couples who want official government registration of their marriage under the Special Marriage Act or Hindu Marriage Act.",
    documentsRequired: [
      "Identity proof of bride and groom (Aadhaar / Voter ID / Passport)",
      "Address proof of bride and groom",
      "Age proof: Birth certificates of both",
      "Two passport-size photographs of each",
      "Wedding photographs",
      "Witnesses: 2 witnesses with their identity proof and photographs",
    ],
    stepByStep: [
      "Download the Marriage Certificate application form.",
      "Both bride and groom fill the form together.",
      "Attach identity, age, and address proofs for both.",
      "Include 2 witnesses' details and proofs.",
      "Submit at the Registrar of Marriages (SDM office) in your district.",
      "Both parties must be present on the day of registration.",
      "Certificate is issued on the same day or within 3–7 working days.",
    ],
    whereToSubmit:
      "Sub Divisional Magistrate (SDM) office or Registrar of Marriages. Online: edistrict.assam.gov.in.",
    fee: "₹100–₹200 depending on act and district.",
    officialLink: "https://edistrict.assam.gov.in",
  },

  "assam-land": {
    formId: "assam-land",
    title: "Land Record / Jamabandi Form",
    category: "Assam edistrict",
    whatIsThisForm:
      "Land Record or Jamabandi is an official document showing the ownership and details of land in Assam. It is required for property transactions, bank loans against land, and legal disputes.",
    whoCanApply:
      "Any landowner or claimant in Assam who needs an official copy of their land records for legal or financial purposes.",
    documentsRequired: [
      "Aadhaar Card of the applicant",
      "Exact land details: Mouza name, Dag number, Patta number",
      "Previous land documents if available",
    ],
    stepByStep: [
      "Visit the Circle Office or apply online at dharitri.assam.gov.in.",
      "Enter your Dag number and Patta number to search land records.",
      "Download the Jamabandi or request a certified copy.",
      "For certified copy: Submit request form at Circle Office with Aadhaar and land details.",
      "Pay the fee.",
      "Certified copy issued within 3–7 working days.",
    ],
    whereToSubmit:
      "Circle Office of your revenue circle. Online at dharitri.assam.gov.in or edistrict.assam.gov.in.",
    fee: "₹15–₹30 for certified copy.",
    officialLink: "https://dharitri.assam.gov.in",
  },

  "assam-bpl": {
    formId: "assam-bpl",
    title: "BPL Certificate Application Form",
    category: "Assam edistrict",
    whatIsThisForm:
      "A BPL (Below Poverty Line) Certificate is an official document certifying that a family's income is below the poverty line as defined by the government. It is required for free/subsidized ration, health schemes, fee waivers, and various welfare programs.",
    whoCanApply:
      "Families in Assam whose annual household income is below the BPL threshold set by the state government, and who are listed in the BPL survey.",
    documentsRequired: [
      "Aadhaar Card of head of family",
      "Ration Card (if available)",
      "Income declaration / Income Certificate",
      "Residence proof (Voter ID / Electricity bill)",
      "Passport-size photograph of head of family",
    ],
    stepByStep: [
      "Check if your family is listed in the BPL survey list (available at local Panchayat).",
      "Download the BPL Certificate application form.",
      "Fill in family details, income, and household information.",
      "Attach Aadhaar, income declaration, and residence proof.",
      "Submit at the Block Development Office (BDO) or Circle Office.",
      "BPL verification officer will visit for local enquiry if required.",
      "Certificate issued after verification.",
    ],
    whereToSubmit:
      "Block Development Office (BDO) or Circle Office. Online: edistrict.assam.gov.in.",
    fee: "Free.",
    officialLink: "https://edistrict.assam.gov.in",
  },

  "passport-sp-en": {
    formId: "passport-sp-en",
    title: "Passport Application Form SP – English",
    category: "Passport",
    whatIsThisForm:
      "Form SP (Supplementary Form) is the official passport application form for Indian citizens. It is filled along with the online passport application at the Passport Seva portal for applying for a fresh passport or renewal.",
    whoCanApply:
      "Any Indian citizen applying for a fresh passport, renewal of expired passport, or additional booklet. Minimum age is no longer required — passports are issued to applicants of all ages.",
    documentsRequired: [
      "Aadhaar Card (mandatory)",
      "Proof of Date of Birth: Birth Certificate / Aadhaar / Matriculation Certificate",
      "Proof of Address: Aadhaar / Bank Passbook / Voter ID / Driving Licence",
      "Proof of Residence: Aadhaar / Electricity bill / Gas bill",
      "Old Passport (for renewal applications)",
      "2 passport-size photographs (white background)",
    ],
    stepByStep: [
      "Register on passportindia.gov.in and fill the online application form.",
      "Download the Form SP (supplementary form) and fill it if required.",
      "Book an appointment at the nearest Passport Seva Kendra (PSK) or Post Office Passport Seva Kendra (POPSK).",
      "Visit the PSK on the appointment date with original documents and photocopies.",
      "Documents are verified and biometrics are captured.",
      "Pay the fee at the PSK.",
      "Police verification is done (pre-verification for Tatkaal).",
      "Passport is delivered by post within 3–5 weeks for normal, 1–3 weeks for Tatkaal.",
    ],
    whereToSubmit:
      "Passport Seva Kendra (PSK) or Post Office Passport Seva Kendra (POPSK). Apply online at passportindia.gov.in.",
    fee: "₹1,500 (36-page) or ₹2,000 (60-page) for fresh application. ₹3,500/₹4,000 for Tatkaal.",
    officialLink: "https://passportindia.gov.in",
  },

  "passport-sp-as": {
    formId: "passport-sp-as",
    title: "Passport Application Form SP – Assamese",
    category: "Passport",
    whatIsThisForm:
      "This is the Assamese language version of the passport application Form SP, same as the English version but printed in Assamese for ease of reference by Assamese-speaking applicants.",
    whoCanApply:
      "Indian citizens residing in Assam applying for a passport. The form can be filled in Assamese.",
    documentsRequired: [
      "Aadhaar Card",
      "Proof of Date of Birth",
      "Proof of Address",
      "Old Passport (for renewal)",
      "2 passport-size photographs (white background)",
    ],
    stepByStep: [
      "Apply online at passportindia.gov.in first.",
      "Refer to the Assamese form for understanding the fields.",
      "Book appointment at PSK in Guwahati or nearest POPSK.",
      "Carry original and photocopy of all documents to the appointment.",
      "Get documents verified and biometrics captured.",
      "Passport will be delivered by post after police verification.",
    ],
    whereToSubmit:
      "Passport Seva Kendra Guwahati or nearest POPSK. Apply online at passportindia.gov.in.",
    fee: "₹1,500–₹2,000 (normal) or ₹3,500–₹4,000 (Tatkaal).",
    officialLink: "https://passportindia.gov.in",
  },

  "passport-minor": {
    formId: "passport-minor",
    title: "Minor Passport Application Form",
    category: "Passport",
    whatIsThisForm:
      "A minor passport is issued to Indian children below 18 years of age. It is valid for 5 years or until the child turns 18, whichever is earlier. It requires consent and signature of both parents or a guardian.",
    whoCanApply:
      "Parents or guardians applying for a passport for their child below 18 years of age.",
    documentsRequired: [
      "Child's Aadhaar Card / Birth Certificate as age proof",
      "Aadhaar Cards of both parents",
      "Parents' passports (if available)",
      "Parent's marriage certificate (if both parents have different surnames)",
      "In case of single parent: Court order or death certificate of other parent",
      "2 passport-size photographs of the child (white background)",
    ],
    stepByStep: [
      "Apply online at passportindia.gov.in under 'Minor Passport' category.",
      "Both parents must sign the Annexure forms (consent forms).",
      "Book appointment at PSK — child and at least one parent must be present.",
      "Bring originals and photocopies of all documents.",
      "Minor passport is processed without police verification in most cases.",
      "Passport delivered by post within 2–4 weeks.",
    ],
    whereToSubmit:
      "Passport Seva Kendra (PSK) or Post Office PSK. Apply online at passportindia.gov.in.",
    fee: "₹1,000 (36-page) for children below 18. ₹2,000 for Tatkaal.",
    officialLink: "https://passportindia.gov.in",
  },

  "passport-police-verification": {
    formId: "passport-police-verification",
    title: "Police Verification Form",
    category: "Passport",
    whatIsThisForm:
      "The Police Verification Form is submitted to the local police station for verifying the applicant's address and background as part of the passport application process. It is required for normal passport applications.",
    whoCanApply:
      "Passport applicants whose application requires police verification (most fresh passport applications for adults).",
    documentsRequired: [
      "Passport application acknowledgment / appointment receipt",
      "Aadhaar Card or address proof",
      "Proof of residence at current address",
      "Passport-size photograph",
    ],
    stepByStep: [
      "After submitting your passport application at PSK, the police verification notice will be sent to your local police station.",
      "A police officer will visit your residence address for verification.",
      "Keep your original documents ready for verification.",
      "If you need to submit this form separately: fill in your address, personal details, and passport application number.",
      "Submit at the local police station or SHO office.",
      "Police sends verification report to passport office.",
      "Passport is dispatched after positive verification.",
    ],
    whereToSubmit:
      "Local Police Station / SHO office in your residential area.",
    fee: "Free (police verification is part of the passport process).",
    officialLink: "https://passportindia.gov.in",
  },

  "voter-form6": {
    formId: "voter-form6",
    title: "Form 6 – New Voter Registration",
    category: "Voter ID",
    whatIsThisForm:
      "Form 6 is the registration form for new voters to enroll in the Electoral Roll (Voter List) for the first time. It is required for all Indian citizens who have turned 18 and want to register as voters.",
    whoCanApply:
      "Indian citizens who are 18 years of age or above on the qualifying date (January 1st of the year) and are not yet registered as voters.",
    documentsRequired: [
      "Proof of Age: Birth Certificate / Aadhaar / School Certificate / Passport",
      "Proof of Residence: Aadhaar / Bank Passbook / Utility Bill / PAN Card",
      "Passport-size photograph",
      "Aadhaar number (recommended)",
    ],
    stepByStep: [
      "Apply online at voters.eci.gov.in or download Form 6.",
      "Fill in your personal details: name, date of birth, and address.",
      "Select the Assembly Constituency where you want to register.",
      "Attach age proof, residence proof, and photograph.",
      "Submit at the Electoral Registration Officer (ERO) office or Booth Level Officer (BLO).",
      "You will receive an acknowledgment. Your name will appear in the draft voter list.",
      "Voter ID card (EPIC) will be issued within 30–60 days.",
    ],
    whereToSubmit:
      "Electoral Registration Officer (ERO) office, Booth Level Officer, or online at voters.eci.gov.in.",
    fee: "Free.",
    officialLink: "https://voters.eci.gov.in",
  },

  "voter-form6a": {
    formId: "voter-form6a",
    title: "Form 6A – NRI Voter Registration",
    category: "Voter ID",
    whatIsThisForm:
      "Form 6A is used by Non-Resident Indians (NRIs) to register as overseas electors in the Indian Electoral Roll. NRIs can vote in person at their constituency when they visit India on Election Day.",
    whoCanApply:
      "Indian citizens who are 18 years or above and ordinarily residing outside India, holding an Indian passport, and have not acquired citizenship of any foreign country.",
    documentsRequired: [
      "Indian Passport copy (mandatory)",
      "Proof of address in India (the address in Form 6A must match passport address)",
      "Passport-size photograph",
      "NRI declaration",
    ],
    stepByStep: [
      "Apply online at voters.eci.gov.in from any country.",
      "Fill Form 6A with your Indian address and passport details.",
      "Attach self-attested copy of Indian passport.",
      "Submit online or through the Indian Mission/Consulate in your country.",
      "Your name will be added to the voter list of your home constituency in India.",
      "You must be present in person at your constituency to vote on Election Day.",
    ],
    whereToSubmit:
      "Online at voters.eci.gov.in or through Indian Embassy/Consulate in your country.",
    fee: "Free.",
    officialLink: "https://voters.eci.gov.in",
  },

  "voter-form7": {
    formId: "voter-form7",
    title: "Form 7 – Deletion from Electoral Roll",
    category: "Voter ID",
    whatIsThisForm:
      "Form 7 is used to request deletion of a name from the Electoral Roll. It is filed when a person has died, shifted permanently to another constituency, or has been registered as a voter in multiple places.",
    whoCanApply:
      "Any registered voter or family member of a deceased voter who wants to delete a name from the voter list. Can also be filed by any elector objecting to the inclusion of a name in the voter list.",
    documentsRequired: [
      "Death Certificate (for deceased person's name deletion)",
      "Proof of migration / new address (for shifted persons)",
      "Objector's identity and voter ID",
      "Details of the voter whose name needs to be deleted (EPIC number)",
    ],
    stepByStep: [
      "Download Form 7 or apply online at voters.eci.gov.in.",
      "Fill in the details of the voter whose name is to be deleted.",
      "State the reason for deletion: death, migration, or duplicate.",
      "Attach supporting document: death certificate or migration proof.",
      "Submit to the Electoral Registration Officer (ERO) of the concerned constituency.",
      "ERO will verify the claim and delete the name after due process.",
    ],
    whereToSubmit:
      "Electoral Registration Officer (ERO) office of the constituency. Online at voters.eci.gov.in.",
    fee: "Free.",
    officialLink: "https://voters.eci.gov.in",
  },

  "voter-form8": {
    formId: "voter-form8",
    title: "Form 8 – Correction of Entries in Electoral Roll",
    category: "Voter ID",
    whatIsThisForm:
      "Form 8 is used to request correction of any entry in the Electoral Roll, such as name spelling, photograph, age/date of birth, gender, or address correction.",
    whoCanApply:
      "Any registered voter who has noticed an error in their voter list entry (wrong spelling, incorrect DOB, missing photograph, etc.).",
    documentsRequired: [
      "Existing Voter ID card (EPIC) copy",
      "Document supporting the correction (Aadhaar / birth certificate for DOB correction)",
      "Recent passport-size photograph (for photo update)",
    ],
    stepByStep: [
      "Apply online at voters.eci.gov.in or download Form 8.",
      "Enter your existing EPIC (Voter ID) number.",
      "Select the field to be corrected and provide the correct information.",
      "Attach the supporting document for the correction.",
      "Submit to the Electoral Registration Officer.",
      "A new voter ID with corrected details will be issued within 30–45 days.",
    ],
    whereToSubmit:
      "Electoral Registration Officer (ERO) office or online at voters.eci.gov.in.",
    fee: "Free.",
    officialLink: "https://voters.eci.gov.in",
  },

  "voter-form8a": {
    formId: "voter-form8a",
    title: "Form 8A – Transposition of Entries",
    category: "Voter ID",
    whatIsThisForm:
      "Form 8A is used to shift your voter registration from one part of the electoral roll to another within the same constituency — for example, when you shift residence within the same assembly constituency.",
    whoCanApply:
      "Registered voters who have shifted their residence within the same assembly constituency and want their voter registration updated to the new address/polling booth.",
    documentsRequired: [
      "Existing Voter ID (EPIC)",
      "Proof of new address within the same constituency (Aadhaar / Utility Bill)",
    ],
    stepByStep: [
      "Verify that your new address is within the same assembly constituency.",
      "Download Form 8A or apply online at voters.eci.gov.in.",
      "Fill in your EPIC number and new address details.",
      "Attach proof of new address.",
      "Submit to the ERO or Booth Level Officer (BLO) of the new address area.",
      "Your polling booth will be updated within 30–45 days.",
    ],
    whereToSubmit:
      "ERO office or Booth Level Officer (BLO) at new address. Online at voters.eci.gov.in.",
    fee: "Free.",
    officialLink: "https://voters.eci.gov.in",
  },

  "dl-form1": {
    formId: "dl-form1",
    title: "Form 1 – Medical Certificate",
    category: "Driving Licence",
    whatIsThisForm:
      "Form 1 is a medical fitness declaration form required for applying for a Learner's Licence or Driving Licence. It certifies that the applicant is physically and mentally fit to drive a motor vehicle.",
    whoCanApply:
      "Anyone applying for a Learner's Licence (LL) or Driving Licence (DL) for the first time, or renewing a DL for certain categories.",
    documentsRequired: [
      "Identity proof: Aadhaar / Voter ID / Passport",
      "Doctor's registration number and signature",
    ],
    stepByStep: [
      "Download Form 1 from parivahan.gov.in or get it from the RTO office.",
      "Visit a registered medical practitioner (MBBS doctor).",
      "The doctor will examine your eyesight, hearing, and physical fitness.",
      "The doctor fills and signs the form, certifying your fitness.",
      "Attach Form 1 to your Learner's Licence / Driving Licence application.",
    ],
    whereToSubmit:
      "Attach with your LL/DL application at the Regional Transport Office (RTO) or online at sarathi.parivahan.gov.in.",
    fee: "Doctor's consultation fee (varies: ₹50–₹200 typically).",
    officialLink: "https://sarathi.parivahan.gov.in",
  },

  "dl-form2": {
    formId: "dl-form2",
    title: "Form 2 – Application for Learner's Licence",
    category: "Driving Licence",
    whatIsThisForm:
      "Form 2 is the official application form for obtaining a Learner's Licence (LL) from the Regional Transport Office (RTO). A Learner's Licence allows you to practice driving under supervision before getting a permanent DL.",
    whoCanApply:
      "Indian citizens who are 16 years or above (for 2-wheelers up to 50cc) or 18 years or above (for cars, motorcycles above 50cc) and wish to learn to drive.",
    documentsRequired: [
      "Proof of Age: Aadhaar / Birth Certificate / Passport (must be 18+ for cars)",
      "Proof of Address: Aadhaar / Voter ID / Utility Bill",
      "Medical Certificate (Form 1, signed by MBBS doctor)",
      "2 passport-size photographs (white/light background)",
      "Application fee payment receipt",
    ],
    stepByStep: [
      "Apply online at sarathi.parivahan.gov.in or visit RTO with Form 2.",
      "Fill in personal details, vehicle class (two-wheeler, four-wheeler, etc.).",
      "Attach age proof, address proof, medical certificate (Form 1), and photos.",
      "Pay the fee online or at the RTO counter.",
      "Appear for the Learner's Licence test (traffic rules and signs test) at the RTO.",
      "If you pass the test, the LL is issued on the spot or within 7 days.",
      "LL is valid for 6 months — you must apply for DL before it expires.",
    ],
    whereToSubmit:
      "Regional Transport Office (RTO) in your district or online at sarathi.parivahan.gov.in.",
    fee: "₹150–₹300 depending on the vehicle class and state.",
    officialLink: "https://sarathi.parivahan.gov.in",
  },

  "dl-form4": {
    formId: "dl-form4",
    title: "Form 4 – Application for Driving Licence",
    category: "Driving Licence",
    whatIsThisForm:
      "Form 4 is the application form for obtaining a permanent Driving Licence (DL). You can apply for DL after holding a valid Learner's Licence for at least 30 days and not more than 180 days.",
    whoCanApply:
      "Learner's Licence holders who have completed the minimum 30-day waiting period after getting their LL and want to get a permanent Driving Licence.",
    documentsRequired: [
      "Valid Learner's Licence (must be 30+ days old)",
      "Proof of Age: Aadhaar / Birth Certificate / Passport",
      "Proof of Address: Aadhaar / Voter ID / Utility Bill",
      "Medical Certificate (Form 1A for heavy vehicles)",
      "2 passport-size photographs",
      "Fee payment receipt",
    ],
    stepByStep: [
      "Apply online at sarathi.parivahan.gov.in or visit the RTO with Form 4.",
      "Attach your Learner's Licence, age proof, address proof, and photographs.",
      "Pay the fee.",
      "Book your driving test appointment at the RTO.",
      "Appear for the driving test on the appointed date.",
      "If you pass, the DL is issued within 7–30 days and delivered by post.",
    ],
    whereToSubmit:
      "Regional Transport Office (RTO) or online at sarathi.parivahan.gov.in.",
    fee: "₹200–₹500 depending on vehicle class and state.",
    officialLink: "https://sarathi.parivahan.gov.in",
  },

  "dl-form7": {
    formId: "dl-form7",
    title: "Form 7 – Application for DL Renewal",
    category: "Driving Licence",
    whatIsThisForm:
      "Form 7 is used to apply for renewal of an expired or expiring Driving Licence. DL can be renewed before it expires (up to 1 year before) or after expiry (within a grace period).",
    whoCanApply:
      "Driving Licence holders whose licence has expired or is about to expire. Those whose DL expired more than 1 year ago may need to appear for a driving test again.",
    documentsRequired: [
      "Original expired/expiring Driving Licence",
      "Medical Certificate (Form 1) if over 40 years of age",
      "Proof of Address: Aadhaar / Voter ID",
      "2 passport-size photographs",
      "Fee payment",
    ],
    stepByStep: [
      "Apply online at sarathi.parivahan.gov.in up to 1 year before expiry.",
      "Fill Form 7 with DL number and personal details.",
      "Attach original DL, address proof, and photographs.",
      "Persons over 40 must attach a fresh medical certificate.",
      "Pay the renewal fee.",
      "Renewed DL is sent by post within 7–30 days.",
    ],
    whereToSubmit: "RTO office or online at sarathi.parivahan.gov.in.",
    fee: "₹200–₹400 depending on vehicle class.",
    officialLink: "https://sarathi.parivahan.gov.in",
  },

  "dl-form9": {
    formId: "dl-form9",
    title: "Form 9 – Application for International DL",
    category: "Driving Licence",
    whatIsThisForm:
      "Form 9 is the application form for an International Driving Permit (IDP) which allows Indian DL holders to drive in foreign countries. IDP is valid for 1 year or the remaining validity of the Indian DL, whichever is less.",
    whoCanApply:
      "Valid Indian Driving Licence holders who are planning to drive in a foreign country that accepts IDPs under the 1968 Vienna Convention.",
    documentsRequired: [
      "Valid Indian Driving Licence (original)",
      "Valid Indian Passport",
      "Valid Visa for the destination country",
      "Proof of Address: Aadhaar / Voter ID",
      "2 passport-size photographs (white background)",
      "Fee payment",
    ],
    stepByStep: [
      "Download Form 9 or apply at your RTO office.",
      "Fill in DL number, destination country, and travel dates.",
      "Attach valid DL, passport, visa, and photographs.",
      "Submit at the RTO with the fee.",
      "IDP is usually issued on the same day or within 1–3 days at the RTO.",
      "The IDP must always be carried along with your original Indian DL while driving abroad.",
    ],
    whereToSubmit:
      "Regional Transport Office (RTO) in person. Not available online — must visit RTO.",
    fee: "₹1,000 (as per Motor Vehicles Act).",
    officialLink: "https://sarathi.parivahan.gov.in",
  },

  "it-itr1": {
    formId: "it-itr1",
    title: "ITR-1 (SAHAJ) – Income Tax Return",
    category: "Income Tax",
    whatIsThisForm:
      "ITR-1 (SAHAJ) is the simplest income tax return form for salaried individuals. It is used by individuals with income from salary, one house property, family pension, and other sources (interest, etc.) with total income up to ₹50 lakh.",
    whoCanApply:
      "Salaried individuals (employees), pensioners, and those with income from one house property and savings interest, with total annual income up to ₹50 lakh. Not applicable for those with capital gains, foreign income, or business income.",
    documentsRequired: [
      "Form 16 issued by employer (Part A and Part B)",
      "Bank account details (account number and IFSC)",
      "Interest certificates from bank (savings and FD interest)",
      "Aadhaar number and PAN card",
      "Previous year's ITR (for reference)",
      "Investment proofs (80C, 80D, HRA receipts if not reflected in Form 16)",
    ],
    stepByStep: [
      "Collect Form 16 from your employer.",
      "Log in to incometax.gov.in with your PAN and password.",
      "Go to 'e-File' > 'Income Tax Returns' > 'File Income Tax Return'.",
      "Select Assessment Year and ITR-1 form.",
      "Pre-filled data from Form 16 and AIS (Annual Information Statement) will appear — verify and correct.",
      "Enter deductions (80C, 80D, HRA, etc.) and check the computed tax.",
      "Pay any tax due (self-assessment tax) via Challan 280 before filing.",
      "Submit and e-verify the return (Aadhaar OTP is the easiest method).",
    ],
    whereToSubmit:
      "Online only at incometax.gov.in. Paper filing is not allowed for most filers.",
    fee: "Free to file online. Tax due (if any) must be paid before filing.",
    officialLink: "https://incometax.gov.in",
  },

  "it-itr2": {
    formId: "it-itr2",
    title: "ITR-2 – Income Tax Return",
    category: "Income Tax",
    whatIsThisForm:
      "ITR-2 is the income tax return form for individuals and HUFs who have income from capital gains (sale of shares, property, mutual funds), more than one house property, foreign assets, or total income above ₹50 lakh.",
    whoCanApply:
      "Individuals and HUFs (Hindu Undivided Families) with income from capital gains, more than one house property, foreign income/assets, or those who cannot use ITR-1. Not for those with business/professional income.",
    documentsRequired: [
      "Form 16 from employer",
      "Capital gains statement from broker / mutual fund (Form 10B)",
      "Sale deed / property documents for property capital gains",
      "Foreign account details (if any)",
      "Bank account details",
      "PAN and Aadhaar",
    ],
    stepByStep: [
      "Log in to incometax.gov.in.",
      "Select ITR-2 form under 'File Income Tax Return'.",
      "Fill salary income from Form 16, capital gains from broker statements.",
      "Enter all house property income details.",
      "Enter foreign assets if applicable.",
      "Claim deductions (80C, 80D, etc.).",
      "Calculate tax, pay any dues, and submit.",
      "E-verify with Aadhaar OTP.",
    ],
    whereToSubmit: "Online at incometax.gov.in.",
    fee: "Free to file. Pay tax dues before filing.",
    officialLink: "https://incometax.gov.in",
  },

  "it-itr4": {
    formId: "it-itr4",
    title: "ITR-4 (SUGAM) – Presumptive Income",
    category: "Income Tax",
    whatIsThisForm:
      "ITR-4 (SUGAM) is for individuals, HUFs, and firms using the presumptive taxation scheme under Sections 44AD (business), 44ADA (professionals), and 44AE (transport). It simplifies tax filing for small businesses and freelancers.",
    whoCanApply:
      "Small business owners, shopkeepers, freelancers, doctors, lawyers, and transport operators whose total income is up to ₹50 lakh and who opt for the presumptive taxation scheme.",
    documentsRequired: [
      "Business income records (turnover, receipts)",
      "Bank account statements",
      "PAN and Aadhaar",
      "Form 16A (TDS certificates from clients, if any)",
      "Details of income from all sources",
    ],
    stepByStep: [
      "Log in to incometax.gov.in.",
      "Select ITR-4 under 'File Income Tax Return'.",
      "Enter business details and turnover.",
      "Under presumptive scheme: declare 8% (or 6% for digital payments) of turnover as profit for business, or 50% of gross receipts for professionals.",
      "Enter other income sources.",
      "Claim eligible deductions.",
      "Pay tax dues and e-verify.",
    ],
    whereToSubmit: "Online at incometax.gov.in.",
    fee: "Free to file. Pay tax dues before filing.",
    officialLink: "https://incometax.gov.in",
  },

  "it-form16": {
    formId: "it-form16",
    title: "Form 16 – TDS Certificate (Salary)",
    category: "Income Tax",
    whatIsThisForm:
      "Form 16 is a TDS (Tax Deducted at Source) certificate issued by an employer to an employee every year. It shows the total salary paid and the tax deducted from the employee's salary during the financial year. It is essential for filing income tax returns.",
    whoCanApply:
      "Salaried employees receive Form 16 from their employer. If your employer deducts TDS from your salary, you are entitled to receive Form 16 by June 15th every year for the previous financial year.",
    documentsRequired: [
      "No documents needed — your employer prepares and issues Form 16.",
      "Provide your PAN to your employer to ensure correct TDS credit.",
    ],
    stepByStep: [
      "Contact your HR or Finance/Accounts department after the financial year ends (April 1).",
      "Request Form 16 — employers must issue it by June 15th.",
      "Check Part A (TDS deducted and deposited) and Part B (salary breakup and deductions).",
      "Use Form 16 data to file your ITR-1 on incometax.gov.in.",
      "Verify TDS in Form 26AS (tax credit statement) on the income tax portal.",
      "If any discrepancy, ask your employer to rectify it.",
    ],
    whereToSubmit:
      "Issued by employer — no submission required. Use it to file ITR.",
    fee: "Free — employer provides it.",
    officialLink: "https://incometax.gov.in",
  },

  "it-form15g": {
    formId: "it-form15g",
    title: "Form 15G – Declaration for Non-Deduction of TDS",
    category: "Income Tax",
    whatIsThisForm:
      "Form 15G is a self-declaration form submitted to prevent TDS (Tax Deducted at Source) on interest income (bank FDs, RDs, NSC, PF withdrawal, etc.) when your total taxable income is below the basic exemption limit. It is for persons below 60 years.",
    whoCanApply:
      "Indian residents below 60 years of age whose estimated total income for the year is below the basic exemption limit (₹2.5 lakh for FY 2024-25) and the interest income does not exceed ₹10,000 per year (₹40,000 for bank FDs).",
    documentsRequired: [
      "PAN Card (mandatory — form is invalid without PAN)",
      "Aadhaar Card",
      "Bank account details",
    ],
    stepByStep: [
      "Download Form 15G from the bank's website or the income tax portal.",
      "Fill in your name, PAN, address, and assessment year.",
      "Declare that your estimated total income is below the taxable limit.",
      "Enter income on which TDS is to be avoided (e.g., FD interest amount).",
      "Sign the form and submit to your bank branch or financial institution.",
      "Submit Form 15G at the start of each financial year (April–June).",
      "Keep a copy for your records.",
    ],
    whereToSubmit:
      "Bank branch, post office, or financial institution where you have FD/RD. Many banks accept online submission.",
    fee: "Free.",
    officialLink: "https://incometax.gov.in",
  },

  "it-form15h": {
    formId: "it-form15h",
    title: "Form 15H – Declaration for Senior Citizens",
    category: "Income Tax",
    whatIsThisForm:
      "Form 15H is a self-declaration form for senior citizens (60 years and above) to prevent TDS on interest income when their total tax liability for the year is nil. Similar to Form 15G but specifically for senior citizens.",
    whoCanApply:
      "Indian residents who are 60 years of age or above during the financial year and whose estimated total tax liability is nil (even if income exceeds basic exemption limit of ₹3 lakh for senior citizens).",
    documentsRequired: [
      "PAN Card (mandatory)",
      "Aadhaar Card",
      "Age proof (for first-time submission)",
    ],
    stepByStep: [
      "Download Form 15H from the bank website or income tax portal.",
      "Fill in your name, PAN, date of birth, and address.",
      "Declare estimated income and confirm tax liability is nil.",
      "Enter the nature and amount of income on which TDS should not be deducted.",
      "Sign the form and submit to your bank or financial institution.",
      "Submit at the beginning of each financial year.",
    ],
    whereToSubmit:
      "Bank branch, post office, or financial institution. Many banks accept online.",
    fee: "Free.",
    officialLink: "https://incometax.gov.in",
  },

  "ration-new": {
    formId: "ration-new",
    title: "Ration Card New Application Form (Assam)",
    category: "Ration Card",
    whatIsThisForm:
      "A Ration Card is an official document issued by the Assam Food and Civil Supplies Department that entitles a family to purchase subsidized food grains (rice, wheat, sugar, kerosene) from the Public Distribution System (PDS).",
    whoCanApply:
      "Residents of Assam who do not have an existing ration card and whose household income qualifies for APL (Above Poverty Line), BPL (Below Poverty Line), or Antyodaya Anna Yojana (AAY) category.",
    documentsRequired: [
      "Aadhaar Cards of all family members",
      "Proof of residence: Electricity bill / Voter ID / Bank passbook",
      "Family photograph",
      "Income Certificate (for BPL/AAY category)",
      "Surrender certificate from previous state (if migrated from another state)",
      "Marriage certificate (for newly married couples)",
    ],
    stepByStep: [
      "Download the Ration Card application form or get it from your local Circle Office or Food and Civil Supplies office.",
      "Fill in family details: head of family name, all members, ages, and Aadhaar numbers.",
      "Select the category: APL, BPL, or AAY.",
      "Attach Aadhaar copies of all family members, address proof, and income certificate if applying for BPL.",
      "Submit at the Circle Office or apply online at aahar.assam.gov.in.",
      "A field officer may visit to verify residence.",
      "Ration Card is issued within 30–45 working days after verification.",
    ],
    whereToSubmit:
      "Circle Office or District Food and Civil Supplies Office. Online: aahar.assam.gov.in.",
    fee: "Free.",
    officialLink: "https://aahar.assam.gov.in",
  },

  "ration-correction": {
    formId: "ration-correction",
    title: "Ration Card Correction / Update Form",
    category: "Ration Card",
    whatIsThisForm:
      "This form is used to request corrections or updates in the existing ration card — such as adding a new family member (newborn/marriage), removing a deceased member, correcting name spelling, or changing the address.",
    whoCanApply:
      "Existing ration card holders in Assam who want to update or correct their ration card details.",
    documentsRequired: [
      "Existing Ration Card",
      "Aadhaar Card of the person being added/corrected",
      "Birth Certificate (for adding newborn)",
      "Marriage Certificate (for adding spouse)",
      "Death Certificate (for removing deceased member)",
    ],
    stepByStep: [
      "Visit the Circle Office or Food and Civil Supplies office.",
      "Fill the Ration Card Correction form specifying what change is needed.",
      "Attach the supporting document for the change.",
      "Submit the form and existing ration card.",
      "Change is processed within 15–30 working days.",
    ],
    whereToSubmit:
      "Circle Office or District Food and Civil Supplies Office. Online: aahar.assam.gov.in.",
    fee: "Free.",
    officialLink: "https://aahar.assam.gov.in",
  },

  "rti-application": {
    formId: "rti-application",
    title: "RTI Application Form",
    category: "RTI",
    whatIsThisForm:
      "An RTI (Right to Information) application is a formal request filed under the Right to Information Act 2005 to obtain information from any government department or public authority in India. Every Indian citizen has the right to file an RTI.",
    whoCanApply:
      "Any Indian citizen who wants information from any government office, department, ministry, or public authority.",
    documentsRequired: [
      "No mandatory documents required",
      "Application fee payment: ₹10 (postal order / court fee stamp / online)",
      "Identity proof may be asked by some offices but is not mandatory by law",
    ],
    stepByStep: [
      "Write a clear application addressed to the Public Information Officer (PIO) of the concerned department.",
      "Mention your name, address, and the specific information you want.",
      "Keep the request precise and clear — mention the department, documents, or records you seek.",
      "Attach the ₹10 application fee (postal order, court fee stamp, or online payment at rtionline.gov.in).",
      "Submit by post, in person at the department, or online at rtionline.gov.in (for Central Government).",
      "You should receive a reply within 30 days. If denied, file First Appeal (Form 1 before FAA).",
    ],
    whereToSubmit:
      "Public Information Officer (PIO) of the concerned department. Online: rtionline.gov.in (Central Govt).",
    fee: "₹10 application fee. No fee for BPL applicants.",
    officialLink: "https://rtionline.gov.in",
  },

  "rti-first-appeal": {
    formId: "rti-first-appeal",
    title: "RTI First Appeal Form",
    category: "RTI",
    whatIsThisForm:
      "The RTI First Appeal form is used to file a First Appeal when you are not satisfied with the response received from the Public Information Officer (PIO), or if the PIO has not responded within 30 days.",
    whoCanApply:
      "Any RTI applicant who did not receive information within 30 days, received incomplete information, or is dissatisfied with the PIO's response.",
    documentsRequired: [
      "Copy of original RTI application",
      "Copy of PIO's response (or proof of no response)",
      "Clear statement of what information was denied and why you are appealing",
      "No fee for First Appeal",
    ],
    stepByStep: [
      "Prepare the First Appeal addressed to the First Appellate Authority (FAA) — usually the officer senior to the PIO.",
      "Fill the First Appeal form mentioning your RTI application date and reference number.",
      "State the grounds for appeal clearly: non-response, incomplete information, or denial without valid reason.",
      "Attach copy of original RTI application and PIO's reply.",
      "Submit by post, in person, or online at rtionline.gov.in.",
      "No fee is required for First Appeal.",
      "FAA must respond within 30 days (can extend to 45 days with reasons).",
    ],
    whereToSubmit:
      "First Appellate Authority (FAA) of the concerned department. Online: rtionline.gov.in.",
    fee: "Free.",
    officialLink: "https://rtionline.gov.in",
  },
};
