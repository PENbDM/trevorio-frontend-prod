# Trevor Analytics Frontend

Frontend for the Trevor.io-style analytics application.

## Development

```bash
npm install
npm run dev
```

Frontend: `http://localhost:3000`

The current Axios client expects the Django API at:

```text
http://127.0.0.1:8000
```

## Useful commands

```bash
npm run dev
npm run lint
npm run build
npx tsc --noEmit
```

## Documentation

- `docs/FRONTEND_ONBOARDING.md` — complete developer onboarding and file/service responsibilities.
- `docs/QUERY_FLOW.md` — concise visual builder/raw SQL/background-job flow.
- `ARCHITECTURE.md` — high-level layer and dependency rules.

## Main architecture

```text
app -> widgets -> features/entities -> shared -> Django API
```

The datasource workspace uses one shared result surface for visual queries and raw SQL. Query input lives in the left builder; completed query output is owned by `DatasourceWorkspace` and rendered by `QueryResults` in the right panel.
