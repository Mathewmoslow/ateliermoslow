import { forwardRef, useImperativeHandle, useMemo, useState } from 'react'
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
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
  HighlightOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  ColumnWidthOutlined,
  UnorderedListOutlined,
  OrderedListOutlined,
  FieldBinaryOutlined,
  ClearOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from '@ant-design/icons'
import { Button, Space, Tooltip, InputNumber, Switch, Tabs, Select, Slider } from 'antd'
import './editor.css'

type AlignOption = 'left' | 'center' | 'right' | 'justify'

interface EditorCanvasProps {
  isMobile?: boolean
  swatchColor: string
  onSwatchChange?: (color: string) => void
}

export interface EditorHandle {
  applyColor: (color: string) => void
}

const RibbonButton = ({
  label,
  icon,
  active,
  onClick,
  size = 'small',
  flat = true,
}: {
  label: string
  icon: React.ReactNode
  active?: boolean
  onClick: () => void
  size?: 'small' | 'middle'
  flat?: boolean
}) => (
  <Tooltip title={label}>
    <Button
      size={size}
      type={flat ? 'text' : active ? 'primary' : 'default'}
      className={`ribbon-btn ${flat ? 'flat' : ''} ${active ? 'active' : ''}`}
      icon={icon}
      onClick={onClick}
      aria-label={label}
    />
  </Tooltip>
)

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

export const EditorCanvas = forwardRef<EditorHandle, EditorCanvasProps>(
  ({ isMobile, swatchColor, onSwatchChange }, ref) => {
  const btnSize: 'small' | 'middle' = isMobile ? 'small' : 'middle'
  const [lineHeight, setLineHeight] = useState(1.6)
  const [paraSpacing, setParaSpacing] = useState(14)
  const [paraBefore, setParaBefore] = useState(0)
  const [paraAfter, setParaAfter] = useState(14)
  const [hyphenate, setHyphenate] = useState(true)
  const [fontFamily, setFontFamily] = useState('Inter Tight')
  const [fontSize, setFontSize] = useState(17)
  const [fontWeight, setFontWeight] = useState(400)
  const [tracking, setTracking] = useState(0)
  const [baselineShift, setBaselineShift] = useState(0)
  const [textCase, setTextCase] = useState<'none' | 'uppercase' | 'lowercase' | 'small-caps'>('none')
  const [kerning, setKerning] = useState<'normal' | 'none'>('normal')
  const [indentLeft, setIndentLeft] = useState(0)
  const [indentRight, setIndentRight] = useState(0)
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
    onSwatchChange?.(color)
    editor?.chain().focus().setColor(color).run()
  }

  const applyFontFamily = (family: string) => {
    setFontFamily(family)
    editor?.chain().focus().setMark('textStyle', { fontFamily: family }).run()
  }

  const applyFontSize = (size: number) => {
    setFontSize(size)
    editor?.chain().focus().setMark('textStyle', { fontSize: `${size}px` }).run()
  }

  const applyFontWeight = (weight: number) => {
    setFontWeight(weight)
    editor?.chain().focus().setMark('textStyle', { fontWeight: `${weight}` }).run()
  }

  const applyTracking = (value: number) => {
    setTracking(value)
    editor?.chain().focus().setMark('textStyle', { letterSpacing: `${value}px` }).run()
  }

  const applyBaselineShift = (value: number) => {
    setBaselineShift(value)
    editor?.chain().focus().setMark('textStyle', { verticalAlign: `${value}px` }).run()
  }

  const applyTextCase = (value: 'none' | 'uppercase' | 'lowercase' | 'small-caps') => {
    setTextCase(value)
    const attrs: Record<string, string> = {}
    if (value === 'uppercase' || value === 'lowercase') {
      attrs.textTransform = value
    } else if (value === 'small-caps') {
      attrs.fontVariant = 'small-caps'
    } else {
      attrs.textTransform = 'none'
      attrs.fontVariant = 'normal'
    }
    editor?.chain().focus().setMark('textStyle', attrs).run()
  }

  const applyKerning = (value: 'normal' | 'none') => {
    setKerning(value)
    editor?.chain().focus().setMark('textStyle', { fontKerning: value }).run()
  }

  const applyIndentLeft = (value: number) => {
    setIndentLeft(value)
    editor?.chain().focus().setMark('textStyle', { marginLeft: `${value}px` }).run()
  }

  const applyIndentRight = (value: number) => {
    setIndentRight(value)
    editor?.chain().focus().setMark('textStyle', { marginRight: `${value}px` }).run()
  }


  useImperativeHandle(
    ref,
    () => ({
      applyColor: (color: string) => applyColor(color),
    }),
    [editor],
  )

  const applyLineHeight = (value: number) => {
    setLineHeight(value)
  }

  const applyParaSpacing = (value: number) => {
    setParaSpacing(value)
  }

  const stats = useMemo(() => {
    if (!editor) return { words: 0, chars: 0 }
    const text = editor.state.doc.textBetween(0, editor.state.doc.content.size, ' ')
    const words = text.trim().length ? text.trim().split(/\s+/).length : 0
    const chars = text.length
    return { words, chars }
  }, [editor, editor?.state?.doc])

  const ribbonTabs = [
    {
      key: 'type',
      label: 'Type',
      children: (
        <Space className="ribbon-row" size={8} wrap>
          <Space className="ribbon-group flat" size={8} wrap>
            <label className="control">
              <span>Font</span>
              <Select
                size="small"
                value={fontFamily}
                style={{ width: 220 }}
                onChange={applyFontFamily}
                options={[
                  { value: 'Inter Tight', label: <span style={{ fontFamily: 'Inter Tight' }}>Inter Tight</span> },
                  { value: 'IBM Plex Sans Condensed', label: <span style={{ fontFamily: 'IBM Plex Sans Condensed' }}>IBM Plex Sans Condensed</span> },
                  { value: 'Georgia', label: <span style={{ fontFamily: 'Georgia' }}>Georgia</span> },
                  { value: 'Times New Roman', label: <span style={{ fontFamily: 'Times New Roman' }}>Times New Roman</span> },
                  { value: 'Arial', label: <span style={{ fontFamily: 'Arial' }}>Arial</span> },
                ]}
              />
            </label>
            <label className="control">
              <span>Weight</span>
              <Slider
                min={200}
                max={800}
                step={100}
                value={fontWeight}
                onChange={(v) => applyFontWeight(Array.isArray(v) ? v[0] : v)}
                style={{ width: 140 }}
              />
            </label>
            <label className="control">
              <span>Size</span>
              <Space size={6}>
                <InputNumber
                  size="small"
                  min={8}
                  max={96}
                  value={fontSize}
                  onChange={(v) => applyFontSize(Number(v) || 12)}
                  style={{ width: 70 }}
                />
                <Slider
                  min={8}
                  max={96}
                  step={1}
                  value={fontSize}
                  onChange={(v) => applyFontSize(Array.isArray(v) ? v[0] : v)}
                  style={{ width: 140 }}
                />
              </Space>
            </label>
          </Space>
          <Space className="ribbon-group flat" size={6} wrap>
            <RibbonButton label="Bold" icon={<BoldOutlined />} active={editor?.isActive('bold')} onClick={ribbon.bold} size={btnSize} />
            <RibbonButton label="Italic" icon={<ItalicOutlined />} active={editor?.isActive('italic')} onClick={ribbon.italic} size={btnSize} />
            <RibbonButton label="Underline" icon={<UnderlineOutlined />} active={editor?.isActive('underline')} onClick={ribbon.underline} size={btnSize} />
            <RibbonButton label="Strikethrough" icon={<StrikethroughOutlined />} active={editor?.isActive('strike')} onClick={ribbon.strike} size={btnSize} />
            <RibbonButton label="Highlight" icon={<HighlightOutlined />} active={editor?.isActive('highlight')} onClick={ribbon.highlight} size={btnSize} />
          </Space>
          <Space className="ribbon-group flat" size={10} wrap>
            <label className="control">
              <span>Tracking</span>
              <Space size={6}>
                <InputNumber
                  size="small"
                  min={-5}
                  max={20}
                  step={0.5}
                  value={tracking}
                  onChange={(v) => applyTracking(Number(v) || 0)}
                  style={{ width: 70 }}
                />
                <Slider
                  min={-5}
                  max={20}
                  step={0.5}
                  value={tracking}
                  onChange={(v) => applyTracking(Array.isArray(v) ? v[0] : v)}
                  style={{ width: 140 }}
                />
              </Space>
            </label>
            <label className="control">
              <span>Baseline</span>
              <Space size={6}>
                <InputNumber
                  size="small"
                  min={-10}
                  max={20}
                  step={1}
                  value={baselineShift}
                  onChange={(v) => applyBaselineShift(Number(v) || 0)}
                  style={{ width: 70 }}
                />
                <Slider
                  min={-10}
                  max={20}
                  step={1}
                  value={baselineShift}
                  onChange={(v) => applyBaselineShift(Array.isArray(v) ? v[0] : v)}
                  style={{ width: 140 }}
                />
              </Space>
            </label>
            <label className="control">
              <span>Case</span>
              <Select
                size="small"
                value={textCase}
                style={{ width: 140 }}
                onChange={(v) => applyTextCase(v as any)}
                options={[
                  { value: 'none', label: 'Normal' },
                  { value: 'uppercase', label: 'Uppercase' },
                  { value: 'lowercase', label: 'Lowercase' },
                  { value: 'small-caps', label: 'Small Caps' },
                ]}
              />
            </label>
            <label className="control">
              <span>Kerning</span>
              <Select
                size="small"
                value={kerning}
                style={{ width: 120 }}
                onChange={(v) => applyKerning(v as any)}
                options={[
                  { value: 'normal', label: 'Metrics' },
                  { value: 'none', label: 'None' },
                ]}
              />
            </label>
          </Space>
        </Space>
      ),
    },
    {
      key: 'paragraph',
      label: 'Paragraph',
      children: (
        <Space className="ribbon-row" size={8} wrap>
          <Space className="ribbon-group flat" size={6} wrap>
            <RibbonButton label="Align left" icon={<AlignLeftOutlined />} onClick={ribbon.alignLeft} size={btnSize} />
            <RibbonButton label="Align center" icon={<AlignCenterOutlined />} onClick={ribbon.alignCenter} size={btnSize} />
            <RibbonButton label="Align right" icon={<AlignRightOutlined />} onClick={ribbon.alignRight} size={btnSize} />
            <RibbonButton label="Justify" icon={<ColumnWidthOutlined />} onClick={ribbon.alignJustify} size={btnSize} />
            <RibbonButton label="Justify Center" icon={<SortAscendingOutlined />} onClick={ribbon.alignJustify} size={btnSize} />
            <RibbonButton label="Justify Full" icon={<SortDescendingOutlined />} onClick={ribbon.alignJustify} size={btnSize} />
          </Space>
          <Space className="ribbon-group flat controls" size={8} wrap>
            <label className="control">
              <span>Line</span>
              <InputNumber size="small" step={0.1} min={1} max={3} value={lineHeight} onChange={(v) => applyLineHeight(Number(v) || 1.6)} />
            </label>
            <label className="control">
              <span>Before</span>
              <InputNumber size="small" step={2} min={0} max={48} value={paraBefore} onChange={(v) => setParaBefore(Number(v) || 0)} />
            </label>
            <label className="control">
              <span>After</span>
              <InputNumber size="small" step={2} min={0} max={48} value={paraAfter} onChange={(v) => setParaAfter(Number(v) || 14)} />
            </label>
            <label className="control">
              <span>Spacing</span>
              <InputNumber size="small" step={2} min={0} max={48} value={paraSpacing} onChange={(v) => applyParaSpacing(Number(v) || 14)} />
            </label>
            <label className="control">
              <span>Indent L</span>
              <InputNumber
                size="small"
                step={1}
                min={0}
                max={60}
                value={indentLeft}
                onChange={(v) => applyIndentLeft(Number(v) || 0)}
              />
            </label>
            <label className="control">
              <span>Indent R</span>
              <InputNumber
                size="small"
                step={1}
                min={0}
                max={60}
                value={indentRight}
                onChange={(v) => applyIndentRight(Number(v) || 0)}
              />
            </label>
            <label className="control switch">
              <span>Hyphenate</span>
              <Switch size="small" checked={hyphenate} onChange={setHyphenate} />
            </label>
          </Space>
        </Space>
      ),
    },
    {
      key: 'lists',
      label: 'Lists',
      children: (
        <Space className="ribbon-row" size={8} wrap>
          <Space className="ribbon-group flat" size={6} wrap>
            <RibbonButton label="Bullets" icon={<UnorderedListOutlined />} onClick={ribbon.bullet} size={btnSize} />
            <RibbonButton label="Numbered" icon={<OrderedListOutlined />} onClick={ribbon.ordered} size={btnSize} />
            <RibbonButton label="Indent" icon={<FieldBinaryOutlined />} onClick={ribbon.indent} size={btnSize} />
            <RibbonButton label="Outdent" icon={<FieldBinaryOutlined rotate={180} />} onClick={ribbon.outdent} size={btnSize} />
            <RibbonButton label="Clear" icon={<ClearOutlined />} onClick={ribbon.clearFormatting} size={btnSize} />
            <RibbonButton label="Text color" icon={<BgColorsOutlined />} onClick={() => applyColor(swatchColor)} size={btnSize} />
            <RibbonButton label="Superscript" icon={<FontSizeOutlined />} onClick={() => editor?.chain().focus().setMark('textStyle', { verticalAlign: 'super' }).run()} size={btnSize} />
            <RibbonButton label="Subscript" icon={<FontSizeOutlined rotate={180} />} onClick={() => editor?.chain().focus().setMark('textStyle', { verticalAlign: 'sub' }).run()} size={btnSize} />
          </Space>
        </Space>
      ),
    },
  ]

  return (
    <div className="editor-shell">
      <div className="ribbon ribbon-tabs">
        <Tabs items={ribbonTabs} size="small" defaultActiveKey="type" animated={false} tabBarStyle={{ marginBottom: 0 }} />
      </div>

      <div className="page-wrap">
        <div
          className="page"
          style={
            {
              '--line-height': lineHeight,
              '--para-spacing': `${paraSpacing}px`,
              '--para-before': `${paraBefore}px`,
              '--para-after': `${paraAfter}px`,
              '--hyphenate': hyphenate ? 'auto' : 'manual',
            } as React.CSSProperties
          }
        >
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
})
