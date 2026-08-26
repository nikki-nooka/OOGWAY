import React from 'react';
import { X, BookOpen, ExternalLink, Clock, User, Quote } from 'lucide-react';

export default function SourceDrawer({ 
  citation, 
  onClose 
}) {
  if (!citation) return null;

  return (
    <div className="source-drawer-overlay" onClick={onClose}>
      <div className="source-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="source-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={16} color="var(--accent-primary)" />
            <span style={{ fontWeight: 700, fontSize: '14px', color: '#fff' }}>
              Transcript Grounding Source
            </span>
          </div>
          <button className="btn btn-ghost" onClick={onClose} style={{ padding: '4px' }}>
            <X size={16} />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="source-drawer-body">
          {/* Guest Card */}
          <div style={{
            background: 'var(--bg-tertiary)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 700
            }}>
              <User size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '15px', color: '#fff' }}>
                {citation.guest}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Lenny's Podcast Featured Leader
              </div>
            </div>
          </div>

          {/* Episode Info */}
          <div className="source-card">
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Episode Title
            </div>
            <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#fff' }}>
              {citation.episode_title}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <Clock size={12} color="var(--accent-primary)" />
              <span className="source-timestamp">
                Timestamp: {citation.timestamp || "Discussion"}
              </span>
            </div>
          </div>

          {/* Verbatim Quote */}
          <div className="source-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              <Quote size={12} color="var(--accent-primary)" />
              <span>Verbatim Transcript Quote</span>
            </div>
            <div className="source-quote">
              "{citation.quote}"
            </div>
          </div>

          {/* Official Source Link */}
          {citation.source_url && (
            <a 
              href={citation.source_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ marginTop: 'auto', textDecoration: 'none' }}
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
