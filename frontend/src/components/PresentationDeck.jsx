import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Layers, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  ShieldCheck, 
  Compass, 
  PenTool, 
  FileCode, 
  Cpu, 
  Database,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

const SLIDES = [
  {
    number: 1,
    eyebrow: "Product Presentation • Release 1.0",
    title: "The Lenny Growth Assistant",
    subtitle: "Think Better. Ship Better.",
    content: (
      <div>
        <p style={{ fontSize: '18px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
          An AI-powered product and growth intelligence workspace that transforms Lenny’s podcast and newsletter knowledge into an intelligent digital magazine, conversational research assistant, and executive writing engine.
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          padding: '20px',
          backgroundColor: 'var(--bg-app)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-medium)'
        }}>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Knowledge Base</div>
            <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--accent-primary)' }}>4,380+ Chunks / 279 Eps</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Core Paradigm</div>
            <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--accent-secondary)' }}>Editorial Intelligence</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Key Capability</div>
            <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>Ship 30 & Sandboxed HTML</div>
          </div>
        </div>
      </div>
    ),
    notes: "Welcome evaluators. Today we are presenting The Lenny Growth Assistant, built to turn podcast wisdom into actionable executive output."
  },
  {
    number: 2,
    eyebrow: "The Problem",
    title: "Scattered Knowledge vs. Actionable Execution",
    subtitle: "Hundreds of hours of podcast audio with no practical bridge to product decisions.",
    content: (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div style={{ padding: '20px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)' }}>
          <h4 style={{ color: 'var(--status-danger)', marginBottom: '10px', fontSize: '15px' }}>Current Failure Modes:</h4>
          <ul style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--text-secondary)', paddingLeft: '20px' }}>
            <li>Hundreds of hours of unindexed audio making tactical retrieval painful.</li>
            <li>Generic LLMs hallucinating false PM benchmarks and invented metrics.</li>
            <li>Static chat bubbles failing to render interactive calculators and tools.</li>
            <li>Hours spent converting conversational thoughts into publishable essays.</li>
          </ul>
        </div>
        <div style={{ padding: '20px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)' }}>
          <h4 style={{ color: 'var(--accent-secondary)', marginBottom: '10px', fontSize: '15px' }}>The Solution Needed:</h4>
          <ul style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--text-secondary)', paddingLeft: '20px' }}>
            <li>Strict grounding on transcript chunks with exact timestamps.</li>
            <li>An editorial environment that feels like a prestigious digital publication.</li>
            <li>Dedicated writing skills (Ship 30 for 30) for ~1,250-word atomic essays.</li>
            <li>Side-by-side split screen for live sandboxed HTML/CSS widgets.</li>
          </ul>
        </div>
      </div>
    ),
    notes: "High-agency product managers need structured, grounded tools rather than a generic chat bubble."
  },
  {
    number: 3,
    eyebrow: "The Solution",
    title: "Editorial Intelligence + Grounded AI Assistant",
    subtitle: "A unified knowledge environment built for product thinkers.",
    content: (
      <div>
        <p style={{ fontSize: '16px', lineHeight: 1.6, marginBottom: '20px' }}>
          We designed the product to feel less like <em>“Ask an AI anything”</em> and more like <strong>“Explore the ideas, evidence, and frameworks behind great product thinking.”</strong>
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div style={{ padding: '16px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-xs)' }}>
            <span className="tag-category tag-brown" style={{ marginBottom: '8px' }}>Editorial Hub</span>
            <div style={{ fontWeight: 600, fontSize: '14px', margin: '6px 0' }}>Magazine Exploration</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Discover curated playbooks, frameworks, and guest deep-dives.</div>
          </div>
          <div style={{ padding: '16px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-xs)' }}>
            <span className="tag-category tag-green" style={{ marginBottom: '8px' }}>Research Assistant</span>
            <div style={{ fontWeight: 600, fontSize: '14px', margin: '6px 0' }}>Grounded Q&A</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Answers structured into Lenny's Perspective, Key Signals, and Evidence.</div>
          </div>
          <div style={{ padding: '16px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-xs)' }}>
            <span className="tag-category tag-gold" style={{ marginBottom: '8px' }}>Output Engine</span>
            <div style={{ fontWeight: 600, fontSize: '14px', margin: '6px 0' }}>Writing & Artifacts</div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Ship 30 essays, product memos, and live HTML growth calculators.</div>
          </div>
        </div>
      </div>
    ),
    notes: "The magazine aesthetic is not merely decorative; it creates a knowledge sanctuary."
  },
  {
    number: 4,
    eyebrow: "Product Experience",
    title: "The 5-Stage Core Journey",
    subtitle: "From passive discovery to concrete output and shipping.",
    content: (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 16px',
        backgroundColor: 'var(--bg-app)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-medium)'
      }}>
        {[
          { step: '1. Discover', desc: 'Browse magazine articles & topic playbooks' },
          { step: '2. Ask', desc: 'Query tactical PM/Growth questions' },
          { step: '3. Evidence', desc: 'Inspect verbatim transcript chunks & timestamps' },
          { step: '4. Create', desc: 'Synthesize Ship 30 essays or HTML calculators' },
          { step: '5. Ship', desc: 'Preview, sanitize, and save to Artifact Library' }
        ].map((s, idx) => (
          <React.Fragment key={idx}>
            <div style={{ textAlign: 'center', flex: 1, padding: '0 8px' }}>
              <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--accent-primary)', marginBottom: '4px' }}>{s.step}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{s.desc}</div>
            </div>
            {idx < 4 && <ArrowRight size={16} color="var(--border-dark)" style={{ flexShrink: 0 }} />}
          </React.Fragment>
        ))}
      </div>
    ),
    notes: "Every user interaction moves from knowledge to action."
  },
  {
    number: 5,
    eyebrow: "Design Direction",
    title: "Warm Editorial Intelligence",
    subtitle: "Magazine aesthetics meeting modern SaaS ergonomics.",
    content: (
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        <div>
          <h4 style={{ fontSize: '14px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: 700 }}>
            Visual Tokens & Typography:
          </h4>
          <ul style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.7, paddingLeft: '18px' }}>
            <li><strong>Display Typography:</strong> DM Serif Display & Playfair Display for editorial authority.</li>
            <li><strong>UI Typography:</strong> Inter for high-legibility forms, chat, and metadata.</li>
            <li><strong>Warm Palette:</strong> Warm Cream (<code>#F5F2EA</code>), Saddle Brown (<code>#9A5B2E</code>), Forest Green (<code>#245D55</code>), Vintage Gold (<code>#D7A94B</code>).</li>
            <li><strong>Editorial Rules:</strong> Crisp 1px thin borders, category badges, tactile drop shadows.</li>
          </ul>
        </div>
        <div style={{
          backgroundColor: 'var(--bg-app)',
          padding: '16px',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Theme Switcher</div>
          <div style={{ fontWeight: 700, fontSize: '15px' }}>Dual-Theme Architecture</div>
          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
            Instant toggle between Warm Editorial Light and Editorial Dark (<code>#10100F</code>) for extended research stamina.
          </p>
        </div>
      </div>
    ),
    notes: "No giant cartoon robot icons or neon gradients. Clean, intellectual, trustworthy."
  },
  {
    number: 6,
    eyebrow: "Information Architecture",
    title: "Complete Navigation & Screen Map",
    subtitle: "Hierarchical organization supporting 20+ primary states.",
    content: (
      <div style={{
        fontFamily: 'var(--text-mono)',
        fontSize: '12px',
        backgroundColor: 'var(--bg-app)',
        padding: '18px 24px',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-sm)',
        lineHeight: 1.6,
        color: 'var(--text-primary)'
      }}>
        <div>HOME ➔ Editorial Magazine Masthead, Lead Feature Card, Supporting Stories, Topics Strip</div>
        <div>├── EXPLORE ➔ Topics Grid, Playbooks, Guest Index, Frameworks, Verbatim Quotes</div>
        <div>├── ASSISTANT ➔ 3-Column Conversational Workspace, Perspective Blocks, Evidence Badges</div>
        <div>├── WRITING STUDIO ➔ Ship 30 for 30 Generator (~1,250 words), Memo & Brief Templates</div>
        <div>├── ARTIFACTS ➔ Split-Screen Sandbox Viewer, Safe Preview Banner, Artifact Library Grid</div>
        <div>├── PRESENTATION ➔ 14-Slide Interactive Presentation Deck with Presenter Notes</div>
        <div>└── SOURCES & SETTINGS ➔ Episode Transcripts Index, Model Provider Switcher (Ollama/Cloud)</div>
      </div>
    ),
    notes: "Comprehensive information architecture covering all assignment requirements."
  },
  {
    number: 7,
    eyebrow: "User Journey",
    title: "Real-World Activation Scenario",
    subtitle: "From struggling with user drop-off to shipping an onboarding framework.",
    content: (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <div style={{ padding: '16px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-xs)' }}>
          <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--accent-primary)', marginBottom: '6px' }}>Step 1: Grounded Inquiry</div>
          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
            PM asks: <em>"What does Lenny's content suggest about activation and onboarding?"</em> System retrieves 4 chunks from Elena Verna & Shreyas Doshi.
          </p>
        </div>
        <div style={{ padding: '16px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-xs)' }}>
          <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--accent-secondary)', marginBottom: '6px' }}>Step 2: Ship 30 Synthesis</div>
          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
            PM triggers: <em>"Turn this into a Ship 30 essay."</em> The dedicated writing skill crafts ~1,250 words with a 1-3-1 hook and 3 modular H2 pillars.
          </p>
        </div>
        <div style={{ padding: '16px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-xs)' }}>
          <div style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--text-primary)', marginBottom: '6px' }}>Step 3: Interactive Sandbox</div>
          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
            PM requests an onboarding funnel calculator. The side-by-side artifact viewer opens with a sandboxed, live interactive HTML widget.
          </p>
        </div>
      </div>
    ),
    notes: "Demonstrates the complete end-to-end user value."
  },
  {
    number: 8,
    eyebrow: "System Architecture",
    title: "Three-Tier Decoupled Architecture",
    subtitle: "FastAPI Gateway, BM25 RAG Engine, Multi-Provider LLM Layer, and React SPA.",
    content: (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ padding: '16px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>Backend & RAG Stack:</h4>
          <ul style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, paddingLeft: '18px' }}>
            <li><strong>FastAPI 0.115+:</strong> Async endpoints for chat, writing, artifacts, sessions, and models.</li>
            <li><strong>BM25 Inverted Index:</strong> High-precision ranking ($k_1=1.5, b=0.75$) over 4,380+ chunks.</li>
            <li><strong>Dual Persistence:</strong> SQLAlchemy 2.0 with PostgreSQL + automated SQLite fallback.</li>
            <li><strong>Artifact Engine:</strong> Auto-extracts HTML/CSS blocks and applies security policy.</li>
          </ul>
        </div>
        <div style={{ padding: '16px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>Frontend & Isolation:</h4>
          <ul style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, paddingLeft: '18px' }}>
            <li><strong>React 18 + Vite:</strong> Instant HMR and high-performance rendering.</li>
            <li><strong>Claude-Style Split Screen:</strong> Side-by-side chat and interactive preview.</li>
            <li><strong>Iframe Sandbox:</strong> <code>sandbox="allow-scripts allow-forms allow-modals"</code>.</li>
            <li><strong>Zero Global State Leaks:</strong> Independent session context per conversation.</li>
          </ul>
        </div>
      </div>
    ),
    notes: "Robust, decoupled, and easy to run in any environment."
  },
  {
    number: 9,
    eyebrow: "Grounding & Traceability",
    title: "Zero-Hallucination RAG Engine",
    subtitle: "Strict factual grounding with audio timestamps and out-of-domain refusal.",
    content: (
      <div>
        <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '18px' }}>
          The assistant enforces strict citation integrity: every factual claim is grounded in transcript passages. If a user asks about an unsupported topic (e.g. rocket propulsion, cricket, cooking), the system politely explains that the knowledge base is constrained to product and growth.
        </p>
        <div style={{
          padding: '16px',
          backgroundColor: 'var(--bg-app)',
          borderLeft: '3px solid var(--accent-primary)',
          borderRadius: 'var(--radius-xs)',
          fontStyle: 'italic',
          fontSize: '13.5px',
          color: 'var(--text-primary)'
        }}>
          "Based on discussions across Lenny's Podcast, Gustaf Alströmer emphasizes that true Product-Market Fit reveals itself when cohort retention curves flatten out above zero..."
        </div>
      </div>
    ),
    notes: "Evaluators can verify that ungrounded queries are transparently refused."
  },
  {
    number: 10,
    eyebrow: "Agent Skills",
    title: "Dedicated Agent Routing & Skills",
    subtitle: "Separation of concerns between Q&A, Writing Studio, and Artifact generation.",
    content: (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <div style={{ padding: '16px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-xs)' }}>
          <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--accent-primary)' }}>1. Grounded Q&A</div>
          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '6px' }}>
            BM25 top-k retrieval, entity boosting, citation assembly, and out-of-domain detection.
          </p>
        </div>
        <div style={{ padding: '16px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-xs)' }}>
          <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--accent-secondary)' }}>2. Ship 30 Skill</div>
          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '6px' }}>
            1-3-1 hook cadence, 3-4 modular H2 pillars, bulleted frameworks, and ~1,250-word density.
          </p>
        </div>
        <div style={{ padding: '16px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-xs)' }}>
          <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>3. Artifact Engine</div>
          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '6px' }}>
            HTML/CSS extraction, XSS sanitization, sandbox envelope, and split-screen rendering.
          </p>
        </div>
      </div>
    ),
    notes: "Encodes distinct writing and tool-building principles in dedicated modules."
  },
  {
    number: 11,
    eyebrow: "Artifact Security",
    title: "Safe Sandbox & Isolation Strategy",
    subtitle: "Defense-in-depth for untrusted AI-generated HTML/CSS/JS.",
    content: (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ padding: '16px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)' }}>
          <h4 style={{ fontSize: '14px', color: 'var(--accent-primary)', marginBottom: '8px', fontWeight: 700 }}>Backend Sanitization:</h4>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            <code>ArtifactSecurityPolicy</code> strips DOM traversal exploits (<code>window.parent</code>, <code>window.top</code>) and browser storage access (<code>document.cookie</code>, <code>localStorage</code>).
          </p>
        </div>
        <div style={{ padding: '16px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)' }}>
          <h4 style={{ fontSize: '14px', color: 'var(--accent-secondary)', marginBottom: '8px', fontWeight: 700 }}>Frontend Iframe Sandbox:</h4>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Rendered inside an <code>iframe</code> with restricted sandbox flags. Omitting <code>allow-same-origin</code> completely isolates the host application.
          </p>
        </div>
      </div>
    ),
    notes: "Safe execution of interactive widgets without exposing the parent application."
  },
  {
    number: 12,
    eyebrow: "Model Flexibility",
    title: "Multi-Provider Model Layer",
    subtitle: "Seamless live switching between Local Ollama, Claude, OpenAI, and Offline Fallback.",
    content: (
      <div>
        <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '18px' }}>
          The application layer interacts exclusively with a unified <code>ModelProvider</code> interface. Users can toggle models in real time without restarting the server:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          <div style={{ padding: '12px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-xs)', textAlign: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: '13px' }}>Ollama (Local)</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>llama3.1 / llama3.2</div>
          </div>
          <div style={{ padding: '12px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-xs)', textAlign: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: '13px' }}>Claude 3.5</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Anthropic API</div>
          </div>
          <div style={{ padding: '12px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-xs)', textAlign: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: '13px' }}>GPT-4o</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>OpenAI API</div>
          </div>
          <div style={{ padding: '12px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-xs)', textAlign: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--accent-secondary)' }}>Offline Fallback</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Deterministic RAG</div>
          </div>
        </div>
      </div>
    ),
    notes: "Guarantees zero-failure evaluation even if cloud keys or Ollama daemons are unconfigured."
  },
  {
    number: 13,
    eyebrow: "Reliability & Testing",
    title: "Test Coverage & Resilience",
    subtitle: "Automated pytest test suite validating all killer test cases.",
    content: (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ padding: '16px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>Test Suites Verified:</h4>
          <ul style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.6, paddingLeft: '18px' }}>
            <li><strong>Suite A:</strong> Health, diagnostics, and transcript chunk counts.</li>
            <li><strong>Suite B/C:</strong> Independent session memory & DB persistence.</li>
            <li><strong>Suite D/E:</strong> Grounded citations & hallucination rejection.</li>
            <li><strong>Suite F/G:</strong> Ship 30 writing & model provider switching.</li>
            <li><strong>Suite H:</strong> Artifact XSS sanitization and isolation.</li>
          </ul>
        </div>
        <div style={{ padding: '16px', backgroundColor: 'var(--bg-app)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)' }}>
          <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px' }}>Observability & Metrics:</h4>
          <ul style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.6, paddingLeft: '18px' }}>
            <li>Latency tracking per generation (ms).</li>
            <li>Exact transcript chunk IDs attached to every response.</li>
            <li>Provider status API for live health probes.</li>
            <li>Zero 500 errors on offline fallback paths.</li>
          </ul>
        </div>
      </div>
    ),
    notes: "Every requirement is backed by rigorous automated verification."
  },
  {
    number: 14,
    eyebrow: "North Star",
    title: "Knowledge ➔ Understanding ➔ Action",
    subtitle: "The ultimate transformation for high-agency product teams.",
    content: (
      <div style={{ textAlign: 'center', padding: '24px 0' }}>
        <h3 className="font-display" style={{ fontSize: '26px', color: 'var(--accent-primary)', marginBottom: '16px' }}>
          "Think Better. Ship Better."
        </h3>
        <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '620px', margin: '0 auto 28px', lineHeight: 1.6 }}>
          The Lenny Growth Assistant embeds AI intelligence inside a digital magazine and research workspace, giving builders the power to explore frameworks, test ideas, and ship extraordinary products.
        </p>
        <div style={{ display: 'inline-flex', gap: '12px' }}>
          <span className="tag-category tag-brown" style={{ padding: '6px 14px', fontSize: '12px' }}>Grounded RAG</span>
          <span className="tag-category tag-green" style={{ padding: '6px 14px', fontSize: '12px' }}>Ship 30 for 30</span>
          <span className="tag-category tag-gold" style={{ padding: '6px 14px', fontSize: '12px' }}>Sandboxed Artifacts</span>
        </div>
      </div>
    ),
    notes: "Thank you for reviewing The Lenny Growth Assistant."
  }
];

export default function PresentationDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const slide = SLIDES[currentSlide];

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) setCurrentSlide(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentSlide > 0) setCurrentSlide(prev => prev - 1);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  return (
    <div className="deck-container">
      {/* Deck Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="tag-category tag-brown">
            Slide {slide.number} of {SLIDES.length}
          </span>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Use Left / Right arrow keys to navigate
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            className="btn btn-secondary"
            onClick={() => setShowNotes(prev => !prev)}
            style={{ fontSize: '12px', padding: '5px 10px' }}
          >
            <span>{showNotes ? 'Hide Speaker Notes' : 'Show Speaker Notes'}</span>
          </button>
        </div>
      </div>

      {/* Slide Canvas */}
      <div className="slide-viewport">
        <div>
          <div className="slide-eyebrow">{slide.eyebrow}</div>
          <h2 className="slide-title">{slide.title}</h2>
          {slide.subtitle && (
            <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginTop: '-14px', marginBottom: '28px' }}>
              {slide.subtitle}
            </p>
          )}

          <div className="slide-content-body">
            {slide.content}
          </div>
        </div>

        {/* Slide Footer Controls */}
        <div className="slide-footer-nav">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              className="btn btn-secondary" 
              onClick={handlePrev} 
              disabled={currentSlide === 0}
              style={{ padding: '6px 12px' }}
            >
              <ChevronLeft size={16} />
              <span>Previous</span>
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleNext} 
              disabled={currentSlide === SLIDES.length - 1}
              style={{ padding: '6px 16px' }}
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Progress Bar */}
          <div style={{
            flex: 1,
            maxWidth: '320px',
            height: '4px',
            backgroundColor: 'var(--border-subtle)',
            borderRadius: '2px',
            margin: '0 20px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${((currentSlide + 1) / SLIDES.length) * 100}%`,
              height: '100%',
              backgroundColor: 'var(--accent-primary)',
              transition: 'width 0.2s ease'
            }}></div>
          </div>

          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--text-mono)' }}>
            {slide.number} / {SLIDES.length}
          </span>
        </div>
      </div>

      {/* Speaker Notes Drawer */}
      {showNotes && (
        <div style={{
          marginTop: '20px',
          padding: '16px 20px',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '13.5px',
          color: 'var(--text-secondary)',
          lineHeight: 1.6
        }}>
          <strong style={{ color: 'var(--text-primary)' }}>🎙️ Speaker / Evaluator Notes: </strong>
          {slide.notes}
        </div>
      )}
    </div>
  );
}
