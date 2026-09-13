/**
 * Confirmation for the Builder's two destructive actions — starting over and
 * replacing the concepts. A real alert dialog (Radix: focus moves to Cancel,
 * Escape cancels, focus returns to the control that opened it), in ELEVATE's
 * own surface instead of the browser's native confirm box.
 */
import * as AlertDialog from "@radix-ui/react-alert-dialog";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <AlertDialog.Root open={open} onOpenChange={(o) => !o && onCancel()}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-[2px]" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 z-[90] w-[calc(100vw-2.5rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/12 bg-[#0f1420] p-7 text-white shadow-[0_40px_100px_-30px_oklch(0_0_0/0.9)] outline-none">
          <AlertDialog.Title className="heading-scene text-2xl text-white">
            {title}
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-3 text-[0.9375rem] leading-relaxed text-white/70">
            {description}
          </AlertDialog.Description>
          <div className="mt-7 flex flex-wrap items-center justify-end gap-x-5 gap-y-3">
            <AlertDialog.Cancel className="inline-flex min-h-11 items-center rounded-[0.625rem] px-3 text-sm font-medium text-white/80 hover:text-white focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none">
              {cancelLabel}
            </AlertDialog.Cancel>
            <AlertDialog.Action onClick={onConfirm} className="btn-primary text-sm">
              {confirmLabel}
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
