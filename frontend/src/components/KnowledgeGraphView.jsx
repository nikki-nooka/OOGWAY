import React, { useState, useEffect } from 'react';
import { Network, Sparkles, BookOpen, ArrowRight, Layers, Tag, User } from 'lucide-react';
import { api } from '../services/api';

export default function KnowledgeGraphView({ onStartChat, onOpenFramework }) {
  const [graphData, setGraphData] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGraph();
  }, []);

  const loadGraph = async () => {
    try {
      setLoading(true);
      const data = await api.getKnowledgeGraph();
      setGraphData(data);
      if (data.nodes && data.nodes.length > 0) {
        setSelectedNode(data.nodes[0]);
      }
    } catch (err) {
      console.error('Failed to load knowledge graph:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-medium)', paddingBottom: '1.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(36, 93, 85, 0.1)', color: 'var(--color-primary-forest, #245D55)', padding: '0.35rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
          🕸️ Relational Knowledge Map
        </div>
        <h1 style={{ fontFamily: 'var(--text-serif-display, serif)', fontSize: '2.4rem', fontWeight: 400, color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>
          Lenny's Product & Growth Knowledge Graph
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', margin: 0, maxWidth: '750px' }}>
          Explore the relational topology connecting core product frameworks, cohort retention metrics, and expert podcast operators.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          <div>Loading knowledge graph nodes & relationships...</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 380px', gap: '2rem' }}>
          {/* Graph Nodes Interactive Grid */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-medium)', borderRadius: '12px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '1.25rem', fontWeight: 700 }}>
              Interactive Framework Nodes ({graphData?.total_nodes || 0} Core Entities)
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {graphData?.nodes?.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    style={{
                      padding: '1.25rem',
                      backgroundColor: isSelected ? 'var(--bg-highlight)' : 'var(--bg-app)',
                      border: `1.5px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 4px 12px rgba(154, 91, 46, 0.15)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor: 'var(--bg-tertiary)',
                        color: 'var(--text-secondary)',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px'
                      }}>
                        {node.category}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                        {node.guest}
                      </span>
                    </div>
                    <div style={{ fontFamily: 'var(--text-serif-display)', fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {node.label}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Relational Edge Connections Table */}
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: 700 }}>
              Topological Connections ({graphData?.total_edges || 0} Relational Edges)
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {graphData?.edges?.map((edge, idx) => (
                <div key={idx} style={{ padding: '0.65rem 1rem', background: 'var(--bg-app)', border: '1px solid var(--border-subtle)', borderRadius: '6px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{edge.source.toUpperCase()}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontStyle: 'italic' }}>── {edge.label} ──➔</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-primary-forest, #245D55)' }}>{edge.target.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Node Evidence & Action Sidebar */}
          {selectedNode && (
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-medium)', borderRadius: '12px', padding: '1.75rem', height: 'fit-content', boxShadow: 'var(--shadow-md)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-primary)' }}>
                Active Entity Node
              </span>
              
              <h2 style={{ fontFamily: 'var(--text-serif-display)', fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0.35rem 0 0.5rem 0' }}>
                {selectedNode.label}
              </h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <User size={16} color="var(--accent-primary)" />
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Pioneered by: <strong>{selectedNode.guest}</strong>
                </span>
              </div>

              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-app)', borderLeft: '3px solid var(--accent-primary)', borderRadius: '0 6px 6px 0', fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '1.5rem', fontStyle: 'italic' }}>
                "Connects foundational cohort retention floors with systematic mental models from Lenny's Podcast."
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  onClick={() => onStartChat(`What does ${selectedNode.guest} explain about ${selectedNode.label}?`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    backgroundColor: 'var(--accent-primary)',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '0.75rem 1rem',
                    borderRadius: '6px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  <Sparkles size={16} />
                  <span>Ask Lenny about {selectedNode.label}</span>
                </button>

                <button
                  onClick={() => onStartChat(`Build a visual strategic framework and mental model for ${selectedNode.label}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-medium)',
                    padding: '0.75rem 1rem',
                    borderRadius: '6px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  <Layers size={16} />
                  <span>Build Framework from Node</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
