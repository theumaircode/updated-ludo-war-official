'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Pencil, Shuffle, User } from 'lucide-react'

export interface CommanderProfile {
  name: string
  wins: number
  matches: number
  nameMode: 'random' | 'custom'
  customNames: string[]
}

type ProfilePatch =
  | Partial<CommanderProfile>
  | ((profile: CommanderProfile) => Partial<CommanderProfile>)

const STORAGE_KEY = 'ludo-war-commander-profile'
const MAX_NAME = 12
const DEFAULT_PROFILE: CommanderProfile = {
  name: '',
  wins: 0,
  matches: 0,
  nameMode: 'random',
  customNames: [],
}
const NAME_POOL = [
  'MALAKOR', 'VAELEN', 'XYLAR', 'KAEL', 'NYX', 'ORION', 'DRAVEN',
  'ZEPHYR', 'AURIX', 'SOLAN', 'VEXA', 'THORNE', 'KAIRO', 'LYRA',
]

const cleanName = (value?: string) =>
  (value ?? '').trim().toUpperCase().slice(0, MAX_NAME)

// Commander profile saved on the device, so it survives quitting and reopening the game
export function useCommanderProfile() {
  const [profile, setProfile] = useState<CommanderProfile>(DEFAULT_PROFILE)
  const profileRef = useRef(profile)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const loaded = { ...DEFAULT_PROFILE, ...JSON.parse(raw) }
      profileRef.current = loaded
      setProfile(loaded)
    } catch {}
  }, [])

  const updateProfile = useCallback((patch: ProfilePatch) => {
    const current = profileRef.current
    const next = {
      ...current,
      ...(typeof patch === 'function' ? patch(current) : patch),
    }
    profileRef.current = next
    setProfile(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {}
  }, [])

  return { profile, profileRef, updateProfile }
}

export function buildMatchNames(count: number, profile: CommanderProfile) {
  const pool = [...NAME_POOL].sort(() => Math.random() - 0.5)
  return Array.from({ length: count }, (_, idx) => {
    if (idx === 0) return cleanName(profile.name) || 'YOU'
    const custom =
      profile.nameMode === 'custom' ? cleanName(profile.customNames[idx - 1]) : ''
    return custom || pool[idx - 1]
  })
}

interface PlayerNamesPanelProps {
  profile: CommanderProfile
  onChange: (patch: ProfilePatch) => void
  playerCount: number
}

const inputClass =
  'w-full rounded-lg border border-white/15 bg-black/60 px-3 py-2 font-display text-xs font-bold uppercase tracking-[0.12em] text-white placeholder:text-slate-500 outline-none focus:border-amber-400'

export function PlayerNamesPanel({
  profile,
  onChange,
  playerCount,
}: PlayerNamesPanelProps) {
  const setCustomName = (index: number, value: string) => {
    const next = [...profile.customNames]
    next[index] = value.slice(0, MAX_NAME)
    onChange({ customNames: next })
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-amber-400/30 bg-black/40 p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-display font-bold uppercase tracking-[0.16em] text-amber-300">
          <User className="h-3.5 w-3.5" aria-hidden="true" />
          Commander Profile
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
          {`${profile.wins} Wins · ${profile.matches} Matches`}
        </span>
      </div>

      <input
        aria-label="Your commander name"
        value={profile.name}
        maxLength={MAX_NAME}
        placeholder="Enter your name"
        onChange={(e) => onChange({ name: e.target.value.slice(0, MAX_NAME) })}
        className={inputClass}
      />

      <div
        role="radiogroup"
        aria-label="Other player names"
        className="grid grid-cols-2 gap-1.5"
      >
        {(['random', 'custom'] as const).map((mode) => {
          const active = profile.nameMode === mode
          const Icon = mode === 'random' ? Shuffle : Pencil
          return (
            <button
              key={mode}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange({ nameMode: mode })}
              className={`flex items-center justify-center gap-1.5 rounded-lg border-2 py-1.5 font-display text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                active
                  ? 'bg-amber-500/20 border-amber-400 text-white'
                  : 'bg-black/60 border-white/15 text-slate-400 hover:text-amber-100'
              }`}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              {mode === 'random' ? 'Random Names' : 'Custom Names'}
            </button>
          )
        })}
      </div>

      {profile.nameMode === 'custom' && (
        <div className="grid grid-cols-2 gap-1.5">
          {Array.from({ length: playerCount - 1 }, (_, i) => (
            <input
              key={i}
              aria-label={`Player ${i + 2} name`}
              value={profile.customNames[i] ?? ''}
              maxLength={MAX_NAME}
              placeholder={`Player ${i + 2}`}
              onChange={(e) => setCustomName(i, e.target.value)}
              className={inputClass}
            />
          ))}
        </div>
      )}
    </div>
  )
}
