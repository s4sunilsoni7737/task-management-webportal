# Full Stack Developer – Technical Assessment: Task Management System

This repository contains the implementation of the **Pyramid** Task Management System for the Full-Stack Developer technical assessment.

## Overview
This project demonstrates frontend and backend engineering skills, product thinking, and strict attention to detail in replicating a premium Figma design. 

## Tech Stack
- **Frontend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS (with CSS variables for dynamic theming)
- **Language**: TypeScript (strict mode)
- **State Management**: TanStack React Query (server state), Zustand (client UI/auth state)
- **Forms & Validation**: React Hook Form with Zod-ready validation structures.
- **Backend / Database**: Currently implemented using Next.js Route Handlers (`src/app/api/**`) backed by an in-memory database to allow for immediate local execution without environment setup. 
  - *Note: The frontend architecture uses a clean service layer (`src/services/api-handler.ts`), making it trivial to swap out the `NEXT_PUBLIC_API_URL` to point to a fully separate NestJS + Database backend.*

---

## Assessment Requirements Fulfillment

### 1. Design Fidelity
The application strictly adheres to the provided Figma design, demonstrating high attention to detail:
- **Layout & Spacing**: Exact translations of spacing, padding, and layout structures.
- **Typography & Colors**: Implementation of the custom design system using CSS variables mapped to the Tailwind configuration. No hardcoded hex values are used in components.
- **Interactions & Animations**: Added tactile micro-animations (e.g., hover lifts on Kanban cards, active scale-down on mobile touch targets, and page fade-ins) to ensure a premium, dynamic feel. 
- **Deviations**: Any intentional design deviations are documented below per the requirements.

### 2. Theme Support
- The theme switcher is fully functional and identical to the Figma design.
- Supports **Light** and **Dark** modes.
- Supports 6 accent color modes (Amber, Blue, Pink, Rose, Emerald, Black).
- **Persistence**: Theme selections are persisted via `localStorage` and rehydrated before the first paint using an inline script in `app/layout.tsx` to prevent any theme flashing on page reload.

### 3. Guest Login, Reusable Components, APIs & Structure
- **Guest Login**: Implemented a functional guest session that persists across page refreshes using Zustand.
- **Project Structure**: Clean, domain-driven directory structure separating `components/ui` (reusable primitives like Buttons, Popovers, and Avatars) from feature modules (`components/tasks`, `components/projects`).
- **Clean APIs**: While currently running on mock Next.js Route Handlers, the API structure (`{ data: T }` envelope, normalized typed errors) was designed to perfectly mirror a NestJS REST API. Components never call `fetch` directly; they call domain services (e.g., `tasksService.update()`).

### 4. Responsive Design
The application is fully responsive and provides an excellent user experience across desktop, tablet, and mobile devices:
- **Navigation**: The sidebar transitions seamlessly from a desktop rail to a mobile overlay drawer below ~900px.
- **Kanban Board**: Stacks vertically on mobile to prevent awkward horizontal scrolling and improve drag-and-drop ergonomics.
- **Task Details**: The two-column layout cleanly stacks into a single column on tablet/mobile breakpoints.
- **Mobile Cards**: Dense desktop tables convert to touch-friendly stacked row cards on mobile devices.

---

## Intentional Design Deviations
*Documenting intentional deviations as requested by the assessment guidelines.*

- **Responsive Adaptations**: The Figma design is primarily desktop-focused. To ensure a premium mobile experience, we stacked the Kanban columns vertically, removed the desktop separator line in task details, and stacked the properties pane underneath the main content instead of hiding it behind a toggle.
- **Mock Backend Persistence**: Because a database wasn't provisioned in this specific repository context, the backend is mocked in-memory and resets on server restart. However, the client service layer is fully prepared for a real NestJS backend.
- **OAuth Buttons**: The Google OAuth button is present for visual fidelity but acts as a stub, as no real OAuth provider was configured in the scope.
- **Resources / Attachments**: Shown in the UI for fidelity, but functional file uploads were omitted as they were not defined in the core REST API scope.
- **Touch Target Sizing**: Interactive icons follow the design spec's literal "~32×32px" sizing for pixel fidelity to the reference screens, rather than the standard ≥40px touch-target guideline.

## Live Project URLs
- **Frontend App**: [https://task-management-webportal.vercel.app](https://task-management-webportal.vercel.app)
- **Backend API Docs**: [https://task-management-api-gold.vercel.app/api/docs](https://task-management-api-gold.vercel.app/api/docs)

---

## Configuration & Security Philosophy

*Why `constants.ts` over `.env`?*

In this project, configuration (such as `API_BASE_URL`) is managed via static TypeScript constants in `src/constants.ts` for production environments. For local development, we still use `.env` files for developer convenience (see `.env.example` for required keys).

This transition to `constants.ts` for live deployments is an intentional security and architecture decision:
- **Leakage Risk**: Frontend `.env` files are notoriously susceptible to accidental version-control commits or public exposure via misconfigured web servers. They are frequently targeted by automated vulnerability scanners in supply chain attacks.
- **Runtime Safety**: By relying on static TypeScript constants in production, we guarantee better type safety and avoid runtime environment injection vulnerabilities (like prototype pollution).
- **CI/CD Integration**: In live production and CI/CD pipelines, we use YAML scripts to securely provide the path of the constants file and inject credentials dynamically at build time (`export const API_BASE_URL = <base_url>;`), keeping secrets completely out of the server environment space.

---

## Getting Started

```bash
npm install
npm run dev     # http://localhost:3000
```
*(The app talks to its own mock API by default at `/api` without requiring any environment variables).*

## Part 2 — AbleSpace Walkthrough
See [`docs/part-2-ablespace-walkthrough.md`](./docs/part-2-ablespace-walkthrough.md).
