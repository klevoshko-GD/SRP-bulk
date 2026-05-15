import React, { useState, useEffect, useMemo } from 'react'
import { FullScreenModal } from './FullScreenModal'
import { SidebarSummary, SectionHeader, Banner, Searchable, Segmented, ModalBtn, ScenarioDot } from './ModalShared'
import { PROJECTS, SRP_PROFILES, mapProfile, projectById } from '@/data/projects'
import { endDateOf } from '@/data/positions'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAYS   = Array.from({ length: 31 }, (_, i) => String(i + 1))
const YEARS  = ['2026','2027','2028']

const ICON = (
  <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
    <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export function ExtendModal({ open, rows, onClose }) {
  const sourceProjectIds = [...new Set(rows.map(r => r.projectId))]
  const singleProject = sourceProjectIds.length === 1
  const sourceProj = singleProject ? projectById(sourceProjectIds[0]) : null
  const hasPessimistic = rows.some(r => r.scenario === 'P')

  const [globalScenario, setGlobalScenario] = useState('R')
  const [newEndMonth, setNewEndMonth] = useState('Dec')
  const [newEndDay,   setNewEndDay]   = useState('31')
  const [newEndYear,  setNewEndYear]  = useState('2026')
  const [targetProject, setTargetProject] = useState(singleProject ? { value: sourceProj?.id, label: sourceProj?.name } : null)

  const initial = rows.map(r => {
    const mapped = r.scenario === 'P' ? mapProfile(r.bookingProfile) : null
    return {
      id: r.id,
      profile: r.scenario === 'P' ? mapped : r.profile,
      mappingFailed: r.scenario === 'P' && !mapped,
      scenario: r.scenario === 'P' ? 'R' : r.scenario,
      alloc: r.involvement ?? 100,
      skip: false,
    }
  })
  const [lines, setLines] = useState(initial)

  useEffect(() => {
    setLines(prev => prev.map((l, i) => rows[i].scenario === 'P' ? { ...l, scenario: globalScenario } : l))
  }, [globalScenario])

  const updateLine = (id, patch) => setLines(prev => prev.map(l => l.id === id ? { ...l, ...patch } : l))

  const unresolvedCount = lines.filter((l, i) => !l.skip && rows[i].scenario === 'P' && !l.profile).length
  const skipCount = lines.filter(l => l.skip).length
  const effective = lines.length - skipCount
  const skippedIds = lines.filter(l => l.skip).map(l => l.id)

  // Validate: new end date must be strictly after every source row's end date
  const MONTH_IDX = { Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11 }
  const toOrd = (m, y) => parseInt(y) * 12 + (MONTH_IDX[m] ?? 0)
  const newEndOrd = toOrd(newEndMonth, newEndYear)
  const endDateError = rows.some(r => {
    const [srcM, srcY] = endDateOf(r).split(' ')
    return newEndOrd <= toOrd(srcM, srcY)
  })

  return (
    <FullScreenModal
      open={open} onClose={onClose}
      icon={ICON}
      title="Extend selection"
      subtitle={`${rows.length} line${rows.length !== 1 ? 's' : ''} · converts Pessimistic bookings into Prospective position opportunities`}
      sidebar={<SidebarSummary rows={rows} skippedIds={skippedIds} />}
      footer={
        <>
          <ModalBtn variant="ghost" onClick={onClose}>Cancel</ModalBtn>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            {endDateError && (
              <span style={{ fontSize: 12, color: '#B91C1C', fontWeight: 500 }}>
                End date must be after source booking end
              </span>
            )}
            {unresolvedCount > 0 && (
              <span style={{ fontSize: 12, color: '#B91C1C', fontWeight: 500 }}>
                {unresolvedCount} line{unresolvedCount !== 1 ? 's' : ''} need profile
              </span>
            )}
            <ModalBtn variant="primary" disabled={endDateError || unresolvedCount > 0 || effective === 0}>
              Extend {effective} line{effective !== 1 ? 's' : ''}
              {skipCount > 0 && <span style={{ opacity: 0.7, marginLeft: 4 }}>· Skip {skipCount}</span>}
            </ModalBtn>
          </div>
        </>
      }
    >
      <SectionHeader n={1} title="Pre-configuration" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {!singleProject && (
          <Banner kind="info">
            <strong>You selected lines from multiple projects.</strong> Extensions will be created within each line's source project.
          </Banner>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11.5, fontWeight: 500, color: '#64748B', marginBottom: 4 }}>Target project</label>
            <Searchable
              value={singleProject ? targetProject : null}
              options={PROJECTS.map(p => ({ value: p.id, label: p.name }))}
              placeholder={singleProject ? '' : 'Respective source projects'}
              onChange={setTargetProject}
              disabled={!singleProject}
              size="sm"
            />
          </div>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 500, color: '#64748B', marginBottom: 4 }}>
              New end date
              <span style={{ fontSize: 10, fontWeight: 500, color: '#94A3B8', background: '#F1F5F9', border: '1px solid #E5E7EB', borderRadius: 4, padding: '1px 6px' }}>last month of extension</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 72px 100px', gap: 8 }}>
              <Searchable value={newEndMonth} options={MONTHS} onChange={o => setNewEndMonth(typeof o === 'string' ? o : o.value)} size="sm" />
              <Searchable value={newEndDay}   options={DAYS}   onChange={o => setNewEndDay(typeof o === 'string' ? o : o.value)}   size="sm" />
              <Searchable value={newEndYear}  options={YEARS}  onChange={o => setNewEndYear(typeof o === 'string' ? o : o.value)}  size="sm" />
            </div>
          </div>
        </div>

        {hasPessimistic && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, alignItems: 'start' }}>
            <div />
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
                onChange={setGlobalScenario}
              />
            </div>
          </div>
        )}
      </div>

      <SectionHeader n={2} title="Preview" extra={`${effective} line${effective !== 1 ? 's' : ''} will be created`} />

      <div style={{ borderRadius: 8, border: '1px solid #E5E7EB', background: '#fff', overflow: 'hidden' }}>
        {/* Preview header */}
        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr 160px 70px 60px', padding: '8px 12px', fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748B', fontWeight: 600, background: '#F8FAFC', borderBottom: '1px solid #E5E7EB' }}>
          <div>Sc.</div><div>Employee</div><div>Profile (target)</div><div>Period</div><div>Alloc %</div><div />
        </div>

        {rows.map((r, i) => {
          const l = lines[i]
          const srcEnd = endDateOf(r)
          const extPeriod = `after ${srcEnd} → ${newEndMonth} ${newEndDay} ${newEndYear}`
          const hasError = l.mappingFailed && !l.profile && !l.skip
          const isPRow = r.scenario === 'P'
          return (
            <div key={r.id} style={{
              display: 'grid', gridTemplateColumns: '80px 1fr 1fr 160px 70px 60px',
              padding: '10px 12px', borderTop: '1px solid #F1F5F9',
              alignItems: 'center',
              background: hasError ? '#FEF2F2' : l.skip ? 'transparent' : '#fff',
              opacity: l.skip ? 0.5 : 1,
            }}>
              <div>
                {isPRow
                  ? <Searchable value={l.scenario} options={[{ value: 'R', label: 'R' }, { value: 'O', label: 'O' }]} onChange={o => updateLine(r.id, { scenario: typeof o === 'string' ? o : o.value })} size="sm" />
                  : <ScenarioDot s={r.scenario} />}
              </div>
              <div style={{ fontSize: 12.5, paddingRight: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: r.employeeName === 'Unassigned' ? '#94A3B8' : '#0F172A', fontStyle: r.employeeName === 'Unassigned' ? 'italic' : 'normal' }}>
                {r.employeeName}
              </div>
              <div style={{ paddingRight: 8 }}>
                {isPRow
                  ? <div>
                      <Searchable
                        value={l.profile}
                        options={SRP_PROFILES}
                        onChange={o => updateLine(r.id, { profile: typeof o === 'string' ? o : o.value, mappingFailed: false })}
                        error={hasError}
                        size="sm"
                      />
                      {hasError && <div style={{ fontSize: 10.5, color: '#B91C1C', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>⚠ Mapping failed from <span style={{ fontFamily: 'IBM Plex Mono, monospace' }}>{r.bookingProfile}</span></div>}
                      {l.profile && !l.mappingFailed && <div style={{ fontSize: 10.5, color: '#94A3B8', marginTop: 2 }}>mapped from <span style={{ fontFamily: 'IBM Plex Mono, monospace' }}>{r.bookingProfile}</span></div>}
                    </div>
                  : <div style={{ fontSize: 12.5, padding: '6px 0', color: '#334155' }}>{l.profile}</div>}
              </div>
              <div style={{ fontSize: 11.5, color: '#64748B', fontFamily: 'IBM Plex Mono, monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{extPeriod}</div>
              <div>
                {isPRow
                  ? <div style={{ fontSize: 12, color: '#94A3B8', fontFamily: 'IBM Plex Mono, monospace', paddingLeft: 4 }}>{l.alloc}%</div>
                  : <input
                      type="number" min={1} max={100}
                      value={l.alloc}
                      onChange={e => updateLine(r.id, { alloc: Math.min(100, Math.max(1, Number(e.target.value))) })}
                      style={{
                        width: 56, padding: '4px 6px', fontSize: 12,
                        border: '1px solid #E5E7EB', borderRadius: 5,
                        fontFamily: 'IBM Plex Mono, monospace',
                        textAlign: 'right',
                      }}
                    />}
              </div>
              <div style={{ textAlign: 'right' }}>
                <button onClick={() => updateLine(r.id, { skip: !l.skip })} style={{
                  fontSize: 12, color: l.skip ? '#64748B' : '#B91C1C',
                  background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500,
                }}>
                  {l.skip ? 'Undo' : 'Skip'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <Banner kind="info">
        The system creates a new projection line starting from the day after each booking ends, until <strong>{newEndMonth} {newEndDay}, {newEndYear}</strong>. Metadata (WDC, Location, Rate, Involvement) is inherited from the source.
      </Banner>
    </FullScreenModal>
  )
}
