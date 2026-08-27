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
          <Layers size={16} color={subView === 'topics' ? 'var(--accent-primary)' : 'var(--text-muted)'} />
          <span>Curated Playbooks & Topics</span>
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
          <Network size={16} color={subView === 'graph' ? 'var(--accent-primary)' : 'var(--text-muted)'} />
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
          <Sliders size={16} color={subView === 'pmf' ? 'var(--accent-primary)' : 'var(--text-muted)'} />
          <span>PMF Diagnostic Engine</span>
        </button>
      </div>

      {/* Render selected Sub-View */}
      {subView === 'graph' && (
        <KnowledgeGraphView onStartChat={onStartChat} />
      )}

      {subView === 'pmf' && (
        <PMFDiagnosticView onStartChat={onStartChat} />
      )}

      {subView === 'topics' && (
        <div className="home-container" style={{ paddingTop: '1.5rem' }}>
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

            {/* Filter and Search Toolbar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '24px', alignItems: 'center', justifyContent: 'space-between' }}>
              {/* Categories */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`btn ${activeCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '12.5px', padding: '6px 14px', borderRadius: '20px' }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div style={{ position: 'relative', width: '260px' }}>
                <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '10px' }} />
                <input
                  type="text"
                  placeholder="Filter frameworks, guests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 36px',
                    borderRadius: '20px',
                    border: '1px solid var(--border-medium)',
                    backgroundColor: 'var(--bg-app)',
                    color: 'var(--text-primary)',
                    fontSize: '13px'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Topics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {filteredTopics.map(topic => (
              <div 
                key={topic.id}
                className="card"
                style={{ 
                  padding: '24px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-surface)'
                }}
                onClick={() => handleSelectTopic(topic.id)}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span className="tag-category tag-brown" style={{ fontSize: '11px' }}>
                      {topic.category}
                    </span>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      {topic.chunk_count} evidence chunks
                    </span>
                  </div>

                  <h3 className="font-display" style={{ fontSize: '20px', color: 'var(--text-primary)', marginBottom: '10px' }}>
                    {topic.title}
                  </h3>

                  <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                    {topic.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                    {topic.top_guests.slice(0, 3).map((guest, i) => (
                      <span key={i} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'var(--bg-highlight)', color: 'var(--accent-primary)', fontWeight: 600 }}>
                        {guest}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
                  <button 
                    className="btn btn-ghost" 
                    style={{ fontSize: '12.5px', padding: '4px 8px', color: 'var(--accent-primary)' }}
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
                    style={{ fontSize: '12px', padding: '4px 10px' }}
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
            <div className="modal-overlay" onClick={() => setActiveTopicDetail(null)}>
              <div className="modal-content-card" style={{ maxWidth: '750px', maxHeight: '85vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={() => setActiveTopicDetail(null)}>
                  <X size={18} />
                </button>

                <span className="tag-category tag-brown" style={{ marginBottom: '8px' }}>
                  {activeTopicDetail.category}
                </span>

                <h2 className="font-display" style={{ fontSize: '28px', color: 'var(--text-primary)', marginTop: '4px', marginBottom: '12px' }}>
                  {activeTopicDetail.title}
                </h2>

                <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
                  {activeTopicDetail.description}
                </p>

                {/* Frameworks Section */}
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '10px' }}>
                    Core Frameworks & Mental Models
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {activeTopicDetail.frameworks.map((fw, i) => (
                      <div key={i} style={{ padding: '8px 12px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-medium)', borderRadius: '6px', fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>
                        📐 {fw}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Evidence Passages */}
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '10px' }}>
                    Transcript Evidence & Citations ({activeTopicDetail.citations?.length || 0})
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {activeTopicDetail.citations?.map((cit, idx) => (
                      <div key={idx} style={{ padding: '12px 16px', backgroundColor: 'var(--bg-app)', borderLeft: '3px solid var(--accent-primary)', borderRadius: '0 6px 6px 0', fontSize: '13px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{cit.guest}</span>
                          <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{cit.timestamp}</span>
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '6px' }}>
                          "{cit.quote}"
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          Episode: {cit.episode_title}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Footer */}
                <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid var(--border-medium)', paddingTop: '16px' }}>
                  <button 
                    className="btn btn-primary" 
                    style={{ flex: 1, padding: '10px' }}
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
                    style={{ flex: 1, padding: '10px' }}
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
