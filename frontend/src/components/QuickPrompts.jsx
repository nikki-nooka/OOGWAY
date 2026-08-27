import React from 'react';
import { Sparkles, PenTool, BarChart3, Rocket, Compass, Zap, ArrowRight } from 'lucide-react';

export default function QuickPrompts({ onSelectPrompt }) {
  const prompts = [
    {
      category: "Product-Market Fit",
      title: "How do I know if I have PMF?",
      prompt: "How do top founders and operators validate true Product-Market Fit according to Gustaf Alströmer, Rahul Vohra, and Casey Winters?"
    },
    {
      category: "Growth & Virality",
      title: "What are common growth mistakes?",
      prompt: "What are the most common growth and retention mistakes in early-stage startups according to Lenny's guests?"
    },
    {
      category: "Activation & Onboarding",
      title: "How should I design onboarding?",
      prompt: "What does Lenny's content suggest about user activation, time-to-value, and designing onboarding funnels?"
    },
    {
      category: "Ship 30 for 30 Skill",
      title: "Turn Lenny's ideas into an essay",
      prompt: "Write a comprehensive Ship 30 for 30 style essay (~1,250 words) on B2B Product-Led Growth based on Elena Verna."
    },
    {
      category: "Execution & Prioritization",
      title: "Explain Shreyas Doshi's LNO Framework",
      prompt: "Explain Shreyas Doshi's LNO (Leverage, Neutral, Overhead) framework and High Agency mental models."
    },
    {
      category: "Interactive Artifact",
      title: "Build an interactive PMF calculator",
      prompt: "Generate an interactive Growth and Product-Market Fit retention calculator in HTML and CSS."
    }
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 10px',
      maxWidth: '780px',
      margin: '0 auto',
      textAlign: 'center'
    }}>
      <span className="tag-category tag-brown" style={{ marginBottom: '12px' }}>
        Conversational Research Workspace
      </span>

      <h1 className="font-display" style={{ fontSize: '32px', marginBottom: '8px', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
        What are you working on?
      </h1>
      <p style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '540px', marginBottom: '32px', lineHeight: 1.6 }}>
        Ask about product, growth, retention, or pricing. Answers are strictly grounded in 4,380+ podcast transcript chunks.
      </p>

      <div style={{ width: '100%', textAlign: 'left', marginBottom: '12px' }}>
        <span className="section-label" style={{ marginBottom: '10px' }}>Try Asking</span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '12px',
        width: '100%'
      }}>
        {prompts.map((p, idx) => (
          <div
            key={idx}
            onClick={() => onSelectPrompt(p.prompt)}
            className="supporting-card"
            style={{ padding: '14px 16px', textAlign: 'left' }}
          >
            <span className="tag-category tag-brown" style={{ fontSize: '10px', alignSelf: 'flex-start' }}>
              {p.category}
            </span>
            <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.35 }}>
              {p.title}
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '4px' }}>
              <span>Ask Lenny</span>
              <ArrowRight size={11} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
