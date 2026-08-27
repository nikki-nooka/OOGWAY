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
  Layers,
  Network,
  Sliders
} from 'lucide-react';
import { api } from '../services/api';
import KnowledgeGraphView from './KnowledgeGraphView';
import PMFDiagnosticView from './PMFDiagnosticView';

export default function ExploreMagazine({ 
  onStartChat, 
  onOpenWritingTopic,
  selectedTopicId = null
}) {
  const [subView, setSubView] = useState('topics'); // 'topics' | 'graph' | 'pmf'
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

  // Lock body scroll when deep dive modal is open
  useEffect(() => {
    if (activeTopicDetail) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeTopicDetail]);

  // Esc key listener for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && activeTopicDetail) {
        setActiveTopicDetail(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTopicDetail]);

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
    <div>
      {/* Sub-Navigation Switcher */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1.25rem 1.5rem 0 1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <button
          onClick={() => setSubView('topics')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1.25rem',
            border: 'none',
            borderBottom: subView === 'topics' ? '2.5px solid var(--accent-primary)' : '2.5px solid transparent',
            background: 'transparent',
            color: subView === 'topics' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: subView === 'topics' ? 700 : 500,
            fontSize: '0.95rem',
            cursor: 'pointer'
          }}
        >
          <BookOpen size={16} />
          <span>Curated Playbooks</span>
        </button>

        <button
          onClick={() => setSubView('graph')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1.25rem',
            border: 'none',
            borderBottom: subView === 'graph' ? '2.5px solid var(--accent-primary)' : '2.5px solid transparent',
            background: 'transparent',
            color: subView === 'graph' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: subView === 'graph' ? 700 : 500,
            fontSize: '0.95rem',
            cursor: 'pointer'
          }}
        >
          <Network size={16} />
          <span>Knowledge Graph</span>
        </button>

        <button
          onClick={() => setSubView('pmf')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1.25rem',
            border: 'none',
            borderBottom: subView === 'pmf' ? '2.5px solid var(--accent-primary)' : '2.5px solid transparent',
            background: 'transparent',
            color: subView === 'pmf' ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: subView === 'pmf' ? 700 : 500,
            fontSize: '0.95rem',
            cursor: 'pointer'
          }}
        >
          <Sliders size={16} />
          <span>PMF Diagnostic Engine</span>
        </button>
      </div>

      {subView === 'graph' ? (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
          <KnowledgeGraphView onSelectTopic={(t) => onStartChat(`Explain the connection between ${t} and related growth frameworks`)} />
        </div>
      ) : subView === 'pmf' ? (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
          <PMFDiagnosticView onStartChat={onStartChat} />
        </div>
      ) : (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem 4rem 1.5rem' }}>
          {/* Header */}
          <div style={{ marginBottom: '2rem' }}>
            <span className="tag-category tag-brown" style={{ marginBottom: '0.5rem' }}>
              Editorial Topics
            </span>
            <h1 className="font-display" style={{ fontSize: '2.4rem', color: 'var(--text-primary)', margin: '0.35rem 0 0.5rem 0' }}>
              Product & Growth Knowledge Base
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '720px', lineHeight: 1.5 }}>
              Explore curated strategic playbooks synthesised from 279+ podcast episodes, complete with speaker evidence, audio citations, and ready-to-use frameworks.
            </p>
          </div>

          {/* Search & Category Filter Toolbar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {/* Category Pills */}
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '4px' }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    border: 'none',
                    backgroundColor: activeCategory === cat ? 'var(--text-primary)' : 'var(--bg-tertiary)',
                    color: activeCategory === cat ? 'var(--bg-app)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.65rem 1rem',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-sm)'
              }}>
                <Search size={16} color="var(--text-muted)" />
                <input 
                  type="text" 
                  placeholder="Search topics, playbooks, frameworks, or guest names..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--text-primary)',
                    width: '100%',
                    fontSize: '0.92rem'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Topics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {filteredTopics.map(topic => (
              <div 
                key={topic.id}
                style={{ 
                  padding: '1.5rem', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-card)',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.15s ease'
                }}
                onClick={() => handleSelectTopic(topic.id)}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                    <span className="tag-category tag-brown">
                      {topic.category}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {topic.chunk_count} evidence chunks
                    </span>
                  </div>

                  <h3 className="font-display" style={{ fontSize: '1.3rem', color: 'var(--text-primary)', margin: '0.25rem 0 0.5rem 0', lineHeight: 1.25 }}>
                    {topic.title}
                  </h3>

                  <p className="line-clamp-3" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                    {topic.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '1rem' }}>
                    {topic.top_guests.slice(0, 3).map((guest, i) => (
                      <span key={i} style={{ fontSize: '0.72rem', padding: '2px 7px', borderRadius: 'var(--radius-xs)', backgroundColor: 'var(--bg-highlight)', color: 'var(--accent-primary)', fontWeight: 600 }}>
                        {guest}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
                  <button 
                    className="btn btn-ghost" 
                    style={{ fontSize: '0.82rem', padding: '4px 8px', color: 'var(--accent-primary)' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectTopic(topic.id);
                    }}
                  >
                    <span>Read Deep Dive</span>
                    <ArrowRight size={13} />
                  </button>

                  <button 
                    className="btn btn-secondary" 
                    style={{ fontSize: '0.8rem', padding: '4px 10px' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartChat(`Tell me about ${topic.title} and what top guests like ${topic.top_guests.join(', ')} recommend.`);
                    }}
                  >
                    <Sparkles size={12} color="var(--accent-primary)" />
                    <span>Ask Lenny</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Topic Detail Modal */}
          {activeTopicDetail && (
            <div className="modal-overlay" onClick={() => setActiveTopicDetail(null)} role="dialog" aria-modal="true">
              <div className="modal-content-card" style={{ maxWidth: '800px', maxHeight: '85vh', padding: '2rem' }} onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={() => setActiveTopicDetail(null)} aria-label="Close topic detail">
                  <X size={18} />
                </button>

                <span className="tag-category tag-brown" style={{ marginBottom: '0.5rem' }}>
                  {activeTopicDetail.category}
                </span>

                <h2 className="font-display" style={{ fontSize: '1.8rem', color: 'var(--text-primary)', margin: '0.35rem 0 0.65rem 0' }}>
                  {activeTopicDetail.title}
                </h2>

                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                  {activeTopicDetail.description}
                </p>

                {/* Frameworks Section */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 700 }}>
                    Core Frameworks & Mental Models
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {activeTopicDetail.frameworks.map((fw, i) => (
                      <div key={i} style={{ padding: '6px 12px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                        📐 {fw}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Evidence Passages */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 700 }}>
                    Transcript Evidence & Citations ({activeTopicDetail.citations?.length || 0})
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '240px', overflowY: 'auto', paddingRight: '4px' }}>
                    {activeTopicDetail.citations?.map((cit, idx) => (
                      <div key={idx} style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--bg-app)', borderLeft: '3px solid var(--accent-primary)', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0', fontSize: '0.85rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{cit.guest}</span>
                          <span style={{ color: 'var(--accent-primary)', fontWeight: 600, fontFamily: 'var(--text-mono)' }}>{cit.timestamp}</span>
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '4px' }}>
                          "{cit.quote}"
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Episode: {cit.episode_title}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Footer */}
                <div style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid var(--border-medium)', paddingTop: '1rem' }}>
                  <button 
                    className="btn btn-primary" 
                    style={{ flex: 1, padding: '0.65rem' }}
                    onClick={() => {
                      onStartChat(`Explain the core lessons and frameworks for ${activeTopicDetail.title}`);
                      setActiveTopicDetail(null);
                    }}
                  >
                    <Sparkles size={15} />
                    <span>Open in Discussion Chat</span>
                  </button>

                  <button 
                    className="btn btn-secondary" 
                    style={{ flex: 1, padding: '0.65rem' }}
                    onClick={() => {
                      onOpenWritingTopic(activeTopicDetail.title);
                      setActiveTopicDetail(null);
                    }}
                  >
                    <PenTool size={15} />
                    <span>Generate Ship 30 Essay</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
