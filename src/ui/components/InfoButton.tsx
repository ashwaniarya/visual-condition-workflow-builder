import { CircleHelp } from 'lucide-react'
import IconButton from './IconButton'
import Tooltip from './Tooltip'

interface InfoButtonProps {
  message: string
  ariaLabel?: string
}

const INFO_BUTTON_ICON_CLASS_NAME = 'w-2.5 h-2.5 text-neutral-400'
const INFO_BUTTON_CLASS_NAME = 'h-6 w-6 min-h-6 min-w-6 p-0'
const DEFAULT_INFO_BUTTON_ARIA_LABEL = 'Info'

export default function InfoButton({
  message,
  ariaLabel = DEFAULT_INFO_BUTTON_ARIA_LABEL,
}: InfoButtonProps) {
  return (
    <Tooltip contentText={message} position="right">
      <IconButton
        icon={<CircleHelp className={INFO_BUTTON_ICON_CLASS_NAME} />}
        variant="neutral"
        iconButtonSize="sm"
        className={INFO_BUTTON_CLASS_NAME}
        aria-label={ariaLabel}
      />
    </Tooltip>
  )
}
