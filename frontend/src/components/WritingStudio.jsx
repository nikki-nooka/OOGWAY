import React, { useState } from 'react';
import { 
  PenTool, 
  Sparkles, 
  FileText, 
  Copy, 
  Download, 
  Bookmark, 
  Check, 
  BookOpen, 
  Layers,
  ArrowRight,
  Eye,
  Code
} from 'lucide-react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { api } from '../services/api';

export default function WritingStudio({ initialTopic = '', onSaveArtifact }) {
  const [topic, setTopic] = useState(initialTopic || 'How to Measure and Accelerate Product-Market Fit');
  const [style, setStyle] = useState('ship30');
  const [targetWords, setTargetWords] = useState(1250);
  const [guestFocus, setGuestFocus] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedEssay, setGeneratedEssay] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [viewMode, setViewMode] = useState('preview'); // 'preview' | 'edit'
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [groundingCheck, setGroundingCheck] = useState(null);
  const [verifyingGrounding, setVerifyingGrounding] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setGenerating(true);
    setSaved(false);
    setGroundingCheck(null);

    try {
      const res = await api.generateShip30Essay({
        topic,
        target_words: targetWords,
        style,
        guest_focus: guestFocus || null
      });

      setGeneratedEssay(res);
      setEditedContent(res.content);
      setViewMode('preview');

      // Automatically evaluate claims grounding
      try {
        const verifyRes = await api.verifyEssayGrounding(res.content);
        setGroundingCheck(verifyRes);
      } catch (e) {
        console.warn('Grounding check failed:', e);
      }
    } catch (err) {
      console.error("Error generating essay:", err);
    } finally {
      setGenerating(false);
    }
  };

  const handleManualVerifyGrounding = async () => {
    setVerifyingGrounding(true);
    try {
      const verifyRes = await api.verifyEssayGrounding(editedContent || generatedEssay?.content || '');
      setGroundingCheck(verifyRes);
    } catch (err) {
      console.error('Grounding verification error:', err);
    } finally {
      setVerifyingGrounding(false);
    }
  };


  const handleCopy = () => {
    navigator.clipboard.writeText(editedContent || generatedEssay?.content || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = editedContent || generatedEssay?.content || '';
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(generatedEssay?.title || 'Lenny-Growth-Essay').toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSaveToArtifacts = async () => {
    if (!generatedEssay) return;
    try {
      await api.createArtifact({
        title: generatedEssay.title,
        artifact_type: 'markdown',
        content: editedContent || generatedEssay.content,
        meta: {
          style,
          topic,
          word_count: (editedContent || generatedEssay.content).split(/\s+/).length
        }
      });
      setSaved(true);
      if (onSaveArtifact) onSaveArtifact();
    } catch (err) {
      console.error("Error saving artifact:", err);
    }
  };

  return (
    <div className="writing-studio-container">
      {/* Header */}
      <div style={{ marginBottom: '28px', borderBottom: '1px solid var(--border-medium)', paddingBottom: '20px' }}>
        <span className="tag-category tag-brown" style={{ marginBottom: '8px' }}>
          Knowledge to Output Engine
        </span>
        <h1 className="font-display" style={{ fontSize: '36px', color: 'var(--text-primary)', marginTop: '4px' }}>
          Writing Studio: Ship 30 for 30
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '720px', marginTop: '6px' }}>
          Transform Lenny’s podcast research into structured, high-density atomic essays (~1,250 words) with 1-3-1 hook structure, modular H2 pillars, and grounded quotes.
        </p>
      </div>

      {/* Generator Configuration Card */}
      <div className="writing-form-card">
        <h2 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PenTool size={16} color="var(--accent-primary)" />
          <span>Essay & Framework Configuration</span>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
          {/* Topic */}
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label className="form-label">Essay Topic or Growth Framework:</label>
            <input 
              type="text"
              className="form-input"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Elena Verna's B2B Product-Led Growth and Viral Acquisition Loops"
            />
          </div>

          {/* Style */}
          <div className="form-group">
            <label className="form-label">Framework Structure:</label>
            <select 
              className="form-select"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
            >
              <option value="ship30">Ship 30 for 30 Atomic Essay (~1,250 words)</option>
              <option value="memo">Product Strategy & Architecture Memo</option>
              <option value="brief">Executive Growth Brief</option>
              <option value="summary">Tactical Implementation Framework</option>
            </select>
          </div>

          {/* Guest Focus */}
          <div className="form-group">
            <label className="form-label">Guest / Operator Focus (Optional):</label>
            <input 
              type="text"
              className="form-input"
              value={guestFocus}
              onChange={(e) => setGuestFocus(e.target.value)}
              placeholder="e.g. Shreyas Doshi, Gustaf Alströmer, Elena Verna"
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Grounding Engine: Ingests 4,380+ chunks across 279 episodes with verbatim citations.
          </div>

          <button 
            className="btn btn-primary"
            onClick={handleGenerate}
            disabled={generating || !topic.trim()}
            style={{ padding: '10px 24px', fontSize: '14px' }}
          >
            {generating ? (
              <>
                <span className="spinner-small"></span>
                <span>Synthesizing Essay...</span>
              </>
            ) : (
              <>
                <Sparkles size={15} />
                <span>Generate Ship 30 Essay</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Result & Editor / Preview Section */}
      {generatedEssay && (
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-sm)',
          boxShadow: 'var(--shadow-md)',
          overflow: 'hidden'
        }}>
          {/* Action Toolbar */}
          <div style={{
            padding: '12px 20px',
            backgroundColor: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-medium)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="tag-category tag-brown">
                {generatedEssay.word_count} words
              </span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {generatedEssay.title}
              </span>
              {groundingCheck && (
                <span style={{
                  fontSize: '11.5px',
                  fontWeight: 600,
                  backgroundColor: groundingCheck.grounding_confidence_pct >= 75 ? 'rgba(36, 93, 85, 0.12)' : 'rgba(154, 91, 46, 0.12)',
                  color: groundingCheck.grounding_confidence_pct >= 75 ? 'var(--color-primary-forest, #245D55)' : 'var(--accent-primary, #9A5B2E)',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  ✓ {groundingCheck.supported_claims_count}/{groundingCheck.total_claims_evaluated} Claims Grounded ({groundingCheck.grounding_confidence_pct}%)
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button 
                className="btn btn-secondary"
                onClick={handleManualVerifyGrounding}
                disabled={verifyingGrounding}
                style={{ fontSize: '12px' }}
                title="Verify individual essay claims against 4,389 transcript passages"
              >
                <Sparkles size={13} color="var(--accent-primary)" />
                <span>{verifyingGrounding ? 'Evaluating...' : 'Re-verify Grounding'}</span>
              </button>

              {/* View Toggle */}
              <div className="artifact-tabs">
                <button 
                  className={`artifact-tab-btn ${viewMode === 'preview' ? 'active' : ''}`}
                  onClick={() => setViewMode('preview')}
                >
                  <Eye size={13} />
                  <span>Preview</span>
                </button>
                <button 
                  className={`artifact-tab-btn ${viewMode === 'edit' ? 'active' : ''}`}
                  onClick={() => setViewMode('edit')}
                >
                  <Code size={13} />
                  <span>Edit</span>
                </button>
              </div>

              <button className="btn btn-secondary" onClick={handleCopy} title="Copy markdown">
                {copied ? <Check size={13} color="var(--status-success)" /> : <Copy size={13} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button className="btn btn-secondary" onClick={handleDownload} title="Download .md file">
                <Download size={13} />
                <span>Export .md</span>
              </button>

              <button className="btn btn-primary" onClick={handleSaveToArtifacts} disabled={saved}>
                {saved ? <Check size={13} /> : <Bookmark size={13} />}
                <span>{saved ? 'Saved in Library' : 'Save to Artifacts'}</span>
              </button>
            </div>
          </div>

          {/* Content Pane */}
          <div style={{ padding: '36px 44px', minHeight: '400px' }}>
            {viewMode === 'preview' ? (
              <div 
                className="artifact-markdown-view" 
                style={{ padding: 0 }}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(marked.parse(editedContent || generatedEssay.content, { gfm: true }))
                }}
              />
            ) : (
              <textarea 
                className="form-textarea"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                style={{
                  minHeight: '450px',
                  fontFamily: 'var(--text-mono)',
                  fontSize: '13px',
                  lineHeight: '1.6',
                  padding: '16px'
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
