// ─────────────────────────────────────────────────────────────────────────────
// data/about.ts
// Edit the content string and images array to update the About page.
// Images go in /public/images/about/
// ─────────────────────────────────────────────────────────────────────────────

export interface AboutImage {
  src: string;
  alt: string;
  caption: string;
}

export interface AboutData {
  heading: string;
  headingTamil: string;
  content: string;
  images: AboutImage[];
}

export const aboutData: AboutData = {
  heading: "About Maathavam",
  headingTamil: "மாதவம் பற்றி",
  content: `மாதவம் — மாணவர்கள் தமிழ் வளர் மன்றம் — is a vibrant student-run Tamil cultural club dedicated to nurturing the language, arts, and heritage of Tamil among college students.

Founded with the belief that language is the soul of a culture, Maathavam works tirelessly to keep Tamil alive, celebrated, and relevant in the hearts of the next generation. We are more than a club — we are a community of students who find joy, identity, and belonging through the world's oldest living classical language.

**Our Mission**

We believe every student who joins Maathavam leaves not just with memories of events, but with a deeper pride in their identity, a richer understanding of their heritage, and lifelong friendships forged through shared love for Tamil.

**What We Do**

• Organise annual festivals like Pongal Vizha, Kalaignan, and Thirukkural Vizha  
• Host workshops on classical arts — Bharatanatyam, Carnatic music, Villupattu  
• Conduct Tamil literature seminars and Thirukkural recitation sessions  
• Celebrate Tamil language preservation through street plays, short films, and social media campaigns  
• Collaborate with Tamil scholars and artists to bring authentic cultural experiences to campus

**Our Values**

Tamil is one of the world's oldest living languages — over 2,500 years old — with a literary tradition that has produced timeless masterpieces like the Thirukkural, Sangam poetry, and the epics of Silapathikaram. Maathavam exists to ensure this priceless heritage continues to flourish among students who will carry it into the future.

Join us — and be part of something ancient, alive, and beautiful.`,
  images: [
    {
      src: "/images/about/heritage.jpg",
      alt: "Ancient Tamil literary tradition — scholars and manuscripts",
      caption: "இலக்கிய பாரம்பரியம் — A 2,500-year literary heritage",
    },
    {
      src: "/images/about/activities.jpg",
      alt: "Students participating in Tamil club activities",
      caption: "கலாச்சார நடவடிக்கைகள் — Cultural activities on campus",
    },
    {
      src: "/images/about/campus.jpg",
      alt: "College campus decorated for Tamil cultural events",
      caption: "நம் வளாகம் — Our vibrant campus community",
    },
  ],
};
