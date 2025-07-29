// hooks/useAIGenerator.js
import { useState } from 'react';

const useAIGenerator = () => {
  const [isLoading, setIsLoading] = useState(false);

  const generateCode = async (prompt) => {
    if (!prompt.trim()) return null;
    
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      // Demo response - replace with actual API call
      const demoFiles = {
        'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated: ${prompt}</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>🤖 AI Generated Project</h1>
        <p><strong>Your Prompt:</strong> ${prompt}</p>
        <p>This is a demo response. The actual AI integration will generate real code based on your prompt.</p>
        <button onclick="showAlert()" class="demo-btn">Click Me!</button>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
        'styles.css': `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.container {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    text-align: center;
    max-width: 600px;
    animation: fadeIn 0.8s ease-out;
}

h1 {
    color: #333;
    margin-bottom: 20px;
    font-size: 2.5rem;
}

p {
    color: #666;
    line-height: 1.6;
    margin-bottom: 15px;
}

.demo-btn {
    background: linear-gradient(45deg, #667eea, #764ba2);
    color: white;
    border: none;
    padding: 15px 30px;
    border-radius: 25px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    margin-top: 20px;
}

.demo-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}`,
        'script.js': `// Generated JavaScript for: ${prompt}
console.log('🚀 AI Generated Project Loaded!');
console.log('Prompt:', '${prompt}');

function showAlert() {
    alert('🎉 This is a demo response! The actual AI will generate real, functional code based on your specific prompt.');
}

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.container');
    
    // Add a subtle floating animation
    let start = Date.now();
    function animate() {
        const elapsed = Date.now() - start;
        const y = Math.sin(elapsed * 0.001) * 2;
        container.style.transform = \`translateY(\${y}px)\`;
        requestAnimationFrame(animate);
    }
    animate();
    
    console.log('✨ Interactive effects loaded!');
});`
      };
      
      setIsLoading(false);
      return demoFiles;
    } catch (error) {
      console.error("Error generating code:", error);
      setIsLoading(false);
      return null;
    }
  };

  return {
    generateCode,
    isLoading
  };
};

export default useAIGenerator;
