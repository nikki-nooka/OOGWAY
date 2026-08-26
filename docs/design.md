# UI/UX Design System & Experience Specification
## Project: The Lenny Growth Assistant
**Author:** Forward Deployed Engineering Lead  
**Document Version:** 1.0.0  

---

## 1. Design Philosophy & Aesthetic Guidelines

The Lenny Growth Assistant is designed around three fundamental product design pillars:
1. **Executive-Grade Luxury:** An Obsidian and Zinc dark-mode aesthetic with refined glassmorphic accents, tailored for high-agency product leaders and founders.
2. **Side-by-Side Spatial Ergonomics (Claude-Style):** Users should never have to toggle between tabs or copy-paste code to test an idea. When the assistant creates a growth tool or essay, it renders live in a side-by-side split screen.
3. **Transparent Grounding:** Every insight features interactive citation chips linking directly to verbatim audio timestamps and speaker context.

---

## 2. Design Tokens & Color Palette

### 2.1 Color Spectrum (Dark Theme Standard)

```css
:root {
  /* Surfaces */
  --bg-primary: #090d16;        /* Deep Obsidian */
  --bg-secondary: #0f172a;      /* Dark Slate */
  --bg-tertiary: #1e293b;       /* Elevated Surface */
  --bg-card: rgba(15, 23, 42, 0.75);

  /* Accents & Brand */
  --accent-primary: #6366f1;    /* Electric Indigo */
  --accent-secondary: #8b5cf6;  /* Vivid Purple */
  --accent-tertiary: #ec4899;   /* Hot Pink */
  --accent-gradient: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);

  /* Typography */
  --text-primary: #f8fafc;      /* Crisp White */
  --text-secondary: #94a3b8;    /* Muted Slate */
  --text-muted: #64748b;        /* Subtle Zinc */

  /* Status Tokens */
  --status-success: #10b981;    /* Emerald Green */
  --status-warning: #f59e0b;    /* Amber */
  --status-danger: #ef4444;     /* Crimson */
}
```

### 2.2 Typography Scale
- **Headings (`Outfit` / `Inter`):** Bold, high contrast, -0.02em letter spacing.
- **Body (`Inter`):** 14.5px font size with 1.65 line-height for optimal reading stamina.
- **Code & Metadata (`JetBrains Mono`):** Clean monospace for JSON, timestamps, and HTML/CSS snippets.

---

## 3. Information Architecture & Spatial Layout

```
+-----------------------------------------------------------------------------------------------+
| SIDEBAR (280px)      | CHAT VIEWPORT (50% or 100%)       | ARTIFACT VIEWER (50% Split)        |
|----------------------|-----------------------------------|------------------------------------|
| [⚡ Lenny Assistant] | Header: [Model Picker] [KB] [☀️]  | Header: [Preview] [Code] [Doc] [X] |
| [+ New Discussion]   |                                   |                                    |
| [Search Input]       | [User Message Bubble]             | +--------------------------------+ |
|                      |                                   | | <iframe sandbox="...">         | |
| Recent Chats:        | [Assistant Bubble + Markdown]     | |                                | |
| • PMF Retention      |   ├─ [Citation: Shreyas 14:20]    | | Interactive Growth Calculator  | |
| • Ship 30 PLG Essay  |   └─ [Artifact: PMF Tool ->]      | | Live Sliders & Real-Time Calc  | |
| • Chesky 11-Star     |                                   | |                                | |
|                      | --------------------------------- | +--------------------------------+ |
| Footer: [RAG Status] | Input: [Type question...] [Send]  | Footer: [Copy Code] [Download]     |
+-----------------------------------------------------------------------------------------------+
```

---

## 4. Key User Interaction States

### 4.1 Empty State (Zero-Data Discovery)
When launching a new discussion, the viewport presents **Quick Growth Prompts** categorized into:
- 🚀 *Product-Market Fit & Retention Curves*
- ✍️ *Ship 30 for 30 Atomic Essays*
- ⚡ *High Agency & LNO Frameworks*
- 🛠️ *Interactive HTML Artifact Generation*
- 🌟 *11-Star Delight Experiences*

### 4.2 Citation Interaction Flow
1. User reads grounded response.
2. User clicks citation badge (e.g. `[#1 Shreyas Doshi (14:20)]`).
3. A slide-over **Source Drawer** opens from the right showcasing the speaker bio, episode title, and exact verbatim transcript quotation with an external link to the podcast.

### 4.3 Claude-Style Artifact Rendering Flow
1. User asks for an interactive tool or template.
2. Assistant streams response and embeds an **Artifact Banner Card**.
3. Side-by-side viewer opens automatically, triggering a celebratory micro-confetti burst.
4. User can interact directly with the embedded widget inside the sandbox, inspect raw code, or download the `.html` / `.md` file with one click.

---

## 5. Accessibility & Responsive Breakpoints

- **Contrast Compliance:** All text-to-background combinations meet or exceed **WCAG 2.1 AA (4.5:1 ratio)**.
- **Keyboard Navigation:** Full `Tab` focus management across all interactive controls.
- **Breakpoints:**
  - `Desktop (> 1200px)`: Full 3-column split view (Sidebar + Chat + Artifact Viewer).
  - `Tablet (768px - 1199px)`: Sidebar collapsible, Artifact Viewer overlays or splits.
  - `Mobile (< 768px)`: Responsive single-column with bottom drawer sheets for artifacts and citations.
