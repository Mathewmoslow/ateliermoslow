import { banList } from './rules'

export interface AuditResult {
  passed: boolean
  flags: string[]
}

export function auditText(text: string): AuditResult {
  const flags: string[] = []

  banList.forEach((term) => {
    if (text.toLowerCase().includes(term)) {
      flags.push(`Contains banned term: "${term}"`)
    }
  })

  return {
    passed: flags.length === 0,
    flags,
  }
}
