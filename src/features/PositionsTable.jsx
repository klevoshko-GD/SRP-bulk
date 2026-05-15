import React, { useState, useCallback } from 'react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/Accordion'
import { Checkbox } from '@/components/ui/Checkbox'
import { ScenarioDot } from './modals/ModalShared'
import { BadgeStatus } from '@/components/ui/Badge'

const SCENARIO_VARIANT = { P: 'pessimistic', R: 'realistic', O: 'optimistic' }
import { PROJECTS } from '@/data/projects'
import { POSITIONS } from '@/data/positions'
import '@/components/ui/table.css'
import '@/components/ui/accordion.css'
import '@/components/ui/badge.css'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const COUNTRY_NAMES = {
  PL: 'Poland', UA: 'Ukraine', IN: 'India',  AM: 'Armenia',
  RS: 'Serbia', US: 'USA',     DE: 'Germany', GB: 'UK',
  BY: 'Belarus', RO: 'Romania', CZ: 'Czech Republic',
}

// Extract country code from wdc 'GD-PL' → 'PL', or location 'Warsaw, PL' → 'PL'
const countryFromWdc      = (wdc)  => COUNTRY_NAMES[wdc?.split('-')[1]]      ?? wdc
const countryFromLocation = (loc)  => COUNTRY_NAMES[loc?.split(', ')[1]]     ?? loc

const EDIT_ICON = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M12 20h9"/>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
  </svg>
)

// Shorten billing model for the tag
const BILLING_SHORT = {
  'T&M':               'T&M',
  'Fixed Price':       'Fixed',
  'POD per Engineer':  'POD',
  'POD per Team':      'POD',
}

const PLUS_ICON = (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const SETTINGS_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

function AllocCell({ value, onlyPast }) {
  if (value === 0) return (
    <div style={{ textAlign: 'center', fontSize: 10, color: 'var(--color-base-border)', fontFamily: 'monospace' }}>·</div>
  )
  if (onlyPast) return (
    <div style={{
      textAlign: 'center', fontSize: 10, padding: '2px 1px',
      fontFamily: 'IBM Plex Mono, monospace', fontWeight: 500,
      color: 'var(--color-base-muted-foreground)', textDecoration: 'line-through',
    }}>
      {value}
    </div>
  )
  return (
    <div style={{
      textAlign: 'center', fontSize: 10, padding: '2px 1px',
      fontFamily: 'IBM Plex Mono, monospace', fontWeight: 500,
      color: 'var(--color-base-foreground, #1f1f21)',
    }}>
      {value}
    </div>
  )
}


export function PositionsTable({ selectedIds, setSelectedIds, deletedIds = [], filteredProjectIds = [] }) {
  const [lastClickedId,      setLastClickedId]      = useState(null)
  const [lastClickedProject, setLastClickedProject] = useState(null)

  const toggle = useCallback((id, projectId, allIds, e) => {
    // Shift-click is scoped to a single project — if last click was in a different project, treat as regular click
    if (e?.shiftKey && lastClickedId && lastClickedProject === projectId && allIds) {
      const i1 = allIds.indexOf(lastClickedId)
      const i2 = allIds.indexOf(id)
      if (i1 !== -1 && i2 !== -1) {
        const range = allIds.slice(Math.min(i1, i2), Math.max(i1, i2) + 1)
        setSelectedIds(prev => [...new Set([...prev, ...range])])
        return
      }
    }
    setLastClickedId(id)
    setLastClickedProject(projectId)
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }, [lastClickedId, lastClickedProject, setSelectedIds])

  const toggleGroup = (ids) => {
    const allSelected = ids.every(id => selectedIds.includes(id))
    if (allSelected) setSelectedIds(prev => prev.filter(id => !ids.includes(id)))
    else setSelectedIds(prev => [...new Set([...prev, ...ids])])
  }

  const groups = PROJECTS.map(p => ({
    project: p,
    rows: POSITIONS.filter(r =>
      r.projectId === p.id &&
      !deletedIds.includes(r.id)
    ),
  })).filter(g => g.rows.length > 0).filter(g => filteredProjectIds.length === 0 || filteredProjectIds.includes(g.project.id))

  return (
    <div style={{ paddingBottom: 120 }}>
      {/* ── Project accordions ─────────────────────────────────────────────── */}
      {groups.map(({ project, rows }) => {
        const pRows  = rows.filter(r => r.scenario === 'P')
        const roRows = rows.filter(r => r.scenario !== 'P')
        const allIds = rows.map(r => r.id)
        const pIds   = pRows.map(r => r.id)
        const roIds  = roRows.map(r => r.id)
        const allSelected  = allIds.length > 0 && allIds.every(id => selectedIds.includes(id))
        const someSelected = allIds.some(id => selectedIds.includes(id)) && !allSelected

        // Summary row checkbox helpers
        const pAllSel  = pIds.length > 0 && pIds.every(id => selectedIds.includes(id))
        const pSomeSel = pIds.some(id => selectedIds.includes(id)) && !pAllSel
        const roAllSel  = roIds.length > 0 && roIds.every(id => selectedIds.includes(id))
        const roSomeSel = roIds.some(id => selectedIds.includes(id)) && !roAllSel

        return (
          <div key={project.id} style={{ marginBottom: 20 }}>
            <Accordion
              type="single"
              collapsible
              defaultValue={project.id !== 'beta' ? project.id : undefined}
              className="accordion--time-reports"
            >
              <AccordionItem value={project.id} className="accordion-item--srp-active">
                <AccordionTrigger>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 1, gap: 16, minWidth: 0 }}>

                    {/* Left: checkbox + title/subtitle */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                      <div onClick={e => e.stopPropagation()}>
                        <Checkbox
                          checked={allSelected}
                          indeterminate={someSelected}
                          onChange={() => toggleGroup(allIds)}
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p className="accordion-project__title" style={{ color: 'var(--color-base-primary-foreground, #f7f8f8)', margin: 0 }}>
                          {project.name}
                        </p>
                        <p className="accordion-project__subtitle" style={{ color: 'rgba(255,255,255,0.75)', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {project.description}
                        </p>
                      </div>
                    </div>

                    {/* Right: tags + settings + add — stop propagation so clicks don't toggle accordion */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                      <span className="srp-tag">USD</span>
                      <span className="srp-tag">{BILLING_SHORT[project.billingModel] ?? project.billingModel}</span>
                      <button type="button" className="srp-action-btn srp-action-btn--icon" title="Settings">
                        {SETTINGS_ICON}
                      </button>
                      <button type="button" className="srp-action-btn">
                        {PLUS_ICON}
                        Add Position
                      </button>
                    </div>

                  </div>
                </AccordionTrigger>

                <AccordionContent>
                  <div className="table-wrapper table-wrapper--seamless">
                    <table className="table" style={{ width: '100%' }}>
                      <thead>
                        <tr>
                          <th style={{ width: 44, padding: '8px 8px' }}></th>
                          <th style={{ width: 130 }}>Scenario</th>
                          <th style={{ width: 150 }}>Employee Name</th>
                          <th style={{ width: 52 }}>Note</th>
                          <th>Profile</th>
                          <th style={{ width: 56 }}>WDC</th>
                          <th style={{ width: 100 }}>Work Location</th>
                          <th style={{ width: 64 }}>Allocation</th>
                          {MONTHS.map(m => <th key={m} style={{ width: 42, textAlign: 'center', padding: '8px 2px' }}>{m}</th>)}
                          <th style={{ width: 80 }}>Revenue</th>
                          <th style={{ width: 36 }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* ── Project total ────────────────────────────────── */}
                        <tr style={{ background: '#BFDBFE' }}>
                          <td style={{ padding: '6px 8px' }} />
                          <td colSpan={19} style={{
                            fontSize: 13, fontWeight: 700,
                            color: 'var(--color-base-foreground)',
                            padding: '8px 4px 8px 4px',
                          }}>
                            Project total
                          </td>
                          <td style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: 'var(--color-base-muted-foreground)', fontWeight: 600 }}>N/A</td>
                          <td />
                        </tr>

                        {/* ── Pessimistic Adjustments ──────────────────────── */}
                        {pRows.length > 0 && (
                          <tr style={{ background: '#DBEAFE' }}>
                            <td style={{ padding: '6px 8px' }} />
                            <td colSpan={21} style={{
                              fontSize: 12.5, fontWeight: 700,
                              color: 'var(--color-base-foreground)',
                              padding: '6px 4px 6px 4px',
                            }}>
                              Pessimistic Adjustments
                            </td>
                          </tr>
                        )}

                        {/* ── Pessimistic Forecast Summary ─────────────────── */}
                        {pRows.length > 0 && (
                          <tr style={{ background: '#EFF6FF' }}>
                            <td style={{ padding: '6px 8px' }} onClick={e => e.stopPropagation()}>
                              <Checkbox
                                checked={pAllSel}
                                indeterminate={pSomeSel}
                                onChange={() => toggleGroup(pIds)}
                              />
                            </td>
                            <td colSpan={21} style={{
                              fontSize: 13, fontWeight: 700, letterSpacing: '0.01em',
                              textTransform: 'capitalize', color: '#1f1f21',
                              padding: '6px 4px',
                            }}>
                              Pessimistic Forecast Summary
                            </td>
                          </tr>
                        )}
                        {pRows.map((row, i) => {
                          const isSelected = selectedIds.includes(row.id)
                          return (
                            <tr
                              key={row.id}
                              className={isSelected ? 'is-selected' : ''}
                              onClick={(e) => toggle(row.id, project.id, allIds, e)}
                              style={{ cursor: 'pointer', background: isSelected ? undefined : i % 2 === 0 ? '#ffffff' : '#f7f8f8' }}
                            >
                              <td style={{ padding: '0 8px' }} onClick={e => e.stopPropagation()}>
                                <Checkbox checked={isSelected} onChange={(e) => toggle(row.id, project.id, allIds, { shiftKey: e.nativeEvent?.shiftKey })} />
                              </td>
                              <td style={{ padding: '4px' }}><BadgeStatus variant={SCENARIO_VARIANT[row.scenario]} /></td>
                              <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                <span style={{ color: row.employeeName === 'Unassigned' ? 'var(--color-base-muted-foreground)' : undefined, fontStyle: row.employeeName === 'Unassigned' ? 'italic' : 'normal' }}>{row.employeeName}</span>
                              </td>
                              <td className="table__td--muted">—</td>
                              <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13 }}>
                                {row.bookingProfile}
                              </td>
                              <td className="table__td--muted" style={{ fontSize: 13 }}>{countryFromWdc(row.wdc)}</td>
                              <td className="table__td--muted" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13 }}>{countryFromLocation(row.location)}</td>
                              <td style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, textAlign: 'center' }}>{row.involvement}%</td>
                              {row.alloc.map((v, i) => (
                                <td key={i} style={{ padding: '4px 2px' }}>
                                  <AllocCell value={v} onlyPast={row.onlyPast} />
                                </td>
                              ))}
                              <td style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: 'var(--color-base-muted-foreground)' }}>$0</td>
                              <td style={{ padding: '0 6px' }} onClick={e => e.stopPropagation()}>
                                <button type="button" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 5, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-base-muted-foreground)' }}>
                                  {EDIT_ICON}
                                </button>
                              </td>
                            </tr>
                          )
                        })}

                        {/* ── Prospective Forecast Summary ─────────────────── */}
                        {roRows.length > 0 && (
                          <tr style={{ background: '#F0FDF4' }}>
                            <td style={{ padding: '6px 8px' }} onClick={e => e.stopPropagation()}>
                              <Checkbox
                                checked={roAllSel}
                                indeterminate={roSomeSel}
                                onChange={() => toggleGroup(roIds)}
                              />
                            </td>
                            <td colSpan={21} style={{
                              fontSize: 13, fontWeight: 700, letterSpacing: '0.01em',
                              textTransform: 'capitalize', color: '#1f1f21',
                              padding: '6px 4px',
                            }}>
                              Prospective Forecast Summary
                            </td>
                          </tr>
                        )}
                        {roRows.map((row, i) => {
                          const isSelected = selectedIds.includes(row.id)
                          return (
                            <tr
                              key={row.id}
                              className={isSelected ? 'is-selected' : ''}
                              onClick={(e) => toggle(row.id, project.id, allIds, e)}
                              style={{ cursor: 'pointer', background: isSelected ? undefined : i % 2 === 0 ? '#ffffff' : '#f7f8f8' }}
                            >
                              <td style={{ padding: '0 8px' }} onClick={e => e.stopPropagation()}>
                                <Checkbox checked={isSelected} onChange={(e) => toggle(row.id, project.id, allIds, { shiftKey: e.nativeEvent?.shiftKey })} />
                              </td>
                              <td style={{ padding: '4px' }}><BadgeStatus variant={SCENARIO_VARIANT[row.scenario]} /></td>
                              <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                <span style={{ color: row.employeeName === 'Unassigned' ? 'var(--color-base-muted-foreground)' : undefined, fontStyle: row.employeeName === 'Unassigned' ? 'italic' : 'normal' }}>{row.employeeName}</span>
                              </td>
                              <td className="table__td--muted">—</td>
                              <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13 }}>{row.profile}</td>
                              <td className="table__td--muted" style={{ fontSize: 13 }}>{countryFromWdc(row.wdc)}</td>
                              <td className="table__td--muted" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 13 }}>{countryFromLocation(row.location)}</td>
                              <td style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, textAlign: 'center' }}>{row.involvement}%</td>
                              {row.alloc.map((v, i) => (
                                <td key={i} style={{ padding: '4px 2px' }}>
                                  <AllocCell value={v} onlyPast={row.onlyPast} />
                                </td>
                              ))}
                              <td style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 12, color: 'var(--color-base-muted-foreground)' }}>$0</td>
                              <td style={{ padding: '0 6px' }} onClick={e => e.stopPropagation()}>
                                <button type="button" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 5, border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-base-muted-foreground)' }}>
                                  {EDIT_ICON}
                                </button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )
      })}
    </div>
  )
}
