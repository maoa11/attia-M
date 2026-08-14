/**
 * The ten case studies, ordered newest first — the same order Attia keeps on
 * Behance.
 *
 * Two of his galleries were posted twice (the Istanbul villa and the Gürkan Şef
 * steakhouse each exist as a pair), so those collapse into one case study
 * holding both clips rather than showing the visitor the same shoot twice.
 *
 * `clips` names map onto public/media/{card,full,poster}/<name>.{mp4,jpg},
 * produced by scripts/fetch-media.mjs. Every clip is 9:16 except the Istanbul
 * villa's opening film, which is the only 16:9 piece in the body of work — and
 * therefore the only one that can carry a widescreen hero.
 */

export type Bilingual = { en: string; ar: string };

export type Clip = {
  /** Basename shared by the card proxy, full-quality file and poster. */
  name: string;
  vertical: boolean;
};

export type Project = {
  slug: string;
  number: string;
  title: Bilingual;
  client: Bilingual;
  category: Bilingual;
  year: string;
  behance: string;
  /** The one widescreen piece, used for the pinned Featured Project section. */
  featured?: boolean;
  clips: Clip[];
  overview: Bilingual;
  challenge: Bilingual;
  approach: Bilingual;
  role: { en: string[]; ar: string[] };
  kit: string[];
};

export const projects: Project[] = [
  {
    slug: "mastak",
    number: "01",
    title: { en: "Mastak", ar: "مستك" },
    client: { en: "Mastak", ar: "مستك" },
    category: { en: "Product Reel", ar: "ريل منتج" },
    year: "2026",
    behance: "https://www.behance.net/gallery/247604013/Videography-for-Mastak",
    clips: [
      { name: "mastak-1", vertical: true },
      { name: "mastak-2", vertical: true },
    ],
    overview: {
      en: "A product reel built for the scroll. Shot entirely on one 50mm prime so the frame stays close to the product and never drifts into wide, generic coverage.",
      ar: "ريل منتج مصمّم للسكرول. تصوير كامل بعدسة ثابتة 50mm عشان الكادر يظل قريب من المنتج ولا يروح للقطات واسعة عامة.",
    },
    challenge: {
      en: "A viewer decides in under a second. The opening frame has to hold before the brand has said anything at all.",
      ar: "المشاهد يقرر في أقل من ثانية. الكادر الأول لازم يمسكه قبل ما البراند يقول أي شيء.",
    },
    approach: {
      en: "Motion is kept inside the frame instead of in the camera — the product moves, the light moves, the lens stays honest. Cuts land on the beat so the reel keeps pulling forward.",
      ar: "الحركة داخل الكادر مو في الكاميرا — المنتج يتحرك، الضوء يتحرك، والعدسة تظل صادقة. والقطع على الإيقاع عشان الريل يسحب لقدام.",
    },
    role: {
      en: ["Direction", "Cinematography", "Edit", "Colour"],
      ar: ["إخراج", "تصوير", "مونتاج", "تصحيح ألوان"],
    },
    kit: ["Sony A7 III", "Sony 50mm f/1.8", "Premiere Pro"],
  },
  {
    slug: "velo",
    number: "02",
    title: { en: "Velo — Bike Reel", ar: "فيلو — ريل الدراجة" },
    client: { en: "Velo", ar: "فيلو" },
    category: { en: "Advertising", ar: "إعلان" },
    year: "2026",
    behance: "https://www.behance.net/gallery/247592395/Videography-for-Velo-Bike-Reel",
    clips: [
      { name: "velo-1", vertical: true },
      { name: "velo-2", vertical: true },
    ],
    overview: {
      en: "An advertising reel around a bike, cut for social first. Speed is carried by the edit rather than by the camera chasing the subject.",
      ar: "ريل إعلاني حول دراجة، مقصوص للسوشيال أولاً. السرعة يحملها المونتاج بدل ما الكاميرا تجري خلف الموضوع.",
    },
    challenge: {
      en: "Movement reads flat on a phone. A bike shot straight-on simply looks slow.",
      ar: "الحركة تطلع مسطّحة على الجوال. الدراجة المصوّرة من الأمام مباشرة تبان بطيئة.",
    },
    approach: {
      en: "Low angles put the road in the frame, and the cut alternates long takes with fast beats so the pace is felt as contrast instead of constant motion.",
      ar: "زوايا منخفضة تدخل الشارع في الكادر، والمونتاج يبدّل بين لقطات طويلة وضربات سريعة عشان الإيقاع ينحس كتباين مو كحركة مستمرة.",
    },
    role: {
      en: ["Cinematography", "Edit", "Colour"],
      ar: ["تصوير", "مونتاج", "تصحيح ألوان"],
    },
    kit: ["Sony A7 III", "Sony 50mm f/1.8", "Premiere Pro"],
  },
  {
    slug: "engineering-tips",
    number: "03",
    title: { en: "Engineering Tips", ar: "نصائح هندسية" },
    client: { en: "Engineering Tips", ar: "نصائح هندسية" },
    category: { en: "Social Series", ar: "سلسلة سوشيال" },
    year: "2026",
    behance: "https://www.behance.net/gallery/245375819/Engineering-Tips-Social-Media-Editing",
    clips: [
      { name: "engineering-tips-1", vertical: true },
      { name: "engineering-tips-2", vertical: true },
      { name: "engineering-tips-3", vertical: true },
    ],
    overview: {
      en: "An editing-led series that turns technical explanation into something watchable — motion graphics built in After Effects, timed to the sentence rather than dropped over it.",
      ar: "سلسلة قائمة على المونتاج تحوّل الشرح التقني لشيء ممتع للمشاهدة — موشن جرافيك مبني في أفتر إفكتس، موقوت مع الجملة مو مركّب فوقها.",
    },
    challenge: {
      en: "Explanation content loses people the moment the graphics arrive late or say the same thing the voice already said.",
      ar: "محتوى الشرح يفقد الناس أول ما الجرافيك يتأخر أو يعيد نفس اللي قاله الصوت.",
    },
    approach: {
      en: "Every graphic carries a piece of information the audio does not, and lands one frame before the word it belongs to. That single habit is what keeps retention up across a series.",
      ar: "كل عنصر جرافيك يحمل معلومة الصوت ما قالها، وينزل قبل الكلمة بفريم واحد. هذي العادة الوحيدة هي اللي تحافظ على نسبة المشاهدة عبر السلسلة.",
    },
    role: {
      en: ["Edit", "Motion Graphics", "Sound"],
      ar: ["مونتاج", "موشن جرافيك", "صوت"],
    },
    kit: ["Premiere Pro", "After Effects"],
  },
  {
    slug: "albaraa-china",
    number: "04",
    title: { en: "Al-Baraa — China Vlog", ar: "البراء — فلوق الصين" },
    client: { en: "Al-Baraa", ar: "البراء" },
    category: { en: "Vlog Edit", ar: "مونتاج فلوق" },
    year: "2025",
    behance: "https://www.behance.net/gallery/243811123/Vlog-Editing-for-Al-Baraa-China-Travel-Vlog",
    clips: [
      { name: "albaraa-china-1", vertical: true },
      { name: "albaraa-china-2", vertical: true },
    ],
    overview: {
      en: "A travel vlog cut down from hours of handheld footage into a story with a shape — arrival, discovery, and a place that stays with you.",
      ar: "فلوق سفر مقصوص من ساعات تصوير باليد لقصة لها شكل — الوصول، الاكتشاف، ومكان يظل معك.",
    },
    challenge: {
      en: "Vlog rushes have no script to fall back on. The structure has to be found in the edit.",
      ar: "مواد الفلوق ما لها سكربت ترجع له. البناء لازم يتلاقى في المونتاج.",
    },
    approach: {
      en: "Sequences are grouped by feeling before they are grouped by chronology, and the sound of the place is left running underneath so the cuts never feel like a slideshow.",
      ar: "المشاهد تتجمّع حسب الإحساس قبل الترتيب الزمني، وصوت المكان يظل شغّال تحت عشان القطع ما يحس كسلايد شو.",
    },
    role: {
      en: ["Edit", "Sound", "Colour"],
      ar: ["مونتاج", "صوت", "تصحيح ألوان"],
    },
    kit: ["Premiere Pro", "After Effects"],
  },
  {
    slug: "personal-brand",
    number: "05",
    title: { en: "Personal Brand Film", ar: "فيلم البراند الشخصي" },
    client: { en: "Private Client", ar: "عميل خاص" },
    category: { en: "Brand Film", ar: "فيلم علامة" },
    year: "2025",
    behance: "https://www.behance.net/gallery/243810263/Personal-Brand-Video-Production-Editing",
    clips: [
      { name: "personal-brand-1", vertical: true },
      { name: "personal-brand-2", vertical: true },
    ],
    overview: {
      en: "Production and edit for a personal brand: one person, one message, and no set to hide behind.",
      ar: "إنتاج ومونتاج لبراند شخصي: شخص واحد، رسالة واحدة، وما فيه ديكور تختبي وراه.",
    },
    challenge: {
      en: "When the subject is a person rather than a product, any stiffness in front of the camera ends up in the final cut.",
      ar: "لما يكون الموضوع شخص مو منتج، أي توتر قدام الكاميرا يوصل للنسخة النهائية.",
    },
    approach: {
      en: "Shot in long takes with the camera set and the conversation running, then cut to the moments where the person forgot they were being filmed.",
      ar: "تصوير بلقطات طويلة والكاميرا ثابتة والحديث مستمر، وبعدها مونتاج على اللحظات اللي نسي فيها الشخص إنه مصوَّر.",
    },
    role: {
      en: ["Direction", "Cinematography", "Edit"],
      ar: ["إخراج", "تصوير", "مونتاج"],
    },
    kit: ["Sony A7 III", "Premiere Pro", "After Effects"],
  },
  {
    slug: "istanbul-villa",
    number: "06",
    title: { en: "Istanbul Villa", ar: "فيلا إسطنبول" },
    client: { en: "Real Estate", ar: "عقارات" },
    category: { en: "Real Estate Film", ar: "فيلم عقاري" },
    year: "2025",
    behance: "https://www.behance.net/gallery/241587921/Video-shoot-of-a-villa-in-Istanbul",
    featured: true,
    clips: [
      { name: "istanbul-villa-1", vertical: false },
      { name: "istanbul-villa-2", vertical: true },
    ],
    overview: {
      en: "A villa in Istanbul, filmed the way a place is actually experienced — you arrive, you move through it, and the light tells you what time of day it is.",
      ar: "فيلا في إسطنبول، مصوّرة بالطريقة اللي ينعاش فيها المكان فعلاً — توصل، تتحرك فيه، والضوء يقول لك وقت اليوم.",
    },
    challenge: {
      en: "Property video usually shows rooms. Rooms are not what makes someone want a house.",
      ar: "فيديو العقار عادةً يعرض غرف. والغرف مو هي اللي تخلي أحد يبغى البيت.",
    },
    approach: {
      en: "Continuous moves that carry the viewer from one space into the next, so the villa reads as a single volume instead of a list of rooms. The widescreen cut is the anchor; the vertical cut carries the same grade to social.",
      ar: "حركات متصلة تنقل المشاهد من مساحة للثانية، عشان الفيلا تنقرأ ككتلة واحدة مو كقائمة غرف. النسخة العريضة هي الأساس، والنسخة العمودية تنقل نفس التدرّج اللوني للسوشيال.",
    },
    role: {
      en: ["Cinematography", "Edit", "Colour"],
      ar: ["تصوير", "مونتاج", "تصحيح ألوان"],
    },
    kit: ["Sony A7 III", "Premiere Pro", "After Effects"],
  },
  {
    slug: "gurkan-steakhouse",
    number: "07",
    title: { en: "Gürkan Şef Steakhouse", ar: "ستيك هاوس غوركان شيف" },
    client: { en: "Gürkan Şef, Istanbul", ar: "غوركان شيف، إسطنبول" },
    category: { en: "Commercial", ar: "إعلان تجاري" },
    year: "2025",
    behance: "https://www.behance.net/gallery/241799205/Gurkan-sef-steakhouse-istanbul",
    clips: [
      { name: "gurkan-steakhouse-1", vertical: true },
      { name: "gurkan-steakhouse-2", vertical: true },
    ],
    overview: {
      en: "Commercial work for an Istanbul steakhouse. Food, fire, and the room — shot so the place feels warm before a single dish is named.",
      ar: "شغل تجاري لستيك هاوس في إسطنبول. الأكل والنار والمكان — مصوّر بحيث تحس بدفء المكان قبل ما يتسمّى أي طبق.",
    },
    challenge: {
      en: "Restaurant footage goes wrong in one of two directions: too clinical to feel appetising, or too dark to read.",
      ar: "تصوير المطاعم يغلط في اتجاهين: إما نظيف جداً لدرجة ما يفتح النفس، أو غامق جداً لدرجة ما ينقرأ.",
    },
    approach: {
      en: "Practical light from the grill is treated as the key, not fought against. Everything is exposed for the highlight on the meat and allowed to fall away into the room behind it.",
      ar: "ضوء الشوّاية الطبيعي يتعامل معه كإضاءة رئيسية مو كمشكلة. التعريض مضبوط على اللمعة على اللحم، والباقي يترك يسقط في عتمة المكان خلفه.",
    },
    role: {
      en: ["Cinematography", "Edit", "Colour"],
      ar: ["تصوير", "مونتاج", "تصحيح ألوان"],
    },
    kit: ["Sony A7 III", "Premiere Pro"],
  },
  {
    slug: "esimley",
    number: "08",
    title: { en: "Esimley", ar: "إسمايلي" },
    client: { en: "Esimley", ar: "إسمايلي" },
    category: { en: "Brand Shoot", ar: "تصوير علامة" },
    year: "2025",
    behance: "https://www.behance.net/gallery/241297657/Video-Shootin-For-Esimley",
    clips: [{ name: "esimley-1", vertical: true }],
    overview: {
      en: "A shoot built around a single product idea, kept deliberately small so every frame had to earn its place.",
      ar: "تصوير مبني على فكرة منتج واحدة، متعمّد يكون صغير عشان كل كادر يستاهل مكانه.",
    },
    challenge: {
      en: "A short brief and a short runtime leave nowhere to hide a weak frame.",
      ar: "بريف قصير ومدة قصيرة ما يخلّون مكان تخبي فيه كادر ضعيف.",
    },
    approach: {
      en: "Fewer setups, more takes. The frame is locked and the performance inside it is what changes between takes.",
      ar: "إعدادات أقل ولقطات أكثر. الكادر ثابت، واللي يتغيّر بين اللقطة والثانية هو الأداء داخله.",
    },
    role: {
      en: ["Cinematography", "Edit"],
      ar: ["تصوير", "مونتاج"],
    },
    kit: ["Sony A7 III", "Premiere Pro"],
  },
  {
    slug: "almurah",
    number: "09",
    title: { en: "Almurah", ar: "المُرَاح" },
    client: { en: "Almurah", ar: "المُرَاح" },
    category: { en: "Commercial", ar: "إعلان تجاري" },
    year: "2025",
    behance: "https://www.behance.net/gallery/241467067/Video-Shoot-For-ALMURAH",
    clips: [{ name: "almurah-1", vertical: true }],
    overview: {
      en: "A commercial piece where the post-production carries as much weight as the shoot — graded and finished in After Effects.",
      ar: "قطعة إعلانية الما-بعد-إنتاج فيها يحمل نفس ثقل التصوير — تدرّج لوني وإنهاء في أفتر إفكتس.",
    },
    challenge: {
      en: "Making footage from a single location feel like it belongs to a larger campaign.",
      ar: "خلي مواد مصوّرة من موقع واحد تحس إنها جزء من حملة أكبر.",
    },
    approach: {
      en: "A consistent grade and a repeating graphic language do the work that a bigger production budget would otherwise have to.",
      ar: "تدرّج لوني ثابت ولغة جرافيك متكررة يسوّون الشغل اللي كان بيحتاج ميزانية إنتاج أكبر.",
    },
    role: {
      en: ["Cinematography", "Edit", "Motion Graphics"],
      ar: ["تصوير", "مونتاج", "موشن جرافيك"],
    },
    kit: ["Premiere Pro", "After Effects"],
  },
  {
    slug: "editing-project",
    number: "10",
    title: { en: "Editing Study", ar: "دراسة مونتاج" },
    client: { en: "Personal", ar: "شخصي" },
    category: { en: "Post Production", ar: "ما بعد الإنتاج" },
    year: "2025",
    behance: "https://www.behance.net/gallery/241465609/Video-Editing-Project",
    clips: [{ name: "editing-project-1", vertical: true }],
    overview: {
      en: "A self-directed post-production study — an exercise in how far rhythm, sound and graphics can carry a cut on their own.",
      ar: "دراسة ما-بعد-إنتاج ذاتية — تمرين على قد إيش الإيقاع والصوت والجرافيك يقدرون يحملون المونتاج لحالهم.",
    },
    challenge: {
      en: "Without a client brief there is no external constraint, so the discipline has to be self-imposed.",
      ar: "بدون بريف عميل ما فيه قيد خارجي، فالانضباط لازم يكون ذاتي.",
    },
    approach: {
      en: "Built to a fixed runtime and a fixed track, then cut until nothing could be removed without breaking it.",
      ar: "مبني على مدة ثابتة وتراك ثابت، وبعدها قص لين ما بقي شيء ممكن يُشال بدون ما ينكسر.",
    },
    role: {
      en: ["Edit", "Motion Graphics", "Sound"],
      ar: ["مونتاج", "موشن جرافيك", "صوت"],
    },
    kit: ["Premiere Pro", "After Effects"],
  },
];

export const featuredProject = projects.find((p) => p.featured) ?? projects[0];

/**
 * Every clip as its own carousel card, rather than one card per project.
 *
 * The coverflow only looks full when there are enough cards to run past both
 * edges of the screen — the Bedeiry strip this is modelled on carries twenty
 * reels. Ten project covers left gaps on a wide monitor, so the carousel shows
 * all seventeen vertical clips instead, each linking back to its case study.
 *
 * Clips are dealt round-robin (first clip of every project, then every second
 * clip, then the rest) so two clips from the same shoot never sit next to each
 * other. `istanbul-villa-1` is skipped: it is the only 16:9 piece, it already
 * carries the hero, and a widescreen frame cropped into a 9:16 card loses the
 * very composition that makes it worth showing.
 */
export type CarouselCard = {
  name: string;
  slug: string;
  title: Bilingual;
  category: Bilingual;
  year: string;
};

export const carouselClips: CarouselCard[] = (() => {
  const rounds = Math.max(...projects.map((p) => p.clips.length));
  const out: CarouselCard[] = [];

  for (let round = 0; round < rounds; round++) {
    for (const project of projects) {
      const clip = project.clips[round];
      if (!clip || !clip.vertical) continue;
      out.push({
        name: clip.name,
        slug: project.slug,
        title: project.title,
        category: project.category,
        year: project.year,
      });
    }
  }
  return out;
})();

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

/** Wraps around, so the last case study leads back into the first. */
export const getNextProject = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
};
