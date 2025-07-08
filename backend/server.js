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
    /https:\/\/.*\.vercel\.app$/, // Allow all Vercel preview deployments
    /https:\/\/ai-code-editor-generator-.*\.vercel\.app$/ // Allow all your Vercel branches
  ],
  credentials: true
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

// Routes
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) throw new Error("Prompt is required");

    const enhancedPrompt = `
Generate a complete web application based on this request: "${prompt}"

IMPORTANT: Please provide THREE separate files with clean separation of concerns:

1. HTML file (index.html): Structure only, no inline CSS or JavaScript
2. CSS file (styles.css): All styling, including responsive design and animations
3. JavaScript file (script.js): All interactive functionality

Please provide the response in this EXACT JSON format:
{
  "files": {
    "index.html": "HTML structure with proper links to external CSS and JS files",
    "styles.css": "Complete CSS styling including responsive design and animations", 
    "script.js": "All JavaScript functionality and event handlers"
  }
}

Requirements:
- HTML should link to styles.css and script.js using: <link rel="stylesheet" href="styles.css"> and <script src="script.js"></script>
- Create a fully functional, responsive web application
- Include modern CSS with animations/transitions
- Make it interactive with JavaScript
- Ensure all files work together seamlessly
- Use modern web development best practices
- Make it visually appealing and professional
- Include proper error handling in JavaScript
- Make the design responsive for mobile and desktop

The application should be: ${prompt}
`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Updated model name
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
    // Even on error, provide valid files
    const errorFiles = validateAndFixFiles({
      'index.html': `<!DOCTYPE html>
<html><head><title>Error</title><link rel="stylesheet" href="styles.css"></head>
<body><h1>Error occurred</h1><p>${error.message}</p><script src="script.js"></script></body></html>`
    });
    res.status(500).json({ files: errorFiles });
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