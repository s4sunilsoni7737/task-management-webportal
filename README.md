# Dexter Tasks (Pyramid) — Task Management System

A Next.js (App Router) implementation of the **Pyramid** task management product from the
Full-Stack Developer (Fresher) technical assessment — Part 1: Task Management System.

Live workspace name: **Dexter**. Login product wordmark: **Pyramid**.

---

## 1. Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router), TypeScript (strict) |
| Styling | Tailwind CSS, CSS custom-property design tokens |
| Server state | TanStack React Query |
| Client/UI state | Zustand (`authStore`, `uiStore`, `toastStore`) |
| Forms | React Hook Form (comment/inline inputs) + Zod-ready validation layer |
| HTTP | Axios, wrapped in a single `request()` handler |
| Mock backend | Next.js Route Handlers (`src/app/api/**`) over an in-memory store |

## 2. Getting started

```bash
npm install
npm run dev     # http://localhost:3000
```

```bash
npm run build   # production build
npm run start   # serve the production build
```

No environment variables are required to run locally — the app talks to its own
mock API by default (`NEXT_PUBLIC_API_URL` defaults to `/api`).

### Pointing at a real backend

Every network call goes through the service layer in `src/services/**`, which in turn
calls the single `request()` helper in `src/services/api/api-handler.ts`. To swap the
mock Next.js API routes for a real NestJS backend, set:

```bash
NEXT_PUBLIC_API_URL=https://your-nestjs-api.example.com
```

No component or hook needs to change — only `src/app/api/**` (the mock routes) become
unnecessary. The response envelope (`{ data: T }`), error shape, and every endpoint path
in `src/services/api/endpoints.ts` were designed to mirror the real REST API described in
the Scope of Work (`AuthModule`, `TasksModule`, `ProjectsModule`, `CommentsModule`,
`LabelsModule`, `ActivityModule`).

## 3. Architecture

```
src/
  app/                        # App Router routes
    (auth)/login/             # Public login route
    (auth)/auth/callback/     # OAuth callback handler
    (workspace)/              # Authenticated area (layout provides Sidebar + TopBar + main)
      tasks/                  # Tasks list page
      tasks/[taskId]/         # Task detail — single page.tsx with page code inlined
      projects/               # Projects list page
      projects/[projectId]/   # Project-scoped tasks page
    page.tsx / layout.tsx / providers.tsx
  components/
    admin/                    # App shell, provided by the layout (AppShell, Sidebar, TopBar, WorkspaceMenu)
    ui/                       # Design-system primitives (Button, Popover, Avatar, ...)
    tasks/                    # Shared tasks module — reused by Tasks + Project pages (toolbar, board, table, ...)
  hooks/                      # React Query hooks + reusable UI hooks
  lib/
    types/                    # Shared domain types (mirrors future backend DTOs)
    utils/                    # Formatters, enum → icon/color config, cn()
  services/                   # Domain service layer (api client, auth, tasks, projects, labels, members, users)
  store/                      # Zustand stores (auth, ui/theme, toasts)
```

**Service layer.** Components never call `axios`/`fetch` directly. They call a domain
service (e.g. `tasksService.update(id, patch)`), which calls the shared `request()`
helper, which unwraps the API envelope and normalizes errors into a typed `ApiError`.
This is the seam where swapping to a real backend happens.

**State separation.** Server data (tasks, projects, comments, activity) lives in React
Query. Client-only state (theme, color mode, sidebar collapse, active view) lives in
Zustand and is persisted to `localStorage`. Auth session lives in its own Zustand store
so the Axios request interceptor can read the token outside of React.

**Design tokens.** All colors are CSS custom properties (`--dx-*`) defined once in
`globals.css` for light/dark themes and all six accent color modes, then mapped into
Tailwind's color palette in `tailwind.config.ts`. No component hardcodes a hex value.

**Mock backend.** `src/lib/mock/db.ts` is a seeded in-memory store (matches the sample
data described in the design brief: the "Dexter" workspace, "Design Homepage" project,
"Write API Documentation" task with its labels/subtasks/comment). The route handlers in
`src/app/api/**` implement the REST surface from the Scope of Work
(`POST /auth/guest`, `GET/POST /tasks`, `PATCH /tasks/:id`, `POST /tasks/:id/subtasks`,
`POST /tasks/:id/comments`, `GET /tasks/:id/activity`, `GET/POST /projects`, etc.), each
with a simulated latency so loading states are visible. State resets on server restart,
since there is no real database — this is an explicit, documented trade-off for an
assessment project with no deployed backend.

## 4. Feature coverage

- **Auth**: guest session (fully functional, persists across refresh). Google OAuth
  button is present but not wired to a real OAuth strategy (see Deviations).
- **Theming**: Light/Dark + 6 accent color modes (Amber, Blue, Pink, Rose, Emerald,
  Black), applied globally, persisted to `localStorage`, rehydrated before first paint
  via an inline script in `app/layout.tsx` to avoid a flash of the wrong theme.
- **Tasks module**: List view grouped by Status (To Do / Doing / Completed / On Hold)
  and Board (Kanban) view with native HTML5 drag-and-drop between columns. Shared
  toolbar: search (⌘F/Ctrl+F), Fields (column visibility), Filter (member/label/
  priority), List↔Board toggle, Add Task.
- **Projects module**: Projects table, project-scoped Tasks view (reuses the Tasks
  module UI) with a `Projects › [Project]` breadcrumb.
- **Task Detail**: editable title/description, Properties row, Labels row, Resources
  row (placeholder — see Deviations), Subtasks table, Comments thread, and a
  collapsible right Details panel (Status/Priority/Members/Dates/Labels/Team/Reporter,
  each independently editable) plus an Updates/Activity feed.
- **Responsive**: sidebar becomes an overlay drawer below ~900px; tables/board scroll
  horizontally on narrow viewports; Task Detail's two-column layout stacks vertically
  below the `lg` breakpoint.

## 5. Intentional design deviations

Per the assessment brief, unimplemented or partially-implemented features are left in
place as scaffolding with `TODO(...)` comments rather than removed, so the intended
architecture is visible:

- **Google OAuth** (`src/services/auth/auth.service.ts`, login page): no backend OAuth
  strategy exists yet, so the button shows an explanatory message instead of
  authenticating. `AuthModule.GOOGLE` / `GOOGLE_CALLBACK` endpoints are defined in
  `endpoints.ts` for when a backend implements them.
- **Settings page**: the "Settings" row in the profile menu is a stub (`TODO(settings)`)
  since no settings surface beyond theme/color mode was in the graded scope.
  Theme/Color Mode — the actual graded requirement — are fully implemented.
- **Resources/attachments** (Task Detail "Resources" row, comment attachment icon):
  UI-only placeholders (`TODO(resources)`), since file storage/upload wasn't part of the
  Scope of Work's REST surface.
- **RBAC / notifications / real-time sockets**: not part of the assessment's functional
  scope. No logic was implemented; if these become requirements later, they belong in
  new `src/services/{permissions,notifications,realtime}` modules following the same
  service-layer pattern as `tasks`/`projects`.
- **Touch target sizing**: interactive icons follow the design spec's literal
  "~32×32px" sizing for pixel fidelity to the reference screens, rather than the ≥40px
  touch-target guideline; this is a deliberate fidelity-vs-touch-ergonomics trade-off
  worth revisiting for a production mobile release.
- **Date range picker**: implemented as a single shared start/end calendar (first
  click sets the start, second click sets the end) rather than two separate calendar
  instances, to match the compact single-card calendar shown in the reference
  screenshots.
- **Mock backend persistence**: in-memory only (resets on server restart) since no
  database was provisioned for this assessment; swapping in a real database only
  requires changing the service layer's `NEXT_PUBLIC_API_URL`, per §2 above.

## 6. Part 2 — AbleSpace walkthrough

See [`docs/part-2-ablespace-walkthrough.md`](./docs/part-2-ablespace-walkthrough.md).
