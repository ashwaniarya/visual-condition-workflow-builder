import { Link } from "react-router-dom";
import { ReactFlowProvider } from "reactflow";
import { Button, Typography } from "@/ui";
import GlobalModalHost from "@/components/modals/GlobalModalHost";
import GlobalToastHost from "@/components/toast/GlobalToastHost";
import { GLOBAL_TOAST_VARIANTS, GLOBAL_UI_MODAL_TYPES } from "@/constants/globalUi";
import { useAppDispatch } from "@/store/hooks";
import { openGlobalModal, showGlobalToast } from "@/store/globalUiActionsSlice";

function UITestPlaygroundContent() {
  const dispatch = useAppDispatch();

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white px-md py-sm md:px-lg">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Typography variant="h3">🧪 UI Test Playground</Typography>
          <Link to="/" className="text-sm text-primary-600 underline hover:text-primary-700">
            ← Back to Workflow
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-lg px-md py-lg md:px-lg md:py-xl">
        <section className="rounded-xl border border-neutral-200 bg-white p-md md:p-lg">
          <Typography variant="h4" className="mb-sm">
            Modal test
          </Typography>
          <Typography variant="body" className="mb-md text-neutral-600">
            Open the workflow JSON import modal from global state.
          </Typography>
          <div className="flex flex-wrap gap-sm">
            <Button
              onClick={() =>
                dispatch(
                  openGlobalModal({
                    modalType: GLOBAL_UI_MODAL_TYPES.workflowImport,
                    payload: {},
                  })
                )
              }
            >
              Open Import Modal
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                dispatch(
                  openGlobalModal({
                    modalType: GLOBAL_UI_MODAL_TYPES.simpleMessage,
                    payload: {
                      title: "Simple JSX modal",
                      message: "This modal renders plain JSX content without extra workflow logic.",
                      actionLabel: "Understood",
                    },
                  })
                )
              }
            >
              Open Simple Modal
            </Button>
          </div>
        </section>

        <section className="rounded-xl border border-neutral-200 bg-white p-md md:p-lg">
          <Typography variant="h4" className="mb-sm">
            Toast test
          </Typography>
          <Typography variant="body" className="mb-md text-neutral-600">
            Trigger each global toast variant from Redux actions.
          </Typography>
          <div className="flex flex-wrap gap-sm">
            <Button
              onClick={() =>
                dispatch(
                  showGlobalToast({
                    variant: GLOBAL_TOAST_VARIANTS.success,
                    title: "Success toast",
                    description: "Playground success notification.",
                  })
                )
              }
            >
              Show Success
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                dispatch(
                  showGlobalToast({
                    variant: GLOBAL_TOAST_VARIANTS.info,
                    title: "Info toast",
                    description: "Playground info notification.",
                  })
                )
              }
            >
              Show Info
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                dispatch(
                  showGlobalToast({
                    variant: GLOBAL_TOAST_VARIANTS.warning,
                    title: "Warning toast",
                    description: "Playground warning notification.",
                  })
                )
              }
            >
              Show Warning
            </Button>
            <Button
              variant="ghost"
              onClick={() =>
                dispatch(
                  showGlobalToast({
                    variant: GLOBAL_TOAST_VARIANTS.error,
                    title: "Error toast",
                    description: "Playground error notification.",
                  })
                )
              }
            >
              Show Error
            </Button>
          </div>
        </section>
      </main>

      <GlobalModalHost />
      <GlobalToastHost />
    </div>
  );
}

export default function UITestPlaygroundScreen() {
  return (
    <ReactFlowProvider>
      <UITestPlaygroundContent />
    </ReactFlowProvider>
  );
}
