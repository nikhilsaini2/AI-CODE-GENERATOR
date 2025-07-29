// components/HowItWorksSection.js
import React from 'react';

const steps = [
  {
    number: "1", 
    title: "Describe your idea",
    icon: "💡",
    description: "Tell us what you want to build in simple words"
  },
  {
    number: "2",
    title: "Let AI generate the code", 
    icon: "🤖",
    description: "Our AI creates clean, professional code instantly"
  },
  {
    number: "3",
    title: "Export or deploy instantly",
    icon: "🚀", 
    description: "Download your code or deploy to the web with one click"
  }
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" style={{
      padding: '100px 40px',
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
          radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 20% 80%, rgba(22, 163, 74, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 60% 60%, rgba(5, 150, 105, 0.08) 0%, transparent 50%)
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
          How it Works
        </h2>
        
        <p style={{
          fontSize: '20px',
          color: 'rgba(255, 255, 255, 0.8)',
          marginBottom: '60px',
          maxWidth: '600px',
          margin: '0 auto 60px'
        }}>
          Get from idea to production-ready code in three simple steps
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '40px',
          alignItems: 'start'
        }}>
          {steps.map((step, index) => (
            <div key={index} style={{
              position: 'relative',
              padding: '40px 30px',
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 20px 50px rgba(16, 185, 129, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            }}>
              {/* Step Number */}
              <div style={{
                position: 'absolute',
                top: '-15px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #10b981 0%, #16a34a 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '18px',
                fontWeight: '700'
              }}>
                {step.number}
              </div>

              {/* Icon */}
              <div style={{
                fontSize: '48px',
                marginBottom: '20px',
                marginTop: '10px'
              }}>
                {step.icon}  
              </div>

              {/* Title */}
              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '15px'
              }}>
                {step.title}
              </h3>

              {/* Description */}
              <p style={{
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.7)',
                lineHeight: '1.6'
              }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
