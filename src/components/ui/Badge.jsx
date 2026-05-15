import React from 'react';
import './badge.css';

/**
 * Badge component — matches Figma DS (AI) Badge component set.
 * Variants: default | secondary | outline | outline-secondary | destructive | success | warning | caution | verified
 */
export function Badge({
  variant = 'default',
  icon = null,
  children,
  ...props
}) {
  return (
    <span className={`badge badge--${variant}`} {...props}>
      {icon && <span className="badge__icon" aria-hidden="true">{icon}</span>}
      {children}
    </span>
  );
}

/**
 * BadgeNumber — compact numeric counter badge.
 * Variants: default | secondary | outline | destructive
 */
export function BadgeNumber({
  variant = 'default',
  children,
  ...props
}) {
  return (
    <span className={`badge-number badge-number--${variant}`} {...props}>
      {children}
    </span>
  );
}

/**
 * BadgeStatus — Figma "Badges/Status" component for forecasting/pipeline.
 * Variants: optimistic | realistic | pessimistic
 * No background, no border. Letter circle + colored label text.
 * Colors: Optimistic=#3D854E, Realistic=#D9993A, Pessimistic=#CE4E45
 */
const STATUS_CONFIG = {
  optimistic:  { letter: 'O', label: 'Optimistic' },
  realistic:   { letter: 'R', label: 'Realistic' },
  pessimistic: { letter: 'P', label: 'Pessimistic' },
};

export function BadgeStatus({
  variant = 'optimistic',
  ...props
}) {
  const { letter, label } = STATUS_CONFIG[variant] ?? STATUS_CONFIG.optimistic;
  return (
    <span className={`badge-status badge-status--${variant}`} {...props}>
      <span className="badge-status__letter" aria-hidden="true">{letter}</span>
      {label}
    </span>
  );
}

export default Badge;
