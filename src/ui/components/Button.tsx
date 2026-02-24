import { motion, type HTMLMotionProps } from 'framer-motion'

const BUTTON_ANIMATION_CONFIG = {
  entrance: { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 } },
  hover: { scale: 1.03 },
  tap: { scale: 0.97 },
  transition: { duration: 0.2, ease: 'easeOut' },
} as const

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  children: React.ReactNode
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm',
  secondary:
    'bg-secondary-600 text-white hover:bg-secondary-700 active:bg-secondary-800 shadow-sm',
  outline:
    'border-2 border-primary-500 text-primary-600 hover:bg-primary-50 active:bg-primary-100',
  ghost:
    'text-neutral-600 hover:bg-neutral-100 active:bg-neutral-200',
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-sm py-xs text-sm md:px-md md:py-xs',
  md: 'px-md py-sm text-base md:px-lg md:py-sm',
  lg: 'px-lg py-md text-lg md:px-xl md:py-md',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  children,
  className = '',
  ...motionProps
}: ButtonProps) {
  const isDisabled = disabled || loading

  const combinedClassName = [
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors cursor-pointer',
    'focus:outline-2 focus:outline-offset-2 focus:outline-primary-500',
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    fullWidth ? 'w-full' : '',
    isDisabled ? 'opacity-50 cursor-not-allowed' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <motion.button
      initial={BUTTON_ANIMATION_CONFIG.entrance.initial}
      animate={BUTTON_ANIMATION_CONFIG.entrance.animate}
      whileHover={isDisabled ? undefined : BUTTON_ANIMATION_CONFIG.hover}
      whileTap={isDisabled ? undefined : BUTTON_ANIMATION_CONFIG.tap}
      transition={BUTTON_ANIMATION_CONFIG.transition}
      disabled={isDisabled}
      className={combinedClassName}
      {...motionProps}
    >
      {loading && <LoadingSpinner />}
      {children}
    </motion.button>
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
