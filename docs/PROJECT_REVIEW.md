# Project Review — 2026-10-03

## Fixed in this review

### 1. Raw SQL results rendered in the wrong layout area

Cause: raw SQL output state lived inside `StartFromStep`, which is mounted inside the fixed 380px query-builder sidebar.

Fix: query output is now published upward and stored as `activeResult` in `DatasourceWorkspace`. The shared `QueryResults` component renders it in the flexible right-hand area.

### 2. Immediate raw SQL responses were lost

Cause: the raw SQL success callback handled queued jobs, but for an immediate response it only changed status to `completed`; it did not save/publish the response.

Fix: immediate `RunQueryResponse` is now stored locally for summary information and passed to `onQueryResult()`.

### 3. Background SQL and immediate SQL used different output ownership

Fix: both now converge on the same callback and the same `activeResult`.

### 4. Missing `SqlResultTable` module reference

`StartFromStep` imported `./SqlResultTable`, but that file was not present in the archive. The duplicate result-table path has been removed; `widgets/query-results/QueryResults.tsx` is the single result renderer.

### 5. QueryBuilder contract and usage were inconsistent

`QueryBuilder` required `onQueryResult`, but `DatasourceWorkspace` did not supply it. This was corrected.

### 6. Result type did not match result renderer

`QueryResults` reads optional table metadata, while the current result type did not describe it. `RunQueryResponse` now includes optional `table` metadata so both visual-table and raw-SQL results can use the same component.

### 7. Duplicate application sidebar ownership

The datasource route layout already renders `AppSidebar`. `DatasourceWorkspace` also rendered it, creating duplicate layout responsibility. The workspace copy was removed.

### 8. QueryBuilder depended directly on route params

The widget previously called `useParams()` to discover the datasource id. It now receives `datasourceId` from its parent, making ownership explicit and the widget easier to reuse/test.

### 9. Deep imports crossed feature boundaries

`StartFromStep` imported internal files from `features/query-run`. The feature public `index.ts` now exports the raw query hook, task status function, and associated types, and the widget imports from `@/features/query-run`.

## Validation performed

Passed:

```text
TypeScript: tsc --noEmit
ESLint: app entities features shared widgets
```

A full `next build` could not finish in this review environment because Next attempted to download the Linux SWC binary and outbound package-registry access was unavailable. The failure occurred before application compilation, not because of a source-code error.

## Remaining engineering work

- Move API base URL to environment configuration.
- Implement JWT refresh-token flow instead of only clearing tokens on 401.
- Extract background-query polling to a reusable hook or replace polling with WebSocket/SSE notifications.
- Connect GitHub import UI to real GitHub data and reuse the raw SQL execution pipeline.
- Implement CSV source.
- Implement saved-query persistence.
- Improve normalized API error handling and surface backend validation messages.
- Consider virtualization/pagination for large result sets on the frontend.
