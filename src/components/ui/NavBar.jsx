import React from 'react';
import { Avatar } from './Avatar';
import './navbar.css';

/* ─── Icons ───────────────────────────────────────────────────────────────────
   Derived from Figma PMO Icon vectors (node 194:6623).
   ─────────────────────────────────────────────────────────────────────────── */

function MenuIcon() {
  return (
    <svg className="navbar__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <line x1="3" y1="7"  x2="17" y2="7"  stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="3" y1="17" x2="21" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function AppsIcon() {
  return (
    <svg className="navbar__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M4 2C4.57523 2 5.06669 2.27762 5.39453 2.60547C5.72238 2.93331 6 3.42477 6 4C6 4.57523 5.72238 5.06669 5.39453 5.39453C5.06669 5.72238 4.57523 6 4 6C3.42477 6 2.93331 5.72238 2.60547 5.39453C2.27762 5.06669 2 4.57523 2 4C2 3.42477 2.27762 2.93331 2.60547 2.60547C2.93331 2.27762 3.42477 2 4 2ZM12 2C12.5752 2 13.0667 2.27762 13.3945 2.60547C13.7224 2.93331 14 3.42477 14 4C14 4.57523 13.7224 5.06669 13.3945 5.39453C13.0667 5.72238 12.5752 6 12 6C11.4248 6 10.9333 5.72238 10.6055 5.39453C10.2776 5.06669 10 4.57523 10 4C10 3.42477 10.2776 2.93331 10.6055 2.60547C10.9333 2.27762 11.4248 2 12 2ZM21.3945 2.60547C21.0667 2.27762 20.5752 2 20 2C19.4248 2 18.9333 2.27762 18.6055 2.60547C18.2776 2.93331 18 3.42477 18 4C18 4.57523 18.2776 5.06669 18.6055 5.39453C18.9333 5.72238 19.4248 6 20 6C20.5752 6 21.0667 5.72238 21.3945 5.39453C21.7224 5.06669 22 4.57523 22 4C22 3.42477 21.7224 2.93331 21.3945 2.60547ZM4 10C4.57523 10 5.06669 10.2776 5.39453 10.6055C5.72238 10.9333 6 11.4248 6 12C6 12.5752 5.72238 13.0667 5.39453 13.3945C5.06669 13.7224 4.57523 14 4 14C3.42477 14 2.93331 13.7224 2.60547 13.3945C2.27762 13.0667 2 12.5752 2 12C2 11.4248 2.27762 10.9333 2.60547 10.6055C2.93331 10.2776 3.42477 10 4 10ZM13.3945 10.6055C13.0667 10.2776 12.5752 10 12 10C11.4248 10 10.9333 10.2776 10.6055 10.6055C10.2776 10.9333 10 11.4248 10 12C10 12.5752 10.2776 13.0667 10.6055 13.3945C10.9333 13.7224 11.4248 14 12 14C12.5752 14 13.0667 13.7224 13.3945 13.3945C13.7224 13.0667 14 12.5752 14 12C14 11.4248 13.7224 10.9333 13.3945 10.6055ZM20 10C20.5752 10 21.0667 10.2776 21.3945 10.6055C21.7224 10.9333 22 11.4248 22 12C22 12.5752 21.7224 13.0667 21.3945 13.3945C21.0667 13.7224 20.5752 14 20 14C19.4248 14 18.9333 13.7224 18.6055 13.3945C18.2776 13.0667 18 12.5752 18 12C18 11.4248 18.2776 10.9333 18.6055 10.6055C18.9333 10.2776 19.4248 10 20 10ZM5.39453 18.6055C5.06669 18.2776 4.57523 18 4 18C3.42477 18 2.93331 18.2776 2.60547 18.6055C2.27762 18.9333 2 19.4248 2 20C2 20.5752 2.27762 21.0667 2.60547 21.3945C2.93331 21.7224 3.42477 22 4 22C4.57523 22 5.06669 21.7224 5.39453 21.3945C5.72238 21.0667 6 20.5752 6 20C6 19.4248 5.72238 18.9333 5.39453 18.6055ZM12 18C12.5752 18 13.0667 18.2776 13.3945 18.6055C13.7224 18.9333 14 19.4248 14 20C14 20.5752 13.7224 21.0667 13.3945 21.3945C13.0667 21.7224 12.5752 22 12 22C11.4248 22 10.9333 21.7224 10.6055 21.3945C10.2776 21.0667 10 20.5752 10 20C10 19.4248 10.2776 18.9333 10.6055 18.6055C10.9333 18.2776 11.4248 18 12 18ZM21.3945 18.6055C21.0667 18.2776 20.5752 18 20 18C19.4248 18 18.9333 18.2776 18.6055 18.6055C18.2776 18.9333 18 19.4248 18 20C18 20.5752 18.2776 21.0667 18.6055 21.3945C18.9333 21.7224 19.4248 22 20 22C20.5752 22 21.0667 21.7224 21.3945 21.3945C21.7224 21.0667 22 20.5752 22 20C22 19.4248 21.7224 18.9333 21.3945 18.6055Z" fill="currentColor"/>
    </svg>
  );
}

function CaretDownIcon() {
  return (
    <svg className="navbar__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 11L12 15L16 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── App-logo components ─────────────────────────────────────────────────────
   Each variant has a branded icon next to the wordmark.
   Account Profile: white rounded-square container + orange flame.
   Timesheets / Staffing: inline coloured icon, no container.
   ─────────────────────────────────────────────────────────────────────────── */

function LogoAccountProfile() {
  return (
    <div className="navbar__app-logo" aria-hidden="true">
      <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#ap-shadow)">
          <rect x="1" width="40" height="40" rx="20" fill="white"/>
          <g clipPath="url(#ap-clip)">
            <path d="M23.3545 14.0113C23.4552 14.4684 23.5202 14.9326 23.5489 15.3998C23.7145 17.2313 25.8265 18.5107 27.3994 18.5107C27.5844 17.9083 27.8633 9.83209 20.7287 10.0027C20.7287 10.0027 22.5386 10.898 23.3545 14.0113Z" fill="#E85C26"/>
            <path d="M23.5489 25.2261C23.5489 25.6983 23.5202 26.1448 23.5489 26.612C23.7145 28.4435 25.8264 29.7229 27.3993 29.7229C27.3994 23.1304 27.4594 19.2424 27.4594 17.2727C27.0736 15.6268 26.0351 15.3871 23.5488 15.3871C23.5488 15.3871 23.5489 20.3815 23.5489 25.2261Z" fill="#E85C26"/>
            <path d="M14.6006 26.0281L14.6006 30.0647C14.6006 30.0647 18.0146 27.7195 18.1133 24.5392L18.0739 20.9613C17.6875 23.9056 14.6006 26.0281 14.6006 26.0281Z" fill="#F09021"/>
            <path d="M14.5372 19.4007L14.5355 19.406L14.5374 19.6939L14.5372 19.4007Z" fill="#E85C26"/>
            <path d="M14.5374 19.6947L14.6006 29.7686L14.6006 26.0281C14.6006 26.0281 17.6875 23.9056 18.0737 20.9615L18.1106 24.2868C18.1106 24.2716 18.1128 24.2578 18.1133 24.2431L18.0104 14.9319C16.218 16.4227 15.0272 18.6807 14.5374 19.6947Z" fill="#E85C26"/>
            <path d="M14.5374 19.6947C15.4118 17.8844 18.5206 12.1084 23.2998 13.8148C22.5131 11.0448 20.941 10.1178 20.7486 10.013C19.667 10.0685 18.6187 10.4055 17.7074 10.9906C15.7034 12.2469 14.5351 14.4906 14.5351 16.8563L14.5374 19.6947Z" fill="#F09021"/>
            <path d="M20.7829 20.2949C19.6747 20.2949 18.6309 21.1098 18.6309 22.1172C18.6309 23.1246 19.6747 23.9394 20.7829 23.9394C24.4686 23.9394 27.4617 20.9567 27.4617 17.2727C27.4568 17.2777 27.7536 20.2949 20.7829 20.2949Z" fill="#F09021"/>
          </g>
        </g>
        <defs>
          <filter id="ap-shadow" x="0" y="0" width="42" height="42" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="1"/>
            <feGaussianBlur stdDeviation="0.5"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0.290196 0 0 0 0 0.290196 0 0 0 0 0.290196 0 0 0 0.15 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
          </filter>
          <clipPath id="ap-clip">
            <rect width="20" height="20" fill="white" transform="translate(11 10)"/>
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function LogoTimesheets() {
  return (
    <div className="navbar__app-logo-inline" aria-hidden="true">
      <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.0346 8.95483C11.0448 8.96792 13.1337 11.643 16.0687 13.1505C18.1143 14.2106 19.7922 15.2933 19.9762 17.0525C19.996 17.263 20.0023 17.4667 19.9975 17.6636C19.0988 18.9265 16.9029 19.7597 14.2593 20.165C14.7224 19.7869 15.1837 19.2024 15.218 18.3608C15.3099 16.1053 14.2296 15.203 12.9424 14.1655C12.5976 13.8723 12.1379 13.5337 11.7242 13.1728C11.1725 12.6766 10.8506 11.9775 10.8276 11.2332C10.7587 10.376 10.8507 9.33829 11.0346 8.95483ZM8.96569 8.95483C9.14956 9.33832 9.24164 10.3761 9.17269 11.2332C9.14969 11.9775 8.82774 12.6766 8.27615 13.1728C7.86243 13.5337 7.40272 13.8723 7.05793 14.1655C5.77072 15.2031 4.69043 16.1053 4.78234 18.3608C4.81352 19.1259 5.19753 19.6784 5.61496 20.0566C3.16716 19.6199 1.07745 18.8221 0.00248089 17.6629C-0.00233852 17.4663 0.00430176 17.2628 0.0241397 17.0525C0.208113 15.2933 1.88597 14.2106 3.93161 13.1505C6.87381 11.6392 8.96569 8.95483 8.96569 8.95483Z" fill="#F09021"/>
        <path d="M19.9988 17.6615C19.9988 19.06 19.1945 20.6616 17.8613 21.9022C16.4592 23.233 14.6202 24 12.8273 24H7.17254C5.40261 24 3.56358 23.233 2.13845 21.9022C0.805325 20.639 0.000976562 19.06 0.000976562 17.6615C3.44892 21.3833 17.3554 21.3833 19.9988 17.6615ZM6.87393 0C7.17262 9.06267e-05 7.40254 0.180522 7.4715 0.428559C7.51744 0.676598 7.40261 0.924892 7.17289 1.06025C2.7136 3.56398 6.11528 6.72186 7.4715 7.53393C8.38095 8.07383 8.78532 8.55485 8.95886 8.96316C8.89159 9.04826 8.32683 9.75323 7.41327 10.6178C6.44621 9.69701 5.34779 8.98505 4.34553 8.34576C2.52962 7.19539 0.989449 6.18042 0.805549 4.39848C0.713608 3.27067 0.989325 2.32315 1.65592 1.60135C2.87422 0.270635 5.173 4.91426e-06 6.87393 0ZM13.1262 0C14.8272 2.38748e-05 17.126 0.270613 18.3442 1.60135C19.0108 2.32313 19.2865 3.27073 19.1946 4.39848C19.0107 6.18038 17.4705 7.19542 15.6546 8.34576C14.6522 8.98512 13.5533 9.69686 12.5862 10.6178C11.6355 9.71805 11.0631 8.99086 11.0356 8.95584C11.2138 8.54907 11.6245 8.07068 12.5287 7.53393C13.8849 6.72176 17.2862 3.56389 12.8273 1.06025C12.5975 0.924901 12.4827 0.676654 12.5287 0.428559C12.5976 0.180485 12.8274 6.02959e-06 13.1262 0Z" fill="#E85C26"/>
      </svg>
    </div>
  );
}

function LogoStaffing() {
  return (
    <div className="navbar__app-logo-inline" aria-hidden="true">
      {/* Abstract staffing logo — two overlapping triangular fills */}
      <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
        <polygon points="0,24 0,1 8,11 16,1 16,13 8,18" fill="#E85C25" />
        <polygon points="8,18 20,10 20,22 8,24"          fill="#F09121" />
      </svg>
    </div>
  );
}

/* ─── Variant config ──────────────────────────────────────────────────────────
   Encodes the per-variant nav structure derived from Figma.
   ─────────────────────────────────────────────────────────────────────────── */

export const NAVBAR_VARIANTS = {
  'account-profile': {
    Logo: LogoAccountProfile,
    showHamburger: true,
    brandLabel: 'Account Profile',
    navSize: 'lg',            // 18px nav labels
    defaultActive: 'srp',
    navItems: [
      { id: 'accounts',   label: 'Accounts' },
      { id: 'dashboard',  label: 'Dashboard' },
      { id: 'case-studies', label: 'Case Studies' },
      { id: 'srp',        label: 'Sales Revenue Projections' },
    ],
  },
  'timesheets': {
    Logo: LogoTimesheets,
    showHamburger: false,
    brandLabel: 'Timesheets',
    navSize: 'lg',
    defaultActive: 'time-reports',
    navItems: [
      { id: 'time-reports',    label: 'Time Reports' },
      { id: 'reconciliation',  label: 'Reconciliation' },
    ],
  },
  'staffing': {
    Logo: LogoStaffing,
    showHamburger: true,
    brandLabel: 'Staffing',
    navSize: 'sm',            // 16px nav labels (Header/Tabs component)
    defaultActive: 'recruitment',
    navItems: [
      { id: 'hiring',      label: 'Hiring' },
      { id: 'demand',      label: 'Demand' },
      { id: 'employees',   label: 'Employees' },
      { id: 'recruitment', label: 'Recruitment', counter: 12, chevron: true },
    ],
  },
};

/* ─── NavBar component ────────────────────────────────────────────────────────
 *
 * Props:
 *   variant      — 'account-profile' | 'timesheets' | 'staffing'
 *   activeNavItem — controlled active nav ID (falls back to variant default)
 *   onNavChange  — (id: string) => void
 *   userName     — display name shown next to avatar (default: 'Mikhail')
 *   userInitials — letters shown inside avatar circle (default: 'MK')
 *
 * Ref: Figma node 194:6623.
 * ─────────────────────────────────────────────────────────────────────────── */
export function NavBar({
  variant = 'account-profile',
  activeNavItem,
  onNavChange,
  userName     = 'Mikhail',
  userInitials = 'MK',
  ...props
}) {
  const config  = NAVBAR_VARIANTS[variant] ?? NAVBAR_VARIANTS['account-profile'];
  const { Logo, showHamburger, brandLabel, navSize, navItems } = config;
  const active  = activeNavItem ?? config.defaultActive;

  return (
    <nav
      className={['navbar', `navbar--${variant}`].join(' ')}
      role="navigation"
      aria-label={`${brandLabel} navigation`}
      {...props}
    >
      {/* ── Left: brand + nav links ─────────────────────────────── */}
      <div className="navbar__left">

        {/* Brand group */}
        <div className="navbar__brand">
          {showHamburger && (
            <button className="navbar__icon-btn" aria-label="Open menu" type="button">
              <MenuIcon />
            </button>
          )}
          <div className="navbar__brand-name">
            <Logo />
            <span className="navbar__brand-label">{brandLabel}</span>
          </div>
        </div>

        {/* Nav links */}
        <div className="navbar__nav" role="list">
          {navItems.map((item) => {
            const isActive = item.id === active;
            return (
              <button
                key={item.id}
                role="listitem"
                type="button"
                className={[
                  'navbar__nav-item',
                  navSize === 'sm' ? 'navbar__nav-item--sm'     : '',
                  isActive        ? 'navbar__nav-item--active'  : '',
                ].filter(Boolean).join(' ')}
                onClick={() => onNavChange?.(item.id)}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Label row */}
                <span className="navbar__nav-inner">
                  <span className="navbar__nav-label">{item.label}</span>
                  {item.counter != null && (
                    <span className="navbar__nav-counter">{item.counter}</span>
                  )}
                  {item.chevron && <CaretDownIcon />}
                </span>

                {/* Active underline indicator */}
                {isActive && (
                  <span className="navbar__nav-underline" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Right: apps launcher + user profile ─────────────────── */}
      <div className="navbar__right">
        <button className="navbar__icon-btn navbar__icon-btn--apps" aria-label="Open apps" type="button">
          <AppsIcon />
        </button>

        <div className="navbar__user">
          <Avatar initials={userInitials} size="10" aria-hidden="true" />
          <button className="navbar__user-btn" type="button" aria-label={`${userName} — account menu`}>
            <span className="navbar__user-name">{userName}</span>
            <CaretDownIcon />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
