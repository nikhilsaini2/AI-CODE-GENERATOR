// components/FooterSection.js
import React, { useState } from 'react';

const FooterSection = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter signup
    alert('Thanks for subscribing!');
    setEmail('');
  };

  return (
    <footer style={{
      background: 'var(--dark-bg-primary)',
      color: '#ffffff',
      padding: '80px 40px 40px',
      borderTop: '1px solid rgba(255,255,255,0.1)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Main Footer Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          marginBottom: '50px'
        }}>
          {/* Company Info */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px',
              fontSize: '24px',
              fontWeight: '700'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(135deg, #10b981 0%, #16a34a 100%)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px'
              }}>
                🚀
              </div>
              CodeMind AI
            </div>
            <p style={{
              color: 'rgba(255,255,255,0.7)',
              lineHeight: '1.6',
              marginBottom: '20px'
            }}>
              AI-powered web development made simple. Create professional websites with just a description.
            </p>
            
            {/* Social Icons */}
            <div style={{
              display: 'flex',
              gap: '15px'
            }}>
              {['🔗', '🐙', '✖️'].map((icon, index) => (
                <button key={index} style={{
                  width: '40px',
                  height: '40px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #10b981 0%, #16a34a 100%)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.1)';
                  e.target.style.transform = 'translateY(0)';
                }}>
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 style={{
              fontSize: '18px',
              fontWeight: '700',
              marginBottom: '20px',
              color: '#ffffff'
            }}>
              Product
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              {['Features', 'Pricing', 'Documentation', 'API Reference'].map((item) => (
                <li key={item} style={{ marginBottom: '12px' }}>
                  <button style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'color 0.3s ease',
                    padding: 0,
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                  onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.7)'}>
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 style={{
              fontSize: '18px',
              fontWeight: '700',
              marginBottom: '20px',
              color: '#ffffff'
            }}>
              Company
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              {['About', 'Careers', 'Blog', 'Contact'].map((item) => (
                <li key={item} style={{ marginBottom: '12px' }}>
                  <a href="#" style={{
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    fontSize: '16px',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#ffffff'}
                  onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.7)'}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{
              fontSize: '18px',
              fontWeight: '700',
              marginBottom: '20px',
              color: '#ffffff'
            }}>
              Stay Updated
            </h4>
            <p style={{
              color: 'rgba(255,255,255,0.7)',
              marginBottom: '20px',
              fontSize: '16px'
            }}>
              Stay updated with the latest in AI & Web Dev
            </p>
            
            <form onSubmit={handleNewsletterSubmit} style={{
              display: 'flex',
              gap: '10px',
              flexDirection: 'column'
            }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  fontSize: '16px',
                  outline: 'none'
                }}
              />
              <button type="submit" style={{
                padding: '12px 20px',
                background: 'linear-gradient(135deg, #10b981 0%, #16a34a 100%)',
                border: 'none',
                borderRadius: '10px',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}>
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: '14px'
          }}>
            © 2025 CodeMind AI. All rights reserved.
          </div>
          
          <div style={{
            display: 'flex',
            gap: '30px'
          }}>
            {['Terms of Service', 'Privacy Policy'].map((item) => (
              <a key={item} href="#" style={{
                color: 'rgba(255,255,255,0.6)',
                textDecoration: 'none',
                fontSize: '14px',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = '#ffffff'}
              onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.6)'}>
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
