import React, { useEffect } from 'react'

export function FullScreenModal({ open, icon, title, subtitle, onClose, sidebar, children, footer }) {
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = prev; document.removeEventListener('keydown', onKey) }
  }, [open, onClose])

  if (!open) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 40, display: 'flex', flexDirection: 'column' }}>
      {/* Backdrop */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(3px)',
        animation: 'mBackdropIn .18s ease-out',
      }} />
      <style>{`
        @keyframes mBackdropIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes mShellIn {
          from { transform: translateY(8px) scale(.995); opacity: .4 }
          to   { transform: translateY(0)   scale(1);    opacity: 1 }
        }
      `}</style>

      {/* Shell */}
      <div style={{
        position: 'relative', zIndex: 1,
        height: '100%', width: '100%',
        background: '#F7F8FA',
        display: 'flex', flexDirection: 'column',
        animation: 'mShellIn .28s cubic-bezier(.22,1,.36,1)',
      }}>
        {/* Header */}
        <header style={{
          display: 'flex', alignItems: 'center', gap: 16,
          padding: '0 28px', background: '#fff',
          borderBottom: '1px solid #E5E7EB', minHeight: 64, flexShrink: 0,
        }}>
          {icon && (
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: '#DBEAFE', color: '#0069b4',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>{icon}</div>
          )}
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em', color: '#0F172A' }}>{title}</div>
            {subtitle && <div style={{ fontSize: 12.5, color: '#64748B', marginTop: 1 }}>{subtitle}</div>}
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center',
              fontFamily: 'IBM Plex Mono, monospace', fontSize: 10.5, fontWeight: 500,
              padding: '2px 6px', borderRadius: 4,
              color: '#64748B', background: '#F1F5F9', border: '1px solid #E5E7EB',
            }}>ESC</span>
            <button onClick={onClose} style={{
              width: 32, height: 32, borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#64748B', background: 'none', border: 'none', cursor: 'pointer',
              transition: 'all .12s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.color = '#0F172A' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#64748B' }}
            aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 14 14"><path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
          </div>
        </header>

        {/* Body */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
          {sidebar && (
            <aside style={{
              width: 320, flexShrink: 0, background: '#FAFBFC',
              borderRight: '1px solid #E5E7EB', overflowY: 'auto', padding: 20,
            }}>
              {sidebar}
            </aside>
          )}
          <main style={{ flex: 1, overflowY: 'auto', padding: '8px 0 24px' }}>
            <div style={{ maxWidth: 880, margin: '0 auto', padding: '0 28px' }}>
              {children}
            </div>
          </main>
        </div>

        {/* Footer */}
        {footer && (
          <footer style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '0 28px', background: '#fff',
            borderTop: '1px solid #E5E7EB', minHeight: 64, flexShrink: 0,
          }}>
            {footer}
          </footer>
        )}
      </div>
    </div>
  )
}
