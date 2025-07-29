// components/HeroSection.js
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, ArrowRight, Play, Zap, Code, Palette } from 'lucide-react';

const HeroSection = ({ onGetStarted }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const navBackground = useTransform(
    scrollY,
    [0, 100],
    ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.15)']
  );
  const navBlur = useTransform(scrollY, [0, 100], [20, 35]);
  
  // Scroll to section function
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 90; // Account for fixed navbar height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };
  
  useEffect(() => {
    // Always scroll to top on component mount/page load
    window.scrollTo(0, 0);
    
    setIsVisible(true);
    
    // Check initial scroll position on mount
    setIsScrolled(window.scrollY > 50);
    
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };
    
    // Use passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <motion.div 
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, var(--dark-bg-primary) 0%, var(--dark-bg-secondary) 50%, var(--dark-bg-tertiary) 100%)',
        color: '#ffffff',
        fontFamily: 'var(--font-body)',
        position: 'relative',
        overflow: 'hidden'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Animated Background Orbs */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0
      }}>
        <motion.div
          style={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)'
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          style={{
            position: 'absolute',
            top: '60%',
            right: '10%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(22, 163, 74, 0.12) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(50px)'
          }}
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Professional Stunning Navigation */}
      <motion.nav 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: isScrolled ? '16px 40px' : '20px 40px',
          background: isScrolled 
            ? 'rgba(10, 10, 15, 0.98)' 
            : 'rgba(10, 10, 15, 0.90)',
          backdropFilter: 'blur(60px)',
          WebkitBackdropFilter: 'blur(60px)',
          borderBottom: isScrolled 
            ? '1px solid rgba(255, 255, 255, 0.12)' 
            : '1px solid rgba(255, 255, 255, 0.06)',
          boxShadow: isScrolled 
            ? '0 8px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
            : '0 4px 24px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          zIndex: 1000,
          transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
          height: isScrolled ? '74px' : '84px'
        }}
        initial={{ y: -100, opacity: 0 }}
        animate={{ 
          y: 0, 
          opacity: 1
        }}
        transition={{ 
          duration: 0.8, 
          delay: 0.1,
          ease: [0.19, 1, 0.22, 1]
        }}
      >
        {/* Logo */}
        <motion.div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            fontSize: '24px',
            fontWeight: '700',
            fontFamily: 'var(--font-heading)',
            cursor: 'pointer'
          }}
          onClick={() => {
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <motion.div 
            style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #10b981 0%, #16a34a 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)'
            }}
            whileHover={{ rotate: 5, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <Sparkles size={20} />
          </motion.div>
          <span style={{
            color: '#ffffff'
          }}>CodeMind AI</span>
        </motion.div>

        {/* Navigation Links - Hidden on mobile */}
        <div style={{
          display: 'flex',
          gap: 'var(--space-6)',
          alignItems: 'center'
        }}>
          <div style={{
            display: 'flex',
            gap: 'var(--space-6)',
            alignItems: 'center'
          }}>
            {[
              { name: 'Features', id: 'features' },
              { name: 'How it Works', id: 'how-it-works' },
              { name: 'Pricing', id: 'pricing' },
              { name: 'Reviews', id: 'testimonials' }
            ].map((item, index) => (
              <motion.button 
                key={item.name} 
                onClick={() => scrollToSection(item.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '15px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  padding: 'var(--space-2) var(--space-3)',
                  borderRadius: '8px',
                  transition: 'all 0.3s var(--ease-smooth)'
                }}
                className="nav-link"
                whileHover={{ 
                  color: '#ffffff',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  scale: 1.02
                }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                {item.name}
              </motion.button>
            ))}
          </div>
          <motion.button 
            className="btn-magnetic btn-glow"
            style={{
              padding: 'var(--space-3) var(--space-6)',
              background: 'linear-gradient(135deg, #10b981 0%, #16a34a 100%)',
              border: 'none',
              borderRadius: '25px',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
            }}
            onClick={onGetStarted}
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 8px 25px rgba(16, 185, 129, 0.6)'
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            Get Started
          </motion.button>
        </div>
      </motion.nav>

      {/* Hero Content */}
      <motion.div 
        style={{
          position: 'relative',
          zIndex: 1
        }}
        y={y}
        opacity={opacity}
      >
        <div className="container" style={{
          padding: '120px 24px 80px',
          textAlign: 'center',
          marginTop: '0' // Remove marginTop since we're using padding
        }}>
          {/* Badge */}
          <motion.div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 20px',
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              borderRadius: '50px',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '24px',
              color: 'rgba(255, 255, 255, 0.9)',
              boxShadow: '0 4px 16px rgba(16, 185, 129, 0.1)'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Zap size={16} className="text-gradient" />
            <span>✨ AI-Powered Web Development</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            style={{
              fontSize: 'clamp(48px, 8vw, 96px)',
              fontWeight: '800',
              fontFamily: 'var(--font-heading)',
              margin: '0 0 var(--space-6)',
              lineHeight: '1.1',
              background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 50%, #e2e8f0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 40px rgba(255, 255, 255, 0.1)'
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Build Websites with
            <br />
            <span className="text-gradient animate-aurora" style={{
              background: 'linear-gradient(135deg, #10b981 0%, #16a34a 50%, #059669 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Pure Thought
            </span>
          </motion.h1>
          
          <motion.p 
            style={{
              fontSize: 'clamp(18px, 3vw, 24px)',
              maxWidth: '800px',
              margin: '0 auto 40px',
              lineHeight: '1.6',
              color: 'rgba(255, 255, 255, 0.8)',
              fontWeight: '400'
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Transform your ideas into stunning, production-ready websites using the power of AI.
            <br />From concept to deployment in minutes, not months.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div 
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 'var(--space-4)',
              flexWrap: 'wrap',
              marginBottom: 'var(--space-20)'
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.button 
              className="btn-magnetic btn-glow animate-glow"
              style={{
                padding: 'var(--space-5) var(--space-8)',
                background: 'linear-gradient(135deg, #10b981 0%, #16a34a 100%)',
                border: 'none',
                borderRadius: '16px',
                color: '#ffffff',
                fontSize: '18px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onClick={onGetStarted}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 12px 40px rgba(16, 185, 129, 0.6)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles size={20} />
              Start Building Now
              <ArrowRight size={18} />
            </motion.button>
            
            <motion.button 
              className="btn-magnetic btn-glow"
              style={{
                padding: 'var(--space-5) var(--space-8)',
                background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                border: 'none',
                borderRadius: '16px',
                color: '#ffffff',
                fontSize: '18px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                boxShadow: '0 8px 32px rgba(247, 147, 30, 0.4)',
                position: 'relative',
                overflow: 'hidden'
              }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 12px 40px rgba(247, 147, 30, 0.6)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Play size={18} />
              Watch Demo
            </motion.button>
          </motion.div>
          
          {/* Feature Icons */}
          <motion.div 
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 'var(--space-8)',
              flexWrap: 'wrap',
              marginBottom: 'var(--space-16)'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            {[
              { icon: Code, label: 'Clean Code' },
              { icon: Zap, label: 'Lightning Fast' },
              { icon: Palette, label: 'Beautiful Design' }
            ].map(({ icon: Icon, label }, index) => (
              <motion.div
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
              >
                <Icon size={16} className="text-gradient" />
                {label}
              </motion.div>
            ))}
          </motion.div>

          {/* Statistics */}
          <motion.div 
            className="grid grid-cols-3"
            style={{
              maxWidth: '600px',
              margin: '0 auto',
              gap: 'var(--space-8)'
            }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            {[
              { value: '50K+', label: 'Websites Created' },
              { value: '99.9%', label: 'Uptime' },
              { value: '4.9★', label: 'User Rating' }
            ].map(({ value, label }, index) => (
              <motion.div 
                key={label}
                className="card-modern"
                style={{
                  padding: 'var(--space-6)',
                  textAlign: 'center'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div style={{
                  fontSize: 'clamp(24px, 4vw, 32px)',
                  fontWeight: '800',
                  fontFamily: 'var(--font-heading)',
                  background: 'linear-gradient(135deg, #10b981 0%, #16a34a 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: 'var(--space-2)'
                }}>
                  {value}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: '500'
                }}>
                  {label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
      
      {/* Bottom Wave Separator */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '100px',
        background: 'linear-gradient(to top, var(--dark-bg-secondary), transparent)',
        zIndex: 2
      }} />
    </motion.div>
  );
};

export default HeroSection;

