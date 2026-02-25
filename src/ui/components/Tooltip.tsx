import { type ReactNode } from 'react'
import {
  Tooltip as AnimateUITooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/animate-ui/components/radix/tooltip'

type TooltipPosition = 'top' | 'right' | 'bottom' | 'left'

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
    <AnimateUITooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex items-center">{children}</span>
      </TooltipTrigger>
      <TooltipContent side={position} sideOffset={4}>
        {contentText}
      </TooltipContent>
    </AnimateUITooltip>
  )
}
