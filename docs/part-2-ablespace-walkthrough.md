# Part 2 — Product Understanding: AbleSpace Caseload "Take Data"

> **Note on sourcing:** this walkthrough is written from the reference description of
> the AbleSpace Caseload screen provided in the assessment's Scope of Work (§7.1), since
> this environment doesn't have a live AbleSpace account to sign into and screenshot
> directly. Before submitting, replace this note and the descriptions below with your
> own annotated screenshots or a short screen recording taken from an actual AbleSpace
> session — the flow description and improvement ideas below are written to make that
> swap straightforward.

## 1. What the screen shows

The **Caseload** tab sits under a **CAPTURE** section in AbleSpace's left navigation,
alongside Calendar, Data, Accommodations, and Service Time — grouped separately from
**TRACK** (Report, Billing, Collaborators, History) and a **Switch to Admin** control.
This grouping itself is informative: Caseload is where a provider spends day-to-day
session time, while Report/Billing/History are the after-the-fact record-keeping side of
the same workflow.

The Caseload header shows three tabs with live counts — **Students (15)**,
**Groups (12)**, **Unassigned (39)** — plus a global "Search students…" field
(shortcut **⌘K**) and an **Add Student** action.

The main body is a student roster table with columns: **Full Name, Last Name, IEP Due,
Eval Due, Collaborators** (an avatar stack of the care team), **Service Time, School**,
and an **Actions** column. The Actions column has a visually prominent **Take Data**
button plus an overflow (**⋮**) menu for secondary row actions.

## 2. The flow, in my own words

A provider (e.g. a speech-language pathologist or occupational therapist) opens
Caseload at the start of a session block to see everyone on their roster at a glance —
who's due for an IEP or evaluation soon, how much service time they're tracking against,
and who else is collaborating on that student's care.

**Take Data** is the entry point into actually documenting a session. Clicking it for a
given student is the moment the provider moves from "planning/reviewing my caseload" to
"recording what happened in this specific session" — typically this opens a data
collection screen scoped to that student's active goals/objectives, where the provider
logs trial-by-trial or session-level progress, notes, and sometimes attendance, which
then rolls up into that student's IEP progress reporting and the provider's own service
time/billing totals.

In other words: the roster table is the triage view, and Take Data is the action that
turns a row in that table into a piece of compliance-relevant clinical documentation.
The IEP Due / Eval Due columns exist precisely so the provider can prioritize which
students need attention soonest — a student with an approaching Eval Due date is a
different kind of urgent than one who just needs a routine session logged.

## 3. Improvement ideas

1. **Visual urgency on IEP Due / Eval Due.** These are currently plain dates. Color-
   coding (e.g. red/amber/green based on days remaining) and the ability to sort the
   roster by "most urgent" would let a provider triage their whole caseload in seconds
   instead of scanning every row. This is a low-effort, high-value change — it's a
   client-side rendering rule on data the table already has.

2. **Clarify what "0" or blank Service Time means.** As written, it's ambiguous whether
   `0` means "not yet scheduled this period," "no service currently required," or
   "data entry pending." A short inline label or tooltip (e.g. "Not scheduled" vs.
   "0 min logged") removes that ambiguity without adding a new column.

3. **Make Take Data discoverable at a glance across the whole roster, not just per-row.**
   Right now a provider has to scan each row to find who still needs data taken today.
   A dedicated filter/view ("Show only: needs data today") or a status chip per row
   ("Data logged ✓" / "Pending") would let a provider work through their caseload as a
   checklist rather than re-reading every row.

4. **Bulk actions across selected students.** Row checkboxes + a bulk action bar (e.g.
   bulk reminder, bulk export, bulk reassign collaborator) would help for common
   caseload-management tasks that currently require repeating the same overflow-menu
   action one student at a time.

5. **Unified search/filter across Students, Groups, and Unassigned.** The three tabs
   currently look like separate scopes. If the "Search students…" field only searches
   the active tab, a provider has to know which tab a student is in before they can find
   them. A single search that surfaces matches across all three tabs (with a small badge
   indicating which tab each result belongs to) would remove that friction — this
   matters especially for the Unassigned tab, which likely needs its own guidance
   (empty/zero-state copy explaining *why* a student is unassigned and what action to
   take) rather than just showing 39 as a bare count.

6. **Accessibility of the dense table on smaller viewports.** Seven-plus columns of
   tabular data doesn't fit a phone or small tablet screen. A responsive fallback —
   collapsing Collaborators/School behind a row-expand affordance, or switching to a
   stacked-card layout below a breakpoint — following the same progressive-disclosure
   pattern used for the Task Management System's own List view (see the main README,
   §3.8 of the Scope of Work) would keep the roster usable during a session moved
   between locations.
