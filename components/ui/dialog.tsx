"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  type ReactNode,
  useId,
} from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type DialogContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  titleId: string;
  descriptionId: string;
};

const DialogContext = createContext<DialogContextType | null>(null);

export function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog components must be used within a <Dialog />");
  }
  return context;
}

export function Dialog({
  children,
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
}: {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = (next: boolean) => {
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  const titleId = useId();
  const descriptionId = useId();

  return (
    <DialogContext.Provider value={{ open, setOpen, titleId, descriptionId }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({
  children,
  asChild,
  className,
  ...props
}: {
  children: ReactNode;
  asChild?: boolean;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { setOpen } = useDialog();

  return (
    <button
      type="button"
      className={className}
      onClick={() => setOpen(true)}
      {...props}
    >
      {children}
    </button>
  );
}

export function DialogContent({
  children,
  className,
  showClose = true,
}: {
  children: ReactNode;
  className?: string;
  showClose?: boolean;
}) {
  const { open, setOpen, titleId, descriptionId } = useDialog();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    // Prevent background scrolling
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div className="ui-dialog-backdrop" onClick={() => setOpen(false)}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className={cn("ui-dialog-content", className)}
        onClick={(e) => e.stopPropagation()}
      >
        {showClose && (
          <button
            type="button"
            className="ui-dialog-close"
            onClick={() => setOpen(false)}
            aria-label="Close dialog"
          >
            <X size={18} aria-hidden="true" />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("ui-dialog-header", className)} {...props} />;
}

export function DialogTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  const { titleId } = useDialog();
  return (
    <h2 id={titleId} className={cn("ui-dialog-title", className)} {...props}>
      {children}
    </h2>
  );
}

export function DialogDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  const { descriptionId } = useDialog();
  return (
    <p
      id={descriptionId}
      className={cn("ui-dialog-desc", className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function DialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("ui-dialog-footer", className)} {...props} />;
}
