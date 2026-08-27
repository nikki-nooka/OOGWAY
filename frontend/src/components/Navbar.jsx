import React from 'react';
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
  BarChart2
} from 'lucide-react';


export default function Navbar({ 
  activeTab, 
  onSelectTab, 
  activeModel, 
  modelsData, 
  onOpenSettings, 
  theme, 
  onToggleTheme,
  onOpenSearch
}) {
  const isOllamaConnected = modelsData?.providers?.ollama?.available;

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

        <button 
          className={`nav-tab ${activeTab === 'benchmarks' ? 'active' : ''}`}
          onClick={() => onSelectTab('benchmarks')}
        >
          <BarChart2 size={14} />
          <span>Benchmarks</span>
        </button>
      </nav>


      {/* Right Controls: Model Status, Search, Theme, Settings */}
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

        {/* New Chat CTA */}
        <button 
          className="btn btn-primary"
          onClick={() => onSelectTab('chat_new')}
          style={{ padding: '6px 14px', fontSize: '12.5px' }}
        >
          <Sparkles size={13} />
          <span>New Chat</span>
        </button>
      </div>
    </header>
  );
}
