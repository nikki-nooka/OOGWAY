import React, { useState } from 'react';
import { Cpu, ChevronDown, Check, Cloud, ShieldCheck, Zap } from 'lucide-react';

export default function ModelSelector({ modelsData, activeModel, onSelectModel }) {
  const [isOpen, setIsOpen] = useState(false);

  const models = modelsData?.available || [
    { id: 'ollama', name: 'Local Ollama (llama3.2)', type: 'local', is_ready: true, description: 'Mandatory local demo model (zero cloud egress)' },
    { id: 'claude', name: 'Anthropic Claude (3.5 Sonnet)', type: 'cloud', is_ready: false, description: 'State-of-the-art reasoning for complex strategy' },
    { id: 'openai', name: 'OpenAI (GPT-4o)', type: 'cloud', is_ready: false, description: 'High-throughput cloud generation' },
    { id: 'mock', name: 'Built-in Grounded Engine', type: 'embedded', is_ready: true, description: 'Deterministic offline fallback (100% reliable)' },
  ];

  const currentModel = models.find(m => m.id === activeModel) || models[0];

  const getTypeBadge = (type) => {
    switch (type) {
      case 'local':
        return <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '1px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 700 }}>LOCAL</span>;
      case 'cloud':
        return <span style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', border: '1px solid rgba(99, 102, 241, 0.4)', padding: '1px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 700 }}>CLOUD</span>;
      default:
        return <span style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.4)', padding: '1px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 700 }}>EMBEDDED</span>;
    }
  };

  return (
    <div style={{ position: 'relative', zIndex: 100 }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px',
          fontSize: '12.5px',
          fontWeight: 600,
          background: '#162032',
          color: '#f8fafc',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '8px',
          cursor: 'pointer',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          transition: 'all 0.15s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#6366f1';
          e.currentTarget.style.boxShadow = '0 0 10px rgba(99, 102, 241, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
          e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
        }}
      >
        <span style={{ 
          width: '8px', 
          height: '8px', 
          borderRadius: '50%', 
          background: currentModel.is_ready ? '#10b981' : '#f59e0b',
          boxShadow: currentModel.is_ready ? '0 0 6px #10b981' : '0 0 6px #f59e0b'
        }} />
        <span>{currentModel.name}</span>
        <ChevronDown size={14} style={{ opacity: 0.8, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop click interceptor */}
          <div 
            style={{ position: 'fixed', inset: 0, zIndex: 9998 }} 
            onClick={() => setIsOpen(false)} 
          />
          
          {/* Dropdown Menu */}
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '340px',
            background: '#0f172a',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            borderRadius: '12px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(255, 255, 255, 0.08)',
            padding: '8px',
            zIndex: 9999,
            animation: 'fadeIn 0.15s ease-out'
          }}>
            <div style={{ 
              padding: '8px 12px 10px', 
              fontSize: '11px', 
              fontWeight: 800, 
              color: '#94a3b8', 
              textTransform: 'uppercase', 
              letterSpacing: '0.06em',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>Select Active LLM</span>
              <span style={{ fontSize: '10px', fontWeight: 600, color: '#64748b' }}>Multi-Provider Engine</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
              {models.map((m) => {
                const isSelected = m.id === activeModel;
                return (
                  <div
                    key={m.id}
                    onClick={() => {
                      onSelectModel(m.id);
                      setIsOpen(false);
                    }}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                      border: isSelected ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = '#1e293b';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = 'transparent';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ 
                          width: '7px', 
                          height: '7px', 
                          borderRadius: '50%', 
                          background: m.is_ready ? '#10b981' : '#f59e0b',
                          flexShrink: 0
                        }} />
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc' }}>
                          {m.name}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {getTypeBadge(m.type)}
                        {isSelected && <Check size={14} color="#818cf8" style={{ strokeWidth: 3 }} />}
                      </div>
                    </div>
                    
                    <div style={{ fontSize: '11.5px', color: '#94a3b8', paddingLeft: '15px', lineHeight: 1.4 }}>
                      {m.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
