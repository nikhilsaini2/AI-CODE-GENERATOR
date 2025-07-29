// components/TestimonialsSection.js
import React from 'react';

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Senior Frontend Developer",
    company: "Google",
    avatar: "👩‍💻",
    review: "CodeMind built a complete dashboard in 3 minutes that would have taken me 2 weeks. The code quality rivals our senior engineers.",
    metric: "2 weeks → 3 min",
    rating: 5
  },
  {
    name: "Marcus Johnson", 
    role: "CEO & Founder",
    company: "TechStartup Inc.",
    avatar: "👨‍💼",
    review: "Launched our MVP in 4 days instead of 3 months. We secured $2M funding partly because we could iterate so quickly.",
    metric: "$2M funding raised",
    rating: 5
  },
  {
    name: "Elena Rodriguez",
    role: "Lead UI/UX Designer",
    company: "Creative Agency Pro", 
    avatar: "🎨",
    review: "CodeMind creates pixel-perfect implementations from wireframes. Clients are amazed when I deliver prototypes in hours.",
    metric: "98% client satisfaction",
    rating: 5
  },
  {
    name: "David Kim",
    role: "Full Stack Architect",
    company: "Enterprise Solutions",
    avatar: "⚡",
    review: "Clean architecture, proper commenting, optimized performance. The generated code is better than most developers produce.",
    metric: "300% productivity boost",
    rating: 5
  },
  {
    name: "Priya Patel",
    role: "Freelance Developer",
    company: "Independent",
    avatar: "🚀",
    review: "Tripled my income overnight. Now taking 5x more clients with delivery going from weeks to days.",
    metric: "5x more clients",
    rating: 5
  },
  {
    name: "James Wilson",
    role: "CTO",
    company: "Scale Digital",
    avatar: "💻",
    review: "Reduced development costs by 80% while improving delivery speed by 10x. ROI was positive within the first week.",
    metric: "80% cost reduction",
    rating: 5
  }
];

const TestimonialsSection = () => {
  return (
<section id="testimonials" style={{
      padding: '80px 20px',
      background: 'linear-gradient(135deg, var(--dark-bg-primary) 0%, var(--dark-bg-secondary) 50%, var(--dark-bg-tertiary) 100%)',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Effects */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(ellipse at 25% 20%, rgba(255, 107, 53, 0.08) 0%, transparent 60%),
          radial-gradient(ellipse at 75% 80%, rgba(247, 147, 30, 0.06) 0%, transparent 60%),
          radial-gradient(ellipse at 50% 50%, rgba(255, 107, 53, 0.04) 0%, transparent 70%)
        `,
        animation: 'float 20s ease-in-out infinite'
      }}></div>
          
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 30%, rgba(255, 107, 53, 0.15) 1px, transparent 1px),
          radial-gradient(circle at 80% 70%, rgba(247, 147, 30, 0.12) 1px, transparent 1px),
          radial-gradient(circle at 60% 20%, rgba(255, 107, 53, 0.10) 1px, transparent 1px)
        `,
        backgroundSize: '100px 100px, 150px 150px, 120px 120px',
        opacity: 0.3,
        animation: 'drift 25s linear infinite'
      }}></div>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <h2 style={{
          fontSize: 'clamp(32px, 4vw, 48px)',
          fontWeight: '800',
          fontFamily: 'var(--font-display)',
          background: 'linear-gradient(135deg, #10b981 0%, #22c55e 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textAlign: 'center',
          marginBottom: '16px',
          letterSpacing: '-0.02em',
        }}>Trusted by Innovators Worldwide</h2>
        
        <p style={{
          fontSize: 'clamp(16px, 1.5vw, 18px)',
          color: 'rgba(255, 255, 255, 0.7)',
          marginBottom: '60px',
          maxWidth: '500px',
          margin: '0 auto 60px',
          fontFamily: 'var(--font-body)',
          fontWeight: '400',
          lineHeight: '1.5'
        }}>
          Join thousands of developers building faster with AI
        </p>

        {/* Trust indicators row */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '30px',
          marginBottom: '50px',
          flexWrap: 'wrap'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: 'rgba(16, 185, 129, 0.1)',
            borderRadius: '50px',
            border: '1px solid rgba(16, 185, 129, 0.3)'
          }}>
            <span style={{ fontSize: '18px' }}>⭐</span>
            <span style={{ color: '#10b981', fontWeight: '600', fontSize: '14px' }}>4.9/5 Rating</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: 'rgba(34, 197, 94, 0.1)',
            borderRadius: '50px',
            border: '1px solid rgba(34, 197, 94, 0.3)'
          }}>
            <span style={{ fontSize: '18px' }}>👥</span>
            <span style={{ color: '#22c55e', fontWeight: '600', fontSize: '14px' }}>50K+ Developers</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: 'rgba(5, 150, 105, 0.1)',
            borderRadius: '50px',
            border: '1px solid rgba(5, 150, 105, 0.3)'
          }}>
            <span style={{ fontSize: '18px' }}>🚀</span>
            <span style={{ color: '#059669', fontWeight: '600', fontSize: '14px' }}>1M+ Projects</span>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '24px',
          maxWidth: '1200px',
          margin: '0 auto',
          '@media (min-width: 768px)': {
            gridTemplateColumns: 'repeat(3, 1fr)'
          }
        }}>
          {testimonials.map((testimonial, index) => (
            <div key={index} style={{
              padding: '24px',
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(12px)',
              borderRadius: '16px',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              textAlign: 'left',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '280px',
              maxHeight: '320px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(16, 185, 129, 0.25)';
              e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.4)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.2)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            }}>
              
              {/* Metric Badge */}
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                padding: '6px 12px',
                background: 'linear-gradient(135deg, #10b981 0%, #22c55e 100%)',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: '700',
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
              }}>
                {testimonial.metric}
              </div>

              {/* Quote Icon */}
              <div style={{
                fontSize: '32px',
                color: '#10b981',
                marginBottom: '16px',
                opacity: 0.8,
                lineHeight: '1'
              }}>
                "
              </div>

              {/* Review Text */}
              <p style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.9)',
                lineHeight: '1.5',
                marginBottom: '20px',
                fontFamily: 'var(--font-body)',
                fontWeight: '400',
                flex: 1,
                display: '-webkit-box',
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {testimonial.review}
              </p>

              {/* User Info */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                {/* Avatar */}
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #10b981 0%, #22c55e 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  boxShadow: '0 6px 20px rgba(16, 185, 129, 0.3)',
                  border: '2px solid rgba(16, 185, 129, 0.2)'
                }}>
                  {testimonial.avatar}
                </div>

                {/* Name and Role */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: '700',
                    fontFamily: 'var(--font-heading)',
                    color: '#ffffff',
                    fontSize: '15px',
                    marginBottom: '4px'
                  }}>
                    {testimonial.name}
                  </div>
                  <div style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '12px',
                    fontWeight: '500',
                    marginBottom: '2px'
                  }}>
                    {testimonial.role}
                  </div>
                  <div style={{
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '11px',
                    fontWeight: '500'
                  }}>
                    {testimonial.company}
                  </div>
                </div>

                {/* Star Rating */}
                <div style={{
                  color: '#fbbf24',
                  fontSize: '14px',
                  textAlign: 'right'
                }}>
                  ★★★★★
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
