> [!CAUTION]
> ## Summary of issues logged in [KayanShah/KayanShah/Issues](https://github.com/KayanShah/KayanShah/issues)

> [!NOTE]
> **Issue #1 — Stat Card & Badge Caching** · [View issue](https://github.com/KayanShah/KayanShah/issues/1)
>
> **Status:** Resolved
> **Opened:** 2026-06-12
> **Closed:** 2026-08-27
> **Link:** [KayanShah/KayanShah#1](https://github.com/KayanShah/KayanShah/issues/1)
> 
> ### Problem
> Stat cards (streak stats, summary cards, activity graph, trophies, follower badges) were intermittently failing to load on both desktop and iOS. GitHub aggressively caches external images by URL — once fetched, GitHub serves the cached version even after the underlying data changes, or if a temporary fetch error occurred, it can cache that broken state.
>
> ### Cause
> GitHub proxies every external image through its Camo cache and keys it on the exact URL. With static card and badge URLs, the first stale or errored fetch stays pinned against that key and is re-served on web and in the iOS app no matter how many times the page is refreshed. The upstream generators (Vercel / Render) also cold-start and occasionally time out, and any such failed response gets cached the same way.
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
> 
> ### Maintenance
> Bump the `t=`/`v=` value to the current date any time a card or badge appears stuck or stale.
>
> 
> ### Closing statement
> Closed 27/08/2026. There is no permanent fix available from this repo: the root cause is GitHub's Camo cache and upstream generator cold-starts, both outside our control. The dated cache-busting parameter is accepted as the standing resolution and has held with no recurrence since the last failure was logged on 11/07/2026.





---


> [!NOTE]
> **Issue #3 — committers.top Badge Showing Unranked** · [View issue](https://github.com/KayanShah/KayanShah/issues/3)
>
> **Status:** Resolved
> **Opened:** 2026-07-09
> **Closed:** 2026-07-10
> **Link:** [KayanShah/KayanShah#3](https://github.com/KayanShah/KayanShah/issues/3)
>
> ### Problem
> [`https://user-badge.committers.top/uk/KayanShah.svg`](https://user-badge.committers.top/uk/KayanShah.svg) displayed "United Kingdom unranked (public commits)" despite KayanShah appearing at **#247** on the [UK public commits list](https://committers.top/uk) as of the 2026-07-09 17:40 UTC refresh.
>
> ### Cause
> The badge data is deployed via a dedicated Cloudflare Worker on a separate daily cron at midnight UTC, independent of the rankings refresh schedule. This created a window where the ranking and badge were out of sync.
>
> ### Resolution
> Badge updated at 00:00 UTC (01:00 BST) on 10-07-2026 as expected.
>




