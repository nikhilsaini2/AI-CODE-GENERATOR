// components/EditorPage.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import PromptPanel from './PromptPanel';
import CodeEditor from './CodeEditor';
import PreviewPanel from './PreviewPanel';
import PublishPanel from './PublishPanel';
import { useEditorState } from '../state/editorStateStore';
import FileExplorer from './FileExplorer';
import useAIGenerator from '../hooks/useAIGenerator';
import usePromptHistory from '../hooks/usePromptHistory';
import { downloadProject, runProjectInNewTab } from '../utils/fileUtils';

function EditorPage() {
  const [showPreview, setShowPreview] = useState(false);
  const [showToggleNotification, setShowToggleNotification] = useState(false);
  const [showPublishPanel, setShowPublishPanel] = useState(false);
  const [showPromptPanel, setShowPromptPanel] = useState(true);
  
  const { files, activeFile, setActiveFile, setFiles } = useEditorState();
  const { generateCode, isLoading } = useAIGenerator();
  const { 
    history: promptHistory, 
    currentPrompt: prompt, 
    setCurrentPrompt: setPrompt,
    addToHistory,
    selectFromHistory
  } = usePromptHistory();

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Toggle preview (Cmd/Ctrl + K)
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setShowPreview(prev => !prev);
        setShowToggleNotification(true);
        setTimeout(() => setShowToggleNotification(false), 1500);
      }
      // Toggle prompt panel (Cmd/Ctrl + P)
      if ((event.metaKey || event.ctrlKey) && event.key === 'p') {
        event.preventDefault();
        setShowPromptPanel(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    addToHistory(prompt);
    
    const newFiles = await generateCode(prompt);
    if (newFiles) {
      setFiles(newFiles);
    }
  };

  const handleSelectFromHistory = (historyPrompt) => {
    selectFromHistory(historyPrompt);
  };

  const handleDownloadProject = () => {
    downloadProject(files);
  };

  const handleRunProject = () => {
    runProjectInNewTab(files);
  };

  return (
    <motion.div 
      style={{
        height: '100vh',
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        color: '#ffffff',
        fontFamily: 'var(--font-body)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Subtle Animated Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        opacity: 0.3
      }}>
        <motion.div
          style={{
            position: 'absolute',
            top: '15%',
            left: '5%',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(30px)'
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          style={{
            position: 'absolute',
            bottom: '20%',
            right: '10%',
            width: '250px',
            height: '250px',
            background: 'radial-gradient(circle, rgba(22, 163, 74, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(35px)'
          }}
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            scale: [1, 0.9, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      <Header 
        showPreview={showPreview}
        setShowPreview={setShowPreview}
        onRunProject={handleRunProject}
        onDownloadProject={handleDownloadProject}
        files={files}
        showPublishPanel={showPublishPanel}
        setShowPublishPanel={setShowPublishPanel}
        showPromptPanel={showPromptPanel}
        setShowPromptPanel={setShowPromptPanel}
      />
      
      {/* Main Editor Layout - Modern 3-Panel Design */}
      <div style={{ 
        display: 'flex', 
        flex: 1,
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1,
        marginTop: '84px',
        background: 'rgba(15, 16, 20, 0.95)',
        backdropFilter: 'blur(20px)'
      }}>
        
        {/* Left Panel - File Explorer (Full Height) */}
        <motion.div 
          style={{
            width: '280px',
            background: 'linear-gradient(145deg, rgba(12, 13, 16, 0.98) 0%, rgba(16, 17, 22, 0.95) 100%)',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '2px 0 20px rgba(0, 0, 0, 0.3)'
          }}
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* File Explorer Header */}
          <div style={{
            padding: '20px 20px 16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            background: 'rgba(255, 255, 255, 0.02)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px'
            }}>
              <div style={{
                width: '16px',
                height: '16px',
                background: 'linear-gradient(135deg, #10b981 0%, #16a34a 100%)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ fontSize: '8px', color: 'white' }}>📁</span>
              </div>
              <span style={{
                fontSize: '14px',
                fontWeight: '600',
                color: 'rgba(255, 255, 255, 0.9)'
              }}>
                Project Files
              </span>
            </div>
            <div style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.5)',
              fontWeight: '400'
            }}>
              {Object.keys(files).length} files • {activeFile || 'No file selected'}
            </div>
          </div>

          {/* File Explorer Content */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <FileExplorer 
              files={files}
              activeFile={activeFile}
              setActiveFile={setActiveFile}
              setFiles={setFiles}
              onDuplicateFile={() => {/* Duplicate logic */}}
              onMoveFile={() => {/* Move logic */}}
            />
          </div>
        </motion.div>

        {/* Center Panel - Code Editor */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: 'rgba(18, 19, 24, 0.98)',
          position: 'relative',
          opacity: showPreview ? 0.3 : 1,
          pointerEvents: showPreview ? 'none' : 'all',
          transition: 'all 0.3s ease'
        }}>
          {/* Code Editor Content */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <CodeEditor 
              showPreview={showPreview}
            />
          </div>
        </div>

        {/* Right Panel - AI Prompt (Collapsible) */}
        <AnimatePresence>
          {showPromptPanel && (
            <motion.div 
              style={{
                width: '320px',
                background: 'linear-gradient(145deg, rgba(12, 13, 16, 0.98) 0%, rgba(16, 17, 22, 0.95) 100%)',
                borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '-2px 0 20px rgba(0, 0, 0, 0.3)'
              }}
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <PromptPanel 
                prompt={prompt}
                setPrompt={setPrompt}
                onGenerate={handleGenerate}
                isLoading={isLoading}
                files={files}
                activeFile={activeFile}
                setActiveFile={setActiveFile}
                promptHistory={promptHistory}
                onSelectFromHistory={handleSelectFromHistory}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Preview Panel - Centered over code editor */}
        <AnimatePresence>
          {showPreview && (
            <motion.div 
              style={{
                position: 'absolute',
                top: 0,
                left: '280px', // Start after file explorer
                right: showPromptPanel ? '320px' : '0', // End before AI panel if visible
                height: '100%',
                background: 'rgba(20, 21, 26, 0.98)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                overflow: 'hidden',
                zIndex: 10,
                boxShadow: '0 0 30px rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(20px)'
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <PreviewPanel 
                files={files}
                onRunProject={handleRunProject}
                showPreview={showPreview}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Publish Panel - Slides in from right */}
        <PublishPanel
          files={files}
          projectName="AI Generated Project"
          isVisible={showPublishPanel}
          onClose={() => setShowPublishPanel(false)}
        />
      </div>

      {/* Keyboard Shortcuts Notification */}
      <AnimatePresence>
        {showToggleNotification && (
          <motion.div 
            style={{
              position: 'fixed',
              top: '100px',
              right: '20px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.95) 0%, rgba(22, 163, 74, 0.95) 100%)',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600',
              zIndex: 1000,
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <span>{showPreview ? '👁️' : '💻'}</span>
            Switched to {showPreview ? 'Preview' : 'Code'} mode
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}

export default EditorPage;
