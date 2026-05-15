import React from 'react';
import './toggle.css';

/**
 * Toggle (Toggle With Text) — matches Figma DS node 53:9670.
 *
 * A switch with optional left and right labels.
 * Track: 45×24px pill. Thumb: 18×18px white circle.
 * OFF → gray track, thumb left. ON → primary-blue track, thumb right.
 * Focus state shown via keyboard / :focus-visible.
 * Disabled state dims track (opacity 0.5) and mutes label color.
 *
 * Props:
 *   checked     — boolean (controlled)
 *   onChange    — (checked: boolean) => void
 *   labelLeft   — text shown to the left of the track (optional)
 *   labelRight  — text shown to the right of the track (optional)
 *   disabled    — boolean
 *   id          — forwarded to the <input> for label association
 */
export function Toggle({
  checked = false,
  onChange,
  labelLeft,
  labelRight,
  disabled = false,
  id,
  ...props
}) {
  const handleChange = (e) => {
    if (!disabled) onChange?.(e.target.checked);
  };

  return (
    <label
      className={[
        'toggle',
        checked   ? 'toggle--on'       : '',
        disabled  ? 'toggle--disabled' : '',
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {labelLeft && (
        <span className="toggle__label toggle__label--left">{labelLeft}</span>
      )}

      <span className="toggle__track" aria-hidden="true">
        <span className="toggle__thumb" />
      </span>

      <input
        type="checkbox"
        className="toggle__input"
        role="switch"
        checked={checked}
        disabled={disabled}
        id={id}
        onChange={handleChange}
        aria-checked={checked}
      />

      {labelRight && (
        <span className="toggle__label toggle__label--right">{labelRight}</span>
      )}
    </label>
  );
}

export default Toggle;
