// components/Header.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Eye, EyeOff, Bot, BotOff, Play, Download, Upload, Code, Monitor } from 'lucide-react';

const Header = ({ 
  showPreview, 
  setShowPreview, 
  onRunProject, 
  onDownloadProject, 
  files, 
  showPublishPanel, 
  setShowPublishPanel,
  showPromptPanel,
  setShowPromptPanel
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
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
      {/* Left Section - Logo */}
      <motion.div 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          fontSize: '24px',
          fontWeight: '700',
          fontFamily: 'var(--font-heading)',
          cursor: 'pointer',
          flexShrink: 0
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
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{
            color: '#ffffff'
          }}>CodeMind AI</span>
          
          {/* Dynamic Status Indicator */}
          <motion.div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 8px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: '500',
              color: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)'
            }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {showPreview ? (
              <>
                <Monitor size={12} />
                Preview
              </>
            ) : (
              <>
                <Code size={12} />
                Code
              </>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Center Section - Main Navigation Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        justifyContent: 'center',
        flex: 1,
        maxWidth: '600px',
        margin: '0 40px'
      }}>
        {/* AI Panel Toggle */}
        <motion.button
          style={{
            padding: '10px 18px',
            background: showPromptPanel 
              ? 'linear-gradient(135deg, #9d4edd 0%, #7209b7 50%, #5a189a 100%)' 
              : 'linear-gradient(135deg, rgba(157, 78, 221, 0.15) 0%, rgba(114, 9, 183, 0.1) 100%)',
            border: showPromptPanel 
              ? '1px solid rgba(157, 78, 221, 0.4)' 
              : '1px solid rgba(157, 78, 221, 0.2)',
            borderRadius: '12px',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: showPromptPanel 
              ? '0 8px 32px rgba(157, 78, 221, 0.4), 0 0 0 1px rgba(157, 78, 221, 0.1)' 
              : '0 2px 8px rgba(157, 78, 221, 0.15)',
            minWidth: '120px',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)'
          }}
          onClick={() => setShowPromptPanel(!showPromptPanel)}
          whileHover={{ 
            scale: 1.02,
            boxShadow: showPromptPanel ? '0 6px 20px rgba(139, 92, 246, 0.4)' : '0 4px 12px rgba(255, 255, 255, 0.1)'
          }}
          whileTap={{ scale: 0.98 }}
          title="Toggle AI Panel (⌘P)"
        >
          {showPromptPanel ? <Bot size={16} /> : <BotOff size={16} />}
          AI Panel
        </motion.button>

        {/* Code/Preview Toggle Group */}
        <motion.div 
          style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.06)',
            borderRadius: '12px',
            padding: '4px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
            position: 'relative',
            overflow: 'hidden'
          }}
          layout
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30
          }}
        >
          {/* Animated Background Slider */}
          <motion.div
            style={{
              position: 'absolute',
              top: '4px',
              bottom: '4px',
              width: 'calc(50% - 4px)',
              background: showPreview 
                ? 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)' 
                : 'linear-gradient(135deg, #0066ff 0%, #004db3 50%, #003d8f 100%)',
              borderRadius: '8px',
              boxShadow: showPreview
                ? '0 8px 25px rgba(16, 185, 129, 0.4), 0 0 0 1px rgba(16, 185, 129, 0.2)'
                : '0 8px 25px rgba(0, 102, 255, 0.4), 0 0 0 1px rgba(0, 102, 255, 0.2)',
              zIndex: 1
            }}
            animate={{
              x: showPreview ? '100%' : '0%'
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 35,
              mass: 0.8
            }}
          />
          
          {/* Code Button */}
          <motion.button
            style={{
              padding: '12px 18px',
              background: 'transparent',
              border: 'none',
              borderRadius: '8px',
              color: !showPreview ? '#ffffff' : 'rgba(255, 255, 255, 0.8)',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              minWidth: '100px',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 2,
              transition: 'color 0.2s ease'
            }}
            onClick={() => setShowPreview(false)}
            whileHover={{ 
              scale: 1.05
            }}
            whileTap={{ 
              scale: 0.95
            }}
            animate={{
              color: !showPreview ? '#ffffff' : 'rgba(255, 255, 255, 0.8)'
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25
            }}
            title="Code Mode (⌘K)"
          >
            <motion.div
              animate={{
                rotate: !showPreview ? [0, -5, 0] : 0,
                scale: !showPreview ? [1, 1.1, 1] : 1
              }}
              transition={{
                duration: 0.3,
                ease: "easeOut"
              }}
            >
              <Code size={16} />
            </motion.div>
            Code
          </motion.button>

          {/* Preview Button */}
          <motion.button
            style={{
              padding: '12px 18px',
              background: 'transparent',
              border: 'none',
              borderRadius: '8px',
              color: showPreview ? '#ffffff' : 'rgba(255, 255, 255, 0.8)',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              minWidth: '100px',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 2,
              transition: 'color 0.2s ease'
            }}
            onClick={() => setShowPreview(true)}
            whileHover={{ 
              scale: 1.05
            }}
            whileTap={{ 
              scale: 0.95
            }}
            animate={{
              color: showPreview ? '#ffffff' : 'rgba(255, 255, 255, 0.8)'
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25
            }}
            title="Preview Mode (⌘K)"
          >
            <motion.div
              animate={{
                rotate: showPreview ? [0, 5, 0] : 0,
                scale: showPreview ? [1, 1.1, 1] : 1
              }}
              transition={{
                duration: 0.3,
                ease: "easeOut"
              }}
            >
              <Monitor size={16} />
            </motion.div>
            Preview
          </motion.button>
        </motion.div>
      </div>

      {/* Right Section - Action Buttons */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexShrink: 0
      }}>
        {/* Publish Button */}
        <motion.button
          style={{
            padding: '10px 16px',
            background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
            border: 'none',
            borderRadius: '10px',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 16px rgba(14, 165, 233, 0.3)',
            minWidth: '100px',
            justifyContent: 'center'
          }}
          onClick={() => setShowPublishPanel(true)}
          whileHover={{ 
            scale: 1.02,
            boxShadow: '0 6px 20px rgba(14, 165, 233, 0.4)'
          }}
          whileTap={{ scale: 0.98 }}
          title="Publish Project"
        >
          <Upload size={14} />
          Publish
        </motion.button>

        {/* Run Button */}
        <motion.button
          style={{
            padding: '10px 16px',
            background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
            border: 'none',
            borderRadius: '10px',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 16px rgba(249, 115, 22, 0.3)',
            minWidth: '80px',
            justifyContent: 'center'
          }}
          onClick={onRunProject}
          whileHover={{ 
            scale: 1.02,
            boxShadow: '0 6px 20px rgba(249, 115, 22, 0.4)'
          }}
          whileTap={{ scale: 0.98 }}
          title="Run Project"
        >
          <Play size={14} />
          Run
        </motion.button>

        {/* Download Button */}
        <motion.button
          style={{
            padding: '10px 16px',
            background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
            border: 'none',
            borderRadius: '10px',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 16px rgba(20, 184, 166, 0.3)',
            minWidth: '100px',
            justifyContent: 'center'
          }}
          onClick={onDownloadProject}
          whileHover={{ 
            scale: 1.02,
            boxShadow: '0 6px 20px rgba(20, 184, 166, 0.4)'
          }}
          whileTap={{ scale: 0.98 }}
          title="Download Project"
        >
          <Download size={14} />
          Download
        </motion.button>
      </div>
    </motion.nav>
  );
};

export default Header;
