"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { CalendarDays, ArrowRight } from "lucide-react";
import { Event } from "@/data/events";
import { useLanguage } from "@/contexts/LanguageContext";
import { content, t } from "@/data/content";

interface EventCardProps {
  event: Event;
  index?: number;
}

export default function EventCard({ event, index = 0 }: EventCardProps) {
  const { lang } = useLanguage();
  const c = content.events;
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * -8, y: dx * 8 });
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => { setHovering(false); setTilt({ x: 0, y: 0 }); }}
      animate={{
        rotateX: hovering ? tilt.x : 0,
        rotateY: hovering ? tilt.y : 0,
        y: hovering ? -10 : 0,
        boxShadow: hovering
          ? "0 24px 60px rgba(107,26,42,0.22)"
          : "0 4px 20px rgba(107,26,42,0.08)",
      }}
      style={{ perspective: 800, transformStyle: "preserve-3d" }}
      className="card-base group cursor-pointer"
      id={`event-card-${event.id}`}
    >
      <Link href={`/events/${event.id}`} className="block">
        <div className="relative w-full h-52 sm:h-60 overflow-hidden">
          <Image
            src={event.image}
            alt={lang === "ta" ? event.nameTamil : event.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-maroon-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-gold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-gold-glow">
            <ArrowRight size={16} className="text-maroon-dark" />
          </div>
          {/* Shimmer sweep */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-display text-lg font-bold text-maroon group-hover:text-maroon-light transition-colors duration-200 leading-tight mb-2">
            {lang === "ta" ? event.nameTamil : event.name}
          </h3>
          {(event.date || event.dateTamil) && (
            <p className="flex items-center gap-1.5 text-ink-light text-xs font-body mb-3">
              <CalendarDays size={12} className="text-gold" />
              {lang === "ta" ? (event.dateTamil ?? event.date) : event.date}
            </p>
          )}
          <p className="font-body text-ink-light text-sm leading-relaxed line-clamp-2">
            {lang === "ta" ? event.descriptionTamil : event.description}
          </p>
          <div className="mt-4 flex items-center gap-1 text-gold text-sm font-medium font-body group-hover:gap-2 transition-all duration-200">
            <span>{t(c.readMore, lang)}</span>
            <ArrowRight size={14} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
