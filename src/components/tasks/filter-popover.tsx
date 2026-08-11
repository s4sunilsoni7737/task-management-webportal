"use client";

import { useRef, useState, useEffect } from "react";
import { Filter, ChevronRight, Check, Circle, Signal, Users, CalendarDays, Tag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover } from "@/components/ui/popover";
import { PRIORITY_CONFIG, STATUS_CONFIG } from "@/lib/utils/enum-utils";
import type { Label, Member, Priority, TaskStatus } from "@/lib/types";
import { PRIORITIES, TASK_STATUSES } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface TaskFilters {
  memberId: string | null;
  labelId: string | null;
  priority: Priority | null;
  status: TaskStatus | null;
  dueDate: string | null;
  teamId: string | null;
  reporterId: string | null;
}

interface FilterPopoverProps {
  members: Member[];
  labels: Label[];
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
}

const activeFilterCount = (f: TaskFilters) =>
  Number(!!f.memberId) +
  Number(!!f.labelId) +
  Number(!!f.priority) +
  Number(!!f.status) +
  Number(!!f.dueDate) +
  Number(!!f.teamId) +
  Number(!!f.reporterId);

const FILTER_CATEGORIES = [
  { key: "status", label: "Status", icon: Circle },
  { key: "priority", label: "Priority", icon: Signal },
  { key: "members", label: "Members", icon: Users },
  { key: "dueDate", label: "Due Date", icon: CalendarDays },
  { key: "teams", label: "Teams", icon: Users },
  { key: "labels", label: "Labels", icon: Tag },
  { key: "reporter", label: "Reporter", icon: User },
] as const;

export function FilterPopover({ members, labels, filters, onChange }: FilterPopoverProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null!);
  const count = activeFilterCount(filters);

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const mainMenuRef = useRef<HTMLDivElement>(null!);

  // When main popover closes, reset active submenu
  useEffect(() => {
    if (!open) setActiveMenu(null);
  }, [open]);

  return (
    <>
      <Button ref={triggerRef} variant="outline" size="sm" onClick={() => setOpen((v) => !v)} className="relative h-8 w-8 px-0 rounded-md">
        <Filter className="h-4 w-4 text-text" />
        {count > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-fg">
            {count}
          </span>
        )}
      </Button>

      {/* MAIN POPOVER */}
      <Popover open={open} onClose={() => setOpen(false)} anchorRef={triggerRef} align="end" className="w-[200px] p-1.5">
        <div className="flex flex-col" ref={mainMenuRef}>
          {FILTER_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeMenu === cat.key;
            let hasFilter = false;
            if (cat.key === "status") hasFilter = !!filters.status;
            else if (cat.key === "priority") hasFilter = !!filters.priority;
            else if (cat.key === "members") hasFilter = !!filters.memberId;
            else if (cat.key === "dueDate") hasFilter = !!filters.dueDate;
            else if (cat.key === "teams") hasFilter = !!filters.teamId;
            else if (cat.key === "labels") hasFilter = !!filters.labelId;
            else if (cat.key === "reporter") hasFilter = !!filters.reporterId;

            return (
              <button
                key={cat.key}
                onMouseEnter={() => setActiveMenu(cat.key)}
                onClick={() => setActiveMenu(cat.key)}
                className={cn(
                  "flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-sm transition-colors text-sm",
                  isActive ? "bg-surface-muted text-text" : "text-text-subtle hover:bg-surface-muted hover:text-text"
                )}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {cat.label}
                </div>
                <div className="flex items-center gap-1.5">
                  {hasFilter && <div className="h-1.5 w-1.5 rounded-full bg-accent" />}
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </div>
              </button>
            );
          })}
        </div>
      </Popover>

      {/* PRIORITY SUBMENU */}
      <Popover
        open={open && activeMenu === "priority"}
        onClose={() => {}}
        anchorRef={mainMenuRef}
        side="left"
        align="start"
        offset={8}
        disableDismiss
        className="w-[180px] p-1.5 ignore-click-outside"
      >
        <div className="flex flex-col gap-0.5">
          {PRIORITIES.map((p) => {
            const config = PRIORITY_CONFIG[p];
            const Icon = config.icon;
            const isSelected = filters.priority === p;
            return (
              <button
                key={p}
                onClick={() => onChange({ ...filters, priority: isSelected ? null : p })}
                className="flex items-center gap-2 rounded-sm px-2.5 py-1.5 text-sm hover:bg-surface-muted transition-colors text-text"
              >
                <Icon className="h-4 w-4 shrink-0" style={{ color: `var(${config.colorVar})` }} />
                <span className="flex-1 text-left">{config.label}</span>
                {isSelected && <Check className="h-4 w-4 text-text shrink-0" />}
              </button>
            );
          })}
        </div>
      </Popover>

      {/* STATUS SUBMENU */}
      <Popover
        open={open && activeMenu === "status"}
        onClose={() => {}}
        anchorRef={mainMenuRef}
        side="left"
        align="start"
        offset={8}
        disableDismiss
        className="w-[180px] p-1.5 ignore-click-outside"
      >
        <div className="flex flex-col gap-0.5">
          {TASK_STATUSES.map((s) => {
            const config = STATUS_CONFIG[s];
            const Icon = config.icon;
            const isSelected = filters.status === s;
            return (
              <button
                key={s}
                onClick={() => onChange({ ...filters, status: isSelected ? null : s })}
                className="flex items-center gap-2 rounded-sm px-2.5 py-1.5 text-sm hover:bg-surface-muted transition-colors text-text"
              >
                <Icon className="h-4 w-4 shrink-0" style={{ color: `var(${config.colorVar})` }} />
                <span className="flex-1 text-left">{config.label}</span>
                {isSelected && <Check className="h-4 w-4 text-text shrink-0" />}
              </button>
            );
          })}
        </div>
      </Popover>

      {/* DUE DATE SUBMENU */}
      <Popover
        open={open && activeMenu === "dueDate"}
        onClose={() => {}}
        anchorRef={mainMenuRef}
        side="left"
        align="start"
        offset={8}
        disableDismiss
        className="w-[180px] p-1.5 ignore-click-outside"
      >
        <div className="flex flex-col gap-0.5">
          {[
            { key: "overdue", label: "Overdue" },
            { key: "today", label: "Today" },
            { key: "this_week", label: "This Week" },
            { key: "no_date", label: "No Date" },
          ].map((d) => {
            const isSelected = filters.dueDate === d.key;
            return (
              <button
                key={d.key}
                onClick={() => onChange({ ...filters, dueDate: isSelected ? null : d.key })}
                className="flex items-center justify-between gap-2 rounded-sm px-2.5 py-1.5 text-sm hover:bg-surface-muted transition-colors text-text"
              >
                <span className="truncate text-left">{d.label}</span>
                {isSelected && <Check className="h-4 w-4 shrink-0" />}
              </button>
            );
          })}
        </div>
      </Popover>

      {/* MEMBERS SUBMENU */}
      <Popover
        open={open && activeMenu === "members"}
        onClose={() => {}}
        anchorRef={mainMenuRef}
        side="left"
        align="start"
        offset={8}
        disableDismiss
        className="w-[180px] p-1.5 max-h-[300px] overflow-y-auto scrollbar-thin ignore-click-outside"
      >
        <div className="flex flex-col gap-0.5">
          {members.length === 0 && <span className="px-2 py-1.5 text-sm text-text-muted">No members</span>}
          {members.map((m) => {
            const isSelected = filters.memberId === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onChange({ ...filters, memberId: isSelected ? null : m.id })}
                className="flex items-center justify-between gap-2 rounded-sm px-2.5 py-1.5 text-sm hover:bg-surface-muted transition-colors text-text"
              >
                <span className="truncate text-left">{m.name}</span>
                {isSelected && <Check className="h-4 w-4 shrink-0" />}
              </button>
            );
          })}
        </div>
      </Popover>

      {/* REPORTER SUBMENU */}
      <Popover
        open={open && activeMenu === "reporter"}
        onClose={() => {}}
        anchorRef={mainMenuRef}
        side="left"
        align="start"
        offset={8}
        disableDismiss
        className="w-[180px] p-1.5 max-h-[300px] overflow-y-auto scrollbar-thin ignore-click-outside"
      >
        <div className="flex flex-col gap-0.5">
          {members.length === 0 && <span className="px-2 py-1.5 text-sm text-text-muted">No members</span>}
          {members.map((m) => {
            const isSelected = filters.reporterId === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onChange({ ...filters, reporterId: isSelected ? null : m.id })}
                className="flex items-center justify-between gap-2 rounded-sm px-2.5 py-1.5 text-sm hover:bg-surface-muted transition-colors text-text"
              >
                <span className="truncate text-left">{m.name}</span>
                {isSelected && <Check className="h-4 w-4 shrink-0" />}
              </button>
            );
          })}
        </div>
      </Popover>

      {/* TEAMS SUBMENU */}
      <Popover
        open={open && activeMenu === "teams"}
        onClose={() => {}}
        anchorRef={mainMenuRef}
        side="left"
        align="start"
        offset={8}
        disableDismiss
        className="w-[180px] p-1.5 max-h-[300px] overflow-y-auto scrollbar-thin ignore-click-outside"
      >
        <div className="flex flex-col gap-0.5">
          <span className="px-2 py-1.5 text-sm text-text-muted text-center">No teams yet</span>
        </div>
      </Popover>

      {/* LABELS SUBMENU */}
      <Popover
        open={open && activeMenu === "labels"}
        onClose={() => {}}
        anchorRef={mainMenuRef}
        side="left"
        align="start"
        offset={8}
        disableDismiss
        className="w-[180px] p-1.5 max-h-[300px] overflow-y-auto scrollbar-thin ignore-click-outside"
      >
        <div className="flex flex-col gap-0.5">
          {labels.length === 0 && <span className="px-2 py-1.5 text-sm text-text-muted">No labels</span>}
          {labels.map((l) => {
            const isSelected = filters.labelId === l.id;
            return (
              <button
                key={l.id}
                onClick={() => onChange({ ...filters, labelId: isSelected ? null : l.id })}
                className="flex items-center justify-between gap-2 rounded-sm px-2.5 py-1.5 text-sm hover:bg-surface-muted transition-colors text-text"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: l.color }} />
                  <span className="truncate text-left">{l.name}</span>
                </div>
                {isSelected && <Check className="h-4 w-4 shrink-0" />}
              </button>
            );
          })}
        </div>
      </Popover>
    </>
  );
}
