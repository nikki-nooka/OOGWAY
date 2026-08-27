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
  Sparkles,
  Zap,
  Target,
  Scale,
  FlaskConical,
  Layers,
  PenTool
} from 'lucide-react';

export default function MessageItem({ 
  message, 
  onOpenCitation, 
  onOpenArtifact,
  onActionTrigger
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
          <div style={{ marginTop: '10px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <BookOpen size={12} color="var(--accent-primary, #9A5B2E)" />
              <span>Transcript Evidence Citations ({message.citations.length})</span>
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
                  <span style={{ opacity: 0.75 }}>({cit.timestamp})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Turn this into Action Bar (Feature 10) */}
        {!isUser && (
          <div style={{
            marginTop: '14px',
            paddingTop: '12px',
            borderTop: '1px solid var(--border-subtle, #E2DDD2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
              ⚡ Turn this knowledge into actionable work:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <button
                onClick={() => onActionTrigger && onActionTrigger('challenge', message.content)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 9px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '4px',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                title="Find counterpoints and boundary conditions where this advice may fail"
              >
                <Zap size={12} color="var(--accent-primary, #9A5B2E)" />
                <span>Challenge Advice</span>
              </button>

              <button
                onClick={() => onActionTrigger && onActionTrigger('apply-context', message.content)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 9px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '4px',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                title="Apply these principles to your specific startup stage, metrics, and constraints"
              >
                <Target size={12} color="var(--accent-secondary, #245D55)" />
                <span>Apply to My Context</span>
              </button>

              <button
                onClick={() => onActionTrigger && onActionTrigger('decision', message.content)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 9px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '4px',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                title="Evaluate strategic trade-offs and generate an executive Decision Memo"
              >
                <Scale size={12} color="var(--accent-primary, #9A5B2E)" />
                <span>Decision Memo</span>
              </button>

              <button
                onClick={() => onActionTrigger && onActionTrigger('experiment', message.content)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 9px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '4px',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                title="Generate an Experiment Brief with hypothesis, sample size, and guardrails"
              >
                <FlaskConical size={12} color="var(--status-info, #2B5C7D)" />
                <span>Experiment Brief</span>
              </button>

              <button
                onClick={() => onActionTrigger && onActionTrigger('framework', message.content)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 9px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '4px',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                title="Build a visual hierarchical mental model framework"
              >
                <Layers size={12} color="var(--accent-primary, #9A5B2E)" />
                <span>Framework Tree</span>
              </button>

              <button
                onClick={() => onActionTrigger && onActionTrigger('ship30', message.content)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 9px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '4px',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                title="Transform answer into a ~1,250-word Ship 30 atomic essay"
              >
                <PenTool size={12} color="var(--accent-secondary, #245D55)" />
                <span>Ship 30 Essay</span>
              </button>
            </div>
          </div>
        )}

        {/* Generated Artifacts Banner */}
        {message.artifacts && message.artifacts.length > 0 && (
          <div style={{ marginTop: '10px' }}>
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
                    <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--text-primary)' }}>
                      {art.title || "Interactive Growth Artifact"}
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                      Interactive {art.type || art.artifact_type || 'markdown'} application • Click to launch
                    </div>
                  </div>
                </div>

                <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }}>
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
