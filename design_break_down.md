# Assessment Task UI — Detailed Design Breakdown

> **Scope:** Documentation only. No UI has been created or modified.
>
> **Design source:** [Figma — Assessment Task](https://figma.com/design/obONCFmoTFN27V5H9PHS2X/Assessment-Task?node-id=0-1&p=f&t=6awUqwuSjRRTZBJK-0)
>
> **Reference screenshots:**
> 1. [Theme menu](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-08-07%20171122-ZdB3UwJ2apqyahm5jps98VjvkxBy50.png)
> 2. [Color mode menu](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-08-07%20171228-28rfk1Kg4qnpxbiVt7vUKPvrquQTLC.png)
> 3. [Task detail with date picker](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-08-07%20171109-jfY7CPFZUJFDaRVG8zaBObpfqXW49D.png)
> 4. [Task detail with priority menu](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-08-07%20171046-t29MZTS8cheYHwmQFvcnrjk3RdJzhC.png)
> 5. [Grouped task list](https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-08-07%20171255-f5OhX73XrhVrJBsGgtRqejeOKAPdQc.png)

## 1. Product summary

The interface is a lightweight project and task-management workspace named **Dexter**. It contains:

- A persistent left navigation rail.
- Workspace navigation for Tasks and Projects.
- A dense, spreadsheet-like task table.
- Project/task detail views.
- Inline menus for theme, color mode, priority, dates, and actions.
- Comments, subtasks, labels, members, resources, and activity updates.

The visual language is intentionally restrained: white surfaces, soft gray borders, black typography, small colored status indicators, compact controls, and minimal corner rounding.

## 2. Global visual system

### 2.1 Overall canvas

- Reference viewport: approximately **1052 × 699 px**.
- Desktop-first application shell.
- Main application height fills the viewport.
- Left sidebar remains fixed while the main content scrolls independently.
- Main content uses a white background with very light gray separators.
- Content aligns to a consistent horizontal grid with approximately **16–20 px** outer padding.

### 2.2 Color palette

The following values are visually estimated from the screenshots. The Figma variables should remain the final source of truth during implementation.

| Role | Approximate value | Usage |
|---|---:|---|
| App background | `#FFFFFF` | Main page and content surfaces |
| Sidebar background | `#FAFAFA` | Left navigation area |
| Border | `#E5E5E5` | Table borders, cards, separators, inputs |
| Primary text | `#171717` | Headings, labels, buttons |
| Secondary text | `#737373` | Descriptions, metadata, placeholders |
| Muted fill | `#F5F5F5` | Table headers, selected rows, chips |
| Black action | `#111111` | Add Task / Add Project buttons |
| High priority | `#F04444` | High priority labels and indicators |
| Medium priority | `#F59E0B` | Medium priority labels and indicators |
| Low priority | `#A8B0C0` | Low priority labels and indicators |
| Accent blue | `#6D5DF5` | Selected theme/color state and avatar accents |
| Green status | `#0F9F6E` | Emerald color-mode option |

Use semantic tokens rather than scattering raw colors across components.

### 2.3 Typography

- Body font is a neutral sans-serif similar to **Inter**, **Geist**, or **SF Pro**.
- Primary body size: **13–14 px**.
- Page headings: **20–22 px**, semibold/bold.
- Section headings: **14–16 px**, semibold.
- Table text: **12–13 px**.
- Metadata and helper text: **11–12 px**.
- Line height: approximately **1.4–1.5**.
- Text is mostly black or dark gray; labels use medium gray.
- Avoid decorative typography or display fonts.

### 2.4 Shape and spacing

- Border radius is subtle: approximately **6–8 px** for cards and menus.
- Buttons use approximately **6 px** radius.
- Inputs and pills use approximately **6–8 px** radius.
- Standard spacing rhythm: **4, 8, 12, 16, 20, 24 px**.
- Borders are 1 px and low contrast.
- Shadows are soft and shallow, used only on floating menus and cards.

### 2.5 Icons

- Icons are compact, monochrome, and outline-based.
- Typical size: **14–16 px**.
- Use icons for search, filters, fields, calendar, settings, theme, color mode, members, attachments, comments, share, lock, collapse, and overflow actions.
- Icon buttons should have accessible labels and a minimum clickable area of approximately **32 × 32 px**.

## 3. Shared application shell

### 3.1 Left sidebar

**Width:** approximately **210 px** in the desktop reference.

Structure from top to bottom:

1. **Workspace identity row**
   - Circular Dexter avatar at approximately **24–28 px**.
   - Workspace name: **Dexter**.
   - Small up/down chevron at the far right.
   - Horizontal padding: approximately **16 px**.
   - Height: approximately **48–52 px**.

2. **Workspace section label**
   - Text: **Workspace**.
   - Small downward chevron aligned right.
   - Top spacing: approximately **14–18 px**.

3. **Tasks navigation item**
   - Grid/checklist icon.
   - Label: **Tasks**.
   - Selected state uses a very light gray rounded background.
   - Row height: approximately **30–34 px**.

4. **Projects navigation item**
   - Briefcase/project icon.
   - Label: **Projects**.
   - Same row height and icon alignment as Tasks.

5. **Account/menu popover when workspace avatar is selected**
   - White floating card positioned below the workspace header.
   - Width: approximately **200 px**.
   - Avatar centered near top.
   - Name: **Dexter**.
   - Email: **Dexter@gmail.com**.
   - Menu rows: **Change Theme**, **Color Mode**, **Settings**.
   - Each row includes a left icon and right-facing chevron where relevant.
   - Card uses a thin border and soft shadow.

### 3.2 Main top bar

- Main area begins after the sidebar.
- Top bar height: approximately **52 px**.
- Left side contains a sidebar collapse/toggle icon.
- A vertical divider appears after the icon area.
- On task detail pages, breadcrumbs appear in the top bar.
- Right-side controls vary by page and include search, Fields, Filter, Add Task/Add Project, lock, view count, share, overflow, and panel toggle.

## 4. Page A — Projects list

### Purpose

Displays all projects in a compact table and provides controls to search, filter, manage visible fields, and create a project.

### Layout

1. **Main page header**
   - Title: **Projects**.
   - Positioned at approximately **224–240 px** from the left edge, after the sidebar.
   - Top margin from the content header: approximately **20–24 px**.

2. **Toolbar**
   - Right aligned.
   - Search icon button.
   - **Fields** button with a columns icon.
   - Filter icon button.
   - Black **+ Add Project** button.
   - Button height: approximately **32–36 px**.
   - Gap between controls: approximately **8 px**.

3. **Project table**
   - Outer border with approximately **8 px** corner radius.
   - Header row has a light gray background.
   - Columns:
     - Projects
     - Priority
     - Lead
     - Due Date
     - Actions
   - Header height: approximately **36–40 px**.
   - Body row height: approximately **36–40 px**.
   - Actions column is narrow and right aligned.
   - Each row ends with a three-dot overflow button.

### Example visible data

- Design Homepage — High — avatar lead — 12 Sep 2026.
- Develop Login Feature — Low — initials lead — 15 Sep 2026.
- Test Payment Gateway — Medium — plus/add lead — 18 Sep 2026.

### Priority presentation

- High: small red ascending-bars icon and red text.
- Medium: small orange ascending-bars icon and orange text.
- Low: muted gray/blue icon and muted text.

## 5. Page B — Tasks list grouped by status

### Purpose

Shows tasks grouped into collapsible workflow sections: **To Do**, **Doing**, and **Completed**.

### Header and breadcrumb

- Breadcrumb at the top: **Projects > Design Homepage**.
- Breadcrumb uses small muted text.
- Current page is darker than the parent breadcrumb.
- Page title: **Tasks**.
- Toolbar matches the Projects page: search, Fields, filter, and black **+ Add Task**.

### Group sections

Each group has:

1. A small collapse/expand chevron.
2. Group title in semibold text.
3. A bordered table below it.
4. A final **+ Add Task** row.

Visible groups:

- To Do
- Doing
- Completed

### Task table columns

- Task
- Priority
- Members
- Due Date
- Actions

### Row details

- Task name is left aligned.
- Priority is centered or aligned toward the middle.
- Member cell can contain:
  - Circular user avatar.
  - Initials avatar.
  - Light gray circular plus button.
- Due date uses compact date formatting such as **12 Sep 2026**.
- Actions use a three-dot menu.

### Vertical rhythm

- Group heading to table: approximately **8–10 px**.
- Row height: approximately **36–40 px**.
- Section-to-section spacing: approximately **14–18 px**.

## 6. Page C — Task detail

### Purpose

Provides a detailed view of a task, including description, properties, labels, resources, subtasks, comments, metadata, and update history.

### Top bar actions

Right aligned action controls:

1. Lock button.
2. Eye/view count button showing **1**.
3. Share button.
4. Three-dot overflow button.
5. Panel/layout toggle button.

Each button is compact, approximately **32 × 32 px**, with a thin border or soft gray fill.

### Main content column

Approximate width: **520 px** in the reference desktop frame.

#### Task header

- Title: **Write API Documentation**.
- Font size: approximately **20 px**, bold.
- Description below:
  - “Create clear and detailed API documentation to guide developers in using the inventory and sales metrics features effectively.”
  - Width constrained to two lines.
  - Muted gray text.
  - Font size approximately **13 px**.

#### Properties row

Label: **Properties**.

- Designer/member value with avatar or initial icon.
- Date chip showing **31 Jul** with calendar icon.
- Date chip uses a pale pink/red background and red text.

#### Labels row

Label: **Labels**.

Pill-style labels:

- Research
- Design
- Development
- Testing
- Deployment

Pill dimensions:

- Height: approximately **22–24 px**.
- Horizontal padding: approximately **8 px**.
- Border radius: approximately **12 px**.
- Background: very light gray.
- Text: 11–12 px.

#### Resources row

- Label: **Resources**.
- Attachment/link icon.
- Placeholder text: **Add document or link...**.
- Text is muted.

### Subtasks table

Section header: **Subtasks** with a small collapse/expand chevron.

Table columns:

- Task
- Priority
- Members
- Due Date
- Actions

Rows:

- Subtask 1 — High — avatar — 12 Sep 2026.
- Subtask 2 — Low — initials — 15 Sep 2026.
- Subtask 3 — Medium — plus button — 18 Sep 2026.

Footer row:

- **+ Add Subtasks**.
- Uses a compact inline action style.

### Comments area

Section label: **Subtasks** appears above the discussion card in the screenshot.

Comment card:

- Avatar.
- Author name: **Ankit Dutta**.
- Timestamp: **just now**.
- Comment text: **dsds**.
- Right-side reaction/add-reaction icon and overflow menu.
- Divider.
- Reply input row with avatar, placeholder **Leave a reply...**, attachment icon, and send icon.

Separate comment composer:

- Full-width bordered input.
- Placeholder: **Add a comment...**.
- Attachment and send icons on the right.
- Height: approximately **52 px**.

## 7. Page D — Task detail with date picker

This is the same task-detail page with the date control expanded.

### Date picker behavior

- Opens below the active date field in the right details panel.
- White floating calendar card.
- Width: approximately **205–220 px**.
- Border and soft shadow.
- Header contains:
  - Previous month chevron.
  - Centered month/year: **January 2026**.
  - Next month chevron.
- Weekday labels: **Su Mo Tu We Th Fr Sa**.
- Seven-column calendar grid.
- Current/selected date uses a dark filled circular marker.
- Another date may use a light gray circular marker.
- Calendar dates are compact, approximately **12–13 px**.
- Date picker should close on selection, outside click, or Escape.

### Right details panel

- Width: approximately **265–280 px**.
- Stack of bordered cards.
- First card heading: **Details**.
- Header includes collapse chevron, plus icon, and settings icon.
- Rows include Status, Priority, Members, Dates, Labels, Teams, and Reporter.

## 8. Page E — Task detail with priority menu

This is the same task-detail page with the Priority control expanded.

### Priority popover

- Opens beside or below the Priority row in the Details card.
- White floating menu, approximately **165–180 px** wide.
- Header text: **Priority**.
- Options:
  - No Priority
  - Urgent
  - High
  - Medium
  - Low
- Each option has a colored priority icon or indicator.
- Selected option shows a checkmark aligned right.
- Urgent and High use red/orange emphasis; Medium is amber; Low is muted gray.
- Menu uses approximately **8 px** vertical padding and **28–32 px** option rows.

## 9. Theme menu state

The first screenshot shows the workspace menu with **Change Theme** expanded.

### Menu structure

- Parent menu remains visible on the left.
- Theme submenu opens to the right of the Change Theme row.
- Submenu width: approximately **140–160 px**.
- Options:
  - Light
  - Dark
- Light option is selected and displays a checkmark on the right.
- Each option includes a sun/moon icon.
- Submenu has a white background, thin border, rounded corners, and soft shadow.

## 10. Color mode menu state

The second screenshot shows **Color Mode** expanded.

### Color options

- Amber
- Blue
- Pink
- Rose
- Emerald
- Black

Each option includes:

- A small colored square swatch, approximately **10–12 px**.
- Text label.
- Checkmark on the selected color, shown on the right.

The selected color in the screenshot is **Blue**.

## 11. Interaction requirements

### Navigation

- Sidebar Tasks and Projects items are clickable.
- Breadcrumbs are clickable for parent navigation.
- Sidebar collapse button hides or compresses the sidebar.

### Tables

- Rows should support hover feedback.
- Three-dot action menus open per-row actions.
- Add Task/Add Project opens the corresponding creation flow.
- Fields controls show/hide table columns.
- Filter controls refine visible records.
- Search filters rows by task/project name.

### Detail view

- Priority is editable from the Details card.
- Date chips open calendar popovers.
- Labels can be added or removed.
- Members can be assigned through a member picker.
- Subtasks can be created inline.
- Comments support posting, replying, attachments, reactions, and overflow actions.
- Right-side cards can collapse.

### Menus and overlays

All popovers should:

- Open adjacent to their trigger.
- Stay inside the viewport where possible.
- Close on outside click.
- Close on Escape.
- Preserve keyboard focus.
- Expose accessible names and selected states.

## 12. Right-side Updates card

The task-detail screenshots show a second card below the Details card:

- Card title: **Updates**.
- Header uses a collapse/expand chevron.
- Activity items are stacked vertically.
- Each item has a small avatar or colored event icon on the left.
- The actor is shown as **You** in dark text.
- The event description is shown below in muted text.
- Example events:
  - Changed priority from No priority to Urgent.
  - Posted an update · Aug 2026.
- Card uses the same border, radius, and padding system as the Details card.

## 13. Exact screenshot state descriptions

### Screenshot 1 — Light theme popover

Projects page is visible with the workspace menu open from the Dexter avatar. The Change Theme submenu is open and shows Light selected, with Dark below it. The Projects table is visible behind the overlays.

### Screenshot 2 — Color mode popover

Projects page is visible with the Color Mode submenu open. The submenu lists Amber, Blue, Pink, Rose, Emerald, and Black. Blue is selected and marked with a checkmark. The selected color is also reflected by the blue/purple swatch beside Color Mode.

### Screenshot 3 — Date picker state

The Write API Documentation task page is open. The January 2026 calendar is expanded from the Dates area in the Details panel. The date 10 is selected with a dark circular marker, and another date has a pale circular state. The rest of the task content remains visible behind the popover.

### Screenshot 4 — Priority menu state

The same task page is open with the Priority menu expanded. Options are No Priority, Urgent, High, Medium, and Low. Urgent is selected and has a checkmark. The Updates card records the priority change.

### Screenshot 5 — Grouped task list

The Tasks page is open for the Design Homepage project. Breadcrumbs appear above the title. Three expanded groups are visible: To Do, Doing, and Completed. Each group contains the same task table structure and a final Add Task row.

## 14. Responsive behavior to define before implementation

The screenshots are desktop-oriented, but the implementation should define these rules:

- Below approximately **900 px**, collapse the sidebar into an icon rail or drawer.
- Below approximately **700 px**, convert wide tables into stacked rows or horizontally scrollable tables.
- Keep task/project names visible before secondary columns.
- Move the right Details panel below the main task content on narrow screens.
- Make popovers viewport-aware and prevent horizontal overflow.
- Keep primary actions visible; move secondary actions into overflow.

## 15. Recommended component breakdown

- `AppShell`
- `WorkspaceSwitcher`
- `Sidebar`
- `SidebarNavItem`
- `WorkspaceMenu`
- `ThemeSubmenu`
- `ColorModeSubmenu`
- `TopBar`
- `Breadcrumbs`
- `PageToolbar`
- `ProjectsTable`
- `TasksBoard`
- `TaskGroup`
- `TaskTable`
- `TaskDetailPage`
- `TaskProperties`
- `LabelsList`
- `SubtasksTable`
- `CommentsThread`
- `DetailsPanel`
- `DatePickerPopover`
- `PriorityPopover`
- `MemberPicker`
- `OverflowMenu`

## 16. Implementation checklist

- [ ] Confirm exact Figma frame dimensions and variables.
- [ ] Confirm font family and font weights from Figma.
- [ ] Confirm all exact color tokens from Figma.
- [ ] Confirm icon library or exported icon assets.
- [ ] Build shared desktop shell first.
- [ ] Build Projects list page.
- [ ] Build grouped Tasks page.
- [ ] Build Task detail page.
- [ ] Add date picker and priority popover states.
- [ ] Add workspace theme and color mode menus.
- [ ] Add responsive behavior.
- [ ] Add keyboard/focus behavior for popovers.
- [ ] Validate spacing and sizing against the screenshots.

## 17. Reference limitation

The supplied Figma URL was provided as the source of truth. Automated access to the Figma page returned a CloudFront **403** response, so exact Figma variables, node names, exported assets, and measurements could not be read directly. The breakdown above is based on the supplied screenshots and should be reconciled against the Figma file before production implementation.
