import Navbar from "@/component/Navbar";
import Hero from "@/component/Hero";
// import AppPreview from "@/component/AppPreview";  <-- ลบหรือ Comment บรรทัดนี้ออก
import KeyFeatures from "@/component/KeyFeatures";
import HowItWorks from "@/component/HowItWorks";
import Testimonials from "@/component/Testimonials";
import NutritionistList from "@/component/NutritionistList";
import FAQ from "@/component/FAQ";
import CallToAction from "@/component/CallToAction";
import Footer from "@/component/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-lime-50/50">
      <Navbar />
      <Hero />
      <NutritionistList />
      <CallToAction />
      <Testimonials />
      <FAQ />
      <Footer></Footer>
    </main>
  )
}