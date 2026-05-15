import React from 'react'
import { POSITIONS } from '@/data/positions'

const ICON_EXTEND = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const ICON_COPY = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <rect x="2" y="3" width="6" height="8" rx="1.2" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="6" y="5" width="6" height="8" rx="1.2" stroke="currentColor" strokeWidth="1.5" fill="#0f172a"/>
  </svg>
)
const ICON_CLONE = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 3v8M3 7h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
)
const ICON_DELETE = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2.5 4h9M5.5 4V2.5h3V4M6 6.5v4M8 6.5v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <rect x="3.5" y="4" width="7" height="8.5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
)

export function BulkToolbar({ selectedIds, onAction, onClear }) {
  if (!selectedIds.length) return null

  const selectedRows  = POSITIONS.filter(p => selectedIds.includes(p.id))
  const projectIds    = [...new Set(selectedRows.map(r => r.projectId))]
  const projectCount  = projectIds.length
  const hasOnlyPessimistic = selectedRows.every(r => r.scenario === 'P')
  const hasMixedWithP      = selectedRows.some(r => r.scenario === 'P') && !hasOnlyPessimistic

  // Always include project count per spec
  const label = `${selectedIds.length} row${selectedIds.length !== 1 ? 's' : ''} selected across ${projectCount} project${projectCount !== 1 ? 's' : ''}`

  const deleteTitle = hasOnlyPessimistic
    ? 'Pessimistic bookings cannot be deleted'
    : hasMixedWithP
      ? `Are you sure you want to delete ${selectedRows.filter(r => r.scenario !== 'P').length} Realistic/Optimistic row(s)? Pessimistic lines (bookings) will not be deleted.`
      : undefined

  const btnStyle = (danger) => ({
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '6px 12px', fontSize: 13, fontWeight: 500,
    color: danger ? '#FCA5A5' : '#fff',
    background: 'transparent', border: 'none', cursor: 'pointer',
    borderRadius: 6, transition: 'background 0.12s', whiteSpace: 'nowrap',
  })

  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 30,
      background: 'rgba(15, 23, 42, 0.80)',
      backdropFilter: 'blur(8px)',
      borderRadius: 12,
      boxShadow: '0 20px 48px rgba(0,0,0,0.35)',
      display: 'flex', alignItems: 'center', gap: 2,
      padding: '6px 12px',
      minWidth: 480,
      animation: 'toolbarIn 0.2s cubic-bezier(.22,1,.36,1)',
    }}>
      <style>{`
        @keyframes toolbarIn {
          from { opacity: 0; transform: translateX(-50%) translateY(8px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        .tb-btn:hover { background: rgba(255,255,255,0.08) !important; }
        .tb-btn-danger:hover { background: rgba(239,68,68,0.15) !important; }
      `}</style>

      {/* Count badge + label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingRight: 12, borderRight: '1px solid rgba(255,255,255,0.12)' }}>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: '#0069b4',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, color: '#fff',
          fontFamily: 'IBM Plex Mono, monospace', flexShrink: 0,
        }}>{selectedIds.length}</div>
        <span style={{ fontSize: 13, fontWeight: 500, color: '#fff', whiteSpace: 'nowrap' }}>{label}</span>
      </div>

      {/* Action buttons */}
      <button className="tb-btn" style={btnStyle(false)} onClick={() => onAction('extend')}>
        {ICON_EXTEND} Extend
      </button>
      <button className="tb-btn" style={btnStyle(false)} onClick={() => onAction('copymove')}>
        {ICON_COPY} Copy / Move
      </button>
      <button className="tb-btn" style={btnStyle(false)} onClick={() => onAction('clone')}>
        {ICON_CLONE} Clone
      </button>
      <button
        className={hasOnlyPessimistic ? 'tb-btn' : 'tb-btn tb-btn-danger'}
        style={{
          ...btnStyle(true),
          opacity: hasOnlyPessimistic ? 0.4 : 1,
          cursor: hasOnlyPessimistic ? 'not-allowed' : 'pointer',
        }}
        disabled={hasOnlyPessimistic}
        title={deleteTitle}
        onClick={() => !hasOnlyPessimistic && onAction('delete')}
      >
        {ICON_DELETE} Delete
      </button>

      {/* Divider + Clear */}
      <div style={{ borderLeft: '1px solid rgba(255,255,255,0.12)', marginLeft: 4, paddingLeft: 8 }}>
        <button className="tb-btn" style={{ ...btnStyle(false), color: '#94A3B8', fontSize: 12 }} onClick={onClear}>
          Clear selection
        </button>
      </div>
    </div>
  )
}
