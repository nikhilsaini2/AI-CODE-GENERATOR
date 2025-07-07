# 🚀 AI Web Builder - Backend

A powerful Node.js/Express backend that provides AI-powered code generation and seamless web project publishing services. This server handles AI integration, CORS proxy functionality, and deployment automation for multiple hosting platforms.

## ✨ Features

### 🤖 **AI Code Generation**
- **Google Gemini AI Integration**: Advanced natural language to code generation
- **Multi-file Project Creation**: Generates HTML, CSS, and JavaScript files
- **Intelligent Code Separation**: Ensures clean separation of concerns
- **Fallback Mechanisms**: Robust error handling with default templates
- **Content Validation**: Automatic file structure validation and fixing

### 🌐 **Publishing Services**
- **Netlify Deployment**: One-click deployment to Netlify with ZIP uploads
- **GitHub Pages**: Automated repository creation and GitHub Pages setup
- **CORS Proxy**: Eliminates frontend CORS issues with external APIs
- **File Validation**: Ensures all required files are present before deployment
- **Error Handling**: Comprehensive error reporting and graceful fallbacks

### 🔧 **Technical Features**
- **Environment Configuration**: Secure API key management
- **Rate Limiting**: Built-in protection against API abuse
- **Large File Support**: 10MB JSON payload limit for complex projects
- **Logging**: Detailed request/response logging for debugging
- **Auto-Recovery**: Graceful handling of API failures

## 🛠️ Technologies Used

### **Core Framework**
- **Node.js**: JavaScript runtime environment
- **Express 5.1**: Modern web framework with latest features
- **CORS 2.8**: Cross-origin resource sharing middleware
- **dotenv 17.0**: Environment variable management

### **AI & Code Generation**
- **@google/generative-ai 0.24**: Official Google Gemini AI SDK
- **Custom Prompting**: Optimized prompts for web development code generation
- **Content Parsing**: JSON extraction and validation from AI responses

### **File Processing & Deployment**
- **JSZip 3.10**: ZIP file creation for deployment packages
- **Form-Data 4.0**: Multipart form data handling for file uploads
- **Axios 1.7**: HTTP client for external API calls
- **Buffer Management**: Efficient file content handling

### **Publishing APIs**
- **Netlify API v1**: Site creation and deployment
- **GitHub API v3**: Repository management and GitHub Pages
- **Custom Validation**: File structure and content validation

## 📁 Project Structure

```
backend/
├── server.js                   # Main Express server
├── package.json               # Dependencies and scripts
├── .env                       # Environment variables (API keys)
├── .gitignore                 # Git ignore rules
└── node_modules/              # Installed dependencies
```

### **Server Architecture (server.js)**
```javascript
// Core Setup
├── Express App Configuration
├── Middleware Setup (CORS, JSON parsing)
├── Google GenAI Initialization
├── Environment Variable Loading

// Utility Functions
├── validateAndFixFiles()      # File structure validation
├── extractFilesFromResponse() # AI response parsing
├── File content sanitization

// API Routes
├── POST /api/generate         # AI code generation
├── POST /api/publish/netlify  # Netlify deployment
├── POST /api/publish/github   # GitHub Pages deployment
└── Health check endpoints
```

## 🚀 Quick Start

### **Prerequisites**
- **Node.js 16+**: Download from [nodejs.org](https://nodejs.org/)
- **npm or yarn**: Package manager (comes with Node.js)
- **API Keys**: Google Gemini AI and hosting service tokens

### **1. Install Dependencies**
```bash
cd backend
npm install
```

### **2. Configure Environment**
Create a `.env` file in the backend directory:
```bash
touch .env
```

Add your API keys to `.env`:
```env
# Google Gemini AI API Key (Required)
GOOGLE_GENAI_API_KEY=your_google_ai_api_key_here

# Netlify API Token (Optional - for publishing)
NETLIFY_API_TOKEN=your_netlify_token_here

# Server Configuration
PORT=5001
```

### **3. Start the Server**
```bash
npm start
```

The server will start at [http://localhost:5001](http://localhost:5001)

## 🔑 API Keys Setup Guide

### 🧠 **Google Gemini AI (Required)**

**Why Google Gemini?**
- ✅ Advanced code generation capabilities
- ✅ Multi-language programming support
- ✅ Large context windows for complex projects
- ✅ Free tier available

**Setup Steps:**
1. **Get API Key**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the key (starts with `AIza`)

2. **Add to .env**:
   ```env
   GOOGLE_GENAI_API_KEY=AIzaSyABcDeFgHiJkLmNoPqRsTuVwXyZ123456
   ```

3. **Verify Setup**:
   ```bash
   curl -X POST http://localhost:5001/api/generate \
     -H "Content-Type: application/json" \
     -d '{"prompt":"Create a simple hello world webpage"}'
   ```

### 🌐 **Netlify API Token (Optional)**

**Why Netlify?**
- ✅ Free tier with 100GB bandwidth
- ✅ Automatic SSL certificates
- ✅ Global CDN distribution
- ✅ Instant deployments

**Setup Steps:**
1. **Create Account**: Go to [netlify.com](https://netlify.com)
2. **Get API Token**:
   - Visit [Personal Access Tokens](https://app.netlify.com/user/applications/personal)
   - Click "New access token"
   - Name: "AI Web Builder Backend"
   - Copy token (starts with `nfp_`)
3. **Add to .env**:
   ```env
   NETLIFY_API_TOKEN=nfp_abc123xyz789...
   ```

### 🐙 **GitHub Personal Access Token (Optional)**

**Setup Steps:**
1. **Generate Token**:
   - Visit [GitHub Settings](https://github.com/settings/tokens)
   - Click "Generate new token (classic)"
   - Select scopes: `repo`, `read:user`
   - Copy token (starts with `ghp_`)
2. **Add to .env**:
   ```env
   GITHUB_TOKEN=ghp_abc123xyz789...
   ```

## 🔧 Environment Configuration

### **Complete .env Example**
```env
# =============================================================================
# GOOGLE GEMINI AI (Required for code generation)
# =============================================================================
# Get from: https://makersuite.google.com/app/apikey
GOOGLE_GENAI_API_KEY=AIzaSyABcDeFgHiJkLmNoPqRsTuVwXyZ123456

# =============================================================================
# NETLIFY (Optional - for publishing)
# =============================================================================
# Get from: https://app.netlify.com/user/applications/personal
NETLIFY_API_TOKEN=nfp_abc123xyz789defghijk456lmnop
=============================================================================
# SERVER CONFIGURATION
# =============================================================================
PORT=5001
NODE_ENV=development
```

### **Environment Variables Explained**

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `GOOGLE_GENAI_API_KEY` | Google Gemini AI API key | ✅ Yes | `AIzaSyABc...` |
| `NETLIFY_API_TOKEN` | Netlify personal access token | ❌ Optional | `nfp_abc123...` |
| `GITHUB_TOKEN` | GitHub personal access token | ❌ Optional | `ghp_abc123...` |
| `PORT` | Server port number | ❌ Optional | `5001` |
| `NODE_ENV` | Environment mode | ❌ Optional | `development` |

## 📡 API Endpoints

### **🤖 AI Code Generation**

#### `POST /api/generate`
Generates complete web projects from natural language prompts.

**Request Body:**
```json
{
  "prompt": "Create a modern portfolio website with dark mode and animations"
}
```

**Response:**
```json
{
  "files": {
    "index.html": "<!DOCTYPE html>...",
    "styles.css": "body { font-family: ... }",
    "script.js": "document.addEventListener('DOMContentLoaded', ..."
  }
}
```

**Features:**
- ✅ Generates 3 separate files (HTML, CSS, JS)
- ✅ Ensures proper file linking and structure
- ✅ Validates and fixes content automatically
- ✅ Fallback templates for edge cases

### **🌐 Publishing Endpoints**

#### `POST /api/publish/netlify`
Deploys projects to Netlify hosting.

**Request Body:**
```json
{
  "files": {
    "index.html": "...",
    "styles.css": "...",
    "script.js": "..."
  },
  "projectName": "my-awesome-project",
  "apiToken": "nfp_optional_token_here"
}
```

**Response:**
```json
{
  "id": "site-id-123",
  "name": "my-awesome-project",
  "url": "https://my-awesome-project-123.netlify.app",
  "service": "netlify",
  "status": "published",
  "files": ["index.html", "styles.css", "script.js"]
}
```

#### `POST /api/publish/github`
Creates GitHub repository and enables GitHub Pages.

**Request Body:**
```json
{
  "files": { ... },
  "projectName": "my-project",
  "token": "ghp_github_token",
  "username": "your-username"
}
```

## 🔄 How It Works

### **1. AI Code Generation Flow**
```
User Prompt → Enhanced Prompt → Google Gemini AI → JSON Response → File Extraction → Validation → Clean Files
```

**Detailed Process:**
1. **Prompt Enhancement**: Add specific instructions for file separation
2. **AI Processing**: Send to Google Gemini with optimized parameters
3. **Response Parsing**: Extract JSON structure from AI response
4. **File Validation**: Ensure all required files are present
5. **Content Sanitization**: Clean and validate file contents
6. **Structure Fixing**: Add missing files or fix malformed content

### **2. Publishing Flow**
```
Files → Validation → ZIP Creation → API Call → Site Creation → Deployment → Live URL
```

**Netlify Process:**
1. **File Validation**: Check for index.html and valid content
2. **ZIP Creation**: Bundle all files using JSZip
3. **Site Creation**: Create new Netlify site via API
4. **Deployment**: Upload ZIP to Netlify deployment endpoint
5. **URL Return**: Immediately return live site URL

### **3. Error Handling**
```
API Error → Log Details → Fallback Strategy → User-Friendly Message → Continue Operation
```

## 🧪 Available Scripts

### **Development**
```bash
npm start          # Start production server
npm run dev        # Start development server (same as start)
npm test           # Run test suite (placeholder)
```

### **Process Management**
```bash
# Start server in background
npm start &

# Kill server on specific port
lsof -ti:5001 | xargs kill -9

# Check if server is running
curl http://localhost:5001/health
```

## 🔍 Testing & Debugging

### **Health Check**
```bash
curl http://localhost:5001/health
# Expected: 200 OK
```

### **Test AI Generation**
```bash
curl -X POST http://localhost:5001/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Create a simple calculator app"}'
```

### **Test Netlify Publishing**
```bash
curl -X POST http://localhost:5001/api/publish/netlify \
  -H "Content-Type: application/json" \
  -d '{
    "files": {
      "index.html": "<!DOCTYPE html><html><head><title>Test</title></head><body><h1>Hello World</h1></body></html>",
      "styles.css": "body { background: #f0f0f0; }",
      "script.js": "console.log(\"Hello World\");"
    },
    "projectName": "test-project"
  }'
```

### **Debug Logging**
The server provides detailed console logging:
```javascript
// AI Generation
"Enhanced prompt created, length: 1234 characters"
"AI response received, parsing files..."
"File validation completed. Files: ['index.html', 'styles.css', 'script.js']"

// Publishing
"Deploying to Netlify with files: index.html, styles.css, script.js"
"Zip buffer created, size: 1265 bytes"
"Created Netlify site: de6d8e21-59fe-4ff7-b02c"
"Deployed to site: 686beace9f1c URL: https://project-123.netlify.app"
```

## 🚨 Troubleshooting

### **Common Issues**

**❌ "Failed to initialize AI" on startup**
```bash
# Check your Google AI API key
echo $GOOGLE_GENAI_API_KEY

# Verify key format (should start with AIza)
# Get new key from: https://makersuite.google.com/app/apikey
```

**❌ "Netlify API token is required"**
```bash
# Check backend .env file
cat .env | grep NETLIFY

# Or frontend can pass token in request body
# Verify token at: https://app.netlify.com/user/applications/personal
```

**❌ Server won't start / Port in use**
```bash
# Kill existing process
lsof -ti:5001 | xargs kill -9

# Use different port
PORT=5002 npm start
```

**❌ CORS errors in frontend**
```bash
# Ensure CORS middleware is enabled
# Check frontend proxy configuration
# Verify backend is running on correct port
```

### **Debug Mode**
Enable detailed logging by setting environment variable:
```bash
DEBUG=* npm start
```

## 📊 Performance & Limits

### **Request Limits**
- **JSON Payload**: 10MB maximum
- **AI Generation**: ~30 seconds timeout
- **File Upload**: No specific limit (ZIP compressed)
- **Concurrent Requests**: Express default (no limit set)

### **API Rate Limits**
- **Google Gemini**: 60 requests per minute (free tier)
- **Netlify**: 500 deploys per month (free tier)
- **GitHub**: 5,000 requests per hour

### **Performance Metrics**
- **AI Generation**: 5-15 seconds average
- **Netlify Deployment**: 3-8 seconds
- **Memory Usage**: ~50MB baseline
- **Response Time**: <1s for non-AI endpoints

## 🔐 Security Best Practices

### **API Key Security**
- ✅ Store keys in `.env` file (never in code)
- ✅ Add `.env` to `.gitignore`
- ✅ Use environment variables in production
- ✅ Rotate keys regularly
- ✅ Monitor API usage for anomalies

### **Production Deployment**
- ✅ Use HTTPS in production
- ✅ Set proper CORS origins
- ✅ Enable rate limiting
- ✅ Monitor server logs
- ✅ Use process managers (PM2, forever)

### **Validation & Sanitization**
- ✅ Validate all input parameters
- ✅ Sanitize file contents
- ✅ Check file size limits
- ✅ Validate project names
- ✅ Prevent path traversal attacks

## 🚀 Production Deployment

### **Environment Setup**
```bash
# Production environment variables
NODE_ENV=production
PORT=5001
GOOGLE_GENAI_API_KEY=your_production_key
NETLIFY_API_TOKEN=your_production_token
```

### **Process Management**
```bash
# Using PM2 (recommended)
npm install -g pm2
pm2 start server.js --name "ai-web-builder-backend"
pm2 startup
pm2 save

# Using systemd
sudo systemctl enable ai-web-builder-backend
sudo systemctl start ai-web-builder-backend
```

### **Monitoring**
```bash
# Server health
curl http://your-domain:5001/health

# PM2 monitoring
pm2 monit

# Log monitoring
pm2 logs ai-web-builder-backend
```

## 🤝 Contributing

### **Development Setup**
1. Fork the repository
2. Clone your fork: `git clone https://github.com/shivammourya10/AI_Code_Editor_Generator.git`
3. Install dependencies: `cd backend && npm install`
4. Copy environment template: `cp .env.example .env`
5. Add your API keys to `.env`
6. Start development server: `npm run dev`
7. Create feature branch: `git checkout -b feature/amazing-feature`
8. Make changes and test thoroughly
9. Commit: `git commit -m "Add amazing feature"`
10. Push: `git push origin feature/amazing-feature`
11. Create Pull Request

### **Code Standards**
- Use ESLint for code linting
- Follow Node.js best practices
- Add error handling to all routes
- Document new API endpoints
- Write tests for new features
- Use meaningful commit messages

## 📄 Dependencies Documentation

### **Production Dependencies**
```json
{
  "@google/generative-ai": "^0.24.1",  // Google Gemini AI SDK
  "axios": "^1.7.0",                   // HTTP client for external APIs
  "cors": "^2.8.5",                    // CORS middleware
  "dotenv": "^17.0.1",                 // Environment variable loader
  "express": "^5.1.0",                 // Web framework
  "form-data": "^4.0.3",               // Multipart form data
  "jszip": "^3.10.1"                   // ZIP file creation
}
```

### **Dependency Explanations**
- **@google/generative-ai**: Official Google SDK for Gemini AI integration
- **axios**: Promise-based HTTP client for making API calls to Netlify/GitHub
- **cors**: Enables cross-origin requests from frontend
- **dotenv**: Loads environment variables from .env file
- **express**: Web application framework for Node.js
- **form-data**: Creates multipart/form-data streams for file uploads
- **jszip**: Creates ZIP archives for deployment packages

## 📈 Monitoring & Analytics

### **Server Metrics**
```javascript
// Add to server.js for basic monitoring
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});
```

### **Error Tracking**
```javascript
// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error:', error);
  res.status(500).json({ error: 'Internal server error' });
});
```


## 🙏 Acknowledgments

- **Google Gemini AI**: Powerful code generation capabilities
- **Netlify**: Excellent hosting platform and API
- **Express.js**: Robust web framework
- **Open Source Community**: Amazing tools and libraries

---

## 🎉 Ready to Generate?

1. **Install dependencies**: `npm install`
2. **Add your API keys**: Edit `.env` file
3. **Start the server**: `npm start`
4. **Test the endpoints**: Use curl or connect your frontend!

**Power your AI web builder with this robust backend! 🚀**

---

*For frontend setup and complete application usage, see the main project README.*
