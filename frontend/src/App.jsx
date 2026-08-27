import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import ExploreMagazine from './components/ExploreMagazine';
import WritingStudio from './components/WritingStudio';
import ArtifactLibrary from './components/ArtifactLibrary';
import PresentationDeck from './components/PresentationDeck';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import ArtifactViewer from './components/ArtifactViewer';
import SourceDrawer from './components/SourceDrawer';
import SettingsModal from './components/SettingsModal';
import KnowledgeBaseModal from './components/KnowledgeBaseModal';
import EpisodeDetailModal from './components/EpisodeDetailModal';

export default function App() {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'explore' | 'chat' | 'writing' | 'artifacts' | 'slides' | 'sources'

  
  // Data State
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [currentSession, setCurrentSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Model & System State
  const [modelsData, setModelsData] = useState(null);
  const [activeModel, setActiveModel] = useState('ollama');
  const [health, setHealth] = useState(null);
  const [theme, setTheme] = useState('light'); // Default to Warm Editorial Light
  
  // Modals & Panels
  const [activeArtifact, setActiveArtifact] = useState(null);
  const [activeCitation, setActiveCitation] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isKnowledgeBaseOpen, setIsKnowledgeBaseOpen] = useState(false);
  const [activeEpisodeId, setActiveEpisodeId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Context pass-through for Writing Studio & Explore
  const [writingInitialTopic, setWritingInitialTopic] = useState('');
  const [exploreSelectedTopic, setExploreSelectedTopic] = useState(null);

  // Initialize theme on html element
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
      setActiveTab('chat');
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
      const updated = await api.getModels().catch(() => null);
      if (updated) setModelsData(updated);
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

  // Cross-Tab Navigation Helpers
  const handleStartChatWithPrompt = (promptText) => {
    setActiveTab('chat');
    handleSendMessage(promptText);
  };

  const handleOpenWritingWithTopic = (topicName) => {
    setWritingInitialTopic(topicName);
    setActiveTab('writing');
  };

  const handleExploreTopic = (topicId) => {
    setExploreSelectedTopic(topicId);
    setActiveTab('explore');
  };

  const handleTabSelect = (tabKey) => {
    if (tabKey === 'chat_new') {
      handleNewSession();
    } else if (tabKey === 'sources') {
      setIsKnowledgeBaseOpen(true);
    } else {
      setActiveTab(tabKey);
    }
  };

  return (
    <div className="app-viewport">
      {/* Top Editorial Navbar */}
      <Navbar 
        activeTab={activeTab}
        onSelectTab={handleTabSelect}
        activeModel={activeModel}
        modelsData={modelsData}
        onOpenSettings={() => setIsSettingsOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenSearch={() => setIsKnowledgeBaseOpen(true)}
      />

      {/* Main Content Area Routing */}
      <main className="app-main-content">
        {/* Screen 01: Home Page */}
        {activeTab === 'home' && (
          <HomePage 
            onStartChat={handleStartChatWithPrompt}
            onExploreTopic={handleExploreTopic}
            onOpenWritingStudio={() => setActiveTab('writing')}
            onOpenEpisode={(epId) => setActiveEpisodeId(epId)}
          />
        )}

        {/* Screen 02 & 03: Explore Magazine */}
        {activeTab === 'explore' && (
          <ExploreMagazine 
            onStartChat={handleStartChatWithPrompt}
            onOpenWritingTopic={handleOpenWritingWithTopic}
            selectedTopicId={exploreSelectedTopic}
          />
        )}

        {/* Screen 06 - 10: Conversational Research Workspace */}
        {activeTab === 'chat' && (
          <div className="chat-workspace-wrapper">
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

            {/* Right Side-by-Side Claude-Style Artifact Viewer (Screen 13 & 14) */}
            {activeArtifact && (
              <ArtifactViewer 
                artifact={activeArtifact}
                onClose={() => setActiveArtifact(null)}
              />
            )}
          </div>
        )}

        {/* Screen 11 & 12: Writing Studio (Ship 30 for 30) */}
        {activeTab === 'writing' && (
          <WritingStudio 
            initialTopic={writingInitialTopic}
            onSaveArtifact={() => {}}
          />
        )}

        {/* Screen 15: Artifact Library */}
        {activeTab === 'artifacts' && (
          <ArtifactLibrary 
            onSelectArtifact={(art) => {
              setActiveArtifact(art);
              setActiveTab('chat');
            }}
            onOpenWritingStudio={() => setActiveTab('writing')}
          />
        )}

        {/* Screen 16 / Section 50: Interactive Presentation Slide Deck */}
        {activeTab === 'slides' && (
          <PresentationDeck />
        )}
      </main>



      {/* Slide-over Source Drawer (Screen 05) */}
      <SourceDrawer 
        citation={activeCitation}
        onClose={() => setActiveCitation(null)}
      />

      {/* Knowledge Base Modal */}
      <KnowledgeBaseModal 
        isOpen={isKnowledgeBaseOpen}
        onClose={() => setIsKnowledgeBaseOpen(false)}
      />

      {/* Episode Detail Modal (Screen 04 & 05) */}
      <EpisodeDetailModal 
        episodeId={activeEpisodeId}
        onClose={() => setActiveEpisodeId(null)}
        onStartChat={handleStartChatWithPrompt}
      />

      {/* System Settings & Model Status Modal (Screen 16 & 17) */}
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        activeModel={activeModel}
        onSelectModel={handleSelectModel}
        modelsData={modelsData}
        health={health}
        theme={theme}
        onToggleTheme={toggleTheme}
        onClearAllSessions={handleClearAllSessions}
      />
    </div>
  );
}
