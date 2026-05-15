import React, { useState, useMemo, useEffect } from 'react'
import { FullScreenModal } from './FullScreenModal'
import { SidebarSummary, SectionHeader, Banner, Searchable, Segmented, ModalBtn, ScenarioDot } from './ModalShared'
import { PROJECTS, SRP_PROFILES, mapProfile, projectById } from '@/data/projects'

const YEARS  = ['2025', '2026', '2027', '2028']
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAYS   = Array.from({ length: 31 }, (_, i) => String(i + 1))

const INFO_ICON = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.25"/>
    <path d="M8 7v4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
    <circle cx="8" cy="5" r="0.75" fill="currentColor"/>
  </svg>
)

const ICON = (
  <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
    <rect x="2" y="3" width="6" height="8" rx="1.2" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="6" y="5" width="6" height="8" rx="1.2" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
)

export function CopyMoveModal({ open, rows, onClose }) {
  const sourceProjectIds = [...new Set(rows.map(r => r.projectId))]
  const singleProject    = sourceProjectIds.length === 1
  const sourceProj       = singleProject ? projectById(sourceProjectIds[0]) : null

  const [mode,           setMode]           = useState('copy')   // 'copy' | 'move'
  const [targetProject,  setTargetProject]  = useState(singleProject ? { value: sourceProj?.id, label: sourceProj?.name } : null)
  const [targetYear,     setTargetYear]     = useState('2026')
  const [globalScenario, setGlobalScenario] = useState('R')
  const handleGlobalScenario = (val) => {
    setGlobalScenario(val)
    setLines(prev => prev.map((l, i) => rows[i].scenario === 'P' ? { ...l, scenario: val } : l))
  }
  const [allocMode,      setAllocMode]      = useState('source')  // 'source' | 'custom'
  const [allocStart,     setAllocStart]     = useState({ month: 'Jan', day: '1',  year: '2026' })
  const [allocEnd,       setAllocEnd]       = useState({ month: 'Dec', day: '31', year: '2026' })

  const hasPessimistic = rows.some(r => r.scenario === 'P')

  // Auto-populate custom dates when target year changes
  useEffect(() => {
    const currentYear = String(new Date().getFullYear())
    if (targetYear === currentYear) {
      const d = new Date(); d.setMonth(d.getMonth() + 1)
      setAllocStart({ month: MONTHS[d.getMonth()], day: '1', year: targetYear })
    } else {
      setAllocStart({ month: 'Jan', day: '1', year: targetYear })
    }
    setAllocEnd({ month: 'Dec', day: '31', year: targetYear })
  }, [targetYear])

  const initial = rows.map(r => {
    const mapped = r.scenario === 'P' ? mapProfile(r.bookingProfile) : null
    return {
      id:            r.id,
      employeeName:  r.employeeName,
      bookingProfile: r.bookingProfile,
      profile:       r.scenario === 'P' ? mapped : r.profile,
      mappingFailed: r.scenario === 'P' && !mapped,
      scenario:      r.scenario === 'P' ? 'R' : r.scenario,
      originalScenario: r.scenario,
      alloc:         r.involvement ?? 100,
      skip:          false,
      start:         { month: allocStart.month, day: allocStart.day, year: allocStart.year },
      end:           { month: allocEnd.month,   day: allocEnd.day,   year: allocEnd.year   },
    }
  })
  const [lines, setLines] = useState(initial)

  // Sync per-row dates when global alloc dates change
  useEffect(() => {
    setLines(prev => prev.map(l => ({ ...l, start: allocStart, end: allocEnd })))
  }, [allocStart, allocEnd])
  const updateLine = (id, patch) =>
    setLines(prev => prev.map(l => l.id === id ? { ...l, ...patch } : l))

  const skipCount    = lines.filter(l => l.skip).length
  const effective    = lines.length - skipCount
  const skippedIds   = lines.filter(l => l.skip).map(l => l.id)
  const pLinesCount  = lines.filter((l, i) => !l.skip && rows[i].scenario === 'P').length
  const unresolvedCount = lines.filter(l => !l.skip && l.mappingFailed && !l.profile).length

  const billingWarning = useMemo(() => {
    if (!targetProject) return null
    const tp = PROJECTS.find(p => p.id === targetProject.value)
    const srcBMs = [...new Set(rows.map(r => projectById(r.projectId)?.billingModel))]
    if (tp && srcBMs.some(bm => bm !== tp.billingModel)) return tp.billingModel
    return null
  }, [targetProject, rows])

  const ctaLabel = `${mode === 'copy' ? 'Copy' : 'Move'} ${effective} line${effective !== 1 ? 's' : ''}`

  return (
    <FullScreenModal
      open={open} onClose={onClose}
      icon={ICON}
      title="Copy / Move selection"
      subtitle={`${rows.length} line${rows.length !== 1 ? 's' : ''} · duplicate or relocate positions across projects and years`}
      sidebar={<SidebarSummary rows={rows} skippedIds={skippedIds} />}
      footer={
        <>
          <ModalBtn variant="ghost" onClick={onClose}>Cancel</ModalBtn>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            {unresolvedCount > 0 && (
              <span style={{ fontSize: 12, color: '#B91C1C', fontWeight: 500 }}>
                {unresolvedCount} line{unresolvedCount !== 1 ? 's' : ''} need profile
              </span>
            )}
            <ModalBtn variant="primary" disabled={unresolvedCount > 0 || effective === 0}>
              {ctaLabel}
            </ModalBtn>
          </div>
        </>
      }
    >
      <SectionHeader n={1} title="Pre-configuration" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {billingWarning && (
          <Banner kind="warn">
            Rate / Weight / Monthly fee values will be omitted due to a billing model mismatch with <strong>{billingWarning}</strong>.
          </Banner>
        )}

        {/* Mode row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11.5, fontWeight: 500, color: '#64748B' }}>Mode</span>
          <Segmented
            options={[
              { value: 'copy', label: 'Copy' },
              { value: 'move', label: 'Move' },
            ]}
            value={mode}
            onChange={setMode}
          />
        </div>
        {pLinesCount > 0 && mode === 'move' && (
          <Banner kind="warn">
            <strong>Pessimistic bookings will not be removed from the source</strong> — they are managed through the booking system. Only Realistic/Optimistic lines will be moved.
          </Banner>
        )}

        {/* Target project + Target year */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11.5, fontWeight: 500, color: '#64748B', marginBottom: 4 }}>
              Target project
            </label>
            <Searchable
              value={targetProject}
              options={PROJECTS.map(p => ({ value: p.id, label: p.name }))}
              placeholder="Select target project…"
              onChange={setTargetProject}
              size="sm"
            />
            {!singleProject && (
              <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>
                Lines from multiple projects will be merged into this target.
              </div>
            )}
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11.5, fontWeight: 500, color: '#64748B', marginBottom: 4 }}>
              Target year
            </label>
            <Searchable
              value={targetYear}
              options={YEARS}
              onChange={o => setTargetYear(typeof o === 'string' ? o : o.value)}
              size="sm"
            />
          </div>
        </div>

        {/* Allocation grid + Target scenario (side by side) */}
        <div style={{ display: 'grid', gridTemplateColumns: hasPessimistic ? '1fr 1fr' : '1fr', gap: 12, alignItems: 'start' }}>
          {/* Left: Allocation grid */}
          <div>
            <label style={{ display: 'block', fontSize: 11.5, fontWeight: 500, color: '#64748B', marginBottom: 6 }}>
              Allocation grid
            </label>
            <Segmented
              options={[{ value: 'source', label: 'Keep source grid' }, { value: 'custom', label: 'Custom dates' }]}
              value={allocMode}
              onChange={setAllocMode}
            />
            {allocMode === 'custom' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: '#64748B', marginBottom: 4 }}>Start date</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 84px', gap: 6 }}>
                    <Searchable value={allocStart.month} options={MONTHS} onChange={o => setAllocStart(s => ({ ...s, month: typeof o === 'string' ? o : o.value }))} size="sm" />
                    <Searchable value={allocStart.day}   options={DAYS}   onChange={o => setAllocStart(s => ({ ...s, day:   typeof o === 'string' ? o : o.value }))} size="sm" />
                    <Searchable value={allocStart.year}  options={YEARS}  onChange={o => setAllocStart(s => ({ ...s, year:  typeof o === 'string' ? o : o.value }))} size="sm" />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: '#64748B', marginBottom: 4 }}>End date</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 84px', gap: 6 }}>
                    <Searchable value={allocEnd.month} options={MONTHS} onChange={o => setAllocEnd(s => ({ ...s, month: typeof o === 'string' ? o : o.value }))} size="sm" />
                    <Searchable value={allocEnd.day}   options={DAYS}   onChange={o => setAllocEnd(s => ({ ...s, day:   typeof o === 'string' ? o : o.value }))} size="sm" />
                    <Searchable value={allocEnd.year}  options={YEARS}  onChange={o => setAllocEnd(s => ({ ...s, year:  typeof o === 'string' ? o : o.value }))} size="sm" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Target scenario — only when pessimistic rows present */}
          {hasPessimistic && (
            <div>
              <label style={{ display: 'block', fontSize: 11.5, fontWeight: 500, color: '#64748B', marginBottom: 2 }}>
                Target scenario for Pessimistic lines
              </label>
              <div style={{ fontSize: 11, color: '#64748B', marginBottom: 6 }}>
                Applies to all bookings · override per row below.
              </div>
              <Segmented
                options={[{ value: 'R', label: 'Realistic' }, { value: 'O', label: 'Optimistic' }]}
                value={globalScenario}
                onChange={handleGlobalScenario}
              />
            </div>
          )}
        </div>
      </div>

      <SectionHeader n={2} title="Preview" extra={`${effective} line${effective !== 1 ? 's' : ''} will be created`} />

      {/* Preview table */}
      <div style={{ borderRadius: 8, border: '1px solid #E5E7EB', background: '#fff', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: allocMode === 'custom' ? '50px 1fr 1fr 130px 130px 55px 60px 50px' : '70px 1fr 1fr 70px 70px 60px',
          padding: '8px 12px', fontSize: 10.5, textTransform: 'uppercase',
          letterSpacing: '0.06em', color: '#64748B', fontWeight: 600,
          background: '#F8FAFC', borderBottom: '1px solid #E5E7EB',
        }}>
          <div>Sc.</div>
          <div>Employee</div>
          <div>Profile (Target)</div>
          {allocMode === 'custom' && <div>Start</div>}
          {allocMode === 'custom' && <div>End</div>}
          <div>Year</div>
          <div>Alloc %</div>
          <div style={{ textAlign: 'center' }} />
        </div>

        {rows.map((r, i) => {
          const l         = lines[i]
          const hasError  = l.mappingFailed && !l.profile && !l.skip
          const isP       = r.scenario === 'P'

          return (
            <div
              key={r.id}
              style={{
                display: 'grid',
                gridTemplateColumns: allocMode === 'custom' ? '50px 1fr 1fr 130px 130px 55px 60px 50px' : '70px 1fr 1fr 70px 70px 60px',
                padding: '10px 12px', borderTop: '1px solid #F1F5F9',
                alignItems: 'start',
                background: hasError ? '#FEF2F2' : '#fff',
                opacity: l.skip ? 0.45 : 1,
              }}
            >
              {/* Sc. */}
              <div style={{ paddingTop: 6 }}>
                {isP
                  ? <Searchable
                      value={l.scenario}
                      options={[{ value: 'R', label: 'R' }, { value: 'O', label: 'O' }]}
                      onChange={o => updateLine(r.id, { scenario: typeof o === 'string' ? o : o.value })}
                      size="sm"
                    />
                  : <ScenarioDot s={r.scenario} />
                }
              </div>

              {/* Employee */}
              <div style={{ paddingRight: 8 }}>
                <Searchable
                  value={l.employeeName}
                  options={[r.employeeName, 'Unassigned', 'Not Determined']}
                  onChange={o => updateLine(r.id, { employeeName: typeof o === 'string' ? o : o.value })}
                  size="sm"
                />
              </div>

              {/* Profile (Target) */}
              <div style={{ paddingRight: 8 }}>
                <Searchable
                  value={l.profile}
                  options={SRP_PROFILES}
                  onChange={o => updateLine(r.id, { profile: typeof o === 'string' ? o : o.value, mappingFailed: false })}
                  error={hasError}
                  size="sm"
                />
                {isP && l.bookingProfile && !l.mappingFailed && (
                  <div style={{ fontSize: 10.5, color: '#94A3B8', marginTop: 3 }}>
                    mapped from {l.bookingProfile.split(' / ').join(' / ')}
                  </div>
                )}
                {hasError && (
                  <div style={{ fontSize: 10.5, color: '#B91C1C', marginTop: 2 }}>⚠ Mapping failed</div>
                )}
              </div>

              {/* Per-row start date */}
              {allocMode === 'custom' && (
                <div style={{ paddingRight: 4 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 72px', gap: 4 }}>
                    <Searchable value={l.start.month} options={MONTHS} onChange={o => updateLine(r.id, { start: { ...l.start, month: typeof o === 'string' ? o : o.value } })} size="sm" />
                    <Searchable value={l.start.year}  options={YEARS}  onChange={o => updateLine(r.id, { start: { ...l.start, year:  typeof o === 'string' ? o : o.value } })} size="sm" />
                  </div>
                </div>
              )}

              {/* Per-row end date */}
              {allocMode === 'custom' && (
                <div style={{ paddingRight: 4 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 72px', gap: 4 }}>
                    <Searchable value={l.end.month} options={MONTHS} onChange={o => updateLine(r.id, { end: { ...l.end, month: typeof o === 'string' ? o : o.value } })} size="sm" />
                    <Searchable value={l.end.year}  options={YEARS}  onChange={o => updateLine(r.id, { end: { ...l.end, year:  typeof o === 'string' ? o : o.value } })} size="sm" />
                  </div>
                </div>
              )}

              {/* Year */}
              <div style={{ paddingTop: 6, fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: '#64748B' }}>
                {targetYear}
              </div>

              {/* Alloc % */}
              <div style={{ paddingTop: 4 }}>
                <input
                  type="number" min={1} max={100}
                  value={l.alloc}
                  onChange={e => updateLine(r.id, { alloc: Math.min(100, Math.max(1, Number(e.target.value))) })}
                  style={{
                    width: 54, padding: '4px 6px', fontSize: 12,
                    border: '1px solid #E5E7EB', borderRadius: 5,
                    fontFamily: 'IBM Plex Mono, monospace',
                    textAlign: 'right',
                  }}
                />
              </div>

              {/* Skip */}
              <div style={{ textAlign: 'center', paddingTop: 6 }}>
                <button
                  onClick={() => updateLine(r.id, { skip: !l.skip })}
                  style={{
                    fontSize: 12, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer',
                    color: l.skip ? '#64748B' : '#B91C1C',
                  }}
                >
                  {l.skip ? 'Undo' : 'Skip'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </FullScreenModal>
  )
}
