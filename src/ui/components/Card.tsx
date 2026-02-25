import type { HTMLAttributes, ReactNode } from 'react'

const CARD_STYLE_CONFIG = {
  base: 'rounded-xl border border-neutral-200 bg-white shadow-sm',
  padding: {
    none: '',
    sm: 'p-sm',
    md: 'p-md',
    lg: 'p-lg',
  },
} as const

type CardPadding = keyof typeof CARD_STYLE_CONFIG.padding

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  padding?: CardPadding
}

export default function Card({
  children,
  className = '',
  padding = 'md',
  ...divProps
}: CardProps) {
  const cardClassName = [
    CARD_STYLE_CONFIG.base,
    CARD_STYLE_CONFIG.padding[padding],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={cardClassName} {...divProps}>
      {children}
    </div>
  )
}
