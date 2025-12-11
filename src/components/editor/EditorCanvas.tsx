import { useMemo } from 'react'
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
import './editor.css'

type AlignOption = 'left' | 'center' | 'right' | 'justify'

interface RibbonButtonProps {
  label: string
  active?: boolean
  onClick: () => void
}

function RibbonButton({ label, active, onClick }: RibbonButtonProps) {
  return (
    <button className={`ribbon-btn ${active ? 'active' : ''}`} onClick={onClick} type="button">
      {label}
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
    clearFormatting: () => editor?.chain().focus().unsetAllMarks().clearNodes().run(),
  }
}

export function EditorCanvas() {
  const editor = useEditor({
    extensions: [
      Color.configure({ types: ['textStyle'] }),
      TextStyle,
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
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
    content: '<h1>Welcome to Atelier Moslow</h1><p>Compose with clarity. The companion and project rails sit to your sides, leaving the page pure.</p>',
  })

  const ribbon = useRibbon(editor)

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
          <RibbonButton label="Bold" active={editor?.isActive('bold')} onClick={ribbon.bold} />
          <RibbonButton label="Italic" active={editor?.isActive('italic')} onClick={ribbon.italic} />
          <RibbonButton
            label="Underline"
            active={editor?.isActive('underline')}
            onClick={ribbon.underline}
          />
          <RibbonButton
            label="Strike"
            active={editor?.isActive('strike')}
            onClick={ribbon.strike}
          />
          <RibbonButton
            label="Highlight"
            active={editor?.isActive('highlight')}
            onClick={ribbon.highlight}
          />
        </div>
        <div className="ribbon-group">
          <RibbonButton label="Left" onClick={ribbon.alignLeft} />
          <RibbonButton label="Center" onClick={ribbon.alignCenter} />
          <RibbonButton label="Right" onClick={ribbon.alignRight} />
          <RibbonButton label="Justify" onClick={ribbon.alignJustify} />
        </div>
        <div className="ribbon-group ghost">
          <RibbonButton label="Clear" onClick={ribbon.clearFormatting} />
        </div>
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
