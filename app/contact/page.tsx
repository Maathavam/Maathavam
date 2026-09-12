"use client";

import SectionWrapper from "@/components/SectionWrapper";
import ContactBlock from "@/components/ContactBlock";
import { useLanguage } from "@/contexts/LanguageContext";
import { content, t } from "@/data/content";

export default function ContactPage() {
  const { lang } = useLanguage();
  const c = content.contact;

  return (
    <div className="pt-16 md:pt-20">
      <div className="bg-hero-pattern py-16 px-4 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-gold-light" id="contact-heading">
          {t(c.heading, lang)}
        </h1>
        <p className="font-body text-cream-dark/70 mt-2 tracking-widest text-sm uppercase">
          {t(c.subheading, lang)}
        </p>
        <div className="gold-divider mt-6" />
      </div>

      <SectionWrapper className="bg-cream kolam-bg py-16 px-4 sm:px-6 lg:px-8" id="contact-section">
        <div className="max-w-6xl mx-auto">
          <ContactBlock />
        </div>
      </SectionWrapper>
    </div>
  );
}
