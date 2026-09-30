import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F9FAFB',
          color: '#111827',
          padding: '2rem',
          fontFamily: "'Inter', system-ui, sans-serif"
        }}>
          <div style={{
            background: '#FFFFFF',
            padding: '2rem',
            borderRadius: '8px',
            border: '1px solid #E5E7EB',
            maxWidth: '480px',
            width: '100%',
            textAlign: 'center'
          }}>
            <h2 style={{ color: '#DC2626', marginBottom: '0.75rem', fontSize: '1rem', fontWeight: 600 }}>Application Error</h2>
            <p style={{ color: '#6B7280', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              {this.state.error?.message || 'An unexpected error occurred while loading the dashboard.'}
            </p>
            <button
              onClick={() => {
                window.location.href = window.location.origin + '/';
              }}
              style={{
                background: '#4F46E5',
                color: '#fff',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.8125rem'
              }}
            >
              Reset & Return to Dashboard
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
)
