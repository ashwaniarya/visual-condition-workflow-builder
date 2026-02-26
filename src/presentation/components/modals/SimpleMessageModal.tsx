import { useCallback } from "react";
import type { SimpleMessageModalPayload } from "@/shared/constants/globalUi";
import { useAppDispatch } from "@/state/store/hooks";
import { closeGlobalModal } from "@/state/store/globalUiActionsSlice";
import { Button, Typography } from "@/design-system/ui";

interface SimpleMessageModalProps {
  payload: SimpleMessageModalPayload;
}

export default function SimpleMessageModal({ payload }: SimpleMessageModalProps) {
  const dispatch = useAppDispatch();

  const handleCloseClick = useCallback(() => {
    dispatch(closeGlobalModal());
  }, [dispatch]);

  return (
    <div className="w-[min(92vw,28rem)] rounded-xl border border-neutral-200 bg-white p-md md:p-lg shadow-2xl">
      <div className="space-y-4">
        <div className="space-y-2">
          <Typography variant="body" weight="semibold" className="text-neutral-900">
            {payload.title}
          </Typography>
          <Typography variant="caption" className="text-neutral-600">
            {payload.message}
          </Typography>
        </div>
        <Button size="sm" onClick={handleCloseClick}>
          {payload.actionLabel ?? "Close"}
        </Button>
      </div>
    </div>
  );
}
