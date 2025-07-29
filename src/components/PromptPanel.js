// components/PromptPanel.js - Professional Redesigned Version
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Send, History, Zap, Bot, Settings, Code, Star, 
  ChevronDown, ChevronRight, HelpCircle, Target, Brain,
  Wand2, Lightbulb, Rocket, Globe, Smartphone, Database,
  ShoppingCart, Users, BarChart3, Calendar, Mail, Lock,
  FileText, Layout, Palette, Search, Filter, Plus, Copy,
  ArrowRight, Clock, Bookmark, Trash2, Edit3
} from 'lucide-react';

const PromptPanel = React.memo(({ 
  prompt, 
  setPrompt, 
  onGenerate, 
  isLoading, 
  files, 
  activeFile, 
  setActiveFile,
  promptHistory,
  onSelectFromHistory 
}) => {
  // Core state
  const [showHistory, setShowHistory] = useState(false);
  const [charCount, setCharCount] = useState(prompt.length);
  const textareaRef = useRef(null);
  
  // New state for enhanced features
  const [aiMode, setAiMode] = useState('prompt'); // 'prompt' or 'chat'
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [contextMode, setContextMode] = useState('none'); // 'none', 'file', 'folder', 'selection'
  const [selectedCode, setSelectedCode] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [historyItems, setHistoryItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // AI Response Settings
  const [aiSettings, setAiSettings] = useState({
    framework: 'react',
    language: 'javascript',
    codeStyle: 'modern',
    includeComments: true,
    includeExplanations: true,
    complexityLevel: 'intermediate'
  });

  useEffect(() => {
    setCharCount(prompt.length);
  }, [prompt]);

  useEffect(() => {
    // Initialize history items with enhanced data
    const enhancedHistory = promptHistory.map((item, index) => ({
      id: index,
      text: item,
      timestamp: new Date(Date.now() - (promptHistory.length - index) * 60000),
      starred: false,
      label: '',
      context: 'none'
    }));
    setHistoryItems(enhancedHistory);
  }, [promptHistory]);

  const handleChatSubmit = useCallback(() => {
    if (!prompt.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      text: prompt,
      type: 'user',
      timestamp: new Date()
    };
    
    setChatHistory(prev => [...prev, newMessage]);
    
    // Simulate AI response (in real implementation, this would call your AI service)
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: "I understand your request. Let me help you create that code with the specified requirements.",
        type: 'ai',
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, aiResponse]);
    }, 1000);
    
    setPrompt('');
  }, [prompt, setPrompt]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      if (aiMode === 'chat') {
        handleChatSubmit();
      } else {
        onGenerate();
      }
    }
  }, [aiMode, handleChatSubmit, onGenerate]);

  const handleInputChange = useCallback((e) => {
    setPrompt(e.target.value);
    // Auto-adjust textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [setPrompt]);

  const promptTemplates = {
    'Web Development': [
      {
        title: 'Modern Landing Page',
        description: 'Create a responsive landing page with hero section',
        template: 'Create a modern, responsive landing page for [PRODUCT] with a hero section, features grid, testimonials, and call-to-action. Use [FRAMEWORK] and include smooth animations.'
      },
      {
        title: 'Dashboard Interface',
        description: 'Build an admin dashboard with charts and tables',
        template: 'Build a comprehensive admin dashboard with sidebar navigation, data visualization charts, tables, and user management. Style with [FRAMEWORK] and include responsive design.'
      },
      {
        title: 'E-commerce Product Page',
        description: 'Design a product detail page with cart functionality',
        template: 'Design an e-commerce product page with image gallery, product details, reviews, related products, and add-to-cart functionality using [FRAMEWORK].'
      }
    ],
    'Components': [
      {
        title: 'Custom Form Components',
        description: 'Reusable form components with validation',
        template: 'Create reusable form components including input fields, dropdowns, checkboxes, and validation logic using [FRAMEWORK]. Include error handling and custom styling.'
      },
      {
        title: 'Navigation Menu',
        description: 'Responsive navigation with dropdowns',
        template: 'Build a responsive navigation menu with dropdown submenus, mobile hamburger menu, and smooth transitions using [FRAMEWORK] and CSS animations.'
      }
    ],
    'API Integration': [
      {
        title: 'REST API Client',
        description: 'HTTP client with error handling',
        template: 'Create a REST API client with GET, POST, PUT, DELETE methods, error handling, loading states, and response caching using [FRAMEWORK].'
      },
      {
        title: 'Authentication System',
        description: 'Login/register with JWT tokens',
        template: 'Implement user authentication system with login, register, password reset, JWT token management, and protected routes using [FRAMEWORK].'
      }
    ]
  };

  const aiTips = [
    {
      icon: Target,
      title: 'Be Specific',
      description: 'Include exact requirements, styling preferences, and functionality details for better results.'
    },
    {
      icon: Layout,
      title: 'Mention Framework',
      description: 'Specify your preferred framework (React, Vue, Angular) and styling approach (CSS, Tailwind, styled-components).'
    },
    {
      icon: Code,
      title: 'Context Matters',
      description: 'Use file or folder context to generate code that fits your existing project structure.'
    },
    {
      icon: Brain,
      title: 'Iterative Refinement',
      description: 'Use chat mode to refine and improve generated code through conversation.'
    }
  ];

  return (
    <div style={{ 
      width: '100%', 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(145deg, rgba(12, 13, 16, 0.98) 0%, rgba(16, 17, 22, 0.95) 100%)',
      position: 'relative',
      overflow: 'hidden',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '12px',
      backdropFilter: 'blur(20px)'
    }}>
      {/* Dark Theme Header */}
      <div style={{
        padding: '24px 28px',
        background: 'rgba(255, 255, 255, 0.02)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'relative'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #10b981 0%, #16a34a 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)'
          }}>
            <Wand2 size={20} color="white" />
          </div>
          
          <div>
            <h1 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#ffffff',
              margin: 0
            }}>
              AI Code Generator
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="prompt-panel-main-content" style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        padding: '20px 24px',
        overflow: 'hidden'
      }}>
        
        {/* Quick Prompts */}
        <div className="quick-prompts-vertical" style={{ marginBottom: '24px' }}>
          <div className="quick-prompts-label" style={{
            fontSize: '14px',
            fontWeight: '600',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Zap size={14} color="#10b981" />
            Quick Start Templates
          </div>
          <div className="quick-prompts-list" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {promptTemplates['Web Development'].slice(0, 3).map((template, index) => (
              <motion.button
                key={index}
                className="quick-prompt-btn"
                style={{
                  padding: '14px 16px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left',
                  outline: 'none',
                }}
                onClick={() => setPrompt(template.template.replace('[FRAMEWORK]', 'React').replace('[PRODUCT]', 'your product'))}
                whileHover={{ 
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderColor: '#10b981',
                  transform: 'translateY(-1px)'
                }}
                whileTap={{ scale: 0.98 }}
              >
                {template.title}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Prompt Input */}
        <div className="prompt-area" style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          minHeight: 0
        }}>
          <div className="prompt-area-label" style={{
            fontSize: '14px',
            fontWeight: '600',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} color="#10b981" />
              Describe Your Project
            </span>
            <span style={{
              fontSize: '12px',
              color: charCount > 450 ? '#ef4444' : 'rgba(255, 255, 255, 0.5)',
              fontWeight: '500'
            }}>
              {charCount}/500
            </span>
          </div>

          <div style={{
            position: 'relative',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0
          }}>
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              placeholder="Create a modern landing page with hero section..."
              className="prompt-textarea"
              style={{
                flex: 1,
                minHeight: '120px',
                maxHeight: '180px',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '14px',
                fontWeight: '400',
                lineHeight: '1.5',
                resize: 'none',
                outline: 'none',
                transition: 'all 0.3s ease',
                fontFamily: 'inherit',
                marginBottom: '16px',
                backdropFilter: 'blur(10px)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#10b981';
                e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                e.target.style.boxShadow = '0 0 0 2px rgba(16, 185, 129, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                e.target.style.boxShadow = 'none';
              }}
            />

            {/* Generate Button */}
            <motion.button
              className="generate-btn"
              style={{
                width: '100%',
                background: isLoading 
                  ? 'linear-gradient(90deg, #6b7280 0%, #4b5563 100%)'
                  : 'linear-gradient(90deg, #10b981 0%, #16a34a 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                padding: '16px 0',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                marginTop: 0,
                opacity: isLoading ? 0.8 : 1,
                boxShadow: isLoading 
                  ? 'none' 
                  : '0 4px 20px rgba(16, 185, 129, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onClick={onGenerate}
              disabled={isLoading || !prompt.trim()}
              whileHover={!isLoading ? { 
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 32px rgba(16, 185, 129, 0.6)'
              } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
            >
              {isLoading ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '2px solid #ffffff',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Generating Code...
                </>
              ) : (
                <>
                  <Rocket size={16} />
                  Generate Code
                </>
              )}
            </motion.button>

            {/* Keyboard Shortcut Hint */}
            <div className="keyboard-hint" style={{
              marginTop: '8px',
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.5)',
              textAlign: 'center',
              fontWeight: '400'
            }}>
              Press ⌘+Enter to generate • React • JavaScript
            </div>
          </div>
        </div>

        {/* History Section */}
        {promptHistory.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '8px'
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: 'rgba(255, 255, 255, 0.9)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Clock size={14} color="#10b981" />
                Recent Prompts
              </div>
              <motion.button
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#10b981',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => setShowHistory(!showHistory)}
                whileHover={{ background: 'rgba(16, 185, 129, 0.1)' }}
              >
                {showHistory ? 'Hide' : 'Show'}
              </motion.button>
            </div>

            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    maxHeight: '200px',
                    overflowY: 'auto',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  {promptHistory.slice(-5).reverse().map((historyPrompt, index) => (
                    <motion.button
                      key={index}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'none',
                        border: 'none',
                        borderBottom: index < promptHistory.slice(-5).length - 1 
                          ? '1px solid rgba(255, 255, 255, 0.05)' 
                          : 'none',
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '13px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        lineHeight: '1.4',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '8px'
                      }}
                      onClick={() => onSelectFromHistory(historyPrompt)}
                      whileHover={{ 
                        background: 'rgba(16, 185, 129, 0.1)',
                        color: 'rgba(255, 255, 255, 0.95)'
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FileText size={12} style={{ marginTop: '2px', color: 'rgba(255, 255, 255, 0.5)' }} />
                      <span>
                        {historyPrompt.length > 80 
                          ? historyPrompt.substring(0, 80) + '...' 
                          : historyPrompt
                        }
                      </span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* CSS for spinner animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
});

export default PromptPanel;
