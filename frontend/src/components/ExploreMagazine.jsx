import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  Quote, 
  PenTool, 
  TrendingUp, 
  X, 
  Layers 
} from 'lucide-react';
import { api } from '../services/api';

export default function ExploreMagazine({ 
  onStartChat, 
  onOpenWritingTopic,
  selectedTopicId = null
}) {
  const [topics, setTopics] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTopicDetail, setActiveTopicDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTopics();
  }, []);

  useEffect(() => {
    if (selectedTopicId && topics.length > 0) {
      handleSelectTopic(selectedTopicId);
    }
  }, [selectedTopicId, topics]);

  const loadTopics = async () => {
    try {
      const data = await api.getTopics();
      setTopics(data);
    } catch (err) {
      console.error("Error loading topics:", err);
    }
  };

  const handleSelectTopic = async (topicId) => {
    setLoading(true);
    try {
      const detail = await api.getTopicDetail(topicId);
      setActiveTopicDetail(detail);
    } catch (err) {
      console.error("Error loading topic detail:", err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Core Strategy', 'Growth & Distribution', 'Design & Craft', 'Execution & Career', 'Marketing & Sales', 'Consumer Growth'];

  const filteredTopics = topics.filter(t => {
    const matchesCat = activeCategory === 'All' || t.category === activeCategory;
    const matchesSearch = !searchQuery || 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.top_guests.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="home-container">
      {/* Editorial Header */}
      <div style={{ marginBottom: '32px', borderBottom: '1px solid var(--border-medium)', paddingBottom: '24px' }}>
        <span className="tag-category tag-brown" style={{ marginBottom: '8px' }}>
          Knowledge Explorer
        </span>
        <h1 className="font-display" style={{ fontSize: '36px', color: 'var(--text-primary)', marginTop: '6px' }}>
          The Lenny Growth Magazine & Playbooks
        </h1>
        <p style={{ fontSize: '15.5px', color: 'var(--text-secondary)', maxWidth: '700px', marginTop: '6px' }}>
          Curated mental models, frameworks, and verbatim transcripts from top product executives, founders, and growth operators.
        </p>

        {/* Search & Category Filter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 16px',
            maxWidth: '540px'
          }}>
            <Search size={16} color="var(--text-muted)" />
            <input 
              type="text"
              placeholder="Search topics, frameworks, or guests (e.g. Gustaf, Sean Ellis, LNO, Chesky)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                width: '100%',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {categories.map(cat => (
              <button 
                key={cat}
                className={`tag-category ${activeCategory === cat ? 'tag-brown' : 'tag-neutral'}`}
                style={{ cursor: 'pointer', padding: '6px 12px', fontSize: '12px' }}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="explore-grid">
        {filteredTopics.map((t) => (
          <div 
            key={t.id}
            className="explore-card"
            onClick={() => handleSelectTopic(t.id)}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span className="tag-category tag-brown">{t.category}</span>
                <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                  {t.chunk_count}+ Chunks
                </span>
              </div>

              <h2 className="explore-card-title">{t.title}</h2>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '16px' }}>
                {t.description}
              </p>

              {/* Guests */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 700 }}>
                  Key Operators & Guests:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {t.top_guests.map((g, idx) => (
                    <span key={idx} style={{ 
                      fontSize: '12px', 
                      backgroundColor: 'var(--bg-app)', 
                      border: '1px solid var(--border-subtle)', 
                      padding: '2px 8px', 
                      borderRadius: 'var(--radius-xs)',
                      fontWeight: 500
                    }}>
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Frameworks */}
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 700 }}>
                  Featured Frameworks:
                </div>
                <ul style={{ fontSize: '12.5px', color: 'var(--text-secondary)', paddingLeft: '16px', lineHeight: 1.5 }}>
                  {t.frameworks.slice(0, 3).map((f, idx) => (
                    <li key={idx}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Explore Playbook <ArrowRight size={13} />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Topic Detail Modal (Screen 03) */}
      {activeTopicDetail && (
        <div className="modal-overlay" onClick={() => setActiveTopicDetail(null)}>
          <div className="modal-content-card" style={{ maxWidth: '780px' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setActiveTopicDetail(null)}>
              <X size={18} />
            </button>

            <span className="tag-category tag-brown" style={{ marginBottom: '8px' }}>
              {activeTopicDetail.category}
            </span>

            <h2 className="font-display" style={{ fontSize: '28px', color: 'var(--text-primary)', marginTop: '4px', marginBottom: '12px' }}>
              {activeTopicDetail.title}
            </h2>

            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
              {activeTopicDetail.description}
            </p>

            {/* Actions: Start Chat / Write Essay */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  onStartChat(activeTopicDetail.sample_questions[0] || `Explain ${activeTopicDetail.title}`);
                  setActiveTopicDetail(null);
                }}
              >
                <Sparkles size={14} />
                <span>Ask Lenny about {activeTopicDetail.title.split('&')[0].trim()}</span>
              </button>

              <button 
                className="btn btn-accent-green"
                onClick={() => {
                  onOpenWritingTopic(activeTopicDetail.title);
                  setActiveTopicDetail(null);
                }}
              >
                <PenTool size={14} />
                <span>Write Ship 30 Essay</span>
              </button>
            </div>

            <hr className="editorial-rule" />

            {/* Popular Questions */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: 700 }}>
                Popular Grounded Questions:
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {activeTopicDetail.sample_questions.map((q, idx) => (
                  <div 
                    key={idx}
                    style={{
                      padding: '10px 14px',
                      backgroundColor: 'var(--bg-app)',
                      border: '1px solid var(--border-medium)',
                      borderRadius: 'var(--radius-xs)',
                      fontSize: '13.5px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                    onClick={() => {
                      onStartChat(q);
                      setActiveTopicDetail(null);
                    }}
                  >
                    <span>{q}</span>
                    <ArrowRight size={13} color="var(--accent-primary)" />
                  </div>
                ))}
              </div>
            </div>

            {/* Verbatim Evidence Samples */}
            {activeTopicDetail.evidence_samples && activeTopicDetail.evidence_samples.length > 0 && (
              <div>
                <h3 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: 700 }}>
                  Verbatim Transcript Quotes & Citations:
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {activeTopicDetail.evidence_samples.map((ev, idx) => (
                    <div key={idx} className="source-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="source-guest">{ev.guest}</span>
                        <span className="source-timestamp">{ev.timestamp}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>
                        {ev.episode_title}
                      </div>
                      <blockquote className="source-quote">
                        "{ev.quote}"
                      </blockquote>
                      {ev.source_url && (
                        <a href={ev.source_url} target="_blank" rel="noreferrer" className="source-link">
                          <span>Listen to verbatim segment →</span>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
