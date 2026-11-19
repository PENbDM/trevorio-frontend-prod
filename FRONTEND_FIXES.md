# Trevor.io frontend integration fixes

## Changes
- Connected Browse Pages and Latest Rows modes to `/api/queries/run/` and `/api/queries/run/latest/`, respectively.
- Fixed raw SQL pagination so Next/Previous re-runs the same SQL through `/api/queries/run/raw/` with `page` and `page_size`.
- Enabled Refresh Results for table and raw SQL results.
- Added background query task resolution for table queries and raw SQL pagination (initial raw SQL task polling remains in StartFromStep).
- Removed the temporary yellow debug banner in QueryResults.
- Preserved the raw SQL editor and its task status display.

## Behavior and limitations
- Browse/Latest controls are for table queries; the backend's `/run/latest/` endpoint cannot accept raw SQL payloads.
- For latest raw SQL results, write `ORDER BY your_timestamp_or_primary_key DESC` in the SQL editor. Pagination and refresh then preserve that SQL.
- The server should use read-only query permissions for connected customer databases.
- The backend must implement both endpoints and return its documented pagination response.
- Heavy query task polling times out after two minutes.
- Installation and live API integration were not verified here; run `npm ci`, `npm run build`, and test with your Django backend.

## If old UI still appears
Verify that the Next.js process on port 3000 is running from THIS project folder, not another checkout. Stop it, remove `.next`, restart `npm run dev`, and hard-refresh the browser.
