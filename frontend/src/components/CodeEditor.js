// components/CodeEditor.js
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useEditorState } from '../state/editorStateStore';
import Editor, { loader } from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCopy, 
  FiCheck, 
  FiMaximize2, 
  FiMinimize2, 
  FiSearch, 
  FiSettings,
  FiSave,
  FiRotateCcw,
  FiEdit3,
  FiCode,
  FiEye,
  FiEyeOff,
  FiTarget,
  FiZap,
  FiRefreshCw,
  FiBox,
  FiChevronDown,
  FiChevronRight,
  FiDroplet,
  FiColumns,
  FiSliders,
  FiX,
  FiType,
  FiMinus,
  FiPlus,
  FiHash,
  FiMap
} from 'react-icons/fi';

// Configure Monaco loader once at module level
loader.config({
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs'
  }
});

const CodeEditor = React.memo(({ showPreview }) => {
  // Using global state for files and activeFile
  const { files, activeFile, setFiles, setActiveFile, editorState, setEditorState } = useEditorState();
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [monacoError, setMonacoError] = useState(false);

  // Use global editor state - Memoized selectors for performance
  const editorTheme = useMemo(() => editorState.editorTheme, [editorState.editorTheme]);
  const fontSize = useMemo(() => editorState.fontSize, [editorState.fontSize]);
  const unsavedChanges = useMemo(() => editorState.unsavedChanges, [editorState.unsavedChanges]);
  const autoSave = useMemo(() => editorState.autoSave, [editorState.autoSave]);
  const lastSaved = useMemo(() => editorState.lastSaved, [editorState.lastSaved]);
  const selection = useMemo(() => editorState.selection, [editorState.selection]);
  const { setEditorTheme, setFontSize, setUnsavedChanges, setAutoSave, setLastSaved, setSelection, addUnsavedFile, removeUnsavedFile } = useEditorState();
  
  // Advanced editor features state
  const [multiCursorPositions, setMultiCursorPositions] = useState([]);
  const [codeBlocks, setCodeBlocks] = useState({});
  const [foldedRanges, setFoldedRanges] = useState(new Set());
  const [bracketPairs, setBracketPairs] = useState([]);
  const [errorMarkers, setErrorMarkers] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [matchCount, setMatchCount] = useState(0);
  const [currentMatch, setCurrentMatch] = useState(0);
  const [showIntelliSense, setShowIntelliSense] = useState(false);
  const [intelliSensePosition, setIntelliSensePosition] = useState({ line: 0, column: 0 });
  const [definitions, setDefinitions] = useState(new Map());
  const [references, setReferences] = useState(new Map());
  const [wordWrap, setWordWrap] = useState('on');
  const [showMinimap, setShowMinimap] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState('on');
  const [tabSize, setTabSize] = useState(2);
  
  // Enhanced customization state
  const [customThemes, setCustomThemes] = useState({
    'custom-dark': {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: '', foreground: '#d4d4d4', background: '#1e1e1e' },
        { token: 'comment', foreground: '#6a9955', fontStyle: 'italic' },
        { token: 'keyword', foreground: '#569cd6' },
        { token: 'string', foreground: '#ce9178' },
        { token: 'number', foreground: '#b5cea8' }
      ],
      colors: {
        'editor.background': '#1e1e1e',
        'editor.foreground': '#d4d4d4',
        'editor.lineHighlightBackground': '#2d2d30',
        'editorLineNumber.foreground': '#858585',
        'editor.selectionBackground': '#264f78'
      }
    },
    'custom-light': {
      base: 'vs',
      inherit: true,
      rules: [
        { token: '', foreground: '#000000', background: '#ffffff' },
        { token: 'comment', foreground: '#008000', fontStyle: 'italic' },
        { token: 'keyword', foreground: '#0000ff' },
        { token: 'string', foreground: '#a31515' },
        { token: 'number', foreground: '#098658' }
      ],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#000000',
        'editor.lineHighlightBackground': '#f0f0f0',
        'editorLineNumber.foreground': '#237893',
        'editor.selectionBackground': '#add6ff'
      }
    }
  });
  
  const [autoFormat, setAutoFormat] = useState(true);
  const [formatOnSave, setFormatOnSave] = useState(true);
  const [enableLinting, setEnableLinting] = useState(true);
  const [showDiffView, setShowDiffView] = useState(false);
  const [splitViewMode, setSplitViewMode] = useState('single'); // 'single', 'side-by-side', 'diff'
  const [enableMultiCursor, setEnableMultiCursor] = useState(true);
  const [cursorBlinking, setCursorBlinking] = useState('blink');
  const [renderWhitespace, setRenderWhitespace] = useState('selection');
  const [smoothScrolling, setSmoothScrolling] = useState(true);
  const [bracketPairColorization, setBracketPairColorization] = useState(true);
  
  // Refs
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const autoSaveTimeoutRef = useRef(null);
  const findWidgetRef = useRef(null);
  const isInitialized = useRef(false);
  const modelRef = useRef(null);

  const getLanguageFromFile = (filename) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'html': return 'html';
      case 'css': return 'css';
      case 'js': case 'jsx': return 'javascript';
      case 'ts': case 'tsx': return 'typescript';
      case 'json': return 'json';
      case 'md': return 'markdown';
      case 'py': return 'python';
      case 'java': return 'java';
      case 'cpp': case 'c': return 'cpp';
      case 'php': return 'php';
      case 'rb': return 'ruby';
      case 'go': return 'go';
      case 'rs': return 'rust';
      case 'vue': return 'html'; // Vue SFC
      case 'svelte': return 'html'; // Svelte component
      case 'xml': return 'xml';
      case 'yml': case 'yaml': return 'yaml';
      case 'sql': return 'sql';
      case 'sh': return 'shell';
      case 'dockerfile': return 'dockerfile';
      default: return 'plaintext';
    }
  };

  const getFileIcon = (filename) => {
    if (filename.endsWith('.html')) return '📄';
    if (filename.endsWith('.css')) return '🎨';
    if (filename.endsWith('.js')) return '⚡';
    return '📋';
  };

  // Auto-save functionality - FIXED to use helper functions
  useEffect(() => {
    if (autoSave && activeFile && files[activeFile] !== undefined) {
      // Mark file as having unsaved changes
      addUnsavedFile(activeFile);
      
      // Clear existing timeout
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      
      // Set new timeout for auto-save
      autoSaveTimeoutRef.current = setTimeout(() => {
        removeUnsavedFile(activeFile);
        setLastSaved(new Date());
      }, 2000); // Auto-save after 2 seconds of inactivity
    }
    
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [files[activeFile], autoSave, activeFile, addUnsavedFile, removeUnsavedFile, setLastSaved]);

  const handleEditorChange = useCallback((value) => {
    if (value !== undefined && activeFile) {
      setFiles(prevFiles => ({
        ...prevFiles,
        [activeFile]: value
      }));
    }
  }, [activeFile, setFiles]);

  // Utility function to update error markers
  const updateErrorMarkers = useCallback((editor, monaco) => {
    if (!editor || !monaco) return;
    
    const model = editor.getModel();
    if (!model) return;
    
    const language = model.getLanguageId();
    const markers = [];

    // Basic syntax error detection for JavaScript
    if (language === 'javascript') {
      const code = model.getValue();
      const lines = code.split('\n');
      
      lines.forEach((line, index) => {
        // Check for common syntax errors
        if (line.includes('consol.log') || line.includes('console.lg')) {
          markers.push({
            severity: monaco.MarkerSeverity.Error,
            startLineNumber: index + 1,
            startColumn: 1,
            endLineNumber: index + 1,
            endColumn: line.length + 1,
            message: 'Did you mean "console.log"?'
          });
        }
        
        // Check for missing semicolons (basic check)
        if (line.trim().match(/^(let|const|var).*[^;]$/)) {
          markers.push({
            severity: monaco.MarkerSeverity.Warning,
            startLineNumber: index + 1,
            startColumn: line.length,
            endLineNumber: index + 1,
            endColumn: line.length + 1,
            message: 'Missing semicolon'
          });
        }
        
        // Check for unused variables (basic check)
        const unusedVarMatch = line.match(/^\s*(let|const|var)\s+(\w+)/); 
        if (unusedVarMatch && !code.includes(unusedVarMatch[2] + '.') && !code.includes(unusedVarMatch[2] + '(')) {
          const varName = unusedVarMatch[2];
          if (code.split(varName).length === 2) { // Only declared once
            markers.push({
              severity: monaco.MarkerSeverity.Info,
              startLineNumber: index + 1,
              startColumn: unusedVarMatch.index + unusedVarMatch[0].indexOf(varName) + 1,
              endLineNumber: index + 1,
              endColumn: unusedVarMatch.index + unusedVarMatch[0].indexOf(varName) + varName.length + 1,
              message: `Variable '${varName}' is declared but never used`
            });
          }
        }
      });
    }
    
    // Set markers on the model
    monaco.editor.setModelMarkers(model, 'owner', markers);
    setErrorMarkers(markers);
  }, []);

  const handleEditorDidMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    isInitialized.current = true;

    // Force dark theme immediately after mount
    monaco.editor.setTheme('vs-dark');

    // Initialize editor with selection
    if (selection) {
      editor.setSelection(selection);
    }

    // Event to track selection changes - debounced to prevent excessive updates
    let selectionTimeout;
    editor.onDidChangeCursorSelection(e => {
      clearTimeout(selectionTimeout);
      selectionTimeout = setTimeout(() => {
        setSelection(e.selection);
        setEditorState({ selection: e.selection });
      }, 100);
    });
    
    // Register custom themes only once
    Object.entries(customThemes).forEach(([themeName, themeData]) => {
      try {
        monaco.editor.defineTheme(themeName, themeData);
      } catch (error) {
        console.warn(`Theme ${themeName} already registered:`, error);
      }
    });
    
    // Add custom keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      manualSave();
    });
    
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF, () => {
      editor.getAction('actions.find').run();
    });
    
    // Add format document shortcut
    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, () => {
      formatCode();
    });
    
    // Add go to definition shortcut
    editor.addCommand(monaco.KeyCode.F12, () => {
      editor.getAction('editor.action.revealDefinition').run();
    });
    
    // Add multi-cursor shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyD, () => {
      editor.getAction('editor.action.addSelectionToNextFindMatch').run();
    });
    
    // Add toggle comment shortcut
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Slash, () => {
      editor.getAction('editor.action.commentLine').run();
    });
    
    // Configure TypeScript/JavaScript defaults only once
    try {
      monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.Latest,
        allowNonTsExtensions: true,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        module: monaco.languages.typescript.ModuleKind.CommonJS,
        noEmit: true,
        esModuleInterop: true,
        jsx: monaco.languages.typescript.JsxEmit.React,
        reactNamespace: 'React',
        allowJs: true,
        typeRoots: ['node_modules/@types']
      });
      
      // Enable JavaScript and TypeScript suggestions
      monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false
      });
      
      // Add custom completion provider for better IntelliSense
      monaco.languages.registerCompletionItemProvider('javascript', {
        provideCompletionItems: (model, position) => {
          const suggestions = [
            {
              label: 'console.log',
              kind: monaco.languages.CompletionItemKind.Function,
              insertText: 'console.log(${1});',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Log a message to the console'
            },
            {
              label: 'function',
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: 'function ${1:name}(${2:params}) {\n\t${3}\n}',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Create a new function'
            },
            {
              label: 'arrow function',
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: 'const ${1:name} = (${2:params}) => {\n\t${3}\n};',
              insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
              documentation: 'Create an arrow function'
            }
          ];
          return { suggestions };
        }
      });
    } catch (error) {
      console.warn('Monaco language configuration already set:', error);
    }
    
    // Add error and warning markers - debounced to improve performance
    let contentChangeTimeout;
    const contentChangeListener = editor.onDidChangeModelContent(() => {
      clearTimeout(contentChangeTimeout);
      contentChangeTimeout = setTimeout(() => {
        if (enableLinting) {
          updateErrorMarkers(editor, monaco);
        }
      }, 500);
    });
    
    // Track cursor position for IntelliSense - debounced
    let cursorTimeout;
    const cursorChangeListener = editor.onDidChangeCursorPosition((e) => {
      clearTimeout(cursorTimeout);
      cursorTimeout = setTimeout(() => {
        setIntelliSensePosition({ line: e.position.lineNumber, column: e.position.column });
      }, 200);
    });
    
    // Store disposables for cleanup
    editorRef.current._disposables = [
      contentChangeListener,
      cursorChangeListener
    ];
  }, [customThemes, enableLinting, updateErrorMarkers]);

  const manualSave = () => {
    removeUnsavedFile(activeFile);
    setLastSaved(new Date());
  };

  const formatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(files[activeFile]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Advanced formatting function with Prettier-like behavior
  const formatCodeAdvanced = useCallback(async () => {
    if (!editorRef.current || !activeFile) return;
    
    const editor = editorRef.current;
    const model = editor.getModel();
    const language = getLanguageFromFile(activeFile);
    let formattedCode = model.getValue();
    
    try {
      // Basic formatting for different file types
      if (language === 'javascript') {
        // Simple JavaScript formatting
        formattedCode = formattedCode
          .replace(/;\s*}/g, ';\n}')
          .replace(/{\s*([^}])/g, '{\n  $1')
          .replace(/([^{])\s*}/g, '$1\n}')
          .replace(/,\s*([^\s])/g, ', $1')
          .replace(/([^\s])\s*{/g, '$1 {')
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0)
          .map((line, index, arr) => {
            let indent = 0;
            for (let i = 0; i < index; i++) {
              if (arr[i].includes('{')) indent++;
              if (arr[i].includes('}')) indent--;
            }
            if (line.includes('}')) indent--;
            return '  '.repeat(Math.max(0, indent)) + line;
          })
          .join('\n');
      } else if (language === 'css') {
        // Simple CSS formatting
        formattedCode = formattedCode
          .replace(/{/g, ' {\n  ')
          .replace(/}/g, '\n}\n')
          .replace(/;/g, ';\n  ')
          .replace(/,/g, ',\n')
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0)
          .join('\n');
      } else if (language === 'html') {
        // Simple HTML formatting
        formattedCode = formattedCode
          .replace(/></g, '>\n<')
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0)
          .map((line, index, arr) => {
            let indent = 0;
            for (let i = 0; i < index; i++) {
              if (arr[i].match(/<[^/][^>]*[^/]>/)) indent++;
              if (arr[i].match(/<\/[^>]*>/)) indent--;
            }
            if (line.match(/<\/[^>]*>/)) indent--;
            return '  '.repeat(Math.max(0, indent)) + line;
          })
          .join('\n');
      }
      
      // Apply formatting to editor
      const selection = editor.getSelection();
      editor.executeEdits('format', [{
        range: model.getFullModelRange(),
        text: formattedCode
      }]);
      
      if (selection) {
        editor.setSelection(selection);
      }
      
    } catch (error) {
      console.error('Formatting error:', error);
      // Fallback to Monaco's built-in formatter
      editor.getAction('editor.action.formatDocument').run();
    }
  }, [activeFile, getLanguageFromFile]);

  // Split view functionality
  const toggleSplitView = useCallback(() => {
    setSplitViewMode(prev => {
      switch (prev) {
        case 'single': return 'side-by-side';
        case 'side-by-side': return 'diff';
        case 'diff': return 'single';
        default: return 'single';
      }
    });
  }, []);

  // Quick actions for common operations
  const quickActions = {
    duplicateLine: () => {
      if (editorRef.current) {
        editorRef.current.getAction('editor.action.copyLinesDownAction').run();
      }
    },
    deleteLine: () => {
      if (editorRef.current) {
        editorRef.current.getAction('editor.action.deleteLines').run();
      }
    },
    moveLinesUp: () => {
      if (editorRef.current) {
        editorRef.current.getAction('editor.action.moveLinesUpAction').run();
      }
    },
    moveLinesDown: () => {
      if (editorRef.current) {
        editorRef.current.getAction('editor.action.moveLinesDownAction').run();
      }
    },
    selectAll: () => {
      if (editorRef.current) {
        editorRef.current.getAction('editor.action.selectAll').run();
      }
    },
    undo: () => {
      if (editorRef.current) {
        editorRef.current.getAction('undo').run();
      }
    },
    redo: () => {
      if (editorRef.current) {
        editorRef.current.getAction('redo').run();
      }
    }
  };

  // Cleanup effect - IMPROVED cleanup
  useEffect(() => {
    return () => {
      // Cleanup timeouts
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      
      // Cleanup Monaco editor instances and listeners
      if (editorRef.current && editorRef.current._disposables) {
        editorRef.current._disposables.forEach(disposable => {
          try {
            disposable.dispose();
          } catch (error) {
            console.warn('Error disposing Monaco listener:', error);
          }
        });
      }
      
      // Dispose model if exists
      if (modelRef.current) {
        try {
          modelRef.current.dispose();
        } catch (error) {
          console.warn('Error disposing Monaco model:', error);
        }
      }
      
      // Reset initialization flag when component unmounts
      isInitialized.current = false;
    };
  }, []);
  
  // Sync model content and editor settings from state - FIXED to prevent infinite loops
  useEffect(() => {
    if (editorRef.current && monacoRef.current && activeFile) {
      const editor = editorRef.current;
      const monaco = monacoRef.current;
      const currentModel = editor.getModel();
      const newLanguage = getLanguageFromFile(activeFile);
      const newContent = files[activeFile] || '';

      // Only update if the language has changed or there's no model
      if (!currentModel || currentModel.getLanguageId() !== newLanguage) {
        if (modelRef.current && modelRef.current !== currentModel) {
          modelRef.current.dispose();
        }
        const newModel = monaco.editor.createModel(newContent, newLanguage);
        modelRef.current = newModel;
        editor.setModel(newModel);
      } else if (currentModel) {
        // Only update content if it's significantly different to avoid cursor jumping
        const currentContent = currentModel.getValue();
        if (currentContent !== newContent && !editor.hasTextFocus()) {
          // Preserve cursor position
          const position = editor.getPosition();
          const selection = editor.getSelection();
          
          currentModel.setValue(newContent);
          
          // Restore cursor position if valid
          if (position && position.lineNumber <= currentModel.getLineCount()) {
            editor.setPosition(position);
          }
          if (selection) {
            editor.setSelection(selection);
          }
        }
      }
    }
  }, [activeFile, getLanguageFromFile]); // Removed files and editorState from dependencies
  
  // Debug information (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('CodeEditor render:', {
      activeFile,
      hasFiles: Object.keys(files).length > 0,
      isInitialized: isInitialized.current,
      showPreview
    });
  }
  
  // Memoize editor options to prevent unnecessary re-renders
  const editorOptions = React.useMemo(() => ({
    fontSize,
    lineNumbers: showLineNumbers,
    minimap: { enabled: showMinimap },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize,
    wordWrap,
    folding: true,
    bracketMatching: 'always',
    autoIndent: 'full',
    formatOnPaste: autoFormat,
    formatOnType: autoFormat,
    readOnly: false,
    domReadOnly: false,
    selectOnLineNumbers: true,
    roundedSelection: false,
    cursorStyle: 'line',
    renderWhitespace,
    cursorBlinking,
    smoothScrolling,
    'bracketPairColorization.enabled': bracketPairColorization,
    // Performance optimizations
    scrollbar: {
      useShadows: false,
      verticalHasArrows: false,
      horizontalHasArrows: false,
      vertical: 'visible',
      horizontal: 'visible'
    },
    // Reduce layout calculations
    glyphMargin: false,
    lineDecorationsWidth: 0,
    lineNumbersMinChars: 3,
    // Optimize rendering
    renderValidationDecorations: 'on',
    renderLineHighlight: 'line',
    codeLens: false
  }), [fontSize, showLineNumbers, showMinimap, tabSize, wordWrap, autoFormat, renderWhitespace, cursorBlinking, smoothScrolling, bracketPairColorization]);
  
  // Single Monaco Editor instance - FIXED to prevent re-mounting with proper dark theme
  const MonacoEditor = React.useMemo(() => {
    return (
      <Editor
        height="100%"
        defaultLanguage={getLanguageFromFile(activeFile)}
        defaultValue={files[activeFile] || ''}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme="vs-dark" // Force dark theme
        loading={<div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: 'rgba(255,255,255,0.7)',
          fontSize: '14px',
          background: '#1e1e1e'
        }}>Loading Monaco Editor...</div>}
        options={{
          ...editorOptions,
          theme: 'vs-dark' // Ensure dark theme in options too
        }}
        // Prevent re-mounting by not using activeFile as key
      />
    );
  }, [editorOptions]); // Removed editorTheme from deps to force dark theme

  return (
    <div 
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: '400px',
        backgroundColor: '#1e1e1e',
        position: 'relative'
      }} 
      className={isFullscreen ? 'fullscreen-editor' : ''}
      // Remove key to prevent re-mounting
    >
      <div style={{
        padding: '12px 20px',
        background: 'linear-gradient(135deg, rgba(15, 16, 20, 0.98) 0%, rgba(20, 21, 26, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '#ffffff',
        minHeight: '48px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '8px' }}>
            {getFileIcon(activeFile)}
          </span>
          <span style={{ fontWeight: '500' }}>{activeFile}</span>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`editor-toolbar-btn ${showSettings ? 'active' : ''}`}
            title="Editor Settings"
            style={{
              padding: '6px 10px',
              background: showSettings ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '6px',
              color: showSettings ? '#10b981' : 'rgba(255,255,255,0.8)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <FiSettings size={14}/>
          </button>
          
          <button 
            onClick={formatCodeAdvanced}
            title="Format Code (Alt+Shift+F)"
            style={{
              padding: '6px 10px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '6px',
              color: 'rgba(255,255,255,0.8)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <FiCode size={14}/>
          </button>
          
          <button 
            onClick={toggleSplitView}
            title="Toggle Split View"
            style={{
              padding: '6px 10px',
              background: splitViewMode !== 'single' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '6px',
              color: splitViewMode !== 'single' ? '#10b981' : 'rgba(255,255,255,0.8)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <FiColumns size={14}/>
          </button>
          
          <button
            onClick={copyToClipboard}
            title="Copy to Clipboard"
            style={{
              padding: '6px 12px',
              background: copied 
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                : 'rgba(255,255,255,0.1)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.3s ease'
            }}
          >
            {copied ? (
              <>
                <FiCheck size={14}/>
                <span>Copied!</span>
              </>
            ) : (
              <>
                <FiCopy size={14}/>
                <span>Copy</span>
              </>
            )}
          </button>
          
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen (F11)' : 'Enter Fullscreen (F11)'}
            style={{
              padding: '6px 10px',
              background: isFullscreen ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '6px',
              color: isFullscreen ? '#10b981' : 'rgba(255,255,255,0.8)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {isFullscreen ? <FiMinimize2 size={14}/> : <FiMaximize2 size={14}/>}
          </button>
        </div>
      </div>

      {showSettings && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="editor-settings"
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h4 style={{ 
              margin: 0, 
              color: '#ffffff', 
              fontSize: '16px', 
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <FiSliders size={16}/>
              Editor Settings
            </h4>
            <button 
              onClick={() => setShowSettings(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.6)',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <FiX size={14}/>
            </button>
          </div>

          <div className="editor-settings-grid">
            {/* Appearance Settings */}
            <div className="editor-setting-item">
              <label><FiDroplet size={12}/> Theme:</label>
              <select 
                value={editorTheme} 
                onChange={(e) => setEditorTheme(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#ffffff',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}
              >
                <option value="vs-dark">VS Dark (Default)</option>
                <option value="vs">VS Light</option>
                <option value="custom-dark">Custom Dark</option>
                <option value="custom-light">Custom Light</option>
              </select>
            </div>

            <div className="editor-setting-item">
              <label><FiType size={12}/> Font Size:</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button 
                  onClick={() => setFontSize(prev => Math.max(8, prev - 1))}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#ffffff',
                    width: '24px',
                    height: '24px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <FiMinus size={10}/>
                </button>
                <input 
                  type="number" 
                  value={fontSize} 
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  min="8"
                  max="32"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#ffffff',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    width: '50px',
                    textAlign: 'center'
                  }}
                />
                <button 
                  onClick={() => setFontSize(prev => Math.min(32, prev + 1))}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#ffffff',
                    width: '24px',
                    height: '24px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <FiPlus size={10}/>
                </button>
              </div>
            </div>

            <div className="editor-setting-item">
              <label><FiHash size={12}/> Tab Size:</label>
              <select 
                value={tabSize} 
                onChange={(e) => setTabSize(Number(e.target.value))}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#ffffff',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}
              >
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
                <option value={8}>8 spaces</option>
              </select>
            </div>

            <div className="editor-setting-item">
              <label>Word Wrap:</label>
              <select 
                value={wordWrap} 
                onChange={(e) => setWordWrap(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#ffffff',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}
              >
                <option value="on">On</option>
                <option value="off">Off</option>
                <option value="wordWrapColumn">At Column</option>
              </select>
            </div>

            <div className="editor-setting-item">
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiMap size={12}/> 
                Minimap:
                <input 
                  type="checkbox" 
                  checked={showMinimap} 
                  onChange={() => setShowMinimap(p => !p)}
                  style={{
                    width: '16px',
                    height: '16px',
                    accentColor: '#10b981'
                  }}
                />
              </label>
            </div>

            <div className="editor-setting-item">
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiHash size={12}/> 
                Line Numbers:
                <input 
                  type="checkbox" 
                  checked={showLineNumbers === 'on'} 
                  onChange={() => setShowLineNumbers(p => p === 'on' ? 'off' : 'on')}
                  style={{
                    width: '16px',
                    height: '16px',
                    accentColor: '#10b981'
                  }}
                />
              </label>
            </div>

            <div className="editor-setting-item">
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                Auto Format:
                <input 
                  type="checkbox" 
                  checked={autoFormat} 
                  onChange={() => setAutoFormat(p => !p)}
                  style={{
                    width: '16px',
                    height: '16px',
                    accentColor: '#10b981'
                  }}
                />
              </label>
            </div>

            <div className="editor-setting-item">
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                Bracket Colorization:
                <input 
                  type="checkbox" 
                  checked={bracketPairColorization} 
                  onChange={() => setBracketPairColorization(p => !p)}
                  style={{
                    width: '16px',
                    height: '16px',
                    accentColor: '#10b981'
                  }}
                />
              </label>
            </div>

            <div className="editor-setting-item">
              <label>Cursor Blinking:</label>
              <select 
                value={cursorBlinking} 
                onChange={(e) => setCursorBlinking(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#ffffff',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}
              >
                <option value="blink">Blink</option>
                <option value="smooth">Smooth</option>
                <option value="phase">Phase</option>
                <option value="expand">Expand</option>
                <option value="solid">Solid</option>
              </select>
            </div>

            <div className="editor-setting-item">
              <label>Render Whitespace:</label>
              <select 
                value={renderWhitespace} 
                onChange={(e) => setRenderWhitespace(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#ffffff',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}
              >
                <option value="none">None</option>
                <option value="boundary">Boundary</option>
                <option value="selection">Selection</option>
                <option value="all">All</option>
              </select>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <h5 style={{ 
              margin: '0 0 12px 0', 
              color: 'rgba(255,255,255,0.8)', 
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <FiZap size={12}/>
              Quick Actions
            </h5>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => quickActions.selectAll()}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'rgba(255,255,255,0.8)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  transition: 'all 0.2s ease'
                }}
              >
                Select All
              </button>
              <button
                onClick={() => quickActions.duplicateLine()}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'rgba(255,255,255,0.8)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  transition: 'all 0.2s ease'
                }}
              >
                Duplicate Line
              </button>
              <button
                onClick={() => quickActions.deleteLine()}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'rgba(255,255,255,0.8)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  transition: 'all 0.2s ease'
                }}
              >
                Delete Line
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {monacoError ? (
          // Fallback textarea if Monaco fails to load
          <textarea
            value={files[activeFile] || ''}
            onChange={(e) => handleEditorChange(e.target.value)}
            style={{
              width: '100%',
              height: '100%',
              background: '#1e1e1e',
              color: '#ffffff',
              border: 'none',
              outline: 'none',
              padding: '16px',
              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
              fontSize: '14px',
              lineHeight: '1.6',
              resize: 'none',
              tabSize: 2
            }}
            placeholder={`Start editing ${activeFile}...`}
          />
        ) : (MonacoEditor)}
      </div>
    </div>
  );
});

export default CodeEditor;
