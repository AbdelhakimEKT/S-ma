'use client'

import Link from 'next/link'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'ghost' | 'outline' | 'muted'
type Size = 'sm' | 'md' | 'lg'

interface BaseProps {
  variant?: Variant
  size?: Size
  className?: string
  children: React.ReactNode
  /** Adds the small ember dot before the label. */
  dot?: boolean
}

type ButtonAsButton = BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: undefined
}

type ButtonAsLink = BaseProps & {
  href: string
  type?: undefined
  disabled?: undefined
}

type ButtonProps = ButtonAsButton | ButtonAsLink

const base =
  'group relative inline-flex items-center justify-center gap-3 rounded-full border font-sans tracking-tight-1 transition-all duration-600 ease-soma disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-ember-500'

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-[13px]',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-4 text-base',
}

const variants: Record<Variant, string> = {
  primary:
    'border-ember-500/60 bg-ember-500/15 text-bone-100 hover:bg-ember-500/25 hover:border-ember-400/80 hover:shadow-[0_0_40px_-8px_rgba(220,176,132,0.35)]',
  ghost:
    'border-transparent text-bone-200 hover:text-bone-100 hover:bg-bone-100/[0.04]',
  outline:
    'border-[var(--line-strong)] text-bone-200 hover:text-bone-100 hover:bg-bone-100/[0.04] hover:border-bone-400/40',
  muted:
    'border-transparent bg-bone-100/[0.04] text-bone-300 hover:bg-bone-100/[0.08] hover:text-bone-100',
}

/**
 * Consistent call-to-action used across the site. Handles both button and
 * link use via a simple discriminated union on `href`.
 */
const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(function Button(
  { variant = 'outline', size = 'md', className, children, dot = false, ...rest },
  ref,
) {
  const classes = cn(base, sizes[size], variants[variant], className)

  const inner = (
    <>
      {dot && (
        <span className="relative h-1.5 w-1.5 rounded-full bg-ember-500 transition-transform duration-900 ease-soma group-hover:scale-150">
          <span className="absolute inset-0 rounded-full bg-ember-500 blur-[4px] opacity-60" />
        </span>
      )}
      <span className="relative">{children}</span>
      <svg
        viewBox="0 0 24 24"
        width={14}
        height={14}
        fill="none"
        className="relative -translate-x-1 opacity-0 transition-all duration-600 ease-soma group-hover:translate-x-0 group-hover:opacity-100"
        aria-hidden
      >
        <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </>
  )

  if ('href' in rest && rest.href) {
    const { href, ...anchorRest } = rest as ButtonAsLink
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={classes}
        {...(anchorRest as any)}
      >
        {inner}
      </Link>
    )
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={classes}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {inner}
    </button>
  )
})

export default Button
