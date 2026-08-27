import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Search, 
  ExternalLink, 
  Clock, 
  User, 
  BookOpen, 
  Play 
} from 'lucide-react';
import { api } from '../services/api';

export default function EpisodeDetailModal({ episodeId, onClose, onStartChat }) {
  const [episode, setEpisode] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (episodeId) {
      loadEpisode();
    }
  }, [episodeId]);

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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-card" style={{ maxWidth: '820px' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        {loading ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading episode transcript...
          </div>
        ) : episode ? (
          <div>
            {/* Episode Meta Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <span className="tag-category tag-brown">
                Episode Transcripts
              </span>
              {episode.source_url && (
                <a 
                  href={episode.source_url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="source-link"
                  style={{ marginTop: 0 }}
                >
                  <span>Listen on Lenny’s Podcast</span>
                  <ExternalLink size={12} />
                </a>
              )}
            </div>

            <h2 className="font-display" style={{ fontSize: '26px', color: 'var(--text-primary)', marginTop: '6px', marginBottom: '6px' }}>
              {episode.title}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>Guest: {episode.guest}</span>
              {episode.chunks_count && (
                <>
                  <span>•</span>
                  <span>{episode.chunks_count} Indexed Chunks</span>
                </>
              )}
            </div>

            {episode.guest_bio && (
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '18px', fontStyle: 'italic' }}>
                {episode.guest_bio}
              </p>
            )}

            {/* CTA */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  onStartChat(`What are the key product frameworks shared by ${episode.guest} in "${episode.title}"?`);
                  onClose();
                }}
              >
                <Sparkles size={14} />
                <span>Ask about this episode</span>
              </button>
            </div>

            <hr className="editorial-rule" />

            {/* Transcript Chunks Search & Viewer (Screen 05) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 700 }}>
                  Verbatim Transcript Passages ({filteredChunks.length})
                </h3>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'var(--bg-app)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '4px 10px',
                  fontSize: '12px'
                }}>
                  <Search size={12} color="var(--text-muted)" />
                  <input 
                    type="text"
                    placeholder="Search in transcript..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: 'var(--text-primary)',
                      fontSize: '12px',
                      width: '160px'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto', paddingRight: '6px' }}>
                {filteredChunks.map((chunk, idx) => (
                  <div 
                    key={chunk.id || idx}
                    style={{
                      padding: '14px 16px',
                      backgroundColor: 'var(--bg-app)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-xs)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {chunk.guest || episode.guest}
                      </span>
                      {chunk.timestamp && (
                        <span className="source-timestamp">
                          {chunk.timestamp}
                        </span>
                      )}
                    </div>

                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      "{chunk.text}"
                    </p>

                    {chunk.topic && (
                      <div style={{ marginTop: '8px' }}>
                        <span className="tag-category tag-neutral" style={{ fontSize: '10px' }}>
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
