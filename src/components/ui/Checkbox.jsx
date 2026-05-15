import React, { useRef, useEffect } from 'react';
import './checkbox.css';

function CheckIcon() {
  return (
    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
      <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg width="10" height="2" viewBox="0 0 10 2" fill="none" aria-hidden="true">
      <path d="M1 1H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

/**
 * Checkbox component — matches Figma DS (AI) Checkbox component set.
 * States: unchecked | checked | indeterminate
 * Supports: label, description, disabled
 */
export function Checkbox({
  checked = false,
  indeterminate = false,
  disabled = false,
  label,
  description,
  onChange,
  id,
  ...props
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const isChecked = indeterminate ? false : checked;
  const boxClass = [
    'checkbox-box',
    isChecked ? 'is-checked' : '',
    indeterminate ? 'is-indeterminate' : '',
  ].filter(Boolean).join(' ');

  return (
    <label
      className={['checkbox-root', disabled ? 'is-disabled' : ''].filter(Boolean).join(' ')}
      htmlFor={id}
    >
      <span className={boxClass}>
        <input
          ref={inputRef}
          type="checkbox"
          id={id}
          className="checkbox-input"
          checked={isChecked}
          disabled={disabled}
          onChange={onChange}
          aria-checked={indeterminate ? 'mixed' : isChecked}
          {...props}
        />
        <span className="checkbox-indicator">
          {indeterminate ? <MinusIcon /> : isChecked ? <CheckIcon /> : null}
        </span>
      </span>
      {(label || description) && (
        <span className="checkbox-content">
          {label && <span className="checkbox-label">{label}</span>}
          {description && <span className="checkbox-description">{description}</span>}
        </span>
      )}
    </label>
  );
}

export default Checkbox;
