// components/FeaturesSection.js
import React from 'react';
import './FeaturesSection.css';

const featureList = [
  {
    title: "Instant Code Generation",
    icon: "⚡",
    description: "Generate clean, production-ready code in seconds with AI-powered intelligence."
  },
  {
    title: "Export to React / HTML / Tailwind",
    icon: "🔄",
    description: "Seamlessly export your projects to React, Next.js, HTML/CSS, or Tailwind CSS."
  },
  {
    title: "Fully Responsive Layouts",
    icon: "📱",
    description: "Every generated layout is mobile-first and looks perfect on any device."
  },
  {
    title: "Developer & No-Code Friendly",
    icon: "👨‍💻",
    description: "Perfect for developers who want speed and creators who want simplicity."
  },
  {
    title: "Smart Component Library",
    icon: "🧩",
    description: "Access pre-built, customizable components that integrate seamlessly into your projects."
  },
  {
    title: "Real-time Collaboration",
    icon: "🤝",
    description: "Work together with your team in real-time with shared workspaces and live editing."
  }
];

const FeaturesSection = () => {
  return (
    <section
      id="features"
      style={{
        padding: '80px 40px',
        background: 'linear-gradient(135deg, var(--dark-bg-primary) 0%, var(--dark-bg-secondary) 50%, var(--dark-bg-tertiary) 100%)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Animated Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(22, 163, 74, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(5, 150, 105, 0.05) 0%, transparent 50%)
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
          Powerful Features
        </h2>
        
        <p style={{
          fontSize: '20px',
          color: 'rgba(255, 255, 255, 0.8)',
          marginBottom: '60px',
          maxWidth: '600px',
          margin: '0 auto 60px'
        }}>
          Everything you need to build professional websites with AI
        </p>

        <div className="features-grid">
          {featureList.map((feature, index) => (
            <div key={index} style={{
              padding: '40px 30px',
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center',
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
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}>
              {/* Icon */}
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #10b981 0%, #16a34a 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                margin: '0 auto 25px',
                boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)'
              }}>
                {feature.icon}
              </div>

              {/* Title */}
              <h3 style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '15px',
                lineHeight: '1.3'
              }}>
                {feature.title}
              </h3>

              {/* Description */}
              <p style={{
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.7)',
                lineHeight: '1.6',
                margin: 0
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

