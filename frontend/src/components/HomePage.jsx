import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Compass, 
  PenTool, 
  Layers, 
  TrendingUp, 
  ShieldCheck, 
  BookOpen, 
  CheckCircle2 
} from 'lucide-react';

export default function HomePage({ 
  onStartChat, 
  onExploreTopic, 
  onOpenWritingStudio, 
  onOpenEpisode 
}) {
  return (
    <div className="home-container">
      {/* Editorial Masthead */}
      <section className="home-masthead">
        <div className="masthead-eyebrow">
          The Lenny Growth Intelligence Platform • Verified Transcripts
        </div>
        <h1 className="masthead-title">
          Think Better. Ship Better.
        </h1>
        <p className="masthead-subtitle">
          Explore frameworks from 279+ episodes of Lenny’s Podcast, ask strictly grounded questions with audio citations, and turn product knowledge into executive-ready work.
        </p>
        <div className="masthead-actions">
          <button 
            className="btn btn-primary" 
            onClick={() => onStartChat("How do top founders know when they have achieved Product-Market Fit?")}
            style={{ padding: '10px 22px', fontSize: '14.5px' }}
          >
            <Sparkles size={16} />
            <span>Start a conversation</span>
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => onExploreTopic("pmf")}
            style={{ padding: '10px 22px', fontSize: '14.5px' }}
          >
            <Compass size={16} />
            <span>Explore the knowledge</span>
          </button>
        </div>
      </section>

      {/* Featured Lead Magazine Section */}
      <section className="featured-magazine-grid">
        {/* Main Lead Story */}
        <div className="lead-article-card">
          <div>
            <div className="lead-header">
              <span className="tag-category tag-brown">Featured Playbook</span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Grounded in 3 Episodes</span>
            </div>

            <h2 className="lead-title">
              THE PMF PLAYBOOK: How Great Products Discover What People Truly Need
            </h2>

            <p className="lead-excerpt">
              Product-Market Fit is not a subjective feeling—it is measurable through flat cohort retention curves, viral pull, and Sean Ellis’s 40% benchmark. Explore how Gustaf Alströmer, Rahul Vohra, and Casey Winters define the boundary between early noise and sustainable scale.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              padding: '16px',
              backgroundColor: 'var(--bg-app)',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--border-medium)',
              marginBottom: '24px'
            }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Key Benchmark</div>
                <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--accent-primary)' }}>40% Ellis Test</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Primary Signal</div>
                <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--accent-secondary)' }}>Flattening Curve</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Leading Factor</div>
                <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>Natural Pull</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className="btn btn-primary"
              onClick={() => onStartChat("What does Gustaf Alströmer say about product-market fit and retention curves?")}
            >
              <span>Ask Lenny about PMF</span>
              <ArrowRight size={14} />
            </button>
            <button 
              className="btn btn-editorial-outline"
              onClick={() => onExploreTopic("pmf")}
            >
              <span>View Evidence</span>
            </button>
          </div>
        </div>

        {/* 3 Supporting Editorial Cards */}
        <div className="supporting-articles-stack">
          {/* Card 1: Elena Verna */}
          <div 
            className="supporting-card"
            onClick={() => onStartChat("How does Elena Verna design B2B viral loops and product-led growth engines?")}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="tag-category tag-green">Growth & PLG</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Elena Verna</span>
            </div>
            <h3 className="supporting-title">
              B2B Product-Led Growth & Self-Serve Loops
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Transitioning from top-of-funnel noise to self-sustaining customer acquisition loops.
            </p>
            <div className="supporting-meta">
              <span>Episode #84</span>
              <span>•</span>
              <span>12 Citations</span>
            </div>
          </div>

          {/* Card 2: Brian Chesky */}
          <div 
            className="supporting-card"
            onClick={() => onStartChat("What is Brian Chesky's 11-star product experience framework and how do you design unscalable delight?")}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="tag-category tag-gold">Product Craft</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Brian Chesky</span>
            </div>
            <h3 className="supporting-title">
              The 11-Star Product Experience & Emotional Design
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              How Airbnb maps extreme customer journeys to design unforgettable product moments.
            </p>
            <div className="supporting-meta">
              <span>Episode #112</span>
              <span>•</span>
              <span>8 Citations</span>
            </div>
          </div>

          {/* Card 3: Shreyas Doshi */}
          <div 
            className="supporting-card"
            onClick={() => onStartChat("Explain Shreyas Doshi's LNO framework and how high-agency PMs allocate energy.")}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="tag-category tag-brown">Execution & Craft</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Shreyas Doshi</span>
            </div>
            <h3 className="supporting-title">
              The LNO Framework for High-Agency PMs
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Categorizing work into Leverage, Neutral, and Overhead to unlock 10x strategic output.
            </p>
            <div className="supporting-meta">
              <span>Episode #03</span>
              <span>•</span>
              <span>15 Citations</span>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Topics Navigation Strip */}
      <section className="popular-topics-section">
        <span className="section-label">Explore by Topic & Mental Model</span>
        <div className="topics-pill-grid">
          {[
            { id: 'pmf', label: 'Product-Market Fit' },
            { id: 'growth-loops', label: 'B2B Growth Loops' },
            { id: 'product-craft', label: '11-Star Craft' },
            { id: 'agency-leadership', label: 'High Agency & LNO' },
            { id: 'positioning', label: 'Positioning (April Dunford)' },
            { id: 'consumer-growth', label: 'Viral Consumer Apps' },
            { id: 'pricing', label: 'SaaS Monetization' },
            { id: 'onboarding', label: 'Activation & Onboarding' }
          ].map(t => (
            <button 
              key={t.id}
              className="topic-pill"
              onClick={() => onExploreTopic(t.id)}
            >
              <TrendingUp size={13} color="var(--accent-primary)" />
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Capabilities Overview: Grounding, Writing Studio, Artifacts */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
        marginTop: '16px'
      }}>
        {/* Capability 1: Grounded Q&A */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-sm)',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div className="brand-badge" style={{ width: '28px', height: '28px', fontSize: '14px' }}>
              <ShieldCheck size={16} />
            </div>
            <h3 style={{ fontFamily: 'var(--text-serif-display)', fontSize: '18px' }}>
              Zero-Hallucination Grounding
            </h3>
          </div>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Every statement is backed by verbatim transcript quotations, speaker IDs, and timestamped audio links. Out-of-domain queries are transparently refused.
          </p>
        </div>

        {/* Capability 2: Ship 30 Writing Studio */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-sm)',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div className="brand-badge" style={{ width: '28px', height: '28px', fontSize: '14px', backgroundColor: 'var(--accent-primary)' }}>
              <PenTool size={16} />
            </div>
            <h3 style={{ fontFamily: 'var(--text-serif-display)', fontSize: '18px' }}>
              Ship 30 for 30 Writing Studio
            </h3>
          </div>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Transform research into ~1,250-word atomic essays featuring the 1-3-1 hook structure, modular H2 pillars, and crisp takeaways ready to publish.
          </p>
        </div>

        {/* Capability 3: Sandboxed Artifact Viewer */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-sm)',
          padding: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div className="brand-badge" style={{ width: '28px', height: '28px', fontSize: '14px', backgroundColor: 'var(--accent-secondary)' }}>
              <Layers size={16} />
            </div>
            <h3 style={{ fontFamily: 'var(--text-serif-display)', fontSize: '18px' }}>
              Sandboxed Interactive Artifacts
            </h3>
          </div>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Live Claude-style split-screen rendering for interactive HTML/CSS calculators, strategy canvases, and metrics dashboards with strict sandbox isolation.
          </p>
        </div>
      </section>
    </div>
  );
}
