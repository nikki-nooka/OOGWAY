import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Search, 
  ExternalLink, 
  Clock, 
  User, 
  BookOpen, 
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';

export default function EpisodeDetailModal({ episodeId, onClose, onStartChat }) {
  const [episode, setEpisode] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (episodeId) {
      document.body.style.overflow = 'hidden';
      loadEpisode();
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [episodeId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && episodeId) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [episodeId, onClose]);

  const loadEpisode = async () => {
    setLoading(true);
    try {
      const data = await api.getSourceDetail(episodeId);
      setEpisode(data);
    } catch (err) {
      console.error("Error loading episode:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!episodeId) return null;

  const filteredChunks = episode?.all_chunks?.filter(c => 
    !searchQuery || 
    c.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.topic.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="modal-content-card" 
        style={{ maxWidth: '840px', padding: '2rem' }} 
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose} aria-label="Close episode detail">
          <X size={18} />
        </button>

        {loading ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div className="skeleton" style={{ height: '24px', width: '40%', margin: '0 auto 12px auto' }}></div>
            <div className="skeleton" style={{ height: '32px', width: '80%', margin: '0 auto 16px auto' }}></div>
            <div className="skeleton" style={{ height: '80px', width: '100%', margin: '0 auto' }}></div>
          </div>
        ) : episode ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto' }}>
            {/* Episode Meta Header */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="tag-category tag-brown">
                  {episode.episode_id || 'Lenny’s Podcast'}
                </span>
                {episode.source_url && (
                  <a 
                    href={episode.source_url} 
                    target="_blank" 
                    rel="noreferrer" 
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '4px', 
                      fontSize: '0.85rem', 
                      color: 'var(--accent-primary)', 
                      fontWeight: 600,
                      textDecoration: 'none'
                    }}
                  >
                    <span>Official Podcast Notes</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>

              <h2 className="font-display" style={{ fontSize: '1.8rem', color: 'var(--text-primary)', margin: '0.35rem 0 0.5rem 0', lineHeight: 1.25 }}>
                {episode.title}
              </h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{episode.guest}</span>
                {episode.chunks_count && (
                  <>
                    <span>•</span>
                    <span>{episode.chunks_count} Verified Transcript Chunks</span>
                  </>
                )}
              </div>

              {episode.guest_bio && (
                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem', fontStyle: 'italic' }}>
                  {episode.guest_bio.replace(/''/g, "'")}
                </p>
              )}

              {/* Action Trigger */}
              <button 
                className="btn btn-primary"
                onClick={() => {
                  onStartChat(`What are the key product frameworks and advice shared by ${episode.guest} in "${episode.title}"?`);
                  onClose();
                }}
                style={{ padding: '0.65rem 1.25rem' }}
              >
                <Sparkles size={15} />
                <span>Ask Lenny about {episode.guest}</span>
              </button>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '0.25rem 0' }} />

            {/* Transcript Chunks Section */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', fontWeight: 700 }}>
                  Verbatim Transcript Passages ({filteredChunks.length})
                </h3>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '4px 10px',
                  fontSize: '0.85rem'
                }}>
                  <Search size={14} color="var(--text-muted)" />
                  <input 
                    type="text"
                    placeholder="Search inside episode..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem',
                      width: '180px'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '340px', overflowY: 'auto', paddingRight: '4px' }}>
                {filteredChunks.map((chunk, idx) => (
                  <div 
                    key={chunk.id || idx}
                    style={{
                      padding: '1rem 1.25rem',
                      backgroundColor: 'var(--bg-app)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {chunk.guest || episode.guest}
                      </span>
                      {chunk.timestamp && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600, fontFamily: 'var(--text-mono)' }}>
                          {chunk.timestamp}
                        </span>
                      )}
                    </div>

                    <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.6, fontStyle: 'italic' }}>
                      "{chunk.text}"
                    </p>

                    {chunk.topic && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <span className="tag-category tag-brown" style={{ fontSize: '0.7rem' }}>
                          {chunk.topic}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--status-danger)' }}>
            Episode could not be found.
          </div>
        )}
      </div>
    </div>
  );
}
