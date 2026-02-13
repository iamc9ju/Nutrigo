import Navbar from "@/component/Navbar";
import Hero from "@/component/Hero";

import KeyFeatures from "@/component/KeyFeatures";
import HowItWorks from "@/component/HowItWorks";
import Testimonials from "@/component/Testimonials";
import NutritionistList from "@/component/NutritionistList";
import FAQ from "@/component/FAQ";
import CallToAction from "@/component/CallToAction";
import Footer from "@/component/Footer";
import FadeInSection from "@/component/FadeInSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fefef9] to-[#f0f7e2]">
      <Navbar />
      <Hero />
      <FadeInSection>
        <NutritionistList />
      </FadeInSection>
      <FadeInSection>
        <CallToAction />
      </FadeInSection>
      <FadeInSection>
        <Testimonials />
      </FadeInSection>
      <FadeInSection>
        <FAQ />
      </FadeInSection>
      <Footer></Footer>
    </main>
  )
}