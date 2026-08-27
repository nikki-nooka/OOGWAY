import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/index.css';
import './styles/chat.css';
import './styles/artifact.css';
import './styles/magazine.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Lenny Assistant Render Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#F5F2EA',
          color: '#161616',
          fontFamily: "'Inter', sans-serif",
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '520px',
            backgroundColor: '#FBFAF6',
            padding: '2.5rem',
            borderRadius: '12px',
            border: '1px solid #E2DDD2',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '1.75rem', marginBottom: '1rem', color: '#9A5B2E' }}>
              The Lenny Growth Assistant
            </h2>
            <p style={{ color: '#66635C', marginBottom: '1.5rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
              A temporary interface state occurred. Please click below to refresh your session.
            </p>
            <button
              onClick={() => {
                localStorage.removeItem('lenny_auth_user');
                window.location.href = '/';
              }}
              style={{
                backgroundColor: '#9A5B2E',
                color: '#fff',
                border: 'none',
                padding: '0.75rem 1.75rem',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: 'pointer'
              }}
            >
              Reload Lenny Assistant
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
