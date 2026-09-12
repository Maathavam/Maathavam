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

      {/* Three circular images — no box, no caption */}
      <SectionWrapper className="bg-cream-dark py-16 px-4 sm:px-6 lg:px-8" id="about-images">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-10 md:gap-16">
            {images.map((img, i) => (
              <div key={i} className="relative w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden flex-shrink-0" id={`about-image-${i + 1}`}>
                <Image
                  src={img.src}
                  alt={img.caption}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 224px, 288px"
                />
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}
