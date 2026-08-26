import React, { useState, useEffect } from 'react';
import { X, BookOpen, Search, ExternalLink, Sparkles, User, Mic } from 'lucide-react';
import { api } from '../services/api';

export default function KnowledgeBaseModal({ isOpen, onClose }) {
  const [transcriptsData, setTranscriptsData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async (query = '') => {
    setLoading(true);
    try {
      const data = await api.getTranscripts(query);
      setTranscriptsData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadData(searchQuery);
  };

  if (!isOpen) return null;

  return (
    <div className="source-drawer-overlay" onClick={onClose}>
      <div 
        style={{
          width: '780px',
          maxWidth: '92vw',
          height: '85vh',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          margin: 'auto',
          animation: 'fadeIn 0.2s ease-out',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-tertiary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <BookOpen size={16} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '16px', color: '#fff' }}>
                Lenny's Podcast Knowledge Base
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Ingested, chunked, and indexed transcripts ready for grounded RAG
              </div>
            </div>
          </div>

          <button className="btn btn-ghost" onClick={onClose} style={{ padding: '6px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Search Input Bar */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-primary)' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--bg-secondary)',
              padding: '8px 14px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-medium)'
            }}>
              <Search size={16} color="var(--text-muted)" />
              <input 
                type="text"
                placeholder="Search across all podcast transcripts (e.g. 'Retention', 'LNO', 'Pricing', 'Chesky')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  width: '100%',
                  fontSize: '13.5px'
                }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '8px 18px' }}>
              Search
            </button>
          </form>
        </div>

        {/* Body Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              Searching transcript knowledge base...
            </div>
          ) : transcriptsData?.results ? (
            // Search Results Mode
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Found {transcriptsData.results.length} relevant chunks for "{transcriptsData.query}"
              </div>
              {transcriptsData.results.map((res, idx) => (
                <div key={idx} className="source-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, color: '#fff', fontSize: '14px' }}>
                      {res.chunk.guest} — {res.chunk.episode_title}
                    </span>
                    <span className="badge badge-primary">
                      Score: {res.score}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Topic: {res.chunk.topic} | Timestamp: {res.chunk.timestamp}
                  </div>
                  <div className="source-quote">
                    "{res.chunk.text}"
                  </div>
                </div>
              ))}
            </div>
          ) : transcriptsData?.episodes ? (
            // Episodes List Mode
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
              {transcriptsData.episodes.map((ep, idx) => (
                <div 
                  key={idx}
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                    <div>
                      <span className="badge badge-primary" style={{ marginBottom: '4px' }}>{ep.episode_id}</span>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: '#fff' }}>{ep.guest}</div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{ep.guest_bio}</div>
                    </div>
                  </div>

                  <div style={{ fontSize: '12.5px', color: '#cbd5e1', lineHeight: 1.4 }}>
                    {ep.title}
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: 'auto' }}>
                    {ep.topics.map((t, tidx) => (
                      <span key={tidx} style={{
                        background: 'rgba(255, 255, 255, 0.06)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '10.5px',
                        color: 'var(--text-secondary)'
                      }}>
                        {t}
                      </span>
                    ))}
                  </div>

                  <a 
                    href={ep.source_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="source-link"
                    style={{ marginTop: '6px' }}
                  >
                    <span>View Episode Page</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
