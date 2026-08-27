import React, { useState } from 'react';
import { X, Scale, Sparkles, FileText } from 'lucide-react';
import { api } from '../services/api';

export default function DecisionModeModal({ isOpen, onClose, onDecisionResult }) {
  const [question, setQuestion] = useState('Should we focus on Self-Serve PLG or build an Outbound Enterprise Sales team?');
  const [optionA, setOptionA] = useState('Self-Serve Product-Led Growth (PLG)');
  const [optionB, setOptionB] = useState('Top-Down Enterprise Sales Motion');
  const [constraints, setConstraints] = useState('3-person engineering team, 8 months runway, high top-of-funnel traffic.');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.generateDecision({
        decision_question: question,
        options: [optionA, optionB],
        constraints
      });
      onDecisionResult(res);
      onClose();
    } catch (err) {
      console.error('Failed to generate decision memo:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-card" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: 'var(--accent-primary, #9A5B2E)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF'
          }}>
            <Scale size={18} />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--text-serif-display, serif)', fontSize: '1.4rem', color: 'var(--text-primary)', margin: 0 }}>
              Decision Mode & Memo Generator
            </h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Evaluate trade-offs and generate an executive decision memo with grounded evidence.
            </div>
          </div>
        </div>

        <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.25rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>
              Strategic Decision Under Review
            </label>
            <input 
              type="text" 
              value={question} 
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g. Should we launch pricing tier X or Y?"
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '6px',
                border: '1px solid var(--border-medium)',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>
                Option A
              </label>
              <input 
                type="text" 
                value={optionA} 
                onChange={(e) => setOptionA(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>
                Option B
              </label>
              <input 
                type="text" 
                value={optionB} 
                onChange={(e) => setOptionB(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>
              Key Constraints & Boundary Conditions
            </label>
            <textarea 
              rows="2"
              value={constraints} 
              onChange={(e) => setConstraints(e.target.value)}
              placeholder="e.g. Tight engineering bandwidth, high churn risk..."
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '6px',
                border: '1px solid var(--border-medium)',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                fontFamily: 'var(--text-sans)',
                resize: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'transparent',
                border: '1px solid var(--border-medium)',
                padding: '0.65rem 1.25rem',
                borderRadius: '6px',
                color: 'var(--text-secondary)',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: 'var(--accent-primary, #9A5B2E)',
                border: 'none',
                padding: '0.65rem 1.5rem',
                borderRadius: '6px',
                color: '#FFFFFF',
                fontWeight: 600,
                cursor: loading ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <FileText size={16} />
              <span>{loading ? 'Evaluating Trade-offs...' : 'Generate Decision Memo'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
