// hooks/useFileManager.js
import { useState } from 'react';

const useFileManager = () => {
  const [files, setFiles] = useState({
    'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome</title>
    <style>
        body {
            font-family: 'Inter', 'Space Grotesk', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 40px;
            background: linear-gradient(135deg, #0a0a0f 0%, #0f0f14 50%, #16161d 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .welcome {
            text-align: center;
            color: white;
            background: rgba(255,255,255,0.08);
            padding: 40px;
            border-radius: 24px;
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.12);
            box-shadow: 0 8px 32px rgba(0,0,0,0.12);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .welcome:hover {
            transform: translateY(-4px) scale(1.02);
            border-color: rgba(16, 185, 129, 0.3);
            box-shadow: 0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(16, 185, 129, 0.1);
        }
        h1 { font-size: 2.5em; margin-bottom: 20px; }
        p { font-size: 1.2em; opacity: 0.9; }
    </style>
</head>
<body>
    <div class="welcome">
        <h1>🚀 AI Code Generator</h1>
        <p>Enter a prompt to generate your web application!</p>
        <p>Try: "Create a todo app with dark mode" or "Build a calculator with animations"</p>
    </div>
</body>
</html>`,
    'styles.css': '',
    'script.js': ''
  });

  const [activeFile, setActiveFile] = useState('index.html');

  const updateFiles = (newFiles) => {
    setFiles(newFiles);
  };

  const updateFile = (filename, content) => {
    setFiles(prevFiles => ({
      ...prevFiles,
      [filename]: content
    }));
  };

  return {
    files,
    activeFile,
    setActiveFile,
    setFiles,
    updateFiles,
    updateFile
  };
};

export default useFileManager;
