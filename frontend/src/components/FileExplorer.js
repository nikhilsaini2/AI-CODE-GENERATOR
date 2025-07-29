// components/FileExplorer.js
import React, { useState, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiFile, 
  FiFolder, 
  FiFolderOpen, 
  FiPlus, 
  FiTrash2, 
  FiEdit3,
  FiMoreHorizontal,
  FiSearch,
  FiX,
  FiUpload
} from 'react-icons/fi';

const FileExplorer = React.memo(({ 
  files, 
  activeFile, 
  setActiveFile, 
  onAddFile, 
  onDeleteFile, 
  onRenameFile,
  setFiles, 
  onDuplicateFile,
  onMoveFile 
}) => {
  const [expandedFolders, setExpandedFolders] = useState(new Set(['root']));
  const [showContextMenu, setShowContextMenu] = useState(null);
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [renamingFile, setRenamingFile] = useState(null);
  const fileInputRef = useRef(null);

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    
    switch (ext) {
      case 'html': return '📄';
      case 'css': return '🎨';
      case 'js': case 'jsx': return '⚡';
      case 'ts': case 'tsx': return '🔷';
      case 'json': return '📋';
      case 'md': return '📝';
      case 'py': return '🐍';
      case 'java': return '☕';
      case 'cpp': case 'c': return '⚙️';
      case 'php': return '🐘';
      case 'rb': return '💎';
      case 'go': return '🐹';
      case 'rs': return '🦀';
      case 'vue': return '💚';
      case 'svelte': return '🧡';
      case 'xml': return '📄';
      case 'yml': case 'yaml': return '⚙️';
      case 'sql': return '🗃️';
      default: return '📄';
    }
  };

  const getLanguageFromExtension = (filename) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    const languageMap = {
      'html': 'html',
      'css': 'css',
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'json': 'json',
      'md': 'markdown',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'php': 'php',
      'rb': 'ruby',
      'go': 'go',
      'rs': 'rust',
      'vue': 'vue',
      'svelte': 'svelte',
      'xml': 'xml',
      'yml': 'yaml',
      'yaml': 'yaml',
      'sql': 'sql'
    };
    return languageMap[ext] || 'plaintext';
  };

  // Memoize filtered files computation for performance
  const filteredFiles = useMemo(() => 
    Object.keys(files).filter(filename =>
      filename.toLowerCase().includes(searchTerm.toLowerCase())
    ), [files, searchTerm]
  );

  const handleAddFile = useCallback(() => {
    setIsCreatingFile(true);
    setNewFileName('');
  }, []);

  const handleCreateFile = useCallback(() => {
    if (newFileName.trim()) {
      const filename = newFileName.includes('.') ? newFileName : `${newFileName}.js`;
      const newFiles = { ...files };
      newFiles[filename] = '';
      setFiles(newFiles);
      setActiveFile(filename);
      setIsCreatingFile(false);
      setNewFileName('');
    }
  }, [newFileName, files, setFiles, setActiveFile]);

  const handleDeleteFile = useCallback((filename) => {
    const newFiles = { ...files };
    delete newFiles[filename];
    setFiles(newFiles);
    
    if (activeFile === filename) {
      const remainingFiles = Object.keys(newFiles);
      setActiveFile(remainingFiles.length > 0 ? remainingFiles[0] : null);
    }
  }, [files, activeFile, setFiles, setActiveFile]);

  const handleRenameFile = useCallback((oldName, newName) => {
    if (newName.trim() && newName !== oldName) {
      const newFiles = { ...files };
      newFiles[newName] = newFiles[oldName];
      delete newFiles[oldName];
      setFiles(newFiles);
      
      if (activeFile === oldName) {
        setActiveFile(newName);
      }
    }
    setRenamingFile(null);
  }, [files, activeFile, setFiles, setActiveFile]);

  const handleContextMenu = useCallback((e, filename) => {
    e.preventDefault();
    setShowContextMenu({ x: e.clientX, y: e.clientY, filename });
    document.addEventListener('click', closeContextMenu);
  }, []);

  const closeContextMenu = useCallback(() => {
    setShowContextMenu(null);
    document.removeEventListener('click', closeContextMenu);
  }, []);

  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newFiles = { ...files };
        newFiles[file.name] = e.target.result;
        setFiles(newFiles);
        setActiveFile(file.name);
      };
      reader.readAsText(file);
    }
  }, [files, setFiles, setActiveFile]);

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Search Bar */}
      <div style={{
        padding: '16px 20px 12px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        <div style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center'
        }}>
          <FiSearch 
            size={14} 
            style={{
              position: 'absolute',
              left: '12px',
              color: 'rgba(255, 255, 255, 0.4)',
              zIndex: 1
            }}
          />
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 32px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '12px',
              outline: 'none',
              transition: 'all 0.2s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(16, 185, 129, 0.4)';
              e.target.style.background = 'rgba(255, 255, 255, 0.08)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
            }}
          />
          {searchTerm && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{
                position: 'absolute',
                right: '8px',
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.4)',
                cursor: 'pointer',
                padding: '2px',
                borderRadius: '3px'
              }}
              onClick={() => setSearchTerm('')}
              whileHover={{ color: 'rgba(255, 255, 255, 0.7)' }}
            >
              <FiX size={12} />
            </motion.button>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        padding: '0 20px 12px',
        display: 'flex',
        gap: '8px'
      }}>
        <motion.button
          style={{
            flex: 1,
            padding: '6px 8px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '6px',
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '11px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            transition: 'all 0.2s ease'
          }}
          onClick={handleAddFile}
          whileHover={{ 
            background: 'rgba(16, 185, 129, 0.15)',
            borderColor: 'rgba(16, 185, 129, 0.3)'
          }}
          whileTap={{ scale: 0.95 }}
        >
          <FiPlus size={10} />
          New File
        </motion.button>
        
        <motion.button
          style={{
            padding: '6px 8px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '6px',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '11px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
          onClick={() => fileInputRef.current?.click()}
          whileHover={{ 
            background: 'rgba(255, 255, 255, 0.08)',
            color: 'rgba(255, 255, 255, 0.9)'
          }}
          whileTap={{ scale: 0.95 }}
          title="Upload File"
        >
          <FiUpload size={10} />
        </motion.button>
      </div>

      {/* File List */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '0 8px 16px'
      }}>
        {isCreatingFile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              margin: '8px 12px',
              padding: '8px 12px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '6px'
            }}
          >
            <input
              type="text"
              placeholder="filename.js"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateFile();
                if (e.key === 'Escape') setIsCreatingFile(false);
              }}
              style={{
                width: '100%',
                padding: '4px 8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '12px',
                outline: 'none'
              }}
              autoFocus
            />
            <div style={{
              display: 'flex',
              gap: '8px',
              marginTop: '8px'
            }}>
              <motion.button
                style={{
                  padding: '4px 8px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '10px',
                  cursor: 'pointer'
                }}
                onClick={handleCreateFile}
                whileHover={{ background: 'rgba(16, 185, 129, 0.3)' }}
                whileTap={{ scale: 0.95 }}
              >
                Create
              </motion.button>
              <motion.button
                style={{
                  padding: '4px 8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '4px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '10px',
                  cursor: 'pointer'
                }}
                onClick={() => setIsCreatingFile(false)}
                whileHover={{ background: 'rgba(255, 255, 255, 0.15)' }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        )}

        {filteredFiles.length === 0 ? (
          <div style={{
            padding: '32px 16px',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.4)',
            fontSize: '12px'
          }}>
            {searchTerm ? 'No files found' : 'No files yet'}
          </div>
        ) : (
          <div style={{ padding: '0 4px' }}>
            {filteredFiles.map((filename, index) => (
              <motion.div
                key={filename}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '6px 8px',
                  margin: '2px 0',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  background: activeFile === filename 
                    ? 'rgba(16, 185, 129, 0.15)' 
                    : 'transparent',
                  border: activeFile === filename 
                    ? '1px solid rgba(16, 185, 129, 0.3)' 
                    : '1px solid transparent',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
                onClick={() => setActiveFile(filename)}
                onContextMenu={(e) => handleContextMenu(e, filename)}
                whileHover={{
                  background: activeFile === filename 
                    ? 'rgba(16, 185, 129, 0.2)' 
                    : 'rgba(255, 255, 255, 0.05)'
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {/* File Icon */}
                <span style={{
                  fontSize: '14px',
                  marginRight: '8px',
                  opacity: 0.8
                }}>
                  {getFileIcon(filename)}
                </span>

                {/* File Name */}
                <div style={{
                  flex: 1,
                  fontSize: '12px',
                  fontWeight: '500',
                  color: activeFile === filename 
                    ? 'rgba(255, 255, 255, 0.95)' 
                    : 'rgba(255, 255, 255, 0.8)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {renamingFile === filename ? (
                    <input
                      type="text"
                      defaultValue={filename}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleRenameFile(filename, e.target.value);
                        }
                        if (e.key === 'Escape') {
                          setRenamingFile(null);
                        }
                      }}
                      onBlur={(e) => handleRenameFile(filename, e.target.value)}
                      style={{
                        width: '100%',
                        padding: '2px 4px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '3px',
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '12px',
                        outline: 'none'
                      }}
                      autoFocus
                    />
                  ) : (
                    filename
                  )}
                </div>

                {/* File Type Badge */}
                <div style={{
                  fontSize: '9px',
                  color: 'rgba(255, 255, 255, 0.4)',
                  fontWeight: '600',
                  padding: '2px 4px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '3px',
                  marginLeft: '8px',
                  textTransform: 'uppercase'
                }}>
                  {filename.split('.').pop()}
                </div>

                {/* Action Buttons (visible on hover) */}
                <div style={{
                  display: 'flex',
                  gap: '4px',
                  marginLeft: '8px',
                  opacity: 0,
                  transition: 'opacity 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '0';
                }}
                >
                  <motion.button
                    style={{
                      padding: '2px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: 'none',
                      borderRadius: '3px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setRenamingFile(filename);
                    }}
                    whileHover={{ 
                      background: 'rgba(255, 255, 255, 0.15)',
                      color: 'rgba(255, 255, 255, 0.8)'
                    }}
                    whileTap={{ scale: 0.9 }}
                    title="Rename"
                  >
                    <FiEdit3 size={10} />
                  </motion.button>
                  
                  <motion.button
                    style={{
                      padding: '2px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: 'none',
                      borderRadius: '3px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFile(filename);
                    }}
                    whileHover={{ 
                      background: 'rgba(239, 68, 68, 0.2)',
                      color: 'rgba(239, 68, 68, 0.8)'
                    }}
                    whileTap={{ scale: 0.9 }}
                    title="Delete"
                  >
                    <FiTrash2 size={10} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Hidden file input for upload */}
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
        accept=".html,.css,.js,.jsx,.ts,.tsx,.json,.md,.txt"
      />

      {/* Context Menu */}
      <AnimatePresence>
        {showContextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              position: 'fixed',
              top: showContextMenu.y,
              left: showContextMenu.x,
              background: 'rgba(20, 21, 26, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '8px 0',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(20px)',
              zIndex: 1000,
              minWidth: '160px'
            }}
            onMouseLeave={() => setShowContextMenu(null)}
          >
            <button
              style={{
                width: '100%',
                padding: '8px 16px',
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '12px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onClick={() => {
                setRenamingFile(showContextMenu.filename);
                setShowContextMenu(null);
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'none';
              }}
            >
              <FiEdit3 size={12} />
              Rename
            </button>
            <button
              style={{
                width: '100%',
                padding: '8px 16px',
                background: 'none',
                border: 'none',
                color: 'rgba(239, 68, 68, 0.8)',
                fontSize: '12px',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onClick={() => {
                handleDeleteFile(showContextMenu.filename);
                setShowContextMenu(null);
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(239, 68, 68, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'none';
              }}
            >
              <FiTrash2 size={12} />
              Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

export default FileExplorer;
