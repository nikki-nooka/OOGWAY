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
import ContextApplicationModal from './components/ContextApplicationModal';
import DecisionModeModal from './components/DecisionModeModal';

const getTabFromPath = (pathname) => {
  const path = (pathname || '').toLowerCase().replace(/\/$/, '');
  if (!path || path === '' || path === '/home') return 'home';
  if (path === '/explore') return 'explore';
  if (path === '/chat' || path === '/ask') return 'chat';
  if (path === '/writing' || path === '/studio') return 'writing';
  if (path === '/artifacts' || path === '/library') return 'artifacts';
  if (path === '/slides' || path === '/deck') return 'slides';
  if (path === '/sources' || path === '/transcripts' || path === '/kb') return 'sources';
  return 'home';
};

export default function App() {
  // Navigation & View State (with direct browser URL sync)
  const [activeTab, setActiveTab] = useState(() => getTabFromPath(window.location.pathname));
  
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
  const [isContextModalOpen, setIsContextModalOpen] = useState(false);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [contextActionTopic, setContextActionTopic] = useState('Growth & PMF');
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

  // Browser Navigation & History routing listener
  useEffect(() => {
    const handlePopState = () => {
      const tab = getTabFromPath(window.location.pathname);
      if (tab === 'sources') {
        setIsKnowledgeBaseOpen(true);
      } else {
        setActiveTab(tab);
      }
    };

    // If loaded on /sources, trigger knowledge base modal
    if (window.location.pathname.includes('/sources')) {
      setIsKnowledgeBaseOpen(true);
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Initial data load
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

  // Route Navigator that synchronizes browser URL (e.g. localhost:3000/artifacts)
  const navigateToTab = (tabKey, replace = false) => {
    if (tabKey === 'chat_new') {
      handleNewSession();
      const path = '/chat';
      if (window.location.pathname !== path) {
        window.history.pushState({ tab: 'chat' }, '', path);
      }
      return;
    }

    if (tabKey === 'sources') {
      setIsKnowledgeBaseOpen(true);
      const path = '/sources';
      if (window.location.pathname !== path) {
        window.history.pushState({ tab: 'sources' }, '', path);
      }
      return;
    }

    setActiveTab(tabKey);
    const targetPath = tabKey === 'home' ? '/' : `/${tabKey}`;
    if (window.location.pathname !== targetPath) {
      if (replace) {
        window.history.replaceState({ tab: tabKey }, '', targetPath);
      } else {
        window.history.pushState({ tab: tabKey }, '', targetPath);
      }
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
      navigateToTab('chat');
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

  const handleSelectModel = async (modelId) => {
    try {
      await api.setModel(modelId);
      setActiveModel(modelId);
      const modelsRes = await api.getModels();
      setModelsData(modelsRes);
    } catch (err) {
      console.error("Error switching model:", err);
    }
  };

  const handleSendMessage = async (text) => {
    if (!text.trim() || loading) return;

    let targetSessionId = activeSessionId;

    if (!targetSessionId) {
      try {
        const newSession = await api.createSession({
          title: text.slice(0, 32) + (text.length > 32 ? '...' : ''),
          model_provider: activeModel
        });
        setSessions(prev => [newSession, ...prev]);
        setActiveSessionId(newSession.id);
        setCurrentSession(newSession);
        targetSessionId = newSession.id;
      } catch (err) {
        console.error("Failed to create session on message send:", err);
        return;
      }
    }

    const optimisticUserMsg = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: text,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, optimisticUserMsg]);
    setLoading(true);

    try {
      const response = await api.sendMessage(targetSessionId, {
        content: text,
        model_provider: activeModel
      });

      const assistantMsg = {
        id: response.message_id || `asst-${Date.now()}`,
        role: 'assistant',
        content: response.content,
        citations: response.citations || [],
        artifacts: response.artifacts || [],
        model_used: response.model_used || activeModel,
        latency_ms: response.latency_ms,
        created_at: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMsg]);

      // Auto-open generated artifact if present
      if (response.artifacts && response.artifacts.length > 0) {
        setActiveArtifact(response.artifacts[0]);
      }

      // Update session list title
      setSessions(prev => prev.map(s => {
        if (s.id === targetSessionId && s.title === 'New Discussion') {
          return { ...s, title: text.slice(0, 32) + (text.length > 32 ? '...' : '') };
        }
        return s;
      }));

    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [...prev, {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ Communication error: Could not reach the grounding backend. Please verify your connection or model settings.`,
        created_at: new Date().toISOString()
      }]);
    } finally {
      setLoading(false);
    }
  };

  // Cross-feature routing handlers
  const handleStartChatWithPrompt = (prompt) => {
    navigateToTab('chat');
    handleSendMessage(prompt);
  };

  const handleExploreTopic = (topicId) => {
    setExploreSelectedTopic(topicId);
    navigateToTab('explore');
  };

  const handleOpenWritingWithTopic = (topicTitle) => {
    setWritingInitialTopic(topicTitle);
    navigateToTab('writing');
  };

  // Action Bar handler
  const handleActionTrigger = (actionType, contextText) => {
    const cleanTopic = contextText.replace(/^#+\s+/gm, '').replace(/[*_`]/g, '').slice(0, 140);
    
    if (actionType === 'challenge') {
      handleSendMessage(`⚡ Challenge this advice: What are the failure modes, counterpoints, and alternative guest models for: "${cleanTopic}"?`);
    } else if (actionType === 'apply-context') {
      setContextActionTopic(cleanTopic);
      setIsContextModalOpen(true);
    } else if (actionType === 'decision') {
      setIsDecisionModalOpen(true);
    } else if (actionType === 'experiment') {
      handleSendMessage(`🧪 Generate an Experiment Brief with hypothesis, sample size, primary metrics, and 7-day retention guardrails for solving: "${cleanTopic}"`);
    } else if (actionType === 'framework') {
      handleSendMessage(`📐 Build a visual strategic mental model framework and ASCII diagram for: "${cleanTopic}"`);
    } else if (actionType === 'ship30') {
      handleOpenWritingWithTopic(cleanTopic);
    }
  };

  const handleApplyContextResult = (result) => {
    const synthesizedContent = `### 🎯 Tailored Playbook for Your Context\n\n**Situation:** ${result.situation_summary}\n\n#### 🔑 Core Principles:\n${result.core_principles.map(p => `- ${p}`).join('\n')}\n\n#### 📋 Recommended Step-by-Step Actions:\n${result.recommended_actions.map(a => `1. **${a.phase}: ${a.action}**\n   - *Rationale:* ${a.rationale}\n   - *Evidence:* Grounded in principles from **${a.evidence_ref}**`).join('\n\n')}\n\n#### ⚠️ Pre-Mortem Guardrails:\n${result.key_risks.map(r => `- ${r}`).join('\n')}`;
    
    setMessages(prev => [...prev, {
      id: `ctx-${Date.now()}`,
      role: 'assistant',
      content: synthesizedContent,
      citations: result.citations || [],
      model_used: 'Context Engine',
      created_at: new Date().toISOString()
    }]);
  };

  const handleDecisionResult = (result) => {
    const newArt = {
      id: result.artifact_id || `memo-${Date.now()}`,
      title: result.title,
      artifact_type: 'markdown',
      content: result.artifact_content
    };
    setActiveArtifact(newArt);
    navigateToTab('chat');
  };

  return (
    <div className="app-viewport">
      {/* Top Editorial Navbar */}
      <Navbar 
        activeTab={activeTab}
        onSelectTab={navigateToTab}
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
            onOpenWritingStudio={() => navigateToTab('writing')}
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
              onActionTrigger={handleActionTrigger}
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

        {/* Screen 10: Ship 30 Writing Studio */}
        {activeTab === 'writing' && (
          <WritingStudio 
            initialTopic={writingInitialTopic}
            onSaveArtifact={() => {}}
          />
        )}

        {/* Screen 11: Artifact Library */}
        {activeTab === 'artifacts' && (
          <ArtifactLibrary 
            onSelectArtifact={(art) => {
              setActiveArtifact(art);
              navigateToTab('chat');
            }}
            onOpenWritingStudio={() => navigateToTab('writing')}
          />
        )}

        {/* Screen 12: Presentation Deck Mode */}
        {activeTab === 'slides' && (
          <PresentationDeck />
        )}
      </main>

      {/* Global Modals & Drawers */}
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

      <KnowledgeBaseModal 
        isOpen={isKnowledgeBaseOpen}
        onClose={() => {
          setIsKnowledgeBaseOpen(false);
          // If URL was /sources, return path to current active tab
          if (window.location.pathname.includes('/sources')) {
            const targetPath = activeTab === 'home' ? '/' : `/${activeTab}`;
            window.history.replaceState({ tab: activeTab }, '', targetPath);
          }
        }}
        onSelectEpisode={(epId) => setActiveEpisodeId(epId)}
        onStartChat={handleStartChatWithPrompt}
      />

      <EpisodeDetailModal 
        episodeId={activeEpisodeId}
        onClose={() => setActiveEpisodeId(null)}
        onStartChat={handleStartChatWithPrompt}
      />

      <SourceDrawer 
        citation={activeCitation}
        onClose={() => setActiveCitation(null)}
      />

      <ContextApplicationModal
        isOpen={isContextModalOpen}
        onClose={() => setIsContextModalOpen(false)}
        topic={contextActionTopic}
        onApplyContextResult={handleApplyContextResult}
      />

      <DecisionModeModal
        isOpen={isDecisionModalOpen}
        onClose={() => setIsDecisionModalOpen(false)}
        onDecisionResult={handleDecisionResult}
      />
    </div>
  );
}
