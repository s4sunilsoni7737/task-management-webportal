/**
 * Singleton URL factory for all app routes. Components should navigate via
 * `routes.tasks()` etc. instead of hand-writing path strings, so route
 * shapes only need to change in one place.
 */
class RouteBuilder {
  login() {
    return "/login";
  }
  tasks() {
    return "/tasks";
  }
  taskDetail(taskId: string) {
    return `/tasks/${taskId}`;
  }
  projects() {
    return "/projects";
  }
  /** Project-scoped Tasks view (breadcrumb: Projects › [Project Name]). */
  projectDetail(projectId: string) {
    return `/projects/${projectId}`;
  }
}

export const routes = new RouteBuilder();
