import Contact from "./_components/Contact";
import Features from "./_components/Features";
import HeroSection from "./_components/HeroSection";
import Pricing from "./_components/Pricing";

export default async function Home() {
  return (
    <>
    <HeroSection />
    <Features />
    <Pricing />
    <Contact />
    </>
  );
}
