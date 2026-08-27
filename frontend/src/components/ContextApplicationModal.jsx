import React, { useState } from 'react';
import { X, Target, Sparkles, Building, Users, Activity, AlertCircle, Cpu } from 'lucide-react';
import { api } from '../services/api';

export default function ContextApplicationModal({ isOpen, onClose, topic = 'Activation & Growth', onApplyContextResult }) {
  const [companyType, setCompanyType] = useState('B2B SaaS');
  const [users, setUsers] = useState('15,000');
  const [activation, setActivation] = useState('18%');
  const [problem, setProblem] = useState('Weak onboarding drop-off before reaching primary Aha! moment');
  const [constraints, setConstraints] = useState('Small engineering team (3 engineers), 6 months runway');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleApply = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.applyContext({
        topic,
        company_type: companyType,
        users,
        activation,
        problem,
        constraints
      });
      onApplyContextResult(res);
      onClose();
    } catch (err) {
      console.error('Failed to apply context:', err);
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
            backgroundColor: 'var(--color-primary-forest, #245D55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF'
          }}>
            <Target size={18} />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--text-serif-display, serif)', fontSize: '1.4rem', color: 'var(--text-primary)', margin: 0 }}>
              Apply Lenny's Wisdom to Your Context
            </h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Tailor podcast frameworks to your exact company stage, metrics, and constraints.
            </div>
          </div>
        </div>

        <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>
                Company / Product Type
              </label>
              <select 
                value={companyType} 
                onChange={(e) => setCompanyType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-medium)',
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem'
                }}
              >
                <option>B2B SaaS (Self-Serve + Sales)</option>
                <option>B2B Enterprise</option>
                <option>Consumer Mobile App</option>
                <option>Marketplace (2-Sided)</option>
                <option>Developer Tool & API</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>
                Active Users / Audience Scale
              </label>
              <input 
                type="text" 
                value={users} 
                onChange={(e) => setUsers(e.target.value)}
                placeholder="e.g. 15,000 MAU"
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
              Current Core Metric / Baseline
            </label>
            <input 
              type="text" 
              value={activation} 
              onChange={(e) => setActivation(e.target.value)}
              placeholder="e.g. 18% activation rate"
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
              Primary Friction / Bottleneck to Solve
            </label>
            <textarea 
              rows="2"
              value={problem} 
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Describe your current product bottleneck..."
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

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>
              Team & Operational Constraints
            </label>
            <input 
              type="text" 
              value={constraints} 
              onChange={(e) => setConstraints(e.target.value)}
              placeholder="e.g. Small 3-person team, tight runway"
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
              <Sparkles size={16} />
              <span>{loading ? 'Synthesizing Playbook...' : 'Generate Tailored Playbook'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
