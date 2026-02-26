import { useEffect } from "react";
import { Toaster, toast } from "sonner";
import { TOAST_CONFIG } from "@/constants/toastConfig";
import { GLOBAL_TOAST_VARIANTS } from "@/constants/globalUi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearGlobalToastEvent } from "@/store/globalUiActionsSlice";

export default function GlobalToastHost() {
  const dispatch = useAppDispatch();
  const activeToastEvent = useAppSelector((state) => state.globalUiActions.activeToastEvent);

  useEffect(() => {
    if (!activeToastEvent) {
      return;
    }

    const toastOptions = {
      description: activeToastEvent.description,
      duration: activeToastEvent.durationMs ?? TOAST_CONFIG.defaultDurationMs,
    };

    if (activeToastEvent.variant === GLOBAL_TOAST_VARIANTS.success) {
      toast.success(activeToastEvent.title, toastOptions);
    } else if (activeToastEvent.variant === GLOBAL_TOAST_VARIANTS.error) {
      toast.error(activeToastEvent.title, toastOptions);
    } else if (activeToastEvent.variant === GLOBAL_TOAST_VARIANTS.warning) {
      toast.warning(activeToastEvent.title, toastOptions);
    } else {
      toast.info(activeToastEvent.title, toastOptions);
    }

    dispatch(clearGlobalToastEvent());
  }, [activeToastEvent, dispatch]);

  return (
    <Toaster
      position={TOAST_CONFIG.position}
      visibleToasts={TOAST_CONFIG.maxVisibleToasts}
      richColors
    />
  );
}
