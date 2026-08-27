import React, { useState } from 'react';
import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  Search, 
  BookOpen, 
  Sparkles,
  RotateCcw
} from 'lucide-react';

export default function Sidebar({ 
  sessions, 
  activeSessionId, 
  onSelectSession, 
  onNewSession, 
  onDeleteSession,
  onClearAllSessions,
  onOpenKnowledgeBase,
  health,
  isOpen,
  onClose
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filteredSessions = sessions.filter(s => 
    (s.title || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <aside className={`sidebar ${isOpen ? '' : 'collapsed'}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '26px',
            height: '26px',
            borderRadius: 'var(--radius-xs)',
            backgroundColor: 'var(--text-primary)',
            color: 'var(--bg-app)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px',
            fontFamily: 'var(--text-serif-display)',
            fontWeight: 700
          }}>
            L
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.2 }}>Discussions</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{sessions.length} recorded</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="sidebar-actions" style={{ display: 'flex', gap: '6px' }}>
        <button className="btn-new-chat" onClick={onNewSession} style={{ flex: 1 }}>
          <Plus size={15} />
          <span>New Discussion</span>
        </button>

        {sessions.length > 0 && (
          <button 
            className="btn btn-secondary" 
            title="Clear all chat history"
            onClick={() => setShowClearConfirm(true)}
            style={{ padding: '0 10px', color: 'var(--text-muted)', borderColor: 'var(--border-subtle)' }}
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>

      {/* Clear Confirmation Modal / Banner */}
      {showClearConfirm && (
        <div style={{
          margin: '0 14px 8px',
          padding: '10px 12px',
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.35)',
          borderRadius: '8px',
          fontSize: '11.5px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <span style={{ color: '#fca5a5', fontWeight: 600 }}>Clear all conversations?</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button 
              onClick={() => {
                onClearAllSessions();
                setShowClearConfirm(false);
              }}
              style={{
                flex: 1,
                padding: '4px 8px',
                background: '#ef4444',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Confirm Clear
            </button>
            <button 
              onClick={() => setShowClearConfirm(false)}
              style={{
                padding: '4px 8px',
                background: 'transparent',
                color: 'var(--text-muted)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '4px',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div style={{ padding: '0 14px 6px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'var(--bg-card)',
          padding: '6px 8px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
          fontSize: '12px'
        }}>
          <Search size={13} color="var(--text-muted)" />
          <input 
            type="text"
            placeholder="Search discussions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              width: '100%',
              fontSize: '12px'
            }}
          />
        </div>
      </div>

      {/* Sessions List */}
      <div className="sessions-list">
        <div style={{ 
          fontSize: '10.5px', 
          fontWeight: 700, 
          color: 'var(--text-muted)', 
          padding: '4px 6px', 
          textTransform: 'uppercase', 
          letterSpacing: '0.05em',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>Conversations ({filteredSessions.length})</span>
        </div>
        
        {filteredSessions.length === 0 ? (
          <div style={{ padding: '24px 8px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
            No conversations yet
          </div>
        ) : (
          filteredSessions.map((s) => (
            <div 
              key={s.id}
              className={`session-item ${s.id === activeSessionId ? 'active' : ''}`}
              onClick={() => onSelectSession(s.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                <MessageSquare size={13} style={{ flexShrink: 0, opacity: 0.7 }} />
                <span className="session-title">{s.title || "Discussion"}</span>
              </div>
              <button 
                className="btn-delete-session"
                title="Delete discussion"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSession(s.id);
                }}
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer Info */}
      <div style={{ 
        padding: '10px 14px', 
        borderTop: '1px solid var(--border-subtle)', 
        background: 'var(--bg-sidebar)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        <button 
          onClick={onOpenKnowledgeBase}
          className="btn btn-secondary" 
          style={{ width: '100%', fontSize: '11.5px', justifyContent: 'flex-start', padding: '6px 10px' }}
        >
          <BookOpen size={13} color="var(--accent)" />
          <span>Transcripts</span>
          <span className="badge badge-primary" style={{ marginLeft: 'auto', fontSize: '10px' }}>
            {health?.transcripts_count || 4389} chunks
          </span>
        </button>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          fontSize: '10.5px',
          color: 'var(--text-muted)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ 
              width: '6px', 
              height: '6px', 
              borderRadius: '50%', 
              background: 'var(--success)',
              boxShadow: '0 0 6px var(--success)'
            }}></span>
            <span>RAG Online (279 eps)</span>
          </div>
          <span style={{ fontFamily: 'monospace' }}>v1.0.0</span>
        </div>
      </div>
    </aside>
  );
}
