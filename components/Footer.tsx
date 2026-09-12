"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Heart } from "lucide-react";
import { socials } from "@/data/socials";
import { useLanguage } from "@/contexts/LanguageContext";
import { content, t } from "@/data/content";

function InstagramIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

const navLinks = [
  { href: "/",        key: "home"    as const },
  { href: "/about",   key: "about"   as const },
  { href: "/events",  key: "events"  as const },
  { href: "/contact", key: "contact" as const },
];

export default function Footer() {
  const { lang } = useLanguage();
  const c = content.footer;

  return (
    <footer className="bg-maroon-dark text-cream-dark" role="contentinfo">
      <div className="h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-60" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">

          {/* Brand */}
          <div>
            <h2 className="font-display text-3xl font-bold text-gold-light mb-2">மாதவம்</h2>
            <p className="text-sm text-cream-dark/70 font-body tracking-widest mb-1">MAATHAVAM</p>
            <p className="text-cream-dark/60 text-sm mt-3 leading-relaxed">{t(c.tagline, lang)}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-semibold text-gold mb-4">{t(c.quickLinks, lang)}</h3>
            <ul className="space-y-2 font-body text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-cream-dark/70 hover:text-gold-light transition-colors duration-200 flex items-center gap-2 group" id={`footer-link-${link.key}`}>
                    <span className="w-4 h-px bg-gold/50 group-hover:w-6 transition-all duration-300" />
                    {t(content.nav[link.key], lang)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-lg font-semibold text-gold mb-4">{t(c.connect, lang)}</h3>
            <div className="space-y-3 font-body text-sm">
              <motion.a href={socials.mailtoUrl} whileHover={{ x: 4 }} className="flex items-center gap-3 text-cream-dark/80 hover:text-gold-light transition-colors duration-200 group" id="footer-email">
                <span className="w-8 h-8 rounded-full bg-maroon/60 flex items-center justify-center group-hover:bg-gold/20 transition-colors duration-200">
                  <Mail size={14} />
                </span>
                <span className="break-all">{socials.email}</span>
              </motion.a>
              <motion.a href={socials.instagramUrl} target="_blank" rel="noopener noreferrer" whileHover={{ x: 4 }} className="flex items-center gap-3 text-cream-dark/80 hover:text-gold-light transition-colors duration-200 group" id="footer-instagram">
                <span className="w-8 h-8 rounded-full bg-maroon/60 flex items-center justify-center group-hover:bg-gold/20 transition-colors duration-200">
                  <InstagramIcon size={14} />
                </span>
                <span>{socials.instagram}</span>
              </motion.a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-gold/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cream-dark/40 font-body">
          <p>© {new Date().getFullYear()} {t(c.copyright, lang)}</p>
          <p className="flex items-center gap-1">
            {t(c.madeWith, lang)} <Heart size={12} className="text-gold fill-gold mx-1" />
          </p>
        </div>
      </div>
    </footer>
  );
}
