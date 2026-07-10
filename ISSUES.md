> [!NOTE]
> ## Issue #1 — Stat Card & Badge Caching
> 
> **Status:** Open
> **Opened:** 2026-06-12
> **Link:** [KayanShah/KayanShah#1](https://github.com/KayanShah/KayanShah/issues/1)
> 
> ### Problem
> Stat cards (streak stats, summary cards, activity graph, trophies, follower badges) were intermittently failing to load on both desktop and iOS. GitHub aggressively caches external images by URL — once fetched, GitHub serves the cached version even after the underlying data changes, or if a temporary fetch error occurred, it can cache that broken state.
> 
> ### Fix
> Added cache-busting query parameters (`t=DDMMYYYY` / `v=DDMMYYYY`, UK date format) to all live stat card and badge URLs:
> - `github-readme-streak-stats-kayan.vercel.app`
> - `github-profile-summary-cards-kayan.vercel.app`
> - `github-readme-activity-graphkayan.vercel.app`
> - `github-trophies.vercel.app`
> - `kayan-github-chart-api.onrender.com`
> - `gh-follower-badge.vercel.app`
> 
> ### Maintenance
> Bump the `t=`/`v=` value to the current date any time a card or badge appears stuck or stale.

---


> [!NOTE]
> **Issue #2 — committers.top Badge Showing Unranked** · [View issue](https://github.com/KayanShah/KayanShah/issues/2)
>
> **Status:** Resolved
> **Opened:** 2026-07-09
> **Closed:** 2026-07-10
> **Link:** [KayanShah/KayanShah#2](https://github.com/KayanShah/KayanShah/issues/2)
>
> ### Problem
> [`https://user-badge.committers.top/uk/KayanShah.svg`](https://user-badge.committers.top/uk/KayanShah.svg) displayed "United Kingdom unranked (public commits)" despite KayanShah appearing at **#247** on the [UK public commits list](https://committers.top/uk) as of the 2026-07-09 17:40 UTC refresh.
>
> ### Cause
> The badge data is deployed via a dedicated Cloudflare Worker on a separate daily cron at midnight UTC, independent of the rankings refresh schedule. This created a window where the ranking and badge were out of sync.
>
> ### Resolution
> Badge updated at 00:00 UTC (01:00 BST) on 2026-07-10 as expected.




