import { type ElementType } from 'react'
import { cn } from '@/shared/lib/utils'

type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'overline'
type TypographyWeight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold'
type TypographyAlign = 'left' | 'center' | 'right'

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant
  weight?: TypographyWeight
  align?: TypographyAlign
  color?: string
  children: React.ReactNode
}

const VARIANT_CONFIG: Record<TypographyVariant, { tag: ElementType; classes: string }> = {
  h1: { tag: 'h1', classes: 'text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight' },
  h2: { tag: 'h2', classes: 'text-xl md:text-2xl lg:text-3xl font-semibold tracking-tight' },
  h3: { tag: 'h3', classes: 'text-lg md:text-xl lg:text-2xl font-semibold' },
  h4: { tag: 'h4', classes: 'text-base md:text-lg lg:text-xl font-medium' },
  body: { tag: 'p', classes: 'text-sm md:text-base text-neutral-700' },
  caption: { tag: 'span', classes: 'text-xs md:text-sm text-neutral-500' },
  overline: { tag: 'span', classes: 'text-xs uppercase tracking-widest font-semibold text-neutral-500' },
}

const WEIGHT_CLASSES: Record<TypographyWeight, string> = {
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
}

const ALIGN_CLASSES: Record<TypographyAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

export default function Typography({
  variant = 'body',
  weight,
  align = 'left',
  color,
  children,
  className,
  ...htmlProps
}: TypographyProps) {
  const config = VARIANT_CONFIG[variant]
  const Tag = config.tag

  return (
    <Tag
      className={cn(config.classes, weight && WEIGHT_CLASSES[weight], ALIGN_CLASSES[align], color, className)}
      {...htmlProps}
    >
      {children}
    </Tag>
  )
}
