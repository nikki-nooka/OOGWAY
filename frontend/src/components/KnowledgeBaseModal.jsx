import React, { useState, useEffect } from 'react';
import { X, BookOpen, Search, ExternalLink, Sparkles, ArrowRight, Tag, User } from 'lucide-react';
import { api } from '../services/api';

export default function KnowledgeBaseModal({ isOpen, onClose, onSelectEpisode, onStartChat }) {
  const [transcriptsData, setTranscriptsData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      loadData();
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
    e?.preventDefault();
    loadData(searchQuery);
  };

  const handleQuickTagClick = (tag) => {
    setSearchQuery(tag);
    loadData(tag);
  };

  if (!isOpen) return null;

  const quickSearchTags = ['Product-Market Fit', 'Retention', 'LNO Framework', 'Pricing', 'B2B Viral Loops', 'Brian Chesky'];

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="kb-modal-title">
      <div 
        className="modal-content-card" 
        style={{ width: '1100px', maxWidth: '94vw', maxHeight: '86vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tier 1: Fixed Header */}
        <div style={{
          padding: '1.25rem 1.75rem',
          borderBottom: '1px solid var(--border-medium)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--bg-surface)',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              <BookOpen size={18} />
            </div>
            <div>
              <h2 id="kb-modal-title" style={{ 
                margin: 0, 
                fontSize: '1.3rem', 
                fontFamily: 'var(--text-serif-display)', 
                fontWeight: 600, 
                color: 'var(--text-primary)',
                lineHeight: 1.2
              }}>
                Lenny's Podcast Knowledge Base
              </h2>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                279 verified episodes • 4,389 transcript passages indexed
              </div>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="modal-close-btn"
            style={{ position: 'static' }}
            aria-label="Close Knowledge Base"
            title="Close (Esc)"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tier 2: Search & Quick Filter Component */}
        <div style={{ 
          padding: '1.25rem 1.75rem 1rem 1.75rem', 
          borderBottom: '1px solid var(--border-subtle)', 
          backgroundColor: 'var(--bg-surface)',
          flexShrink: 0
        }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              backgroundColor: 'var(--bg-input)',
              padding: '0.65rem 1rem',
              borderRadius: 'var(--radius-sm)',
              border: '1.5px solid var(--border-medium)',
              transition: 'border-color 0.15s ease'
            }}>
              <Search size={18} color="var(--text-muted)" />
              <input 
                type="text"
                placeholder="Search transcript knowledge (e.g., 'Retention curves', '11-star experience', 'Rahul Vohra')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  width: '100%',
                  fontSize: '0.95rem',
                  fontFamily: 'var(--text-sans)'
                }}
              />
              {searchQuery && (
                <button 
                  type="button" 
                  onClick={() => { setSearchQuery(''); loadData(''); }}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ padding: '0 1.5rem', height: '44px' }}
            >
              <span>Search</span>
              <ArrowRight size={15} />
            </button>
          </form>

          {/* Quick Search Tag Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Suggested:
            </span>
            {quickSearchTags.map((tag, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickTagClick(tag)}
                style={{
                  background: searchQuery === tag ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                  color: searchQuery === tag ? '#FFFFFF' : 'var(--text-secondary)',
                  border: 'none',
                  padding: '3px 9px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Tier 3: Scrollable Content Viewport */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '1.5rem 1.75rem', 
          backgroundColor: 'var(--bg-app)'
        }}>
          {loading ? (
            /* Skeleton Loading State */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} style={{ padding: '1.5rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                  <div className="skeleton" style={{ height: '18px', width: '35%', marginBottom: '12px' }}></div>
                  <div className="skeleton" style={{ height: '24px', width: '80%', marginBottom: '8px' }}></div>
                  <div className="skeleton" style={{ height: '14px', width: '95%', marginBottom: '6px' }}></div>
                  <div className="skeleton" style={{ height: '14px', width: '60%', marginBottom: '16px' }}></div>
                  <div className="skeleton" style={{ height: '32px', width: '100%' }}></div>
                </div>
              ))}
            </div>
          ) : transcriptsData?.results ? (
            /* Search Results Mode */
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Found {transcriptsData.results.length} relevant transcript passages for "{transcriptsData.query}":</span>
                <button 
                  onClick={() => { setSearchQuery(''); loadData(''); }}
                  style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Clear search & show all episodes
                </button>
              </div>

              {transcriptsData.results.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <h3 style={{ fontFamily: 'var(--text-serif-display)', fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                    No exact transcript matches found
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto 1.5rem auto' }}>
                    Try searching for broader terms like "PMF", "Retention", "Growth loops", or guest names like "Elena Verna".
                  </p>
                  <button className="btn btn-secondary" onClick={() => handleQuickTagClick('Product-Market Fit')}>
                    Explore Product-Market Fit
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {transcriptsData.results.map((res, idx) => (
                    <div 
                      key={idx} 
                      style={{
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1.25rem 1.5rem',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                        <div>
                          <span style={{ 
                            fontFamily: 'var(--text-serif-display)', 
                            fontWeight: 600, 
                            color: 'var(--text-primary)', 
                            fontSize: '1.15rem' 
                          }}>
                            {res.chunk.guest}
                          </span>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>
                            • {res.chunk.episode_title}
                          </span>
                        </div>
                        <span style={{
                          backgroundColor: 'rgba(36, 93, 85, 0.12)',
                          color: 'var(--accent-secondary)',
                          padding: '0.2rem 0.5rem',
                          borderRadius: 'var(--radius-xs)',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}>
                          Score: {res.score}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                        Topic: {res.chunk.topic} • Timestamp: {res.chunk.timestamp}
                      </div>

                      <div style={{ 
                        fontSize: '0.92rem', 
                        color: 'var(--text-primary)', 
                        lineHeight: 1.6, 
                        borderLeft: '3px solid var(--accent-primary)',
                        paddingLeft: '0.85rem',
                        fontStyle: 'italic',
                        backgroundColor: 'var(--bg-surface)',
                        padding: '0.75rem 1rem',
                        borderRadius: '0 var(--radius-sm) var(--radius-sm) 0'
                      }}>
                        "{res.chunk.text}"
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : transcriptsData?.episodes ? (
            /* Episodes Grid Mode (Canonical Hierarchy) */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {transcriptsData.episodes.map((ep, idx) => (
                <div 
                  key={idx}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.4rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div>
                    {/* Top Category & Episode Badge */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                      <span className="tag-category tag-brown">
                        {ep.episode_id}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        {ep.chunks_count || 16} Chunks
                      </span>
                    </div>

                    {/* Guest Name & Title (Visual Dominance) */}
                    <h3 style={{ 
                      margin: '0 0 0.25rem 0', 
                      fontSize: '1.25rem', 
                      fontFamily: 'var(--text-serif-display)', 
                      fontWeight: 600, 
                      color: 'var(--text-primary)',
                      lineHeight: 1.25
                    }}>
                      {ep.guest}
                    </h3>
                    
                    <div style={{ 
                      fontSize: '0.82rem', 
                      fontWeight: 600,
                      color: 'var(--accent-secondary)', 
                      marginBottom: '0.5rem' 
                    }}>
                      {ep.guest_bio.replace(/''/g, "'")}
                    </div>

                    {/* Clamped Short Description */}
                    <p className="line-clamp-2" style={{ 
                      margin: '0 0 0.85rem 0', 
                      fontSize: '0.85rem', 
                      color: 'var(--text-secondary)', 
                      lineHeight: 1.45 
                    }}>
                      {ep.title.replace(/''/g, "'")}
                    </p>
                  </div>

                  <div>
                    {/* Topic Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                      {ep.topics.slice(0, 3).map((t, tidx) => (
                        <span key={tidx} style={{
                          backgroundColor: 'var(--bg-tertiary)',
                          padding: '0.2rem 0.5rem',
                          borderRadius: 'var(--radius-xs)',
                          fontSize: '0.72rem',
                          color: 'var(--text-secondary)',
                          fontWeight: 600
                        }}>
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Action Button */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                      <a 
                        href={ep.source_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          color: 'var(--accent-primary)',
                          textDecoration: 'none'
                        }}
                      >
                        <span>Official Notes</span>
                        <ExternalLink size={12} />
                      </a>

                      {onSelectEpisode && (
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '4px 10px', fontSize: '11.5px' }}
                          onClick={() => {
                            onSelectEpisode(ep.episode_id);
                            onClose();
                          }}
                        >
                          <span>View Detail</span>
                          <ArrowRight size={12} />
                        </button>
                      )}
                    </div>
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
