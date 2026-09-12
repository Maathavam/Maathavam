"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { content, t } from "@/data/content";

const navLinks = [
  { href: "/",        key: "home"    as const },
  { href: "/about",   key: "about"   as const },
  { href: "/events",  key: "events"  as const },
  { href: "/contact", key: "contact" as const },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { lang, toggle } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-maroon-dark/95 backdrop-blur-md shadow-lg" : "bg-maroon-dark"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo + Brand */}
          <Link href="/" className="flex items-center gap-3 group" id="nav-logo">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-gold/60 group-hover:border-gold transition-colors duration-300"
            >
              <Image src="/images/logo.jpg" alt="மாதவம் சின்னம்" fill className="object-cover" sizes="48px" priority />
            </motion.div>
            <div className="flex flex-col leading-tight">
              <span className="font-display text-xl md:text-2xl font-bold text-gold-light tracking-wide">மாதவம்</span>
              <span className="text-cream-dark/60 text-[10px] md:text-xs font-body tracking-widest hidden sm:block">MAATHAVAM</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                id={`nav-${link.key}`}
                className={`nav-link font-body text-sm uppercase tracking-wider ${pathname === link.href ? "active" : ""}`}
              >
                {t(content.nav[link.key], lang)}
              </Link>
            ))}

            {/* Language Toggle */}
            <LangToggle lang={lang} toggle={toggle} />
          </nav>

          {/* Mobile right: lang toggle + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <LangToggle lang={lang} toggle={toggle} compact />
            <button
              id="nav-mobile-menu-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg text-cream-dark hover:text-gold-light hover:bg-maroon/50 transition-colors duration-200"
              aria-label={menuOpen ? "மெனு மூடு" : "மெனு திற"}
              aria-expanded={menuOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                {menuOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="md:hidden bg-maroon-dark border-t border-gold/20 overflow-hidden"
            aria-label="Mobile navigation"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.div key={link.href} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.07 }}>
                  <Link
                    href={link.href}
                    id={`nav-mobile-${link.key}`}
                    className={`flex items-center px-4 py-3 rounded-xl font-body font-medium transition-all duration-200 ${
                      pathname === link.href
                        ? "bg-maroon text-gold-light"
                        : "text-cream-dark hover:bg-maroon/60 hover:text-gold-light"
                    }`}
                  >
                    {t(content.nav[link.key], lang)}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

// ── Language Toggle Pill ──────────────────────────────────────────────────────
function LangToggle({ lang, toggle, compact = false }: { lang: "ta" | "en"; toggle: () => void; compact?: boolean }) {
  const isTamil = lang === "ta";
  return (
    <motion.button
      id="lang-toggle"
      onClick={toggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isTamil ? "Switch to English" : "தமிழுக்கு மாறு"}
      className={`relative flex items-center rounded-full border border-gold/40 bg-maroon/60 hover:bg-maroon hover:border-gold transition-all duration-300 overflow-hidden ${
        compact ? "px-2 py-1 gap-1 text-[11px]" : "px-3 py-1.5 gap-2 text-xs"
      }`}
    >
      {/* Sliding pill indicator */}
      <motion.span
        className="absolute top-0.5 bottom-0.5 rounded-full bg-gold"
        animate={isTamil
          ? { left: "2px",          right: "52%" }
          : { left: "52%",          right: "2px" }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
      <span className={`relative z-10 font-display font-bold transition-colors duration-200 min-w-[2.6rem] text-center ${
        isTamil ? "text-maroon-dark" : "text-cream/70"
      }`}>
        தமிழ்
      </span>
      <span className={`relative z-10 font-body font-bold transition-colors duration-200 min-w-[1.6rem] text-center ${
        !isTamil ? "text-maroon-dark" : "text-cream/70"
      }`}>
        EN
      </span>
    </motion.button>
  );
}
