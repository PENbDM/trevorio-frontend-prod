# Trevor.io Clone Frontend — Developer Onboarding Guide

This document explains how the frontend is organized, which files own which responsibilities, how data moves through the application, and where to add new functionality without losing track of the architecture.

## 1. Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- TanStack Query for server state, caching, mutations, and invalidation
- Axios for HTTP requests
- JWT access/refresh tokens stored in `localStorage`
- Django/DRF backend at `http://127.0.0.1:8000`

## 2. Architecture at a glance

The application follows a lightweight Feature-Sliced structure:

```text
app/        routes and route-level composition
entities/   domain objects and entity data access
features/   user actions / business capabilities
widgets/    large UI areas composed from entities and features
shared/     reusable infrastructure
```

Main dependency direction:

```text
app
  -> widgets
      -> features / entities
          -> shared
```

A route should generally not contain API request logic. A widget should coordinate page sections. Features own user actions. Entities own domain data. Shared code should know nothing about Trevor-specific business concepts.

## 3. Top-level folder map

### `app/`

Next.js routing only.

| File | Responsibility |
|---|---|
| `app/layout.tsx` | Root HTML layout, fonts, metadata, provider composition. |
| `app/providers.tsx` | Creates TanStack `QueryClient` and mounts `AuthProvider`. |
| `app/page.tsx` | Public landing page; redirects authenticated users to `/datasources`. |
| `app/login/sign-in/page.tsx` | Sign-in route. |
| `app/login/sign-up/page.tsx` | Sign-up route. |
| `app/datasources/layout.tsx` | Protects all datasource routes from unauthenticated access. |
| `app/datasources/page.tsx` | Renders the datasource list widget. |
| `app/datasources/connect/page.tsx` | Renders the multi-step datasource connection flow. |
| `app/datasources/setup/[database]/page.tsx` | Renders the connection credentials form for the chosen database/provider. |
| `app/datasources/[id]/layout.tsx` | Datasource workspace shell; owns the 52px application sidebar. |
| `app/datasources/[id]/page.tsx` | Loads `DatasourceWorkspace` for the current datasource id. |
| `app/datasources/[id]/import-github/page.tsx` | GitHub SQL import UI prototype. Currently uses mock repository data. |

### `entities/datasource/`

Owns the datasource domain model and datasource API operations.

```text
entities/datasource/
  api/datasource.api.ts
  model/types.ts
  model/useDatasources.ts
  index.ts
```

`api/datasource.api.ts` contains direct HTTP functions:

- `createDatasource()`
- `getDatasources()`
- `deleteDatasource()`
- `getDatasourceSchema()`
- `syncDatasourceSchema()`

`model/useDatasources.ts` wraps those functions with TanStack Query:

- `useDatasources()` — fetch datasource list.
- `useCreateDatasource()` — create datasource then invalidate list.
- `useDeleteDatasource()` — delete datasource then invalidate list.
- `useDatasourceSchema(id)` — fetch synced tables/columns.
- `useSyncDatasourceSchema(id)` — tell backend to rescan the schema, then refresh cached schema.

`model/types.ts` contains the frontend datasource contracts: datasource connection payload, datasource metadata, table metadata, and column metadata.

### `features/auth/`

Owns authentication actions and auth session state.

Typical flow:

```text
SignInForm
  -> auth.api.ts
  -> Django /api/auth/login/
  -> tokens stored in localStorage
  -> AuthContext/useAuth exposes authentication state
```

The Axios interceptor later attaches the access token to protected API requests.

### `features/datasource-connect/`

Owns the user workflow for connecting a new database.

Important files:

- `DatasourceConnectFlow.tsx` — controls the multi-step selection flow.
- `CredentialsStep.tsx` — asks whether the user knows credentials.
- `DatabaseTypeStep.tsx` — database selection.
- `HostingProviderStep.tsx` — hosting provider selection.
- `DatabaseSetupForm.tsx` — collects host, port, DB name, username, password and creates the datasource.
- `config/datasource-options.ts` — supported database/provider options.

Currently PostgreSQL is the enabled database type.

### `features/query-run/`

Owns query execution against the backend.

```text
features/query-run/
  api/query-run.api.ts
  model/types.ts
  model/useRunQuery.ts
  index.ts
```

API functions:

- `runQuery(payload)` — runs a query built from the visual UI.
- `runRawQuery(payload)` — sends raw SQL.
- `getQueryTaskStatus(taskId)` — checks a background task.

Hooks:

- `useRunQuery()` — TanStack mutation for UI-built query execution.
- `useRunRawQuery()` — mutation for raw SQL execution.

Important response model:

```text
RunRawQueryResponse
  = immediate RunQueryResponse
  OR
  { status: "queued", task_id: string }
```

That means raw SQL has two execution paths:

```text
fast SQL
  -> backend returns rows immediately

heavy SQL
  -> backend returns task_id
  -> frontend polls task endpoint
  -> completed task returns rows
```

### `widgets/app-sidebar/`

Permanent 52px application navigation for a datasource workspace.

`app/datasources/[id]/layout.tsx` owns this widget. Child workspace components must not render a second `AppSidebar`.

### `widgets/datasource-list/`

Datasource listing page. Uses datasource entity hooks and auth user data. Handles logout and datasource selection/connection UI.

### `widgets/datasource-workspace/`

This is the main coordinator for a datasource query workspace.

It owns:

- schema loading
- schema refresh
- visual query mutation
- the currently displayed query result
- composition of the left query builder and right result panel

This is intentionally where `activeResult` lives. Query result state must be above the query-builder sidebar because all query sources eventually display in the same right-hand result area.

### `widgets/query-builder/`

Left fixed 380px query control panel.

Files:

- `QueryBuilder.tsx` — widget composition and connection to parent callbacks.
- `useQueryBuilder.ts` — local UI state for selected source, table dropdown, search, selected table.
- `QueryBuilderHeader.tsx` — builder header/start-new-query action.
- `StartFromStep.tsx` — table / SQL / CSV / saved-query source controls and raw SQL execution.
- `SourceButton.tsx` — source selector button.
- `TableSelector.tsx` — searchable schema table selector.

Important ownership rule:

```text
QueryBuilder owns query INPUT state.
DatasourceWorkspace owns query OUTPUT state.
QueryResults renders query OUTPUT.
```

Do not render a full result table inside `StartFromStep`. That file is inside a fixed 380px sidebar.

### `widgets/query-results/`

`QueryResults.tsx` renders the shared result table used for query output.

It displays:

- table/query title
- schema name when available
- row count
- duration
- column names and data types
- rows

This component should remain presentation-only. It receives a `RunQueryResponse` and does not execute queries itself.

### `shared/api/client.ts`

Single Axios instance used by entity/feature API files.

Responsibilities:

- backend base URL
- attach `Authorization: Bearer <token>` to non-public requests
- clear tokens after HTTP 401

This is infrastructure code. Business-specific endpoint functions should remain in `entities/*/api` or `features/*/api` rather than being added here.

## 4. Query execution flows

### A. Visual table query

```text
User opens /datasources/:id
  -> DatasourceWorkspace loads synced schema
  -> QueryBuilder receives tables
  -> user selects a table
  -> QueryBuilder calls onSelectTable(table)
  -> DatasourceWorkspace calls useRunQuery().mutate(...)
  -> POST /api/queries/run/
  -> backend returns RunQueryResponse
  -> DatasourceWorkspace sets activeResult
  -> QueryResults renders in the right panel
```

### B. Raw SQL — immediate execution

```text
User chooses SQL
  -> enters SQL
  -> StartFromStep calls useRunRawQuery()
  -> POST /api/queries/run/raw/
  -> backend decides query is light
  -> backend returns RunQueryResponse immediately
  -> StartFromStep calls onQueryResult(result)
  -> DatasourceWorkspace sets activeResult
  -> QueryResults renders on the right
```

### C. Raw SQL — background execution

```text
User chooses SQL
  -> POST /api/queries/run/raw/
  -> backend decides query is heavy
  -> backend returns { status: "queued", task_id }
  -> StartFromStep polls /api/queries/tasks/:taskId/
  -> queued -> running -> completed
  -> completed response contains result
  -> StartFromStep calls onQueryResult(result)
  -> DatasourceWorkspace sets activeResult
  -> QueryResults renders on the right
```

This is also the execution model the future GitHub SQL import should reuse after a `.sql` file is selected.

## 5. Why the SQL result rendering bug happened

The raw SQL implementation originally stored and rendered its result inside `StartFromStep`.

But the component hierarchy is:

```text
DatasourceWorkspace
  -> QueryBuilder (fixed 380px left sidebar)
      -> StartFromStep
```

Therefore a SQL result table created inside `StartFromStep` could only occupy the left sidebar. It could never naturally occupy the large right result panel.

There was also a functional bug in the immediate raw-query branch: when `/run/raw/` returned rows directly, the code set `queryStatus = "completed"` but did not save or publish the returned result.

The corrected ownership is:

```text
StartFromStep
  -> onQueryResult(result)

QueryBuilder
  -> forwards onQueryResult

DatasourceWorkspace
  -> setActiveResult(result)

QueryResults
  -> renders activeResult in right panel
```

Both immediate raw SQL and completed background SQL now follow this path.

## 6. Layout ownership

The datasource route layout adds the permanent app sidebar:

```text
viewport
| 52px app sidebar | remaining route content
```

Inside the workspace route:

```text
remaining route content
| 380px query builder | flexible query results |
```

Effective visual structure:

```text
| 52 app nav | 380 query builder | results consume rest of viewport |
```

Avoid adding another `ml-[52px]` or another `AppSidebar` inside `DatasourceWorkspace`, because the route layout already does that job.

## 7. Backend endpoints currently used

Auth:

```text
POST /api/auth/login/
POST /api/auth/register/
GET  /api/auth/me/
```

Datasource:

```text
GET    /api/datasources/
POST   /api/datasources/
DELETE /api/datasources/:id/
GET    /api/datasources/:id/schema/
POST   /api/datasources/:id/sync-schema/
```

Queries:

```text
POST /api/queries/run/
POST /api/queries/run/raw/
GET  /api/queries/tasks/:taskId/
```

## 8. Server state vs local UI state

Use TanStack Query for data owned by the server:

- datasource list
- datasource schema
- create/delete/sync mutations
- query execution mutations

Use React component state for temporary UI state:

- selected source tab
- search text
- SQL editor value
- query polling status
- selected table name
- currently displayed result within the workspace

Do not put server data into React state simply to duplicate TanStack Query unless the state represents a deliberate UI snapshot such as the currently displayed result.

## 9. Adding a new query source

For example, GitHub-imported SQL:

1. Obtain SQL text from the GitHub integration.
2. Keep GitHub browsing/import logic inside a GitHub feature.
3. Reuse `runRawQuery()` rather than creating another SQL execution endpoint.
4. Reuse the same background task polling path.
5. Publish the final `RunQueryResponse` to `DatasourceWorkspace`.
6. Render through `QueryResults`.

Do not build a second result-table implementation for GitHub SQL.

Conceptually:

```text
Visual builder ----\
Raw SQL ------------> common query result -> QueryResults
GitHub SQL --------/
```

## 10. Known incomplete / future areas

### GitHub import

`app/datasources/[id]/import-github/page.tsx` is currently a UI prototype with hard-coded repository/file data. It is not yet connected to GitHub OAuth/API or to the query execution flow.

### CSV source

The query builder displays CSV as a source option, but execution/import is not implemented.

### Saved queries

The saved-query source currently displays a placeholder and has no persistence/API implementation.

### API base URL

`shared/api/client.ts` hardcodes `http://127.0.0.1:8000`. Move this to an environment variable before deployment, for example `NEXT_PUBLIC_API_URL`.

### JWT refresh

The current Axios response interceptor clears tokens on 401. It does not automatically exchange the refresh token for a new access token.

### Background task polling

Raw SQL polls once per second. For production, consider a shared polling hook with cancellation/backoff or WebSocket/SSE completion notifications.

### Error messages

Some UI paths display generic errors. Backend validation/error payloads should eventually be normalized into a shared user-facing error format.

## 11. Conventions for future code

Prefer public slice imports:

```ts
import { useRunRawQuery, type RunQueryResponse } from "@/features/query-run";
import { useDatasourceSchema } from "@/entities/datasource";
```

Avoid reaching into another slice's internal folders:

```ts
// avoid
import { useRunRawQuery } from "../../../features/query-run/model/useRunQuery";
```

Keep these responsibilities separate:

```text
API function       = HTTP only
TanStack hook      = server state / mutation lifecycle
feature UI         = user action
widget             = composition / page section coordination
route              = routing and route-level composition
```

## 12. Fast onboarding path for a developer

Read these files in this order:

1. `app/providers.tsx`
2. `shared/api/client.ts`
3. `entities/datasource/model/types.ts`
4. `entities/datasource/model/useDatasources.ts`
5. `app/datasources/[id]/layout.tsx`
6. `widgets/datasource-workspace/ui/DatasourceWorkspace.tsx`
7. `widgets/query-builder/ui/QueryBuilder.tsx`
8. `widgets/query-builder/ui/StartFromStep.tsx`
9. `features/query-run/api/query-run.api.ts`
10. `features/query-run/model/types.ts`
11. `widgets/query-results/ui/QueryResults.tsx`

After those files, a developer should understand the complete datasource -> query -> result path.
