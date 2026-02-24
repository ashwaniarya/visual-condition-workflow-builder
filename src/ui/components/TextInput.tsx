import { motion } from 'framer-motion'
import { forwardRef, type InputHTMLAttributes } from 'react'

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
  sm: 'px-sm py-xs text-sm',
  md: 'px-md py-sm text-base',
  lg: 'px-lg py-md text-lg',
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

    const inputClassName = [
      'block rounded-lg border bg-white transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
      'placeholder:text-neutral-400',
      SIZE_CLASSES[inputSize],
      error
        ? 'border-error-500 focus:ring-error-500 focus:border-error-500'
        : 'border-neutral-300 hover:border-neutral-400',
      disabled ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed' : '',
      fullWidth ? 'w-full' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')

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
            className="block mb-xs text-sm font-medium text-neutral-700"
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
          <p className="mt-xs text-sm text-error-600">{error}</p>
        )}
      </motion.div>
    )
  },
)

TextInput.displayName = 'TextInput'
export default TextInput
