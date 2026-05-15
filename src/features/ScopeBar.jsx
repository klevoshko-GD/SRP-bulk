import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'

const ACCOUNTS = [
  'Boston Scientific International SA',
  'ACME Corporation',
  'Contoso Ltd',
]
const YEARS = ['2024', '2025', '2026', '2027']

export function ScopeBar() {
  const [account, setAccount] = useState(ACCOUNTS[0])
  const [year, setYear] = useState('2024')

  return (
    <div style={{ background: '#fff', borderBottom: '1px solid #E5E7EB' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 79, padding: '0 24px 12px' }}>
          <span style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: '#64748B',
            paddingBottom: 5,
          }}>
            Scope
          </span>

          {/* Account */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#94A3B8' }}>Account</span>
            <select
              value={account}
              onChange={e => setAccount(e.target.value)}
              style={{
                fontSize: 13, fontWeight: 500, color: '#0F172A',
                border: '1px solid #E5E7EB', borderRadius: 6,
                padding: '4px 28px 4px 10px', background: '#fff',
                appearance: 'none', cursor: 'pointer', minWidth: 280,
                backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'><path d='M3 4.5L6 7.5L9 4.5' stroke='%2364748B' stroke-width='1.5' fill='none' stroke-linecap='round'/></svg>")`,
                backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center',
              }}
            >
              {ACCOUNTS.map(a => <option key={a}>{a}</option>)}
            </select>
          </div>

          {/* Year */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#94A3B8' }}>Year</span>
            <select
              value={year}
              onChange={e => setYear(e.target.value)}
              style={{
                fontSize: 13, fontWeight: 500, color: '#0F172A',
                border: '1px solid #E5E7EB', borderRadius: 6,
                padding: '4px 28px 4px 10px', background: '#fff',
                appearance: 'none', cursor: 'pointer', minWidth: 90,
                backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'><path d='M3 4.5L6 7.5L9 4.5' stroke='%2364748B' stroke-width='1.5' fill='none' stroke-linecap='round'/></svg>")`,
                backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center',
              }}
            >
              {YEARS.map(y => <option key={y}>{y}</option>)}
            </select>
          </div>

          <Button
            variant="ghost-secondary"
            size="sm"
            onClick={() => { setAccount(ACCOUNTS[0]); setYear('2024') }}
          >
            Clear All
          </Button>
        </div>
    </div>
  )
}
