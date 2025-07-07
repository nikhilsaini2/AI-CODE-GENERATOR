# 🚀 AI Web Builder - Frontend

A modern React application that transforms natural language prompts into live, publishable web projects using AI. Create, edit, preview, and publish complete websites with just a few clicks!

## ✨ Features

### 🤖 **AI-Powered Code Generation**
- Generate complete web projects from natural language prompts
- Creates HTML, CSS, and JavaScript files automatically
- Uses Google Gemini AI for intelligent code generation
- Supports complex project requests with modern web technologies

### 🎨 **Modern UI/UX**
- **Glassmorphism Design**: Beautiful frosted glass effects
- **Animated Background**: Dynamic gradient animations
- **Responsive Layout**: Works perfectly on desktop and mobile
- **Dark Theme**: Professional dark interface with smooth transitions
- **Live Preview**: Real-time preview of generated projects

### 📝 **Advanced Code Editor**
- **Monaco Editor**: VS Code-like editing experience
- **Syntax Highlighting**: HTML, CSS, JavaScript support
- **File Tabs**: Switch between HTML, CSS, and JS files
- **Auto-completion**: IntelliSense and code suggestions
- **Error Detection**: Real-time syntax error highlighting

### 🌐 **One-Click Publishing**
- **Netlify Integration**: Deploy to real URLs instantly
- **GitHub Pages**: Deploy to your GitHub repositories
- **Vercel Hosting**: Modern serverless deployment
- **Live URLs**: Share your creations with HTTPS URLs
- **Publish History**: Track all your published projects

### 🔧 **Developer Features**
- **Real-time Preview**: See changes instantly
- **Download Projects**: Export as ZIP files
- **Copy to Clipboard**: Quick code sharing
- **Project Management**: History and organization tools

## 🛠️ Technologies Used

### **Frontend Framework**
- **React 19**: Latest React with concurrent features
- **React DOM 19**: Modern rendering engine
- **React Scripts 5.0**: Create React App build tools

### **Code Editor & Preview**
- **Monaco Editor 4.7**: VS Code editor component
- **JSZip 3.10**: File compression and download
- **File-saver 2.0**: Browser file download utility

### **API & Communication**
- **Axios 1.10**: HTTP client for API calls
- **Proxy Configuration**: Seamless backend communication

### **Testing & Quality**
- **Testing Library**: React testing utilities
- **Jest DOM**: DOM testing utilities
- **Web Vitals**: Performance monitoring

## 📁 Project Structure

```
frontend/
├── public/
│   ├── index.html              # Main HTML template
│   ├── favicon.ico             # App icon
│   └── manifest.json           # PWA configuration
├── src/
│   ├── components/
│   │   ├── Header.js           # Top navigation and actions
│   │   ├── PromptPanel.js      # AI prompt input and file navigation
│   │   ├── CodeEditor.js       # Monaco code editor with tabs
│   │   ├── PreviewPanel.js     # Live preview with responsive frames
│   │   ├── PublishPanel.js     # Publishing interface and history
│   │   └── PublishSetup.js     # API key configuration modal
│   ├── hooks/
│   │   ├── useFileManager.js   # File state management
│   │   └── useAIGenerator.js   # AI generation logic
│   ├── utils/
│   │   ├── publishUtils.js     # Publishing service integration
│   │   └── fileUtils.js        # File manipulation utilities
│   ├── App.js                  # Main application component
│   ├── App.css                 # Global styles and animations
│   ├── index.js                # React application entry point
│   └── index.css               # Base CSS styles
├── .env                        # Environment variables (API keys)
├── .env.example                # Environment template
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

## 🚀 Quick Start

### **Prerequisites**
- **Node.js 16+**: Download from [nodejs.org](https://nodejs.org/)
- **npm or yarn**: Package manager (comes with Node.js)
- **Backend Server**: The AI Web Builder backend must be running

### **1. Install Dependencies**
```bash
cd frontend
npm install
```

### **2. Configure Environment**
Copy the environment template and add your API keys:
```bash
cp .env.example .env
```

Edit `.env` file with your API tokens:
```env
# Netlify (Recommended for beginners)
REACT_APP_NETLIFY_API_TOKEN=nfp_your_token_here

# GitHub Pages (Free for public repos)
REACT_APP_GITHUB_TOKEN=ghp_your_token_here
REACT_APP_GITHUB_USERNAME=yourusername

# Vercel (Modern hosting)
REACT_APP_VERCEL_TOKEN=your_vercel_token_here

# Disable demo mode when you have real API keys
REACT_APP_DEMO_MODE=false
```

### **3. Start Development Server**
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## 🔑 API Keys Setup Guide

### 🌐 **Netlify (Recommended)**

**Why Netlify?**
- ✅ Free tier with 100GB bandwidth
- ✅ Automatic SSL certificates
- ✅ Global CDN
- ✅ Easy setup

**Setup Steps:**
1. **Create Account**: Go to [netlify.com](https://netlify.com) and sign up
2. **Get API Token**: 
   - Visit [app.netlify.com/user/applications/personal](https://app.netlify.com/user/applications/personal)
   - Click "New access token"
   - Name it "AI Web Builder"
   - Copy the token (starts with `nfp_`)
3. **Add to .env**: 
   ```env
   REACT_APP_NETLIFY_API_TOKEN=nfp_abc123xyz789...
   ```

### 🐙 **GitHub Pages**

**Why GitHub Pages?**
- ✅ Free for public repositories
- ✅ Version control included
- ✅ Great for portfolios
- ✅ Custom domains supported

**Setup Steps:**
1. **Create Account**: Go to [github.com](https://github.com) and sign up
2. **Generate Token**:
   - Visit [github.com/settings/tokens](https://github.com/settings/tokens)
   - Click "Generate new token (classic)"
   - Select "repo" permissions
   - Copy the token (starts with `ghp_`)
3. **Add to .env**:
   ```env
   REACT_APP_GITHUB_TOKEN=ghp_abc123xyz789...
   REACT_APP_GITHUB_USERNAME=yourusername
   ```

### ▲ **Vercel**

**Why Vercel?**
- ✅ Lightning fast edge network
- ✅ Automatic deployments
- ✅ Serverless functions
- ✅ Modern developer experience

**Setup Steps:**
1. **Create Account**: Go to [vercel.com](https://vercel.com) and sign up
2. **Get API Token**:
   - Visit [vercel.com/account/tokens](https://vercel.com/account/tokens)
   - Click "Create Token"
   - Copy the token
3. **Add to .env**:
   ```env
   REACT_APP_VERCEL_TOKEN=your_vercel_token_here
   ```

## 🔧 Environment Configuration

### **Complete .env Example**
```env
# =============================================================================
# NETLIFY (Recommended for beginners)
# =============================================================================
REACT_APP_NETLIFY_API_TOKEN=nfp_5xwzHpYjg8SCMVEz6iebbTZkFUiR2EYZf935

# =============================================================================
# GITHUB PAGES (Great for developers)
# =============================================================================
REACT_APP_GITHUB_TOKEN=ghp_abc123xyz789...
REACT_APP_GITHUB_USERNAME=yourusername

# =============================================================================
# VERCEL (Modern hosting)
# =============================================================================
REACT_APP_VERCEL_TOKEN=abc123xyz789...

# =============================================================================
# DEMO MODE (Set to false when you add real API keys)
# =============================================================================
REACT_APP_DEMO_MODE=false
```

### **Environment Variables Explained**

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `REACT_APP_NETLIFY_API_TOKEN` | Netlify personal access token | For Netlify publishing | `nfp_abc123...` |
| `REACT_APP_GITHUB_TOKEN` | GitHub personal access token | For GitHub Pages | `ghp_abc123...` |
| `REACT_APP_GITHUB_USERNAME` | Your GitHub username | For GitHub Pages | `johndoe` |
| `REACT_APP_VERCEL_TOKEN` | Vercel API token | For Vercel deployment | `abc123...` |
| `REACT_APP_DEMO_MODE` | Use demo URLs instead of real deployment | Development | `false` |

## 📱 How to Use

### **1. Generate a Project**
1. Enter a descriptive prompt in the text area:
   ```
   "Create a modern portfolio website with animations and dark mode"
   ```
2. Click "✨ Generate with AI" or press `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)
3. Wait for AI to generate HTML, CSS, and JavaScript files

### **2. Edit Your Code**
1. Use the file tabs to switch between HTML, CSS, and JS
2. Edit code directly in the Monaco editor
3. See changes reflected immediately in the preview panel
4. Use the Code/Preview toggle for different view modes

### **3. Preview Your Project**
1. The preview panel shows your project running live
2. Test responsive design with the device frame selector
3. All CSS and JavaScript functionality works in real-time
4. Use the "Run in New Tab" button for full-screen testing

### **4. Publish Your Project**
1. Click the "🚀 Publish" button in the header
2. The publish panel slides in from the right
3. Select your preferred hosting service (Netlify, GitHub, Vercel)
4. Click "Publish to [Service]" button
5. Copy the live URL and share your creation!

### **5. Manage Published Projects**
1. View publish history in the "Recent Publishes" section
2. Copy URLs with one click
3. Open published sites in new tabs
4. Track creation dates and hosting services

## 🎯 Example Prompts

### **Website Types**
- "Create a restaurant website with menu and reservation system"
- "Build a tech startup landing page with pricing sections"
- "Make a photography portfolio with image galleries"
- "Design a blog template with article layouts"

### **Interactive Apps**
- "Create a todo app with drag-and-drop functionality"
- "Build a calculator with scientific functions"
- "Make a weather dashboard with charts and maps"
- "Design a music player with playlist management"

### **Games & Entertainment**
- "Create a memory card matching game"
- "Build a trivia quiz with multiple categories"
- "Make a drawing app with different brush tools"
- "Design a puzzle game with levels"

### **Business Tools**
- "Create an invoice generator with PDF export"
- "Build a team project management dashboard"
- "Make a customer feedback form with ratings"
- "Design a product showcase with filtering"

## 🧪 Available Scripts

### **Development**
```bash
npm start          # Start development server (http://localhost:3000)
npm test           # Run test suite in watch mode
npm run build      # Build production version
```

### **Testing**
```bash
npm test           # Interactive test runner
npm run test:ci    # Run tests once (CI mode)
npm run test:coverage  # Generate coverage report
```

### **Production**
```bash
npm run build      # Create optimized production build
npm run preview    # Preview production build locally
```

## 🔄 Architecture & Data Flow

### **Component Hierarchy**
```
App.js
├── Header.js (navigation, publish toggle)
├── Main Layout
│   ├── PromptPanel.js (AI input, file tabs)
│   ├── CodeEditor.js (Monaco editor)
│   └── PreviewPanel.js (live preview)
└── PublishPanel.js (publishing interface)
```

### **Data Flow**
1. **User Input** → PromptPanel → AI API call
2. **AI Response** → File state → CodeEditor & PreviewPanel
3. **Code Changes** → Real-time preview update
4. **Publish Action** → Backend proxy → Hosting service
5. **Success** → URL returned → History stored

### **State Management**
- **File State**: HTML, CSS, JS content and active file
- **UI State**: Preview visibility, publish panel, loading states
- **Publish History**: LocalStorage persistence of published projects
- **Configuration**: Environment-based API key detection

## 🚨 Troubleshooting

### **Common Issues**

**❌ "Service not configured" message**
```bash
# Check your .env file
cat .env

# Ensure API token is present and correctly named
REACT_APP_NETLIFY_API_TOKEN=nfp_...

# Restart development server
npm start
```

**❌ Backend connection failed**
```bash
# Check if backend is running on port 5001
curl http://localhost:5001/health

# Check proxy configuration in package.json
"proxy": "http://localhost:5001"
```

**❌ Publishing fails with 401 error**
```bash
# Test your API token directly
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://api.netlify.com/api/v1/user

# Should return user info, not "Access Denied"
```

**❌ Preview not updating**
```bash
# Clear browser cache
# Check browser console for errors
# Restart development server
```

### **Debug Mode**
Enable detailed logging by opening browser developer tools:
1. Open DevTools (F12)
2. Check Console for debugging info
3. Look for "Environment check" logs
4. Verify API token detection

## 🔐 Security & Best Practices

### **API Key Security**
- ✅ Store keys in `.env` file (not committed to git)
- ✅ Use environment variables starting with `REACT_APP_`
- ✅ Never hardcode API keys in source code
- ✅ Regenerate keys if accidentally exposed

### **Production Deployment**
- ✅ Use `npm run build` for production builds
- ✅ Enable HTTPS for published sites
- ✅ Configure proper CORS headers
- ✅ Monitor API usage and rate limits

## 📊 Performance

### **Optimization Features**
- **Code Splitting**: Automatic bundle optimization
- **Lazy Loading**: Components loaded on demand
- **Memoization**: Prevent unnecessary re-renders
- **Bundle Analysis**: webpack-bundle-analyzer integration

### **Metrics**
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.8s
- **Bundle Size**: < 500KB gzipped

## 🤝 Contributing

### **Development Setup**
1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/ai-web-builder.git`
3. Install dependencies: `npm install`
4. Create feature branch: `git checkout -b feature/amazing-feature`
5. Make changes and test thoroughly
6. Commit: `git commit -m "Add amazing feature"`
7. Push: `git push origin feature/amazing-feature`
8. Create Pull Request

### **Code Standards**
- Use ESLint and Prettier for formatting
- Write tests for new components
- Follow React best practices
- Document complex functions
- Use TypeScript for type safety (future)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI**: Powerful code generation
- **Monaco Editor**: VS Code editing experience
- **React Team**: Amazing framework and tools
- **Netlify**: Excellent hosting platform
- **Open Source Community**: Inspiration and tools

---

## 🎉 Ready to Build?

1. **Install dependencies**: `npm install`
2. **Add your API keys**: Edit `.env` file
3. **Start the server**: `npm start`
4. **Create amazing projects**: Enter prompts and publish!

**Experience the future of web development with AI! 🚀**

---

*For backend setup and API documentation, see the main project README.*
