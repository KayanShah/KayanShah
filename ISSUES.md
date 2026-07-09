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



> [!NOTE]
> **Issue #2 — committers.top Badge Showing Unranked Despite Being Ranked** · [View issue] (https://github.com/KayanShah/KayanShah/issues/2)
>https://user-badge.committers.top/uk/KayanShah.svg
> **Status:** Open
> **Opened:** 2026-07-09
> **Link:** [KayanShah/KayanShah#2](https://github.com/KayanShah/KayanShah/issues/2)
>
> ### Problem
> Unknown, investigation in progress
>
> ### Cause
> After analysing the code, it appears that the badge data is deployed separately from the rankings via a dedicated Cloudflare Worker, updated by a daily cron at midnight UTC. The ranking refresh (17:40 UTC) and the badge deployment (00:00 UTC) are on independent schedules, so there is a window of up to ~6 hours where the ranking and badge are out of sync.
>
> ### Resolution
> Badge expected to update at **00:00 UTC (01:00 BST) on 2026-07-10**. Monitor after that time and close if resolved.
