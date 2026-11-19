# Query Flow Reference

Use this file as the short reference when working specifically on query execution.

## Components and responsibilities

```text
DatasourceWorkspace
  owns activeResult
  owns visual-query mutation
  owns right result panel

QueryBuilder
  owns/coordinates left query controls
  forwards table selection and result callbacks

useQueryBuilder
  owns local builder UI state only

StartFromStep
  owns raw SQL editor
  sends raw SQL
  polls queued jobs
  publishes completed results upward

features/query-run
  owns query HTTP functions, hooks, and response types

QueryResults
  renders a completed RunQueryResponse
```

## Visual query

```text
TableSelector
 -> QueryBuilder.handleSelectTable
 -> DatasourceWorkspace.handleSelectTable
 -> POST /api/queries/run/
 -> activeResult
 -> QueryResults
```

## Raw SQL: light

```text
StartFromStep.handleRunSql
 -> POST /api/queries/run/raw/
 -> RunQueryResponse
 -> onQueryResult
 -> activeResult
 -> QueryResults
```

## Raw SQL: heavy

```text
StartFromStep.handleRunSql
 -> POST /api/queries/run/raw/
 -> { status: queued, task_id }
 -> poll GET /api/queries/tasks/:taskId/
 -> completed + result
 -> onQueryResult
 -> activeResult
 -> QueryResults
```

## State ownership rule

Input state stays close to the builder. Output state stays in the workspace.

```text
LEFT PANEL                          RIGHT PANEL
SQL text                            result columns
source selection     ---------->    result rows
selected table                      row count
query status                        duration
```

A full result table must never be mounted inside the fixed left query-builder panel.
