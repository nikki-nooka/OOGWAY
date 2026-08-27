# Claude-Style Artifact Viewer & Sandbox Isolation
## Project: The Lenny Growth Assistant
**Document Version:** 1.0.0

---

## 1. Spatial Ergonomics & Split-Screen Experience

When a user requests an interactive growth tool, retention calculator, or long-form framework document, the interface automatically opens a side-by-side **Artifact Viewer** next to the chat stream.

```
┌──────────────────────────────────────┬──────────────────────────────────────┐
│ CONVERSATION STREAM                  │ ARTIFACT VIEWER (50% SPLIT)          │
│                                      │                                      │
│ Assistant says:                      │ [Safe Preview Badge] [Preview | Code]│
│ "Here is your interactive PMF        │ ┌──────────────────────────────────┐ │
│ retention curve calculator..."       │ │ <iframe sandbox="...">           │ │
│                                      │ │                                  │ │
│ [Open Split-View ->]                 │ │ Live Growth Retention Calculator │ │
│                                      │ │ • Sliders & Metric Graphs        │ │
│                                      │ └──────────────────────────────────┘ │
│ [Input message...]                   │ [Copy Code] [Export .html] [Expand]  │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

---

## 2. Interactive Artifact Modes

1. **Preview Mode:** Renders live, executable HTML/CSS/JavaScript components inside an isolated iframe.
2. **Code Mode:** Shows syntax-highlighted, sanitized source code for auditing.
3. **Document Mode:** Renders clean, formatted Markdown for long-form strategy memos and Ship 30 essays.

---

## 3. Sandboxing & Isolation Flags
The viewer utilizes:
```html
<iframe
  srcdoc={sanitizedHtml}
  sandbox="allow-scripts allow-forms allow-modals"
  className="artifact-iframe"
/>
```
Omitting `allow-same-origin` ensures the rendered snippet cannot access the host application's DOM, cookies, session storage, or network authentication tokens.
