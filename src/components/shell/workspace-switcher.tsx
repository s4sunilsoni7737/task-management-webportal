"use client";

import { ChevronsUpDown } from "lucide-react";
import { Avatar } from "../ui/avatar";
import { DEFAULT_WORKSPACE_NAME } from "../../../constants";

/**
 * Top-of-sidebar workspace identity row: avatar + workspace name + chevron.
 * TODO(workspaces): this app currently supports a single workspace
 * ("Dexter"); wire this up to a workspace-switch popover once multiple
 * workspaces are supported by the backend.
 */
export function WorkspaceSwitcher() {
  return (
    <button
      type="button"
      className="flex h-12 w-full items-center gap-2 px-4 text-left transition-colors hover:bg-surface-muted"
    >
      <Avatar name={DEFAULT_WORKSPACE_NAME} size="sm" className="rounded-md" />
      <span className="flex-1 truncate text-sm font-semibold text-text">
        {DEFAULT_WORKSPACE_NAME}
      </span>
      <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-text-subtle" />
    </button>
  );
}
