// All site copy lives here, in English (en) and Marathi (mr).
// Facts come from public sources (Wikipedia, Rajya Sabha records). Anything
// marked PLACEHOLDER must be replaced with real material from the MP's office
// before going live.

export type Lang = "en" | "mr";
type T = Record<Lang, string>;

export const site = {
  name: { en: "Dr. Ajeet Madhavrao Gopchade", mr: "डॉ. अजित माधवराव गोपछडे" } as T,
  shortName: { en: "Dr. Ajeet Gopchade", mr: "डॉ. अजित गोपछडे" } as T,
  role: {
    en: "Member of Parliament, Rajya Sabha · Maharashtra",
    mr: "संसद सदस्य, राज्यसभा · महाराष्ट्र",
  } as T,
  party: { en: "Bharatiya Janata Party", mr: "भारतीय जनता पार्टी" } as T,
  social: {
    facebook: "https://www.facebook.com/drajeetgopchadebjp/",
    x: "https://x.com/Drajeetgopchade",
    instagram: "https://www.instagram.com/drajeetgopchade",
    youtube: "https://www.youtube.com/@Drajeetgopchade0618",
    linkedin: "", // not found publicly; add it from /admin/content/profile
  },
  // Feeds the latest videos on /social (YouTube's public RSS feed needs the channel ID, not the @handle).
  youtubeChannelId: "UC50AjcXmHebnOOG3E_zjiuQ",
  contact: {
    email: "dr.agopchade@sansad.nic.in",
    phone: "+91 77984 84618",
    // Present address in Delhi.
    address: {
      en: "Flat No. 201, Brahmaputra Complex, Dr. B.D. Marg, New Delhi – 110001",
      mr: "फ्लॅट क्र. २०१, ब्रह्मपुत्रा कॉम्प्लेक्स, डॉ. बी. डी. मार्ग, नवी दिल्ली – ११०००१",
    } as T,
    permanentAddress: {
      en: "Amruthpath Hospital, Doctor Lane, Near Railway Station, Nanded – 431601, Maharashtra",
      mr: "अमृतपथ हॉस्पिटल, डॉक्टर लेन, रेल्वे स्टेशनजवळ, नांदेड – ४३१६०१, महाराष्ट्र",
    } as T,
  },
};

export const nav: { id: string; label: T }[] = [
  { id: "home", label: { en: "Home", mr: "मुख्यपृष्ठ" } },
  { id: "about", label: { en: "About", mr: "परिचय" } },
  { id: "impact", label: { en: "Impact", mr: "कार्य" } },
  { id: "parliament", label: { en: "Parliament", mr: "संसद" } },
  { id: "journey", label: { en: "Journey", mr: "प्रवास" } },
  { id: "press", label: { en: "Press", mr: "बातम्या" } },
  { id: "gallery", label: { en: "Gallery", mr: "छायाचित्रे" } },
  { id: "blog", label: { en: "Blog", mr: "ब्लॉग" } },
  { id: "social", label: { en: "Social", mr: "सोशल मीडिया" } },
  { id: "contact", label: { en: "Contact", mr: "संपर्क" } },
];

// Every menu item has its own route: /about, /impact, …
export const navHref = (id: string) => (id === "home" ? "/" : `/${id}`);

export const ui = {
  readMore: { en: "Read more", mr: "अधिक वाचा" },
  readLess: { en: "Read less", mr: "कमी वाचा" },
  more: { en: "View all", mr: "सर्व पहा" },
  latestPress: { en: "Latest Press", mr: "ताज्या बातम्या" },
  impact: { en: "Impact", mr: "कार्याचा ठसा" },
  journey: { en: "Journey", mr: "जीवनप्रवास" },
  gallery: { en: "Gallery", mr: "छायाचित्र दालन" },
  blog: { en: "Blog", mr: "ब्लॉग" },
  fromBlog: { en: "From the Blog", mr: "ब्लॉगमधून" },
  allPosts: { en: "All posts", mr: "सर्व लेख" },
  backToBlog: { en: "← Back to blog", mr: "← ब्लॉगकडे परत" },
  noPosts: { en: "No posts yet. Check back soon.", mr: "अद्याप लेख नाहीत. लवकरच परत भेट द्या." },
  backHome: { en: "← Home", mr: "← मुख्यपृष्ठ" },
  events: { en: "Events", mr: "कार्यक्रम" },
  inParliament: { en: "In Parliament", mr: "संसदेतील कामकाज" },
  contact: { en: "Write to Dr. Gopchade", mr: "डॉ. गोपछडे यांना लिहा" },
  contactSub: {
    en: "Share a grievance, a suggestion or an invitation. The office responds to every message.",
    mr: "तक्रार, सूचना किंवा निमंत्रण पाठवा. कार्यालय प्रत्येक संदेशाला उत्तर देते.",
  },
  name: { en: "Your name", mr: "आपले नाव" },
  phone: { en: "Mobile number", mr: "मोबाईल क्रमांक" },
  district: { en: "District / Taluka", mr: "जिल्हा / तालुका" },
  emailLabel: { en: "Email", mr: "ईमेल" },
  phoneLabel: { en: "Phone", mr: "फोन" },
  delhiAddress: { en: "Delhi address", mr: "दिल्ली पत्ता" },
  permanentAddress: { en: "Permanent address", mr: "कायमचा पत्ता" },
  message: { en: "Your message", mr: "आपला संदेश" },
  send: { en: "Send message", mr: "संदेश पाठवा" },
  donate: { en: "Contribute", mr: "योगदान द्या" },
  quickLinks: { en: "Quick links", mr: "महत्त्वाचे दुवे" },
  follow: { en: "Follow", mr: "फॉलो करा" },
  newsletter: { en: "Get updates from the MP's office", mr: "खासदार कार्यालयाकडून अपडेट्स मिळवा" },
  subscribe: { en: "Subscribe", mr: "सदस्य व्हा" },
  emailPh: { en: "Email address", mr: "ईमेल पत्ता" },
  rights: { en: "All rights reserved.", mr: "सर्व हक्क राखीव." },
  listen: { en: "Listen", mr: "ऐका" },
  act: { en: "Act", mr: "कृती" },
  share: { en: "Share", mr: "शेअर करा" },
  copied: { en: "Link copied", mr: "लिंक कॉपी झाली" },
  subscribed: {
    en: "Your email app will open to confirm the subscription.",
    mr: "सदस्यता निश्चित करण्यासाठी आपले ईमेल ॲप उघडेल.",
  },
  all: { en: "All", mr: "सर्व" },
  viewPhoto: { en: "View larger", mr: "मोठे पहा" },
  prevPhoto: { en: "Previous photo", mr: "मागील छायाचित्र" },
  nextPhoto: { en: "Next photo", mr: "पुढील छायाचित्र" },
  closePhoto: { en: "Close", mr: "बंद करा" },
  viewEvent: { en: "View details", mr: "तपशील पहा" },
  social: { en: "Social Media", mr: "सोशल मीडिया" },
  socialSub: {
    en: "Latest updates from Dr. Gopchade's official social media accounts.",
    mr: "डॉ. गोपछडे यांच्या अधिकृत सोशल मीडिया खात्यांवरील ताज्या घडामोडी.",
  },
  latestVideos: { en: "Latest on YouTube", mr: "यूट्यूबवरील नवीन व्हिडिओ" },
  featuredPosts: { en: "Featured posts", mr: "निवडक पोस्ट" },
  followOn: { en: "Follow on", mr: "फॉलो करा:" },
  openProfile: { en: "Open profile", mr: "प्रोफाइल उघडा" },
  feedFallback: {
    en: "If the feed doesn't load, open the page directly.",
    mr: "फीड न दिसल्यास थेट पेज उघडा.",
  },
  parliament: { en: "In Parliament", mr: "संसदेतील कामगिरी" },
  parliamentSub: {
    en: "Attendance and questions in the Rajya Sabha since taking office in April 2024.",
    mr: "एप्रिल २०२४ मध्ये पदभार स्वीकारल्यापासून राज्यसभेतील उपस्थिती आणि प्रश्न.",
  },
  attendance: { en: "Attendance", mr: "उपस्थिती" },
  sittingsAttended: { en: "sittings attended", mr: "बैठकांना उपस्थित" },
  houseAverage: { en: "House average", mr: "सभागृह सरासरी" },
  questionsAsked: { en: "Questions asked", mr: "विचारलेले प्रश्न" },
  starred: { en: "Starred", mr: "तारांकित" },
  unstarred: { en: "Unstarred", mr: "अतारांकित" },
  ministriesCovered: { en: "Ministries questioned", mr: "मंत्रालयांना प्रश्न" },
  sessionsAttended: { en: "sessions", mr: "अधिवेशने" },
  houseNote: { en: "Average Rajya Sabha member", mr: "राज्यसभा सदस्यांची सरासरी" },
  bySession: { en: "Attendance by session", mr: "अधिवेशननिहाय उपस्थिती" },
  topMinistries: { en: "Most-questioned ministries", mr: "सर्वाधिक प्रश्न विचारलेली मंत्रालये" },
  him: { en: "Dr. Gopchade", mr: "डॉ. गोपछडे" },
  allQuestions: { en: "See every question", mr: "सर्व प्रश्न पहा" },
  questionsTitle: { en: "Questions in Parliament", mr: "संसदेतील प्रश्न" },
  questionsIntro: {
    en: "Every question Dr. Ajeet Gopchade has raised in the Rajya Sabha, with the government's written answer.",
    mr: "डॉ. अजित गोपछडे यांनी राज्यसभेत विचारलेले सर्व प्रश्न, सरकारच्या लेखी उत्तरासह.",
  },
  search: { en: "Search questions", mr: "प्रश्न शोधा" },
  allSessions: { en: "All sessions", mr: "सर्व अधिवेशने" },
  allMinistries: { en: "All ministries", mr: "सर्व मंत्रालये" },
  allTypes: { en: "Starred & unstarred", mr: "तारांकित व अतारांकित" },
  showing: { en: "Showing", mr: "दाखवत आहे" },
  of: { en: "of", mr: "पैकी" },
  questionNo: { en: "Q. No.", mr: "प्रश्न क्र." },
  answerPdf: { en: "Question & answer (PDF)", mr: "प्रश्न व उत्तर (PDF)" },
  hindiPdf: { en: "Hindi", mr: "हिंदी" },
  noMatches: { en: "No questions match these filters.", mr: "या निवडीशी जुळणारे प्रश्न नाहीत." },
  sourceNote: {
    en: "Source: Rajya Sabha Secretariat (sansad.in). Updated",
    mr: "स्रोत: राज्यसभा सचिवालय (sansad.in). अद्ययावत",
  },
  placeholderNote: {
    en: "Sample entry — to be replaced by the MP's office.",
    mr: "नमुना नोंद — खासदार कार्यालयाद्वारे बदलली जाईल.",
  },
} satisfies Record<string, T>;

export const heroSlides: { title: T; text: T }[] = [
  {
    title: { en: "A Doctor in Public Service", mr: "जनसेवेतील डॉक्टर" },
    text: {
      en: "A paediatrician by training, Dr. Gopchade brings a physician's care to public life — listening first, then acting.",
      mr: "बालरोगतज्ज्ञ असलेले डॉ. गोपछडे सार्वजनिक जीवनात डॉक्टरची संवेदनशीलता घेऊन येतात — आधी ऐकणे, मग कृती.",
    },
  },
  {
    title: { en: "Rooted in Marathwada", mr: "मराठवाड्याच्या मातीतले" },
    text: {
      en: "Born and raised in Nanded, he carries the aspirations of Marathwada to the Upper House of Parliament.",
      mr: "नांदेडमध्ये जन्मलेले आणि वाढलेले, ते मराठवाड्याच्या आकांक्षा संसदेच्या वरिष्ठ सभागृहात मांडतात.",
    },
  },
  {
    title: { en: "Organisation First", mr: "संघटना प्रथम" },
    text: {
      en: "From convener of the BJP Doctors' Cell to State Vice-President, he has built the organisation from the ground up.",
      mr: "भाजप डॉक्टर सेलचे संयोजक ते प्रदेश उपाध्यक्ष — तळागाळातून संघटना उभारणारा कार्यकर्ता.",
    },
  },
];

export const about = {
  heading: { en: "About Dr. Ajeet Gopchade", mr: "डॉ. अजित गोपछडे यांचा परिचय" } as T,
  body: [
    {
      en: "Dr. Ajeet Madhavrao Gopchade was born on 19 November 1970 in Nanded, Maharashtra, to Madhavrao and Rukminibai Gopchade. He completed his MBBS at Swami Ramanand Teerth Rural Medical College and his MD in Paediatrics at Government Medical College, Aurangabad.",
      mr: "डॉ. अजित माधवराव गोपछडे यांचा जन्म १९ नोव्हेंबर १९७० रोजी नांदेड, महाराष्ट्र येथे माधवराव आणि रुक्मिणीबाई गोपछडे यांच्या पोटी झाला. त्यांनी स्वामी रामानंद तीर्थ ग्रामीण वैद्यकीय महाविद्यालयातून एमबीबीएस आणि शासकीय वैद्यकीय महाविद्यालय, औरंगाबाद येथून बालरोगशास्त्रात एमडी पूर्ण केले.",
    },
    {
      en: "Alongside his medical practice he joined the Bharatiya Janata Party, serving as convener of the party's Doctors' Cell and later as Vice-President of BJP Maharashtra. In 2024 he was elected to the Rajya Sabha from Maharashtra, and has served as a Member of Parliament since 3 April 2024.",
      mr: "वैद्यकीय सेवेसोबतच ते भारतीय जनता पार्टीत सक्रिय झाले. पक्षाच्या डॉक्टर सेलचे संयोजक आणि नंतर भाजप महाराष्ट्राचे प्रदेश उपाध्यक्ष म्हणून त्यांनी काम केले. २०२४ मध्ये ते महाराष्ट्रातून राज्यसभेवर निवडून गेले आणि ३ एप्रिल २०२४ पासून संसद सदस्य आहेत.",
    },
  ] as T[],
  stats: [
    { value: "2024", label: { en: "Elected to Rajya Sabha", mr: "राज्यसभेवर निवड" } },
    { value: "MD", label: { en: "Paediatrics", mr: "बालरोगशास्त्र" } },
    { value: "Nanded", valueMr: "नांदेड", label: { en: "Home district", mr: "मूळ जिल्हा" } },
    { value: "2030", label: { en: "Term continues to", mr: "कार्यकाळ" } },
  ] as { value: string; valueMr?: string; label: T }[],
};

export const impact: { title: T; text: T; image?: string }[] = [
  {
    title: { en: "Healthcare", mr: "आरोग्य सेवा" },
    image: "/images/impact/healthcare.jpg", // Govt. Dental College & Hospital, Nagpur (Dec 2022)
    text: {
      en: "As a practising paediatrician, Dr. Gopchade has worked for better child health and access to medical care in rural Marathwada, and brings that experience to health policy debates in Parliament.",
      mr: "बालरोगतज्ज्ञ म्हणून डॉ. गोपछडे यांनी ग्रामीण मराठवाड्यात बालआरोग्य आणि वैद्यकीय सुविधांच्या उपलब्धतेसाठी काम केले आहे आणि तो अनुभव ते संसदेतील आरोग्य धोरणावरील चर्चांमध्ये मांडतात.",
    },
  },
  {
    title: { en: "Organisation Builder", mr: "संघटन बांधणी" },
    image: "/images/impact/organisation.jpg", // news18marathi.com, Feb 2024
    text: {
      en: "He organised doctors and medical professionals as convener of the BJP Doctors' Cell, and as State Vice-President worked to strengthen the party across Maharashtra.",
      mr: "भाजप डॉक्टर सेलचे संयोजक म्हणून त्यांनी डॉक्टर व वैद्यकीय व्यावसायिकांचे संघटन केले आणि प्रदेश उपाध्यक्ष म्हणून संपूर्ण महाराष्ट्रात पक्ष बळकट करण्याचे काम केले.",
    },
  },
  {
    title: { en: "Voice of Maharashtra", mr: "महाराष्ट्राचा आवाज" },
    image: "/images/gallery/farmers-nanded.jpg",
    text: {
      en: "In the Rajya Sabha he raises the concerns of Maharashtra, and has pursued pending public representations with the State Government through a series of review meetings.",
      mr: "राज्यसभेत ते महाराष्ट्राचे प्रश्न मांडतात आणि प्रलंबित जनहिताच्या निवेदनांचा पाठपुरावा राज्य सरकारसोबत आढावा बैठकांद्वारे करतात.",
    },
  },
  {
    title: { en: "Legislator", mr: "विधिमंडळ कार्य" },
    image: "/images/gallery/rajya-sabha-speech.jpg",
    text: {
      en: "He participates in debates, questions and legislative business in the Upper House, including bills introduced in his name.",
      mr: "ते वरिष्ठ सभागृहातील चर्चा, प्रश्नोत्तरे आणि विधेयकांच्या कामकाजात सहभागी होतात, ज्यात त्यांनी मांडलेल्या विधेयकांचाही समावेश आहे.",
    },
  },
];

export const journey: { year: string; title: T; text: T }[] = [
  {
    year: "1970",
    title: { en: "Born in Nanded", mr: "नांदेड येथे जन्म" },
    text: {
      en: "Born on 19 November 1970 in Nanded, Maharashtra, to Madhavrao and Rukminibai Gopchade.",
      mr: "१९ नोव्हेंबर १९७० रोजी नांदेड येथे माधवराव आणि रुक्मिणीबाई गोपछडे यांच्या पोटी जन्म.",
    },
  },
  {
    year: "MBBS",
    title: { en: "Medical education", mr: "वैद्यकीय शिक्षण" },
    text: {
      en: "Graduated MBBS from Swami Ramanand Teerth Rural Medical College.",
      mr: "स्वामी रामानंद तीर्थ ग्रामीण वैद्यकीय महाविद्यालयातून एमबीबीएस.",
    },
  },
  {
    year: "MD",
    title: { en: "Paediatrician", mr: "बालरोगतज्ज्ञ" },
    text: {
      en: "Completed MD in Paediatrics at Government Medical College, Aurangabad, and began medical practice.",
      mr: "शासकीय वैद्यकीय महाविद्यालय, औरंगाबाद येथून बालरोगशास्त्रात एमडी आणि वैद्यकीय सेवेला सुरुवात.",
    },
  },
  {
    year: "BJP",
    title: { en: "Convener, BJP Doctors' Cell", mr: "संयोजक, भाजप डॉक्टर सेल" },
    text: {
      en: "Joined the Bharatiya Janata Party and led its Doctors' Cell as convener.",
      mr: "भारतीय जनता पार्टीत प्रवेश आणि डॉक्टर सेलचे संयोजक म्हणून नेतृत्व.",
    },
  },
  {
    year: "VP",
    title: { en: "Vice-President, BJP Maharashtra", mr: "प्रदेश उपाध्यक्ष, भाजप महाराष्ट्र" },
    text: {
      en: "Elevated to State Vice-President of the BJP in Maharashtra.",
      mr: "भाजप महाराष्ट्राच्या प्रदेश उपाध्यक्षपदी नियुक्ती.",
    },
  },
  {
    year: "2024",
    title: { en: "Member of Parliament, Rajya Sabha", mr: "संसद सदस्य, राज्यसभा" },
    text: {
      en: "Elected to the Rajya Sabha from Maharashtra; took office on 3 April 2024 for the term ending 2030.",
      mr: "महाराष्ट्रातून राज्यसभेवर निवड; ३ एप्रिल २०२४ रोजी पदभार, कार्यकाळ २०३०.",
    },
  },
];

export const press: { title: T; date: string; href: string; image?: string }[] = [
  {
    title: {
      en: "At the 12th BRICS Parliamentary Forum, on India's growing role for the Global South",
      mr: "१२व्या ब्रिक्स संसदीय मंचात भारताच्या वाढत्या जागतिक भूमिकेवर भाष्य",
    },
    date: "2026-10",
    href: "https://newsable.asianetnews.com/india/brics-parliamentary-forum-emphasizes-people-centric-governance-models-articleshow-9wxbr6e",
    image: "/images/press/rajya-sabha-portrait.jpg",
  },
  {
    title: {
      en: "Visits drought-hit farmers in Deglur; thanks CM for ₹5,000 advance relief",
      mr: "देगलूर तालुक्यातील दुष्काळग्रस्त शेतकऱ्यांची भेट; राज्य सरकार शेतकऱ्यांच्या पाठीशी खंबीरपणे उभे",
    },
    date: "2026-10",
    href: "https://pudhari.news/maharashtra/marathwada/nanded/devendra-fadnavis-5000-farmer-relief-ajit-gopchade-ab96",
    image: "/images/gallery/farmers-nanded.jpg",
  },
  {
    title: {
      en: "External Affairs Minister S. Jaishankar meets MP LEAD Fellows",
      mr: "परराष्ट्र मंत्री एस. जयशंकर यांचा एमपी लीड फेलोंशी परराष्ट्र धोरणावर संवाद",
    },
    date: "2026-08",
    href: "https://www.newkerala.com/news/a/interest-indian-foreign-policy-commendable-eam-jaishankar-meets-976.htm",
  },
  {
    title: {
      en: "Vice-President C.P. Radhakrishnan addresses the 40 MP LEAD Fellows",
      mr: "उपराष्ट्रपती सी. पी. राधाकृष्णन यांचा ४० एमपी लीड फेलोंशी संवाद",
    },
    date: "2026-07",
    href: "https://ddindia.co.in/2026/07/leadership-is-about-service-not-authority-vice-president-tells-mp-lead-fellows/",
    image: "/images/gallery/mp-lead-vice-president.jpg",
  },
  {
    title: {
      en: "Chief Secretary to review MP's pending representations in 41 meetings",
      mr: "खासदारांच्या प्रलंबित निवेदनांवर मुख्य सचिव ४१ आढावा बैठका घेणार",
    },
    date: "2026-05",
    image: "/images/press/rajya-sabha-portrait.jpg", // official Rajya Sabha photo (sansad.in)
    href: "https://www.freepressjournal.in/mumbai/maharashtra-chief-secretary-rajesh-aggarwal-to-chair-41-review-meetings-over-bjp-mp-dr-ajeet-gopchades-pending-representations",
  },
  {
    title: {
      en: "Dr. Gopchade demands 'Holy City' status for Nanded in the Rajya Sabha",
      mr: "नांदेडला 'होली सिटी' दर्जा द्या; खासदार डॉ. अजित गोपछडे यांची राज्यसभेमध्ये मागणी",
    },
    date: "2026-04",
    href: "https://www.navarashtra.com/maharashtra/nanded/mp-gopchade-demands-holy-city-status-for-nanded-place-of-great-significance-to-the-sikh-1189251.html",
    image: "/images/press/hazur-sahib-nanded.jpg",
  },
  {
    title: {
      en: "Meets Home Minister Amit Shah; seeks official-language status for Indian Sign Language",
      mr: "गृहमंत्री अमित शहा यांची भेट; भारतीय सांकेतिक भाषेला अधिकृत भाषेचा दर्जा देण्याची मागणी",
    },
    date: "2026-02",
    href: "https://newsable.asianetnews.com/india/mp-ajeet-gopchade-meets-amit-shah-urges-official-status-for-isl-articleshow-pfn0clu",
    image: "/images/gallery/amit-shah-meeting.jpg",
  },
  {
    title: {
      en: "Three bills introduced in the Rajya Sabha, including AI in healthcare",
      mr: "खासदार अजित गोपछडेंनी राज्यसभेत मांडली तीन ऐतिहासिक विधेयके",
    },
    date: "2026-02",
    href: "https://ratnagirikhabardar.com/news/98682/",
    image: "/images/gallery/rajya-sabha-speech.jpg",
  },
];

export const galleryCategories: { id: string; label: T }[] = [
  { id: "leaders", label: { en: "With Leaders", mr: "मान्यवरांसोबत" } },
  { id: "parliament", label: { en: "Parliament", mr: "संसद" } },
  { id: "people", label: { en: "Among the People", mr: "जनतेत" } },
  { id: "health", label: { en: "Healthcare", mr: "आरोग्य सेवा" } },
  { id: "events", label: { en: "Events", mr: "कार्यक्रम" } },
];

// Photos from the MP's and officials' X posts, news coverage and Wikimedia
// Commons.
export const gallery: { cat: string; caption: T; src?: string }[] = [
  {
    cat: "events",
    // Vice-President's Secretariat photo, via DD News.
    caption: {
      en: "Vice-President C.P. Radhakrishnan addressing the MP LEAD Fellows, New Delhi, July 2026",
      mr: "उपराष्ट्रपती सी. पी. राधाकृष्णन एमपी लीड फेलोंना संबोधित करताना, नवी दिल्ली, जुलै २०२६",
    },
    src: "/images/gallery/mp-lead-vice-president.jpg",
  },
  {
    cat: "leaders",
    caption: {
      en: "With Union Home Minister Amit Shah, New Delhi, February 2026",
      mr: "केंद्रीय गृहमंत्री अमित शहा यांच्यासोबत, नवी दिल्ली, फेब्रुवारी २०२६",
    },
    src: "/images/gallery/amit-shah-meeting.jpg",
  },
  {
    cat: "leaders",
    caption: { en: "With Prime Minister Narendra Modi, New Delhi, December 2024", mr: "पंतप्रधान नरेंद्र मोदी यांच्यासोबत, नवी दिल्ली, डिसेंबर २०२४" },
    src: "/images/gallery/pm-modi-meeting.jpg",
  },
  {
    cat: "leaders",
    caption: {
      en: "Presenting a Marathwada development memorandum to PM Narendra Modi",
      mr: "पंतप्रधान नरेंद्र मोदी यांना मराठवाडा विकासाचे निवेदन सादर",
    },
    src: "/images/gallery/pm-modi-memorandum.jpg",
  },
  {
    cat: "leaders",
    caption: {
      en: "With Vice-President and Rajya Sabha Chairman Jagdeep Dhankhar and fellow MPs, November 2024",
      mr: "उपराष्ट्रपती व राज्यसभा सभापती जगदीप धनखड आणि सहकारी खासदारांसोबत, नोव्हेंबर २०२४",
    },
    src: "/images/gallery/vp-dhankhar.jpg",
  },
  {
    cat: "leaders",
    caption: {
      en: "Seeking flood relief for Nanded's farmers from Agriculture Minister Shivraj Singh Chouhan, September 2025",
      mr: "नांदेडच्या अतिवृष्टीग्रस्त शेतकऱ्यांसाठी कृषिमंत्री शिवराजसिंह चौहान यांच्याकडे मदतीची मागणी, सप्टेंबर २०२५",
    },
    src: "/images/gallery/shivraj-singh-chouhan.jpg",
  },
  {
    cat: "leaders",
    caption: {
      en: "AIIMS Nagpur's first convocation with Union Minister Nitin Gadkari, March 2025",
      mr: "एम्स नागपूरचा पहिला दीक्षांत समारंभ, केंद्रीय मंत्री नितीन गडकरी यांच्यासोबत, मार्च २०२५",
    },
    src: "/images/gallery/aiims-nagpur-gadkari.jpg",
  },
  {
    cat: "leaders",
    caption: {
      en: "At Takht Sachkhand Sri Hazur Sahib, Nanded, with Minister Shivendrasinghraje Bhosale",
      mr: "तख्त सचखंड श्री हजूर साहिब, नांदेड येथे मंत्री शिवेंद्रसिंहराजे भोसले यांच्यासोबत",
    },
    src: "/images/gallery/hazur-sahib-bhosale.jpg",
  },
  {
    cat: "parliament",
    caption: { en: "Speaking in the Rajya Sabha", mr: "राज्यसभेत भाषण" },
    src: "/images/gallery/rajya-sabha-speech.jpg",
  },
  {
    cat: "people",
    caption: { en: "With farmers in Nanded district", mr: "नांदेड जिल्ह्यात शेतकऱ्यांसोबत" },
    src: "/images/gallery/farmers-nanded.jpg",
  },
  {
    cat: "health",
    caption: {
      en: "Opening new facilities at Government Dental College & Hospital, Nagpur, December 2022",
      mr: "शासकीय दंत महाविद्यालय व रुग्णालय, नागपूर येथे नवीन सुविधांचे उद्घाटन, डिसेंबर २०२२",
    },
    src: "/images/gallery/dental-hospital-nagpur.jpg",
  },
  {
    cat: "events",
    // CC BY-SA 4.0 requires visible credit.
    caption: {
      en: "Addressing a party programme · Photo: AshutoshRapatwar30 / Wikimedia Commons, CC BY-SA 4.0",
      mr: "पक्ष कार्यक्रमात संबोधन · छायाचित्र: AshutoshRapatwar30 / Wikimedia Commons, CC BY-SA 4.0",
    },
    src: "/images/gallery/party-programme.jpg",
  },
  {
    cat: "people",
    caption: { en: "Site visit for the proposed Kinnar Bhavan, Nanded", mr: "प्रस्तावित किन्नर भवन जागेची पाहणी, नांदेड" },
    src: "/images/gallery/kinnar-bhavan-site-visit.jpg",
  },
  {
    cat: "events",
    caption: { en: "Veershaiva-Lingayat Sangh felicitation, Nanded", mr: "वीरशैव-लिंगायत संघ गौरव सोहळा, नांदेड" },
    src: "/images/gallery/lingayat-sangh-felicitation.jpg",
  },
];

// Recent programmes, newest first. Photos are the same verified ones used in the gallery.
// href is optional: an event with a link opens it when clicked.
export const events: { date: string; title: T; place: T; image?: string; href?: string }[] = [
  {
    date: "Oct 2026",
    title: { en: "Meeting farmers on drought relief", mr: "दुष्काळ मदतीबाबत शेतकऱ्यांशी संवाद" },
    place: { en: "Nanded district", mr: "नांदेड जिल्हा" },
    image: "/images/gallery/farmers-nanded.jpg",
  },
  {
    date: "Apr 2026",
    title: { en: "Veershaiva-Lingayat Sangh felicitation", mr: "वीरशैव-लिंगायत संघ गौरव सोहळा" },
    place: { en: "Nanded", mr: "नांदेड" },
    image: "/images/gallery/lingayat-sangh-felicitation.jpg",
  },
  {
    date: "Feb 2026",
    title: { en: "Introducing three bills in the Rajya Sabha", mr: "राज्यसभेत तीन विधेयके सादर" },
    place: { en: "New Delhi", mr: "नवी दिल्ली" },
    image: "/images/gallery/rajya-sabha-speech.jpg",
    href: "https://ratnagirikhabardar.com/news/98682/",
  },
  {
    date: "Aug 2025",
    title: { en: "Visit to Takht Sachkhand Sri Hazur Sahib", mr: "तख्त सचखंड श्री हजूर साहिब भेट" },
    place: { en: "Nanded", mr: "नांदेड" },
    image: "/images/gallery/hazur-sahib-bhosale.jpg",
  },
  {
    date: "Jul 2025",
    title: { en: "Site visit for the proposed Kinnar Bhavan", mr: "प्रस्तावित किन्नर भवन जागेची पाहणी" },
    place: { en: "Nanded", mr: "नांदेड" },
    image: "/images/gallery/kinnar-bhavan-site-visit.jpg",
  },
  {
    date: "Mar 2025",
    title: { en: "AIIMS Nagpur first convocation", mr: "एम्स नागपूर पहिला दीक्षांत समारंभ" },
    place: { en: "Nagpur", mr: "नागपूर" },
    image: "/images/gallery/aiims-nagpur-gadkari.jpg",
  },
];

// Posts embedded under "Featured posts" on /social. Instagram and LinkedIn have
// no public profile feed, so the office picks posts from /admin/content/social.
export const socialPosts: { url: string }[] = [];

export const donate = [
  { label: "PM CARES", href: "https://www.pmcares.gov.in/" },
  { label: "Bharat Ke Veer", href: "https://bharatkeveer.gov.in/" },
  { label: "BJP", href: "https://www.bjp.org/" },
];
