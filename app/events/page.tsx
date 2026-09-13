"use client";

import { useEffect, useState } from "react";
import { events as staticEvents, Event } from "@/data/events";
import { DbEvent } from "@/lib/supabase";
import EventCard from "@/components/EventCard";
import SectionWrapper from "@/components/SectionWrapper";
import { useLanguage } from "@/contexts/LanguageContext";
import { content, t } from "@/data/content";

// Convert a Supabase DbEvent → local Event shape
function dbToEvent(db: DbEvent): Event {
  return {
    id: db.slug || db.id,
    name: db.name,
    nameTamil: db.name_tamil,
    image: db.image_url || "/images/events/kalaignan.jpg",
    description: db.description,
    descriptionTamil: db.description_tamil,
    date: db.date,
    dateTamil: db.date_tamil,
    details: db.details,
    detailsTamil: db.details_tamil,
  };
}

export default function EventsPage() {
  const { lang } = useLanguage();
  const c = content.events;
  const [dbEvents, setDbEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((json) => {
        const converted = (json.events as DbEvent[] ?? []).map(dbToEvent);
        setDbEvents(converted);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // DB events first (newest), then static events
  const allEvents = [...dbEvents, ...staticEvents];

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
          {loading && (
            <p className="text-center text-ink-light font-body text-sm mb-6 animate-pulse">
              நிகழ்வுகளை ஏற்றுகிறது… Loading events…
            </p>
          )}
          {!loading && allEvents.length === 0 && (
            <div className="text-center py-20">
              <p className="font-display text-2xl text-maroon/40 mb-2">நிகழ்வுகள் எதுவும் இல்லை</p>
              <p className="font-body text-ink-light text-sm">No events have been added yet. Check back soon!</p>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {allEvents.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}
