import { cn } from '@/lib/utils'

/**
 * Small typographic divider with an optional label in the middle.
 * Used as a quiet section break.
 */
export default function Divider({
  label,
  className,
}: {
  label?: string
  className?: string
}) {
  if (!label) {
    return <div className={cn('rule-soft', className)} />
  }

  return (
    <div className={cn('divider-label eyebrow text-bone-500', className)}>
      <span>{label}</span>
    </div>
  )
}
