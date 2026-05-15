import React, { useState, useRef, useEffect } from 'react'
import { POSITIONS, endDateOf } from '@/data/positions'
import { projectById } from '@/data/projects'

// Matches BadgeStatus colours from badge.css / storybook SRP table
const SCENARIO_COLOR = {
  P: { bg: '#FDECEA', color: '#CE4E45', border: '#F5B8B4' },
  R: { bg: '#FEF6E7', color: '#D9993A', border: '#F5DFA0' },
  O: { bg: '#E6F4EC', color: '#3D854E', border: '#A7D9B8' },
}

// Circle icon matching badge-status__letter style
export function ScenarioDot({ s }) {
  const c = SCENARIO_COLOR[s] || SCENARIO_COLOR.P
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 20, height: 20, borderRadius: '50%',
      background: c.color, color: '#fff',
      fontSize: 10, fontWeight: 700, fontFamily: 'IBM Plex Mono, monospace', flexShrink: 0,
    }}>{s}</span>
  )
}

export function SidebarSummary({ rows, skippedIds = [] }) {
  const pCount = rows.filter(r => r.scenario === 'P').length
  const rCount = rows.filter(r => r.scenario === 'R').length
  const oCount = rows.filter(r => r.scenario === 'O').length
  const projectIds = [...new Set(rows.map(r => r.projectId))]
  const projects = projectIds.map(id => ({ project: projectById(id), count: rows.filter(r => r.projectId === id).length }))

  const pill = (s, n) => {
    const c = SCENARIO_COLOR[s]
    return (
      <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: c.bg, color: c.color, border: `1px solid ${c.border}`, fontFamily: 'IBM Plex Mono, monospace' }}>
        {n} · {s}
      </span>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#64748B', marginBottom: 10 }}>
        Selected rows
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 20, height: 18, padding: '0 6px', background: '#0069b4', color: '#fff', borderRadius: 10, fontSize: 10.5, fontWeight: 600, letterSpacing: 0, fontFamily: 'IBM Plex Mono, monospace' }}>
          {rows.length}
        </span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
        {pCount > 0 && pill('P', pCount)}
        {rCount > 0 && pill('R', rCount)}
        {oCount > 0 && pill('O', oCount)}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 12 }}>
        {projects.length === 1
          ? <span style={{ fontSize: 11.5, fontWeight: 500, color: '#475569', background: '#F1F5F9', border: '1px solid #E5E7EB', borderRadius: 4, padding: '1px 7px' }}>{projects[0].project.name} · {projects[0].project.billingModel}</span>
          : <>
              <span style={{ fontSize: 11, fontWeight: 600, background: '#FEF3C7', color: '#B45309', border: '1px solid #F5D78E', borderRadius: 4, padding: '1px 7px' }}>⚠ {projects.length} projects</span>
              {projects.map(p => (
                <span key={p.project.id} style={{ fontSize: 11, color: '#475569', background: '#F1F5F9', border: '1px solid #E5E7EB', borderRadius: 4, padding: '1px 7px' }}>{p.project.name} · {p.count}</span>
              ))}
            </>}
      </div>

      <div style={{ height: 1, background: '#E5E7EB', marginBottom: 14 }} />

      {rows.map(r => {
        const skipped = skippedIds.includes(r.id)
        return (
          <div key={r.id} style={{
            padding: '10px 12px', background: '#fff', border: '1px solid #E5E7EB',
            borderRadius: 8, marginBottom: 6, opacity: skipped ? 0.5 : 1,
            borderColor: r.onlyPast ? '#F5D78E' : '#E5E7EB',
            background: r.onlyPast ? '#FFFBEB' : '#fff',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ScenarioDot s={r.scenario} />
              <span style={{ fontSize: 13, fontWeight: 500, color: r.employeeName === 'Unassigned' ? '#94A3B8' : '#0F172A', fontStyle: r.employeeName === 'Unassigned' ? 'italic' : 'normal', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {r.employeeName}
              </span>
            </div>
            <div style={{ fontSize: 12, color: '#475569', marginTop: 4, marginLeft: 28, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {r.scenario === 'P'
                ? <><span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: '#94A3B8', marginRight: 4 }}>BOOK</span>{r.bookingProfile}</>
                : r.profile}
            </div>
            <div style={{ fontSize: 11, color: '#64748B', marginTop: 3, marginLeft: 28, fontFamily: 'IBM Plex Mono, monospace' }}>
              ends {endDateOf(r)}
              {r.onlyPast && <span style={{ color: '#B45309', fontWeight: 500, marginLeft: 6 }}>· past only</span>}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function SectionHeader({ n, title, extra }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', gap: 8,
      fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
      color: '#64748B', marginTop: 18, marginBottom: 12,
    }}>
      {n != null && (
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18, borderRadius: 4, background: '#DBEAFE', color: '#0069b4', fontSize: 11, fontWeight: 700 }}>{n}</span>
      )}
      <span>{title}</span>
      {extra && <span style={{ marginLeft: 'auto', textTransform: 'none', letterSpacing: 0, fontSize: 11.5, color: '#94A3B8', fontWeight: 400 }}>{extra}</span>}
    </div>
  )
}

export function Banner({ kind = 'info', children }) {
  const styles = {
    info: { bg: '#F0F9FF', color: '#0369A1', border: '#BAE6FD' },
    warn: { bg: '#FEF3C7', color: '#B45309', border: '#F5D78E' },
    err:  { bg: '#FEE2E2', color: '#B91C1C', border: '#FCA5A5' },
  }
  const s = styles[kind] || styles.info
  return (
    <div style={{ display: 'flex', gap: 10, padding: '10px 12px', borderRadius: 8, fontSize: 13, lineHeight: '18px', border: `1px solid ${s.border}`, background: s.bg, color: s.color, alignItems: 'flex-start', marginBottom: 12 }}>
      <span style={{ flexShrink: 0, marginTop: 1, fontSize: 14 }}>{kind === 'info' ? 'ⓘ' : '⚠'}</span>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  )
}

export function Searchable({ value, options, onChange, placeholder = 'Select…', error, size = 'md', disabled }) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const ref = useRef(null)
  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])
  const filtered = q ? options.filter(o => (typeof o === 'string' ? o : o.label).toLowerCase().includes(q.toLowerCase())) : options
  const label = value == null || value === '' ? '' : (typeof value === 'string' ? value : value.label)
  const pad = size === 'sm' ? '6px 10px' : '8px 12px'
  return (
    <div ref={ref} style={{ position: 'relative', fontSize: 13, opacity: disabled ? 0.5 : 1 }}>
      <button type="button" disabled={disabled} onClick={() => setOpen(v => !v)} style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: pad, fontSize: 13, fontFamily: 'inherit',
        border: `1px solid ${error ? '#B91C1C' : '#E5E7EB'}`,
        borderRadius: 6, background: error ? '#FEF2F2' : '#fff', cursor: disabled ? 'not-allowed' : 'pointer',
        color: label ? '#0F172A' : '#94A3B8',
        boxShadow: error ? '0 0 0 3px #FEE2E2' : 'none',
      }}>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label || placeholder}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" style={{ color: '#94A3B8', flexShrink: 0, marginLeft: 8 }}>
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </svg>
      </button>
      {open && (
        <div style={{ position: 'absolute', top: '105%', left: 0, right: 0, zIndex: 50, background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, boxShadow: '0 10px 24px rgba(0,0,0,0.1)', maxHeight: 256, overflowY: 'auto' }}>
          <div style={{ padding: 8, borderBottom: '1px solid #F1F5F9', background: '#F8FAFC' }}>
            <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Search…" style={{ width: '100%', padding: '6px 10px', fontSize: 12.5, border: '1px solid #E5E7EB', borderRadius: 6, fontFamily: 'inherit' }} />
          </div>
          {filtered.length === 0 && <div style={{ padding: '20px', textAlign: 'center', fontSize: 12, color: '#94A3B8' }}>No matches</div>}
          {filtered.map((o, i) => {
            const val = typeof o === 'string' ? o : o.value
            const lbl = typeof o === 'string' ? o : o.label
            const sel = (typeof value === 'string' ? value : value?.value) === val
            return (
              <button key={i} type="button" onClick={() => { onChange(o); setOpen(false); setQ('') }} style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '7px 12px', fontSize: 13, fontFamily: 'inherit',
                background: sel ? '#DBEAFE' : 'none', color: sel ? '#0069b4' : '#334155',
                fontWeight: sel ? 500 : 400, border: 'none', cursor: 'pointer',
              }}>
                {lbl}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function Segmented({ options, value, onChange }) {
  return (
    <div style={{ display: 'inline-flex', padding: 3, background: '#F1F5F9', borderRadius: 8, gap: 2 }}>
      {options.map(o => (
        <button
          key={o.value}
          onClick={() => !o.disabled && onChange(o.value)}
          disabled={o.disabled}
          style={{
            padding: '6px 14px', borderRadius: 6, fontSize: 13, fontWeight: 500,
            border: 'none', cursor: o.disabled ? 'not-allowed' : 'pointer',
            color: o.disabled ? '#CBD5E1' : value === o.value ? '#0F172A' : '#475569',
            background: value === o.value ? '#fff' : 'transparent',
            boxShadow: value === o.value ? '0 1px 2px rgba(15,23,42,.08)' : 'none',
            transition: 'all .15s',
            opacity: o.disabled ? 0.6 : 1,
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function ModalBtn({ variant = 'ghost', disabled, onClick, children }) {
  const styles = {
    ghost: { background: '#fff', color: '#334155', border: '1px solid #E5E7EB' },
    primary: { background: '#0069b4', color: '#fff', border: '1px solid #0069b4' },
    danger: { background: '#B91C1C', color: '#fff', border: '1px solid #B91C1C' },
  }
  const s = styles[variant] || styles.ghost
  return (
    <button onClick={onClick} disabled={disabled} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '8px 16px', fontSize: 13, fontWeight: 500,
      borderRadius: 6, cursor: disabled ? 'not-allowed' : 'pointer',
      border: s.border, background: disabled ? '#7ab4d9' : s.background,
      color: disabled ? '#fff' : s.color, transition: 'all .12s',
    }}>
      {children}
    </button>
  )
}
