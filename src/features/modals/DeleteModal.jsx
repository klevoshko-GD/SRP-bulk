import React from 'react'
import { FullScreenModal } from './FullScreenModal'
import { SidebarSummary, SectionHeader, Banner, ModalBtn, ScenarioDot } from './ModalShared'
import { endDateOf } from '@/data/positions'

const ICON = (
  <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
    <path d="M2 4h10M5 4V2.5h4V4M5.5 6.5v4M8.5 6.5v4M3 4l.7 7.5A1 1 0 0 0 4.7 12.5h4.6a1 1 0 0 0 1-.9L11 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export function DeleteModal({ open, rows, onClose, onConfirm }) {
  const payload   = rows.filter(r => r.scenario !== 'P')
  const pRows     = rows.filter(r => r.scenario === 'P')
  const effective = payload.length

  return (
    <FullScreenModal
      open={open} onClose={onClose}
      icon={ICON}
      title="Delete selection"
      subtitle={`${rows.length} line${rows.length !== 1 ? 's' : ''} selected · Pessimistic bookings are excluded`}
      sidebar={<SidebarSummary rows={rows} />}
      footer={
        <>
          {/* Cancel keeps selection intact */}
          <ModalBtn variant="ghost" onClick={onClose}>Cancel</ModalBtn>
          <div style={{ marginLeft: 'auto' }}>
            <ModalBtn
              variant="danger"
              disabled={effective === 0}
              onClick={() => onConfirm(payload.map(r => r.id))}
            >
              Delete {effective} line{effective !== 1 ? 's' : ''}
            </ModalBtn>
          </div>
        </>
      }
    >
      <SectionHeader n={1} title="Confirmation" />

      {pRows.length > 0 && (
        <Banner kind="warn">
          <strong>{pRows.length} Pessimistic booking{pRows.length !== 1 ? 's' : ''} will not be deleted</strong> — Pessimistic lines are managed through the booking system and cannot be removed here.
        </Banner>
      )}

      {effective === 0 ? (
        <Banner kind="err">
          No deletable lines in the selection. All selected rows are Pessimistic bookings.
        </Banner>
      ) : (
        <Banner kind="err">
          This action is <strong>permanent and cannot be undone.</strong> The following {effective} line{effective !== 1 ? 's' : ''} will be deleted.
        </Banner>
      )}

      <div style={{ borderRadius: 8, border: '1px solid #E5E7EB', background: '#fff', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1fr 140px', padding: '8px 12px', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748B', fontWeight: 600, background: '#F8FAFC', borderBottom: '1px solid #E5E7EB' }}>
          <div>Sc.</div><div>Employee</div><div>Profile</div><div>End date</div>
        </div>

        {rows.map(r => {
          const excluded = r.scenario === 'P'
          return (
            <div key={r.id} style={{
              display: 'grid', gridTemplateColumns: '60px 1fr 1fr 140px',
              padding: '10px 12px', borderTop: '1px solid #F1F5F9', alignItems: 'center',
              background: excluded ? '#FFFBEB' : '#FEF2F2',
              opacity: excluded ? 0.6 : 1,
            }}>
              <ScenarioDot s={r.scenario} />
              <div style={{ fontSize: 13, color: excluded ? '#B45309' : '#0F172A', paddingRight: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {r.employeeName}
              </div>
              <div style={{ fontSize: 12.5, color: '#475569', paddingRight: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {r.scenario === 'P' ? r.bookingProfile : r.profile}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, color: '#64748B', fontFamily: 'IBM Plex Mono, monospace' }}>
                  ends {endDateOf(r)}
                </span>
                {excluded && (
                  <span style={{ fontSize: 10.5, fontWeight: 500, color: '#B45309', background: '#FEF3C7', border: '1px solid #F5D78E', borderRadius: 4, padding: '1px 6px' }}>excluded</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </FullScreenModal>
  )
}
