// components/PromptPanelRedesigned.js
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

const PromptPanelRedesigned = React.memo(({ 
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
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [charCount, setCharCount] = useState(prompt.length);
  const [selectedCategory, setSelectedCategory] = useState('Web Development');
  const [searchQuery, setSearchQuery] = useState('');
  const textareaRef = useRef(null);

  // Settings state
  const [settings, setSettings] = useState({
    framework: 'react',
    language: 'javascript',
    style: 'modern',
    comments: true,
    explanations: true
  });

  useEffect(() => {
    setCharCount(prompt.length);
  }, [prompt]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      onGenerate();
    }
  }, [onGenerate]);

  const handleInputChange = useCallback((e) => {
    setPrompt(e.target.value);
    // Auto-adjust textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [setPrompt]);

  const promptCategories = {
    'Web Development': {
      icon: Globe,
      templates: [
        {
          title: 'Modern Landing Page',
          description: 'Hero section, features, testimonials, CTA',
          template: 'Create a modern, responsive landing page for [PRODUCT] with a hero section featuring gradient backgrounds, feature cards with icons, customer testimonials carousel, and compelling call-to-action buttons. Use React with Tailwind CSS and include smooth scroll animations.',
          tags: ['Landing', 'Hero', 'Responsive']
        },
        {
          title: 'SaaS Dashboard',
          description: 'Analytics, charts, user management',
          template: 'Build a comprehensive SaaS dashboard with sidebar navigation, data visualization charts using Chart.js, user management tables, notification system, and responsive design. Include dark/light theme toggle and role-based access controls.',
          tags: ['Dashboard', 'Analytics', 'Admin']
        },
        {
          title: 'E-commerce Store',
          description: 'Product catalog, cart, checkout',
          template: 'Create a complete e-commerce storefront with product grid, search and filtering, shopping cart, checkout flow, user authentication, and payment integration. Include product reviews and wishlist functionality.',
          tags: ['E-commerce', 'Shopping', 'Payment']
        }
      ]
    },
    'Components': {
      icon: Layout,
      templates: [
        {
          title: 'Form Components',
          description: 'Input fields, validation, submission',
          template: 'Create a comprehensive form component library with custom input fields, dropdowns, checkboxes, radio buttons, file uploads, and real-time validation. Include error handling, success states, and accessibility features.',
          tags: ['Forms', 'Validation', 'UI']
        },
        {
          title: 'Navigation System',
          description: 'Header, sidebar, breadcrumbs',
          template: 'Build a complete navigation system with responsive header, collapsible sidebar, breadcrumb navigation, search functionality, and user profile dropdown. Include mobile hamburger menu and smooth transitions.',
          tags: ['Navigation', 'Menu', 'Mobile']
        },
        {
          title: 'Data Tables',
          description: 'Sorting, filtering, pagination',
          template: 'Create advanced data table components with sorting, filtering, pagination, row selection, bulk actions, and export functionality. Include responsive design and customizable column configurations.',
          tags: ['Tables', 'Data', 'Sorting']
        }
      ]
    },
    'Mobile': {
      icon: Smartphone,
      templates: [
        {
          title: 'Mobile App UI',
          description: 'Native-like interface components',
          template: 'Design mobile-first UI components including bottom navigation, swipe gestures, pull-to-refresh, infinite scroll, and modal sheets. Optimize for touch interactions and various screen sizes.',
          tags: ['Mobile', 'Touch', 'Gestures']
        },
        {
          title: 'Progressive Web App',
          description: 'PWA with offline capabilities',
          template: 'Build a Progressive Web App with service workers, offline functionality, push notifications, app shell architecture, and installable features. Include responsive design and fast loading.',
          tags: ['PWA', 'Offline', 'Mobile']
        }
      ]
    },
    'Backend': {
      icon: Database,
      templates: [
        {
          title: 'REST API',
          description: 'CRUD operations, authentication',
          template: 'Create a RESTful API with user authentication, CRUD operations, input validation, error handling, rate limiting, and API documentation. Include JWT tokens and role-based permissions.',
          tags: ['API', 'REST', 'Auth']
        },
        {
          title: 'Database Schema',
          description: 'Models, relationships, migrations',
          template: 'Design database schema with user models, relationships, indexes, and migrations. Include data validation, constraints, and optimization for common query patterns.',
          tags: ['Database', 'Schema', 'SQL']
        }
      ]
    }
  };

  const filteredTemplates = searchQuery 
    ? Object.values(promptCategories).flatMap(cat => 
        cat.templates.filter(template => 
          template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      )
    : promptCategories[selectedCategory]?.templates || [];

  return (
    <div style={{ 
      width: '100%', 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(180deg, #fafbfc 0%, #f5f7fa 100%)',
      position: 'relative',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)'
    }}>
      {/* Professional Header */}
      <div style={{
        padding: '24px 28px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.08) 0%, transparent 50%)
          `,
          pointerEvents: 'none'
        }} />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            position: 'relative',
            zIndex: 1
          }}
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              width: '48px',
              height: '48px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            <Wand2 size={20} color="white" />
          </motion.div>
          
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#ffffff',
                margin: 0,
                marginBottom: '2px',
                letterSpacing: '-0.3px'
              }}
            >
              AI Code Generator
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              style={{
                fontSize: '13px',
                color: 'rgba(255, 255, 255, 0.8)',
                margin: 0,
                fontWeight: '400'
              }}
            >
              Transform ideas into production-ready code
            </motion.p>
          </div>

          {/* Settings Button */}
          <motion.button
            style={{
              marginLeft: 'auto',
              padding: '8px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)'
            }}
            whileHover={{ background: 'rgba(255, 255, 255, 0.15)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings size={16} />
          </motion.button>
        </motion.div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
              padding: '16px 28px',
              overflow: 'hidden'
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '500', color: '#64748b', marginBottom: '4px', display: 'block' }}>
                  Framework
                </label>
                <select
                  value={settings.framework}
                  onChange={(e) => setSettings({...settings, framework: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '12px',
                    background: 'white'
                  }}
                >
                  <option value="react">React</option>
                  <option value="vue">Vue</option>
                  <option value="angular">Angular</option>
                  <option value="svelte">Svelte</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '500', color: '#64748b', marginBottom: '4px', display: 'block' }}>
                  Language
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({...settings, language: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '12px',
                    background: 'white'
                  }}
                >
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        padding: '24px 28px',
        overflow: 'hidden'
      }}>
        
        {/* Template Browser */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px'
          }}>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Lightbulb size={14} color="#667eea" />
              Quick Start Templates
            </div>
            <motion.button
              style={{
                background: 'none',
                border: 'none',
                color: '#667eea',
                fontSize: '12px',
                fontWeight: '500',
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              onClick={() => setShowTemplates(!showTemplates)}
              whileHover={{ background: 'rgba(102, 126, 234, 0.1)' }}
            >
              {showTemplates ? 'Hide' : 'Browse All'}
              <ChevronDown 
                size={12} 
                style={{ 
                  transform: showTemplates ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s'
                }} 
              />
            </motion.button>
          </div>

          {/* Quick Templates Preview */}
          {!showTemplates && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '8px'
            }}>
              {promptCategories['Web Development'].templates.slice(0, 3).map((template, index) => (
                <motion.button
                  key={index}
                  style={{
                    padding: '12px',
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                  }}
                  onClick={() => setPrompt(template.template)}
                  whileHover={{ 
                    borderColor: '#667eea',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                    transform: 'translateY(-1px)'
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '4px'
                  }}>
                    {template.title}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: '#6b7280',
                    lineHeight: '1.3'
                  }}>
                    {template.description}
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '4px',
                    marginTop: '6px'
                  }}>
                    {template.tags.slice(0, 2).map((tag, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '9px',
                          padding: '2px 6px',
                          background: '#f3f4f6',
                          color: '#6b7280',
                          borderRadius: '4px',
                          fontWeight: '500'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.button>
              ))}
            </div>
          )}

          {/* Full Template Browser */}
          <AnimatePresence>
            {showTemplates && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  marginTop: '8px'
                }}
              >
                {/* Search and Categories */}
                <div style={{ padding: '16px', borderBottom: '1px solid #f3f4f6' }}>
                  <div style={{ position: 'relative', marginBottom: '12px' }}>
                    <Search size={14} style={{ position: 'absolute', left: '10px', top: '8px', color: '#9ca3af' }} />
                    <input
                      type="text"
                      placeholder="Search templates..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '6px 12px 6px 32px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '12px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  {!searchQuery && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {Object.entries(promptCategories).map(([category, data]) => {
                        const IconComponent = data.icon;
                        return (
                          <motion.button
                            key={category}
                            style={{
                              padding: '6px 12px',
                              background: selectedCategory === category ? '#667eea' : '#f8fafc',
                              color: selectedCategory === category ? 'white' : '#374151',
                              border: '1px solid',
                              borderColor: selectedCategory === category ? '#667eea' : '#e5e7eb',
                              borderRadius: '20px',
                              fontSize: '11px',
                              fontWeight: '500',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            onClick={() => setSelectedCategory(category)}
                            whileHover={{ transform: 'translateY(-1px)' }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <IconComponent size={10} />
                            {category}
                          </motion.button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Templates Grid */}
                <div style={{
                  padding: '16px',
                  maxHeight: '300px',
                  overflowY: 'auto'
                }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '12px'
                  }}>
                    {filteredTemplates.map((template, index) => (
                      <motion.button
                        key={index}
                        style={{
                          padding: '16px',
                          background: '#fafbfc',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.2s'
                        }}
                        onClick={() => {
                          setPrompt(template.template);
                          setShowTemplates(false);
                        }}
                        whileHover={{ 
                          borderColor: '#667eea',
                          background: 'white',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#374151',
                          marginBottom: '6px'
                        }}>
                          {template.title}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#6b7280',
                          lineHeight: '1.4',
                          marginBottom: '8px'
                        }}>
                          {template.description}
                        </div>
                        <div style={{
                          display: 'flex',
                          gap: '4px',
                          flexWrap: 'wrap'
                        }}>
                          {template.tags.map((tag, i) => (
                            <span
                              key={i}
                              style={{
                                fontSize: '10px',
                                padding: '2px 6px',
                                background: '#e0e7ff',
                                color: '#5b21b6',
                                borderRadius: '4px',
                                fontWeight: '500'
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Prompt Input Area */}
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          minHeight: 0
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '8px'
          }}>
            <label style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Sparkles size={14} color="#667eea" />
              Describe Your Project
            </label>
            <span style={{
              fontSize: '12px',
              color: charCount > 450 ? '#ef4444' : '#9ca3af',
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
              placeholder="Create a modern dashboard for a SaaS application with user analytics, charts, and responsive design. Include dark mode toggle and mobile optimization..."
              style={{
                flex: 1,
                minHeight: '120px',
                maxHeight: '180px',
                padding: '16px',
                background: 'white',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                color: '#374151',
                fontSize: '14px',
                fontWeight: '400',
                lineHeight: '1.5',
                resize: 'none',
                outline: 'none',
                transition: 'all 0.3s ease',
                fontFamily: 'inherit',
                marginBottom: '16px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1), 0 1px 3px rgba(0, 0, 0, 0.05)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
              }}
            />

            {/* Generate Button */}
            <motion.button
              style={{
                width: '100%',
                background: isLoading 
                  ? 'linear-gradient(90deg, #9ca3af 0%, #6b7280 100%)'
                  : 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
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
                  : '0 4px 16px rgba(102, 126, 234, 0.3), 0 1px 3px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onClick={onGenerate}
              disabled={isLoading || !prompt.trim()}
              whileHover={!isLoading ? { 
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4), 0 1px 3px rgba(0, 0, 0, 0.1)'
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
            <div style={{
              marginTop: '8px',
              fontSize: '12px',
              color: '#9ca3af',
              textAlign: 'center',
              fontWeight: '400'
            }}>
              Press ⌘+Enter to generate • {settings.framework} • {settings.language}
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
                color: '#374151',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Clock size={14} color="#667eea" />
                Recent Prompts
              </div>
              <motion.button
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#667eea',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => setShowHistory(!showHistory)}
                whileHover={{ background: 'rgba(102, 126, 234, 0.1)' }}
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
                    background: 'white',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
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
                          ? '1px solid #f3f4f6' 
                          : 'none',
                        color: '#374151',
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
                        background: '#f8fafc',
                        color: '#667eea'
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FileText size={12} style={{ marginTop: '2px', color: '#9ca3af' }} />
                      <span>
                        {historyPrompt.length > 80 
                          ? historyPrompt.substring(0, 80) + '...' 
                          : historyPrompt
                        }
                      </span>
                    </motion.button>
                  ))}
                </div>
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

export default PromptPanelRedesigned;
