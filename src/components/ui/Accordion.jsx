import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './accordion.css';

/**
 * Accordion component set — matches Figma DS (AI) node 34:526.
 *
 * Usage:
 *   <Accordion type="single" collapsible defaultValue="item-1">
 *     <AccordionItem value="item-1">
 *       <AccordionTrigger>Title</AccordionTrigger>
 *       <AccordionContent>Body text</AccordionContent>
 *     </AccordionItem>
 *   </Accordion>
 *
 * Accordion props:
 *   type         — 'single' (only one open at a time) | 'multiple'
 *   collapsible  — if true and type='single', the open item can be closed again
 *   defaultValue — string | string[] of initially-open item values
 *
 * AccordionItem props:
 *   value — unique identifier for the item (required)
 *
 * AccordionTrigger / AccordionContent accept any children.
 */

// ─── Chevron icon ──────────────────────────────────────────────────────────────
// Rotates 180° via CSS (.accordion-item--open .accordion-trigger__chevron)

function AccordionChevron() {
  return (
    <ChevronDown
      className="accordion-trigger__chevron"
      size={16}
      strokeWidth={1.5}
      aria-hidden="true"
    />
  );
}

// ─── Context ───────────────────────────────────────────────────────────────────

const AccordionContext = React.createContext(null);
const ItemContext = React.createContext(null);

// ─── Accordion ────────────────────────────────────────────────────────────────

export function Accordion({
  type = 'single',
  collapsible = true,
  defaultValue,
  value: controlledValue,
  onValueChange,
  children,
  ...props
}) {
  const isControlled = controlledValue !== undefined;

  const [internalOpen, setInternalOpen] = useState(() => {
    if (!defaultValue) return new Set();
    return new Set(Array.isArray(defaultValue) ? defaultValue : [defaultValue]);
  });

  const openSet = isControlled
    ? new Set(Array.isArray(controlledValue) ? controlledValue : [controlledValue])
    : internalOpen;

  const toggle = (val) => {
    let next;
    if (openSet.has(val)) {
      if (type === 'single' && !collapsible) return;
      next = new Set(openSet);
      next.delete(val);
    } else {
      next = type === 'single' ? new Set([val]) : new Set([...openSet, val]);
    }

    if (!isControlled) setInternalOpen(next);
    onValueChange?.(type === 'single' ? [...next][0] ?? null : [...next]);
  };

  return (
    <AccordionContext.Provider value={{ openSet, toggle }}>
      <div className="accordion" {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

// ─── AccordionItem ────────────────────────────────────────────────────────────

export function AccordionItem({ value, disabled = false, className, children, ...props }) {
  const ctx = React.useContext(AccordionContext);
  const isOpen = ctx?.openSet.has(value) ?? false;

  return (
    <ItemContext.Provider value={{ value, isOpen, disabled, toggle: ctx?.toggle }}>
      <div
        className={[
          'accordion-item',
          isOpen ? 'accordion-item--open' : '',
          disabled ? 'accordion-item--disabled' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        data-state={isOpen ? 'open' : 'closed'}
        {...props}
      >
        {children}
      </div>
    </ItemContext.Provider>
  );
}

// ─── AccordionTrigger ─────────────────────────────────────────────────────────

export function AccordionTrigger({ children, ...props }) {
  const { value, isOpen, disabled, toggle } = React.useContext(ItemContext);

  return (
    <button
      type="button"
      className="accordion-trigger"
      aria-expanded={isOpen}
      aria-controls={`accordion-content-${value}`}
      id={`accordion-trigger-${value}`}
      disabled={disabled}
      onClick={() => !disabled && toggle?.(value)}
      {...props}
    >
      <span className="accordion-trigger__text">{children}</span>
      <AccordionChevron />
    </button>
  );
}

// ─── AccordionContent ─────────────────────────────────────────────────────────

export function AccordionContent({ children, ...props }) {
  const { value, isOpen } = React.useContext(ItemContext);

  return (
    <div
      className={`accordion-content${isOpen ? ' accordion-content--open' : ''}`}
      id={`accordion-content-${value}`}
      role="region"
      aria-labelledby={`accordion-trigger-${value}`}
      data-state={isOpen ? 'open' : 'closed'}
      {...props}
    >
      <div className="accordion-content__inner">
        <div className="accordion-content__body">{children}</div>
      </div>
    </div>
  );
}

export default Accordion;
