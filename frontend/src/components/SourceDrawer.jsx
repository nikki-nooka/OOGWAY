import React from 'react';
import { X, BookOpen, ExternalLink, Clock, User, Quote } from 'lucide-react';

export default function SourceDrawer({ 
  citation, 
  onClose 
}) {
  if (!citation) return null;

  return (
    <div className="source-drawer-overlay" onClick={onClose}>
      <div 
        className="source-drawer" 
        style={{
          backgroundColor: 'var(--bg-surface, #FBFAF6)',
          borderLeft: '1px solid var(--border-medium, #D9D4C9)',
          boxShadow: '-10px 0 35px rgba(0, 0, 0, 0.2)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="source-drawer-header"
          style={{
            backgroundColor: 'var(--bg-app, #F5F2EA)',
            borderBottom: '1px solid var(--border-subtle, #E2DDD2)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={18} color="var(--accent-primary, #9A5B2E)" />
            <span style={{ 
              fontWeight: 700, 
              fontSize: '14px', 
              color: 'var(--text-primary, #161616)',
              fontFamily: 'var(--text-serif-display, serif)'
            }}>
              Transcript Evidence Source
            </span>
          </div>
          <button 
            className="btn btn-ghost" 
            onClick={onClose} 
            style={{ 
              padding: '6px',
              color: 'var(--text-muted, #8E8A80)',
              borderRadius: '4px'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Content */}
        <div 
          className="source-drawer-body"
          style={{
            backgroundColor: 'var(--bg-surface, #FBFAF6)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          {/* Guest Card */}
          <div style={{
            backgroundColor: 'var(--bg-card, #FBFAF6)',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle, #E2DDD2)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-primary, #9A5B2E)',
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
                fontSize: '16px', 
                color: 'var(--text-primary, #161616)',
                fontFamily: 'var(--text-serif-display, serif)'
              }}>
                {citation.guest}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary, #66635C)', marginTop: '2px' }}>
                Featured Leader on Lenny's Podcast
              </div>
            </div>
          </div>

          {/* Episode Info */}
          <div style={{
            backgroundColor: 'var(--bg-card, #FBFAF6)',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle, #E2DDD2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted, #8E8A80)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Episode Title
            </div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary, #161616)', lineHeight: 1.4 }}>
              {citation.episode_title}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
              <Clock size={14} color="var(--accent-primary, #9A5B2E)" />
              <span style={{ 
                fontSize: '12px', 
                fontWeight: 600, 
                color: 'var(--accent-primary, #9A5B2E)',
                fontFamily: 'var(--text-mono, monospace)'
              }}>
                Timestamp: {citation.timestamp || "Discussion"}
              </span>
            </div>
          </div>

          {/* Verbatim Quote */}
          <div style={{
            backgroundColor: 'var(--bg-card, #FBFAF6)',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle, #E2DDD2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted, #8E8A80)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Quote size={14} color="var(--accent-primary, #9A5B2E)" />
              <span>Verbatim Transcript Quote</span>
            </div>
            <div style={{
              fontSize: '13.5px',
              lineHeight: 1.6,
              color: 'var(--text-primary, #161616)',
              backgroundColor: 'var(--bg-app, #F5F2EA)',
              borderLeft: '3px solid var(--accent-primary, #9A5B2E)',
              padding: '12px 14px',
              borderRadius: '0 6px 6px 0',
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
                padding: '12px 16px',
                backgroundColor: 'var(--accent-primary, #9A5B2E)',
                color: '#FFFFFF',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '13.5px',
                textDecoration: 'none',
                boxShadow: '0 2px 6px rgba(154, 91, 46, 0.25)',
                transition: 'transform 0.15s ease'
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
