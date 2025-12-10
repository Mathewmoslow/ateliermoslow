# Atelier Moslow: Unified Writing Suite with AI Companion

Build me a complete word processor called **Atelier Moslow** with an integrated AI writing companion. This is a single, unified application — the companion is not separate, it lives inside the editor.

---

## STEP 1: EXPLORE EXISTING CODE

First, explore these two directories to understand what I've already built:

**Directory 1 — WritingSystem (for my second novel):**
```
/Users/mathewmoslow/Documents/A year and a day/WritingSystem
```

**Directory 2 — Existing Atelier Moslow tool:**
```
/Users/mathewmoslow/Library/Mobile Documents/com~apple~CloudDocs/Downloads/files (7)
```

Read through ALL files in both directories. Understand the architecture, features, and design. Give me a comprehensive summary before proceeding.

---

## STEP 2: SET UP NEW DIRECTORY (COPY, DO NOT MOVE)

⚠️ **CRITICAL: The "files (7)" directory is a LIVE portal connected to my website. DO NOT move, delete, or modify anything in that directory. COPY only.**

**Create this new structure:**
```
/Users/mathewmoslow/Documents/Apps/AtelierMoslow/
├── index.html              # Main application (single-file, runs in browser)
├── src/
│   ├── editor/             # Word processor core
│   ├── companion/          # AI writing companion
│   ├── tools/              # Utilities
│   └── themes/             # Visual themes
├── projects/               # Writing projects storage
├── voice-profiles/         # Saved voice/style configurations
├── assets/                 # Fonts, icons
└── docs/                   # Documentation
```

**COPY relevant files from (do not modify originals):**
`/Users/mathewmoslow/Library/Mobile Documents/com~apple~CloudDocs/Downloads/files (7)`

**To:**
`/Users/mathewmoslow/Documents/Apps/AtelierMoslow/`

The original "files (7)" directory must remain completely intact and functional. It will continue serving as my live portal until I manually switch over to the new Atelier Moslow suite.

---

## STEP 3: BUILD THE UNIFIED SUITE

### Architecture Principle

**One application. Two modes working together:**
1. **Editor Mode** — Full word processor for writing
2. **Companion Mode** — AI collaborator panel that assists, expands, rewrites

The companion is always available. It's a panel, a sidebar, a collaborator sitting next to your document. You select text, invoke the companion, tell it what you want, and it works on that selection or the whole document.

---

## THE WORD PROCESSOR (Editor Core)

### Text Editing — Microsoft Word Rival

**Formatting:**
- Headings (H1-H6) with visual hierarchy
- Bold, italic, underline, strikethrough
- Text color and highlight
- Font family selection (system fonts + Google Fonts)
- Font size control
- Line spacing and paragraph spacing
- Text alignment (left, center, right, justify)
- Indentation controls
- Block quotes with styled presentation
- Callout boxes (info, warning, note)

**Lists & Structure:**
- Bullet lists (multiple styles)
- Numbered lists (multiple formats: 1., a., i.)
- Checklists / task lists
- Nested list support
- Outline view for document structure

**Advanced Elements:**
- Tables with row/column controls
- Horizontal rules
- Code blocks with syntax highlighting
- Footnotes and endnotes
- Hyperlinks with visual editor
- Images (drag-drop, paste, URL)
- Page breaks

**Editing Tools:**
- Find and replace (with regex option)
- Spell check (browser native)
- Undo/redo with deep history (100+ steps)
- Clipboard formatting options (paste plain, paste with formatting)
- Auto-save every 30 seconds
- Manual save with version snapshots
- Track changes mode (optional)
- Comments and annotations

### Document Management

**Multi-Document:**
- Tabbed interface for multiple open documents
- Document tree/sidebar navigation
- Project folders for organization
- Recent files quick access
- Templates library
- Document search across all files

**Export Options:**
- Markdown (.md)
- HTML (.html)
- Plain text (.txt)
- Print-optimized view
- Copy as formatted text

**Storage:**
- localStorage for quick persistence
- IndexedDB for large documents
- JSON export/import for full backup
- Auto-recovery from crashes

### Writing Metrics

**Live Statistics Panel:**
- Word count
- Character count (with/without spaces)
- Sentence count
- Paragraph count
- Page count (estimated)
- Reading time
- Speaking time
- Reading level (Flesch-Kincaid)

**Goals & Tracking:**
- Daily word count goal with progress bar
- Session word count
- Project total word count
- Writing streak tracker

### Focus Features

**Distraction-Free Mode:**
- Hides all UI except the text
- Customizable background
- Adjustable text width
- Single-key escape to return

**Typewriter Mode:**
- Keeps current line vertically centered
- Fades surrounding paragraphs (optional)

**Writing Sprints:**
- Timed writing sessions
- Word count during sprint
- Sprint history

---

## THE AI WRITING COMPANION (Integrated Agent)

This is the heart of what makes Atelier Moslow special. The companion is not a separate app — it's a panel within the editor that collaborates with you.

### Companion Interface

**Location:** Right sidebar panel (collapsible, resizable)

**Components:**
1. **Selection Context** — Shows what text is currently selected (or "Full Document" if nothing selected)
2. **Action Buttons** — Quick actions (Expand, Rewrite, Refine, etc.)
3. **Custom Prompt Input** — Free-form instructions to the companion
4. **Voice Profile Selector** — Choose the writing voice/style
5. **Output Preview** — See the companion's work before applying
6. **Apply / Reject / Edit** — Control over what goes into your document

### Companion Actions

**Expand** — Take a brief passage and expand it into fuller prose
- "Expand this paragraph into a full section"
- "Develop this idea with more detail"
- "Turn these bullet points into narrative"

**Rewrite** — Transform existing text
- "Rewrite in a more vulnerable tone"
- "Make this more direct and blunt"
- "Add narrative momentum"
- "Soften without losing honesty"

**Refine** — Polish without changing meaning
- "Tighten this prose"
- "Improve sentence rhythm"
- "Vary sentence length"
- "Remove unnecessary words"

**Continue** — Generate what comes next
- "Continue this thought"
- "Write the next paragraph"
- "Finish this section"

**Transform** — Structural changes
- "Turn this into dialogue"
- "Convert to first person"
- "Make this a story instead of exposition"
- "Break into smaller sections"

**Analyze** — Get feedback without changes
- "What's working here?"
- "What's missing?"
- "Does this feel authentic?"
- "Rate the emotional impact"

### Voice Profiles System

The companion writes in configurable voice profiles. Users can create, save, and switch between profiles.

**Profile Components:**
```
{
  "name": "Mathew - Academic Letter",
  "description": "Brené Brown vulnerability + Esther Perel relational intelligence + blunt honesty + respectful irreverence",
  "influences": [
    {"source": "Brené Brown", "elements": ["vulnerability as strength", "naming fears directly", "courage over comfort"]},
    {"source": "Esther Perel", "elements": ["relational intelligence", "erotic as aliveness", "paradox holding"]},
    {"source": "Personal", "elements": ["blunt honesty", "no hedging", "respectful irreverence", "minimal sarcasm"]}
  ],
  "avoid": ["sarcasm", "apologetic qualifiers", "excessive hedging", "academic stuffiness"],
  "tone": "warm but direct, vulnerable but confident, irreverent but respectful",
  "sentence_style": "varied length, some short punches, narrative momentum",
  "examples": [
    "Example passage that captures this voice...",
    "Another example..."
  ]
}
```

**Default Profiles to Include:**
1. **Direct & Clean** — Hemingway-esque clarity
2. **Warm & Vulnerable** — Brené Brown influence
3. **Playful & Sharp** — Wit without cruelty
4. **Academic & Precise** — Scholarly but readable
5. **Narrative & Immersive** — Novel-quality prose

**Custom Profile Builder:**
- Name your profile
- Describe the voice in plain language
- Add influence sources
- Paste example passages that capture the voice
- Define what to avoid
- Test with sample text

### Section-by-Section Workflow

For long-form work (like a novel-quality letter), the companion supports structured drafting:

**Section Mode:**
1. Define sections (Opening Hook, Context, The Ask, etc.)
2. Work on one section at a time
3. Companion focuses on that section's purpose
4. Mark sections as Draft / In Progress / Complete
5. View section-by-section progress
6. Navigate between sections easily

**Section Tools:**
- "Expand this section"
- "Rewrite to match the tone of [other section]"
- "Strengthen the transition from previous section"
- "This section needs to accomplish [goal]"

### Companion Conversation

The companion can also engage in dialogue about your writing:

**Chat Panel:**
- Ask questions about your draft
- Discuss alternatives
- Get suggestions without automatic changes
- "What if I approached this differently?"
- "I'm stuck on how to say X"
- "Does this feel too aggressive?"

### API Integration

The companion will need to connect to an AI service. Build it to support:

**Option 1: Anthropic API**
- User provides their own API key
- Stored securely in localStorage (encrypted if possible)
- Uses Claude for all companion features

**Option 2: Local/Custom Endpoint**
- Configurable API endpoint
- For users running local models

**Settings Panel:**
- API key input (masked)
- Model selection (claude-sonnet-4-20250514, etc.)
- Temperature control
- Max tokens control

---

## USER INTERFACE DESIGN

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo] Atelier Moslow          [Doc Title]     [⚙️] [👤] [◻️]  │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────┐ ┌─────────────────────────────────┐ ┌─────────────┐ │
│ │         │ │  ═══════════════════════════    │ │  COMPANION  │ │
│ │ PROJECT │ │  [Formatting Toolbar]           │ │             │ │
│ │  TREE   │ │  ═══════════════════════════    │ │  [Expand]   │ │
│ │         │ │                                 │ │  [Rewrite]  │ │
│ │ 📁 Proj │ │  Your writing appears here...   │ │  [Refine]   │ │
│ │  📄 Ch1 │ │                                 │ │  [Continue] │ │
│ │  📄 Ch2 │ │  The editor is the main focus.  │ │             │ │
│ │  📄 Not │ │  Clean, spacious, elegant.      │ │  ─────────  │ │
│ │         │ │                                 │ │  Voice:     │ │
│ │         │ │  When you select text, a        │ │  [Profile▾] │ │
│ │         │ │  floating toolbar appears.      │ │             │ │
│ │         │ │                                 │ │  ─────────  │ │
│ │         │ │                                 │ │  Custom:    │ │
│ │         │ │                                 │ │  [        ] │ │
│ │         │ │                                 │ │  [  Ask   ] │ │
│ │         │ │                                 │ │             │ │
│ └─────────┘ └─────────────────────────────────┘ └─────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│  Words: 1,234  │  Reading: 5 min  │  Goal: ████████░░ 80%       │
└─────────────────────────────────────────────────────────────────┘
```

### Visual Design

**Aesthetic:** Clean, professional, calming. Think iA Writer meets Linear meets Notion.

**Typography:**
- Editor font: System UI or user-selected (Inter, Source Serif, iA Writer Duo)
- UI font: System UI (clean, readable)
- Monospace for code: JetBrains Mono or Fira Code

**Colors:**

*Light Theme:*
- Background: Warm off-white (#FAFAF9)
- Text: Near-black (#1C1C1C)
- Accent: Warm blue (#3B82F6) or terracotta (#C2410C)
- Borders: Subtle gray (#E5E5E5)

*Dark Theme:*
- Background: True dark (#0F0F0F)
- Text: Soft white (#E5E5E5)
- Accent: Muted blue (#60A5FA)
- Borders: Dark gray (#2A2A2A)

*Sepia Theme:*
- Background: Parchment (#F5F0E6)
- Text: Dark brown (#3D3225)
- Accent: Rust (#9A3412)

**Interactions:**
- Subtle hover states
- Smooth transitions (150-200ms)
- Gentle shadows for depth
- No harsh movements

### Responsive Behavior

- Sidebar collapsible on smaller screens
- Companion panel slides in from right
- Mobile-friendly (basic editing)
- Keyboard-first design

### Keyboard Shortcuts

**Editing:**
- Cmd+B: Bold
- Cmd+I: Italic
- Cmd+U: Underline
- Cmd+Shift+S: Strikethrough
- Cmd+K: Insert link
- Cmd+Shift+C: Code block
- Cmd+Shift+Q: Block quote

**Navigation:**
- Cmd+K: Command palette
- Cmd+P: Quick open document
- Cmd+\: Toggle sidebar
- Cmd+Shift+\: Toggle companion
- Cmd+/: Keyboard shortcuts help

**Companion:**
- Cmd+J: Open companion for selection
- Cmd+Shift+E: Expand selection
- Cmd+Shift+R: Rewrite selection
- Cmd+Enter: Apply companion suggestion

**Focus:**
- Cmd+Shift+F: Toggle focus mode
- Cmd+Shift+T: Toggle typewriter mode
- Esc: Exit focus mode

---

## TECHNICAL IMPLEMENTATION

### Stack

- **Core:** Vanilla JavaScript (no framework dependency for portability)
- **Editor:** Tiptap or ProseMirror (or custom contenteditable)
- **Styling:** CSS with CSS variables for theming
- **Storage:** localStorage + IndexedDB
- **API Calls:** Fetch API

### Single-File Option

Create `index.html` that includes everything:
- Embedded CSS in `<style>`
- Embedded JS in `<script>`
- External CDN dependencies (Tiptap, icons, etc.)
- Runs by simply opening the file in a browser

### Performance

- Debounced auto-save
- Virtual scrolling for very long documents
- Efficient DOM updates
- Lazy-load companion panel

---

## STEP 4: PRESERVE & INTEGRATE (COPY ONLY)

From existing WritingSystem and Atelier Moslow (files (7)):
- Identify useful features to COPY into the new suite
- Preserve any unique styling by copying
- Copy any existing projects you want in the new system
- Keep originals intact — only copy what's needed
- **DO NOT modify, move, or delete anything in "files (7)"**

---

## STEP 5: DOCUMENTATION

Create:
- `README.md` — Setup and usage
- `FEATURES.md` — Complete feature list
- `SHORTCUTS.md` — All keyboard shortcuts
- `VOICE-PROFILES.md` — How to create and use voice profiles
- `API-SETUP.md` — How to configure AI companion

---

## DELIVERABLES

When complete:
1. ✅ Organized `/Documents/Apps/AtelierMoslow/` directory
2. ✅ Fully functional word processor with AI companion
3. ✅ Voice profiles system with defaults + custom builder
4. ✅ Complete documentation
5. ✅ All existing projects preserved

---

## DESIGN PHILOSOPHY

**This is a writer's tool built by a writer.**

- The editor should feel like a calm, focused space
- The companion should feel like a trusted collaborator, not a gimmick
- Every feature earns its place by being genuinely useful
- Beauty matters — ugly tools make ugly work
- Speed and reliability over flash
- Personal ownership — your words, your tool, your data

Build something worthy of the work that will be created in it.
