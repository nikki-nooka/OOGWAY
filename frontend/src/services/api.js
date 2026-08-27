const API_BASE = '/api';

export const api = {
  async sendMessage({ message, session_id, model }) {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, session_id, model }),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `Chat request failed with status ${res.status}`);
    }
    return res.json();
  },

  async getSessions() {
    const res = await fetch(`${API_BASE}/sessions`);
    if (!res.ok) throw new Error('Failed to fetch sessions');
    return res.json();
  },

  async createSession({ title = "New Discussion", model_provider = "ollama" } = {}) {
    const res = await fetch(`${API_BASE}/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, model_provider }),
    });
    if (!res.ok) throw new Error('Failed to create session');
    return res.json();
  },

  async getSession(sessionId) {
    const res = await fetch(`${API_BASE}/sessions/${sessionId}`);
    if (!res.ok) throw new Error('Failed to fetch session detail');
    return res.json();
  },

  async deleteSession(sessionId) {
    const res = await fetch(`${API_BASE}/sessions/${sessionId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete session');
    return res.json();
  },

  async clearAllSessions() {
    const res = await fetch(`${API_BASE}/sessions/clear_all`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to clear sessions');
    return res.json();
  },

  async getModels() {
    const res = await fetch(`${API_BASE}/models`);
    if (!res.ok) throw new Error('Failed to fetch models');
    return res.json();
  },

  async setActiveModel(provider) {
    const res = await fetch(`${API_BASE}/models/set`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider }),
    });
    if (!res.ok) throw new Error('Failed to update model');
    return res.json();
  },

  // --- Writing Studio (Ship 30 for 30) ---
  async generateShip30Essay({ topic, target_words = 1250, style = "ship30", guest_focus = null, session_id = null, model = null }) {
    const res = await fetch(`${API_BASE}/writing/ship30`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, target_words, style, guest_focus, session_id, model }),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to generate Ship 30 essay');
    }
    return res.json();
  },

  // --- Topics ---
  async getTopics() {
    const res = await fetch(`${API_BASE}/topics`);
    if (!res.ok) throw new Error('Failed to fetch topics');
    return res.json();
  },

  async getTopicDetail(topicId) {
    const res = await fetch(`${API_BASE}/topics/${topicId}`);
    if (!res.ok) throw new Error('Failed to fetch topic details');
    return res.json();
  },

  // --- Artifacts ---
  async getArtifacts() {
    const res = await fetch(`${API_BASE}/artifacts`);
    if (!res.ok) throw new Error('Failed to fetch artifacts');
    return res.json();
  },

  async getArtifact(artifactId) {
    const res = await fetch(`${API_BASE}/artifacts/${artifactId}`);
    if (!res.ok) throw new Error('Failed to fetch artifact');
    return res.json();
  },

  async createArtifact({ title, artifact_type = "markdown", content, session_id = null, meta = {} }) {
    const res = await fetch(`${API_BASE}/artifacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, artifact_type, content, session_id, meta }),
    });
    if (!res.ok) throw new Error('Failed to create artifact');
    return res.json();
  },

  async deleteArtifact(artifactId) {
    const res = await fetch(`${API_BASE}/artifacts/${artifactId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete artifact');
    return res.json();
  },

  // --- Sources & Transcripts ---
  async getSources(query = '') {
    const url = query ? `${API_BASE}/sources?query=${encodeURIComponent(query)}` : `${API_BASE}/sources`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch sources');
    return res.json();
  },

  async getSourceDetail(episodeId) {
    const res = await fetch(`${API_BASE}/sources/${episodeId}`);
    if (!res.ok) throw new Error('Failed to fetch source details');
    return res.json();
  },

  async getTranscripts(query = '') {
    const url = query ? `${API_BASE}/transcripts?query=${encodeURIComponent(query)}` : `${API_BASE}/transcripts`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch transcripts');
    return res.json();
  },

  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Failed health check');
    return res.json();
  },

  async getBenchmarks() {
    const res = await fetch(`${API_BASE}/benchmarks`);
    if (!res.ok) throw new Error('Failed to fetch benchmarks');
    return res.json();
  }
};

