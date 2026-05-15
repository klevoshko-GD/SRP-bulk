import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { PROJECTS } from '@/data/projects'

const ICON_DOWNLOAD = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 2v7M4.5 6.5L7 9l2.5-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 10.5v1a.5.5 0 00.5.5h9a.5.5 0 00.5-.5v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

// Looks identical to the ScopeBar <select> but is a custom div (for multi-select support)
const TRIGGER_BASE = {
  fontSize: 13, fontWeight: 500, color: '#0F172A',
  border: '1px solid #E5E7EB', borderRadius: 6,
  padding: '4px 28px 4px 10px', background: '#fff',
  cursor: 'pointer', minWidth: 260, userSelect: 'none',
  display: 'flex', alignItems: 'center',
  backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'><path d='M3 4.5L6 7.5L9 4.5' stroke='%2364748B' stroke-width='1.5' fill='none' stroke-linecap='round'/></svg>")`,
  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center',
  lineHeight: '22px',
}

export function SearchFilterBar({ selectedProjects, onFilterChange }) {
  const selected    = selectedProjects
  const setSelected = onFilterChange
  const [open, setOpen] = useState(false)
  const wrapRef                 = useRef(null)

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const toggle = (id) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const clear = () => setSelected([])

  const label =
    selected.length === 0 ? 'All projects' :
    selected.length === 1 ? PROJECTS.find(p => p.id === selected[0])?.name :
    `${selected.length} projects selected`

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '0 0', height: 48,
    }}>
      {/* Project multi-select */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, position: 'relative' }} ref={wrapRef}>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#94A3B8' }}>Project</span>

          {/* Trigger — looks like a <select> */}
          <div
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            tabIndex={0}
            onClick={() => setOpen(v => !v)}
            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setOpen(v => !v)}
            style={{
              ...TRIGGER_BASE,
              color: selected.length === 0 ? '#94A3B8' : '#0F172A',
            }}
          >
            {label}
          </div>

          {/* Dropdown */}
          {open && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 50,
              background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8,
              boxShadow: '0 10px 24px rgba(0,0,0,0.10)', minWidth: 300, padding: '4px 0',
            }}>
              {/* Options */}
              {PROJECTS.map(p => {
                const checked = selected.includes(p.id)
                return (
                  <div
                    key={p.id}
                    role="option"
                    aria-selected={checked}
                    onClick={() => toggle(p.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '7px 14px', fontSize: 13, cursor: 'pointer',
                      color: checked ? 'var(--color-base-primary, #0069b4)' : '#334155',
                      background: checked ? '#EFF6FF' : 'none',
                      fontWeight: checked ? 500 : 400,
                    }}
                  >
                    {/* Checkbox */}
                    <span style={{
                      width: 14, height: 14, borderRadius: 3, flexShrink: 0,
                      border: checked ? '2px solid var(--color-base-primary, #0069b4)' : '2px solid #CBD5E1',
                      background: checked ? 'var(--color-base-primary, #0069b4)' : '#fff',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {checked && (
                        <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                          <path d="M1 3l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </span>
                    {p.name}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {selected.length > 0 && (
          <Button variant="ghost-secondary" size="sm" onClick={clear}>Clear</Button>
        )}
      </div>

      {/* Download */}
      <Button variant="default" leftIcon={ICON_DOWNLOAD} style={{ borderRadius: 0, height: 40, marginLeft: 'auto' }}>
        Download to Excel
      </Button>
    </div>
  )
}
