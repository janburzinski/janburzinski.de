# janburzinski.de

small little personal site

The protected Vercel sync endpoint supports read-only preflight checks. `GET /api/sync?dry=1`
compares the incremental window, while `GET /api/sync?full=1&dry=1` reconciles every Autumn event
against the stored daily rollups. Both require `Authorization: Bearer <CRON_SECRET>`.
