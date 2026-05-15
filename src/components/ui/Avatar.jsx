import React from 'react';
import './avatar.css';

/**
 * Avatar component — matches Figma DS (AI) Avatar component set.
 * Types: image | initials | icon (fallback)
 * Sizes: 12 (48px) | 10 (40px) | 8 (32px) | 6 (24px) | 5 (20px)
 */
export function Avatar({
  src = null,
  alt = '',
  initials = null,
  size = '12',
  ...props
}) {
  return (
    <div className={`avatar avatar--size-${size}${src ? '' : ' avatar--fallback'}`} {...props}>
      {src ? (
        <img className="avatar__img" src={src} alt={alt} />
      ) : initials ? (
        <span className="avatar__initials">{initials}</span>
      ) : (
        <span className="avatar__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </span>
      )}
    </div>
  );
}

/**
 * AvatarGroup component — stacked avatars with optional overflow counter.
 * Sizes: default (48px) | small (32px)
 */
export function AvatarGroup({
  avatars = [],
  size = 'default',
  max = 5,
  ...props
}) {
  const avatarSize = size === 'small' ? '8' : '12';
  const visible = avatars.slice(0, max);
  const overflow = avatars.length - max;

  return (
    <div className={`avatar-group avatar-group--size-${size}`} {...props}>
      {visible.map((avatar, i) => (
        <Avatar
          key={i}
          src={avatar.src}
          alt={avatar.alt}
          initials={avatar.initials}
          size={avatarSize}
        />
      ))}
      {overflow > 0 && (
        <div className="avatar-group__overflow" aria-label={`${overflow} more`}>
          +{overflow}
        </div>
      )}
    </div>
  );
}

export default Avatar;
