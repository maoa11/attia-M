/**
 * Every string on the site, in both languages.
 *
 * The facts here come from Attia's own public profiles — Jeddah, the 30+ brands
 * and 250+ videos, the Sony body and the Adobe tools — and nothing beyond them
 * is invented. Anything that still needs to come from him is marked TODO rather
 * than filled with plausible-sounding filler.
 */

export type Lang = "en" | "ar";

export const site = {
  name: "Attia Mohamed",
  nameAr: "عطية محمد",
  role: { en: "Videographer & Video Editor", ar: "مصوّر ومونتير فيديو" },
  city: { en: "Jeddah, Saudi Arabia", ar: "جدة، السعودية" },
  instagram: "https://www.instagram.com/attia3_mohamed/",
  instagramHandle: "@attia3_mohamed",
  behance: "https://www.behance.net/attiamohamed6",
  // TODO(client): confirm the email address Attia wants published.
  email: "attia3mohamed@gmail.com",
  // +966 53 945 1558 — supplied by the client. Digits only, for the wa.me link.
  whatsapp: "966539451558",
} as const;

export const hero = {
  eyebrow: { en: "Videographer — Jeddah", ar: "مصوّر فيديو — جدة" },
  line: {
    en: "I make the kind of video that sells.",
    ar: "أصنع الفيديو اللي يبيع فعلاً.",
  },
} as const;

export const work = {
  label: { en: "Selected Work", ar: "أعمال مختارة" },
  title: { en: "Selected Work", ar: "أعمال مختارة" },
  note: {
    en: "Ten pieces. Commercials, brand films and short-form built for the scroll.",
    ar: "عشرة أعمال. إعلانات وأفلام علامات ومحتوى قصير مصمّم للسكرول.",
  },
  view: { en: "View case study", ar: "شاهد المشروع" },
} as const;

export const footer = {
  rights: { en: "All rights reserved", ar: "جميع الحقوق محفوظة" },
  built: { en: "Jeddah, Saudi Arabia", ar: "جدة، السعودية" },
} as const;

export const ui = {
  next: { en: "Next project", ar: "المشروع التالي" },
  back: { en: "All work", ar: "كل الأعمال" },
  challenge: { en: "The problem", ar: "التحدي" },
  approach: { en: "The approach", ar: "المعالجة" },
  role: { en: "Role", ar: "الدور" },
  kit: { en: "Kit", ar: "المعدات" },
  gallery: { en: "Gallery", ar: "المعرض" },
  year: { en: "Year", ar: "السنة" },
  client: { en: "Client", ar: "العميل" },
  close: { en: "Close", ar: "إغلاق" },
} as const;
