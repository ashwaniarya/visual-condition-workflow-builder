import { type ReactNode } from 'react'
import {
  Button as AnimateUIButton,
  type ButtonProps as AnimateUIButtonProps,
} from '@/design-system/ui/internal/animate-ui/components/buttons/button'
import { cn } from '@/shared/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends Omit<AnimateUIButtonProps, 'variant' | 'size' | 'asChild'> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  fullWidth?: boolean
  children: ReactNode
}

const VARIANT_MAP: Record<ButtonVariant, AnimateUIButtonProps['variant']> = {
  primary: 'default',
  secondary: 'secondary',
  outline: 'outline',
  ghost: 'ghost',
}

const SIZE_MAP: Record<ButtonSize, AnimateUIButtonProps['size']> = {
  sm: 'sm',
  md: 'default',
  lg: 'lg',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  children,
  className,
  ...restProps
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <AnimateUIButton
      asChild={false}
      variant={VARIANT_MAP[variant]}
      size={SIZE_MAP[size]}
      disabled={isDisabled}
      className={cn(fullWidth && 'w-full', isDisabled && 'cursor-not-allowed', className)}
      {...restProps}
    >
      {loading && <LoadingSpinner />}
      {children}
    </AnimateUIButton>
  )
}

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin -ml-1 mr-sm h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}
