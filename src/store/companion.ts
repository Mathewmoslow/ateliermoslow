import { create } from 'zustand'
import type { VoiceProfile } from '../companion/voices'
import { voicePresets } from '../companion/voices'

export type CompanionMode = 'actions' | 'chat' | 'autonomous'

export interface Suggestion {
  id: string
  text: string
  auditFlags?: string[]
}

export interface ChatTurn {
  id: string
  role: 'user' | 'assistant'
  text: string
  auditFlags?: string[]
}

interface CompanionState {
  mode: CompanionMode
  activeVoice: VoiceProfile
  loading: boolean
  error: string | null
  suggestions: Suggestion[]
  chat: ChatTurn[]
  selectionPreview: string
  setMode: (mode: CompanionMode) => void
  setVoice: (id: string) => void
  setSelectionPreview: (text: string) => void
  setLoading: (loading: boolean) => void
  setError: (err: string | null) => void
  addSuggestion: (text: string, auditFlags?: string[]) => void
  clearSuggestions: () => void
  addChatTurn: (turn: ChatTurn) => void
  clearChat: () => void
}

export const useCompanionStore = create<CompanionState>((set, get) => ({
  mode: 'actions',
  activeVoice: voicePresets[0],
  loading: false,
  error: null,
  suggestions: [],
  chat: [],
  selectionPreview: '',
  setMode: (mode) => set({ mode }),
  setVoice: (id) => {
    const next = voicePresets.find((v) => v.id === id)
    if (next) set({ activeVoice: next })
  },
  setSelectionPreview: (text) => set({ selectionPreview: text }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  addSuggestion: (text, auditFlags) => {
    const entry: Suggestion = { id: crypto.randomUUID(), text, auditFlags }
    set({ suggestions: [...get().suggestions, entry] })
  },
  clearSuggestions: () => set({ suggestions: [] }),
  addChatTurn: (turn) => set({ chat: [...get().chat, turn] }),
  clearChat: () => set({ chat: [] }),
}))
