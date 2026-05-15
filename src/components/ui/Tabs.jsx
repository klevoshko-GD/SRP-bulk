import React from 'react';
import './tabs.css';

/**
 * Tabs — segmented control component.
 * Matches Figma DS "Tabs" component (node 59:25693).
 *
 * Container: primary-blue background, rounded pill, 4px padding.
 * Active tab: white fill, blue text, subtle shadow.
 * Inactive tabs: transparent, white text.
 *
 * Props:
 *   tabs     — array of { id, label, count? }
 *   active   — id of the currently active tab
 *   onChange — (id) => void
 *   size     — 'lg' (default) | 'sm'
 */
export function Tabs({ tabs = [], active, onChange, size = 'lg' }) {
  return (
    <div
      className={['tabs', size === 'sm' ? 'tabs--sm' : ''].filter(Boolean).join(' ')}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            className={['tabs__item', isActive ? 'tabs__item--active' : ''].filter(Boolean).join(' ')}
            onClick={() => onChange?.(tab.id)}
            type="button"
          >
            <span className="tabs__label">{tab.label}</span>
            {tab.count != null && (
              <span className="tabs__counter" aria-label={`${tab.count} items`}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
