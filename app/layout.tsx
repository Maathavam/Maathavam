import type { Metadata } from "next";
import { Baloo_Thambi_2, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/contexts/LanguageContext";
import FloatingTamilLetters from "@/components/FloatingTamilLetters";
import SplashScreen from "@/components/SplashScreen";
import PageTransition from "@/components/PageTransition";
import ChatWidget from "@/components/ChatWidget";

const balooThambi = Baloo_Thambi_2({
  subsets: ["latin", "tamil"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-baloo",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | மாதவம் — Tamil Club",
    default: "மாதவம் — மாணவர்கள் தமிழ் வளர் மன்றம்",
  },
  description:
    "மாதவம் — மாணவர்கள் தமிழ் வளர் மன்றம். தமிழ் மொழி, கலை மற்றும் பாரம்பரியத்தை வளர்க்கும் கல்லூரி தமிழ் மன்றம்.",
  keywords: ["தமிழ் மன்றம்", "மாதவம்", "Tamil club", "Maathavam", "Tamil culture"],
  openGraph: {
    title: "மாதவம் — மாணவர்கள் தமிழ் வளர் மன்றம்",
    description: "தமிழ் மொழி, கலை மற்றும் பாரம்பரியத்தை வளர்க்கும் கல்லூரி தமிழ் மன்றம்.",
    images: [{ url: "/images/logo.jpg", width: 800, height: 800, alt: "மாதவம் சின்னம்" }],
    type: "website",
    locale: "ta_IN",
  },
  icons: {
    icon: "/images/logo.jpg",
    apple: "/images/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ta" className={`${balooThambi.variable} ${poppins.variable}`}>
      <body className="font-body bg-cream text-ink page-wrapper">
        <LanguageProvider>
          <SplashScreen />
          <FloatingTamilLetters />
          <Navbar />
          <main className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <ChatWidget />
        </LanguageProvider>
      </body>
    </html>
  );
}
