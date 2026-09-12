// ─────────────────────────────────────────────────────────────────────────────
// data/carousel.ts
// Edit this array to change Home page carousel images.
// Place images in /public/images/carousel/ and reference them here.
// ─────────────────────────────────────────────────────────────────────────────

export interface CarouselSlide {
  src: string;
  alt: string;
  caption?: string;
}

export const carouselSlides: CarouselSlide[] = [
  {
    src: "/images/carousel/pongal.jpg",
    alt: "பொங்கல் விழா — Pongal celebration at campus",
    caption: "தைப்பொங்கல் விழா",
  },
  {
    src: "/images/carousel/dance.jpg",
    alt: "Bharatanatyam performance at college cultural event",
    caption: "கலாச்சார நிகழ்வு",
  },
  {
    src: "/images/carousel/cultural-night.jpg",
    alt: "Tamil cultural night performance on stage",
    caption: "தமிழ் கலாச்சார இரவு",
  },
  {
    src: "/images/carousel/kolam.jpg",
    alt: "Kolam rangoli competition at college",
    caption: "கோலம் போட்டி",
  },
  {
    src: "/images/carousel/music.jpg",
    alt: "Carnatic music performance at Tamil club event",
    caption: "கர்நாடக இசை நிகழ்வு",
  },
];
