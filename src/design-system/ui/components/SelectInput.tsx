import { forwardRef, type SelectHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/utils'

const SELECT_INPUT_LAYOUT_CONFIG = {
  entranceInitial: { opacity: 0, y: 4 },
  entranceAnimate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: 'easeOut' },
} as const

type SelectInputSize = 'sm' | 'md' | 'lg'

export interface SelectInputOption {
  optionValue: string
  optionLabel: string
  disabled?: boolean
}

interface SelectInputProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string
  error?: string
  inputSize?: SelectInputSize
  fullWidth?: boolean
  options: SelectInputOption[]
  placeholderOptionLabel?: string
}

const SIZE_CLASSES: Record<SelectInputSize, string> = {
  sm: 'px-sm py-xs text-sm',
  md: 'px-md py-sm text-base',
  lg: 'px-lg py-md text-lg',
}

const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
  (
    {
      label,
      error,
      inputSize = 'md',
      fullWidth = false,
      disabled = false,
      className = '',
      id,
      options,
      placeholderOptionLabel,
      ...selectProps
    },
    ref,
  ) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')

    const selectClassName = cn(
      'block rounded-lg border bg-white transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
      SIZE_CLASSES[inputSize],
      error
        ? 'border-error-500 focus:ring-error-500 focus:border-error-500'
        : 'border-neutral-300 hover:border-neutral-400',
      disabled && 'bg-neutral-100 text-neutral-400 cursor-not-allowed',
      fullWidth && 'w-full',
      className,
    )

    return (
      <div
        style={{
          opacity: SELECT_INPUT_LAYOUT_CONFIG.entranceAnimate.opacity,
          transform: `translateY(${SELECT_INPUT_LAYOUT_CONFIG.entranceAnimate.y}px)`,
          transition: `all ${SELECT_INPUT_LAYOUT_CONFIG.transition.duration}s ${SELECT_INPUT_LAYOUT_CONFIG.transition.ease}`,
        }}
        className={fullWidth ? 'w-full' : 'inline-block'}
      >
        {label && (
          <label
            htmlFor={selectId}
            className="block mb-xs text-sm font-medium text-neutral-700"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          className={selectClassName}
          {...selectProps}
        >
          {placeholderOptionLabel && <option value="">{placeholderOptionLabel}</option>}
          {options.map((option) => (
            <option key={option.optionValue} value={option.optionValue} disabled={option.disabled}>
              {option.optionLabel}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-xs text-sm text-error-600">{error}</p>
        )}
      </div>
    )
  },
)

SelectInput.displayName = 'SelectInput'

export default SelectInput
