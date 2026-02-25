import { type ReactNode } from 'react'
import {
  Button as AnimateUIButton,
  type ButtonProps as AnimateUIButtonProps,
} from '@/components/animate-ui/components/buttons/button'
import { cn } from '@/lib/utils'

type IconButtonVariant = 'neutral' | 'danger'
type IconButtonSize = 'sm' | 'md' | 'lg'

interface IconButtonProps extends Omit<AnimateUIButtonProps, 'variant' | 'size' | 'children' | 'asChild'> {
  icon: ReactNode
  variant?: IconButtonVariant
  iconButtonSize?: IconButtonSize
}

const VARIANT_MAP: Record<IconButtonVariant, AnimateUIButtonProps['variant']> = {
  neutral: 'outline',
  danger: 'destructive',
}

const SIZE_MAP: Record<IconButtonSize, AnimateUIButtonProps['size']> = {
  sm: 'icon-sm',
  md: 'icon',
  lg: 'icon-lg',
}

export default function IconButton({
  icon,
  variant = 'neutral',
  iconButtonSize = 'md',
  disabled = false,
  className,
  ...restProps
}: IconButtonProps) {
  return (
    <AnimateUIButton
      asChild={false}
      variant={VARIANT_MAP[variant]}
      size={SIZE_MAP[iconButtonSize]}
      disabled={disabled}
      className={cn(disabled && 'cursor-not-allowed', className)}
      {...restProps}
    >
      {icon}
    </AnimateUIButton>
  )
}
