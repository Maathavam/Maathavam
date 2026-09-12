"use client";

import { events } from "@/data/events";
import EventCard from "@/components/EventCard";
import SectionWrapper from "@/components/SectionWrapper";
import { useLanguage } from "@/contexts/LanguageContext";
import { content, t } from "@/data/content";

export default function EventsPage() {
  const { lang } = useLanguage();
  const c = content.events;

  return (
    <div className="pt-16 md:pt-20">
      <div className="bg-hero-pattern py-16 px-4 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-gold-light" id="events-heading">
          {t(c.heading, lang)}
        </h1>
        <p className="font-body text-cream-dark/70 mt-2 tracking-widest text-sm uppercase">
          {t(c.subheading, lang)}
        </p>
        <div className="gold-divider mt-6" />
      </div>

      <SectionWrapper className="bg-cream kolam-bg py-16 px-4 sm:px-6 lg:px-8" id="events-grid">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {events.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}
