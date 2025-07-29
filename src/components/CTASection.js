// components/CTASection.js
import React from 'react';

const CTASection = ({ onGetStarted }) => {
  return (
    <section style={{
      padding: '80px 40px',
      background: 'linear-gradient(135deg, var(--dark-bg-primary) 0%, var(--dark-bg-secondary) 50%, var(--dark-bg-tertiary) 100%)',
      textAlign: 'center',
      color: '#ffffff'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{
          fontSize: 'clamp(36px, 5vw, 56px)',
          fontWeight: '800',
          marginBottom: '20px',
          background: 'linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Build Smarter. Ship Faster.
        </h2>
        
        <p style={{
          fontSize: '22px',
          color: 'rgba(255, 255, 255, 0.8)',
          marginBottom: '50px',
          lineHeight: '1.6'
        }}>
          Join thousands of devs who trust CodeMind AI for blazing-fast development.
        </p>

        <button style={{
          padding: '20px 40px',
          background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
          border: 'none',
          borderRadius: '15px',
          color: '#ffffff',
          fontSize: '20px',
          fontWeight: '700',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 8px 25px rgba(247, 147, 30, 0.4)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px'
        }}
        onClick={onGetStarted}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-3px)';
e.target.style.boxShadow = '0 12px 35px rgba(247, 147, 30, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
e.target.style.boxShadow = '0 8px 25px rgba(247, 147, 30, 0.4)';
        }}>
          Start Generating Code
          <span style={{ fontSize: '18px' }}>🚀</span>
        </button>

        {/* Trust Indicators */}
        <div style={{
          marginTop: '80px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '60px',
          flexWrap: 'wrap'
        }}>
          <div style={{ 
            textAlign: 'center',
            padding: '20px 30px',
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ 
              fontSize: '32px', 
              fontWeight: '800', 
              fontFamily: 'var(--font-heading)',
              marginBottom: '8px',
              background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>50K+</div>
            <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)', fontWeight: '500' }}>Happy Developers</div>
          </div>
          <div style={{ 
            textAlign: 'center',
            padding: '20px 30px',
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ 
              fontSize: '32px', 
              fontWeight: '800', 
              fontFamily: 'var(--font-heading)',
              marginBottom: '8px',
              background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>4.9★</div>
            <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)', fontWeight: '500' }}>Average Rating</div>
          </div>
          <div style={{ 
            textAlign: 'center',
            padding: '20px 30px',
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ 
              fontSize: '32px', 
              fontWeight: '800', 
              fontFamily: 'var(--font-heading)',
              marginBottom: '8px',
              background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>1M+</div>
            <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)', fontWeight: '500' }}>Websites Created</div>
          </div>
        </div>

        {/* Additional Trust Elements */}
        <div style={{
          marginTop: '50px',
          padding: '25px 35px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '20px',
            flexWrap: 'wrap',
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.8)',
            fontWeight: '500'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#10b981' }}>✓</span> No Credit Card Required
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#10b981' }}>✓</span> Free Forever Plan
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#10b981' }}>✓</span> Cancel Anytime
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
