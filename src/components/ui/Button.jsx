import React from 'react';
import './button.css';

/**
 * Button component — token-driven, matches Figma DS (AI) Button component set.
 *
 * Variants: default | secondary | outline | outline-brand | outline-secondary | ghost | ghost-secondary | link | destructive
 * Sizes: xs | sm | default | lg | icon
 * States: default | disabled | loading
 */
export function Button({
  variant = 'default',
  size = 'default',
  disabled = false,
  loading = false,
  leftIcon = null,
  rightIcon = null,
  children,
  onClick,
  ...props
}) {
  const sizeClass = size === 'default' ? 'btn--default' : `btn--${size}`;
  const variantClass = variant === 'default' ? 'btn--default-variant' : `btn--${variant}`;

  return (
    <button
      type="button"
      className={['btn', sizeClass, variantClass].join(' ')}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <>
          <span className="btn__spinner" aria-hidden="true" />
          {children && <span>{children}</span>}
        </>
      ) : (
        <>
          {leftIcon && <span className="btn__icon" aria-hidden="true">{leftIcon}</span>}
          {size !== 'icon' && children && <span>{children}</span>}
          {rightIcon && size !== 'icon' && <span className="btn__icon" aria-hidden="true">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}

export default Button;
