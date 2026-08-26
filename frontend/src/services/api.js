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
  }
};
