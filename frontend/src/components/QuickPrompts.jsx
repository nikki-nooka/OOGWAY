import React from 'react';
import { Sparkles, PenTool, BarChart3, Rocket, Compass, Zap } from 'lucide-react';

export default function QuickPrompts({ onSelectPrompt }) {
  const prompts = [
    {
      icon: <Rocket size={16} color="#ec4899" />,
      category: "Product-Market Fit",
      title: "How to validate true PMF?",
      prompt: "Explain how to find and mathematically measure Product-Market Fit using Gustaf Alströmer's retention curves and Rahul Vohra's 40% Sean Ellis benchmark."
    },
    {
      icon: <PenTool size={16} color="#8b5cf6" />,
      category: "Ship 30 for 30 Skill",
      title: "Write a Ship 30 for 30 essay on PLG",
      prompt: "Write a comprehensive Ship 30 for 30 style essay (~1,250 words) on B2B Product-Led Growth and viral loops based on Elena Verna's frameworks."
    },
    {
      icon: <Zap size={16} color="#3b82f6" />,
      category: "Prioritization & Strategy",
      title: "Shreyas Doshi's LNO Framework",
      prompt: "Explain Shreyas Doshi's LNO (Leverage, Neutral, Overhead) Framework and High Agency mental models for Product Managers."
    },
    {
      icon: <BarChart3 size={16} color="#10b981" />,
      category: "Interactive Artifact",
      title: "Build PMF & Retention Calculator",
      prompt: "Generate an interactive Growth & Product-Market Fit Calculator tool in HTML/CSS based on Rahul Vohra and Gustaf Alströmer's metrics."
    },
    {
      icon: <Sparkles size={16} color="#f59e0b" />,
      category: "Product Craft",
      title: "Brian Chesky's 11-Star Experience",
      prompt: "How does Brian Chesky design 11-star experiences at Airbnb and how does Founder Mode change product velocity?"
    },
    {
      icon: <Compass size={16} color="#06b6d4" />,
      category: "Growth & Virality",
      title: "Nikita Bier on Viral App Loops",
      prompt: "What does Nikita Bier teach about building viral distribution loops, work-life balance, and consumer app growth?"
    }
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '30px 10px',
      maxWidth: '820px',
      margin: '0 auto',
      textAlign: 'center'
    }}>
      <div style={{
        width: '46px',
        height: '46px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        boxShadow: '0 4px 20px rgba(99, 102, 241, 0.45)',
        marginBottom: '14px'
      }}>
        <Sparkles size={22} />
      </div>

      <h1 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '6px', color: '#ffffff', letterSpacing: '-0.02em' }}>
        The Lenny Growth Assistant
      </h1>
      <p style={{ fontSize: '13.5px', color: '#94a3b8', maxWidth: '560px', marginBottom: '28px', lineHeight: 1.6 }}>
        Grounded AI intelligence built on <strong>4,380+ transcript chunks across 279 episodes</strong> from <em>Lenny's Podcast</em>.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '12px',
        width: '100%'
      }}>
        {prompts.map((p, idx) => (
          <div
            key={idx}
            onClick={() => onSelectPrompt(p.prompt)}
            style={{
              background: '#0f172a',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '14px',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#6366f1';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.25)';
              e.currentTarget.style.background = '#162032';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
              e.currentTarget.style.background = '#0f172a';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                padding: '5px',
                borderRadius: '6px',
                background: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {p.icon}
              </div>
              <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {p.category}
              </span>
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc', lineHeight: 1.35 }}>
              {p.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
