"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, ExternalLink } from "lucide-react";
import { memberGroups } from "@/data/members";
import { socials } from "@/data/socials";
import { useLanguage } from "@/contexts/LanguageContext";
import { content, t } from "@/data/content";

function InstagramIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export default function ContactBlock() {
  const { lang } = useLanguage();
  const c = content.contact;

  return (
    <div className="w-full space-y-14">
      {/* Two member group sections */}
      {memberGroups.map((group, gi) => (
        <div key={group.groupId} id={`group-${group.groupId}`}>
          {/* Section heading */}
          <div className="flex items-center gap-4 mb-8">
            <div>
              <h3 className="font-display text-2xl font-bold text-maroon">
                {lang === "ta" ? group.groupNameTamil : group.groupName}
              </h3>
              <div className="h-0.5 w-16 bg-gold mt-2 rounded-full" />
            </div>
          </div>

          {/* Members grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {group.members.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.08 + gi * 0.1 }}
                whileHover={{ y: -6, boxShadow: "0 16px 40px rgba(44,32,32,0.14)" }}
                className="card-base bg-cream group cursor-default"
                id={`member-card-${member.id}`}
              >
                <div className="relative w-full aspect-square overflow-hidden">
                  <Image
                    src={member.photo}
                    alt={lang === "ta" ? member.nameTamil : member.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-maroon/0 group-hover:bg-maroon/10 transition-colors duration-300" />
                  {/* Shimmer sweep */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12" />
                  </div>
                </div>
                <div className="p-3 md:p-4">
                  <p className="font-display font-semibold text-maroon text-sm md:text-base leading-tight">
                    {lang === "ta" ? member.nameTamil : member.name}
                  </p>
                  <p className="font-body text-[11px] md:text-xs text-gold mt-1 leading-snug">
                    {lang === "ta" ? member.roleTamil : member.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}

      {/* Social contacts card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-maroon rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12"
      >
        <a href={socials.mailtoUrl} id="contact-email-link" className="flex items-center gap-4 group">
          <span className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gold/20 flex items-center justify-center group-hover:bg-gold/40 transition-colors duration-300 shadow-gold-glow">
            <Mail className="text-gold-light" size={22} />
          </span>
          <div>
            <p className="text-cream-dark/60 text-xs font-body mb-0.5 uppercase tracking-wider">{t(c.emailUs, lang)}</p>
            <p className="text-gold-light font-body font-medium text-sm md:text-base group-hover:text-gold transition-colors duration-200 break-all">{socials.email}</p>
          </div>
        </a>

        <div className="w-px h-12 bg-gold/20 hidden md:block" />

        <a href={socials.instagramUrl} target="_blank" rel="noopener noreferrer" id="contact-instagram-link" className="flex items-center gap-4 group">
          <span className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gold/20 flex items-center justify-center group-hover:bg-gold/40 transition-colors duration-300 shadow-gold-glow">
            <InstagramIcon size={22} />
          </span>
          <div>
            <p className="text-cream-dark/60 text-xs font-body mb-0.5 uppercase tracking-wider">{t(c.instagram, lang)}</p>
            <p className="text-gold-light font-body font-medium text-sm md:text-base group-hover:text-gold transition-colors duration-200 flex items-center gap-1">
              {socials.instagram}
              <ExternalLink size={12} className="opacity-50" />
            </p>
          </div>
        </a>
      </motion.div>
    </div>
  );
}
