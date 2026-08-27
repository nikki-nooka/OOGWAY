import React, { useState, useEffect } from 'react';
import { TrendingUp, CheckCircle2, AlertTriangle, Sparkles, ArrowRight, Layers, Sliders } from 'lucide-react';
import { api } from '../services/api';

export default function PMFDiagnosticView({ onStartChat }) {
  const [signals, setSignals] = useState({
    retention: 0.65,
    activation: 0.50,
    repeat_usage: 0.60,
    referral: 0.40,
    willingness_to_pay: 0.70,
    usage_frequency: 0.55
  });

  const [result, setResult] = useState(null);

  useEffect(() => {
    evaluate();
  }, [signals]);

  const evaluate = async () => {
    try {
      const data = await api.evaluatePMFDiagnostic(signals);
      setResult(data);
    } catch (err) {
      console.error('Failed to evaluate PMF diagnostic:', err);
    }
  };

  const updateSignal = (key, val) => {
    setSignals(prev => ({ ...prev, [key]: parseFloat(val) }));
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-medium)', paddingBottom: '1.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(154, 91, 46, 0.1)', color: 'var(--accent-primary, #9A5B2E)', padding: '0.35rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
          📊 Interactive Diagnostic Tool
        </div>
        <h1 style={{ fontFamily: 'var(--text-serif-display, serif)', fontSize: '2.4rem', fontWeight: 400, color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>
          Product-Market Fit (PMF) Diagnostic Engine
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', margin: 0, maxWidth: '750px' }}>
          Quantitatively evaluate your startup's retention floor, viral pull, and monetization friction using principles from Gustaf Alströmer, Rahul Vohra, and Casey Winters.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) 380px', gap: '2rem' }}>
        {/* Sliders Input Panel */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-medium)', borderRadius: '12px', padding: '1.75rem', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--text-serif-display)', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
            Tune Your Product Telemetry Signals:
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* 1. Cohort Retention Floor */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>1. 30-Day Cohort Retention Floor (Weight: 35%)</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-primary)', fontFamily: 'var(--text-mono)' }}>{Math.round(signals.retention * 100)}%</span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.01" value={signals.retention}
                onChange={(e) => updateSignal('retention', e.target.value)}
                style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Does your retention curve flatten parallel to the x-axis? (Gustaf Alströmer benchmark)</div>
            </div>

            {/* 2. Sean Ellis 40% PMF Test */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>2. "Very Disappointed" Survey Rate (Weight: 20%)</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-primary)', fontFamily: 'var(--text-mono)' }}>{Math.round(signals.repeat_usage * 100)}%</span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.01" value={signals.repeat_usage}
                onChange={(e) => updateSignal('repeat_usage', e.target.value)}
                style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Percentage of users who would be very disappointed if the product disappeared (Rahul Vohra rule: &gt;40%).</div>
            </div>

            {/* 3. Willingness to Pay */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>3. Commercial Demand & Pricing Power (Weight: 15%)</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-primary)', fontFamily: 'var(--text-mono)' }}>{Math.round(signals.willingness_to_pay * 100)}%</span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.01" value={signals.willingness_to_pay}
                onChange={(e) => updateSignal('willingness_to_pay', e.target.value)}
                style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Conversion velocity when users hit paid monetization gates (Patrick Campbell model).</div>
            </div>

            {/* 4. Time to Value (Activation) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>4. Day-1 Onboarding Activation (Weight: 15%)</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-primary)', fontFamily: 'var(--text-mono)' }}>{Math.round(signals.activation * 100)}%</span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.01" value={signals.activation}
                onChange={(e) => updateSignal('activation', e.target.value)}
                style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Users experiencing the primary Aha! value moment within 5 minutes.</div>
            </div>

            {/* 5. Organic Referral (K-Factor) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>5. Organic Word-of-Mouth (Weight: 10%)</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-primary)', fontFamily: 'var(--text-mono)' }}>{Math.round(signals.referral * 100)}%</span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.01" value={signals.referral}
                onChange={(e) => updateSignal('referral', e.target.value)}
                style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Percentage of new signups coming from unpaid organic recommendations (Elena Verna B2B loops).</div>
            </div>
          </div>
        </div>

        {/* Diagnosis Score & Recommendations Card */}
        {result && (
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-medium)', borderRadius: '12px', padding: '1.75rem', height: 'fit-content', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 700 }}>
              Transparent PMF Index
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', margin: '0.5rem 0' }}>
              <span style={{ fontSize: '3rem', fontFamily: 'var(--text-serif-display)', fontWeight: 600, color: result.score >= 75 ? 'var(--accent-secondary, #245D55)' : result.score >= 50 ? 'var(--accent-primary, #9A5B2E)' : 'var(--status-danger, #A33A3A)' }}>
                {result.score}
              </span>
              <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 600 }}>/ 100</span>
            </div>

            <div style={{ display: 'inline-block', padding: '0.35rem 0.75rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600, backgroundColor: result.score >= 75 ? 'rgba(36, 93, 85, 0.12)' : result.score >= 50 ? 'rgba(154, 91, 46, 0.12)' : 'rgba(163, 58, 58, 0.12)', color: result.score >= 75 ? 'var(--accent-secondary, #245D55)' : result.score >= 50 ? 'var(--accent-primary, #9A5B2E)' : 'var(--status-danger, #A33A3A)', marginBottom: '1.25rem' }}>
              Status: {result.status}
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Strong Health Signals:
              </div>
              {result.strong_signals.map((s, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#16a34a', marginBottom: '0.25rem' }}>
                  <CheckCircle2 size={14} />
                  <span>{s}</span>
                </div>
              ))}
            </div>

            {result.weak_signals.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  Attention Required:
                </div>
                {result.weak_signals.map((s, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#dc2626', marginBottom: '0.25rem' }}>
                    <AlertTriangle size={14} />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => onStartChat(`Our PMF Diagnostic score is ${result.score}/100 with status "${result.status}". How do top operators like Gustaf Alströmer and Rahul Vohra recommend fixing our weak signals: ${result.weak_signals.join(', ')}?`)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                backgroundColor: 'var(--accent-primary)',
                color: '#FFFFFF',
                border: 'none',
                padding: '0.85rem 1rem',
                borderRadius: '6px',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              <Sparkles size={16} />
              <span>Ask Lenny to Fix Weak Signals</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
