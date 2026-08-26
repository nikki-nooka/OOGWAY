import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import ArtifactViewer from './components/ArtifactViewer';
import SourceDrawer from './components/SourceDrawer';
import KnowledgeBaseModal from './components/KnowledgeBaseModal';

export default function App() {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [currentSession, setCurrentSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modelsData, setModelsData] = useState(null);
  const [activeModel, setActiveModel] = useState('ollama');
  const [health, setHealth] = useState(null);
  const [activeArtifact, setActiveArtifact] = useState(null);
  const [activeCitation, setActiveCitation] = useState(null);
  const [isKnowledgeBaseOpen, setIsKnowledgeBaseOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Initialize theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Initial load
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [sessionsRes, modelsRes, healthRes] = await Promise.all([
        api.getSessions().catch(() => []),
        api.getModels().catch(() => null),
        api.getHealth().catch(() => null),
      ]);

      setSessions(sessionsRes);
      setModelsData(modelsRes);
      if (modelsRes?.active) setActiveModel(modelsRes.active);
      setHealth(healthRes);

      if (sessionsRes.length > 0) {
        selectSession(sessionsRes[0].id);
      }
    } catch (err) {
      console.error("Initial load error:", err);
    }
  };

  const selectSession = async (sessionId) => {
    setActiveSessionId(sessionId);
    try {
      const sessionDetail = await api.getSession(sessionId);
      setCurrentSession(sessionDetail);
      setMessages(sessionDetail.messages || []);
      setActiveArtifact(null);
    } catch (err) {
      console.error("Error loading session:", err);
    }
  };

  const handleNewSession = async () => {
    try {
      const newSession = await api.createSession({
        title: "New Discussion",
        model_provider: activeModel
      });
      setSessions(prev => [newSession, ...prev]);
      setActiveSessionId(newSession.id);
      setCurrentSession(newSession);
      setMessages([]);
      setActiveArtifact(null);
    } catch (err) {
      console.error("Error creating session:", err);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      await api.deleteSession(sessionId);
      const remaining = sessions.filter(s => s.id !== sessionId);
      setSessions(remaining);
      if (activeSessionId === sessionId) {
        if (remaining.length > 0) {
          selectSession(remaining[0].id);
        } else {
          setActiveSessionId(null);
          setCurrentSession(null);
          setMessages([]);
          setActiveArtifact(null);
        }
      }
    } catch (err) {
      console.error("Error deleting session:", err);
    }
  };

  const handleClearAllSessions = async () => {
    try {
      await api.clearAllSessions();
      setSessions([]);
      setActiveSessionId(null);
      setCurrentSession(null);
      setMessages([]);
      setActiveArtifact(null);
    } catch (err) {
      console.error("Error clearing sessions:", err);
    }
  };

  const handleSelectModel = async (providerId) => {
    setActiveModel(providerId);
    try {
      await api.setActiveModel(providerId);
    } catch (err) {
      console.error("Error updating model:", err);
    }
  };

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    // Optimistic user message update
    const tempUserMsg = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: text,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMsg]);
    setLoading(true);

    try {
      const response = await api.sendMessage({
        message: text,
        session_id: activeSessionId,
        model: activeModel
      });

      // Update session ID if newly created
      if (!activeSessionId) {
        setActiveSessionId(response.session_id);
        setSessions(prev => [{
          id: response.session_id,
          title: text.slice(0, 30),
          model_provider: response.model_used,
          message_count: 2,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, ...prev]);
      }

      // Add assistant response
      const assistantMsg = {
        id: response.message_id,
        role: 'assistant',
        content: response.content,
        citations: response.citations || [],
        artifacts: response.artifacts || [],
        model_used: response.model_used,
        latency_ms: response.latency_ms,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, assistantMsg]);

      // If an artifact was generated, automatically open in split-view
      if (response.artifacts && response.artifacts.length > 0) {
        setActiveArtifact(response.artifacts[0]);
      }

      // Refresh sessions list in background to update titles and counts
      api.getSessions().then(setSessions).catch(() => {});

    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `**Error processing request:** ${err.message}`,
        model_used: 'error',
        created_at: new Date().toISOString()
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Left Sidebar */}
      <Sidebar 
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={selectSession}
        onNewSession={handleNewSession}
        onDeleteSession={handleDeleteSession}
        onClearAllSessions={handleClearAllSessions}
        onOpenKnowledgeBase={() => setIsKnowledgeBaseOpen(true)}
        health={health}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Center Chat Viewport */}
      <ChatArea 
        session={currentSession}
        messages={messages}
        loading={loading}
        modelsData={modelsData}
        activeModel={activeModel}
        onSelectModel={handleSelectModel}
        onSendMessage={handleSendMessage}
        onOpenCitation={(cit) => setActiveCitation(cit)}
        onOpenArtifact={(art) => setActiveArtifact(art)}
        onOpenKnowledgeBase={() => setIsKnowledgeBaseOpen(true)}
        activeArtifact={activeArtifact}
        theme={theme}
        onToggleTheme={toggleTheme}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
      />

      {/* Right Side-by-Side Claude-Style Artifact Viewer */}
      {activeArtifact && (
        <ArtifactViewer 
          artifact={activeArtifact}
          onClose={() => setActiveArtifact(null)}
        />
      )}

      {/* Slide-over Source Drawer */}
      <SourceDrawer 
        citation={activeCitation}
        onClose={() => setActiveCitation(null)}
      />

      {/* Knowledge Base Modal */}
      <KnowledgeBaseModal 
        isOpen={isKnowledgeBaseOpen}
        onClose={() => setIsKnowledgeBaseOpen(false)}
      />
    </div>
  );
}
