const API_BASE = '/api';

const TOKEN_KEY = 'lenny_auth_token';
const USER_KEY = 'lenny_auth_user';

export const authStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),
  getUser: () => {
    try {
      const val = localStorage.getItem(USER_KEY);
      return val ? JSON.parse(val) : null;
    } catch {
      return null;
    }
  },
  setUser: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  clearUser: () => localStorage.removeItem(USER_KEY),
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

const getHeaders = (extraHeaders = {}) => {
  const headers = { 'Content-Type': 'application/json', ...extraHeaders };
  const token = authStorage.getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // --- Authentication & User Profile ---
  async signup({ name, email, password }) {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Sign up failed');
    }
    const data = await res.json();
    authStorage.setToken(data.access_token);
    authStorage.setUser(data.user);
    return data;
  },

  async login({ email, password }) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Invalid email or password');
    }
    const data = await res.json();
    authStorage.setToken(data.access_token);
    authStorage.setUser(data.user);
    return data;
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/me`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Unauthorized');
    const user = await res.json();
    authStorage.setUser(user);
    return user;
  },

  async getProfile() {
    const res = await fetch(`${API_BASE}/me`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Unauthorized');
    const user = await res.json();
    authStorage.setUser(user);
    return user;
  },

  async updateProfile(profileData) {
    const res = await fetch(`${API_BASE}/me`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(profileData),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to update profile');
    }
    const updatedUser = await res.json();
    authStorage.setUser(updatedUser);
    return updatedUser;
  },

  async getWorkspaceSummary() {
    const res = await fetch(`${API_BASE}/me/workspace`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load workspace summary');
    return res.json();
  },

  async logout() {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: getHeaders(),
      });
    } finally {
      authStorage.logout();
    }
  },


  // --- Personal Workspace Context ---
  async getUserContext() {
    const res = await fetch(`${API_BASE}/user/context`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch user context');
    return res.json();
  },

  async updateUserContext(contextData) {
    const res = await fetch(`${API_BASE}/user/context`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(contextData),
    });
    if (!res.ok) throw new Error('Failed to update user context');
    return res.json();
  },

  // --- Chat & Discussions ---
  async sendMessage(sessionId, { content, message, model_provider, model }) {
    const targetMessage = content || message;
    const targetModel = model_provider || model;
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ message: targetMessage, session_id: sessionId, model: targetModel }),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || `Chat request failed with status ${res.status}`);
    }
    return res.json();
  },

  async getSessions() {
    const res = await fetch(`${API_BASE}/sessions`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch sessions');
    return res.json();
  },

  async createSession({ title = "New Discussion", model_provider = "ollama" } = {}) {
    const res = await fetch(`${API_BASE}/sessions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ title, model_provider }),
    });
    if (!res.ok) throw new Error('Failed to create session');
    return res.json();
  },

  async getSession(sessionId) {
    const res = await fetch(`${API_BASE}/sessions/${sessionId}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch session detail');
    return res.json();
  },

  async deleteSession(sessionId) {
    const res = await fetch(`${API_BASE}/sessions/${sessionId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete session');
    return res.json();
  },

  async clearAllSessions() {
    const res = await fetch(`${API_BASE}/sessions/clear_all`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to clear sessions');
    return res.json();
  },

  // --- Model Provider Management ---
  async getModels() {
    const res = await fetch(`${API_BASE}/models`);
    if (!res.ok) throw new Error('Failed to fetch models');
    return res.json();
  },

  async setModel(provider) {
    const res = await fetch(`${API_BASE}/models/set`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ provider }),
    });
    if (!res.ok) throw new Error('Failed to update model');
    return res.json();
  },

  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Failed to check health');
    return res.json();
  },

  // --- Writing Studio (Ship 30 for 30) ---
  async generateShip30Essay({ topic, target_words = 1250, style = "ship30", guest_focus = null, session_id = null, model = null }) {
    const res = await fetch(`${API_BASE}/writing/ship30`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ topic, target_words, style, guest_focus, session_id, model }),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to generate Ship 30 essay');
    }
    return res.json();
  },

  async verifyGrounding(essayText) {
    const res = await fetch(`${API_BASE}/verify-grounding`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ essay_text: essayText }),
    });
    if (!res.ok) throw new Error('Failed to verify grounding');
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
    const res = await fetch(`${API_BASE}/artifacts`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch artifacts');
    return res.json();
  },

  async createArtifact({ title, artifact_type = "markdown", content, session_id = null, meta = {} }) {
    const res = await fetch(`${API_BASE}/artifacts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ title, artifact_type, content, session_id, meta }),
    });
    if (!res.ok) throw new Error('Failed to create artifact');
    return res.json();
  },

  async deleteArtifact(artifactId) {
    const res = await fetch(`${API_BASE}/artifacts/${artifactId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete artifact');
    return res.json();
  },

  // --- Transcripts & Sources Knowledge Base ---
  async getSources(query = "") {
    const url = query ? `${API_BASE}/sources?query=${encodeURIComponent(query)}` : `${API_BASE}/sources`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch sources');
    return res.json();
  },

  async getEpisodeDetail(episodeId) {
    const res = await fetch(`${API_BASE}/sources/${episodeId}`);
    if (!res.ok) throw new Error('Failed to fetch episode details');
    return res.json();
  },

  // --- Differentiating Intelligence Engines ---
  async challengeAdvice(topic, claim = "") {
    const res = await fetch(`${API_BASE}/challenge`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ topic, claim }),
    });
    if (!res.ok) throw new Error('Failed to challenge advice');
    return res.json();
  },

  async applyContext(contextData) {
    const res = await fetch(`${API_BASE}/apply-context`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(contextData),
    });
    if (!res.ok) throw new Error('Failed to apply context');
    return res.json();
  },

  async generateDecisionMemo(decisionQuestion, options = [], constraints = "") {
    const res = await fetch(`${API_BASE}/decisions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        decision_question: decisionQuestion,
        options,
        constraints
      }),
    });
    if (!res.ok) throw new Error('Failed to generate decision memo');
    return res.json();
  },

  async generateExperimentBrief(problem, primaryMetric = "Activation Rate", hypothesis = "") {
    const res = await fetch(`${API_BASE}/experiments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        problem,
        primary_metric: primaryMetric,
        hypothesis
      }),
    });
    if (!res.ok) throw new Error('Failed to generate experiment brief');
    return res.json();
  },

  async buildFramework(concept) {
    const res = await fetch(`${API_BASE}/frameworks`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ concept }),
    });
    if (!res.ok) throw new Error('Failed to build framework');
    return res.json();
  },

  async compareGuests(topic, guestNames = null) {
    const res = await fetch(`${API_BASE}/compare-guests`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ topic, guest_names: guestNames }),
    });
    if (!res.ok) throw new Error('Failed to compare guests');
    return res.json();
  },

  async getKnowledgeGraph() {
    const res = await fetch(`${API_BASE}/knowledge-graph`);
    if (!res.ok) throw new Error('Failed to fetch knowledge graph');
    return res.json();
  },

  async calculatePMFDiagnostic(signals) {
    const res = await fetch(`${API_BASE}/pmf-diagnostic`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(signals),
    });
    if (!res.ok) throw new Error('Failed to run PMF diagnostic');
    return res.json();
  }
};
