/**
 * SRP Dashboard Widget
 * Ref: Figma node 183:7496 — "Chart Component" on SRP main page.
 * Adapted from storybook Widgets.stories.jsx → SRPDashboardWidget story.
 *
 * Layout:
 *   Header  — company name + "Include unmapped" toggle + Account Settings button
 *   Body    — Left: Account Overview quarterly table  |  Right: Headcount/Revenue tabs + monthly table
 */
import React, { useState } from 'react'
import { Table } from '@/components/ui/Table'
import { BadgeStatus } from '@/components/ui/Badge'
import { Toggle } from '@/components/ui/Toggle'
import { Tabs } from '@/components/ui/Tabs'

// ─── Data ──────────────────────────────────────────────────────────────────────

const MONTHS     = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const QUARTERS   = ['Q1','Q2','Q3','Q4','ANNUAL']

const HEADCOUNT_DATA = [
  { scenario: 'spt',         Jan:194, Feb:171, Mar:178, Apr:178, May:186, Jun:186, Jul:185, Aug:185, Sep:185, Oct:185, Nov:185, Dec:185 },
  { scenario: 'optimistic',  Jan:194, Feb:171, Mar:178, Apr:178, May:186, Jun:186, Jul:185, Aug:185, Sep:185, Oct:185, Nov:185, Dec:185 },
  { scenario: 'realistic',   Jan:194, Feb:171, Mar:178, Apr:178, May:186, Jun:186, Jul:185, Aug:185, Sep:185, Oct:185, Nov:185, Dec:185 },
  { scenario: 'pessimistic', Jan:194, Feb:171, Mar:178, Apr:178, May:186, Jun:186, Jul:185, Aug:185, Sep:185, Oct:185, Nov:185, Dec:185 },
]

const REVENUE_DATA = [
  { scenario: 'spt',         Jan:194, Feb:171, Mar:178, Apr:178, May:186, Jun:186, Jul:185, Aug:185,   Sep:185, Oct:185, Nov:185, Dec:185, variance: null },
  { scenario: 'optimistic',  Jan:194, Feb:171, Mar:178, Apr:178, May:186, Jun:186, Jul:185, Aug:0,     Sep:185, Oct:185, Nov:185, Dec:185, variance: { month: 'Aug', label: '-20%' } },
  { scenario: 'realistic',   Jan:194, Feb:171, Mar:178, Apr:178, May:186, Jun:186, Jul:185, Aug:185,   Sep:185, Oct:185, Nov:185, Dec:185, variance: null },
  { scenario: 'pessimistic', Jan:194, Feb:194, Mar:194, Apr:194, May:194, Jun:194, Jul:194, Aug:194,   Sep:194, Oct:194, Nov:194, Dec:194, variance: null },
]

const ACCOUNT_OVERVIEW_DATA = [
  { scenario: 'target',
    Q1: '$1.25M', Q2: '$150.75K', Q3: '$1.10B', Q4: '$999.99K', ANNUAL: '$1.10B' },
  { scenario: 'optimistic',
    Q1: { amount:'$95,432',  pct:'25%' }, Q2: { amount:'$98.765K', pct:'10%' },
    Q3: { amount:'$132.10K', pct:'00%' }, Q4: { amount:'$12,345',  pct:'15%' }, ANNUAL: { amount:'$000.0K', pct:'00%' } },
  { scenario: 'realistic',
    Q1: { amount:'$87,654',  pct:'33%' }, Q2: { amount:'$250.88K', pct:'15%' },
    Q3: { amount:'$000.0K',  pct:'00%' }, Q4: { amount:'$000.0K',  pct:'00%' }, ANNUAL: { amount:'$000.0K', pct:'00%' } },
  { scenario: 'pessimistic',
    Q1: { amount:'$000.0K', pct:'00%' }, Q2: { amount:'$000.0K', pct:'00%' },
    Q3: { amount:'$000.0K', pct:'00%' }, Q4: { amount:'$000.0K', pct:'00%' }, ANNUAL: { amount:'$000.0K', pct:'00%' } },
]

// ─── Shared styles ─────────────────────────────────────────────────────────────

const S = {
  card: {
    background: '#ffffff',
    borderRadius: 12,
    border: '1px solid rgba(1,1,46,0.08)',
    boxShadow: '0 1px 2px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.10)',
    overflow: 'hidden',
    fontFamily: "'Source Sans Pro','Source Sans 3',system-ui,sans-serif",
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    background: 'var(--color-base-card, #fcfcfc)',
    borderBottom: '1px solid rgba(1,1,46,0.08)',
    gap: 10,
    minHeight: 82,
  },
  body: {
    padding: '24px',
    background: '#ffffff',
  },
  panel: {
    background: '#ffffff',
  },
  settingsBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 16px',
    border: '1px solid var(--color-base-primary, #0069b4)',
    background: '#ffffff',
    color: 'var(--color-base-primary, #0069b4)',
    fontSize: 14,
    fontWeight: 400,
    lineHeight: '20px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    flexShrink: 0,
    whiteSpace: 'nowrap',
    minHeight: 40,
  },
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"
      style={{ flexShrink: 0, color: 'var(--color-base-muted-foreground, #91959f)' }}>
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.25"/>
      <path d="M8 7v4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
      <circle cx="8" cy="5" r="0.75" fill="currentColor"/>
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}

function ScenarioLabel({ scenario }) {
  if (scenario === 'spt')    return <strong style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-base-foreground, #1f1f21)' }}>SPT</strong>
  if (scenario === 'target') return <strong style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-base-foreground, #1f1f21)' }}>Target</strong>
  return <BadgeStatus variant={scenario} />
}

function VarianceBadgeCell({ badge, value, muted = false }) {
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
      <span style={{
        display: 'inline-block',
        background: 'var(--color-status-warning-icon, #ea580c)',
        color: '#fff', fontSize: 10, fontWeight: 700,
        borderRadius: 9999, padding: '1px 5px', lineHeight: '16px', whiteSpace: 'nowrap',
      }}>{badge}</span>
      <span style={{ fontSize: 12, color: muted ? 'var(--color-base-muted-foreground, #91959f)' : 'inherit' }}>
        {value}
      </span>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

export function SRPDashboardWidget() {
  const [activeTab,       setActiveTab]  = useState('headcount')
  const [includeUnmapped, setUnmapped]   = useState(true)

  // ── Column definitions ─────────────────────────────────────────────────────

  const aoColumns = [
    {
      key: 'scenario', label: '', sticky: 'left',
      render: (val) => <ScenarioLabel scenario={val} />,
    },
    ...QUARTERS.map((q) => ({
      key: q, label: q, align: 'right',
      render: (val, row) =>
        row.scenario === 'target'
          ? <span style={{ fontSize: 13, fontWeight: 500 }}>{val}</span>
          : (
            <span style={{ fontSize: 13 }}>
              {val.amount}{' '}
              <span style={{ color: 'var(--color-base-muted-foreground, #91959f)', fontSize: 12 }}>/</span>{' '}
              <strong style={{ fontWeight: 700, fontSize: 12 }}>{val.pct}</strong>
            </span>
          ),
    })),
  ]

  const headcountColumns = [
    {
      key: 'scenario', label: '', width: 85, sticky: 'left',
      render: (val) => <div style={{ maxWidth: 78, overflow: 'hidden', whiteSpace: 'nowrap' }}><ScenarioLabel scenario={val} /></div>,
    },
    ...MONTHS.map((m) => ({
      key: m, label: m, align: 'right',
      render: (val) => <span style={{ fontSize: 12 }}>{val}</span>,
    })),
  ]

  const revenueColumns = [
    {
      key: 'scenario', label: '', width: 85, sticky: 'left',
      render: (val) => <div style={{ maxWidth: 78, overflow: 'hidden', whiteSpace: 'nowrap' }}><ScenarioLabel scenario={val} /></div>,
    },
    ...MONTHS.map((month) => {
      const isVarianceMonth = REVENUE_DATA.some((r) => r.variance?.month === month)
      return {
        key: month, label: month, align: 'right',
        className: isVarianceMonth ? 'table__td--variance' : '',
        render: (val, row) => {
          if (row.variance?.month === month) {
            return <VarianceBadgeCell badge={row.variance.label} value={val === 0 ? '$0.00' : val} muted={val === 0} />
          }
          return <span style={{ fontSize: 13 }}>{val}</span>
        },
      }
    }),
  ]

  return (
    <div style={S.card}>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div style={S.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 0, flex: 1, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <span style={{ fontSize: 36, fontWeight: 600, color: 'var(--color-base-foreground, #1f1f21)', lineHeight: '140%', whiteSpace: 'nowrap' }}>
              Boston Scientific International SA
            </span>
            <InfoIcon />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {['Americas', 'Europe'].map(r => (
              <span key={r} style={{ padding: '2px 8px', borderRadius: 3, background: '#f8edff', color: '#6d28d9', fontSize: 13, fontWeight: 400, whiteSpace: 'nowrap' }}>{r}</span>
            ))}
          </div>
        </div>
        <div style={{ flexShrink: 0 }}>
          <Toggle checked={includeUnmapped} onChange={setUnmapped} labelRight="Include unmapped position" />
        </div>
        <button style={{ ...S.settingsBtn, marginLeft: 32 }} type="button">
          <SettingsIcon />
          Account Settings
        </button>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div style={S.body}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 56 }}>

          {/* Left: Account Overview quarterly — paddingTop aligns its rows with the right table rows (below tabs) */}
          <div style={{ ...S.panel, flex: 2, minWidth: 0, paddingTop: 56 }}>
            <Table
              columns={aoColumns}
              data={ACCOUNT_OVERVIEW_DATA}
              wrapperClassName="table-wrapper--seamless table-wrapper--flat table-wrapper--widget"
            />
          </div>

          {/* Right: Headcount / Revenue tabs + monthly table */}
          <div style={{ ...S.panel, flex: 3, minWidth: 0 }}>
            <div style={{ padding: '8px 12px' }}>
              <Tabs
                tabs={[{ id: 'headcount', label: 'Headcount' }, { id: 'revenue', label: 'Revenue' }]}
                active={activeTab}
                onChange={setActiveTab}
              />
            </div>
            {activeTab === 'headcount'
              ? <Table columns={headcountColumns} data={HEADCOUNT_DATA} wrapperClassName="table-wrapper--seamless table-wrapper--flat table-wrapper--widget" />
              : <Table columns={revenueColumns}   data={REVENUE_DATA}   wrapperClassName="table-wrapper--seamless table-wrapper--flat table-wrapper--widget" />
            }
          </div>

        </div>
      </div>
    </div>
  )
}
