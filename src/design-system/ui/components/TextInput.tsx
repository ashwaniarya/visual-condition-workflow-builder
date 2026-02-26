import { motion } from 'motion/react'
import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/utils'

const TEXT_INPUT_ANIMATION_CONFIG = {
  entrance: { initial: { opacity: 0, y: 4 }, animate: { opacity: 1, y: 0 } },
  transition: { duration: 0.2, ease: 'easeOut' },
} as const

type TextInputSize = 'sm' | 'md' | 'lg'

interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  inputSize?: TextInputSize
  fullWidth?: boolean
}

const SIZE_CLASSES: Record<TextInputSize, string> = {
  sm: 'px-2 py-1 text-xs h-7',
  md: 'px-3 py-1.5 text-sm h-9',
  lg: 'px-4 py-2 text-base h-11',
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      label,
      error,
      inputSize = 'md',
      fullWidth = false,
      disabled = false,
      className = '',
      id,
      ...inputProps
    },
    ref,
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    const inputClassName = cn(
      'block rounded-md border bg-white transition-all duration-200 shadow-sm',
      'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
      'placeholder:text-neutral-400 text-neutral-900',
      SIZE_CLASSES[inputSize],
      error
        ? 'border-error-500 focus:ring-error-500/20 focus:border-error-500'
        : 'border-neutral-300 hover:border-neutral-400',
      disabled && 'bg-neutral-50 text-neutral-400 cursor-not-allowed border-neutral-200',
      fullWidth && 'w-full',
      className,
    )

    return (
      <motion.div
        initial={TEXT_INPUT_ANIMATION_CONFIG.entrance.initial}
        animate={TEXT_INPUT_ANIMATION_CONFIG.entrance.animate}
        transition={TEXT_INPUT_ANIMATION_CONFIG.transition}
        className={fullWidth ? 'w-full' : 'inline-block'}
      >
        {label && (
          <label
            htmlFor={inputId}
            className="block mb-1.5 text-xs font-semibold text-neutral-700 uppercase tracking-wide"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={inputClassName}
          {...inputProps}
        />
        {error && (
          <p className="mt-1 text-xs text-error-600 font-medium">{error}</p>
        )}
      </motion.div>
    )
  },
)

TextInput.displayName = 'TextInput'
export default TextInput
