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
  CheckCircle2
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
    const ext = art.artifact_type === 'html' ? 'html' : 'md';
    const mime = art.artifact_type === 'html' ? 'text/html' : 'text/markdown';
    const blob = new Blob([art.content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${art.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filtered = artifacts.filter(a => {
    const matchesFilter = 
      activeFilter === 'All' ||
      (activeFilter === 'HTML' && a.artifact_type === 'html') ||
      (activeFilter === 'Essays' && a.artifact_type === 'markdown' && (a.meta?.style === 'ship30' || a.title.toLowerCase().includes('essay') || a.title.toLowerCase().includes('playbook'))) ||
      (activeFilter === 'Documents' && a.artifact_type === 'markdown');
    
    const matchesSearch = !searchQuery ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.content.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="home-container">
      {/* Header */}
      <div style={{ marginBottom: '28px', borderBottom: '1px solid var(--border-medium)', paddingBottom: '20px' }}>
        <span className="tag-category tag-brown" style={{ marginBottom: '8px' }}>
          Outputs & Knowledge Assets
        </span>
        <h1 className="font-display" style={{ fontSize: '36px', color: 'var(--text-primary)', marginTop: '4px' }}>
          Your Artifacts & Generated Work
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '720px', marginTop: '6px' }}>
          All structured Ship 30 essays, interactive HTML calculators, growth dashboards, and strategy memos saved across your research sessions.
        </p>

        {/* Filter and Search Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginTop: '24px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['All', 'Essays', 'HTML', 'Documents'].map(f => (
              <button 
                key={f}
                className={`tag-category ${activeFilter === f ? 'tag-brown' : 'tag-neutral'}`}
                style={{ cursor: 'pointer', padding: '6px 14px', fontSize: '12px' }}
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
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 14px',
            minWidth: '280px'
          }}>
            <Search size={15} color="var(--text-muted)" />
            <input 
              type="text"
              placeholder="Search artifacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                width: '100%',
                fontSize: '13px'
              }}
            />
          </div>
        </div>
      </div>

      {/* Artifacts Grid */}
      {loading ? (
        <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading artifacts...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          padding: '60px 20px',
          textAlign: 'center',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-sm)'
        }}>
          <div className="brand-badge" style={{ margin: '0 auto 16px', width: '36px', height: '36px' }}>
            <FileCode size={18} />
          </div>
          <h3 className="font-display" style={{ fontSize: '20px', marginBottom: '8px' }}>
            No artifacts found
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 20px' }}>
            Generate your first Ship 30 essay in the Writing Studio or ask the Assistant for an interactive HTML calculator.
          </p>
          <button className="btn btn-primary" onClick={onOpenWritingStudio}>
            <Sparkles size={14} />
            <span>Open Writing Studio</span>
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          {filtered.map((art) => (
            <div 
              key={art.id}
              className="explore-card"
              style={{ padding: '20px' }}
              onClick={() => onSelectArtifact(art)}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span className={`tag-category ${art.artifact_type === 'html' ? 'tag-green' : 'tag-brown'}`}>
                    {art.artifact_type === 'html' ? 'Interactive HTML' : 'Markdown Essay'}
                  </span>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                    {art.meta?.word_count ? `${art.meta.word_count} words` : (art.artifact_type === 'html' ? 'Sandbox Verified' : 'Document')}
                  </span>
                </div>

                <h3 className="font-display" style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1.3 }}>
                  {art.title}
                </h3>

                <p style={{
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  marginBottom: '16px'
                }}>
                  {art.content.slice(0, 180)}...
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '12px'
              }}>
                <button 
                  className="btn btn-primary" 
                  style={{ padding: '4px 10px', fontSize: '12px' }}
                  onClick={() => onSelectArtifact(art)}
                >
                  <Eye size={12} />
                  <span>Open Split-View</span>
                </button>

                <div style={{ display: 'flex', gap: '4px' }}>
                  <button 
                    className="btn btn-ghost"
                    title="Copy content"
                    style={{ padding: '4px 6px' }}
                    onClick={(e) => handleCopy(e, art)}
                  >
                    {copiedId === art.id ? <Check size={13} color="var(--status-success)" /> : <Copy size={13} />}
                  </button>

                  <button 
                    className="btn btn-ghost"
                    title="Download file"
                    style={{ padding: '4px 6px' }}
                    onClick={(e) => handleDownload(e, art)}
                  >
                    <Download size={13} />
                  </button>

                  <button 
                    className="btn btn-ghost"
                    title="Delete artifact"
                    style={{ padding: '4px 6px', color: 'var(--status-danger)' }}
                    onClick={(e) => handleDelete(e, art.id)}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
