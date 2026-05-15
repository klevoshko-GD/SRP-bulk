import React, { useState, useCallback, useMemo } from 'react'
import { FullScreenModal } from './FullScreenModal'
import { SidebarSummary, SectionHeader, Banner, Searchable, Segmented, ModalBtn, ScenarioDot } from './ModalShared'
import { PROJECTS, SRP_PROFILES, mapProfile, projectById } from '@/data/projects'
import { POSITIONS, endDateOf } from '@/data/positions'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAYS   = Array.from({ length: 31 }, (_, i) => String(i + 1))
const YEARS  = ['2025', '2026', '2027', '2028']

const ALL_EMPLOYEES = [
  'Not Determined',
  'Unassigned',
  ...([...new Set(POSITIONS.map(p => p.employeeName).filter(n => n !== 'Unassigned'))].sort()),
]

const MAX_CLONES = 100

const ICON = (
  <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
    <path d="M7 3v8M3 7h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
)

export function CloneModal({ open, rows, onClose }) {
  const sourceProjectIds = [...new Set(rows.map(r => r.projectId))]
  const singleProject    = sourceProjectIds.length === 1
  const sourceProj       = singleProject ? projectById(sourceProjectIds[0]) : null

  const [targetProject,     setTargetProject]     = useState(singleProject ? { value: sourceProj?.id, label: sourceProj?.name } : null)
  const [counts,            setCounts]            = useState(() => Object.fromEntries(rows.map(r => [r.id, 1])))
  const [defaultScenario,   setDefaultScenario]   = useState('R')
  const [scenarios,         setScenarios]         = useState(() => Object.fromEntries(rows.filter(r => r.scenario === 'P').map(r => [r.id, 'R'])))
  const [allocMode,         setAllocMode]         = useState('source')  // 'source' | 'custom'
  const [allocStart,        setAllocStart]        = useState({ month: 'Jan', day: '1',  year: '2026' })
  const [allocEnd,          setAllocEnd]          = useState({ month: 'Dec', day: '31', year: '2026' })
  const [previewEdits,      setPreviewEdits]      = useState({})

  const hasPessimistic  = rows.some(r => r.scenario === 'P')
  const hasOnlyPast     = rows.some(r => r.onlyPast)
  const totalClones     = Object.values(counts).reduce((s, n) => s + n, 0)
  const tooMany         = totalClones > MAX_CLONES

  // Sync per-row scenario with global default when default changes
  const handleDefaultScenario = (val) => {
    setDefaultScenario(val)
    setScenarios(prev => Object.fromEntries(Object.keys(prev).map(id => [id, val])))
  }

  // Update count and purge stale previewEdits when count decreases
  const updateCount = useCallback((rowId, newCount) => {
    const clamped = Math.max(1, Math.min(MAX_CLONES, newCount))
    setCounts(prev => {
      const oldCount = prev[rowId] || 1
      if (clamped < oldCount) {
        setPreviewEdits(pe => {
          const updated = { ...pe }
          for (let i = clamped; i < oldCount; i++) delete updated[`${rowId}-${i}`]
          return updated
        })
      }
      return { ...prev, [rowId]: clamped }
    })
  }, [])
  const previewRows = useMemo(() => {
    const result = []
    rows.forEach(r => {
      const n      = counts[r.id] || 1
      const mapped = r.scenario === 'P' ? mapProfile(r.bookingProfile) : r.profile
      for (let i = 0; i < n; i++) {
        const key = `${r.id}-${i}`
        result.push({
          key,
          sourceId:      r.id,
          sourceName:    r.employeeName,
          idx:           i,
          scenario:      r.scenario === 'P' ? (scenarios[r.id] || 'R') : r.scenario,
          employeeName:  previewEdits[key]?.employeeName ?? 'Not Determined',
          profile:       previewEdits[key]?.profile ?? mapped ?? null,
          mappingFailed: r.scenario === 'P' && !mapped && !previewEdits[key]?.profile,
          alloc:         previewEdits[key]?.alloc ?? (r.involvement ?? 100),
          skip:          previewEdits[key]?.skip ?? false,
          start:         previewEdits[key]?.start ?? allocStart,
          end:           previewEdits[key]?.end   ?? allocEnd,
          sourceRow:     r,
        })
      }
    })
    return result
  }, [rows, counts, scenarios, previewEdits])

  const updatePreview = (key, patch) =>
    setPreviewEdits(prev => ({ ...prev, [key]: { ...(prev[key] || {}), ...patch } }))

  const skipCount       = previewRows.filter(pr => pr.skip).length
  const effective       = previewRows.length - skipCount
  const unresolvedCount = previewRows.filter(pr => !pr.skip && pr.mappingFailed).length

  const billingWarning = useMemo(() => {
    if (!targetProject) return null
    const tp     = PROJECTS.find(p => p.id === targetProject.value)
    const srcBMs = [...new Set(rows.map(r => projectById(r.projectId)?.billingModel))]
    if (tp && srcBMs.some(bm => bm !== tp.billingModel)) return tp.billingModel
    return null
  }, [targetProject, rows])

  return (
    <FullScreenModal
      open={open} onClose={onClose}
      icon={ICON}
      title="Clone selection"
      subtitle={`${rows.length} source line${rows.length !== 1 ? 's' : ''} · duplicate multiple times within or across projects`}
      sidebar={<SidebarSummary rows={rows} />}
      footer={
        <>
          <ModalBtn variant="ghost" onClick={onClose}>Cancel</ModalBtn>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            {tooMany && <span style={{ fontSize: 12, color: '#B91C1C', fontWeight: 500 }}>Max {MAX_CLONES} clones at a time</span>}
            {unresolvedCount > 0 && !tooMany && <span style={{ fontSize: 12, color: '#B91C1C', fontWeight: 500 }}>{unresolvedCount} line{unresolvedCount !== 1 ? 's' : ''} need profile</span>}
            <span style={{ fontSize: 12, color: tooMany ? '#B91C1C' : '#64748B' }}>{totalClones} / {MAX_CLONES} clones</span>
            <ModalBtn variant="primary" disabled={tooMany || unresolvedCount > 0 || effective === 0}>
              Clone {effective} line{effective !== 1 ? 's' : ''}
            </ModalBtn>
          </div>
        </>
      }
    >
      <SectionHeader n={1} title="Pre-configuration" extra="set copy counts and target scenarios" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {billingWarning && (
          <Banner kind="warn">
            Rate / Weight / Monthly fee values will be omitted due to a billing model mismatch with <strong>{billingWarning}</strong>.
          </Banner>
        )}

        {/* Target project */}
        <div>
          <label style={{ display: 'block', fontSize: 11.5, fontWeight: 500, color: '#64748B', marginBottom: 4 }}>
            Target project
          </label>
          <Searchable
            value={singleProject ? targetProject : null}
            options={PROJECTS.map(p => ({ value: p.id, label: p.name }))}
            placeholder={singleProject ? '' : 'Clones created in respective source projects'}
            onChange={setTargetProject}
            disabled={!singleProject}
            size="sm"
          />
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
                value={defaultScenario}
                onChange={handleDefaultScenario}
              />
            </div>
          )}
        </div>

        {/* Per-row table: SC. | EMPLOYEE | PROFILE | TARGET SCENARIO | ALLOC % | COPIES */}
        <style>{`
          .clone-copies-input::-webkit-outer-spin-button,
          .clone-copies-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
          .clone-copies-input { -moz-appearance: textfield; }
        `}</style>
        <div style={{ borderRadius: 8, border: '1px solid #E5E7EB', overflow: 'hidden' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '44px 1fr 1fr 130px 70px 110px',
            padding: '8px 12px', fontSize: 10.5, textTransform: 'uppercase',
            letterSpacing: '0.06em', color: '#64748B', fontWeight: 600,
            background: '#F8FAFC', borderBottom: '1px solid #E5E7EB',
          }}>
            <div>Sc.</div><div>Employee</div><div>Profile</div>
            <div>Target scenario</div><div>Alloc %</div><div style={{ textAlign: 'center' }}>Copies</div>
          </div>

          {rows.map(r => {
            const profile = r.scenario === 'P' ? r.bookingProfile : r.profile
            return (
              <div key={r.id} style={{
                display: 'grid', gridTemplateColumns: '44px 1fr 1fr 130px 70px 110px',
                padding: '10px 12px', borderTop: '1px solid #F1F5F9',
                alignItems: 'center', background: '#fff',
              }}>
                <ScenarioDot s={r.scenario} />
                <div style={{ paddingRight: 8 }}>
                  <div style={{ fontSize: 13, color: r.employeeName === 'Unassigned' ? '#94A3B8' : '#0F172A', fontStyle: r.employeeName === 'Unassigned' ? 'italic' : 'normal' }}>
                    {r.employeeName}
                  </div>
                  <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>ends {endDateOf(r)}</div>
                </div>
                <div style={{ fontSize: 12.5, color: '#475569', paddingRight: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {profile}
                </div>
                <div>
                  {r.scenario === 'P'
                    ? <Searchable
                        value={{ value: scenarios[r.id] || 'R', label: scenarios[r.id] === 'O' ? 'Optimistic' : 'Realistic' }}
                        options={[{ value: 'R', label: 'Realistic' }, { value: 'O', label: 'Optimistic' }]}
                        onChange={o => setScenarios(prev => ({ ...prev, [r.id]: typeof o === 'string' ? o : o.value }))}
                        size="sm"
                      />
                    : <span style={{ fontSize: 12, color: '#94A3B8' }}>—</span>
                  }
                </div>
                {/* Alloc % */}
                <div style={{ fontSize: 12, color: '#64748B', fontFamily: 'IBM Plex Mono, monospace' }}>
                  {r.involvement ?? 100}%
                </div>
                {/* Stepper */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, border: `1px solid ${tooMany ? '#FCA5A5' : '#E5E7EB'}`, borderRadius: 6, overflow: 'hidden', margin: '0 auto', width: 'fit-content' }}>
                  <button type="button"
                    onClick={() => updateCount(r.id, (counts[r.id] || 1) - 1)}
                    style={{ width: 30, height: 32, fontSize: 16, background: '#F8FAFC', border: 'none', borderRight: '1px solid #E5E7EB', cursor: 'pointer', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    −
                  </button>
                  <input className="clone-copies-input" type="number" min={1} max={100} value={counts[r.id]}
                    onChange={e => updateCount(r.id, Number(e.target.value))}
                    style={{ width: 32, padding: '5px 4px', fontSize: 13, border: 'none', textAlign: 'center', fontFamily: 'IBM Plex Mono, monospace', outline: 'none', background: '#fff' }} />
                  <button type="button"
                    onClick={() => updateCount(r.id, (counts[r.id] || 1) + 1)}
                    style={{ width: 30, height: 32, fontSize: 16, background: '#F8FAFC', border: 'none', borderLeft: '1px solid #E5E7EB', cursor: 'pointer', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    +
                  </button>
                </div>
              </div>
            )
          })}

          {/* Total row */}
          <div style={{ padding: '8px 12px', background: '#F8FAFC', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#64748B' }}>Total clones across all lines</span>
            <span style={{ fontSize: 12, color: tooMany ? '#B91C1C' : '#64748B', fontWeight: 600, fontFamily: 'IBM Plex Mono, monospace' }}>
              {totalClones} / {MAX_CLONES}
            </span>
          </div>
        </div>
      </div>

      <SectionHeader
        n={2}
        title="Preview & Metadata Overrides"
        extra={`${previewRows.length} line${previewRows.length !== 1 ? 's' : ''} to be created · staff each clone individually`}
      />

      {hasPessimistic && (
        <Banner kind="warn">Past-month allocations will be cleared for clones of Pessimistic lines.</Banner>
      )}

      {hasOnlyPast && (
        <Banner kind="warn">Some selected lines have allocations only in past months. Clones of these lines will have no active allocation grid.</Banner>
      )}

      {/* Preview table: SC. | SOURCE | EMPLOYEE | PROFILE | [START | END] | ALLOC % | Skip */}
      <div style={{ borderRadius: 8, border: '1px solid #E5E7EB', background: '#fff', overflow: 'hidden' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: allocMode === 'custom' ? '50px 130px 1fr 1fr 130px 130px 60px 50px' : '60px 160px 1fr 1fr 70px 60px',
          padding: '8px 12px', fontSize: 10.5, textTransform: 'uppercase',
          letterSpacing: '0.06em', color: '#64748B', fontWeight: 600,
          background: '#F8FAFC', borderBottom: '1px solid #E5E7EB',
        }}>
          <div>Sc.</div><div>Source</div><div>Employee</div><div>Profile</div>
          {allocMode === 'custom' && <div>Start</div>}
          {allocMode === 'custom' && <div>End</div>}
          <div>Alloc %</div><div style={{ textAlign: 'center' }} />
        </div>

        {previewRows.map(pr => {
          const hasError = pr.mappingFailed && !pr.skip
          return (
            <div key={pr.key} style={{
              display: 'grid',
              gridTemplateColumns: allocMode === 'custom' ? '50px 130px 1fr 1fr 130px 130px 60px 50px' : '60px 160px 1fr 1fr 70px 60px',
              padding: '8px 12px', borderTop: '1px solid #F1F5F9', alignItems: 'center',
              background: hasError ? '#FEF2F2' : pr.sourceRow?.onlyPast ? '#FFFBEB' : '#fff',
              opacity: pr.skip ? 0.45 : 1,
            }}>
              <ScenarioDot s={pr.scenario} />

              {/* Source */}
              <div style={{ fontSize: 12, color: '#94A3B8', paddingRight: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                from {pr.sourceName}
              </div>

              {/* Employee */}
              <div style={{ paddingRight: 8 }}>
                <Searchable
                  value={pr.employeeName}
                  options={ALL_EMPLOYEES}
                  onChange={o => updatePreview(pr.key, { employeeName: typeof o === 'string' ? o : o.value })}
                  size="sm"
                />
              </div>

              {/* Profile */}
              <div style={{ paddingRight: 8 }}>
                <Searchable
                  value={pr.profile}
                  options={SRP_PROFILES}
                  onChange={o => updatePreview(pr.key, { profile: typeof o === 'string' ? o : o.value, mappingFailed: false })}
                  error={hasError}
                  size="sm"
                />
                {hasError && <div style={{ fontSize: 10.5, color: '#B91C1C', marginTop: 2 }}>⚠ Select profile</div>}
              </div>

              {/* Per-clone start date */}
              {allocMode === 'custom' && (
                <div style={{ paddingRight: 4 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 72px', gap: 4 }}>
                    <Searchable value={pr.start.month} options={MONTHS} onChange={o => updatePreview(pr.key, { start: { ...pr.start, month: typeof o === 'string' ? o : o.value } })} size="sm" />
                    <Searchable value={pr.start.year}  options={YEARS}  onChange={o => updatePreview(pr.key, { start: { ...pr.start, year:  typeof o === 'string' ? o : o.value } })} size="sm" />
                  </div>
                </div>
              )}

              {/* Per-clone end date */}
              {allocMode === 'custom' && (
                <div style={{ paddingRight: 4 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 72px', gap: 4 }}>
                    <Searchable value={pr.end.month} options={MONTHS} onChange={o => updatePreview(pr.key, { end: { ...pr.end, month: typeof o === 'string' ? o : o.value } })} size="sm" />
                    <Searchable value={pr.end.year}  options={YEARS}  onChange={o => updatePreview(pr.key, { end: { ...pr.end, year:  typeof o === 'string' ? o : o.value } })} size="sm" />
                  </div>
                </div>
              )}

              {/* Alloc % */}
              <div>
                <input
                  type="number" min={1} max={100}
                  value={pr.alloc}
                  onChange={e => updatePreview(pr.key, { alloc: Math.min(100, Math.max(1, Number(e.target.value))) })}
                  style={{
                    width: 54, padding: '4px 6px', fontSize: 12,
                    border: '1px solid #E5E7EB', borderRadius: 5,
                    fontFamily: 'IBM Plex Mono, monospace',
                    textAlign: 'right',
                  }}
                />
              </div>

              {/* Skip */}
              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={() => updatePreview(pr.key, { skip: !pr.skip })}
                  style={{ fontSize: 12, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', color: pr.skip ? '#64748B' : '#B91C1C' }}
                >
                  {pr.skip ? 'Undo' : 'Skip'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </FullScreenModal>
  )
}
