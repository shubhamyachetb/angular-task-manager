# Angular Concepts Guide — Task Manager Project

Quick revision notes for concepts used in **this** project.  
Project path: `angular-task-manager/src/app/`

---

## Angular Architecture

### Definition

Angular apps are built from **components** (UI), **services** (logic/state), and **routing** (navigation), wired together with **dependency injection**.

### Why We Use It

Separates UI, business logic, and navigation so the app stays maintainable as it grows.

### Used In This Project

- `core/` — auth, storage, guards, models  
- `shared/` — reusable UI, pipes, directives  
- `features/` — auth + todos domains  
- `layout/` — shells with navbar / auth card  
- `app.routes.ts`, `app.config.ts`

### Small Example

```text
Component → injects Service → updates state → template shows data
```

### Real-World Use Case

Enterprise apps split by domain (billing, users, reports) with a shared design system.

### React Comparison

| Angular | React |
|---------|-------|
| Components + Services + Router | Components + Hooks + Context + React Router |
| DI built-in | Manual providers / Context |

---

## Standalone Components

### Definition

A component that **declares its own imports** (Router, forms, other components) without an `NgModule`.

### Why We Use It

Less boilerplate; default in modern Angular; easier lazy loading.

### Used In This Project

Every component, e.g. `login.component.ts`, `button.component.ts` — all use `standalone: true` (implicit default in CLI).

### Small Example

```typescript
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, InputComponent],
  templateUrl: './login.component.html',
})
export class LoginComponent {}
```

### Real-World Use Case

New Angular apps (v17+) are standalone-first; modules kept only for legacy libs.

### React Comparison

Similar to a self-contained React component file that imports what it needs.

---

## Components

### Definition

A class + template + styles that control **one piece of UI**.

### Why We Use It

Reusable, testable UI units (login form, todo row, navbar).

### Used In This Project

- Smart: `todos-page`, `login`, `register`  
- Dumb: `button`, `input`, `todo-item`

### Small Example

```typescript
@Component({ selector: 'app-todo-item', templateUrl: './todo-item.component.html' })
export class TodoItemComponent {}
```

### Real-World Use Case

Design systems: `Button`, `Input`, `Modal` used across features.

### React Comparison

Angular **Component** ≈ React **function component**.

---

## Templates

### Definition

HTML in `.component.html` (or inline) that describes **what** to render.

### Why We Use It

Keeps markup out of TypeScript; designers can read templates easily.

### Used In This Project

All `*.component.html` files, e.g. `todo-list.component.html`, `login.component.html`.

### Small Example

```html
<h1>Your tasks</h1>
<app-todo-form />
```

### Real-World Use Case

Large teams maintain HTML templates separately from logic.

### React Comparison

Template ≈ JSX return block.

---

## Decorators

### Definition

`@Component`, `@Injectable`, `@Input` — metadata that tells Angular **how to treat** a class.

### Why We Use It

Declarative configuration without manual registration everywhere.

### Used In This Project

`@Component` on all components; `@Injectable` on services; `@Input` / `@Output` on `button`, `todo-item`; `@Pipe`, `@Directive`.

### Small Example

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {}
```

### Real-World Use Case

Framework reads decorators to build DI graph and compile templates.

### React Comparison

No decorators in plain React; Angular uses them heavily (TypeScript feature).

---

## Modules vs Standalone

### Definition

**NgModule** bundles declarations/imports; **standalone** components import dependencies directly.

### Why We Use It

This project uses **standalone only** — simpler mental model for learners.

### Used In This Project

No `app.module.ts`; `app.config.ts` + `provideRouter()` bootstrap the app.

### Small Example

```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)],
};
```

### Real-World Use Case

Legacy apps still use modules; greenfield apps prefer standalone.

### React Comparison

NgModule ≈ old “wrap app in providers module”; standalone ≈ modern direct imports.

---

## TypeScript in Angular

### Definition

Typed classes, interfaces, and generics for safer code.

### Why We Use It

Catch errors at compile time; better IDE support.

### Used In This Project

`user.model.ts`, `todo.model.ts`, typed `FormControl<string>`, service return types.

### Small Example

```typescript
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}
```

### Real-World Use Case

API contracts, form models, and DTOs are always typed in production apps.

### React Comparison

Same as using TypeScript with React props/interfaces.

---

## Interpolation

### Definition

Display component data in the template with `{{ }}`.

### Why We Use It

Bind dynamic text to the DOM.

### Used In This Project

`navbar.component.html` — `Hi, {{ user.name }}`; `button.component.html` — `{{ label() }}`.

### Small Example

```html
<p>{{ user.email }}</p>
```

### Real-World Use Case

Show user name, prices, status labels.

### React Comparison

`{{ name }}` ≈ `{name}` in JSX.

---

## Property Binding

### Definition

Set DOM/component properties with `[property]="expression"`.

### Why We Use It

Pass values to elements and child components one-way.

### Used In This Project

`[formControl]="control()"`, `[todo]="todo"`, `[disabled]="disabled()"`, `[checked]="todo().completed"`.

### Small Example

```html
<app-input [control]="form.controls.email" />
```

### Real-World Use Case

Pass config into reusable inputs, tables, charts.

### React Comparison

`[value]="x"` ≈ `value={x}`.

---

## Event Binding

### Definition

Listen to DOM events with `(event)="handler()"`.

### Why We Use It

React to clicks, submit, input changes.

### Used In This Project

`(ngSubmit)="onSubmit()"`, `(click)="onClick()"`, `(change)="toggle.emit(id)"`.

### Small Example

```html
<form (ngSubmit)="onSubmit()">
```

### Real-World Use Case

Buttons, form submit, keyboard handlers.

### React Comparison

`(click)="save()"` ≈ `onClick={save}`.

---

## Two-way Binding

### Definition

Sync model ↔ view (often `[(ngModel)]` or reactive forms value streams).

### Why We Use It

Forms and inputs stay in sync with state.

### Used In This Project

**Reactive Forms** (preferred here): `formControlName="title"`, `valueChanges` on search — not `ngModel`, but same idea (model drives input).

### Small Example

```html
<input formControlName="search" />
```

```typescript
this.searchForm.controls.search.valueChanges.subscribe((term) => this.todos.setSearch(term));
```

### Real-World Use Case

Search boxes, filters, settings panels.

### React Comparison

Controlled inputs: `value={state}` + `onChange` ≈ FormControl value + valueChanges.

---

## Structural Directives

### Definition

Change **DOM structure** (add/remove/repeat elements). In modern Angular: `@if`, `@for` (control flow).

### Why We Use It

Conditional UI and lists without manual DOM APIs.

### Used In This Project

`@if (loading())`, `@for (todo of vm.todos; track todo.id)`, `@if (currentUser$ | async; as user)`.

### Small Example

```html
@for (msg of messages$ | async; track msg.id) {
  <div class="toast">{{ msg.text }}</div>
}
```

### Real-World Use Case

Lists, empty states, permission-based sections.

### React Comparison

`@if` ≈ `{cond && <X />}`; `@for` ≈ `.map()`.

---

## Attribute Directives

### Definition

Change **appearance or behavior** of an existing element.

### Why We Use It

Reusable DOM behavior without a full component.

### Used In This Project

`HighlightDirective` — `highlight.directive.ts` on todo titles.

### Small Example

```html
<span [appHighlight]="todo().title" [searchTerm]="searchTerm()"></span>
```

### Real-World Use Case

Tooltips, permissions (`*appHasRole`), autofocus, highlight search hits.

### React Comparison

Custom directive ≈ wrapper component or ref + `useEffect` hook.

---

## ngIf / ngFor (Legacy)

### Definition

Older structural directives: `*ngIf`, `*ngFor`. Still common in older codebases.

### Why We Use It

Same as `@if` / `@for`; know them for interviews and legacy apps.

### Used In This Project

This project uses **new control flow** (`@if`, `@for`), not `*ngIf` / `*ngFor`.

### Small Example

```html
<!-- Legacy -->
<li *ngFor="let item of items">{{ item }}</li>

<!-- This project -->
@for (item of items; track item.id) { <li>{{ item }}</li> }
```

### Real-World Use Case

Millions of apps still use `*ngFor`; migration to `@for` is ongoing.

### React Comparison

`*ngFor` ≈ `.map()` with `key`.

---

## Custom Directive

### Definition

Your own attribute directive with a selector like `[appHighlight]`.

### Why We Use It

Encapsulate DOM manipulation (highlight search text).

### Used In This Project

`shared/directives/highlight.directive.ts` — wraps matching search term in `<mark>`.

### Small Example

```typescript
@Directive({ selector: '[appHighlight]', standalone: true })
export class HighlightDirective implements OnChanges { /* ... */ }
```

### Real-World Use Case

Highlight search in tables, validate credit card format on input.

### React Comparison

Often a small hook + component instead of a directive.

---

## Built-in Pipes

### Definition

Transform displayed values in the template (`date`, `currency`, `async`, etc.).

### Why We Use It

Formatting without cluttering the component class.

### Used In This Project

`async` pipe — `currentUser$ | async`, `messages$ | async`, `viewModel$ | async`.

### Small Example

```html
@if (stats$ | async; as stats) {
  <span>{{ stats.active }} active</span>
}
```

### Real-World Use Case

Dates in tables, currency, unwrap Observables in templates.

### React Comparison

`async` pipe ≈ subscribing in component or libraries like `useObservable`; format in JSX with helpers.

---

## Custom Pipes

### Definition

Your own `transform()` for template data.

### Why We Use It

Reusable filter/format logic in the view layer.

### Used In This Project

`shared/pipes/task-filter.pipe.ts` — filters todos by status + search.

### Small Example

```html
@for (todo of vm.todos | taskFilter: vm.filter : vm.search; track todo.id) { }
```

### Real-World Use Case

Filter lists, format status badges, truncate text.

### React Comparison

Pipe ≈ pure function used in render: `filterTodos(todos, filter)`.

---

## Pipe Transform

### Definition

The `transform(value, ...args)` method that returns the displayed value.

### Why We Use It

Single place for filter rules used in multiple templates.

### Used In This Project

`TaskFilterPipe.transform(todos, filter, search)`.

### Small Example

```typescript
transform(todos: Todo[], filter: TodoFilter, search = ''): Todo[] {
  return todos.filter(/* ... */);
}
```

### Real-World Use Case

Consistent list filtering across pages.

### React Comparison

Same as a util function called from JSX.

---

## Angular Router

### Definition

Client-side navigation between views without full page reload.

### Why We Use It

SPA experience: login → todos, back button, deep links.

### Used In This Project

`@angular/router`, `app.routes.ts`, `RouterLink`, `router.navigate()`.

### Small Example

```typescript
void this.router.navigate(['/todos']);
```

### Real-World Use Case

Dashboards, multi-step flows, role-based menus.

### React Comparison

Angular Router ≈ React Router (`Routes`, `Navigate`, `Link`).

---

## Route Configuration

### Definition

Array of `Routes` mapping **paths** to **components** and options (guards, children).

### Why We Use It

Central map of all URLs in the app.

### Used In This Project

`app.routes.ts` — redirects, layouts, lazy children, guards.

### Small Example

```typescript
{ path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) }
```

### Real-World Use Case

Admin vs user routes, nested settings tabs.

### React Comparison

`routes` array in React Router v6.

---

## Route Navigation

### Definition

Moving between routes programmatically or via links.

### Why We Use It

After login, logout, or button clicks.

### Used In This Project

`Router.navigate` in `auth.service.ts`; `routerLink` in login/register footers and navbar.

### Small Example

```html
<a routerLink="/register">Create one</a>
```

### Real-World Use Case

Post-login redirect, “cancel” back to list.

### React Comparison

`<Link to="/register">` / `useNavigate()`.

---

## Router Outlet

### Definition

Placeholder where the **active route’s component** is rendered.

### Why We Use It

Layout stays fixed; child route content swaps.

### Used In This Project

`app.component.html`, `main-layout.component.html`, `auth-layout.component.html`.

### Small Example

```html
<app-navbar />
<router-outlet />
```

### Real-World Use Case

Shell with sidebar + changing main content.

### React Comparison

`<Outlet />` in React Router.

---

## Lazy Loading Basics

### Definition

Load feature code **only when** the user visits that route.

### Why We Use It

Smaller initial bundle, faster first paint.

### Used In This Project

`loadComponent: () => import('...')` in `app.routes.ts` for login, register, todos, layouts.

### Small Example

```typescript
loadComponent: () => import('./features/todos/pages/todos-page/todos-page.component')
  .then(m => m.TodosPageComponent)
```

### Real-World Use Case

Huge apps lazy-load admin, reporting, settings modules.

### React Comparison

`React.lazy(() => import('./Todos'))` + `Suspense`.

---

## Auth Guard

### Definition

Logic that **allows or blocks** navigation to a route (e.g. must be logged in).

### Why We Use It

Protect `/todos` from guests; keep logged-in users off login page.

### Used In This Project

`core/guards/auth.guard.ts`, `guest.guard.ts` on route groups in `app.routes.ts`.

### Small Example

```typescript
export const authGuard: CanActivateFn = () =>
  auth.isAuthenticated$.pipe(
    take(1),
    map(isAuth => isAuth ? true : router.createUrlTree(['/login'])),
  );
```

### Real-World Use Case

Role-based access (admin, billing), feature flags.

### React Comparison

Route wrapper: `if (!user) return <Navigate to="/login" />`.

---

## canActivate

### Definition

Route hook (functional guard in modern Angular) run **before** activating a route.

### Why We Use It

Redirect unauthorized users before the component loads.

### Used In This Project

`canActivate: [authGuard]` on main layout; `canActivate: [guestGuard]` on auth layout.

### Small Example

```typescript
{ path: 'todos', canActivate: [authGuard], loadComponent: () => /* ... */ }
```

### Real-World Use Case

Check JWT, permissions, onboarding completion.

### React Comparison

Loader/guard in route config or parent layout effect.

---

## Service Layer

### Definition

Classes that hold **business logic**, API calls, and shared state — not UI.

### Why We Use It

Keep components thin; reuse logic across routes.

### Used In This Project

`AuthService`, `TodoService`, `StorageService`, `ToastService`.

### Small Example

```typescript
@Injectable({ providedIn: 'root' })
export class TodoService {
  addTask(title: string) { /* ... */ }
}
```

### Real-World Use Case

One `UserService` used by profile, settings, and header.

### React Comparison

Service ≈ module with functions + Context/hook for state.

---

## Dependency Injection

### Definition

Angular **creates and injects** dependencies into constructors / `inject()`.

### Why We Use It

No manual `new AuthService()`; easy testing with mocks.

### Used In This Project

`inject(AuthService)` in components/guards; constructor injection in services.

### Small Example

```typescript
private readonly auth = inject(AuthService);
```

### Real-World Use Case

Swap `HttpClient` mock in tests; inject config tokens per environment.

### React Comparison

DI ≈ passing deps explicitly or via Context; Angular DI is framework-native.

---

## Singleton Services

### Definition

One shared instance for the whole app (`providedIn: 'root'`).

### Why We Use It

Single source of truth for auth, todos, toasts.

### Used In This Project

All core/feature services use `providedIn: 'root'`.

### Small Example

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {}
```

### Real-World Use Case

Global cache, session, websocket connection manager.

### React Comparison

Singleton service ≈ one React Context at app root.

---

## Observable

### Definition

RxJS stream that emits **zero or more values** over time (async data).

### Why We Use It

Model async auth state, filtered lists, combined streams.

### Used In This Project

`currentUser$`, `todos$`, `filteredTodos$`, `combineLatest` in `todo.service.ts`.

### Small Example

```typescript
readonly isAuthenticated$ = this.currentUser$.pipe(map(user => !!user));
```

### Real-World Use Case

HTTP responses, websockets, search debounce.

### React Comparison

Observable ≈ async iterable; often replaced in React by promises + state or libraries.

---

## Subject

### Definition

Observable that can **emit new values manually** (`next()`).

### Why We Use It

Push updates from services to subscribers.

### Used In This Project

BehaviorSubject (subtype) used instead of plain Subject for initial value.

### Small Example

```typescript
private readonly filterSubject = new BehaviorSubject<TodoFilter>('all');
this.filterSubject.next('active');
```

### Real-World Use Case

Event buses, multicasting UI events inside a service.

### React Comparison

Subject ≈ event emitter + subscribers; React uses `setState` / dispatch.

---

## BehaviorSubject

### Definition

Subject that stores the **latest value** and gives it immediately to new subscribers.

### Why We Use It

Components need current user/todos on subscribe, not only future changes.

### Used In This Project

`AuthService` — `currentUserSubject`; `TodoService` — `todosSubject`, `filterSubject`, `searchSubject`.

### Small Example

```typescript
private readonly currentUserSubject = new BehaviorSubject<UserPublic | null>(this.loadCurrentUser());
readonly currentUser$ = this.currentUserSubject.asObservable();
```

### Real-World Use Case

Shopping cart count, online status, theme preference.

### React Comparison

BehaviorSubject ≈ **Context + useState** with immediate read for new consumers.

---

## Subscription

### Definition

Listening to an Observable until it completes or you **unsubscribe**.

### Why We Use It

React to stream emissions in classes (e.g. reload todos when user changes).

### Used In This Project

`TodoService` constructor: `this.auth.currentUser$.subscribe(user => ...)`. Templates often use `async` pipe (auto-unsubscribe).

### Small Example

```typescript
this.auth.currentUser$.subscribe(user => user ? this.loadTodos(user.email) : this.todosSubject.next([]));
```

### Real-World Use Case

Always unsubscribe in `ngOnDestroy` for manual subs (avoid memory leaks).

### React Comparison

Subscription ≈ effect cleanup: `return () => unsub()` in `useEffect`.

---

## Reactive Forms

### Definition

Form model built in TypeScript (`FormGroup` / `FormControl`), not mainly in the template.

### Why We Use It

Complex validation, dynamic fields, testable form logic.

### Used In This Project

Login, register, todo-form, search in `todo-filters`.

### Small Example

```typescript
readonly form = this.fb.nonNullable.group({
  email: ['', [Validators.required, Validators.email]],
});
```

### Real-World Use Case

Multi-step wizards, cross-field validation, dynamic rows.

### React Comparison

Reactive forms ≈ **Formik / React Hook Form** (schema in code).

---

## FormGroup

### Definition

Object that groups multiple `FormControl`s (whole form).

### Why We Use It

Submit and validate the form as one unit.

### Used In This Project

`login.component.ts`, `register.component.ts`, `todo-form`, `searchForm` in filters.

### Small Example

```html
<form [formGroup]="form" (ngSubmit)="onSubmit()">
```

### Real-World Use Case

Registration, checkout, settings pages.

### React Comparison

FormGroup ≈ Formik `values` object + handlers.

---

## FormControl

### Definition

Tracks value, validity, and touched state for **one** field.

### Why We Use It

Wire inputs to validation and error messages.

### Used In This Project

`app-input` takes `FormControl<string>`; `form.controls.email`.

### Small Example

```typescript
form.controls.title.markAllAsTouched();
```

### Real-World Use Case

Single field with async validators (username available).

### React Comparison

FormControl ≈ one controlled field in Hook Form `register('email')`.

---

## Validators

### Definition

Built-in rules: `required`, `email`, `minLength`, etc.

### Why We Use It

Block invalid submits; show errors in UI.

### Used In This Project

Login/register/todo-form validators; `input.component` maps errors to messages.

### Small Example

```typescript
password: ['', [Validators.required, Validators.minLength(6)]]
```

### Real-World Use Case

Email format, password strength, required legal checkbox.

### React Comparison

Same as Yup/Zod/schema validators in React forms.

---

## Custom Validators

### Definition

Your own function returning validation errors or `null`.

### Why We Use It

Rules Angular doesn’t ship with (password match).

### Used In This Project

`core/validators/password-match.validator.ts` on register `FormGroup`.

### Small Example

```typescript
{ validators: passwordMatchValidator() }
```

### Real-World Use Case

Confirm password, date range, dependent dropdowns.

### React Comparison

Custom validator ≈ `.refine()` in Zod or custom Yup test.

---

## @Input

### Definition

Pass data **from parent to child** component.

### Why We Use It

Reusable children configured by parent (label, todo, control).

### Used In This Project

`button` — `label`, `variant`; `input` — `control`, `label`; `todo-item` — `todo`, `searchTerm`.

### Small Example

```typescript
readonly label = input.required<string>();
```

```html
<app-button [label]="'Add'" />
```

### Real-World Use Case

Table cell, card, shared input props.

### React Comparison

`@Input()` / `input()` ≈ **props**.

---

## @Output

### Definition

Child emits events **to parent** (custom events).

### Why We Use It

Child triggers parent logic without knowing parent implementation.

### Used In This Project

`button` — `clicked`; `todo-item` — `toggle`, `remove`.

### Small Example

```typescript
readonly toggle = output<string>();
```

```html
<app-todo-item (toggle)="onToggle($event)" />
```

### Real-World Use Case

`onSave`, `onDelete`, `onSelect` from dumb components.

### React Comparison

`@Output()` ≈ **callback props** (`onToggle={fn}`).

---

## EventEmitter

### Definition

Class used with `@Output()` to emit events (implementation detail of outputs).

### Why We Use It

Type-safe parent-child communication.

### Used In This Project

Modern code uses `output()` signal API; same role as EventEmitter.

### Small Example

```typescript
readonly clicked = output<void>();
```

### Real-World Use Case

Form child notifies parent “submitted” or “cancelled”.

### React Comparison

`emit()` ≈ calling `props.onClick()`.

---

## ngOnInit

### Definition

Lifecycle hook run **once after** first inputs are set — good for setup logic.

### Why We Use It

Initialize data when component loads (if not using constructor/subscribe in service).

### Used In This Project

`HighlightDirective` uses `ngOnChanges` instead; many components use constructor/`inject` + streams. Know `ngOnInit` for interviews and future init logic.

### Small Example

```typescript
ngOnInit(): void {
  this.loadData();
}
```

### Real-World Use Case

Fetch route params, start timers, patch form defaults.

### React Comparison

`ngOnInit` ≈ `useEffect(() => {}, [])` (mount-only, with caveats).

---

## ngOnDestroy

### Definition

Hook run when component is **destroyed** — cleanup subscriptions/timers.

### Why We Use It

Prevent memory leaks from manual `subscribe()`.

### Used In This Project

Prefer `async` pipe in templates (auto cleanup). Use `ngOnDestroy` when you add manual subscriptions in components.

### Small Example

```typescript
private sub?: Subscription;
ngOnDestroy(): void { this.sub?.unsubscribe(); }
```

### Real-World Use Case

Unsubscribe WebSocket, clear `setInterval`, cancel HTTP.

### React Comparison

`ngOnDestroy` ≈ `useEffect` **cleanup return**.

---

## Service-Based State Management

### Definition

Shared app state lives in **services** + RxJS, not only in components.

### Why We Use It

Same auth/todos state on every route without prop drilling.

### Used In This Project

`AuthService` + `TodoService` + `ToastService`.

### Small Example

```typescript
this.todos.addTask(title); // all subscribers see updated list
```

### Real-World Use Case

Medium apps before NgRx; cache + sync across features.

### React Comparison

Service state ≈ **Context + custom hooks** or Zustand/Redux.

---

## Auth State Handling

### Definition

Track logged-in user and expose it to guards and UI.

### Why We Use It

Drive navbar, protect routes, load user-specific todos.

### Used In This Project

`AuthService` — `BehaviorSubject`, `currentUser$`, `login` / `logout` / `register`, `localStorage` key `currentUser`.

### Small Example

```typescript
this.currentUserSubject.next(user);
```

### Real-World Use Case

JWT in memory + refresh token; SSO session.

### React Comparison

Auth state ≈ `AuthContext` + `useAuth()` hook.

---

## Feature-Based Architecture

### Definition

Organize code by **business feature** (auth, todos), not by file type only.

### Why We Use It

Easier to find, scale, and lazy-load features.

### Used In This Project

`features/auth/`, `features/todos/` with pages, components, services per feature.

### Small Example

```text
features/todos/
  pages/todos-page/
  components/todo-list/
  services/todo.service.ts
```

### Real-World Use Case

Teams own `features/billing/` end-to-end.

### React Comparison

Same folder-by-feature idea in React monorepos.

---

## Shared Components

### Definition

Reusable UI with **no feature-specific** business rules.

### Why We Use It

Consistent design; DRY buttons/inputs/toasts.

### Used In This Project

`shared/components/` — button, input, navbar, loader, toast.

### Small Example

```html
<app-input label="Email" [control]="form.controls.email" />
```

### Real-World Use Case

Company UI kit shared across 10+ apps.

### React Comparison

Shared folder ≈ `@company/ui` package or `components/ui/`.

---

## Core Folder

### Definition

App-wide singletons: auth, guards, models, global validators.

### Why We Use It

One place for infrastructure used everywhere.

### Used In This Project

`core/services/`, `core/guards/`, `core/models/`, `core/validators/`.

### Small Example

```typescript
import { authGuard } from './core/guards/auth.guard';
```

### Real-World Use Case

HTTP interceptors, logging, error handler, auth in `core/`.

### React Comparison

`core/` ≈ `lib/`, `services/`, `api/` at app root.

---

## Shared Folder

### Definition

Reusable UI utilities: components, pipes, directives.

### Why We Use It

Imported by many features without coupling to one domain.

### Used In This Project

`shared/components/`, `shared/pipes/task-filter.pipe.ts`, `shared/directives/highlight.directive.ts`.

### Real-World Use Case

Pipes, modals, tables used in auth and todos alike.

### React Comparison

`shared/` ≈ `components/common/`.

---

## Separation of Concerns

### Definition

UI in components, logic in services, types in models, routing in guards/routes.

### Why We Use It

Change storage or API without rewriting templates.

### Used In This Project

`TodoService` CRUD + storage; `TodoItemComponent` only displays and emits events.

### Small Example

```text
Component → calls TodoService → StorageService → localStorage
```

### Real-World Use Case

Swap localStorage for REST API in service only.

### React Comparison

Container/presentational split or hooks vs UI components.

---

## Login Flow

### Definition

User submits credentials → service validates → session stored → redirect to app.

### Why We Use It

Gate access to todos.

### Used In This Project

`login.component.ts` → `AuthService.login()` → `setSession()` → `router.navigate(['/todos'])`.

### Small Example

```typescript
const result = this.auth.login(this.form.getRawValue());
if (result.success) void this.router.navigate(['/todos']);
```

### Real-World Use Case

OAuth, MFA, remember-me, lockout after N failures.

### React Comparison

Same flow with `login()` API + `navigate('/todos')`.

---

## Session Persistence

### Definition

Keep user logged in after **page refresh**.

### Why We Use It

Better UX; no login on every reload.

### Used In This Project

`StorageService` writes `currentUser` to `localStorage`; `AuthService` loads on startup into `BehaviorSubject`.

### Small Example

```typescript
this.storage.setItem(STORAGE_KEYS.currentUser, user);
```

### Real-World Use Case

httpOnly cookies + refresh tokens in production (not plain localStorage for tokens).

### React Comparison

`localStorage` + Context hydrate on mount.

---

## LocalStorage Auth

### Definition

Browser `localStorage` stores users list and current session (demo only).

### Why We Use It

No backend required for learning project.

### Used In This Project

Keys: `users`, `currentUser`, `tasks-{email}` via `storage-keys.ts`.

### Small Example

```typescript
tasksKey(email: string): string {
  return `tasks-${email}`;
}
```

### Real-World Use Case

Prototypes; production uses API + secure cookies.

### React Comparison

Same `localStorage` pattern; never store plain passwords in real apps.

---

## Protected Routes

### Definition

Routes only reachable when authenticated (or with permission).

### Why We Use It

Hide todos from anonymous users.

### Used In This Project

`/todos` under `authGuard`; guest routes under `guestGuard`.

### Small Example

```typescript
canActivate: [authGuard]
```

### Real-World Use Case

Admin panels, paid features, account settings.

### React Comparison

Protected route component checking `user` before render.

---

## User-Specific Data

### Definition

Each user sees **only their** todos (isolated by user id/email).

### Why We Use It

Multi-user app simulation on one browser.

### Used In This Project

`tasks-{email}` key; `TodoService` loads when `currentUser$` changes.

### Small Example

```typescript
this.storage.setItem(tasksKey(user.email), todos);
```

### Real-World Use Case

Tenant id / user id on every API request.

### React Comparison

Fetch `/api/todos` with JWT `sub` claim — server filters rows.

---

## Service Abstraction

### Definition

Components don’t touch `localStorage` directly — go through `TodoService` / `StorageService`.

### Why We Use It

Swap persistence later without touching UI.

### Used In This Project

`todo-form` calls `TodoService.addTask()`, not `localStorage`.

### Small Example

```typescript
addTask(title: string): void {
  this.updateTodos([todo, ...this.todosSubject.value]);
}
```

### Real-World Use Case

Repository pattern over REST, GraphQL, or IndexedDB.

### React Comparison

Custom hook `useTodos()` hiding fetch logic.

---

## CRUD Operations

### Definition

**C**reate, **R**ead, **U**pdate, **D**elete data.

### Why We Use It

Full todo management lifecycle.

### Used In This Project

| Op | Method |
|----|--------|
| Create | `addTask()` |
| Read | `loadTodos()` / `todos$` |
| Update | `toggleComplete()` |
| Delete | `deleteTask()` / `clearCompleted()` |

### Small Example

```typescript
deleteTask(id: string): void {
  this.updateTodos(this.todosSubject.value.filter(t => t.id !== id));
}
```

### Real-World Use Case

REST: POST, GET, PATCH, DELETE on `/todos/:id`.

### React Comparison

Same CRUD; often via React Query mutations.

---

## Lazy Loading (Performance)

### Definition

(See **Lazy Loading Basics**.) Split bundles per route.

### Why We Use It

Faster initial load for production.

### Used In This Project

All feature routes use `loadComponent`.

### Small Example

See `app.routes.ts` lazy imports.

### Real-World Use Case

E-commerce: checkout chunk loads only at checkout.

### React Comparison

`import()` + code splitting.

---

## Reusable Components

### Definition

Parameterized UI building blocks used many times.

### Why We Use It

One button/input style across auth and todos.

### Used In This Project

`app-button`, `app-input` used in login, register, todo-item.

### Real-World Use Case

Design system: one `Button` variant API.

### React Comparison

`<Button variant="primary" />` shared package.

---

## Smart vs Dumb Components

### Definition

- **Smart (container):** inject services, hold logic, pass data down  
- **Dumb (presentational):** `@Input` / `@Output` only, no services

### Why We Use It

Testable UI; reusable presentational pieces.

### Used In This Project

| Smart | Dumb |
|-------|------|
| `login`, `todos-page`, `todo-list` | `button`, `input`, `todo-item` |

### Small Example

```typescript
// Dumb — todo-item: no TodoService inject
readonly todo = input.required<Todo>();
readonly remove = output<string>();
```

### Real-World Use Case

Storybook documents dumb components in isolation.

### React Comparison

Container component + pure UI child.

---

## Strict Typing

### Definition

TypeScript `strict` mode + explicit interfaces on models and APIs.

### Why We Use It

Fewer runtime bugs; better refactor safety.

### Used In This Project

`User`, `Todo`, `TodoFilter`, typed forms, service return `{ success: boolean; message: string }`.

### Small Example

```typescript
export type TodoFilter = 'all' | 'active' | 'completed';
```

### Real-World Use Case

API types generated from OpenAPI/Swagger.

### React Comparison

Same as `strict` TypeScript in React.

---

## Interfaces

### Definition

TypeScript contracts describing object shape (no runtime code).

### Why We Use It

Document models; reuse across services and components.

### Used In This Project

`core/models/user.model.ts`, `todo.model.ts`.

### Small Example

```typescript
export interface UserPublic {
  id: string;
  name: string;
  email: string;
}
```

### Real-World Use Case

DTOs shared between frontend and backend teams.

### React Comparison

`interface User { ... }` — identical idea.

---

# Angular vs React — Quick Tables

## State

| Topic | Angular (this project) | React |
|-------|------------------------|-------|
| Local UI state | `signal()` e.g. `loading()` | `useState` |
| Shared state | `BehaviorSubject` in services | Context + `useState` / Zustand |
| Template read | `async` pipe or `()` on signals | JSX `{state}` |

## Communication

| Angular | React |
|---------|-------|
| `@Input()` / `input()` | props |
| `@Output()` / `output()` | callback props |
| Service + DI | Context + custom hooks |

## Async & Lifecycle

| Angular | React |
|---------|-------|
| `Observable` + RxJS | Promises, `useEffect` |
| `ngOnInit` | `useEffect(..., [])` |
| `ngOnDestroy` | cleanup in `useEffect` |
| `async` pipe | manual subscribe or hooks |

## Routing & Forms

| Angular | React |
|---------|-------|
| `Router`, `routerLink`, guards | React Router, loaders |
| Reactive `FormGroup` | React Hook Form / Formik |
| `loadComponent` lazy routes | `React.lazy` |

---

# File Cheat Sheet (This Project)

| Concept | Go-to file |
|---------|------------|
| Routes + lazy load | `app.routes.ts` |
| Auth state | `core/services/auth.service.ts` |
| Todo CRUD | `features/todos/services/todo.service.ts` |
| Guards | `core/guards/auth.guard.ts`, `guest.guard.ts` |
| Reactive forms | `features/auth/login/login.component.ts` |
| Custom validator | `core/validators/password-match.validator.ts` |
| Custom pipe | `shared/pipes/task-filter.pipe.ts` |
| Custom directive | `shared/directives/highlight.directive.ts` |
| Dumb UI | `shared/components/button/button.component.ts` |
| Storage keys | `core/models/storage-keys.ts` |

---

# 5-Minute Revision Checklist

- [ ] Standalone component + `imports` array  
- [ ] `@if` / `@for` and `async` pipe  
- [ ] `FormGroup` + `Validators` + custom validator  
- [ ] `providedIn: 'root'` service + `inject()`  
- [ ] `BehaviorSubject` + `.next()` + `asObservable()`  
- [ ] `authGuard` + `canActivate` + `loadComponent`  
- [ ] `@Input` / `@Output` on dumb components  
- [ ] Feature / core / shared folder roles  
- [ ] User todos keyed by `tasks-{email}`  

---

*Built for the Task Manager Angular project — use with `PROJECT_NOTES.md` for architecture flows.*
