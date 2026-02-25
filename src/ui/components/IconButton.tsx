import type { ButtonHTMLAttributes, ReactNode } from 'react'

const ICON_BUTTON_STYLE_CONFIG = {
  base:
    'inline-flex items-center justify-center rounded-md border transition-colors focus:outline-2 focus:outline-offset-2 focus:outline-primary-500',
  variant: {
    neutral: 'border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-100 active:bg-neutral-200',
    danger: 'border-error-500 bg-white text-error-600 hover:bg-error-50 active:bg-error-100',
  },
  size: {
    sm: 'h-7 w-7 text-xs',
    md: 'h-8 w-8 text-sm',
    lg: 'h-10 w-10 text-base',
  },
  disabled: 'cursor-not-allowed opacity-50',
} as const

type IconButtonVariant = keyof typeof ICON_BUTTON_STYLE_CONFIG.variant
type IconButtonSize = keyof typeof ICON_BUTTON_STYLE_CONFIG.size

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: ReactNode
  variant?: IconButtonVariant
  iconButtonSize?: IconButtonSize
}

export default function IconButton({
  icon,
  variant = 'neutral',
  iconButtonSize = 'md',
  disabled = false,
  className = '',
  ...buttonProps
}: IconButtonProps) {
  const iconButtonClassName = [
    ICON_BUTTON_STYLE_CONFIG.base,
    ICON_BUTTON_STYLE_CONFIG.variant[variant],
    ICON_BUTTON_STYLE_CONFIG.size[iconButtonSize],
    disabled ? ICON_BUTTON_STYLE_CONFIG.disabled : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      disabled={disabled}
      className={iconButtonClassName}
      {...buttonProps}
    >
      {icon}
    </button>
  )
}
