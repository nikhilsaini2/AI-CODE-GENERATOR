// components/LandingPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import HowItWorksSection from './HowItWorksSection';
import PricingSection from './PricingSection';
import TestimonialsSection from './TestimonialsSection';
import CTASection from './CTASection';
import FooterSection from './FooterSection';

const LandingPage = () => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate('/editor');
  };
  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <HeroSection onGetStarted={handleGetStarted} />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <TestimonialsSection />
      <CTASection onGetStarted={handleGetStarted} />
      <FooterSection />
    </div>
  );
};

export default LandingPage;
