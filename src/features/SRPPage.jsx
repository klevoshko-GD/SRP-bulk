import React, { useState } from 'react'
import { NavBar } from '@/components/ui/NavBar'
import { ScopeBar } from './ScopeBar'
import { SearchFilterBar } from './SearchFilterBar'
import { PositionsTable } from './PositionsTable'
import { BulkToolbar } from './BulkToolbar'
import { ExtendModal } from './modals/ExtendModal'
import { CopyMoveModal } from './modals/CopyMoveModal'
import { CloneModal } from './modals/CloneModal'
import { DeleteModal } from './modals/DeleteModal'
import { SRPDashboardWidget } from './SRPDashboardWidget'
import { POSITIONS } from '@/data/positions'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '#' },
  { label: 'SRP', href: '#', active: true },
  { label: 'Timesheets', href: '#' },
  { label: 'Reports', href: '#' },
]

export function SRPPage() {
  const [selectedIds,       setSelectedIds]       = useState([])
  const [filteredProjectIds, setFilteredProjectIds] = useState([])
  const [activeModal,  setActiveModal]  = useState(null)
  const [toast,        setToast]        = useState(null)   // { message, kind }
  const [deletedIds,   setDeletedIds]   = useState([])     // simulates removed rows

  const visiblePositions = POSITIONS.filter(p => !deletedIds.includes(p.id))
  const selectedRows     = visiblePositions.filter(p => selectedIds.includes(p.id))

  const openModal  = (name) => setActiveModal(name)
  const closeModal = () => setActiveModal(null)

  const showToast = (message, kind = 'success') => {
    setToast({ message, kind })
    setTimeout(() => setToast(null), 3500)
  }

  const handleDeleteConfirm = (idsToDelete) => {
    setDeletedIds(prev => [...new Set([...prev, ...idsToDelete])])
    setSelectedIds(prev => prev.filter(id => !idsToDelete.includes(id)))
    closeModal()
    showToast(`${idsToDelete.length} line${idsToDelete.length !== 1 ? 's' : ''} deleted successfully.`)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F7F8FA', display: 'flex', flexDirection: 'column' }}>
      <NavBar items={NAV_ITEMS} />
      <ScopeBar />

      <div style={{ maxWidth: 1400, margin: '0 auto', width: '100%', padding: '0 24px' }}>
        <div style={{ marginTop: 20 }}>
          <SRPDashboardWidget />
        </div>

        <div style={{ marginTop: 16 }}>
          <SearchFilterBar selectedProjects={filteredProjectIds} onFilterChange={setFilteredProjectIds} />
        </div>

        <div style={{ marginTop: 12, paddingBottom: 120 }}>
          <PositionsTable
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            deletedIds={deletedIds}
            filteredProjectIds={filteredProjectIds}
          />
        </div>
      </div>

      <BulkToolbar
        selectedIds={selectedIds}
        onAction={(action) => {
          if (action === 'extend')   openModal('extend')
          else if (action === 'copymove') openModal('copyMove')
          else if (action === 'clone')    openModal('clone')
          else if (action === 'delete')   openModal('delete')
        }}
        onClear={() => setSelectedIds([])}
      />

      {activeModal === 'extend' && (
        <ExtendModal open rows={selectedRows} onClose={closeModal} />
      )}
      {activeModal === 'copyMove' && (
        <CopyMoveModal open rows={selectedRows} onClose={closeModal} />
      )}
      {activeModal === 'clone' && (
        <CloneModal open rows={selectedRows} onClose={closeModal} />
      )}
      {activeModal === 'delete' && (
        <DeleteModal
          open
          rows={selectedRows}
          onClose={closeModal}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {/* Toast notification */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 88, left: '50%', transform: 'translateX(-50%)',
          zIndex: 100,
          background: toast.kind === 'success' ? '#064E3B' : '#7F1D1D',
          color: '#fff', fontSize: 13, fontWeight: 500,
          padding: '10px 20px', borderRadius: 8,
          boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
          display: 'flex', alignItems: 'center', gap: 8,
          animation: 'toolbarIn 0.2s cubic-bezier(.22,1,.36,1)',
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {toast.message}
        </div>
      )}
    </div>
  )
}
