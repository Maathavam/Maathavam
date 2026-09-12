# Maathavam — Tamil Club Website

> **maanavargal tamil valar mandram**  
> A visually stunning Next.js 14 website for the Maathavam college Tamil cultural club.

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
/
├── app/               # Next.js App Router pages
│   ├── page.tsx       # Home page (/)
│   ├── about/         # About page (/about)
│   ├── events/        # Events list (/events)
│   │   └── [id]/      # Event detail (/events/[id])
│   └── contact/       # Contact page (/contact)
├── components/        # Reusable React components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── SectionWrapper.tsx
│   ├── Carousel.tsx
│   ├── QuoteRotator.tsx
│   ├── ContactBlock.tsx
│   └── EventCard.tsx
├── data/              # ✏️ ALL EDITABLE CONTENT LIVES HERE
│   ├── quotes.ts      # 10 Tamil quotes for the home page rotator
│   ├── carousel.ts    # Carousel slide image list
│   ├── about.ts       # About page content + 3 images
│   ├── events.ts      # Events list with full details
│   ├── members.ts     # Club members (photo + name + role)
│   └── socials.ts     # Club email & Instagram (used everywhere)
└── public/
    └── images/        # All images
        ├── logo.jpg
        ├── carousel/
        ├── events/
        ├── members/
        └── about/
```

---

## ✏️ How to Update Content

### Update Club Contact Info (email / Instagram)
Edit **`data/socials.ts`** — this file is imported by both the Footer and the Contact page, so you only need to change it once:

```ts
export const socials = {
  email: "your.email@college.edu",
  instagram: "@your_handle",
  instagramUrl: "https://www.instagram.com/your_handle",
  mailtoUrl: "mailto:your.email@college.edu",
};
```

---

### Update Tamil Quotes (Home page rotator)
Edit **`data/quotes.ts`** — add, remove, or edit entries in the array:

```ts
export const quotes = [
  { text: "Your Tamil quote here...", author: "Author name" },
  // ...
];
```

---

### Update Carousel Images (Home page)
1. Place your images in **`public/images/carousel/`**
2. Edit **`data/carousel.ts`** to reference the new filenames:

```ts
export const carouselSlides = [
  { src: "/images/carousel/your-image.jpg", alt: "Description", caption: "Caption" },
];
```

---

### Add / Update Events
Edit **`data/events.ts`**. Each event has:
- `id` — unique string used in the URL: `/events/your-event-id`
- `name` — English name
- `nameTamil` — Tamil name (optional)
- `image` — path to image in `public/images/events/`
- `description` — short 1–2 sentence description for the card
- `date` — display date string (optional)
- `details` — full details text shown on the event detail page

```ts
{
  id: "new-event",
  name: "New Event Name",
  nameTamil: "புதிய நிகழ்வு",
  image: "/images/events/new-event.jpg",
  description: "Short description.",
  date: "December 1, 2025",
  details: `Full event details paragraph...`,
},
```

---

### Update Members (Contact page)
Edit **`data/members.ts`**. Each member:
1. Place their photo in **`public/images/members/`**
2. Add an entry:

```ts
{
  id: "unique-id",
  name: "Member Name",
  nameTamil: "பெயர்",
  photo: "/images/members/filename.jpg",
  role: "Role — தமிழில் பங்கு",
},
```

---

### Update About Page Content
Edit **`data/about.ts`**:
- `content` — the main text (supports `**bold**` markdown)
- `images` — array of 3 `{ src, alt, caption }` objects

---

## 🎨 Design System

Colors are defined in **`tailwind.config.ts`**:

| Token | Color | Usage |
|-------|-------|-------|
| `maroon` | `#6B1A2A` | Primary brand color |
| `gold` | `#C9922A` | Accents, highlights |
| `cream` | `#FDF6EC` | Background |
| `ink` | `#2C2020` | Body text |

Fonts:
- **Baloo Thambi 2** — Tamil/heading display font
- **Poppins** — Body/English text

---

## 🚢 Deploying to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repository to Vercel and it will deploy automatically on every push.

---

## 📦 Tech Stack

- **Next.js 14** — App Router, TypeScript
- **Tailwind CSS** — Custom design system
- **Framer Motion** — Page and section animations
- **Embla Carousel** — Auto-play swipeable carousel
- **Lucide React** — Icons
- **Google Fonts** — Baloo Thambi 2 + Poppins
