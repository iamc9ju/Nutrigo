import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Testimonials from '@/components/Testimonials';
import NutritionistList from '@/components/NutritionistList';
import FAQ from '@/components/FAQ';
import CallToAction from '@/components/CallToAction';
import Footer from '@/components/Footer';
import FadeInSection from '@/components/FadeInSection';

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
  );
}
