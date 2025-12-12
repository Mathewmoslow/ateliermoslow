import { useMemo, useState } from 'react'
import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import Color from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import Typography from '@tiptap/extension-typography'
import CharacterCount from '@tiptap/extension-character-count'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Indent,
  Outdent,
  Eraser,
  Palette,
} from 'lucide-react'
import './editor.css'

import { ColorPanel } from './ColorPanel'

type AlignOption = 'left' | 'center' | 'right' | 'justify'

interface RibbonButtonProps {
  label: string
  icon: React.ReactNode
  active?: boolean
  onClick: () => void
}

function RibbonButton({ label, icon, active, onClick }: RibbonButtonProps) {
  return (
    <button
      className={`ribbon-btn ${active ? 'active' : ''}`}
      onClick={onClick}
      type="button"
      title={label}
      aria-label={label}
    >
      {icon}
    </button>
  )
}

function useRibbon(editor: Editor | null) {
  const setAlign = (align: AlignOption) => editor?.chain().focus().setTextAlign(align).run()

  return {
    bold: () => editor?.chain().focus().toggleBold().run(),
    italic: () => editor?.chain().focus().toggleItalic().run(),
    underline: () => editor?.chain().focus().toggleUnderline().run(),
    strike: () => editor?.chain().focus().toggleStrike().run(),
    highlight: () => editor?.chain().focus().toggleHighlight({ color: '#ffeb3b66' }).run(),
    alignLeft: () => setAlign('left'),
    alignCenter: () => setAlign('center'),
    alignRight: () => setAlign('right'),
    alignJustify: () => setAlign('justify'),
    bullet: () => editor?.chain().focus().toggleBulletList().run(),
    ordered: () => editor?.chain().focus().toggleOrderedList().run(),
    indent: () => editor?.chain().focus().sinkListItem('listItem').run(),
    outdent: () => editor?.chain().focus().liftListItem('listItem').run(),
    clearFormatting: () => editor?.chain().focus().unsetAllMarks().clearNodes().run(),
  }
}

export function EditorCanvas() {
  const [swatchColor, setSwatchColor] = useState('#4aa3ff')

  const editor = useEditor({
    extensions: [
      Color.configure({ types: ['textStyle'] }),
      TextStyle,
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
        bulletList: {
          keepMarks: true,
        },
        orderedList: {
          keepMarks: true,
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: 'Start writing your piece...',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight,
      Typography,
      CharacterCount,
    ],
    content:
      '<h1>Welcome to Atelier Moslow</h1><p>Compose with clarity. The companion and project rails sit to your sides, leaving the page pure.</p>',
  })

  const ribbon = useRibbon(editor)

  const applyColor = (color: string) => {
    setSwatchColor(color)
    editor?.chain().focus().setColor(color).run()
  }

  const stats = useMemo(() => {
    if (!editor) return { words: 0, chars: 0 }
    const text = editor.state.doc.textBetween(0, editor.state.doc.content.size, ' ')
    const words = text.trim().length ? text.trim().split(/\s+/).length : 0
    const chars = text.length
    return { words, chars }
  }, [editor, editor?.state?.doc])

  return (
    <div className="editor-shell">
      <div className="ribbon">
        <div className="ribbon-group">
          <RibbonButton
            label="Bold"
            icon={<Bold size={16} />}
            active={editor?.isActive('bold')}
            onClick={ribbon.bold}
          />
          <RibbonButton
            label="Italic"
            icon={<Italic size={16} />}
            active={editor?.isActive('italic')}
            onClick={ribbon.italic}
          />
          <RibbonButton
            label="Underline"
            icon={<UnderlineIcon size={16} />}
            active={editor?.isActive('underline')}
            onClick={ribbon.underline}
          />
          <RibbonButton
            label="Strikethrough"
            icon={<Strikethrough size={16} />}
            active={editor?.isActive('strike')}
            onClick={ribbon.strike}
          />
          <RibbonButton
            label="Highlight"
            icon={<Highlighter size={16} />}
            active={editor?.isActive('highlight')}
            onClick={ribbon.highlight}
          />
        </div>

        <div className="ribbon-group">
          <RibbonButton label="Align left" icon={<AlignLeft size={16} />} onClick={ribbon.alignLeft} />
          <RibbonButton
            label="Align center"
            icon={<AlignCenter size={16} />}
            onClick={ribbon.alignCenter}
          />
          <RibbonButton
            label="Align right"
            icon={<AlignRight size={16} />}
            onClick={ribbon.alignRight}
          />
          <RibbonButton
            label="Justify"
            icon={<AlignJustify size={16} />}
            onClick={ribbon.alignJustify}
          />
        </div>

        <div className="ribbon-group">
          <RibbonButton label="Bullets" icon={<List size={16} />} onClick={ribbon.bullet} />
          <RibbonButton label="Numbered" icon={<ListOrdered size={16} />} onClick={ribbon.ordered} />
          <RibbonButton label="Indent" icon={<Indent size={16} />} onClick={ribbon.indent} />
          <RibbonButton label="Outdent" icon={<Outdent size={16} />} onClick={ribbon.outdent} />
        </div>

        <div className="ribbon-group ghost">
          <RibbonButton label="Clear" icon={<Eraser size={16} />} onClick={ribbon.clearFormatting} />
          <RibbonButton
            label="Text color"
            icon={<Palette size={16} />}
            onClick={() => applyColor(swatchColor)}
          />
        </div>
      </div>

      <div className="color-panel-wrap">
        <ColorPanel onSelectColor={applyColor} current={swatchColor} />
      </div>

      <div className="page-wrap">
        <div className="page">
          <EditorContent editor={editor} />
        </div>
      </div>
      <div className="statusbar">
        <span>Words: {stats.words}</span>
        <span>Characters: {stats.chars}</span>
        <span>Typing saved locally</span>
      </div>
    </div>
  )
}
