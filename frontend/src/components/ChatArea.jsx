import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Sun, 
  Moon, 
  BookOpen, 
  PanelLeft,
  Loader2
} from 'lucide-react';
import MessageItem from './MessageItem';
import QuickPrompts from './QuickPrompts';
import ModelSelector from './ModelSelector';

export default function ChatArea({
  session,
  messages,
  loading,
  modelsData,
  activeModel,
  onSelectModel,
  onSendMessage,
  onOpenCitation,
  onOpenArtifact,
  onOpenKnowledgeBase,
  onActionTrigger,
  activeArtifact,
  theme,
  onToggleTheme,
  isSidebarOpen,
  onToggleSidebar,
  currentUser,
  onOpenAuth
}) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!inputText.trim() || loading) return;
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    onSendMessage(inputText);
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleInputResize = (e) => {
    setInputText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
  };

  return (
    <main className="chat-container">
      {/* Top Header */}
      <header className="chat-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            onClick={onToggleSidebar}
            className="btn btn-ghost"
            style={{ padding: '6px' }}
            title={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
          >
            <PanelLeft size={17} />
          </button>
          
          <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>
            {session?.title || "New Discussion"}
          </div>
          {messages.length > 0 && (
            <span className="badge badge-primary">
              {messages.length} msgs
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ModelSelector 
            modelsData={modelsData}
            activeModel={activeModel}
            onSelectModel={onSelectModel}
          />

          <button 
            onClick={onOpenKnowledgeBase}
            className="btn btn-secondary" 
            style={{ padding: '5px 10px', fontSize: '12px' }}
            title="Browse Lenny's Podcast Transcripts"
          >
            <BookOpen size={13} color="var(--accent-primary)" />
            <span style={{ display: 'inline-block' }}>Knowledge Base</span>
          </button>

          <button 
            onClick={onToggleTheme} 
            className="btn btn-ghost" 
            style={{ padding: '6px' }}
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={15} color="#f59e0b" /> : <Moon size={15} color="#6366f1" />}
          </button>
        </div>
      </header>

      {/* Messages Viewport */}
      <div className="chat-messages">
        <div className="chat-inner">
          {messages.length === 0 ? (
            <QuickPrompts onSelectPrompt={(prompt) => {
              if (!currentUser) {
                if (onOpenAuth) onOpenAuth();
                return;
              }
              setInputText(prompt);
              onSendMessage(prompt);
            }} />
          ) : (
            messages.map((msg, index) => (
              <MessageItem 
                key={msg.id || index}
                message={msg}
                onOpenCitation={onOpenCitation}
                onOpenArtifact={onOpenArtifact}
                onActionTrigger={onActionTrigger}
              />
            ))
          )}

          {loading && (
            <div className="message-bubble assistant">
              <div className="message-avatar assistant">
                <Sparkles size={16} />
              </div>
              <div className="message-content-wrapper">
                <div className="message-header">
                  <span className="message-author">Lenny Growth Assistant</span>
                  <span className="badge badge-primary">Grounded Reasoning...</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
                  <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Searching 4,380+ transcripts & synthesizing grounded insights...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form Bar */}
      <div className="chat-input-container">
        <div className="chat-input-inner">
          {!currentUser && (
            <div style={{
              marginBottom: '10px',
              padding: '10px 16px',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                <Sparkles size={15} color="var(--accent-primary)" />
                <span><strong>Sign In Required:</strong> Sign in or create a free account to chat with Lenny, run grounded RAG queries, and save your private research workspace.</span>
              </div>
              <button 
                className="btn btn-primary"
                onClick={onOpenAuth}
                style={{ padding: '5px 14px', fontSize: '12px', whiteSpace: 'nowrap' }}
              >
                Sign In / Register
              </button>
            </div>
          )}

          <div className="chat-input-box">
            <textarea
              ref={textareaRef}
              rows={1}
              className="chat-textarea"
              placeholder={currentUser ? "Ask about PMF, retention, pricing, or ask for a Ship 30 for 30 essay / interactive artifact..." : "Sign in or register to start asking Lenny questions..."}
              value={inputText}
              onChange={handleInputResize}
              onKeyDown={handleKeyDown}
            />
            <div className="chat-input-footer">
              <div className="input-hints">
                <span>Press <strong>Enter</strong> to send, <strong>Shift+Enter</strong> for newline</span>
              </div>
              <button 
                className="btn-send"
                disabled={!inputText.trim() || loading}
                onClick={handleSend}
                title={currentUser ? "Send message" : "Sign in to send"}
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
