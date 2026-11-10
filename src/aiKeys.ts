import { useState } from 'react'

// The viewer's own API keys, kept only in this browser. In dev, keys in .env.local are used
// when none is saved; production builds leave those out.
export type Provider = 'claude' | 'openai'
export const providerNames: Record<Provider, string> = { claude: 'Claude', openai: 'OpenAI' }
// Pexels is not an AI service: its key finds real reference clips for the photo coach.
export type KeyName = Provider | 'pexels'
const storage: Record<KeyName, string> = { claude: 'art-studio-claude-key', openai: 'art-studio-openai-key', pexels: 'art-studio-pexels-key' }
const envKeys: Record<KeyName, string> = {
  claude: import.meta.env.DEV ? import.meta.env.VITE_ANTHROPIC_API_KEY ?? '' : '',
  openai: import.meta.env.DEV ? import.meta.env.VITE_OPENAI_API_KEY ?? '' : '',
  pexels: import.meta.env.DEV ? import.meta.env.VITE_PEXELS_API_KEY ?? '' : '',
}
const readKey = (provider: KeyName) => { try { return localStorage.getItem(storage[provider]) || envKeys[provider] } catch { return envKeys[provider] } }

export function useApiKey(provider: KeyName) {
  const [apiKey, setApiKey] = useState(() => readKey(provider))
  const saveKey = (key: string) => {
    try { localStorage.setItem(storage[provider], key) } catch { /* blocked storage: keep for this session */ }
    setApiKey(key)
  }
  const forgetKey = () => { try { localStorage.removeItem(storage[provider]) } catch { /* ignore */ } setApiKey(envKeys[provider]) }
  return { apiKey, saveKey, forgetKey, fromEnv: apiKey !== '' && apiKey === envKeys[provider] }
}
export const useClaudeKey = () => useApiKey('claude')

// Anthropic keys start with sk-ant-; OpenAI keys start with sk- (often sk-proj-).
export const guessProvider = (key: string): Provider | null => key.startsWith('sk-ant-') ? 'claude' : key.startsWith('sk-') ? 'openai' : null
