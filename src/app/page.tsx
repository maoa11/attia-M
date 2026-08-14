import Hero from "@/components/sections/Hero";
import Work from "@/components/sections/Work";
import About from "@/components/sections/About";
import Footer from "@/components/ui/Footer";
import { projects } from "@/data/projects";
import { site } from "@/data/content";

/**
 * Four screens, nothing else.
 *
 * The earlier build carried featured / services / process / testimonials
 * sections as well and ran to eight screens; the client's judgement was that a
 * visitor gets bored scrolling and reading long before that. Everything a
 * project has to say now lives on its own case-study page, reached from the
 * carousel — the home page's only job is: who he is, what the work looks like,
 * and how to reach him.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role.en,
  url: "https://attiamohamed.com",
  image: "https://attiamohamed.com/brand/portrait.png",
  address: { "@type": "PostalAddress", addressLocality: "Jeddah", addressCountry: "SA" },
  sameAs: [site.instagram, site.behance],
  knowsAbout: ["Videography", "Video Editing", "Commercial Film", "Motion Graphics"],
  makesOffer: projects.map((p) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "VideoObject",
      name: p.title.en,
      url: `https://attiamohamed.com/work/${p.slug}/`,
    },
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Work />
      <About />
      <Footer />
    </>
  );
}
