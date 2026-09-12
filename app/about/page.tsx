"use client";

import Image from "next/image";
import SectionWrapper from "@/components/SectionWrapper";
import { useLanguage } from "@/contexts/LanguageContext";
import { content, t } from "@/data/content";

export default function AboutPage() {
  const { lang } = useLanguage();
  const c = content.about;
  const images = c.images[lang];
  const bodyText = lang === "ta" ? c.content.ta : c.content.en;

  return (
    <div className="pt-16 md:pt-20">
      {/* Hero bar */}
      <div className="bg-hero-pattern py-16 px-4 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-gold-light" id="about-heading">
          {t(c.heading, lang)}
        </h1>
        <p className="font-body text-cream-dark/70 mt-2 tracking-widest text-sm uppercase">
          {t(c.subheading, lang)}
        </p>
        <div className="gold-divider mt-6" />
      </div>

      {/* Content */}
      <SectionWrapper className="bg-cream kolam-bg py-16 px-4 sm:px-6 lg:px-8" id="about-content">
        <div className="max-w-3xl mx-auto">
          <div className="font-body">
            {bodyText.split("\n\n").map((para, i) => {
              const rendered = para.split(/(\*\*.*?\*\*)/).map((chunk, j) =>
                chunk.startsWith("**") && chunk.endsWith("**")
                  ? <strong key={j} className="text-maroon font-semibold">{chunk.slice(2, -2)}</strong>
                  : chunk
              );
              return <p key={i} className="mb-5 text-ink leading-relaxed text-base md:text-lg">{rendered}</p>;
            })}
          </div>
        </div>
      </SectionWrapper>

      {/* Three images */}
      <SectionWrapper className="bg-cream-dark py-16 px-4 sm:px-6 lg:px-8" id="about-images">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="section-heading">{t(c.gallery, lang)}</h2>
            <div className="gold-divider" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {images.map((img, i) => (
              <div key={i} className="card-base group overflow-hidden" id={`about-image-${i + 1}`}>
                <div className="relative w-full h-56 sm:h-64 md:h-72 overflow-hidden">
                  <Image src={img.src} alt={img.caption} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 100vw, 33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-maroon-dark/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-4 bg-cream">
                  <p className="font-display text-sm text-maroon font-semibold leading-snug">{img.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}
