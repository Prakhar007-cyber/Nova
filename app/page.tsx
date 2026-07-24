import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Bento from "@/components/landing/Bento";
import Showcase from "@/components/landing/Showcase";
import SocialProof from "@/components/landing/SocialProof";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <Features />
      <Bento />
      <Showcase />
      <SocialProof />
      <FinalCTA />
      <Footer />
    </main>
  );
}
