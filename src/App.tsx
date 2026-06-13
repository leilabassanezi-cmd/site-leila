import { useEffect } from "react";
import { I18nProvider } from "@/lib/i18n";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { InquiryForm } from "@/components/InquiryForm";
import { Services } from "@/components/Services";
import { Atelier } from "@/components/Atelier";
import { Gallery } from "@/components/Gallery";
import { Testimonials } from "@/components/Testimonials";
import { TikTokFeed } from "@/components/TikTokFeed";
import { BookingCTA } from "@/components/BookingCTA";
import { Footer } from "@/components/Footer";
import { StickyBook } from "@/components/StickyBook";
import { trackViewContent } from "@/lib/tiktok";

export default function App() {
  useEffect(() => { trackViewContent(); }, []);
  return (
    <I18nProvider>
      <div className="dark min-h-screen bg-background text-foreground">
        <Navbar />
        <main>
          <Hero />
          <InquiryForm />
          <Services />
          <Atelier />
          <Gallery />
          <Testimonials />
          <TikTokFeed />
          <BookingCTA />
        </main>
        <Footer />
        <StickyBook />
      </div>
    </I18nProvider>
  );
}
