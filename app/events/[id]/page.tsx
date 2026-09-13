"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, ArrowLeft } from "lucide-react";
import { events as staticEvents, Event } from "@/data/events";
import { DbEvent } from "@/lib/supabase";
import { useLanguage } from "@/contexts/LanguageContext";
import { content, t } from "@/data/content";

interface Params {
  params: { id: string };
}

function dbToEvent(db: DbEvent): Event {
  return {
    id: db.slug || db.id,
    name: db.name,
    nameTamil: db.name_tamil,
    image: db.image_url || "/images/events/kalaignan.jpg",
    description: db.description ?? "",
    descriptionTamil: db.description_tamil ?? "",
    date: db.date,
    dateTamil: db.date_tamil,
    details: db.details ?? "",
    detailsTamil: db.details_tamil ?? "",
  };
}

export default function EventDetailPage({ params }: Params) {
  const { lang } = useLanguage();
  const c = content.events;

  const [event, setEvent] = useState<Event | null>(
    staticEvents.find((e) => e.id === params.id) ?? null
  );
  const [loading, setLoading] = useState(!event);
  const [notFoundFlag, setNotFoundFlag] = useState(false);

  // If not found in static data, fetch from Supabase
  useEffect(() => {
    if (event) return;
    fetch("/api/events")
      .then((r) => r.json())
      .then((json) => {
        const dbEvents: DbEvent[] = json.events ?? [];
        const match = dbEvents.find(
          (e) => e.slug === params.id || e.id === params.id
        );
        if (match) {
          setEvent(dbToEvent(match));
        } else {
          setNotFoundFlag(true);
        }
      })
      .catch(() => setNotFoundFlag(true))
      .finally(() => setLoading(false));
  }, [params.id, event]);

  if (notFoundFlag) notFound();

  if (loading || !event) {
    return (
      <div className="pt-16 md:pt-20 min-h-screen bg-cream flex items-center justify-center">
        <p className="font-body text-ink-light animate-pulse text-sm">
          நிகழ்வை ஏற்றுகிறது… Loading event…
        </p>
      </div>
    );
  }

  const name    = lang === "ta" ? event.nameTamil    : event.name;
  const details = lang === "ta" ? event.detailsTamil : event.details;
  const desc    = lang === "ta" ? event.descriptionTamil : event.description;
  const date    = lang === "ta" ? (event.dateTamil ?? event.date) : event.date;

  return (
    <div className="pt-16 md:pt-20 min-h-screen bg-cream">
      {/* Full-width image */}
      <div className="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh] overflow-hidden">
        <Image src={event.image} alt={name} fill className="object-cover" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-maroon-dark/80 via-maroon-dark/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 pb-8">
          <h1 className="font-display text-3xl md:text-5xl font-bold text-cream leading-tight" id="event-detail-heading">
            {name}
          </h1>
          {date && (
            <p className="flex items-center gap-2 text-cream-dark/70 text-sm mt-3 font-body">
              <CalendarDays size={14} className="text-gold" />{date}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Link href="/events" id="event-back-link" className="inline-flex items-center gap-2 text-maroon hover:text-gold font-body text-sm mb-8 group transition-colors duration-200">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
          {t(c.back, lang)}
        </Link>

        {desc && (
          <p className="font-body text-lg text-ink-light leading-relaxed mb-8 italic border-l-4 border-gold pl-4">{desc}</p>
        )}

        <div className="font-body text-ink leading-loose">
          {details.split("\n\n").map((para, i) => (
            <p key={i} className="mb-5 text-base md:text-lg whitespace-pre-line">{para}</p>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-cream-dark">
          <Link href="/events" id="event-back-link-bottom" className="inline-flex items-center gap-2 bg-maroon text-cream px-6 py-3 rounded-xl font-body font-medium hover:bg-maroon-dark transition-colors duration-200 shadow-maroon-glow">
            <ArrowLeft size={16} />
            {t(c.backToEvents, lang)}
          </Link>
        </div>
      </div>
    </div>
  );
}
