// backend/server.js
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');
const FormData = require('form-data');
const JSZip = require('jszip');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware - Updated CORS for production
app.use(cors({
  origin: [
    'http://localhost:3000', // Development
    'https://ai-code-editor-generator.vercel.app', // Your Vercel deployment
    'https://ai-code-editor-generator-git-main-shivammourya10s-projects.vercel.app', // Your specific deployment
    'https://ai-code-editor-generator-nvnhf2qoh-shivammourya10s-projects.vercel.app', // Another deployment URL
    /https:\/\/.*\.vercel\.app$/, // Allow all Vercel preview deployments
    /https:\/\/ai-code-editor-generator-.*\.vercel\.app$/ // Allow all your Vercel branches
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI
let genAI;
try {
  genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);
} catch (err) {
  console.error("Failed to initialize AI:", err);
  process.exit(1); // Exit if API key is invalid
}

// Netlify API endpoints
const NETLIFY_API_BASE = 'https://api.netlify.com/api/v1';

// Validate and fix file structure for deployment
const validateAndFixFiles = (files) => {
  const validatedFiles = { ...files };
  
  // Ensure we have index.html
  if (!validatedFiles['index.html'] || !validatedFiles['index.html'].trim()) {
    validatedFiles['index.html'] = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Generated Project</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Welcome</h1>
        <p>This is an AI-generated web application.</p>
    </div>
    <script src="script.js"></script>
</body>
</html>`;
  }
  
  // Ensure we have styles.css
  if (!validatedFiles['styles.css'] || !validatedFiles['styles.css'].trim()) {
    validatedFiles['styles.css'] = `body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
}
.container {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}
h1 {
    color: #333;
    text-align: center;
}`;
  }
  
  // Ensure we have script.js
  if (!validatedFiles['script.js'] || !validatedFiles['script.js'].trim()) {
    validatedFiles['script.js'] = `console.log('AI Generated Project loaded successfully');
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page is ready!');
});`;
  }
  
  // Ensure HTML links to external files
  let html = validatedFiles['index.html'];
  if (!html.includes('href="styles.css"')) {
    html = html.replace('</head>', '    <link rel="stylesheet" href="styles.css">\n</head>');
  }
  if (!html.includes('src="script.js"')) {
    html = html.replace('</body>', '    <script src="script.js"></script>\n</body>');
  }
  validatedFiles['index.html'] = html;
  
  console.log('File validation completed. Files:', Object.keys(validatedFiles));
  return validatedFiles;
};

// Publishing endpoints
app.post('/api/publish/netlify', async (req, res) => {
  try {
    const { files, projectName, apiToken } = req.body;
    
    // Use provided token or fall back to environment variable
    const netlifyToken = apiToken || process.env.NETLIFY_API_TOKEN;
    
    if (!netlifyToken) {
      return res.status(400).json({ error: 'Netlify API token is required' });
    }
    
    if (!files || Object.keys(files).length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }

    // Ensure we have an index.html file
    if (!files['index.html']) {
      return res.status(400).json({ error: 'index.html is required for Netlify deployment' });
    }

    console.log(`Deploying to Netlify with files: ${Object.keys(files).join(', ')}`);
    console.log('API token length:', netlifyToken ? netlifyToken.length : 'undefined');

    // Create a zip file with all the files
    const zip = new JSZip();
    for (const [filename, content] of Object.entries(files)) {
      zip.file(filename, content);
    }
    
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
    console.log('Zip buffer created, size:', zipBuffer.length, 'bytes');
    
    // Create a unique site name
    const siteName = `${projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-')}-${Date.now()}`;

    // Create a site first, then deploy to it
    console.log('Making request to Netlify API...');
    const createSiteResponse = await axios.post(
      `${NETLIFY_API_BASE}/sites`,
      {
        name: projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-') + '-' + Date.now()
      },
      {
        headers: {
          'Authorization': `Bearer ${netlifyToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const site = createSiteResponse.data;
    console.log('Created Netlify site:', site.id);

    // Now deploy the zip to the site
    const deployResponse = await axios.post(
      `${NETLIFY_API_BASE}/sites/${site.id}/deploys`,
      zipBuffer,
      {
        headers: {
          'Authorization': `Bearer ${netlifyToken}`,
          'Content-Type': 'application/zip',
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    );

    const deployment = deployResponse.data;
    console.log('Deployed to site:', deployment.id, 'URL:', site.ssl_url || site.url);

    // Return immediately with the deployment info - don't wait for build completion
    const result = {
      id: site.id,
      name: projectName,
      url: site.ssl_url || site.url,
      adminUrl: site.admin_url,
      service: 'netlify',
      timestamp: new Date().toISOString(),
      status: 'published',
      files: Object.keys(files)
    };

    console.log('Netlify deployment completed:', result.url);
    res.json(result);
  } catch (error) {
    console.error('Netlify publish error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    res.status(500).json({ 
      error: `Failed to publish to Netlify: ${error.response?.data?.message || error.message}` 
    });
  }
});

// GitHub Pages publishing endpoint
app.post('/api/publish/github', async (req, res) => {
  try {
    const { files, projectName, token, username } = req.body;
    
    if (!token || !username) {
      return res.status(400).json({ error: 'GitHub token and username are required' });
    }
    
    if (!files || Object.keys(files).length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }

    const repoName = `${projectName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    
    // Create repository
    const createRepoResponse = await axios.post(
      'https://api.github.com/user/repos',
      {
        name: repoName,
        description: `AI Generated Web Project: ${projectName}`,
        public: true,
        auto_init: true
      },
      {
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json',
        }
      }
    );
    
    const repo = createRepoResponse.data;
    
    // Upload files
    for (const [filename, content] of Object.entries(files)) {
      await axios.put(
        `https://api.github.com/repos/${username}/${repoName}/contents/${filename}`,
        {
          message: `Add ${filename}`,
          content: Buffer.from(content).toString('base64'),
          branch: 'main'
        },
        {
          headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );
    }
    
    // Enable GitHub Pages
    try {
      await axios.post(
        `https://api.github.com/repos/${username}/${repoName}/pages`,
        {
          source: {
            branch: 'main',
            path: '/'
          }
        },
        {
          headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );
    } catch (pagesError) {
      console.warn('Pages might already be enabled or repo is too new');
    }

    const result = {
      id: repo.id,
      name: projectName,
      url: `https://${username}.github.io/${repoName}`,
      githubUrl: repo.html_url,
      service: 'github-pages',
      timestamp: new Date().toISOString(),
      status: 'published',
      files: Object.keys(files)
    };

    res.json(result);
  } catch (error) {
    console.error('GitHub publish error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: `Failed to publish to GitHub Pages: ${error.response?.data?.message || error.message}` 
    });
  }
});

// --- Enhanced Prompt Enhancement System ---
function enhancePromptIfNeeded(userPrompt) {
  if (!userPrompt || userPrompt.trim().length === 0) {
    return userPrompt;
  }

  const prompt = userPrompt.toLowerCase().trim();
  
  // Detect project type and apply specific enhancements
  if (isGameProject(prompt)) {
    return enhanceGamePrompt(userPrompt, prompt);
  } else if (isLandingPageProject(prompt)) {
    return enhanceLandingPagePrompt(userPrompt, prompt);
  } else if (isWebAppProject(prompt)) {
    return enhanceWebAppPrompt(userPrompt, prompt);
  } else if (isDashboardProject(prompt)) {
    return enhanceDashboardPrompt(userPrompt, prompt);
  } else if (isPortfolioProject(prompt)) {
    return enhancePortfolioPrompt(userPrompt, prompt);
  } else {
    // Default enhancement for any project
    return enhanceGenericPrompt(userPrompt, prompt);
  }
}

// Project type detection functions
function isGameProject(prompt) {
  const gameKeywords = [
    'game', 'tic tac toe', 'tictactoe', 'puzzle', 'snake', 'tetris', 'memory', 'quiz', 'trivia', 'arcade',
    'card game', 'chess', 'checkers', 'pong', 'breakout', 'match', 'word game', 'crossword', 'sudoku',
    'slots', 'dice', 'casino', 'bingo', 'rock paper scissors', 'hangman', 'connect four', 'battleship',
    'simon says', 'whack a mole', 'pac man', 'space invaders', 'frogger', 'asteroids', 'centipede',
    'pinball', 'solitaire', 'blackjack', 'poker', 'roulette', 'slot machine', 'scratch card',
    'racing', 'shooting', 'platformer', 'rpg', 'adventure', 'strategy', 'simulation', 'sports',
    'fighting', 'puzzle game', 'action game', 'board game', 'multiplayer', 'single player',
    'mobile game', 'web game', 'browser game', 'casual game', 'indie game', 'retro game',
    'classic game', 'mini game', '2d game', '3d game', 'pixel art game', 'neon game'
  ];
  return gameKeywords.some(keyword => prompt.includes(keyword));
}

function isLandingPageProject(prompt) {
  const landingKeywords = ['landing page', 'homepage', 'marketing page', 'product page', 'sales page', 'coming soon', 'launch page', 'business page', 'service page', 'company page'];
  return landingKeywords.some(keyword => prompt.includes(keyword));
}

function isWebAppProject(prompt) {
  const appKeywords = ['app', 'application', 'tool', 'calculator', 'converter', 'tracker', 'manager', 'editor', 'generator', 'builder', 'creator', 'planner', 'organizer', 'scheduler'];
  return appKeywords.some(keyword => prompt.includes(keyword));
}

function isDashboardProject(prompt) {
  const dashboardKeywords = ['dashboard', 'admin', 'analytics', 'stats', 'metrics', 'charts', 'graphs', 'data visualization', 'control panel', 'monitoring'];
  return dashboardKeywords.some(keyword => prompt.includes(keyword));
}

function isPortfolioProject(prompt) {
  const portfolioKeywords = ['portfolio', 'resume', 'cv', 'personal site', 'profile', 'showcase', 'gallery', 'work samples', 'projects showcase'];
  return portfolioKeywords.some(keyword => prompt.includes(keyword));
}

// Enhanced prompt generators for different project types
function enhanceGamePrompt(originalPrompt, prompt) {
  return `Create an absolutely stunning, professional-grade interactive game: "${originalPrompt}" that rivals premium mobile apps with these ultra-detailed specifications:

**🚀 PREMIUM VISUAL DESIGN SYSTEM:**
- Ultra-modern dark theme with cinematic gradient backgrounds:
  * Primary: radial-gradient(circle at 20% 50%, #120078 0%, #000000 50%, #9D0208 100%)
  * Secondary: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)
  * Accent gradients: linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4, #FFEAA7)
- Glassmorphism card effects with backdrop-filter: blur(20px) and rgba(255,255,255,0.1) borders
- Premium typography stack: 'Inter', 'SF Pro Display', 'Poppins', system-ui
- Dynamic color shifting based on game state (winning streaks, player turns)
- Animated gradient borders that pulse and shift colors

**🎮 ADVANCED GAME FEATURES & MECHANICS:**
- **AI Opponent System**: Implement multiple difficulty levels (Easy, Medium, Hard, Impossible)
- **Smart AI Logic**: Use minimax algorithm for challenging gameplay
- **Score Tracking System**: 
  * Player vs AI win/loss records
  * Streak counters with visual celebrations
  * Performance statistics (games played, win percentage)
  * Achievement badges for milestones
- **Game Modes**:
  * Classic 3x3 Tic Tac Toe
  * Time Attack mode with countdown timers
  * Best of 3/5/7 tournament mode
  * Custom board sizes (4x4, 5x5 options)
- **Progressive Difficulty**: AI adapts based on player skill
- **Game History**: Save and replay previous games

**⚡ STUNNING ANIMATIONS & INTERACTIONS:**
- **Cell Hover Effects**: 
  * Smooth scale transforms: transform: scale(1.05)
  * Glowing borders with box-shadow: 0 0 20px rgba(79, 172, 254, 0.6)
  * Ripple effect animations on click
- **Move Animations**:
  * X and O symbols appear with elastic bounce animations
  * Particle explosion effects on winning combinations
  * Smooth rotation and scaling transforms
- **Victory Celebrations**:
  * Confetti particle systems using CSS animations
  * Winning line highlighting with neon glow effects
  * Screen shake effects for dramatic wins
  * Trophy and star animations
- **Background Animations**:
  * Floating geometric shapes with CSS keyframes
  * Subtle parallax scrolling effects
  * Dynamic gradient shifts based on game events

**🎨 ULTRA-MODERN UI COMPONENTS:**
- **Game Board Design**:
  * 3D-styled cells with depth and shadow
  * Neon grid lines with pulsing glow effects
  * Rounded corners (border-radius: 16px) with perfect spacing
  * Interactive hover states with smooth transitions
- **Control Panel**:
  * Floating action buttons with material design shadows
  * Toggle switches for game settings (sound, difficulty)
  * Sleek progress bars for AI thinking time
  * Modern modal dialogs for game over states
- **Score Dashboard**:
  * Live updating counters with number flip animations
  * Circular progress indicators for win percentages
  * Streak indicators with fire/lightning effects
  * Leaderboard tables with professional styling

**🌟 PREMIUM FEATURES:**
- **Theme Customization**:
  * Multiple color themes (Cyberpunk, Ocean, Sunset, Neon)
  * Dark/Light mode toggle with smooth transitions
  * Custom player symbols (beyond X and O)
- **Sound Design Simulation**:
  * Visual feedback that mimics sound (pulse effects, screen flash)
  * Button press animations with ripple effects
  * Victory screen with burst animations
- **Settings Panel**:
  * Difficulty slider with visual feedback
  * Animation speed controls
  * Reset statistics option
  * Export game history functionality

**📱 RESPONSIVE & ACCESSIBLE DESIGN:**
- Perfect mobile optimization with touch-friendly 60px+ button sizes
- Swipe gestures for navigation between game modes
- Keyboard navigation support (arrow keys, Enter, Space)
- Screen reader compatibility with proper ARIA labels
- High contrast mode for accessibility
- Reduced motion mode for users with vestibular disorders

**💎 TECHNICAL EXCELLENCE:**
- **Performance Optimized**:
  * Smooth 60fps animations using transform and opacity
  * Efficient DOM manipulation with minimal reflows
  * CSS Grid and Flexbox for perfect layouts
  * Hardware acceleration for smooth animations
- **Modern JavaScript Features**:
  * ES6+ syntax with async/await
  * Local storage for persistent data
  * Error handling with user-friendly messages
  * Modular code structure with clear separation
- **Browser Compatibility**:
  * Progressive enhancement approach
  * Fallbacks for older browsers
  * Touch event handling for mobile devices

**🏆 GAMIFICATION ELEMENTS:**
- Achievement system with unlock animations
- Daily challenges and special game modes
- Player profile with customizable avatars
- Statistics tracking with beautiful data visualization
- Sharing functionality for impressive wins

**🎯 SPECIFIC IMPLEMENTATION REQUIREMENTS:**
- Create a game that feels like a premium $4.99 mobile app
- Every interaction should have smooth, delightful animations
- Use cutting-edge CSS techniques (backdrop-filter, clip-path, custom properties)
- Implement a state management system for complex game logic
- Add loading screens with animated spinners during AI calculations
- Include tutorial/onboarding flow for new players
- Implement gesture controls for mobile (swipe to restart, pinch for settings)

**COLOR PALETTE SPECIFICATIONS:**
- Primary Colors: #1a1a2e, #16213e, #0f0f23
- Accent Colors: #00d4ff, #39ff14, #8a2be2, #ff6b6b
- Gradient Combinations: 
  * Winning: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
  * Losing: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)
  * Neutral: linear-gradient(135deg, #3c3c3d 0%, #2c2c2e 100%)

**TYPOGRAPHY SYSTEM:**
- Headers: 'Inter', weight 700, size 2.5rem, letter-spacing -0.02em
- Body: 'Inter', weight 400, size 1rem, line-height 1.6
- UI Elements: 'SF Pro Display', weight 600, optimized for readability
- Game Symbols: Custom font stack for perfect X and O rendering

Create a tic-tac-toe game that would make players say 'WOW!' - something so polished and engaging that it could be featured on the App Store homepage. Every pixel should be crafted with intention, every animation should spark joy, and every interaction should feel magical!`;
}

function enhanceLandingPagePrompt(originalPrompt, prompt) {
  return `Create an avant-garde, highly engaging web page: "${originalPrompt}" with these robust specifications:

**🎨 UNPARALLELED VISUAL DESIGN:**
- Awe-inspiring theme with hyper-realistic graphics embracing gradients:
  * Overarching gradient themes: linear-gradient(45deg, #FC466B, #3F5EFB) to radial-gradient(circle, #bd19f2, #3C3B3F)
  * Accent transitions: angular-gradient(from top, #ff7e5f, #feb47b, #76b852, #8dc26f, #5a3f37, #2c7744)
- Dazzling backdrops with coherent, flowing patterns using SVGs and CSS pseudo-elements
- Iconography focused on illumination: using lucide, material icons, and hero icons
- Magnificent 3D depth effects using CSS shadows and transforms
- Ostentatious shimmer animations for call-to-action elements

**🌟 ELITE STRUCTURE  LAYOUT INNOVATION:**
- Dynamic, narrative-driven UI with scroll-triggered animations
- Full-screen hero sections with nested parallax visuals
- Compelling image galleries with mosaic layouts
- Hero videos or Lottie animations with auto-play after page load
- Engaging story arcs via scrolling storytelling and perspective shifts

**⚡ CUTTING-EDGE INTERACTIONS:**
- Ultra-smooth hover transitions with micro-interactions
- Intuitive UI for unpreceded user immersion
- Adaptive interfaces using AI for real-time user feedback
- Mixed-reality features with tilt-shift and perspective parallax scrolling
- Fast, frictionless checkout flows

**📱 TAILORED MOBILE DESIGN:**
- Delightful mobile experiences with gesture controls (swipe, pinch, spread)
- Responsive typography and liquid layouts catering to all devices
- Progressive web app features, with offline-first capabilities
- Voice interaction-enabled interfaces

**💎 METICULOUS DETAILING & EXTRAS:**
- Headless CMS integration for seamless content updates (such as Contentful, Strapi)
- Backend APIs in GraphQL for lightning data fetch
- Multi-language support with real-time translation
- Accessibility features like dynamic text resizing, keyboard navigation
- UX Testing modules for continual UX enhancement

**🎯 CONVERSION-OPTIMIZED DESIGN:**
- Potent call-to-action strategies with an emphasis on conversion psychology
- Trust-building content: customer testimonials, brand story, infographics
- Lead generation: Form integrations, social proof, newsletter signups

**TECHNOLOGY SPECIFICATIONS:**
- Fully responsive design, CSS grids and flexbox layouts
- Server-side rendering (SSR) with React, Next.js for maximized performance
- Service workers and lazy-loading scripts for optimal speed
- Compatible with all major platforms and browsers
  
Create a stunning, conversion-focused landing page for "${originalPrompt}" with these specifications:

**🎨 PREMIUM VISUAL DESIGN:**
- Modern dark theme with gradient background (#0a0a0f to #1a1a2e)
- Accent colors: electric blue (#0ea5e9), emerald (#10b981), amber (#f59e0b)
- Premium typography: Inter, Space Grotesk, or Poppins
- Glassmorphism cards with backdrop-filter: blur(20px)
- Professional spacing (60px+ sections, 40px+ padding)
- Rounded corners (16px-24px) and subtle shadows

**🚀 CONVERSION-OPTIMIZED STRUCTURE:**
1. **Hero Section**: Compelling headline + powerful subheading + dual CTA buttons
2. **Social Proof**: Customer logos, testimonials, or trust badges
3. **Features Grid**: 3-6 benefit-focused feature cards with icons
4. **Statistics Bar**: Impressive numbers (users, satisfaction, uptime)
5. **How It Works**: 3-step process with icons and descriptions
6. **Pricing/CTA**: Clear value proposition with prominent action button
7. **Footer**: Professional links and contact information

**⚡ INTERACTIVE ELEMENTS:**
- Smooth hover animations (transform: translateY(-4px))
- Gradient button effects with box-shadows
- 0.3s ease-in-out transitions throughout
- Mobile-responsive with touch optimization
- Scroll-triggered animations
- Interactive elements with visual feedback

**📱 MOBILE-FIRST RESPONSIVE:**
- Perfect mobile experience
- Touch-friendly button sizes (44px+ minimum)
- Optimized images and fast loading
- Readable typography at all screen sizes

Create a landing page that converts like top SaaS companies - professional, trustworthy, and irresistible!`;
}

function enhanceWebAppPrompt(originalPrompt, prompt) {
  return `Create a professional, modern web application: "${originalPrompt}" with these specifications:

**🎯 PROFESSIONAL APP DESIGN:**
- Clean, modern interface with dark theme (#1e1e1e to #2d2d2d)
- Accent colors: blue (#3b82f6), green (#10b981), purple (#8b5cf6)
- Typography: Inter or Roboto for perfect readability
- Card-based layout with subtle shadows and borders
- Consistent spacing using 8px grid system
- Professional iconography throughout

**⚙️ FUNCTIONAL FEATURES:**
- Intuitive user interface with clear navigation
- Real-time feedback and validation
- Local storage for user data persistence
- Responsive design for all devices
- Loading states and error handling
- Keyboard shortcuts for power users
- Export/import functionality where relevant

**✨ UI/UX EXCELLENCE:**
- Smooth micro-interactions and animations
- Hover states on all interactive elements
- Clear visual hierarchy with proper contrast
- Accessibility features (ARIA labels, focus states)
- Toast notifications for user feedback
- Professional form design with validation

**📊 MODERN COMPONENTS:**
- Dashboard-style layout if applicable
- Data visualization with charts/graphs
- Modal dialogs and slide-out panels
- Tabbed interfaces for content organization
- Search and filter functionality
- Professional data tables

Build an app that feels like a premium SaaS product - polished, reliable, and delightful to use!`;
}

function enhanceDashboardPrompt(originalPrompt, prompt) {
  return `Create a professional analytics dashboard for "${originalPrompt}" with these specifications:

**📊 DASHBOARD EXCELLENCE:**
- Dark theme with data visualization focus (#0f172a to #1e293b)
- Color scheme: blues (#3b82f6), greens (#10b981), charts colors
- Clean grid layout with proper spacing
- Professional typography optimized for data reading
- Card-based metrics with clear hierarchy
- Consistent component styling throughout

**📈 DATA VISUALIZATION:**
- Mock charts and graphs (using CSS/canvas)
- KPI cards with trending indicators
- Progress bars and gauges
- Data tables with sorting capabilities
- Real-time updating numbers
- Interactive elements with hover states

**🎛️ CONTROL PANEL FEATURES:**
- Sidebar navigation with icons
- Top header with user profile/settings
- Filter and date range selectors
- Export/download functionality
- Search capabilities
- Notification center

Create a dashboard that looks like Stripe, Vercel, or modern analytics platforms!`;
}

function enhancePortfolioPrompt(originalPrompt, prompt) {
  return `Create a stunning personal portfolio for "${originalPrompt}" with these specifications:

**🎨 PORTFOLIO DESIGN:**
- Modern, minimalist design with personality
- Dark theme with carefully chosen accent colors
- Typography that reflects professionalism
- Image galleries with smooth transitions
- Consistent branding throughout
- Clean, scannable layout

**📂 PORTFOLIO SECTIONS:**
1. Hero section with compelling introduction
2. About section with personal story
3. Skills/expertise showcase
4. Project gallery with case studies
5. Experience/timeline
6. Contact form and social links

**✨ INTERACTIVE FEATURES:**
- Smooth scrolling and animations
- Project hover effects
- Image lightbox/modals
- Downloadable resume
- Contact form functionality
- Social media integration

Create a portfolio that stands out and gets hired - professional yet memorable!`;
}

function enhanceGenericPrompt(originalPrompt, prompt) {
  return `Create a stunning, professional web project: "${originalPrompt}" with these specifications:

**🎨 MODERN DESIGN SYSTEM:**
- Contemporary dark theme with gradient backgrounds
- Carefully selected color palette with proper contrast
- Professional typography (Inter, Poppins, or Space Grotesk)
- Glassmorphism effects and subtle shadows
- Consistent spacing and visual hierarchy
- Mobile-first responsive design

**⚡ INTERACTIVE EXPERIENCE:**
- Smooth animations and transitions
- Hover effects on interactive elements
- Loading states and user feedback
- Intuitive navigation and user flow
- Accessibility best practices
- Cross-browser compatibility

**💼 PROFESSIONAL POLISH:**
- Clean, semantic HTML5 structure
- Modern CSS with flexbox/grid layouts
- Vanilla JavaScript for enhanced interactivity
- Optimized performance and fast loading
- SEO-friendly markup
- Production-ready code quality

Create something that looks like it was designed by a top-tier agency - modern, professional, and visually stunning!`;
}

// Routes
app.post('/api/generate', async (req, res) => {
  try {
    let { prompt } = req.body;
    if (!prompt) throw new Error("Prompt is required");

    // --- Enhance prompt if needed ---
    console.log('Original prompt received:', prompt);
    const originalPrompt = prompt;
    prompt = enhancePromptIfNeeded(prompt);
    console.log('Enhanced prompt length:', prompt.length);
    console.log('Enhancement applied:', prompt !== originalPrompt ? 'YES' : 'NO');
    
    // Log first 200 characters of enhanced prompt for verification
    if (prompt !== originalPrompt) {
      console.log('Enhanced prompt preview:', prompt.substring(0, 200) + '...');
    }

    const enhancedPrompt = `\nGenerate a complete web application based on this request: "${prompt}"\n\nIMPORTANT: Please provide THREE separate files with clean separation of concerns:\n\n1. HTML file (index.html): Structure only, no inline CSS or JavaScript\n2. CSS file (styles.css): All styling, including responsive design and animations\n3. JavaScript file (script.js): All interactive functionality\n\nPlease provide the response in this EXACT JSON format:\n{\n  "files": {\n    "index.html": "HTML structure with proper links to external CSS and JS files",\n    "styles.css": "Complete CSS styling including responsive design and animations", \n    "script.js": "All JavaScript functionality and event handlers"\n  }\n}\n\nRequirements:\n- HTML should link to styles.css and script.js using: <link rel=\"stylesheet\" href=\"styles.css\"> and <script src=\"script.js\"></script>\n- Create a fully functional, responsive web application\n- Include modern CSS with animations/transitions\n- Make it interactive with JavaScript\n- Ensure all files work together seamlessly\n- Use modern web development best practices\n- Make it visually appealing and professional\n- Include proper error handling in JavaScript\n- Make the design responsive for mobile and desktop\n\nThe application should be: ${prompt}\n`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Flash model (lower rate limits)
    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    
    // Try to parse the AI response as JSON
    let aiResponse = response.text();
    
    // Clean up the response to extract JSON
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsedResponse = JSON.parse(jsonMatch[0]);
        
        // Validate and fix file structure
        const validatedFiles = validateAndFixFiles(parsedResponse.files || {});
        
        res.json({ files: validatedFiles });
      } catch (parseError) {
        // If JSON parsing fails, create a basic structure with separated files
        const fallbackFiles = {
          'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated App</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Generated Application</h1>
        <div class="content">
            <p>AI Response:</p>
            <pre class="ai-response">${aiResponse.substring(0, 500)}...</pre>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
          'styles.css': `body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
}
.container {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}
.ai-response {
    background: #f5f5f5;
    padding: 15px;
    border-radius: 5px;
    overflow-x: auto;
}`,
          'script.js': `console.log('Generated app loaded successfully');
// Add any interactive functionality here`
        };
        
        // Validate the fallback files too
        const validatedFiles = validateAndFixFiles(fallbackFiles);
        res.json({ files: validatedFiles });
      }
    } else {
      // Fallback if no JSON structure found - create proper separated files
      res.json({
        files: {
          'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Generated Response</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>AI Generated Response</h1>
        <div class="response-content">${aiResponse.replace(/\n/g, '<br>')}</div>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
          'styles.css': `body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 20px;
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    min-height: 100vh;
}
.container {
    max-width: 900px;
    margin: 0 auto;
    background: white;
    padding: 40px;
    border-radius: 15px;
    box-shadow: 0 15px 35px rgba(0,0,0,0.1);
}
h1 {
    color: #333;
    text-align: center;
    margin-bottom: 30px;
}
.response-content {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    border-left: 4px solid #007acc;
    line-height: 1.6;
}`,
          'script.js': `document.addEventListener('DOMContentLoaded', function() {
    console.log('AI Web Builder - Response loaded');
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
});`
        }
      });
    }
  } catch (error) {
    console.error("Error:", error);
    // Even on error, provide valid files with a better error message
    const errorFiles = validateAndFixFiles({
      'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Service Temporarily Unavailable</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>🤖 AI Service Temporarily Unavailable</h1>
        <p>The AI service is currently experiencing high demand. Please try again in a few minutes.</p>
        <p>This is a temporary issue with Google's AI service, not with our application.</p>
        <button onclick="window.history.back()" style="background: #667eea; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Go Back</button>
    </div>
    <script src="script.js"></script>
</body>
</html>`
    });
    res.status(503).json({ files: errorFiles });
  }
});

// Health check endpoints
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    apiVersion: '1.0.0',
    endpoints: ['/api/generate', '/api/publish/netlify']
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  console.error("Server error:", err);
});