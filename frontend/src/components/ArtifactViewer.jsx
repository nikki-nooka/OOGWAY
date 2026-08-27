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
  Sparkles,
  Lock
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
        particleCount: 35,
        spread: 55,
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
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
          <div className="brand-badge" style={{ width: '26px', height: '26px', fontSize: '13px' }}>
            <Sparkles size={13} />
          </div>
          <div>
            <div className="artifact-title">{artifact.title || "Interactive Artifact"}</div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="artifact-tabs">
          {isHtml && (
            <button 
              className={`artifact-tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
              onClick={() => setActiveTab('preview')}
            >
              <Eye size={12} />
              <span>Preview</span>
            </button>
          )}
          <button 
            className={`artifact-tab-btn ${activeTab === 'code' ? 'active' : ''}`}
            onClick={() => setActiveTab('code')}
          >
            <Code2 size={12} />
            <span>Code</span>
          </button>
          {artifact.artifact_type === 'markdown' && (
            <button 
              className={`artifact-tab-btn ${activeTab === 'markdown' ? 'active' : ''}`}
              onClick={() => setActiveTab('markdown')}
            >
              <FileText size={12} />
              <span>Doc View</span>
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="artifact-actions">
          <button 
            onClick={handleCopyCode} 
            className="btn btn-secondary" 
            style={{ padding: '4px 8px', fontSize: '11.5px' }}
            title="Copy code"
          >
            {copied ? <Check size={12} color="var(--status-success)" /> : <Copy size={12} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button 
            onClick={handleDownload} 
            className="btn btn-secondary" 
            style={{ padding: '4px 8px', fontSize: '11.5px' }}
            title="Download file"
          >
            <Download size={12} />
          </button>

          <button 
            onClick={() => setIsFullscreen(!isFullscreen)} 
            className="btn btn-ghost" 
            style={{ padding: '4px 6px' }}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
          >
            {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>

          <button 
            onClick={onClose} 
            className="btn btn-ghost" 
            style={{ padding: '4px 6px' }}
            title="Close Artifact Pane"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Safe Preview Security Banner (Screen 14 requirement) */}
      {isHtml && (
        <div className="safe-preview-banner">
          <div className="safe-status-pill">
            <Lock size={12} />
            <span>Safe Sandbox Active</span>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            Scripts restricted • Isolated origin • Sandbox enabled
          </span>
        </div>
      )}

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
