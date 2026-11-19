# Frontend Architecture

The frontend uses a lightweight Feature-Sliced structure with Next.js App Router.

```text
app/        route definitions and layouts
entities/   domain models and entity data access
features/   user-facing business actions
widgets/    large composed UI sections
shared/     reusable infrastructure
```

Dependency direction:

```text
app -> widgets -> features/entities -> shared
```

## Request flow

```text
route/widget
  -> feature/entity hook
  -> API function
  -> shared Axios client
  -> Django/DRF
```

Example query flow:

```text
app/datasources/[id]/page.tsx
  -> DatasourceWorkspace
  -> QueryBuilder / query-run feature
  -> POST /api/queries/run/ or /api/queries/run/raw/
  -> DatasourceWorkspace.activeResult
  -> QueryResults
```

## Important ownership rules

- `app/` owns routing, not business/API logic.
- `shared/api/client.ts` owns HTTP infrastructure, not endpoint-specific business logic.
- `QueryBuilder` owns input controls.
- `DatasourceWorkspace` owns the result selected for display.
- `QueryResults` only renders results.
- `app/datasources/[id]/layout.tsx` owns the 52px application sidebar.
- Use slice `index.ts` files for imports from outside a slice.

For full onboarding documentation, see `docs/FRONTEND_ONBOARDING.md`.
For query-specific flow, see `docs/QUERY_FLOW.md`.
