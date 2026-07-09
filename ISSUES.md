> [!NOTE]
> ## Issue #1 — Stat Card & Badge Caching
> 
> **Status:** Resolved
> **Opened:** 2026-06-12
> **Closed:** 2026-06-28
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
