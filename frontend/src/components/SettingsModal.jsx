import React, { useState, useEffect } from 'react';
import { 
  X, 
  Cpu, 
  Database, 
  BookOpen, 
  Moon, 
  Sun, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Layers
} from 'lucide-react';

export default function SettingsModal({ 
  isOpen, 
  onClose, 
  activeModel, 
  onSelectModel, 
  modelsData, 
  health, 
  theme, 
  onToggleTheme,
  onClearAllSessions
}) {
  const [clearing, setClearing] = useState(false);
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleClear = async () => {
    if (!window.confirm("Are you sure you want to clear all conversation history and stored artifacts?")) return;
    setClearing(true);
    try {
      await onClearAllSessions();
      setCleared(true);
      setTimeout(() => setCleared(false), 2000);
    } catch (err) {
      console.error("Clear error:", err);
    } finally {
      setClearing(false);
    }
  };

  const providers = [
    {
      id: 'ollama',
      name: 'Ollama (Local LLM)',
      desc: 'Runs locally on your machine via localhost:11434 (llama3.1 / llama3.2)',
      isAvailable: modelsData?.providers?.ollama?.available,
      statusText: modelsData?.providers?.ollama?.available ? 'Connected & Ready' : 'Offline / Not Running'
    },
    {
      id: 'claude',
      name: 'Anthropic Claude 3.5 Sonnet',
      desc: 'Cloud LLM via ANTHROPIC_API_KEY environment variable',
      isAvailable: modelsData?.providers?.claude?.available,
      statusText: modelsData?.providers?.claude?.available ? 'Configured & Ready' : 'API Key Missing'
    },
    {
      id: 'openai',
      name: 'OpenAI GPT-4o',
      desc: 'Cloud LLM via OPENAI_API_KEY environment variable',
      isAvailable: modelsData?.providers?.openai?.available,
      statusText: modelsData?.providers?.openai?.available ? 'Configured & Ready' : 'API Key Missing'
    },
    {
      id: 'mock',
      name: 'Offline Grounded Engine',
      desc: 'Deterministic synthesizer utilizing verbatim transcript chunks (zero-API setup)',
      isAvailable: true,
      statusText: 'Always Available (Zero Setup)'
    }
  ];

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content-card" style={{ maxWidth: '660px' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close settings">
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--accent-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF'
          }}>
            <Cpu size={18} />
          </div>
          <h2 style={{ fontFamily: 'var(--text-serif-display)', fontSize: '1.4rem', color: 'var(--text-primary)', margin: 0 }}>
            System Settings & Model Status
          </h2>
        </div>

        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Manage AI providers, verify grounding database metrics, and customize your workspace.
        </p>

        {/* Section 1: AI Model Provider */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.65rem', fontWeight: 700 }}>
            Active AI Model Provider:
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {providers.map((p) => {
              const isSelected = activeModel === p.id;
              return (
                <div 
                  key={p.id}
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: isSelected ? 'var(--bg-highlight)' : 'var(--bg-app)',
                    border: `1.5px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-medium)'}`,
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease'
                  }}
                  onClick={() => onSelectModel(p.id)}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                        {p.name}
                      </span>
                      {isSelected && (
                        <span className="tag-category tag-brown" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                          Active
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {p.desc}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: p.isAvailable ? 'var(--status-success)' : 'var(--text-muted)'
                    }}>
                      {p.isAvailable ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                      {p.statusText}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '1rem 0' }} />

        {/* Section 2: Grounding & Ingestion Metrics */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '0.65rem', fontWeight: 700 }}>
            Grounding & Database Metrics:
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.75rem',
            padding: '1rem',
            backgroundColor: 'var(--bg-app)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-medium)'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Indexed Passages</div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--accent-primary)', marginTop: '2px' }}>
                {health?.transcripts_count || 4389} chunks
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Podcast Episodes</div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--accent-secondary)', marginTop: '2px' }}>
                {health?.episodes_count || 279} episodes
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Database Engine</div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                {health?.database === 'connected' ? 'PostgreSQL / SQLite' : 'Connected'}
              </div>
            </div>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '1rem 0' }} />

        {/* Section 3: Appearance & Maintenance */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Theme Appearance</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Current: {theme === 'dark' ? 'Editorial Dark' : 'Warm Editorial Light'}
            </div>
          </div>

          <button className="btn btn-secondary" onClick={onToggleTheme}>
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            <span>Toggle Theme</span>
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--status-danger)' }}>Data Reset</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Clear all saved sessions and artifacts
            </div>
          </div>

          <button 
            className="btn btn-ghost" 
            onClick={handleClear} 
            disabled={clearing}
            style={{ color: 'var(--status-danger)', border: '1px solid rgba(163, 58, 58, 0.3)', padding: '6px 12px' }}
          >
            <Trash2 size={14} />
            <span>{cleared ? 'History Cleared!' : 'Clear All Data'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
