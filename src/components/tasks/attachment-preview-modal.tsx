import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Download, FileText, FileImage, FileSpreadsheet, File } from "lucide-react";
import type { Task } from "@/lib/types";

type Resource = Task["resources"][number];

interface AttachmentPreviewModalProps {
  open: boolean;
  onClose: () => void;
  resource: Resource | null;
}

export function AttachmentPreviewModal({ open, onClose, resource }: AttachmentPreviewModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleEscape);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleEscape);
      };
    }
  }, [open, onClose]);

  if (!open || !resource) return null;

  const isImage = resource.url.match(/\.(jpeg|jpg|gif|png|webp|bmp|svg)$/i);
  const isPdf = resource.url.match(/\.pdf$/i);

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose}
        aria-hidden="true" 
      />
      
      {/* Dialog Panel */}
      <div 
        className="relative flex h-full max-h-[90vh] w-full max-w-4xl flex-col rounded-xl bg-surface shadow-2xl"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4 bg-surface rounded-t-xl z-10">
          <h2 className="text-lg font-semibold text-text truncate">{resource.name}</h2>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={resource.url}
              download={resource.name}
              target="_blank"
              rel="noreferrer"
              className="flex h-8 items-center gap-1.5 rounded-sm bg-accent px-3 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
            >
              <Download className="h-4 w-4" />
              Download
            </a>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-sm text-text-subtle hover:bg-surface-muted hover:text-text transition-colors"
              aria-label="Close preview"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 items-center justify-center overflow-auto p-6 bg-bg rounded-b-xl relative z-0">
          {isImage ? (
            <img src={resource.url} alt={resource.name} className="max-h-full max-w-full object-contain shadow-sm" />
          ) : isPdf ? (
            <iframe src={resource.url} className="h-full w-full rounded-md border border-border bg-white" title={resource.name} />
          ) : (
            <div className="flex flex-col items-center gap-4 text-text-muted">
              <File className="h-24 w-24 text-text-subtle" />
              <p>No preview available for this file type.</p>
              <a
                href={resource.url}
                download={resource.name}
                target="_blank"
                rel="noreferrer"
                className="rounded-sm border border-border px-4 py-2 text-sm font-medium text-text hover:bg-surface-muted transition-colors"
              >
                Download to view
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(modalContent, document.body) : null;
}

export function getFileIcon(url: string) {
  if (url.match(/\.(jpeg|jpg|gif|png|webp|bmp|svg)$/i)) return FileImage;
  if (url.match(/\.pdf$/i)) return FileText;
  if (url.match(/\.(xls|xlsx|csv)$/i)) return FileSpreadsheet;
  return File;
}
