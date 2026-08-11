# 🏗️ Project Architecture Reference — Cricket Broadcast Admin Portal

> **Tech Stack:** Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4 + TanStack React Query + Zustand + Axios

---

## 1. 📁 Complete Folder Structure & File Purpose

```
adminportal/
├── constants.ts                   # Global constants: API_BASE_URL, DEV_MODE
├── components.json                # (shadcn/ui config — not actively used)
├── next.config.ts                 # Next.js config: rewrites for API proxy
├── tsconfig.json                  # TypeScript config with @/ path alias
├── package.json                   # Dependencies & scripts
├── postcss.config.mjs             # PostCSS config for Tailwind (v4)
├── eslint.config.mjs              # ESLint flat config
├── Dockerfile                     # Container build
├── README.md                      # Project readme
├── 
├── public/
│   └── icons/                     # SVG icons (e.g., chat.svg)
│
├── src/
│   ├── proxy.ts                   # Next.js Middleware — Server-side RBAC gate
│   │
│   ├── app/                       # Next.js App Router pages
│   │   ├── globals.css            # Global CSS — design tokens (Tailwind v4 @theme)
│   │   ├── layout.tsx             # Root layout — wraps ALL pages
│   │   ├── providers.tsx          # Client-side providers: QueryClient, AuthBootstrap, Toaster
│   │   ├── page.tsx               # Root page (redirects to /dashboard)
│   │   │
│   │   ├── (auth)/                # Auth route group (no sidebar)
│   │   │   └── login/
│   │   │       └── page.tsx       # Login page with interactive canvas background
│   │   │
│   │   └── (admin)/               # Admin route group (with sidebar, header)
│   │       ├── layout.tsx         # Admin layout: Sidebar + Header + children
│   │       ├── dashboard/
│   │       │   └── page.tsx       # Dashboard home
│   │       ├── users-kyc/
│   │       │   ├── page.tsx       # KYC queue list
│   │       │   └── [id]/
│   │       │       └── page.tsx   # KYC detail
│   │       ├── listings/
│   │       │   ├── page.tsx       # Listings list
│   │       │   └── [id]/
│   │       │       ├── page.tsx   # Listing detail
│   │       │       └── edit/
│   │       │           └── page.tsx  # Edit listing
│   │       ├── deals/
│   │       │   ├── page.tsx       # Deal tracker list
│   │       │   └── [dealId]/
│   │       │       ├── page.tsx       # Deal detail
│   │       │       ├── chat/
│   │       │       │   └── page.tsx   # Deal chat
│   │       │       └── fulfillment/
│   │       │           └── page.tsx   # Fulfillment
│   │       ├── negotiation/
│   │       │   ├── page.tsx           # Negotiation list
│   │       │   ├── [dealId]/
│   │       │   │   └── page.tsx       # Negotiation desk
│   │       │   └── tournament/
│   │       │       └── [tournamentName]/
│   │       │           └── page.tsx   # Tournament negotiation view
│   │       ├── contracts/
│   │       │   ├── page.tsx           # Contracts list
│   │       │   └── [dealId]/
│   │       │       └── page.tsx       # Contract detail (with DocuSignModals)
│   │       ├── payments/
│   │       │   └── page.tsx           # Payments list
│   │       ├── reports/
│   │       │   └── page.tsx           # Reports
│   │       ├── audit-log/
│   │       │   └── page.tsx           # Audit log
│   │       ├── rights-requests/
│   │       │   ├── page.tsx           # Rights requests list
│   │       │   └── [id]/
│   │       │       └── page.tsx       # Rights request detail
│   │       ├── chat/
│   │       │   └── page.tsx           # Chat list
│   │       └── administration/
│   │           ├── page.tsx           # Admin users list
│   │           ├── add/
│   │           │   └── page.tsx       # Add admin user
│   │           ├── [adminId]/
│   │           │   ├── page.tsx       # Admin user detail
│   │           │   └── edit/
│   │           │       └── page.tsx   # Edit admin user
│   │           ├── roles/
│   │           │   ├── page.tsx             # Roles list
│   │           │   ├── add/
│   │           │   │   └── page.tsx         # Add role
│   │           │   └── [roleId]/
│   │           │       └── edit/
│   │           │           └── page.tsx     # Edit role
│   │           ├── configuration/
│   │           │   └── page.tsx             # Platform config
│   │           └── notification/
│   │               ├── page.tsx             # Notifications list
│   │               └── add/
│   │                   └── page.tsx         # Send notification
│   │
│   ├── components/
│   │   ├── admin/
│   │   │   ├── sidebar.tsx         # Sidebar navigation with RBAC filtering
│   │   │   └── header.tsx          # Top header: theme toggle, user menu, mobile hamburger
│   │   │
│   │   └── ui/                     # Shared UI primitives
│   │       ├── button.tsx
│   │       ├── form-field.tsx       # TextField with react-hook-form integration
│   │       ├── form-select.tsx      # Select field with form integration
│   │       ├── multi-select.tsx     # Multi-select dropdown
│   │       ├── data-table.tsx       # Sortable, paginated data table
│   │       ├── status-badge.tsx     # Colored status badge
│   │       ├── toaster.tsx          # Toast notification renderer
│   │       ├── modal-shell.tsx      # Modal wrapper with animations
│   │       ├── confirm-modal.tsx    # Confirmation dialog
│   │       ├── global-loader.tsx    # Full-page loading spinner
│   │       ├── global-search-input.tsx
│   │       ├── permission-denied.tsx   # "Access Denied" component
│   │       ├── permission-grid.tsx     # Permission matrix grid
│   │       ├── deal-flow-nav.tsx       # Deal state machine navigation
│   │       ├── stepper.tsx             # Multi-step progress indicator
│   │       ├── attachment-thumbnail.tsx
│   │       ├── action-icon-button.tsx
│   │       ├── diff-view.tsx
│   │       └── query-error-card.tsx    # Error display for React Query
│   │
│   ├── hooks/
│   │   ├── useApiMutation.ts      # Centralized mutation hook with toast + invalidation
│   │   ├── useRBAC.ts             # Client-side RBAC permission check
│   │   ├── useChat.ts             # Chat WebSocket hook
│   │   ├── useMasterEnums.ts      # Prefetch master enums on admin layout mount
│   │   └── useTerritories.ts      # Territory selection hook
│   │
│   ├── lib/
│   │   ├── queryClient.ts         # React Query client factory with global error handling
│   │   ├── apiClient.ts           # (legacy — do NOT use, use services/api/ instead)
│   │   ├── rbac.ts                # RBAC type definitions & PATH_RESOURCE_MAP
│   │   ├── routeBuilder.ts        # Singleton URL factory for all admin routes
│   │   ├── utils.ts               # cn() helper (clsx + tailwind-merge), scrollbar()
│   │   ├── enum-utils.ts          # Master enum lookup helpers
│   │   ├── mockData.ts            # Mock data for development
│   │   │
│   │   ├── types/                 # Domain type definitions
│   │   │   ├── deal.ts            # DealSummary, TerritoryRightLine
│   │   │   ├── contract.ts        # Contract types
│   │   │   ├── kyc.ts             # KYC types
│   │   │   ├── listing.ts         # Listing types
│   │   │   ├── dashboard.ts       # Dashboard types
│   │   │   ├── org.ts             # Organization types
│   │   │   ├── rights-request.ts  # Rights request types
│   │   │   └── user.ts            # User types
│   │   │
│   │   └── utils/
│   │       └── formatters.ts      # Pure functions: formatDate, formatUsd, formatRelativeAge
│   │
│   ├── services/
│   │   ├── api/                   # 🔥 CORE API LAYER (see section 2)
│   │   │   ├── api-client.ts      # Shared Axios instance
│   │   │   ├── api-interceptors.ts # Request/response interceptors, token refresh
│   │   │   ├── api-handler.ts     # Generic request() function (the ONLY way to call API)
│   │   │   ├── api-error.ts       # Typed ApiError class
│   │   │   ├── api-error-handler.ts # normalizeApiError() + getErrorMessage()
│   │   │   ├── api-response.ts    # ApiEnvelope<T>, PaginatedResponse<T>, unwrapEnvelope()
│   │   │   ├── endpoints.ts       # Centralized API_ENDPOINTS object (all routes)
│   │   │   └── enums.service.ts   # Master enums service
│   │   │
│   │   ├── auth/
│   │   │   └── auth.service.ts    # login(), logout()
│   │   ├── dashboard/
│   │   │   └── dashboard.service.ts
│   │   ├── deals/
│   │   │   └── deals.service.ts   # Deal CRUD + state machine actions
│   │   ├── contracts/
│   │   │   └── contracts.service.ts
│   │   ├── listings/
│   │   │   └── listings.service.ts
│   │   ├── kyc/
│   │   │   └── kyc.service.ts
│   │   ├── fulfillment/
│   │   │   └── fulfillment.service.ts
│   │   ├── payments/
│   │   │   └── payments.service.ts
│   │   ├── notifications/
│   │   │   └── notifications.service.ts
│   │   ├── administration/
│   │   │   ├── members.service.ts
│   │   │   ├── roles.service.ts
│   │   │   └── permissions.service.ts
│   │   ├── chat/
│   │   │   └── chat.service.ts
│   │   ├── rights-requests/
│   │   │   └── rights-requests.service.ts
│   │   ├── reports/
│   │   │   └── reports.service.ts
│   │   ├── audit/
│   │   │   └── audit.service.ts
│   │   ├── automation/
│   │   │   └── automation.service.ts
│   │   └── admin/
│   │       └── admin.service.ts
│   │
│   └── store/                     # 🏪 Zustand stores (see section 3)
│       ├── authStore.ts           # Auth state: tokens, user, permissions
│       ├── toastStore.ts          # Toast notifications (home-grown, no library)
│       ├── uiStore.ts             # UI state: sidebar, theme
│       └── socketStore.ts         # WebSocket connection state
```

---

## 2. 🔌 API Layer Architecture

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│  Page Component (e.g., deals/page.tsx)                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  useQuery/useMutation from React Query                    │  │
│  │  (or custom useApiMutation hook)                          │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Domain Service (e.g., dealsService.getAll())             │  │
│  │  • Calls request() from api-handler                       │  │
│  │  • Uses API_ENDPOINTS from endpoints.ts                   │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  api-handler.ts — request<TResponse>()                    │  │
│  │  • Calls apiClient.request()                              │  │
│  │  • Unwraps { data: T } envelope                          │  │
│  │  • Handles 204 No Content                                  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  api-client.ts — Axios Instance                           │  │
│  │  • baseURL from constants.ts                              │  │
│  │  • withCredentials: true (httpOnly cookie for refresh)    │  │
│  │  • 30s timeout                                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  api-interceptors.ts (auto-registered on import)           │  │
│  │  • Request interceptor: injects Bearer token              │  │
│  │  • Response interceptor: 401 → refresh token → retry      │  │
│  │  • Refresh queue: concurrent 401s wait for single refresh │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  api-error-handler.ts                                     │  │
│  │  • normalizeApiError(): AxiosError → ApiError             │  │
│  │  • getErrorMessage(): extracts human-readable message     │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Key Rules

| Rule | Description |
|------|-------------|
| **No direct `axios` calls** | Always use `request()` from `api-handler.ts` |
| **No raw URL strings** | All endpoints in `API_ENDPOINTS` in `endpoints.ts` |
| **Domain services** | Each feature has its own service file (e.g., `deals.service.ts`) |
| **DTOs in service files** | Request/response DTOs defined alongside the service that uses them |
| **Types in `lib/types/`** | Shared domain types go in `lib/types/` (e.g., `DealSummary`) |

### Creating a New Domain Service

```typescript
// src/services/example/example.service.ts
import { request } from "@/services/api/api-handler";
import { API_ENDPOINTS } from "@/services/api/endpoints";

// 1. Add endpoints in endpoints.ts
// API_ENDPOINTS.EXAMPLE = {
//   ROOT: "/api/example",
//   DETAIL: (id: ApiId) => `/api/example/${id}`,
// };

// 2. Define DTOs
export interface ExampleItem {
  id: string;
  name: string;
}

// 3. Export service object
export const exampleService = {
  getAll(): Promise<ExampleItem[]> {
    return request<ExampleItem[]>({
      url: API_ENDPOINTS.EXAMPLE.ROOT,
      method: "GET",
    });
  },
  getById(id: string): Promise<ExampleItem> {
    return request<ExampleItem>({
      url: API_ENDPOINTS.EXAMPLE.DETAIL(id),
      method: "GET",
    });
  },
};
```

---

## 3. 🏪 State Management (Zustand)

### Store Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Zustand Stores                            │
│                                                                  │
│  authStore.ts    ─── JWT decode, tokens, user, permissions       │
│  uiStore.ts      ─── sidebar state, theme (light/dark)           │
│  toastStore.ts   ─── Toast queue (home-grown)                    │
│  socketStore.ts  ─── WebSocket connection state                  │
│                                                                  │
│  React Query     ─── ALL server data (no server state in stores) │
│  (TanStack)                                                      │
└─────────────────────────────────────────────────────────────────┘
```

### Rule: Zustand is for CLIENT STATE ONLY

| Store | What it holds | Why zustand? |
|-------|--------------|--------------|
| `authStore` | Access token, refresh token, user profile, permissions set | Must be accessible outside React (axios interceptors) |
| `uiStore` | Sidebar collapsed, theme, mobile sidebar open | Shared across unrelated components |
| `toastStore` | Toast queue | Simple, avoids pulling in a toast library |
| `socketStore` | WebSocket connection state | Shared across components |

**DO NOT put server data in Zustand.** Server data (deals, listings, users, etc.) goes in React Query cache.

### Using Stores

```typescript
// In a component (hook):
const { accessToken, user } = useAuthStore();

// Outside React (e.g., in axios interceptor):
import { useAuthStore } from "@/store/authStore";
const token = useAuthStore.getState().accessToken;

// Snapshot helper (for interceptors):
import { getAccessTokenSnapshot } from "@/store/authStore";
```

### Toast Store Pattern

```typescript
// Push toasts from anywhere:
import { toast } from "@/store/toastStore";
toast.success("Deal updated successfully");
toast.error(error, "Failed to update deal");  // Auto-extracts backend message
toast.info("Processing...");
```

---

## 4. ⚛️ React Query Integration

### QueryClient (src/lib/queryClient.ts)

```typescript
defaultOptions: {
  queries: {
    staleTime: 0,           // Always refetch on mount
    gcTime: 5 * 60_000,     // 5 min garbage collection
    retry: false,            // Never retry failed queries
    refetchOnWindowFocus: false,  // Don't refetch on tab switch
  },
  mutations: {
    retry: false,            // Never retry mutations
  },
}
```

### Centralized Mutation Hook (useApiMutation)

```typescript
import { useApiMutation } from "@/hooks/useApiMutation";

const { mutate, isPending } = useApiMutation({
  mutationFn: (id: string) => dealsService.takeForReview(id),
  successMessage: "Deal taken for review",
  errorMessage: "Failed to take deal for review",
  invalidateQueries: [["deals"], ["dashboard"]],
  onSuccess: () => { /* close modal, navigate, etc. */ },
});
```

### Using Queries in Pages

```typescript
import { useQuery } from "@tanstack/react-query";
import { dealsService } from "@/services/deals/deals.service";

function DealsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["deals", { page, search }],
    queryFn: () => dealsService.getAll({ Page: page, Search: search }),
  });
  // ...
}
```

---

## 5. 🔐 RBAC Permission System

### Dual-Layer Architecture

```
Layer 1: Server-side (src/proxy.ts)
  └─ Next.js Middleware — checks "rp_hint" cookie on every navigation
  └─ Blocks unauthorized users BEFORE React renders
  └─ Uses PATH_RESOURCE_MAP to resolve route → resource

Layer 2: Client-side (src/hooks/useRBAC.ts)
  └─ useRBAC() hook — checks permissions from authStore
  └─ Controls sidebar visibility, button rendering, page access
```

### Types (src/lib/rbac.ts)

```typescript
type Resource =
  | "audit" | "chat" | "contract" | "deal" | "deliverable"
  | "inventory" | "kyc" | "listing" | "marketing" | "notification"
  | "offer" | "organization" | "payment" | "pipeline" | "pricing"
  | "report" | "request" | "setting" | "technicaldata" | "user"
  | "dashboard";

type Action = "manage" | "view" | "edit" | "approve" | "reject"
            | "delete" | "access" | "participate" | "sign";

type Permission = `${Resource}:${Action}`;
// e.g., "deal:view", "listing:approve"
```

### Using useRBAC

```typescript
import { useRBAC } from "@/hooks/useRBAC";

function MyComponent() {
  const { hasPermission, hasAnyAction, isSuperAdmin } = useRBAC();

  if (!hasPermission("deal", "view")) return <PermissionDenied />;
  if (isSuperAdmin) return <SuperAdminPanel />;
  
  return <Button disabled={!hasPermission("deal", "approve")}>Approve</Button>;
}
```

### Adding a New Route

1. **Add route in `routeBuilder.ts`** — new method on the singleton class
2. **Add resource mapping in `rbac.ts`** — update `PATH_RESOURCE_MAP` and `resolveResourceForPath()`
3. **Add sidebar item in `sidebar.tsx`** — with correct `resource` for RBAC filtering
4. **Create page** — wrap with `"use client"` if interactive

---

## 6. 🎨 Global CSS & Design Tokens

### File: `src/app/globals.css`

**Tailwind v4** with `@import "tailwindcss"` and `@theme` directive.

### Design Tokens (CSS Custom Properties)

```css
:root {
  /* Brand Colors */
  --admin-primary: #2d633f;
  --admin-primary-hover: #277741;
  --admin-primary-light: #c8dfce;

  /* Surfaces */
  --admin-bg: #f5f6f8;
  --admin-surface: #ffffff;
  --admin-surface-muted: #f0f1f4;
  --admin-bg-input: #fafafa;
  --admin-border: #e2e4e9;

  /* Text */
  --admin-text-main: #101212;
  --admin-text-muted: #6b7280;

  /* Status Colors */
  --admin-status-neutral-bg: #eef0f3;
  --admin-status-neutral-text: #4b5563;
  --admin-status-info-bg: #e6edff;
  --admin-status-info-text: #2e5bff;
  --admin-status-warning-bg: #fef3e0;
  --admin-status-warning-text: #b45309;
  --admin-status-success-bg: #e1f0e5;
  --admin-status-success-text: #16a34a;
  --admin-status-danger-bg: #fde6e6;
  --admin-status-danger-text: #ef4444;

  /* Seller/Buyer semantics */
  --admin-seller: #475569;
  --admin-buyer: var(--admin-primary);
}
```

### Dark Theme

```css
.dark {
  --admin-bg: #0a0a0a;
  --admin-surface: #111111;
  --admin-text-main: #f4f4f5;
  /* ... */
}
```

### Z-Index Scale

```css
@theme {
  --z-raised: 10;             /* sticky table headers */
  --z-dropdown: 20;           /* in-page dropdowns */
  --z-sticky: 30;             /* page header */
  --z-sidebar-backdrop: 35;   /* mobile overlay */
  --z-sidebar: 40;            /* sidebar */
  --z-modal: 50;              /* modal backdrop */
  --z-modal-raised: 60;       /* modal content */
  --z-select: 200;            /* selects inside modals */
}
```

### Key Rules

- **Never** write raw hex values in components. Use CSS variables: `var(--admin-primary)`
- **Never** write `z-10`, `z-50` — use `z-[var(--z-modal)]`
- **Always** use `cn()` from `lib/utils.ts` for class merging
- Use `scrollbar("thin")` / `scrollbar("medium")` / `scrollbar("none")` for scrollbar styling
- Fade-in animation: `animate-fade-in` class

---

## 7. 📦 Dependencies & Their Purpose

| Dependency | Purpose |
|-----------|---------|
| **next** | Framework (App Router, SSR, API routes, middleware) |
| **react, react-dom** | UI library |
| **typescript** | Type safety |
| **@tanstack/react-query** | Server state management, caching, refetching |
| **zustand** | Lightweight client state (auth, UI, toasts) |
| **axios** | HTTP client (interceptors, token refresh) |
| **react-hook-form** | Form state management and validation |
| **zod** | Schema validation (form resolvers) |
| **@hookform/resolvers** | Bridge between zod and react-hook-form |
| **tailwindcss** | Utility-first CSS |
| **@tailwindcss/postcss** | Tailwind v4 PostCSS plugin |
| **clsx + tailwind-merge** | `cn()` utility for conditional classes |
| **class-variance-authority** | Component variant management |
| **lucide-react** | Icon library (tree-shakeable) |
| **framer-motion** | Animations (modals, toasts, page transitions) |
| **recharts** | Charting library (dashboard) |
| **jwt-decode** | Decode JWT tokens client-side |
| **@base-ui/react** | Accessible UI primitives |
| **tw-animate-css** | Tailwind animation utilities |
| **shadcn** | CLI for component scaffolding |

---

## 8. 📐 Page Creation Pattern

### List Page Pattern

```typescript
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import { exampleService } from "@/services/example/example.service";
import { useRBAC } from "@/hooks/useRBAC";

export default function ExampleListPage() {
  const { hasPermission } = useRBAC();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "neutral">("neutral");

  const { data, isLoading, error } = useQuery({
    queryKey: ["example", { page, pageSize, sortBy, sortOrder }],
    queryFn: () => exampleService.getAll({ Page: page, PageSize: pageSize }),
  });

  const columns = [
    { header: "Name", accessor: "name" as const, sortable: true },
    { header: "Status", accessor: "status" as const },
  ];

  return (
    <DataTable
      data={data?.items ?? []}
      total={data?.total ?? 0}
      title="Example List"
      columns={columns}
      currentPage={page}
      pageSize={pageSize}
      onPageChange={setPage}
      onPageSizeChange={setPageSize}
      loading={isLoading}
      error={error?.message}
    />
  );
}
```

### Detail Page Pattern

```typescript
"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { exampleService } from "@/services/example/example.service";

export default function ExampleDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ["example", id],
    queryFn: () => exampleService.getById(id),
  });

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Not found</div>;

  return <div>{/* render detail */}</div>;
}
```

---

## 9. ⚠️ What to AVOID

| ❌ Bad Practice | ✅ Good Practice |
|----------------|-----------------|
| `axios.get("/api/...")` directly | Use `request()` from `api-handler.ts` |
| `"api/deals/" + dealId` in component | Use `API_ENDPOINTS.DEALS.DETAIL(id)` |
| `localStorage.getItem("token")` | Use `useAuthStore.getState().accessToken` |
| `z-10`, `z-50` in Tailwind classes | Use `z-[var(--z-modal)]` |
| `#2e5bff` hex in component | Use `var(--admin-primary)` |
| Putting server data in Zustand | Use React Query cache |
| `class={...}` string concatenation | Use `cn()` from `lib/utils.ts` |
| `new Date().toLocaleDateString()` | Use `formatDate()` from `formatters.ts` |
| `"$" + amount` for pricing | Use `formatUsd()` from `formatters.ts` |
| Raw template strings for URLs | Use `routeBuilder.methodName()` |
| Importing `axios` directly | Import from `api-client.ts` (but use `request()` instead) |
| `useEffect` for API calls | Use `useQuery` / `useMutation` |
| Multiple stores for server data | Single `authStore` + React Query |
| Using `any` type | Define proper TypeScript interfaces |
| `fetch` instead of `axios` | Use the shared `apiClient` instance |
| Custom error handling per page | Use `useApiMutation` with centralized error toast |

---

## 10. 🚀 Quick Start for New Features

### Step-by-step checklist for adding a new domain:

1. **Define types** → `src/lib/types/feature.ts`
2. **Add endpoints** → `src/services/api/endpoints.ts` (add to `API_ENDPOINTS`)
3. **Create service** → `src/services/feature/feature.service.ts`
4. **Add route** → `src/lib/routeBuilder.ts` (new method)
5. **Register RBAC** → `src/lib/rbac.ts` (add to `PATH_RESOURCE_MAP`)
6. **Add to sidebar** → `src/components/admin/sidebar.tsx` (new item)
7. **Create pages** → `src/app/(admin)/feature/page.tsx` (list) and `[id]/page.tsx` (detail)
8. **Add queries** → Use `useQuery` for fetches, `useApiMutation` for mutations
9. **Add UI components** → `src/components/feature/` if needed, or use existing `ui/` primitives

### Step-by-step checklist for adding a new page to an existing domain:

1. **Add endpoint** → `endpoints.ts`
2. **Add method to service** → `feature.service.ts`
3. **Add route** → `routeBuilder.ts`
4. **Register RBAC** → `rbac.ts` (if new path pattern)
5. **Create page** → `src/app/(admin)/feature/new-path/page.tsx`

---

## 11. 🔄 Critical Data Flow

```
User Action → Component
  → useApiMutation / useMutation
    → Domain Service (e.g., dealsService.issueOffer())
      → request() in api-handler.ts
        → apiClient (Axios instance)
          → Interceptor injects Bearer token
            → API call
              → 401 Response → Interceptor refreshes token → retry
              → 2xx Response → request() unwraps { data: T } → returns T
        ← Domain Service returns Promise<T>
    ← Mutation onSuccess → toast + invalidate queries + page-specific logic
  ← Component re-renders with fresh data
```

---

## 12. 🗺️ Route Map

| Route | Component | Resource (RBAC) |
|-------|-----------|-----------------|
| `/login` | LoginPage | Public |
| `/dashboard` | DashboardPage | dashboard |
| `/users-kyc` | KYCQueuePage | organization |
| `/users-kyc/[id]` | KYCDetailPage | organization |
| `/listings` | ListingsPage | listing |
| `/listings/[id]` | ListingDetailPage | listing |
| `/listings/[id]/edit` | EditListingPage | listing |
| `/deals` | DealsPage | deal |
| `/deals/[dealId]` | DealDetailPage | deal |
| `/deals/[dealId]/chat` | DealChatPage | deal |
| `/deals/[dealId]/fulfillment` | FulfillmentPage | deal |
| `/negotiation` | NegotiationPage | deal |
| `/negotiation/[dealId]` | NegotiationDeskPage | deal |
| `/contracts` | ContractsPage | contract |
| `/contracts/[dealId]` | ContractDetailPage | contract |
| `/payments` | PaymentsPage | payment |
| `/reports` | ReportsPage | report |
| `/audit-log` | AuditLogPage | audit |
| `/rights-requests` | RightsRequestsPage | deal |
| `/rights-requests/[id]` | RightsRequestDetailPage | deal |
| `/chat` | ChatPage | deal |
| `/administration` | AdminUsersPage | user |
| `/administration/add` | AddAdminUserPage | user |
| `/administration/[adminId]` | AdminUserDetailPage | user |
| `/administration/[adminId]/edit` | EditAdminUserPage | user |
| `/administration/roles` | RolesPage | user |
| `/administration/roles/add` | AddRolePage | user |
| `/administration/roles/[roleId]/edit` | EditRolePage | user |
| `/administration/configuration` | ConfigurationPage | setting |
| `/administration/notification` | NotificationsPage | notification |
| `/administration/notification/add` | AddNotificationPage | notification |

---

## 13. 🔐 Auth Flow

```
1. User visits /login
2. Submits email + password
3. authService.login() → POST /api/auth/login
4. Backend returns { accessToken, refreshToken }
5. setAccessToken() in authStore:
   - Decodes JWT → extracts user, permissions, roleType
   - Stores in Zustand (memory) + localStorage (for page reload)
6. Providers.tsx shows AuthBootstrap:
   - Checks if token exists
   - If not, calls refreshAccessToken() to try silent refresh
   - Once hydrated, renders children
7. Page refresh → AuthBootstrap runs again:
   - Checks localStorage for existing token
   - If expired, tries refresh token endpoint
   - If both fail, redirects to /login
8. API interceptor:
   - Request: injects Bearer token
   - Response 401: queues concurrent requests, refreshes token, retries
   - Refresh fails: clears auth, redirects to /login
```

---

## 14. 🧪 Proxy/Middleware (src/proxy.ts)

- **Purpose:** Server-side RBAC gate (Layer 1)
- **How it works:** Checks `rp_hint` cookie (set by backend alongside httpOnly refresh cookie)
- **Cookie contents:** `{ roleType, permissions, exp }` — no secrets
- **On mismatch:** Redirects to `/dashboard`
- **Unmapped routes:** Allowed only for `/dashboard` and `/`; everything else blocked
- **Dev bypass:** Currently hardcoded to `super_admin` for development

---

## 15. 📁 Config Files

| File | Purpose |
|------|---------|
| `constants.ts` | `API_BASE_URL`, `DEV_MODE` |
| `next.config.ts` | API rewrites proxy |
| `tsconfig.json` | `@/` → `src/` path alias |
| `postcss.config.mjs` | Tailwind v4 PostCSS |
| `eslint.config.mjs` | ESLint config |
| `Dockerfile` | Container build |
| `components.json` | shadcn config (not actively used) |

---

## 16. 🧰 Utility Functions

| Function | File | Purpose |
|----------|------|---------|
| `cn(...inputs)` | `lib/utils.ts` | Merge Tailwind classes |
| `scrollbar(size)` | `lib/utils.ts` | Get scrollbar class |
| `formatDate(value)` | `lib/utils/formatters.ts` | Format ISO date string |
| `formatDateTime(value)` | `lib/utils/formatters.ts` | Format date + time |
| `formatUsd(amount)` | `lib/utils/formatters.ts` | Format USD currency |
| `formatRelativeAge(hours)` | `lib/utils/formatters.ts` | "3d", "12h", "< 1h" |
| `getErrorMessage(error)` | `services/api/api-error-handler.ts` | Extract error message from any error shape |
| `normalizeApiError(error)` | `services/api/api-error-handler.ts` | Convert AxiosError → ApiError |

---

## 17. 📝 Code Style Conventions

- **Imports:** Use `@/` path alias (e.g., `import { cn } from "@/lib/utils"`)
- **Components:** Default exports for pages, named exports for shared components
- **Client components:** `"use client"` directive at top
- **Server components:** No `"use client"` — keep them server-rendered where possible
- **Functions:** Use `function` keyword for component declarations, arrow functions for callbacks
- **Types:** Interfaces for objects, types for unions/primitives
- **Services:** Export as `const serviceName = { method1() {}, method2() {} }` object
- **CSS:** Always use CSS variables via `var(--admin-*)`, never raw hex
- **Class merging:** Always use `cn()` from `lib/utils.ts`
- **Error handling:** Use `useApiMutation` for mutations (auto toasts), `query-error-card.tsx` for query errors
- **File naming:** kebab-case for files, PascalCase for components, camelCase for functions/variables