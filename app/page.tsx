"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import Carousel from "@/components/Carousel";
import QuoteRotator from "@/components/QuoteRotator";
import ContactBlock from "@/components/ContactBlock";
import { carouselSlides } from "@/data/carousel";
import { quotes } from "@/data/quotes";
import { useLanguage } from "@/contexts/LanguageContext";
import { content, t } from "@/data/content";

const quickNavLinks = [
  { href: "/about",   key: "about"   as const, descKey: "aboutDesc"   as const },
  { href: "/events",  key: "events"  as const, descKey: "eventsDesc"  as const },
  { href: "/contact", key: "contact" as const, descKey: "contactDesc" as const },
];

export default function HomePage() {
  const { lang } = useLanguage();
  const c = content.home;

  return (
    <div className="flex flex-col pt-16 md:pt-20">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section id="hero" className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden" style={{ background: "radial-gradient(ellipse at top, #8B2A3E 0%, #6B1A2A 45%, #4A0F1C 100%)" }}>
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9922A' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center px-4 w-full max-w-6xl mx-auto">
          {/* Logo row */}
          <div className="flex items-center justify-center gap-6 md:gap-12 mb-6">
            <motion.div initial={{ opacity: 0, x: -50, rotate: -10 }} animate={{ opacity: 1, x: 0, rotate: 0 }} transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }} className="animate-float">
              <div className="relative w-24 h-24 md:w-36 md:h-36 lg:w-44 lg:h-44 rounded-full border-2 border-gold/40 overflow-hidden shadow-gold-glow">
                <Image src="/images/logo.jpg" alt="மாதவம் சின்னம்" fill className="object-cover" sizes="176px" priority />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut", delay: 0.1 }} className="flex flex-col items-center">
              <h1 id="hero-heading" className="font-display font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-gold-light tracking-wide leading-none" style={{ textShadow: "0 0 40px rgba(201,146,42,0.3)" }}>
                மாதவம்
              </h1>
              <p className="font-body text-base sm:text-lg md:text-xl text-cream-dark/80 tracking-widest mt-2 uppercase">MAATHAVAM</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50, rotate: 10 }} animate={{ opacity: 1, x: 0, rotate: 0 }} transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }} className="animate-float" style={{ animationDelay: "1.5s" }}>
              <div className="relative w-24 h-24 md:w-36 md:h-36 lg:w-44 lg:h-44 rounded-full border-2 border-gold/40 overflow-hidden shadow-gold-glow">
                <Image src="/images/logo.jpg" alt="மாதவம் சின்னம்" fill className="object-cover scale-x-[-1]" sizes="176px" priority />
              </div>
            </motion.div>
          </div>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }} className="font-display text-lg md:text-2xl text-cream-dark/80 mt-2 mb-10 tracking-wide">
            {t(c.heroTagline, lang)}
          </motion.p>
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.7 }} className="gold-divider" />
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.8 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <p className="text-cream-dark/40 text-xs font-body tracking-widest uppercase">{t(c.scroll, lang)}</p>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} className="w-px h-8 bg-gradient-to-b from-gold/50 to-transparent" />
        </motion.div>
      </section>

      {/* ── Quick Nav ────────────────────────────────────────────────────── */}
      <SectionWrapper className="bg-cream-dark kolam-bg py-16 px-4 sm:px-6" id="quick-nav" delay={0.1}>
        <div className="max-w-4xl mx-auto">
          <div className="bg-cream rounded-3xl shadow-card p-6 md:p-10 border border-cream-deeper">
            <p className="font-display text-center text-maroon text-sm uppercase tracking-widest mb-6 opacity-70">{t(c.explore, lang)}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {quickNavLinks.map((link) => (
                <motion.div key={link.href} whileHover={{ scale: 1.03, y: -4 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Link href={link.href} id={`quicknav-${link.key}`} className="flex flex-col items-center gap-2 bg-maroon-dark rounded-2xl px-6 py-6 group hover:bg-maroon transition-colors duration-300 shadow-maroon-glow">
                    <span className="font-display text-2xl font-bold text-gold-light group-hover:text-gold transition-colors duration-200">
                      {t(content.nav[link.key], lang)}
                    </span>
                    <span className="font-body text-cream-dark/50 text-xs text-center">{t(c[link.descKey], lang)}</span>
                    <ArrowRight size={16} className="text-gold/50 group-hover:text-gold group-hover:translate-x-1 transition-all duration-200" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* ── Carousel ─────────────────────────────────────────────────────── */}
      <SectionWrapper className="bg-cream py-16 px-4 sm:px-6 lg:px-8" id="carousel-section">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="section-heading">{t(c.ourMoments, lang)}</h2>
            <div className="gold-divider" />
          </div>
          <Carousel slides={carouselSlides} lang={lang} />
        </div>
      </SectionWrapper>

      {/* ── Quotes ───────────────────────────────────────────────────────── */}
      <SectionWrapper className="bg-cream-dark kolam-bg py-20 px-4 sm:px-6" id="quotes-section">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-heading">{t(content.quotesSection.heading, lang)}</h2>
            <p className="font-display text-maroon/60 mt-2">{t(content.quotesSection.sub, lang)}</p>
            <div className="gold-divider" />
          </div>
          <QuoteRotator quotes={quotes} />
        </div>
      </SectionWrapper>

      {/* ── Contact Block ─────────────────────────────────────────────────── */}
      <SectionWrapper className="bg-cream py-20 px-4 sm:px-6 lg:px-8" id="home-contact">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-heading">{t(c.ourTeam, lang)}</h2>
            <p className="font-display text-maroon/60 mt-2">{t(c.teamSub, lang)}</p>
            <div className="gold-divider" />
          </div>
          <ContactBlock />
        </div>
      </SectionWrapper>
    </div>
  );
}
