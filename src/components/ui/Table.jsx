import React from 'react';
import './table.css';

/**
 * Table component — matches Figma DS (AI) Table component set.
 *
 * Props:
 *  columns  — array of { key, label, align?, sortable?, width? }
 *  data     — array of row objects keyed by column.key
 *  variant  — 'default' | 'striped' | 'compact'
 *  caption  — optional accessible caption
 *  emptyMessage — message shown when data is empty
 *  sortKey, sortDir, onSort — controlled sort state
 *  selectedRows, onRowSelect — controlled row selection (Set of row indices)
 *  footer   — optional footer content (node)
 */
export function Table({
  columns = [],
  data = [],
  variant = 'default',
  caption,
  emptyMessage = 'No results.',
  sortKey = null,
  sortDir = 'asc',
  onSort,
  selectedRows,
  onRowSelect,
  footer,
  rowClassName,
  wrapperClassName,
  ...props
}) {
  const variantClass = variant === 'default' ? '' : `table--${variant}`;

  const handleSort = (key) => {
    if (!onSort) return;
    if (sortKey === key) {
      onSort(key, sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      onSort(key, 'asc');
    }
  };

  // ── Sticky column offsets ──────────────────────────────────────────────────
  const colWidth = (col) => (typeof col.width === 'number' ? col.width : parseInt(col.width) || 120);
  const leftCols  = columns.filter(c => c.sticky === 'left');
  const rightCols = columns.filter(c => c.sticky === 'right');

  const leftOffsets = {};
  let lAcc = 0;
  for (const col of leftCols) { leftOffsets[col.key] = lAcc; lAcc += colWidth(col); }

  const rightOffsets = {};
  let rAcc = 0;
  for (let i = rightCols.length - 1; i >= 0; i--) {
    rightOffsets[rightCols[i].key] = rAcc;
    rAcc += colWidth(rightCols[i]);
  }

  const lastLeftKey   = leftCols.length  > 0 ? leftCols[leftCols.length - 1].key : null;
  const firstRightKey = rightCols.length > 0 ? rightCols[0].key : null;

  const stickyThStyle = (col) => {
    if (!col.sticky) return col.width ? { width: col.width } : undefined;
    const shadow = col.key === lastLeftKey   ? { boxShadow: '3px 0 6px -2px rgba(0,0,0,0.08)' }
                 : col.key === firstRightKey ? { boxShadow: '-3px 0 6px -2px rgba(0,0,0,0.08)' } : {};
    return {
      ...(col.width ? { width: col.width } : {}),
      position: 'sticky',
      [col.sticky]: col.sticky === 'left' ? leftOffsets[col.key] : rightOffsets[col.key],
      zIndex: 2,
      background: 'var(--color-base-muted, #f7f8f8)',
      ...shadow,
    };
  };

  const stickyTdStyle = (col) => {
    if (!col.sticky) return {};
    const shadow = col.key === lastLeftKey   ? { boxShadow: '3px 0 6px -2px rgba(0,0,0,0.08)' }
                 : col.key === firstRightKey ? { boxShadow: '-3px 0 6px -2px rgba(0,0,0,0.08)' } : {};
    return {
      position: 'sticky',
      [col.sticky]: col.sticky === 'left' ? leftOffsets[col.key] : rightOffsets[col.key],
      zIndex: 1,
      ...shadow,
    };
  };

  const stickyTdClass = (col) => col.sticky ? `table__td--sticky-${col.sticky}` : '';

  return (
    <div className={['table-wrapper', wrapperClassName].filter(Boolean).join(' ')}>
      <table className={['table', variantClass].filter(Boolean).join(' ')} {...props}>
        {caption && <caption style={{ display: 'none' }}>{caption}</caption>}
        <thead>
          <tr>
            {selectedRows !== undefined && (
              <th style={{ width: 40, padding: '10px 12px 10px 20px' }}>
                <input
                  type="checkbox"
                  aria-label="Select all rows"
                  checked={selectedRows.size === data.length && data.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) onRowSelect(new Set(data.map((_, i) => i)));
                    else onRowSelect(new Set());
                  }}
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                className={col.align === 'right' ? 'table__th--right' : col.align === 'center' ? 'table__th--center' : ''}
                style={stickyThStyle(col)}
              >
                {col.sortable ? (
                  <button className="table__sort" onClick={() => handleSort(col.key)}>
                    {col.label}
                    <SortIcon active={sortKey === col.key} dir={sortDir} />
                  </button>
                ) : col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selectedRows !== undefined ? 1 : 0)} className="table__empty">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={i}
                className={[
                  selectedRows?.has(i) ? 'is-selected' : '',
                  rowClassName ? rowClassName(row, i) : '',
                ].filter(Boolean).join(' ')}
                onClick={onRowSelect ? () => {
                  const next = new Set(selectedRows);
                  next.has(i) ? next.delete(i) : next.add(i);
                  onRowSelect(next);
                } : undefined}
                style={onRowSelect ? { cursor: 'pointer' } : undefined}
              >
                {selectedRows !== undefined && (
                  <td style={{ padding: '10px 12px 10px 20px' }}>
                    <input
                      type="checkbox"
                      aria-label={`Select row ${i + 1}`}
                      checked={selectedRows.has(i)}
                      onChange={() => {}} // handled by row click
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={[
                      col.align === 'right' ? 'table__td--right' : col.align === 'center' ? 'table__td--center' : '',
                      col.muted ? 'table__td--muted' : '',
                      col.className || '',
                      stickyTdClass(col),
                    ].filter(Boolean).join(' ')}
                    style={stickyTdStyle(col)}
                  >
                    {col.render ? col.render(row[col.key], row, i) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {footer && <div className="table-footer">{footer}</div>}
    </div>
  );
}

function SortIcon({ active, dir }) {
  return (
    <span className="table__sort-icon" aria-hidden="true">
      <svg viewBox="0 0 10 6" className={active && dir === 'asc' ? 'is-active' : ''}>
        <path d="M5 0L9.33 6H0.67L5 0Z" fill="currentColor" />
      </svg>
      <svg viewBox="0 0 10 6" className={active && dir === 'desc' ? 'is-active' : ''}>
        <path d="M5 6L0.67 0H9.33L5 6Z" fill="currentColor" />
      </svg>
    </span>
  );
}

export default Table;
