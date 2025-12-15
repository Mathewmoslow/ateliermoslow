import { useState } from 'react'
import { Tabs, Card, Space, Button, Select, Typography, Tag, Input, Alert, Popover, Upload, message } from 'antd'
import { SendOutlined, ReloadOutlined, AuditOutlined, PlayCircleOutlined, PauseOutlined, StopOutlined } from '@ant-design/icons'
import { useCompanionStore } from '../../store/companion'
import { voicePresets } from '../../companion/voices'
import { auditText } from '../../companion/audit'
import { masterRulesSummary, punctuationRules, cadenceRules, styleNotes } from '../../companion/rules'
import { callCompanion } from '../../api/companion'
import './companion.css'

const { Text } = Typography

function VoiceBadge() {
  const activeVoice = useCompanionStore((s) => s.activeVoice)
  return <Tag color="geekblue">Voice: {activeVoice.name}</Tag>
}

function RulesPopover() {
  const content = (
    <div className="rules-popover">
      <div className="rules-section">
        <Text strong>Master Rules</Text>
        <ul>{masterRulesSummary.map((r) => <li key={r}>{r}</li>)}</ul>
      </div>
      <div className="rules-section">
        <Text strong>Punctuation</Text>
        <ul>{punctuationRules.map((r) => <li key={r}>{r}</li>)}</ul>
      </div>
      <div className="rules-section">
        <Text strong>Cadence</Text>
        <ul>{cadenceRules.map((r) => <li key={r}>{r}</li>)}</ul>
      </div>
      <div className="rules-section">
        <Text strong>Style Notes</Text>
        <ul>{styleNotes.map((r) => <li key={r}>{r}</li>)}</ul>
      </div>
    </div>
  )
  return (
    <Popover content={content} placement="bottomRight" trigger="click">
      <Button size="small" icon={<AuditOutlined />}>View rules</Button>
    </Popover>
  )
}

function VoiceSelect() {
  const activeVoice = useCompanionStore((s) => s.activeVoice)
  const setVoice = useCompanionStore((s) => s.setVoice)
  return (
    <Select
      size="small"
      value={activeVoice.id}
      style={{ width: '100%' }}
      onChange={setVoice}
      options={voicePresets.map((v) => ({ value: v.id, label: v.name }))}
    />
  )
}

function ActionMode() {
  const { suggestions, addSuggestion, clearSuggestions, selectionPreview, activeVoice } = useCompanionStore()
  const [loadingAction, setLoading] = useState(false)
  const [actionText, setActionText] = useState('')
  const [error, setError] = useState<string | null>(null)

  const runAction = async (label: string) => {
    const base = actionText || selectionPreview || 'Selected text goes here...'
    setError(null)
    setLoading(true)
    try {
      const res = await callCompanion({
        mode: 'action',
        action: label,
        text: base,
        voiceId: activeVoice.id,
        rules: [...masterRulesSummary],
      })
      const audit = auditText(res.text)
      addSuggestion(res.text, audit.flags)
    } catch (e: any) {
      setError(e?.message ?? 'Action failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Space direction="vertical" size={12} style={{ width: '100%' }}>
      <Input.TextArea
        rows={3}
        placeholder={selectionPreview || 'Type or select text in the editor to work on it'}
        value={actionText}
        onChange={(e) => setActionText(e.target.value)}
      />
      {error && <Alert type="error" message={error} showIcon />}
      <Space wrap>
        <Button size="small" onClick={() => runAction('Rewrite')} loading={loadingAction}>Rewrite</Button>
        <Button size="small" onClick={() => runAction('Shorten')} loading={loadingAction}>Shorten</Button>
        <Button size="small" onClick={() => runAction('Expand')} loading={loadingAction}>Expand</Button>
        <Button size="small" onClick={() => runAction('Tone match')} loading={loadingAction}>Tone match</Button>
        <Button size="small" onClick={() => runAction('Bulletize')} loading={loadingAction}>Bulletize</Button>
        <Button size="small" onClick={() => runAction('Clarity')} loading={loadingAction}>Clarity</Button>
        <Button size="small" onClick={() => runAction('Grammar')} loading={loadingAction}>Grammar</Button>
      </Space>
      <Button size="small" type="link" onClick={clearSuggestions}>Clear results</Button>
      <Space direction="vertical" style={{ width: '100%' }}>
        {suggestions.map((s) => (
          <Card key={s.id} size="small" className="suggestion-card">
            <div className="card-meta">
              <Text strong>Suggestion</Text>
              {s.auditFlags && s.auditFlags.length > 0 ? (
                <Tag color="volcano">Audit flags</Tag>
              ) : (
                <Tag color="green">Audit pass</Tag>
              )}
            </div>
            <div className="card-body">{s.text}</div>
            {s.auditFlags && s.auditFlags.length > 0 && (
              <ul className="flags-list">
                {s.auditFlags.map((f) => <li key={f}>{f}</li>)}
              </ul>
            )}
            <Space>
              <Button size="small" type="primary">Apply</Button>
              <Button size="small">Copy</Button>
            </Space>
          </Card>
        ))}
      </Space>
    </Space>
  )
}

function ChatMode() {
  const { chat, addChatTurn, selectionPreview, activeVoice } = useCompanionStore()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const send = async () => {
    if (!input.trim()) return
    setError(null)
    addChatTurn({ id: crypto.randomUUID(), role: 'user', text: input })
    setLoading(true)
    const prompt = input
    setInput('')
    try {
      const res = await callCompanion({
        mode: 'chat',
        text: `${selectionPreview || ''}\n\n${prompt}`.trim(),
        voiceId: activeVoice.id,
        rules: [...masterRulesSummary],
      })
      const audit = auditText(res.text)
      addChatTurn({
        id: crypto.randomUUID(),
        role: 'assistant',
        text: res.text,
        auditFlags: audit.flags,
      })
    } catch (e: any) {
      setError(e?.message ?? 'Chat failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="chat-pane">
      <div className="chat-log">
        {chat.map((turn) => (
          <div key={turn.id} className={`chat-bubble ${turn.role}`}>
            <div className="chat-role">{turn.role === 'user' ? 'You' : 'Companion'}</div>
            <div className="chat-text">{turn.text}</div>
            {turn.auditFlags && turn.auditFlags.length > 0 && (
              <ul className="flags-list">
                {turn.auditFlags.map((f) => <li key={f}>{f}</li>)}
              </ul>
            )}
          </div>
        ))}
      </div>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Input.TextArea
          rows={3}
          placeholder="Give guidance, ask for a revision, or set a tone tweak."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        {error && <Alert type="error" message={error} showIcon />}
        <Space>
          <Button type="primary" icon={<SendOutlined />} onClick={send} loading={loading} size="small">
            Send
          </Button>
          <Button icon={<ReloadOutlined />} size="small" onClick={() => setInput('More concise, keep order, warmer tone')}>
            Tweak prompt
          </Button>
        </Space>
      </Space>
    </div>
  )
}

function AutonomousMode() {
  const [status, setStatus] = useState<'idle' | 'planning' | 'drafting' | 'paused'>('idle')
  const [log, setLog] = useState<string[]>([])

  const pushLog = (entry: string) => setLog((prev) => [...prev, entry])

  const start = () => {
    setStatus('planning')
    pushLog('Planning beats from outline…')
    setTimeout(() => {
      pushLog('Beat 1 approved. Drafting section…')
      setStatus('drafting')
      setTimeout(() => {
        pushLog('Draft complete. Awaiting review.')
        setStatus('idle')
      }, 800)
    }, 800)
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Upload beforeUpload={() => { message.info('Stub: attach outline/style.'); return false }}>
        <Button size="small">Attach outline / style</Button>
      </Upload>
      <Space>
        <Button size="small" type="primary" icon={<PlayCircleOutlined />} onClick={start} disabled={status === 'drafting'}>
          Start
        </Button>
        <Button size="small" icon={<PauseOutlined />} disabled={status !== 'drafting'} onClick={() => setStatus('paused')}>
          Pause
        </Button>
        <Button size="small" icon={<StopOutlined />} onClick={() => setStatus('idle')}>
          Stop
        </Button>
      </Space>
      <div className="autonomous-log">
        {log.map((l, idx) => (
          <div key={idx} className="log-line">{l}</div>
        ))}
        {log.length === 0 && <Text type="secondary">Generation log will appear here.</Text>}
      </div>
      <Alert
        type="info"
        message="Autonomous Draft runs beat-by-beat with approvals. This is a stub UI; connect backend to generate real prose from outline/style."
        showIcon
      />
    </Space>
  )
}

export function CompanionPanel() {
  const { activeVoice, setSelectionPreview, selectionPreview, setMode } = useCompanionStore()
  const [activeTab, setActiveTab] = useState('actions')

  const selectionStub = 'Selected paragraph will appear here from the editor.'

  return (
    <div className="companion-panel">
      <div className="companion-header">
        <div>
          <Text strong>Companion</Text>
          <div className="companion-sub">In-context drafting + autonomous beats</div>
        </div>
        <Space size={8}>
          <VoiceBadge />
          <RulesPopover />
        </Space>
      </div>

      <div className="voice-select">
        <VoiceSelect />
        <div className="voice-summary">
          <Text type="secondary">{activeVoice.summary}</Text>
        </div>
      </div>

      <div className="selection-preview">
        <Text type="secondary" style={{ fontSize: 12 }}>Selection</Text>
        <div className="selection-box">{selectionPreview || selectionStub}</div>
        <Button size="small" type="link" onClick={() => setSelectionPreview(selectionStub)}>
          Sync selection
        </Button>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={(key) => {
          setActiveTab(key)
          setMode(key as any)
        }}
        size="small"
        items={[
          { key: 'actions', label: 'Actions', children: <ActionMode /> },
          { key: 'chat', label: 'Iterative Chat', children: <ChatMode /> },
          { key: 'autonomous', label: 'Autonomous Draft', children: <AutonomousMode /> },
        ]}
      />
    </div>
  )
}
