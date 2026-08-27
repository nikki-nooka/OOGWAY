import React, { useState, useEffect } from 'react';
import { 
  User, 
  Sparkles, 
  Target, 
  Sliders, 
  Layers, 
  FileCode, 
  Lock, 
  ShieldCheck, 
  ArrowRight, 
  Edit3, 
  Plus, 
  X, 
  Check, 
  Compass, 
  BookOpen, 
  PenTool, 
  Clock, 
  ChevronRight, 
  RefreshCw,
  ExternalLink,
  Zap,
  Award
} from 'lucide-react';
import { api } from '../services/api';

export default function ProfileWorkspace({
  currentUser,
  onUpdateUser,
  onStartChat,
  onOpenArtifact,
  onExploreTopic,
  onOpenWritingStudio,
  onOpenAuth
}) {
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [workspaceData, setWorkspaceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTab, setEditTab] = useState('identity');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Edit form state
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    industry: '',
    experience_level: '',
    location: '',
    tagline: '',
    interests: [],
    focus_goal: '',
    focus_metric: '',
    focus_challenge: '',
    focus_progress: 65,
    privacy_use_context: true,
    privacy_personalize_explore: true,
    privacy_use_history: false,
    newTopicInput: ''
  });

  useEffect(() => {
    if (currentUser) {
      loadWorkspace();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const loadWorkspace = async () => {
    setLoading(true);
    try {
      const summary = await api.getWorkspaceSummary();
      setWorkspaceData(summary);
      if (summary.user) {
        setFormData({
          name: summary.user.name || '',
          role: summary.user.role || 'Product Builder',
          company: summary.user.company || '',
          industry: summary.user.industry || 'B2B SaaS',
          experience_level: summary.user.experience_level || 'Senior',
          location: summary.user.location || '',
          tagline: summary.user.tagline || 'Exploring growth, product strategy, and AI-powered products.',
          interests: summary.user.interests || ['Product Strategy', 'Growth', 'Retention', 'PMF', 'AI'],
          focus_goal: summary.user.focus_goal || 'Improve activation and time-to-value',
          focus_metric: summary.user.focus_metric || 'Activation Rate',
          focus_challenge: summary.user.focus_challenge || 'Users are signing up but dropping off before reaching their primary Aha! milestone.',
          focus_progress: summary.user.focus_progress ?? 65,
          privacy_use_context: summary.user.privacy_use_context ?? true,
          privacy_personalize_explore: summary.user.privacy_personalize_explore ?? true,
          privacy_use_history: summary.user.privacy_use_history ?? false,
          newTopicInput: ''
        });
      }
    } catch (err) {
      console.error("Error loading workspace summary:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const { newTopicInput, ...payload } = formData;
      const updatedUser = await api.updateProfile(payload);
      if (onUpdateUser) onUpdateUser(updatedUser);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setIsEditModalOpen(false);
      }, 1000);
      await loadWorkspace();
    } catch (err) {
      console.error("Error updating profile:", err);
      alert(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePrivacy = async (key) => {
    const newVal = !formData[key];
    setFormData(prev => ({ ...prev, [key]: newVal }));
    try {
      const updatedUser = await api.updateProfile({ [key]: newVal });
      if (onUpdateUser) onUpdateUser(updatedUser);
      setWorkspaceData(prev => prev ? { ...prev, user: updatedUser } : prev);
    } catch (err) {
      console.error("Error updating privacy setting:", err);
    }
  };

  const handleAddInterest = () => {
    if (!formData.newTopicInput.trim()) return;
    const cleanTopic = formData.newTopicInput.trim();
    if (!formData.interests.includes(cleanTopic)) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, cleanTopic],
        newTopicInput: ''
      }));
    }
  };

  const handleRemoveInterest = (topic) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(t => t !== topic)
    }));
  };

  // If not logged in, show elegant editorial sign-in banner
  if (!currentUser) {
    return (
      <div className="container-page" style={{ paddingTop: '3rem', paddingBottom: '5rem', maxWidth: '800px', margin: '0 auto' }}>
        <div className="card-editorial" style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            border: '2px solid var(--border-subtle)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            background: 'var(--bg-secondary)',
            fontFamily: 'var(--font-serif)',
            fontSize: '1.8rem',
            color: 'var(--accent-primary)',
            fontWeight: 700
          }}>
            L
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
            Personal Product Thinking Headquarters
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '540px', margin: '0 auto 2rem', fontSize: '1rem', lineHeight: 1.6 }}>
            Sign in to unlock your private workspace. Keep track of what you're working on, your personal context, saved thinking, decisions, experiment briefs, and custom knowledge DNA.
          </p>
          <button 
            onClick={onOpenAuth}
            className="btn btn-primary"
            style={{ padding: '10px 24px', fontSize: '0.95rem' }}
          >
            <User size={16} />
            <span>Sign In or Create Private Workspace</span>
          </button>
        </div>
      </div>
    );
  }

  const user = workspaceData?.user || currentUser;
  const stats = workspaceData?.stats || {
    total_sessions: 0,
    total_messages: 0,
    total_artifacts: 0,
    total_decisions: 0,
    total_experiments: 0,
    total_frameworks: 0,
    total_essays: 0,
    explored_episodes_count: 0
  };
  const dna = workspaceData?.knowledge_dna || [];
  const timeline = workspaceData?.recent_thinking || [];
  const recommendations = workspaceData?.recommendations || [];
  const completeness = workspaceData?.profile_completeness ?? 80;

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="container-page" style={{ paddingTop: '2rem', paddingBottom: '6rem', maxWidth: '1140px', margin: '0 auto' }}>
      
      {/* SECTION 1: EDITORIAL HERO */}
      <section className="card-editorial" style={{ padding: '2.5rem', marginBottom: '2rem', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', gap: '1.75rem', alignItems: 'flex-start', flex: 1, minWidth: '280px' }}>
            {/* Distinctive Editorial Monogram Avatar */}
            <div style={{
              width: '84px',
              height: '84px',
              backgroundColor: 'var(--bg-secondary)',
              border: '2px solid var(--border-medium)',
              borderRadius: '10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <span style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '2.4rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                lineHeight: 1
              }}>
                {getInitials(user.name)[0]}
              </span>
              <div style={{
                width: '28px',
                height: '2px',
                backgroundColor: 'var(--accent-primary)',
                marginTop: '4px'
              }} />
            </div>

            {/* User Identity Details */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: '0.72rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: 700,
                  color: 'var(--accent-primary)',
                  background: 'var(--bg-secondary)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  border: '1px solid var(--border-subtle)'
                }}>
                  Personal Workspace
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  🔒 Private & Encrypted
                </span>
              </div>

              <h1 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '2.4rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                margin: '0.35rem 0 0.2rem',
                letterSpacing: '-0.02em',
                lineHeight: 1.15
              }}>
                {user.name.toUpperCase()}
              </h1>

              <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                {user.role || 'Product Builder'} {user.company ? `· ${user.company}` : ''} {user.industry ? `· ${user.industry}` : ''}
              </div>

              <p style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                color: 'var(--text-secondary)',
                fontSize: '1.05rem',
                margin: '0 0 1rem',
                maxWidth: '650px',
                lineHeight: 1.45
              }}>
                "{user.tagline || 'Exploring growth, product strategy, and AI-powered products.'}"
              </p>

              {/* Interests & Topic Chips */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginRight: '4px' }}>
                  My Topics:
                </span>
                {(user.interests || ['Product Strategy', 'Growth', 'Retention', 'PMF', 'AI']).map((topic, i) => (
                  <button
                    key={i}
                    onClick={() => onExploreTopic && onExploreTopic(topic.toLowerCase())}
                    className="tag-category"
                    style={{
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                      padding: '3px 9px',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-medium)',
                      color: 'var(--text-primary)',
                      borderRadius: '4px'
                    }}
                    title={`Explore ${topic} in Magazine`}
                  >
                    {topic}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setEditTab('interests');
                    setIsEditModalOpen(true);
                  }}
                  className="btn btn-ghost"
                  style={{ padding: '2px 8px', fontSize: '0.75rem', borderRadius: '4px' }}
                >
                  <Plus size={12} />
                  <span>Edit Topics</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '160px' }}>
            <button
              onClick={() => {
                setEditTab('identity');
                setIsEditModalOpen(true);
              }}
              className="btn btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Edit3 size={14} />
              <span>Edit Profile</span>
            </button>

            <button
              onClick={() => onStartChat && onStartChat(`Using my context (${user.focus_goal}), what are the highest-leverage steps to achieve this?`)}
              className="btn btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Zap size={14} />
              <span>Ask with Context</span>
            </button>
          </div>
        </div>

        {/* Profile Completeness Guidance Bar */}
        {completeness < 100 && (
          <div style={{
            marginTop: '1.75rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Profile Completeness: {completeness}%
              </div>
              <div style={{
                width: '120px',
                height: '6px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '3px',
                overflow: 'hidden',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{
                  width: `${completeness}%`,
                  height: '100%',
                  backgroundColor: 'var(--accent-primary)',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Complete your focus & metrics to refine personalized recommendations.
            </div>
            <button
              onClick={() => {
                setEditTab('focus');
                setIsEditModalOpen(true);
              }}
              className="btn btn-ghost"
              style={{ padding: '3px 8px', fontSize: '0.75rem', textDecoration: 'underline' }}
            >
              Update Focus
            </button>
          </div>
        )}
      </section>

      {/* SECTION 2: PRODUCT THINKING FLOW HORIZONTAL VISUALIZATION */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          background: 'var(--bg-secondary)',
          padding: '1.25rem',
          borderRadius: '8px',
          border: '1px solid var(--border-medium)'
        }}>
          <div style={{ padding: '0.5rem' }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>
              1. Discovery
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-serif)', color: 'var(--accent-primary)', marginTop: '2px' }}>
              {stats.explored_episodes_count || 0}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Episodes Explored</div>
          </div>

          <div style={{ padding: '0.5rem', borderLeft: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>
              2. Discussions
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', marginTop: '2px' }}>
              {stats.total_sessions || 0}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Research Sessions</div>
          </div>

          <div style={{ padding: '0.5rem', borderLeft: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>
              3. Decisions
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-serif)', color: 'var(--accent-secondary)', marginTop: '2px' }}>
              {stats.total_decisions || 0}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Strategic Memos</div>
          </div>

          <div style={{ padding: '0.5rem', borderLeft: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>
              4. Experiments
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-serif)', color: 'var(--status-warning)', marginTop: '2px' }}>
              {stats.total_experiments || 0}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Hypothesis Briefs</div>
          </div>

          <div style={{ padding: '0.5rem', borderLeft: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>
              5. Work Shipped
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-serif)', color: 'var(--status-success)', marginTop: '2px' }}>
              {stats.total_artifacts || 0}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Artifacts & Essays</div>
          </div>
        </div>
      </section>

      {/* SECTION 3: WORKSPACE SUBNAVIGATION */}
      <nav style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '2px solid var(--border-subtle)',
        marginBottom: '2rem',
        overflowX: 'auto',
        paddingBottom: '2px'
      }}>
        {[
          { id: 'overview', label: 'Overview & Focus', icon: Target },
          { id: 'dna', label: 'Knowledge DNA', icon: Sparkles },
          { id: 'work', label: `My Work (${stats.total_artifacts})`, icon: FileCode },
          { id: 'timeline', label: 'Thinking Timeline', icon: Clock },
          { id: 'privacy', label: 'Privacy & Security', icon: Lock }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent',
                color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.9rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* SUBTAB 1: OVERVIEW & CURRENT FOCUS */}
      {activeSubTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          
          {/* Signature Component: Current Focus Card */}
          <div className="card-editorial" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Target size={16} color="var(--accent-primary)" />
                <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 700, margin: 0 }}>
                  Current Focus
                </h3>
              </div>
              <button
                onClick={() => {
                  setEditTab('focus');
                  setIsEditModalOpen(true);
                }}
                className="btn btn-ghost"
                style={{ padding: '2px 6px', fontSize: '0.75rem' }}
              >
                <Edit3 size={12} />
                <span>Edit</span>
              </button>
            </div>

            <div style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.35rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              lineHeight: 1.3,
              marginBottom: '1.25rem'
            }}>
              {user.focus_goal || 'Improve activation for our new B2B product'}
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Goal Progress</span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{user.focus_progress ?? 65}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                <div style={{ width: `${user.focus_progress ?? 65}%`, height: '100%', backgroundColor: 'var(--accent-primary)' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Primary Metric</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                  {user.focus_metric || 'Activation Rate'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>Company Scale</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                  {workspaceData?.context?.users_scale || '10,000 MAU'}
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              <strong style={{ color: 'var(--text-primary)' }}>Bottleneck: </strong>
              {user.focus_challenge || 'Users are signing up but dropping off before experiencing first value.'}
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => onStartChat && onStartChat(`How do best-in-class product leaders address: "${user.focus_challenge}"?`)}
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}
              >
                <Sparkles size={14} />
                <span>Search Evidence on Challenge</span>
              </button>
            </div>
          </div>

          {/* Right Column: Knowledge DNA Summary & Recommendations */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Knowledge DNA Quick Preview */}
            <div className="card-editorial" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 700, margin: 0 }}>
                  Knowledge DNA
                </h3>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Based on your activity
                </span>
              </div>

              {dna.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {dna.map((item, idx) => (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.topic}</span>
                        <span style={{ color: 'var(--text-secondary)' }}>{item.percentage}%</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${item.percentage}%`,
                          height: '100%',
                          backgroundColor: idx === 0 ? 'var(--accent-primary)' : idx === 1 ? 'var(--accent-secondary)' : 'var(--border-strong)'
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Start exploring podcast episodes or chatting to generate your Knowledge DNA.
                </div>
              )}
            </div>

            {/* Recommendations For You */}
            <div className="card-editorial" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 700, margin: '0 0 1rem' }}>
                Recommended for You
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {recommendations.slice(0, 2).map((rec, idx) => (
                  <div 
                    key={idx}
                    onClick={() => onStartChat && onStartChat(`Tell me about ${rec.title}`)}
                    style={{
                      padding: '10px 12px',
                      backgroundColor: 'var(--bg-secondary)',
                      borderRadius: '6px',
                      border: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      transition: 'border-color 0.15s ease'
                    }}
                    className="hover-card"
                  >
                    <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--accent-primary)', fontWeight: 700 }}>
                      {rec.type} · {rec.topic}
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)', margin: '2px 0' }}>
                      {rec.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {rec.reason}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SUBTAB 2: KNOWLEDGE DNA DETAILED */}
      {activeSubTab === 'dna' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card-editorial" style={{ padding: '2rem' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Your Knowledge DNA Distribution
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem', maxWidth: '640px' }}>
              This representation is computed purely from your explored transcripts, search queries, cited guest quotes, and saved artifacts.
            </p>

            {dna.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                {dna.map((item, idx) => (
                  <div key={idx} style={{
                    padding: '1.25rem',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-medium)'
                  }}>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                      Pillar #{idx + 1}
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', margin: '4px 0 8px' }}>
                      {item.topic}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Focus Weight</span>
                      <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{item.percentage}%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-app)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${item.percentage}%`, height: '100%', backgroundColor: 'var(--accent-primary)' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No activity data recorded yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 3: MY WORK & ARTIFACTS */}
      {activeSubTab === 'work' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', margin: 0, color: 'var(--text-primary)' }}>
              My Private Artifacts ({stats.total_artifacts})
            </h3>
            <button 
              onClick={onOpenWritingStudio}
              className="btn btn-primary" 
              style={{ fontSize: '0.85rem', padding: '6px 14px' }}
            >
              <PenTool size={14} />
              <span>Create New in Studio</span>
            </button>
          </div>

          {timeline.filter(t => t.type === 'artifact').length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {timeline.filter(t => t.type === 'artifact').map((art, idx) => (
                <div 
                  key={idx}
                  onClick={() => onOpenArtifact && onOpenArtifact({ id: art.id, title: art.title })}
                  className="card-editorial hover-card"
                  style={{ padding: '1.25rem', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      color: 'var(--accent-primary)',
                      background: 'var(--bg-secondary)',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      {art.category}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{art.date}</span>
                  </div>

                  <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '1rem', lineHeight: 1.3 }}>
                    {art.title}
                  </div>

                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                    <span>Open in Artifact Viewer</span>
                    <ExternalLink size={12} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card-editorial" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <FileCode size={32} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <div style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                No generated artifacts yet
              </div>
              <p style={{ fontSize: '0.85rem', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
                Ask Lenny to generate a Decision Memo, Experiment Brief, Framework Tree, or Ship 30 Essay.
              </p>
              <button onClick={onOpenWritingStudio} className="btn btn-secondary">
                Go to Writing Studio
              </button>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 4: THINKING TIMELINE */}
      {activeSubTab === 'timeline' && (
        <div className="card-editorial" style={{ padding: '2rem' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Chronological Thinking Record
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '2rem' }}>
            A tamper-proof chronological stream of your research questions, decisions, experiment briefs, and frameworks.
          </p>

          {timeline.length > 0 ? (
            <div style={{ position: 'relative', paddingLeft: '1.5rem', borderLeft: '2px solid var(--border-medium)' }}>
              {timeline.map((item, idx) => (
                <div key={idx} style={{ marginBottom: '1.75rem', position: 'relative' }}>
                  {/* Timeline Dot */}
                  <div style={{
                    position: 'absolute',
                    left: '-1.95rem',
                    top: '4px',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: item.type === 'artifact' ? 'var(--accent-primary)' : 'var(--accent-secondary)',
                    border: '2px solid var(--bg-app)'
                  }} />

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px' }}>
                    <span style={{ fontWeight: 700, textTransform: 'uppercase' }}>{item.date}</span>
                    <span>•</span>
                    <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{item.category}</span>
                  </div>

                  <div style={{
                    fontWeight: 600,
                    fontSize: '1rem',
                    color: 'var(--text-primary)',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    if (item.type === 'artifact' && onOpenArtifact) {
                      onOpenArtifact({ id: item.id, title: item.title });
                    }
                  }}
                  >
                    {item.title}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              Your thinking record will appear as you interact with the assistant.
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 5: PRIVACY & SECURITY CONTROLS */}
      {activeSubTab === 'privacy' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          
          {/* Privacy Toggles */}
          <div className="card-editorial" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 700, margin: '0 0 1.25rem' }}>
              Context Controls & Privacy
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    Use my workspace context in conversations
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Inject your current company metrics into reasoning
                  </div>
                </div>
                <button
                  onClick={() => handleTogglePrivacy('privacy_use_context')}
                  className={`btn ${formData.privacy_use_context ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ padding: '4px 12px', fontSize: '0.8rem' }}
                >
                  {formData.privacy_use_context ? 'ON' : 'OFF'}
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    Personalize Explore based on my topics
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Surface episodes and articles matching your interests
                  </div>
                </div>
                <button
                  onClick={() => handleTogglePrivacy('privacy_personalize_explore')}
                  className={`btn ${formData.privacy_personalize_explore ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ padding: '4px 12px', fontSize: '0.8rem' }}
                >
                  {formData.privacy_personalize_explore ? 'ON' : 'OFF'}
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    Use session memory for recommendations
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Analyze past questions to suggest next frameworks
                  </div>
                </div>
                <button
                  onClick={() => handleTogglePrivacy('privacy_use_history')}
                  className={`btn ${formData.privacy_use_history ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ padding: '4px 12px', fontSize: '0.8rem' }}
                >
                  {formData.privacy_use_history ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          </div>

          {/* Account Security Status */}
          <div className="card-editorial" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 700, margin: '0 0 1.25rem' }}>
              Account & Security Status
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Check size={16} color="var(--status-success)" />
                <span style={{ color: 'var(--text-primary)' }}><strong>Password Security:</strong> PBKDF2-HMAC-SHA256 (100k iterations)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Check size={16} color="var(--status-success)" />
                <span style={{ color: 'var(--text-primary)' }}><strong>Session Tokens:</strong> HMAC-SHA256 Cryptographically Signed</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Check size={16} color="var(--status-success)" />
                <span style={{ color: 'var(--text-primary)' }}><strong>Workspace Isolation:</strong> Enforced at FastAPI API boundary (403 Forbidden)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Check size={16} color="var(--status-success)" />
                <span style={{ color: 'var(--text-primary)' }}><strong>Artifact Sandboxing:</strong> Iframe strict isolation without top navigation</span>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Logged in as <strong>{user.email}</strong>
            </div>
          </div>

        </div>
      )}

      {/* EDIT PROFILE MODAL / DRAWER */}
      {isEditModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem'
        }}>
          <div className="card-editorial" style={{
            width: '100%',
            maxWidth: '680px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            position: 'relative',
            boxShadow: 'var(--shadow-xl)'
          }}>
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="btn btn-ghost"
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', padding: '6px' }}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
              <Edit3 size={20} color="var(--accent-primary)" />
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', margin: 0, color: 'var(--text-primary)' }}>
                Edit Personal Workspace
              </h2>
            </div>

            {/* Modal Tabs */}
            <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '1.5rem' }}>
              {['identity', 'focus', 'interests'].map((t) => (
                <button
                  key={t}
                  onClick={() => setEditTab(t)}
                  style={{
                    padding: '8px 14px',
                    background: 'none',
                    border: 'none',
                    borderBottom: editTab === t ? '2px solid var(--accent-primary)' : '2px solid transparent',
                    color: editTab === t ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontWeight: editTab === t ? 700 : 500,
                    fontSize: '0.85rem',
                    textTransform: 'capitalize',
                    cursor: 'pointer'
                  }}
                >
                  {t}
                </button>
              ))}
            </div>

            <form onSubmit={handleSaveProfile}>
              {/* TAB 1: IDENTITY */}
              {editTab === 'identity' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="input-editorial"
                        style={{ width: '100%', padding: '8px 12px' }}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        Professional Role
                      </label>
                      <input
                        type="text"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        placeholder="e.g. Lead Product Manager"
                        className="input-editorial"
                        style={{ width: '100%', padding: '8px 12px' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        Company / Organization
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="e.g. Acme Corp"
                        className="input-editorial"
                        style={{ width: '100%', padding: '8px 12px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        Industry Domain
                      </label>
                      <input
                        type="text"
                        value={formData.industry}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                        placeholder="e.g. B2B SaaS / FinTech"
                        className="input-editorial"
                        style={{ width: '100%', padding: '8px 12px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                        Personal Tagline
                      </label>
                      <span style={{ fontSize: '0.72rem', color: formData.tagline.length > 120 ? 'var(--status-warning)' : 'var(--text-muted)' }}>
                        {formData.tagline.length} / 120 chars
                      </span>
                    </div>
                    <input
                      type="text"
                      maxLength={140}
                      value={formData.tagline}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      placeholder="What are you currently exploring or building?"
                      className="input-editorial"
                      style={{ width: '100%', padding: '8px 12px' }}
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: CURRENT FOCUS */}
              {editTab === 'focus' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Primary Goal
                    </label>
                    <input
                      type="text"
                      value={formData.focus_goal}
                      onChange={(e) => setFormData({ ...formData, focus_goal: e.target.value })}
                      placeholder="e.g. Improve activation and time-to-value for B2B product"
                      className="input-editorial"
                      style={{ width: '100%', padding: '8px 12px' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        Primary Metric
                      </label>
                      <input
                        type="text"
                        value={formData.focus_metric}
                        onChange={(e) => setFormData({ ...formData, focus_metric: e.target.value })}
                        placeholder="e.g. Day 1 Activation Rate"
                        className="input-editorial"
                        style={{ width: '100%', padding: '8px 12px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        Progress ({formData.focus_progress}%)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={formData.focus_progress}
                        onChange={(e) => setFormData({ ...formData, focus_progress: parseInt(e.target.value, 10) })}
                        style={{ width: '100%', marginTop: '8px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Current Bottleneck / Challenge
                    </label>
                    <textarea
                      rows={3}
                      value={formData.focus_challenge}
                      onChange={(e) => setFormData({ ...formData, focus_challenge: e.target.value })}
                      placeholder="Describe what is blocking user progress or growth..."
                      className="input-editorial"
                      style={{ width: '100%', padding: '8px 12px', resize: 'vertical' }}
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: INTERESTS */}
              {editTab === 'interests' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    My Growth & Product Interests
                  </label>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', minHeight: '60px', padding: '10px', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px' }}>
                    {formData.interests.map((topic, idx) => (
                      <span
                        key={idx}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 10px',
                          backgroundColor: 'var(--bg-app)',
                          border: '1px solid var(--border-medium)',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          fontWeight: 600
                        }}
                      >
                        {topic}
                        <button
                          type="button"
                          onClick={() => handleRemoveInterest(topic)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                        >
                          <X size={12} color="var(--text-muted)" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={formData.newTopicInput}
                      onChange={(e) => setFormData({ ...formData, newTopicInput: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddInterest();
                        }
                      }}
                      placeholder="Add new topic (e.g., Pricing, Leadership)..."
                      className="input-editorial"
                      style={{ flex: 1, padding: '8px 12px' }}
                    />
                    <button
                      type="button"
                      onClick={handleAddInterest}
                      className="btn btn-secondary"
                    >
                      <Plus size={14} />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Modal Footer Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="btn btn-ghost"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary"
                  style={{ minWidth: '120px' }}
                >
                  {saveSuccess ? (
                    <>
                      <Check size={14} />
                      <span>Saved!</span>
                    </>
                  ) : saving ? (
                    'Saving...'
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
