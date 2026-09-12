"use client";

import { useEffect, useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { carouselSlides } from "@/data/carousel";
import { content } from "@/data/content";

// Map carousel src filename to content key
const captionMap: Record<string, { ta: string; en: string }> = {
  "pongal.jpg":        content.carousel.pongal,
  "dance.jpg":         content.carousel.dance,
  "cultural-night.jpg":content.carousel.culturalNight,
  "kolam.jpg":         content.carousel.kolam,
  "music.jpg":         content.carousel.music,
};

interface CarouselProps {
  slides?: typeof carouselSlides;
  lang?: "ta" | "en";
}

export default function Carousel({ slides = carouselSlides, lang = "ta" }: CarouselProps) {
  const autoplay = Autoplay({ delay: 4000, stopOnInteraction: false });
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 }, [autoplay]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo  = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  return (
    <div className="relative group" aria-label="படங்கள் சுழலி" role="region">
      <div className="embla rounded-2xl overflow-hidden shadow-xl" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((slide, i) => {
            const filename = slide.src.split("/").pop() ?? "";
            const captionObj = captionMap[filename];
            const caption = captionObj ? captionObj[lang] : slide.caption;
            return (
              <div key={i} className="embla__slide relative h-[280px] sm:h-[380px] md:h-[480px] lg:h-[540px]">
                <Image src={slide.src} alt={slide.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 90vw" priority={i === 0} />
                {caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-maroon-dark/80 to-transparent px-6 py-4">
                    <p className="font-display text-lg text-gold-light">{caption}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <button id="carousel-prev" onClick={scrollPrev} aria-label="முந்தைய படம்" className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-maroon-dark/70 hover:bg-maroon text-cream flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm border border-gold/20">
        <ChevronLeft size={20} />
      </button>
      <button id="carousel-next" onClick={scrollNext} aria-label="அடுத்த படம்" className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-maroon-dark/70 hover:bg-maroon text-cream flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm border border-gold/20">
        <ChevronRight size={20} />
      </button>

      <div className="flex justify-center gap-2 mt-4" role="tablist" aria-label="படம் குறிகாட்டிகள்">
        {slides.map((_, i) => (
          <motion.button key={i} role="tab" id={`carousel-dot-${i}`} aria-selected={i === selectedIndex} aria-label={`படம் ${i + 1}`} onClick={() => scrollTo(i)} animate={{ width: i === selectedIndex ? 24 : 8 }} className={`h-2 rounded-full transition-colors duration-300 ${i === selectedIndex ? "bg-gold" : "bg-maroon/40 hover:bg-gold/50"}`} />
        ))}
      </div>
    </div>
  );
}
