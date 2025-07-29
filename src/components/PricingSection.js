// components/PricingSection.js
import React from 'react';
import { motion } from 'framer-motion';

const plans = [
  {
    name: "Free Tier",
    price: "$0",
    period: "/month",
    popular: false,
    features: [
      "Basic usage",
      "Limited generation (10/day)",
      "HTML/CSS export",
      "Community support"
    ]
  },
  {
    name: "Pro Plan",
    price: "$29",
    originalPrice: "$49",
    period: "/month",
    popular: true,
    badge: "🔥 MOST POPULAR",
    savings: "Save 40%",
    urgency: "Limited Time Offer",
    guarantee: "30-Day Money Back Guarantee",
    testimonial: "Saved me 20+ hours per week!",
    features: [
      "Unlimited generation",
      "Export to React/Next.js",
      "Tailwind CSS support",
      "Priority support",
      "Advanced templates"
    ]
  },
  {
    name: "Enterprise Plan",
    price: "$99",
    period: "/month",
    popular: false,
    features: [
      "Team access (up to 10 users)",
      "API access",
      "Custom integrations",
      "White-label solution",
      "Dedicated support"
    ]
  }
];

const PricingSection = () => {
  return (
    <section id="pricing" style={{
      padding: '80px 20px',
      background: 'linear-gradient(135deg, var(--dark-bg-primary) 0%, var(--dark-bg-secondary) 50%, var(--dark-bg-tertiary) 100%)',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 30% 30%, rgba(16, 185, 129, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 70% 70%, rgba(5, 150, 105, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 50% 90%, rgba(6, 182, 212, 0.05) 0%, transparent 50%)
        `
      }}></div>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <h2 style={{
          fontSize: 'clamp(32px, 4vw, 48px)',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '20px'
        }}>
          Choose Your Plan
        </h2>
        
        <p style={{
          fontSize: '20px',
          color: 'rgba(255, 255, 255, 0.8)',
          marginBottom: '60px',
          maxWidth: '600px',
          margin: '0 auto 60px'
        }}>
          Start free, scale as you grow
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          alignItems: 'stretch'
        }}>
          {plans.map((plan, index) => (
            <div key={index} style={{
              position: 'relative',
              padding: '40px 30px',
              background: plan.popular ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: plan.popular ? '2px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: plan.popular ? '0 20px 50px rgba(16, 185, 129, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.3)',
              transform: plan.popular ? 'scale(1.03)' : 'scale(1)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => {
              if (!plan.popular) {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (!plan.popular) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
              }
            }}>
              {/* Enhanced Popular Badge */}
              {plan.popular && (
                <>
                  <div style={{
                    position: 'absolute',
                    top: '-15px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                    color: 'white',
                    padding: '8px 24px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '700',
                    boxShadow: '0 4px 20px rgba(247, 147, 30, 0.3), 0 0 0 1px rgba(247, 147, 30, 0.1)',
                    animation: 'pulse 2s infinite'
                  }}>
                    {plan.badge || 'Most Popular'}
                  </div>
                  
                </>
              )}

              {/* Plan Name */}
              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '10px'
              }}>
                {plan.name}
              </h3>

              {/* Price */}
              <div style={{ marginBottom: '30px' }}>
                <span style={{
                  fontSize: '48px',
                  fontWeight: '800',
                  background: plan.popular 
                    ? 'linear-gradient(135deg, #10b981 0%, #16a34a 50%, #059669 100%)'
                    : 'linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: plan.popular ? '0 0 20px rgba(16, 185, 129, 0.5)' : 'none',
                  filter: plan.popular ? 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.3))' : 'none'
                }}>
                  {plan.price}
                </span>
                <span style={{
                  fontSize: '18px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: '500'
                }}>
                  {plan.period}
                </span>
              </div>

              {/* Features */}
              <ul style={{
                listStyle: 'none',
                padding: 0,
                marginBottom: '40px'
              }}>
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} style={{
                    padding: '12px 0',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <span style={{ color: '#10b981', fontSize: '18px' }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <motion.button 
                className={plan.popular ? "btn-magnetic btn-glow animate-glow" : "btn-magnetic"}
                style={{
                  width: '100%',
                  padding: 'var(--space-5) var(--space-8)',
                  background: plan.popular 
                    ? 'linear-gradient(135deg, #10b981 0%, #16a34a 100%)'
                    : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                  border: 'none',
                  borderRadius: '16px',
                  color: '#ffffff',
                  fontSize: '18px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--space-2)',
                  boxShadow: plan.popular 
                    ? '0 8px 32px rgba(16, 185, 129, 0.4)'
                    : '0 4px 15px rgba(0, 0, 0, 0.2)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                whileHover={plan.popular ? { 
                  scale: 1.05,
                  boxShadow: '0 12px 40px rgba(16, 185, 129, 0.6)'
                } : {
                  scale: 1.02,
                  boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
