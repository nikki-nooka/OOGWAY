import React, { useState, useEffect } from 'react';
import { X, BookOpen, Search, ExternalLink, Sparkles, Mic, Tag } from 'lucide-react';
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
      console.error('Failed to load knowledge base transcripts:', e);
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
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(16, 16, 15, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        animation: 'fadeIn 0.15s ease-out'
      }} 
      onClick={onClose}
    >
      <div 
        style={{
          width: '880px',
          maxWidth: '100%',
          maxHeight: '90vh',
          backgroundColor: 'var(--bg-surface, #FBFAF6)',
          border: '1px solid var(--border-medium, #D9D4C9)',
          borderRadius: '12px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'scaleUp 0.2s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid var(--border-subtle, #E2DDD2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--bg-app, #F5F2EA)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              backgroundColor: 'var(--accent-primary, #9A5B2E)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 2px 6px rgba(154, 91, 46, 0.3)'
            }}>
              <BookOpen size={20} />
            </div>
            <div>
              <h2 style={{ 
                margin: 0, 
                fontSize: '1.25rem', 
                fontFamily: 'var(--text-serif-display, serif)', 
                fontWeight: 600, 
                color: 'var(--text-primary, #161616)' 
              }}>
                Lenny's Podcast Knowledge Base
              </h2>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary, #66635C)', marginTop: '0.15rem' }}>
                4,389 verified transcript passages across 279 full episodes
              </div>
            </div>
          </div>

          <button 
            onClick={onClose} 
            style={{ 
              background: 'transparent', 
              border: 'none', 
              cursor: 'pointer', 
              color: 'var(--text-muted, #8E8A80)', 
              padding: '6px', 
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ 
          padding: '1rem 1.75rem', 
          borderBottom: '1px solid var(--border-subtle, #E2DDD2)', 
          backgroundColor: 'var(--bg-surface, #FBFAF6)' 
        }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem' }}>
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              backgroundColor: 'var(--bg-input, #FFFFFF)',
              padding: '0.65rem 1rem',
              borderRadius: '6px',
              border: '1px solid var(--border-medium, #D9D4C9)'
            }}>
              <Search size={18} color="var(--text-muted, #8E8A80)" />
              <input 
                type="text"
                placeholder="Search across all transcripts (e.g. 'Retention curves', 'LNO framework', 'Brian Chesky')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary, #161616)',
                  width: '100%',
                  fontSize: '0.95rem'
                }}
              />
            </div>
            <button 
              type="submit" 
              style={{
                backgroundColor: 'var(--accent-primary, #9A5B2E)',
                color: '#FFFFFF',
                border: 'none',
                padding: '0 1.5rem',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'opacity 0.2s ease'
              }}
            >
              Search
            </button>
          </form>
        </div>

        {/* Modal Body */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '1.5rem 1.75rem', 
          backgroundColor: 'var(--bg-app, #F5F2EA)',
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1rem' 
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary, #66635C)' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 500, marginBottom: '0.5rem' }}>Searching knowledge base...</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Querying 4,389 indexed transcript passages.</p>
            </div>
          ) : transcriptsData?.results ? (
            // Search Results Mode
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Found {transcriptsData.results.length} relevant chunks for "{transcriptsData.query}":
              </div>
              {transcriptsData.results.map((res, idx) => (
                <div 
                  key={idx} 
                  style={{
                    backgroundColor: 'var(--bg-card, #FBFAF6)',
                    border: '1px solid var(--border-subtle, #E2DDD2)',
                    borderRadius: '8px',
                    padding: '1.25rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <div>
                      <span style={{ 
                        fontFamily: 'var(--text-serif-display, serif)', 
                        fontWeight: 600, 
                        color: 'var(--text-primary, #161616)', 
                        fontSize: '1.05rem' 
                      }}>
                        {res.chunk.guest}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary, #66635C)', marginLeft: '0.5rem' }}>
                        • {res.chunk.episode_title}
                      </span>
                    </div>
                    <span style={{
                      backgroundColor: 'rgba(36, 93, 85, 0.1)',
                      color: 'var(--color-primary-forest, #245D55)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}>
                      Score: {res.score}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #8E8A80)', marginBottom: '0.75rem' }}>
                    Topic: {res.chunk.topic} | Timestamp: {res.chunk.timestamp}
                  </div>
                  <div style={{ 
                    fontSize: '0.9rem', 
                    color: 'var(--text-primary, #161616)', 
                    lineHeight: 1.6, 
                    borderLeft: '3px solid var(--accent-primary, #9A5B2E)',
                    paddingLeft: '0.85rem',
                    fontStyle: 'italic'
                  }}>
                    "{res.chunk.text}"
                  </div>
                </div>
              ))}
            </div>
          ) : transcriptsData?.episodes ? (
            // Episodes List Mode
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1rem' }}>
              {transcriptsData.episodes.map((ep, idx) => (
                <div 
                  key={idx}
                  style={{
                    backgroundColor: 'var(--bg-card, #FBFAF6)',
                    border: '1px solid var(--border-subtle, #E2DDD2)',
                    borderRadius: '8px',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{
                        backgroundColor: 'var(--bg-tertiary, #E8E3D7)',
                        color: 'var(--text-primary, #161616)',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        fontFamily: 'var(--text-mono, monospace)'
                      }}>
                        {ep.episode_id}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted, #8E8A80)', fontWeight: 500 }}>
                        Lenny's Podcast
                      </span>
                    </div>

                    <h3 style={{ 
                      margin: '0 0 0.25rem 0', 
                      fontSize: '1.1rem', 
                      fontFamily: 'var(--text-serif-display, serif)', 
                      fontWeight: 600, 
                      color: 'var(--text-primary, #161616)' 
                    }}>
                      {ep.guest}
                    </h3>
                    
                    <p style={{ 
                      margin: '0 0 0.75rem 0', 
                      fontSize: '0.8rem', 
                      color: 'var(--text-secondary, #66635C)', 
                      lineHeight: 1.4 
                    }}>
                      {ep.guest_bio.replace(/''/g, "'")}
                    </p>

                    <div style={{ 
                      fontSize: '0.85rem', 
                      color: 'var(--text-primary, #161616)', 
                      lineHeight: 1.4,
                      marginBottom: '0.85rem',
                      fontWeight: 500
                    }}>
                      {ep.title.replace(/''/g, "'")}
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.85rem' }}>
                      {ep.topics.map((t, tidx) => (
                        <span key={tidx} style={{
                          backgroundColor: 'var(--bg-tertiary, #E8E3D7)',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          color: 'var(--text-secondary, #66635C)',
                          fontWeight: 500
                        }}>
                          {t}
                        </span>
                      ))}
                    </div>

                    <a 
                      href={ep.source_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: 'var(--accent-primary, #9A5B2E)',
                        textDecoration: 'none'
                      }}
                    >
                      <span>View Official Episode Notes</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
