// state/editorStateStore.js
import React, { createContext, useContext, useState, useRef, useCallback } from 'react';

// Create the context
const EditorStateContext = createContext();

// Initial editor state
const initialEditorState = {
  editorTheme: 'vs-dark',
  fontSize: 14,
  autoSave: true,
  lastSaved: null,
  unsavedChanges: new Set(),
  selection: null,
  cursorPosition: { lineNumber: 1, column: 1 },
  scrollPosition: { scrollTop: 0, scrollLeft: 0 },
  viewState: null, // Monaco editor view states for different files
  undoStack: [],
  redoStack: []
};

// Initial file state
const initialFileState = {
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
};

// Provider component
export const EditorStateProvider = ({ children }) => {
  // File management state
  const [files, setFiles] = useState(initialFileState);
  const [activeFile, setActiveFile] = useState('index.html');
  
  // Editor state
  const [editorState, setEditorStateInternal] = useState(initialEditorState);
  
  // File-specific editor states (view states, selections, etc.)
  const fileStates = useRef(new Map());
  
  // Store view states for each file to restore cursor position, scroll, etc.
  const saveFileState = useCallback((filename, state) => {
    if (!filename) return;
    
    const currentState = fileStates.current.get(filename) || {};
    fileStates.current.set(filename, {
      ...currentState,
      ...state,
      lastModified: Date.now()
    });
  }, []);
  
  const getFileState = useCallback((filename) => {
    if (!filename) return null;
    return fileStates.current.get(filename) || null;
  }, []);
  
  // Enhanced setEditorState that preserves file-specific states and handles Set objects
  const setEditorState = useCallback((newState) => {
    setEditorStateInternal(prevState => {
      const updatedState = typeof newState === 'function' 
        ? newState(prevState) 
        : { ...prevState, ...newState };
      
      // Ensure unsavedChanges is always a Set
      if (updatedState.unsavedChanges && !(updatedState.unsavedChanges instanceof Set)) {
        updatedState.unsavedChanges = new Set(Array.isArray(updatedState.unsavedChanges) ? updatedState.unsavedChanges : []);
      }
      
      // Save current file state if activeFile exists
      if (activeFile && (newState.selection || newState.cursorPosition || newState.scrollPosition)) {
        saveFileState(activeFile, {
          selection: newState.selection || prevState.selection,
          cursorPosition: newState.cursorPosition || prevState.cursorPosition,
          scrollPosition: newState.scrollPosition || prevState.scrollPosition,
          viewState: newState.viewState || prevState.viewState
        });
      }
      
      return updatedState;
    });
  }, [activeFile, saveFileState]);
  
  // Helper functions for common editor state operations
  const editorHelpers = {
    // Theme management
    setEditorTheme: (theme) => setEditorState({ editorTheme: theme }),
    
    // Font size management
    setFontSize: (size) => setEditorState({ fontSize: size }),
    
    // Auto-save management
    setAutoSave: (enabled) => setEditorState({ autoSave: enabled }),
    setLastSaved: (date) => setEditorState({ lastSaved: date }),
    
    // Unsaved changes management with Set safety checks
    setUnsavedChanges: (changes) => {
      const safeChanges = changes instanceof Set ? changes : new Set(Array.isArray(changes) ? changes : []);
      setEditorState({ unsavedChanges: safeChanges });
    },
    addUnsavedFile: (filename) => {
      setEditorState(prevState => {
        // Ensure prevState.unsavedChanges is a Set
        const currentChanges = prevState.unsavedChanges instanceof Set 
          ? prevState.unsavedChanges 
          : new Set(Array.isArray(prevState.unsavedChanges) ? prevState.unsavedChanges : []);
        return {
          unsavedChanges: new Set([...currentChanges, filename])
        };
      });
    },
    removeUnsavedFile: (filename) => {
      setEditorState(prevState => {
        // Ensure prevState.unsavedChanges is a Set
        const currentChanges = prevState.unsavedChanges instanceof Set 
          ? prevState.unsavedChanges 
          : new Set(Array.isArray(prevState.unsavedChanges) ? prevState.unsavedChanges : []);
        const newSet = new Set(currentChanges);
        newSet.delete(filename);
        return { unsavedChanges: newSet };
      });
    },
    
    // Selection and cursor management
    setSelection: (selection) => setEditorState({ selection }),
    setCursorPosition: (position) => setEditorState({ cursorPosition: position }),
    setScrollPosition: (position) => setEditorState({ scrollPosition: position }),
    setViewState: (viewState) => setEditorState({ viewState }),
    
    // Undo/Redo stack management
    pushUndo: (action) => {
      setEditorState(prevState => ({
        undoStack: [...prevState.undoStack, action],
        redoStack: [] // Clear redo stack when new action is performed
      }));
    },
    pushRedo: (action) => {
      setEditorState(prevState => ({
        redoStack: [...prevState.redoStack, action]
      }));
    },
    popUndo: () => {
      setEditorState(prevState => {
        if (prevState.undoStack.length === 0) return prevState;
        const newUndoStack = [...prevState.undoStack];
        const lastAction = newUndoStack.pop();
        return {
          undoStack: newUndoStack,
          redoStack: [...prevState.redoStack, lastAction]
        };
      });
    },
    popRedo: () => {
      setEditorState(prevState => {
        if (prevState.redoStack.length === 0) return prevState;
        const newRedoStack = [...prevState.redoStack];
        const lastAction = newRedoStack.pop();
        return {
          redoStack: newRedoStack,
          undoStack: [...prevState.undoStack, lastAction]
        };
      });
    },
    clearUndoRedo: () => {
      setEditorState({ undoStack: [], redoStack: [] });
    }
  };
  
  // Enhanced file management with state preservation
  const setActiveFileWithStateRestore = useCallback((filename) => {
    if (!filename || filename === activeFile) return;
    
    // Save current file state before switching
    if (activeFile) {
      saveFileState(activeFile, {
        selection: editorState.selection,
        cursorPosition: editorState.cursorPosition,
        scrollPosition: editorState.scrollPosition,
        viewState: editorState.viewState
      });
    }
    
    // Switch to new file
    setActiveFile(filename);
    
    // Restore state for new file
    const newFileState = getFileState(filename);
    if (newFileState) {
      setEditorState({
        selection: newFileState.selection,
        cursorPosition: newFileState.cursorPosition || { lineNumber: 1, column: 1 },
        scrollPosition: newFileState.scrollPosition || { scrollTop: 0, scrollLeft: 0 },
        viewState: newFileState.viewState
      });
    } else {
      // Reset to defaults for new file
      setEditorState({
        selection: null,
        cursorPosition: { lineNumber: 1, column: 1 },
        scrollPosition: { scrollTop: 0, scrollLeft: 0 },
        viewState: null
      });
    }
  }, [activeFile, editorState, saveFileState, getFileState, setEditorState]);
  
  // Enhanced file content update with change tracking
  const setFilesWithChangeTracking = useCallback((newFiles) => {
    if (typeof newFiles === 'function') {
      setFiles(prevFiles => {
        const updatedFiles = newFiles(prevFiles);
        // Track which files have changed
        Object.keys(updatedFiles).forEach(filename => {
          if (prevFiles[filename] !== updatedFiles[filename]) {
            editorHelpers.addUnsavedFile(filename);
          }
        });
        return updatedFiles;
      });
    } else {
      setFiles(prevFiles => {
        // Track which files have changed
        Object.keys(newFiles).forEach(filename => {
          if (prevFiles[filename] !== newFiles[filename]) {
            editorHelpers.addUnsavedFile(filename);
          }
        });
        return newFiles;
      });
    }
  }, []);
  
  const contextValue = {
    // File state
    files,
    activeFile,
    setFiles: setFilesWithChangeTracking,
    setActiveFile: setActiveFileWithStateRestore,
    
    // Editor state
    editorState,
    setEditorState,
    
    // File state management
    saveFileState,
    getFileState,
    fileStates: fileStates.current,
    
    // Helper functions
    ...editorHelpers
  };
  
  return (
    <EditorStateContext.Provider value={contextValue}>
      {children}
    </EditorStateContext.Provider>
  );
};

// Custom hook to use the editor state
export const useEditorState = () => {
  const context = useContext(EditorStateContext);
  if (!context) {
    throw new Error('useEditorState must be used within an EditorStateProvider');
  }
  return context;
};

// Selectors for specific parts of the state
export const useFiles = () => {
  const { files, setFiles } = useEditorState();
  return { files, setFiles };
};

export const useActiveFile = () => {
  const { activeFile, setActiveFile } = useEditorState();
  return { activeFile, setActiveFile };
};

export const useEditorSettings = () => {
  const { editorState, setEditorTheme, setFontSize } = useEditorState();
  return {
    editorTheme: editorState.editorTheme,
    fontSize: editorState.fontSize,
    setEditorTheme,
    setFontSize
  };
};

export const useEditorSelection = () => {
  const { editorState, setSelection, setCursorPosition } = useEditorState();
  return {
    selection: editorState.selection,
    cursorPosition: editorState.cursorPosition,
    setSelection,
    setCursorPosition
  };
};

export const useUndoRedo = () => {
  const { editorState, pushUndo, pushRedo, popUndo, popRedo, clearUndoRedo } = useEditorState();
  return {
    undoStack: editorState.undoStack,
    redoStack: editorState.redoStack,
    canUndo: editorState.undoStack.length > 0,
    canRedo: editorState.redoStack.length > 0,
    pushUndo,
    pushRedo,
    popUndo,
    popRedo,
    clearUndoRedo
  };
};
