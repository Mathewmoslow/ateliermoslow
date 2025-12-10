import React from 'react';
import './FilePortal.css';

/**
 * File Management Portal - Component Wireframe
 * This is a visual mockup showing the component structure and layout
 */

// ============ AUTH GATE COMPONENT ============
export const AuthGate = () => {
  return (
    <div className="auth-gate">
      <div className="auth-card">
        <h1>🔐 Portal Access</h1>
        <input type="password" placeholder="Enter password" />
        <label>
          <input type="checkbox" /> Remember me for 30 days
        </label>
        <button className="btn-primary">Enter Portal</button>
      </div>
    </div>
  );
};

// ============ MAIN APP SHELL ============
export const AppShell = () => {
  return (
    <div className="app-shell">
      <Header />
      <div className="app-body">
        <Sidebar />
        <MainContent />
      </div>
      <StatusBar />
    </div>
  );
};

// ============ HEADER COMPONENT ============
const Header = () => {
  return (
    <header className="app-header">
      <div className="header-left">
        <span className="logo">📁 FilePortal</span>
        <Breadcrumb path="/home/sites/myproject/index.html" />
      </div>
      <div className="header-right">
        <button className="icon-btn" title="Sync Now">🔄</button>
        <button className="icon-btn" title="Settings">⚙️</button>
        <button className="icon-btn" title="Logout">🚪</button>
      </div>
    </header>
  );
};

// ============ BREADCRUMB COMPONENT ============
const Breadcrumb = ({ path }) => {
  const parts = path.split('/').filter(Boolean);
  return (
    <nav className="breadcrumb">
      {parts.map((part, i) => (
        <span key={i}>
          {i > 0 && ' / '}
          <a href="#">{part}</a>
        </span>
      ))}
    </nav>
  );
};

// ============ SIDEBAR COMPONENT ============
const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <SidebarActions />
      </div>
      <div className="sidebar-section flex-1">
        <FileTree />
      </div>
      <div className="sidebar-section">
        <QuickActions />
      </div>
    </aside>
  );
};

// ============ SIDEBAR ACTIONS ============
const SidebarActions = () => {
  return (
    <div className="sidebar-actions">
      <button className="btn-action">
        <span>➕</span> New File
      </button>
      <button className="btn-action">
        <span>📁</span> New Folder
      </button>
      <button className="btn-action">
        <span>⬆️</span> Upload
      </button>
    </div>
  );
};

// ============ FILE TREE COMPONENT ============
const FileTree = () => {
  return (
    <div className="file-tree">
      <div className="tree-header">
        <input 
          type="text" 
          className="search-input" 
          placeholder="🔍 Search files..." 
        />
      </div>
      <div className="tree-content">
        <TreeNode type="folder" name="src" expanded>
          <TreeNode type="folder" name="components">
            <TreeNode type="file" name="Header.jsx" />
            <TreeNode type="file" name="Footer.jsx" />
          </TreeNode>
          <TreeNode type="folder" name="styles">
            <TreeNode type="file" name="main.css" />
            <TreeNode type="file" name="theme.css" />
          </TreeNode>
          <TreeNode type="file" name="index.html" selected />
          <TreeNode type="file" name="app.js" />
        </TreeNode>
        <TreeNode type="folder" name="public">
          <TreeNode type="file" name="favicon.ico" />
          <TreeNode type="file" name="robots.txt" />
        </TreeNode>
        <TreeNode type="file" name="package.json" modified />
        <TreeNode type="file" name="README.md" />
      </div>
    </div>
  );
};

// ============ TREE NODE COMPONENT ============
const TreeNode = ({ type, name, expanded, selected, modified, children }) => {
  const icon = type === 'folder' 
    ? (expanded ? '📂' : '📁')
    : getFileIcon(name);
    
  return (
    <div className={`tree-node ${selected ? 'selected' : ''}`}>
      <div className="node-content">
        <span className="node-icon">{icon}</span>
        <span className="node-name">
          {name}
          {modified && <span className="modified-dot">•</span>}
        </span>
        <span className="node-actions">
          <button className="mini-btn" title="Rename">✏️</button>
          <button className="mini-btn" title="Delete">🗑️</button>
        </span>
      </div>
      {children && expanded && (
        <div className="node-children">
          {children}
        </div>
      )}
    </div>
  );
};

// ============ FILE ICON HELPER ============
const getFileIcon = (filename) => {
  const ext = filename.split('.').pop().toLowerCase();
  const icons = {
    'html': '📄',
    'css': '🎨',
    'js': '⚡',
    'jsx': '⚛️',
    'json': '📋',
    'md': '📝',
    'txt': '📃',
    'png': '🖼️',
    'jpg': '🖼️',
    'gif': '🖼️',
    'pdf': '📑',
    'zip': '🗜️'
  };
  return icons[ext] || '📄';
};

// ============ QUICK ACTIONS ============
const QuickActions = () => {
  return (
    <div className="quick-actions">
      <div className="action-item">
        <span>🗑️ Trash (3)</span>
      </div>
      <div className="action-item">
        <span>⏰ Recent Files</span>
      </div>
      <div className="action-item">
        <span>⭐ Favorites</span>
      </div>
    </div>
  );
};

// ============ MAIN CONTENT AREA ============
const MainContent = () => {
  return (
    <main className="main-content">
      <EditorTabs />
      <EditorArea />
    </main>
  );
};

// ============ EDITOR TABS ============
const EditorTabs = () => {
  return (
    <div className="editor-tabs">
      <div className="tabs-list">
        <Tab name="index.html" active modified />
        <Tab name="style.css" />
        <Tab name="app.js" />
        <Tab name="README.md" />
      </div>
      <div className="tabs-actions">
        <button className="icon-btn" title="Split View">⊞</button>
        <button className="icon-btn" title="Close All">✕</button>
      </div>
    </div>
  );
};

// ============ TAB COMPONENT ============
const Tab = ({ name, active, modified }) => {
  return (
    <div className={`tab ${active ? 'active' : ''}`}>
      <span className="tab-icon">{getFileIcon(name)}</span>
      <span className="tab-name">{name}</span>
      {modified && <span className="tab-modified">•</span>}
      <button className="tab-close">×</button>
    </div>
  );
};

// ============ EDITOR AREA ============
const EditorArea = () => {
  return (
    <div className="editor-area">
      <div className="editor-toolbar">
        <div className="toolbar-left">
          <button className="tool-btn">💾 Save</button>
          <button className="tool-btn">↶ Undo</button>
          <button className="tool-btn">↷ Redo</button>
          <span className="divider">|</span>
          <button className="tool-btn">🔍 Find</button>
          <button className="tool-btn">🔄 Replace</button>
        </div>
        <div className="toolbar-right">
          <button className="tool-btn">👁️ Preview</button>
          <select className="theme-select">
            <option>VS Dark</option>
            <option>VS Light</option>
            <option>Monokai</option>
          </select>
        </div>
      </div>
      
      <div className="editor-container">
        <MonacoEditor />
      </div>
    </div>
  );
};

// ============ MONACO EDITOR MOCKUP ============
const MonacoEditor = () => {
  return (
    <div className="monaco-editor">
      <div className="line-numbers">
        {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(n => (
          <div key={n} className="line-number">{n}</div>
        ))}
      </div>
      <div className="editor-content">
        <pre>{`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1>Welcome to My Portal</h1>
    </header>
    <main>
        <p>Content goes here...</p>
    </main>
</body>
</html>`}</pre>
      </div>
    </div>
  );
};

// ============ STATUS BAR ============
const StatusBar = () => {
  return (
    <footer className="status-bar">
      <div className="status-left">
        <span className="status-item">
          <span className="status-icon">📊</span>
          Queue: 3 pending
        </span>
        <span className="status-item">
          <span className="status-icon">✅</span>
          All changes saved
        </span>
      </div>
      <div className="status-center">
        <span className="status-item">HTML</span>
        <span className="status-item">UTF-8</span>
        <span className="status-item">LF</span>
      </div>
      <div className="status-right">
        <span className="status-item">Ln 45, Col 12</span>
        <span className="status-item">2 spaces</span>
        <span className="status-item">
          <span className="sync-indicator">🟢</span> Connected
        </span>
      </div>
    </footer>
  );
};

// ============ CONTEXT MENU COMPONENT ============
export const ContextMenu = ({ x, y, items }) => {
  return (
    <div className="context-menu" style={{ top: y, left: x }}>
      {items.map((item, i) => (
        <div key={i} className="menu-item">
          <span className="menu-icon">{item.icon}</span>
          <span className="menu-label">{item.label}</span>
          {item.shortcut && (
            <span className="menu-shortcut">{item.shortcut}</span>
          )}
        </div>
      ))}
    </div>
  );
};

// ============ UPLOAD MODAL ============
export const UploadModal = () => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Upload Files</h2>
          <button className="modal-close">×</button>
        </div>
        <div className="modal-body">
          <div className="upload-zone">
            <div className="upload-icon">📤</div>
            <p>Drag files here or click to browse</p>
            <p className="upload-hint">Maximum file size: 100MB</p>
          </div>
          <div className="upload-list">
            <div className="upload-item">
              <span>📄 document.pdf</span>
              <span className="upload-size">2.3 MB</span>
              <span className="upload-status">✅</span>
            </div>
            <div className="upload-item">
              <span>🖼️ image.png</span>
              <span className="upload-size">456 KB</span>
              <span className="upload-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '60%'}}></div>
                </div>
              </span>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary">Cancel</button>
          <button className="btn-primary">Upload All</button>
        </div>
      </div>
    </div>
  );
};

// ============ SYNC QUEUE PANEL ============
export const SyncQueuePanel = () => {
  return (
    <div className="sync-panel">
      <div className="panel-header">
        <h3>📋 Sync Queue</h3>
        <button className="btn-small">Clear All</button>
      </div>
      <div className="queue-list">
        <div className="queue-item pending">
          <span className="queue-icon">⏳</span>
          <span className="queue-action">CREATE</span>
          <span className="queue-file">/src/newfile.js</span>
        </div>
        <div className="queue-item pending">
          <span className="queue-icon">⏳</span>
          <span className="queue-action">UPDATE</span>
          <span className="queue-file">/index.html</span>
        </div>
        <div className="queue-item success">
          <span className="queue-icon">✅</span>
          <span className="queue-action">DELETE</span>
          <span className="queue-file">/old/temp.txt</span>
        </div>
        <div className="queue-item error">
          <span className="queue-icon">❌</span>
          <span className="queue-action">MOVE</span>
          <span className="queue-file">/assets/logo.png</span>
          <span className="queue-error">Permission denied</span>
        </div>
      </div>
      <div className="panel-footer">
        <button className="btn-primary full-width">
          🔄 Sync Now
        </button>
      </div>
    </div>
  );
};

// ============ SETTINGS MODAL ============
export const SettingsModal = () => {
  return (
    <div className="modal-overlay">
      <div className="modal modal-large">
        <div className="modal-header">
          <h2>⚙️ Settings</h2>
          <button className="modal-close">×</button>
        </div>
        <div className="modal-body">
          <div className="settings-tabs">
            <button className="settings-tab active">General</button>
            <button className="settings-tab">Editor</button>
            <button className="settings-tab">Sync</button>
            <button className="settings-tab">Security</button>
            <button className="settings-tab">Extensions</button>
          </div>
          
          <div className="settings-content">
            <div className="setting-group">
              <h3>Appearance</h3>
              <label className="setting-item">
                <span>Theme</span>
                <select>
                  <option>Light</option>
                  <option>Dark</option>
                  <option>Auto</option>
                </select>
              </label>
              <label className="setting-item">
                <span>Sidebar Position</span>
                <select>
                  <option>Left</option>
                  <option>Right</option>
                </select>
              </label>
            </div>
            
            <div className="setting-group">
              <h3>Behavior</h3>
              <label className="setting-item">
                <input type="checkbox" checked />
                <span>Auto-save files</span>
              </label>
              <label className="setting-item">
                <input type="checkbox" checked />
                <span>Show hidden files</span>
              </label>
              <label className="setting-item">
                <input type="checkbox" />
                <span>Confirm before delete</span>
              </label>
            </div>
            
            <div className="setting-group">
              <h3>Performance</h3>
              <label className="setting-item">
                <span>Max open tabs</span>
                <input type="number" value="20" />
              </label>
              <label className="setting-item">
                <span>Cache size (MB)</span>
                <input type="number" value="100" />
              </label>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary">Reset to Defaults</button>
          <button className="btn-primary">Save Settings</button>
        </div>
      </div>
    </div>
  );
};

// Export main application component
export default function FilePortal() {
  const [authenticated, setAuthenticated] = React.useState(false);
  
  if (!authenticated) {
    return <AuthGate />;
  }
  
  return <AppShell />;
}
