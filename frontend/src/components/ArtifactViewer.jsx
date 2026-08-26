import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { 
  Eye, 
  Code2, 
  FileText, 
  Copy, 
  Check, 
  Download, 
  Maximize2, 
  Minimize2, 
  X, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function ArtifactViewer({ 
  artifact, 
  onClose 
}) {
  const [activeTab, setActiveTab] = useState('preview'); // 'preview', 'code', 'markdown'
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (artifact) {
      // Trigger subtle confetti burst
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 }
      });
      // Default tab based on type
      if (artifact.artifact_type === 'markdown') {
        setActiveTab('markdown');
      } else {
        setActiveTab('preview');
      }
    }
  }, [artifact?.id]);

  if (!artifact) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(artifact.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = artifact.artifact_type === 'markdown' ? 'md' : 'html';
    const blob = new Blob([artifact.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(artifact.title || 'artifact').toLowerCase().replace(/\s+/g, '_')}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isHtml = artifact.artifact_type === 'html' || artifact.type === 'html';

  return (
    <div 
      className="artifact-pane"
      style={{
        width: isFullscreen ? '100%' : '50%',
        position: isFullscreen ? 'absolute' : 'relative',
        inset: isFullscreen ? 0 : 'auto',
        zIndex: isFullscreen ? 60 : 10
      }}
    >
      {/* Header */}
      <div className="artifact-header">
        <div className="artifact-title-box">
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            flexShrink: 0
          }}>
            <Sparkles size={14} />
          </div>
          <div>
            <div className="artifact-title">{artifact.title || "Interactive Artifact"}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
              <ShieldCheck size={12} color="#10b981" />
              <span>Isolated Sandbox Active</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="artifact-tabs">
          {isHtml && (
            <button 
              className={`artifact-tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
              onClick={() => setActiveTab('preview')}
            >
              <Eye size={13} />
              <span>Preview</span>
            </button>
          )}
          <button 
            className={`artifact-tab-btn ${activeTab === 'code' ? 'active' : ''}`}
            onClick={() => setActiveTab('code')}
          >
            <Code2 size={13} />
            <span>Code</span>
          </button>
          {artifact.artifact_type === 'markdown' && (
            <button 
              className={`artifact-tab-btn ${activeTab === 'markdown' ? 'active' : ''}`}
              onClick={() => setActiveTab('markdown')}
            >
              <FileText size={13} />
              <span>Doc View</span>
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="artifact-actions">
          <button 
            onClick={handleCopyCode} 
            className="btn btn-secondary" 
            style={{ padding: '5px 10px', fontSize: '12px' }}
            title="Copy source code"
          >
            {copied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button 
            onClick={handleDownload} 
            className="btn btn-secondary" 
            style={{ padding: '5px 10px', fontSize: '12px' }}
            title="Download file"
          >
            <Download size={13} />
          </button>

          <button 
            onClick={() => setIsFullscreen(!isFullscreen)} 
            className="btn btn-ghost" 
            style={{ padding: '5px 8px' }}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>

          <button 
            onClick={onClose} 
            className="btn btn-ghost" 
            style={{ padding: '5px 8px' }}
            title="Close Artifact Pane"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="artifact-content-container">
        {activeTab === 'preview' && isHtml && (
          <iframe
            title={artifact.title}
            srcDoc={artifact.content}
            className="artifact-iframe"
            sandbox="allow-scripts allow-forms allow-modals"
          />
        )}

        {activeTab === 'code' && (
          <pre className="artifact-code-view">
            <code>{artifact.content}</code>
          </pre>
        )}

        {activeTab === 'markdown' && (
          <div 
            className="artifact-markdown-view"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(marked.parse(artifact.content, { gfm: true }))
            }}
          />
        )}
      </div>
    </div>
  );
}
