import type { ReactNode } from 'react'

const TOOLTIP_STYLE_CONFIG = {
  trigger: 'relative inline-flex items-center',
  bubble:
    'pointer-events-none absolute z-50 max-w-56 rounded-md bg-neutral-800 px-sm py-xs text-xs text-neutral-50 opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100',
  position: {
    top: 'left-1/2 bottom-full mb-xs -translate-x-1/2',
    right: 'left-full top-1/2 ml-xs -translate-y-1/2',
    bottom: 'left-1/2 top-full mt-xs -translate-x-1/2',
    left: 'right-full top-1/2 mr-xs -translate-y-1/2',
  },
} as const

type TooltipPosition = keyof typeof TOOLTIP_STYLE_CONFIG.position

interface TooltipProps {
  contentText: string
  children: ReactNode
  position?: TooltipPosition
}

export default function Tooltip({
  contentText,
  children,
  position = 'top',
}: TooltipProps) {
  return (
    <span className={`group ${TOOLTIP_STYLE_CONFIG.trigger}`}>
      {children}
      <span
        role="tooltip"
        className={`${TOOLTIP_STYLE_CONFIG.bubble} ${TOOLTIP_STYLE_CONFIG.position[position]}`}
      >
        {contentText}
      </span>
    </span>
  )
}
