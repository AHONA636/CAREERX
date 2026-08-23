import LandingNav from '../components/landing/LandingNav';
import Hero from '../components/landing/Hero';
import IntelligenceLoop from '../components/landing/IntelligenceLoop';
import Features from '../components/landing/Features';
import WhyDifferent from '../components/landing/WhyDifferent';
import FinalCTA from '../components/landing/FinalCTA';
import Footer from '../components/landing/Footer';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNav />
      <Hero />
      <IntelligenceLoop />
      <Features />
      <WhyDifferent />
      <FinalCTA />
      <Footer />
    </div>
  );
}
