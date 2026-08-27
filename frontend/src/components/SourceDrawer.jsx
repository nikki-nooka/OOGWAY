import React, { useEffect } from 'react';
import { X, BookOpen, ExternalLink, Clock, User, Quote } from 'lucide-react';

export default function SourceDrawer({ 
  citation, 
  onClose 
}) {
  useEffect(() => {
    if (citation) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [citation]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && citation) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [citation, onClose]);

  if (!citation) return null;

  return (
    <div className="source-drawer-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="source-drawer" 
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderLeft: '1px solid var(--border-medium)',
          boxShadow: 'var(--shadow-lg)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="source-drawer-header"
          style={{
            backgroundColor: 'var(--bg-app)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '1.25rem 1.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={18} color="var(--accent-primary)" />
            <span style={{ 
              fontWeight: 700, 
              fontSize: '14px', 
              color: 'var(--text-primary)',
              fontFamily: 'var(--text-serif-display)'
            }}>
              Transcript Evidence Source
            </span>
          </div>
          <button 
            className="btn btn-ghost" 
            onClick={onClose} 
            style={{ 
              padding: '6px',
              color: 'var(--text-muted)',
              borderRadius: 'var(--radius-sm)'
            }}
            aria-label="Close Source Drawer"
            title="Close (Esc)"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Content */}
        <div 
          className="source-drawer-body"
          style={{
            backgroundColor: 'var(--bg-surface)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            overflowY: 'auto'
          }}
        >
          {/* Guest Card */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: 700,
              flexShrink: 0
            }}>
              <User size={20} />
            </div>
            <div>
              <div style={{ 
                fontWeight: 700, 
                fontSize: '1.1rem', 
                color: 'var(--text-primary)',
                fontFamily: 'var(--text-serif-display)'
              }}>
                {citation.guest}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Featured Leader on Lenny's Podcast
              </div>
            </div>
          </div>

          {/* Episode Info */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Episode Title
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>
              {citation.episode_title}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
              <Clock size={14} color="var(--accent-primary)" />
              <span style={{ 
                fontSize: '0.82rem', 
                fontWeight: 600, 
                color: 'var(--accent-primary)',
                fontFamily: 'var(--text-mono)'
              }}>
                Timestamp: {citation.timestamp || "Discussion"}
              </span>
            </div>
          </div>

          {/* Verbatim Quote */}
          <div style={{
            backgroundColor: 'var(--bg-card)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Quote size={14} color="var(--accent-primary)" />
              <span>Verbatim Transcript Quote</span>
            </div>
            <div style={{
              fontSize: '0.92rem',
              lineHeight: 1.6,
              color: 'var(--text-primary)',
              backgroundColor: 'var(--bg-app)',
              borderLeft: '3px solid var(--accent-primary)',
              padding: '1rem',
              borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
              fontStyle: 'italic'
            }}>
              "{citation.quote}"
            </div>
          </div>

          {/* Official Source Link */}
          {citation.source_url && (
            <a 
              href={citation.source_url} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{
                marginTop: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '0.85rem 1rem',
                backgroundColor: 'var(--accent-primary)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600,
                fontSize: '0.9rem',
                textDecoration: 'none',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.15s ease'
              }}
            >
              <span>Listen to Official Episode</span>
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
