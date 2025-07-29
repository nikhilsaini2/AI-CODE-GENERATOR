const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Google GenAI
let genAI;
try {
  genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);
} catch (err) {
  console.error("Failed to initialize AI:", err);
}

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
  
  return validatedFiles;
};

// Enhanced prompt system (simplified for serverless)
function enhancePromptIfNeeded(userPrompt) {
  if (!userPrompt || userPrompt.trim().length === 0) {
    return userPrompt;
  }

  const prompt = userPrompt.toLowerCase().trim();
  
  // Basic enhancement for games
  if (prompt.includes('game') || prompt.includes('tic tac toe')) {
    return `Create a professional, interactive ${userPrompt} with modern design:
    
    **DESIGN REQUIREMENTS:**
    - Dark theme with gradient backgrounds
    - Smooth animations and hover effects
    - Responsive design for mobile and desktop
    - Professional typography and spacing
    - Interactive elements with visual feedback
    
    **FUNCTIONALITY:**
    - Complete game logic with win detection
    - Score tracking and statistics
    - Reset/restart functionality
    - Smooth user interactions
    - Error handling and validation
    
    Create a polished, production-ready web application!`;
  }
  
  return `Create a professional, modern web application: "${userPrompt}" with:
  - Clean, responsive design
  - Interactive functionality
  - Modern CSS animations
  - Professional appearance
  - Mobile-friendly layout`;
}

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Enhance prompt
    prompt = enhancePromptIfNeeded(prompt);
    
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

    if (!genAI) {
      throw new Error('AI service not initialized');
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    
    let aiResponse = response.text();
    
    // Clean up the response to extract JSON
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsedResponse = JSON.parse(jsonMatch[0]);
        const validatedFiles = validateAndFixFiles(parsedResponse.files || {});
        return res.json({ files: validatedFiles });
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
      }
    }
    
    // Fallback response
    const fallbackFiles = validateAndFixFiles({
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
</html>`
    });
    
    return res.json({ files: fallbackFiles });
    
  } catch (error) {
    console.error("Generation error:", error);
    
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
    
    return res.status(503).json({ files: errorFiles });
  }
};
