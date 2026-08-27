# UI/UX Design System & Experience Specification
## Project: The Lenny Growth Assistant
**Document Version:** 1.0.0 (Production Release)  
**Theme:** Warm Editorial Intelligence

---

## 1. Design Philosophy & Editorial Aesthetic

The Lenny Growth Assistant combines the visual authority of a premium literary magazine with the dynamic intelligence of an AI product workspace.

### Core Visual Tenets:
1. **Intellectual & Editorial:** Warm cream paper texture (`#F5F2EA`), high-contrast typography, and 1px crisp separators.
2. **Typography-Led Hierarchy:** `DM Serif Display` and `Playfair Display` for bold editorial headlines, pull quotes, and essay titles; `Inter` for interface and metadata.
3. **Asymmetric Magazine Grids:** Dynamic feature cards, lead story hero layouts, category badges (`tag-brown`, `tag-green`, `tag-gold`), and rich whitespace.
4. **Side-by-Side Spatial Ergonomics:** Interactive split-screen rendering live, sandboxed HTML/CSS calculators, dashboards, and Ship 30 essays.
5. **Dual Theme Architecture:** Warm Editorial Light (`#F5F2EA`) default with instant switch to Editorial Dark (`#10100F`).

---

## 2. Design Tokens

### 2.1 Warm Editorial Light Palette (Default)
```css
:root, [data-theme="light"] {
  --bg-primary: #F5F2EA;       /* Warm Cream */
  --bg-surface: #FBFAF6;       /* Editorial Paper Card */
  --bg-sidebar: #EFECE3;       /* Warm Parchment */
  --bg-overlay: rgba(245, 242, 234, 0.92);

  --text-primary: #161616;     /* Deep Ink Black */
  --text-secondary: #66635C;   /* Muted Charcoal */
  --text-muted: #8E8A81;       /* Subtle Sepia */

  --border-light: #E8E4DA;     /* Ultra-thin hairline */
  --border-medium: #D9D4C9;    /* Standard frame border */
  --border-dark: #161616;      /* High-contrast divider */

  --accent-brown: #9A5B2E;     /* Saddle Leather Brown */
  --accent-green: #245D55;     /* Forest Editorial Green */
  --accent-gold: #D7A94B;      /* Vintage Gold Highlight */
  --accent-black: #111111;     /* Classic Press Black */

  --font-serif: 'DM Serif Display', 'Playfair Display', Georgia, serif;
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

### 2.2 Editorial Dark Palette
```css
[data-theme="dark"] {
  --bg-primary: #10100F;       /* Deep Obsidian Night */
  --bg-surface: #181817;       /* Dark Card Surface */
  --bg-sidebar: #141413;       /* Sidebar Charcoal */
  --bg-overlay: rgba(16, 16, 15, 0.94);

  --text-primary: #F4F1EA;     /* Soft Warm Ivory */
  --text-secondary: #A8A49A;   /* Muted Sand */
  --text-muted: #66635C;       /* Dark Parchment Muted */

  --border-light: #262524;
  --border-medium: #333230;
  --border-dark: #F4F1EA;

  --accent-brown: #C98243;     /* Warm Amber */
  --accent-green: #5F8B7B;     /* Sage Teal */
  --accent-gold: #E5B85C;      /* Muted Gold */
  --accent-black: #F4F1EA;
}
```

---

## 3. Screen Layouts & Information Architecture

- **Screen 01 (Home Page):** Masthead headline *"Think Better. Ship Better."*, lead story card *"THE PMF PLAYBOOK"*, 3 supporting stories (*B2B PLG*, *11-Star Delight*, *LNO Framework*), and popular topics strip.
- **Screen 02 & 03 (Explore Magazine & Topic Deep Dives):** Magazine grid, topic filter chips, guest index, and topic modal with verbatim evidence quotes.
- **Screen 04 & 05 (Episode Detail & Transcript Viewer):** Speaker breakdown, audio timestamps, transcript search and highlighting, and external audio links.
- **Screen 06–10 (Conversational Research Workspace):** 3-column layout (Sessions list, Chat, Split-pane viewer). Responses structured into **Lenny's Perspective**, **Key Signals**, and **Evidence** with citation badges.
- **Screen 11 & 12 (Writing Studio & Ship 30 for 30 Generator):** ~1,250-word atomic essays featuring 1-3-1 hook structure, modular H2 pillars, and grounded citations.
- **Screen 13 & 14 (Claude-Style Artifact Viewer & Safe Sandbox):** Side-by-side split screen with live sandboxed `iframe` rendering, Safe Preview Security Banner, Code view, Markdown view, Copy, and Download.
- **Screen 15 (Artifact Library):** Searchable and filterable grid of saved essays, calculators, dashboards, and strategy memos.
- **Screen 16 & 17 (Settings & Model Diagnostics):** Multi-provider switcher (Local Ollama, Claude 3.5, OpenAI GPT-4o, Offline Fallback) with live connection status probes.
- **Section 50 (Interactive 14-Slide Presentation Deck):** Built-in slide presentation with keyboard navigation, progress bar, and speaker notes.
