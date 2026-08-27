import React, { useState } from 'react';
import { 
  Compass, 
  MessageSquare, 
  PenTool, 
  FileCode, 
  Layers, 
  BookOpen, 
  Sun, 
  Moon, 
  Settings, 
  Sparkles,
  Search,
  User,
  LogOut,
  Sliders
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  onSelectTab, 
  activeModel, 
  modelsData, 
  onOpenSettings, 
  theme, 
  onToggleTheme,
  onOpenSearch,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenContext
}) {
  const isOllamaConnected = modelsData?.providers?.ollama?.available;
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'U';
    return String(name).split(' ').map(p => p[0]).filter(Boolean).join('').toUpperCase().slice(0, 2) || 'U';
  };


  return (
    <header className="navbar-editorial">
      {/* Brand Identification */}
      <div className="nav-brand" onClick={() => onSelectTab('home')}>
        <div className="brand-badge">L</div>
        <div>
          <div className="brand-text-title">Lenny Growth Assistant</div>
          <div className="brand-text-sub">Product & Growth Intelligence</div>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <nav className="nav-links">
        <button 
          className={`nav-tab ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => onSelectTab('home')}
        >
          <span>Home</span>
        </button>

        <button 
          className={`nav-tab ${activeTab === 'explore' ? 'active' : ''}`}
          onClick={() => onSelectTab('explore')}
        >
          <Compass size={14} />
          <span>Explore</span>
        </button>

        <button 
          className={`nav-tab ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => onSelectTab('chat')}
        >
          <MessageSquare size={14} />
          <span>Ask</span>
        </button>

        <button 
          className={`nav-tab ${activeTab === 'writing' ? 'active' : ''}`}
          onClick={() => onSelectTab('writing')}
        >
          <PenTool size={14} />
          <span>Writing Studio</span>
        </button>

        <button 
          className={`nav-tab ${activeTab === 'artifacts' ? 'active' : ''}`}
          onClick={() => onSelectTab('artifacts')}
        >
          <FileCode size={14} />
          <span>Artifacts</span>
        </button>

        <button 
          className={`nav-tab ${activeTab === 'slides' ? 'active' : ''}`}
          onClick={() => onSelectTab('slides')}
        >
          <Layers size={14} />
          <span>Slides</span>
        </button>

        <button 
          className={`nav-tab ${activeTab === 'sources' ? 'active' : ''}`}
          onClick={() => onSelectTab('sources')}
        >
          <BookOpen size={14} />
          <span>Sources</span>
        </button>
      </nav>

      {/* Right Controls: Model Status, Search, Theme, User Profile */}
      <div className="nav-actions">
        {/* Model Status Pill */}
        <button 
          onClick={onOpenSettings}
          className="tag-category tag-neutral" 
          style={{ cursor: 'pointer', padding: '5px 10px', fontSize: '11.5px', textTransform: 'none' }}
          title="Click to switch active AI model"
        >
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: activeModel === 'ollama' ? (isOllamaConnected ? 'var(--status-success)' : 'var(--status-warning)') : 'var(--accent-primary)',
            display: 'inline-block'
          }}></span>
          <span style={{ fontWeight: 600 }}>
            {activeModel === 'ollama' ? 'Ollama (Local)' : activeModel === 'claude' ? 'Claude 3.5' : activeModel === 'openai' ? 'GPT-4o' : 'Offline Grounded'}
          </span>
        </button>

        {/* Search Trigger */}
        <button 
          className="btn btn-ghost" 
          onClick={onOpenSearch}
          title="Search transcripts"
          style={{ padding: '6px 8px' }}
        >
          <Search size={16} />
        </button>

        {/* Theme Toggle */}
        <button 
          className="btn btn-ghost" 
          onClick={onToggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Warm Editorial Light' : 'Editorial Dark'}`}
          style={{ padding: '6px 8px' }}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Settings Trigger */}
        <button 
          className="btn btn-ghost" 
          onClick={onOpenSettings}
          title="Settings & Model Config"
          style={{ padding: '6px 8px' }}
        >
          <Settings size={16} />
        </button>

        {/* User Account / Profile Control */}
        {currentUser ? (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsProfileMenuOpen(prev => !prev)}
              className="btn btn-ghost"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 10px 4px 6px',
                borderRadius: '20px',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-secondary)',
                cursor: 'pointer'
              }}
              title="Your Private Workspace Account"
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'var(--accent-primary)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700
              }}>
                {getInitials(currentUser?.name || currentUser?.email)}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {(currentUser?.name || currentUser?.email || 'User').split(' ')[0]}
              </span>
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileMenuOpen && (
              <>
                <div 
                  style={{ position: 'fixed', inset: 0, zIndex: 99998 }} 
                  onClick={() => setIsProfileMenuOpen(false)} 
                />
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '240px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md, 8px)',
                  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.22)',
                  padding: '8px 0',
                  zIndex: 99999,
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <div style={{ padding: '8px 14px', borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface)' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                      {currentUser?.name || 'Product Builder'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {currentUser?.email || 'private@workspace'}
                    </div>

                    <div style={{ 
                      display: 'inline-block', 
                      fontSize: '0.7rem', 
                      background: 'var(--bg-tertiary)', 
                      color: 'var(--status-success)', 
                      padding: '2px 6px', 
                      borderRadius: '4px', 
                      marginTop: '4px',
                      fontWeight: 600 
                    }}>
                      🔒 Private Workspace
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onSelectTab('workspace');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 14px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                    className="dropdown-item"
                  >
                    <User size={14} color="var(--accent-primary)" />
                    <span>My Workspace & Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onSelectTab('sources');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 14px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                    className="dropdown-item"
                  >
                    <BookOpen size={14} />
                    <span>Saved Knowledge</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      if (onOpenContext) onOpenContext();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 14px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                    className="dropdown-item"
                  >
                    <Sliders size={14} />
                    <span>Company Context Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onOpenSettings();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 14px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                    className="dropdown-item"
                  >
                    <Settings size={14} />
                    <span>Settings & Privacy</span>
                  </button>


                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onLogout();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 14px',
                      background: 'none',
                      border: 'none',
                      color: 'var(--accent-primary)',
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      borderTop: '1px solid var(--border-subtle)',
                      marginTop: '4px',
                      textAlign: 'left'
                    }}
                    className="dropdown-item"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="btn btn-ghost"
            style={{
              padding: '6px 12px',
              fontSize: '12.5px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <User size={14} />
            <span>Sign In</span>
          </button>
        )}

        {/* New Chat CTA */}
        <button 
          className="btn btn-primary"
          onClick={() => {
            if (!currentUser) {
              if (onOpenAuth) onOpenAuth();
            } else {
              onSelectTab('chat_new');
            }
          }}
          style={{ padding: '6px 14px', fontSize: '12.5px' }}
        >
          <Sparkles size={13} />
          <span>New Chat</span>
        </button>
      </div>
    </header>
  );
}
