# Task Manager — Project Notes

## Architecture

```
src/app/
├── core/          # Singleton services, guards, models (app-wide)
├── shared/        # Dumb reusable UI (button, input, pipes, directives)
├── features/      # auth/, todos/ — business domains
├── layout/        # Shell wrappers (navbar + outlet)
├── app.routes.ts
└── app.config.ts
```

**Core** = one instance for the whole app (`providedIn: 'root'`).  
**Features** = lazy-loaded routes keep initial bundle small.  
**Shared** = no business logic; `@Input()` / `@Output()` only.

## Routing

- `''` → redirect `todos`
- Guest layout: `/login`, `/register` + `guestGuard` (logged-in users → `/todos`)
- Main layout: `/todos` + `authGuard` (guests → `/login`)
- `loadComponent()` = lazy standalone route (like React `lazy()` + `Suspense`)

## Reactive Forms

`FormBuilder` builds `FormGroup` / `FormControl`. Validators run on value change; `markAllAsTouched()` shows errors on submit. Group validator `passwordMatchValidator` compares two fields (like a custom Yup `ref`).

## RxJS & BehaviorSubject

`BehaviorSubject` holds **current value + stream** of updates. `AuthService.currentUser$` and `TodoService.todos$` let any component subscribe (like React Context + `useState`, but without re-render tree issues — Angular change detection updates subscribers).

`combineLatest` merges filter + search + todos for the list.

## Dependency Injection

`inject(AuthService)` or constructor injection — Angular creates **one** service instance per injector. `providedIn: 'root'` = app singleton (similar to a module-level provider).

## Route Guards

`CanActivateFn` runs **before** navigation. `authGuard` checks `isAuthenticated$`; if false, returns `UrlTree` to `/login`. Prevents flashing protected pages (like a React route wrapper that redirects).

## Component Communication

| Angular | React analogy |
|---------|----------------|
| `@Input()` | props |
| `@Output()` | callback props |
| Service + Observable | Context + custom hook |
| `Router` | React Router |

## Auth Flow

1. Register/Login → `AuthService` validates against `localStorage.users`
2. Session stored in `currentUser` + `BehaviorSubject`
3. Logout clears session and navigates to login
4. Refresh: `loadCurrentUser()` restores from `localStorage`

## Todo Flow

1. `TodoService` listens to `currentUser$`
2. Tasks key: `tasks-{email}` in localStorage
3. CRUD updates subject + persists
4. Filter/search via subjects; `TaskFilterPipe` + `HighlightDirective` in the view layer

## Why BehaviorSubject?

Components need the **latest** user/tasks immediately on subscribe, not only future emissions (`Subject` would miss the initial value).

## Why Singleton Services?

Shared state (auth, todos, toast) must be consistent across routes without prop drilling.

## Extend Later

- Replace localStorage with HTTP + interceptors
- `signal()` + `toSignal()` instead of some `Observable`s
- NgRx only if global state grows complex
- Hash passwords; JWT refresh; role-based guards

## Generate components (CLI)

Angular 21 defaults to `button.ts`; use these flags for the classic four files:

```bash
ng g c button --path=src/app/shared/components/button --flat --type=component --style=scss --defaults
```

Creates: `button.component.ts`, `.html`, `.scss`, `.spec.ts`

## OpenAI Help (optional)

1. Copy `.env.example` → `.env` and set your real `OPENAI_API_KEY` (never commit `.env`)
2. Run `npm start` — starts **both** API (3001) and Angular (4200)
3. Click **Help** in the navbar after login

If Help says API not running: stop the app (Ctrl+C) and run `npm start` again.

## Run

```bash
cd angular-task-manager
npm start
```
