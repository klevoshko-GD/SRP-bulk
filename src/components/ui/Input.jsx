import React from 'react';
import './input.css';

/**
 * Input component — matches Figma DS (AI) Input component set.
 * States: default | focus | filled | error | error-focus | disabled
 * Features: optional label, placeholder, description, error message, leading/trailing icons
 */
export function Input({
  label,
  description,
  errorMessage,
  placeholder = 'Placeholder',
  value,
  defaultValue,
  disabled = false,
  state = 'default',   // 'default' | 'error'
  leadingIcon = null,
  trailingIcon = null,
  type = 'text',
  id,
  onChange,
  ...props
}) {
  const isError = state === 'error';

  const boxClass = [
    'input-box',
    isError ? 'is-error' : '',
    disabled ? 'is-disabled' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className="input-field">
      {label && (
        <label className="input-label" htmlFor={id}>
          {label}
        </label>
      )}
      <div className={boxClass}>
        {leadingIcon && <span className="input-icon" aria-hidden="true">{leadingIcon}</span>}
        <input
          id={id}
          type={type}
          className="input-native"
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          aria-invalid={isError}
          aria-describedby={description ? `${id}-desc` : errorMessage ? `${id}-err` : undefined}
          {...props}
        />
        {trailingIcon && <span className="input-icon" aria-hidden="true">{trailingIcon}</span>}
      </div>
      {isError && errorMessage && (
        <span id={`${id}-err`} className="input-error-message">{errorMessage}</span>
      )}
      {description && !isError && (
        <span id={`${id}-desc`} className="input-description">{description}</span>
      )}
    </div>
  );
}

export default Input;

/**
 * InlineLabelInput — floating-label input following Material Design 3 guidelines.
 *
 * The label rests centered at body size (14px) when the field is empty & unfocused,
 * then "floats" to the top at 12px on focus or when a value is present.
 * Label color: muted (rest) → primary (focused) → muted (filled, unfocused) → error (error).
 *
 * Props:
 *   label        — label text, e.g. "Project"  (sentence/title case, not uppercase)
 *   placeholder  — placeholder shown inside the input while actively typing
 *   value / defaultValue / onChange — standard input props
 *   disabled     — disables the control
 *   state        — 'default' | 'error'
 *   forcedState  — 'focus' | 'error-focus'  (Storybook visual demo only)
 *   trailingSlot — optional React node on the right (clear button, chevron, etc.)
 *   errorMessage — shown below the box when state='error'
 */
export function InlineLabelInput({
  label,
  placeholder = '',
  value: valueProp,
  defaultValue,
  disabled = false,
  state = 'default',
  forcedState,
  trailingSlot = null,
  errorMessage,
  id,
  onChange,
  ...props
}) {
  // Track whether input has content so we can apply is-filled (floats label).
  const [hasValue, setHasValue] = React.useState(!!(defaultValue ?? valueProp));

  const isControlled = valueProp !== undefined;
  const isFilled     = isControlled ? !!valueProp : hasValue;
  const isError      = state === 'error' || forcedState === 'error-focus';
  const isFocused    = forcedState === 'focus' || forcedState === 'error-focus';

  const handleChange = (e) => {
    if (!isControlled) setHasValue(!!e.target.value);
    onChange?.(e);
  };

  const boxClass = [
    'input-inline-box',
    isError   ? 'is-error'   : '',
    isFocused ? 'is-focused' : '',
    isFilled  ? 'is-filled'  : '',
    disabled  ? 'is-disabled': '',
  ].filter(Boolean).join(' ');

  return (
    <div className="input-field">
      <div className={boxClass}>
        {/* Floating label + native input share the content area */}
        <div className="input-inline-content">
          {label && (
            <label className="input-inline-label" htmlFor={id}>
              {label}
            </label>
          )}
          <input
            id={id}
            type="text"
            className="input-inline-native"
            placeholder={placeholder}
            disabled={disabled}
            value={isControlled ? valueProp : undefined}
            defaultValue={!isControlled ? defaultValue : undefined}
            onChange={handleChange}
            aria-invalid={isError || undefined}
            aria-describedby={errorMessage ? `${id}-inline-err` : undefined}
            {...props}
          />
        </div>

        {/* Trailing slot: clear, chevron, etc. */}
        {trailingSlot && (
          <div className="input-inline-trailing">{trailingSlot}</div>
        )}
      </div>

      {isError && errorMessage && (
        <span id={`${id}-inline-err`} className="input-inline-error" role="alert">
          {errorMessage}
        </span>
      )}
    </div>
  );
}
