import React, { useState } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { 
  Bot, 
  User, 
  Copy, 
  Check, 
  BookOpen, 
  ExternalLink, 
  Layout, 
  Clock,
  Sparkles
} from 'lucide-react';

export default function MessageItem({ 
  message, 
  onOpenCitation, 
  onOpenArtifact 
}) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Strip massive raw html code blocks from chat text so it stays clean
  const getRenderedMarkdown = (content) => {
    let cleanText = content;
    if (!isUser && content.includes('```html')) {
      // Replace raw html block with a clean conversational note
      cleanText = content.replace(/```(?:html|htm)[\s\S]*?```/gi, '> ⚡ **Interactive Artifact Generated:** Click below to open and test the live tool in the side-by-side viewer.');
    }
    try {
      const rawHtml = marked.parse(cleanText, { gfm: true, breaks: true });
      return { __html: DOMPurify.sanitize(rawHtml) };
    } catch {
      return { __html: cleanText };
    }
  };

  return (
    <div className={`message-bubble ${isUser ? 'user' : 'assistant'}`}>
      {/* Avatar */}
      <div className={`message-avatar ${isUser ? 'user' : 'assistant'}`}>
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      {/* Content */}
      <div className="message-content-wrapper">
        <div className="message-header">
          <span className="message-author">{isUser ? 'You' : 'Lenny Growth Assistant'}</span>
          {message.model_used && (
            <span className="badge badge-primary" style={{ fontSize: '10px' }}>
              {message.model_used}
            </span>
          )}
          {message.latency_ms && (
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Clock size={11} />
              {message.latency_ms}ms
            </span>
          )}

          <button 
            onClick={handleCopy} 
            className="btn btn-ghost" 
            style={{ marginLeft: 'auto', padding: '2px 6px', fontSize: '11px' }}
            title="Copy message"
          >
            {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Message Body */}
        <div 
          className="message-body"
          dangerouslySetInnerHTML={getRenderedMarkdown(message.content)}
        />

        {/* Citations Bar */}
        {message.citations && message.citations.length > 0 && (
          <div style={{ marginTop: '8px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <BookOpen size={12} color="var(--accent)" />
              <span>Transcript Citations ({message.citations.length})</span>
            </div>
            <div className="citations-bar">
              {message.citations.map((cit, idx) => (
                <div 
                  key={idx}
                  className="citation-chip"
                  onClick={() => onOpenCitation(cit)}
                >
                  <span style={{ fontWeight: 700 }}>#{idx + 1}</span>
                  <span>{cit.guest}</span>
                  <span style={{ opacity: 0.7 }}>({cit.timestamp})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Generated Artifacts Banner */}
        {message.artifacts && message.artifacts.length > 0 && (
          <div style={{ marginTop: '8px' }}>
            {message.artifacts.map((art, idx) => (
              <div 
                key={idx}
                className="artifact-card-banner"
                onClick={() => onOpenArtifact(art)}
              >
                <div className="artifact-banner-info">
                  <div className="artifact-icon-tag">
                    <Layout size={16} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '13px', color: '#fff' }}>
                      {art.title || "Interactive Growth Artifact"}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      Interactive {art.type || art.artifact_type || 'html'} application • Click to launch
                    </div>
                  </div>
                </div>

                <button className="btn btn-primary" style={{ padding: '5px 10px', fontSize: '11.5px' }}>
                  <span>Open Split View</span>
                  <ExternalLink size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
