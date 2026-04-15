"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function ConfirmDialog({
  children,
  title,
  description,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>

      <AlertDialogContent className="rounded-2xl max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex justify-end gap-3 mt-4">
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>

          <AlertDialogAction
            onClick={onConfirm}
            className={
              variant === "destructive"
                ? "bg-red-500 hover:bg-red-600 text-white"
                : ""
            }
          >
            {confirmText}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}