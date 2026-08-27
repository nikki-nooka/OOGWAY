import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Esc key listener & Body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let data;
      if (isSignUp) {
        if (!name.trim()) throw new Error('Please enter your full name');
        data = await api.signup({ name, email, password });
      } else {
        data = await api.login({ email, password });
      }
      onAuthSuccess(data.user);
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop-editorial" onClick={onClose}>
      <div 
        className="modal-card-editorial auth-modal-card" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '440px' }}
      >
        {/* Header with Title & Close button */}
        <div className="modal-header-row">
          <div className="card-tag tag-primary">PRIVATE WORKSPACE</div>
          <button 
            type="button" 
            className="btn-modal-close" 
            onClick={onClose} 
            title="Close (Esc)"
          >
            ✕
          </button>
        </div>

        {/* Masthead Banner */}
        <div style={{ textAlign: 'center', margin: '8px 0 16px 0' }}>
          <h2 style={{ 
            fontFamily: 'var(--font-serif)', 
            fontSize: '1.65rem', 
            fontWeight: 700, 
            color: 'var(--text-primary)',
            margin: '0 0 6px 0',
            letterSpacing: '-0.02em'
          }}>
            Lenny Growth Assistant
          </h2>
          <div style={{
            display: 'inline-block',
            fontSize: '0.82rem',
            color: 'var(--accent-primary)',
            fontWeight: 600,
            background: 'var(--bg-secondary)',
            padding: '4px 10px',
            borderRadius: '4px',
            marginBottom: '6px'
          }}>
            🔒 Please log in or sign in to use these features
          </div>
          <p style={{ 
            fontFamily: 'var(--font-sans)', 
            fontSize: '0.84rem', 
            color: 'var(--text-secondary)', 
            margin: 0,
            lineHeight: 1.4
          }}>
            Sign in or create an account to ask Lenny questions, synthesize Ship 30 essays, and save your private research.
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div style={{ 
          display: 'flex', 
          borderBottom: '1px solid var(--border-subtle)', 
          marginBottom: '20px' 
        }}>
          <button
            type="button"
            onClick={() => { setIsSignUp(false); setError(null); }}
            style={{
              flex: 1,
              padding: '10px 0',
              background: 'none',
              border: 'none',
              borderBottom: !isSignUp ? '2px solid var(--accent-primary)' : '2px solid transparent',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.95rem',
              fontWeight: !isSignUp ? 600 : 400,
              color: !isSignUp ? 'var(--text-primary)' : 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsSignUp(true); setError(null); }}
            style={{
              flex: 1,
              padding: '10px 0',
              background: 'none',
              border: 'none',
              borderBottom: isSignUp ? '2px solid var(--accent-primary)' : '2px solid transparent',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.95rem',
              fontWeight: isSignUp ? 600 : 400,
              color: isSignUp ? 'var(--text-primary)' : 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--accent-primary)',
            color: 'var(--accent-primary)',
            padding: '10px 14px',
            borderRadius: '6px',
            fontSize: '0.85rem',
            marginBottom: '16px',
            lineHeight: 1.4
          }}>
            {error}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {isSignUp && (
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.82rem', 
                fontWeight: 600, 
                color: 'var(--text-primary)', 
                marginBottom: '6px' 
              }}>
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="Alex Evaluator"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          )}

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '0.82rem', 
              fontWeight: 600, 
              color: 'var(--text-primary)', 
              marginBottom: '6px' 
            }}>
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="alex@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '0.95rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '0.82rem', 
              fontWeight: 600, 
              color: 'var(--text-primary)', 
              marginBottom: '6px' 
            }}>
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '0.95rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Privacy Note */}
          <div style={{
            fontSize: '0.78rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.4,
            padding: '8px 10px',
            background: 'var(--bg-tertiary)',
            borderRadius: '6px'
          }}>
            🔒 <strong>Workspace Isolation:</strong> Your discussions, tailored company context, and generated artifacts are strictly private to your account.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              marginTop: '6px',
              padding: '12px',
              fontWeight: 600,
              fontSize: '0.95rem',
              justifyContent: 'center'
            }}
          >
            {loading ? 'Processing...' : (isSignUp ? 'Create Private Workspace' : 'Sign In to Workspace')}
          </button>
        </form>
      </div>
    </div>
  );
}
