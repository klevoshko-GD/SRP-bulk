import React from 'react'

export function ChartPlaceholder() {
  return (
    <div style={{
      background: '#fff', borderBottom: '1px solid #E5E7EB',
      height: 423, display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 8,
    }}>
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ opacity: 0.25 }}>
        <rect x="4" y="20" width="6" height="16" rx="2" fill="#4F46E5"/>
        <rect x="14" y="12" width="6" height="24" rx="2" fill="#4F46E5"/>
        <rect x="24" y="6" width="6" height="30" rx="2" fill="#4F46E5"/>
        <rect x="34" y="16" width="6" height="20" rx="2" fill="#4F46E5"/>
      </svg>
      <span style={{ fontSize: 13, color: '#94A3B8', fontWeight: 500 }}>
        Chart Component — design in progress (TOOL-36191)
      </span>
    </div>
  )
}
