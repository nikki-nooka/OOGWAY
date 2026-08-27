import React, { useState, useEffect } from 'react';
import { 
  FileCode, 
  FileText, 
  Trash2, 
  Eye, 
  Download, 
  Copy, 
  Check, 
  Search, 
  Sparkles, 
  Layers, 
  ArrowRight,
  Code,
  FileCheck
} from 'lucide-react';
import { api } from '../services/api';

export default function ArtifactLibrary({ onSelectArtifact, onOpenWritingStudio }) {
  const [artifacts, setArtifacts] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    loadArtifacts();
  }, []);

  const loadArtifacts = async () => {
    setLoading(true);
    try {
      const data = await api.getArtifacts();
      setArtifacts(data);
    } catch (err) {
      console.error("Error loading artifacts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to remove this artifact?")) return;
    try {
      await api.deleteArtifact(id);
      setArtifacts(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error("Error deleting artifact:", err);
    }
  };

  const handleCopy = (e, art) => {
    e.stopPropagation();
    navigator.clipboard.writeText(art.content);
    setCopiedId(art.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (e, art) => {
    e.stopPropagation();
    const isHtml = art.artifact_type === 'html' || art.type === 'html';
    const ext = isHtml ? 'html' : 'md';
    const mime = isHtml ? 'text/html' : 'text/markdown';
    const blob = new Blob([art.content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(art.title || 'artifact').toLowerCase().replace(/[^a-z0-9]/g, '-')}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getCleanSummary = (art) => {
    if (art.meta?.summary) return art.meta.summary;
    const isHtml = art.artifact_type === 'html' || art.type === 'html';
    if (isHtml) {
      return 'Interactive sandboxed application with dynamic parameter sliders, calculation engine, and real-time visualization.';
    }
    // Clean raw markdown syntax for display
    const raw = art.content || '';
    const clean = raw
      .replace(/```[\s\S]*?```/g, '')
      .replace(/^#+\s+/gm, '')
      .replace(/[*_`>~]/g, '')
      .replace(/\n+/g, ' ')
      .trim();
    return clean.slice(0, 160) + (clean.length > 160 ? '...' : '');
  };

  const getTagCategoryClass = (art) => {
    const isHtml = art.artifact_type === 'html' || art.type === 'html';
    if (isHtml) return 'tag-forest';
    const title = (art.title || '').toLowerCase();
    if (title.includes('decision') || title.includes('memo')) return 'tag-gold';
    return 'tag-brown';
  };

  const getTagLabel = (art) => {
    const isHtml = art.artifact_type === 'html' || art.type === 'html';
    if (isHtml) return 'Interactive HTML';
    const title = (art.title || '').toLowerCase();
    if (title.includes('decision')) return 'Decision Memo';
    if (title.includes('experiment')) return 'Experiment Brief';
    if (title.includes('framework')) return 'Framework Tree';
    return 'Ship 30 Essay';
  };

  const filtered = artifacts.filter(a => {
    const isHtml = a.artifact_type === 'html' || a.type === 'html';
    const isMarkdown = !isHtml;
    
    const matchesFilter = 
      activeFilter === 'All' ||
      (activeFilter === 'HTML' && isHtml) ||
      (activeFilter === 'Essays' && isMarkdown && (a.meta?.style === 'ship30' || a.title?.toLowerCase().includes('essay') || a.title?.toLowerCase().includes('playbook'))) ||
      (activeFilter === 'Documents' && isMarkdown);
    
    const matchesSearch = !searchQuery ||
      (a.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.content || '').toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '2.5rem 1.75rem 5rem 1.75rem', width: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-medium)', paddingBottom: '1.5rem' }}>
        <span className="tag-category tag-brown" style={{ marginBottom: '0.5rem' }}>
          Outputs & Knowledge Assets
        </span>
        <h1 className="font-display" style={{ fontSize: '2.4rem', color: 'var(--text-primary)', margin: '0.35rem 0 0.5rem 0' }}>
          Your Artifacts & Generated Work
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '720px', lineHeight: 1.5 }}>
          All structured Ship 30 essays, interactive HTML calculators, growth dashboards, and strategy memos saved across your research sessions.
        </p>

        {/* Filter and Search Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['All', 'Essays', 'HTML', 'Documents'].map(f => (
              <button 
                key={f}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  border: 'none',
                  backgroundColor: activeFilter === f ? 'var(--text-primary)' : 'var(--bg-tertiary)',
                  color: activeFilter === f ? 'var(--bg-app)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--bg-input)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.5rem 0.85rem',
            minWidth: '280px'
          }}>
            <Search size={15} color="var(--text-muted)" />
            <input 
              type="text"
              placeholder="Search saved artifacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                width: '100%',
                fontSize: '0.9rem'
              }}
            />
          </div>
        </div>
      </div>

      {/* Artifacts Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} style={{ padding: '1.5rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div className="skeleton" style={{ height: '18px', width: '35%', marginBottom: '12px' }}></div>
              <div className="skeleton" style={{ height: '24px', width: '75%', marginBottom: '10px' }}></div>
              <div className="skeleton" style={{ height: '14px', width: '95%', marginBottom: '6px' }}></div>
              <div className="skeleton" style={{ height: '14px', width: '60%', marginBottom: '20px' }}></div>
              <div className="skeleton" style={{ height: '36px', width: '100%' }}></div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          padding: '4rem 1.5rem',
          textAlign: 'center',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-md)'
        }}>
          <div style={{
            margin: '0 auto 1rem auto',
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--accent-primary)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FileCode size={22} />
          </div>
          <h3 className="font-display" style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            No artifacts found
          </h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 1.5rem auto', lineHeight: 1.5 }}>
            Generate your first Ship 30 essay in the Writing Studio or ask Lenny for an interactive HTML calculator or strategy memo.
          </p>
          <button className="btn btn-primary" onClick={onOpenWritingStudio} style={{ padding: '0.65rem 1.25rem' }}>
            <Sparkles size={15} />
            <span>Open Writing Studio</span>
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '1.5rem'
        }}>
          {filtered.map((art) => {
            const isHtml = art.artifact_type === 'html' || art.type === 'html';
            return (
              <div 
                key={art.id}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.4rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '250px',
                  boxShadow: 'var(--shadow-sm)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onClick={() => onSelectArtifact(art)}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                    <span className={`tag-category ${getTagCategoryClass(art)}`}>
                      {getTagLabel(art)}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {art.meta?.word_count ? `${art.meta.word_count} words` : (isHtml ? 'Sandbox Verified' : 'Document')}
                    </span>
                  </div>

                  <h3 className="font-display line-clamp-2" style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: '0.25rem 0 0.5rem 0', lineHeight: 1.3 }}>
                    {art.title}
                  </h3>

                  <p className="line-clamp-3" style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                    marginBottom: '1rem'
                  }}>
                    {getCleanSummary(art)}
                  </p>
                </div>

                {/* Action Buttons */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '0.85rem'
                }}>
                  <button 
                    className="btn btn-primary" 
                    style={{ padding: '4px 10px', fontSize: '12px' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectArtifact(art);
                    }}
                  >
                    <Eye size={13} />
                    <span>Open Split-View</span>
                  </button>

                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button 
                      className="btn btn-ghost"
                      title="Copy content"
                      style={{ padding: '5px', borderRadius: 'var(--radius-xs)' }}
                      onClick={(e) => handleCopy(e, art)}
                    >
                      {copiedId === art.id ? <Check size={14} color="var(--status-success)" /> : <Copy size={14} />}
                    </button>

                    <button 
                      className="btn btn-ghost"
                      title="Download file"
                      style={{ padding: '5px', borderRadius: 'var(--radius-xs)' }}
                      onClick={(e) => handleDownload(e, art)}
                    >
                      <Download size={14} />
                    </button>

                    <button 
                      className="btn btn-ghost"
                      title="Delete artifact"
                      style={{ padding: '5px', color: 'var(--status-danger)', borderRadius: 'var(--radius-xs)' }}
                      onClick={(e) => handleDelete(e, art.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
