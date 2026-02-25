import type { HTMLAttributes, ReactNode } from 'react'
import Card from './Card'
import Typography from './Typography'

const PANEL_LAYOUT_CONFIG = {
  headerContainer: 'mb-md flex items-start justify-between gap-md',
  titleContainer: 'min-w-0',
  bodyContainer: '',
} as const

interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  titleText?: string
  descriptionText?: string
  headerAction?: ReactNode
  children: ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export default function Panel({
  titleText,
  descriptionText,
  headerAction,
  children,
  className = '',
  padding = 'md',
  ...divProps
}: PanelProps) {
  return (
    <Card className={className} padding={padding} {...divProps}>
      {(titleText || descriptionText || headerAction) && (
        <div className={PANEL_LAYOUT_CONFIG.headerContainer}>
          <div className={PANEL_LAYOUT_CONFIG.titleContainer}>
            {titleText && <Typography variant="h4">{titleText}</Typography>}
            {descriptionText && (
              <Typography variant="caption" className="mt-xs block text-neutral-500">
                {descriptionText}
              </Typography>
            )}
          </div>
          {headerAction}
        </div>
      )}
      <div className={PANEL_LAYOUT_CONFIG.bodyContainer}>
        {children}
      </div>
    </Card>
  )
}
