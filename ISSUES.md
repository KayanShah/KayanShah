> [!NOTE]
> ## Summary of issues logged in [KayanShah/KayanShah/Issues](https://github.com/KayanShah/KayanShah/issues)
>
> **Status as of 2026-08-27:** both logged issues (#1 and #3) are Resolved — nothing open.

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
> ### Resolution
> Added a dated cache-busting query parameter (`t=DDMMYYYY` / `v=DDMMYYYY`, UK date format) to every live stat card and badge URL:
> - `github-readme-streak-stats-kayan.vercel.app`
> - `github-profile-summary-cards-kayan.vercel.app`
> - `github-readme-activity-graphkayan.vercel.app`
> - `github-trophies.vercel.app`
> - `kayan-github-chart-api.onrender.com`
> - `gh-follower-badge.vercel.app`
>
> Bumping the value to the current date changes the URL, so Camo treats it as a new image and fetches it fresh instead of re-serving the pinned copy. A running record of every bump is kept in the cache refresh history log at the bottom of `README.md`.
>
> ### Maintenance
> This is a mitigation, not an upstream fix. The weekly bump is now automated by [`.github/workflows/refresh-cache.yml`](.github/workflows/refresh-cache.yml), which runs [`scripts/bump-cache.mjs`](scripts/bump-cache.mjs) every Monday and updates the history log in `README.md`. To force a bump between runs, trigger the workflow manually or run `node scripts/bump-cache.mjs` locally.
>
> ### Closing statement
> Closed 2026-08-27 after a six-week monitoring window with no recurrence. The last loading failure was logged on 2026-07-11; every weekly cache bump since (2026-07-30, 2026-08-12, 2026-08-18, 2026-08-27) has left the cards and badges rendering reliably on both web and the iOS app. No root-cause fix is possible from this repo — the failure originates in GitHub's Camo cache and in upstream generator cold-starts, neither of which we control — so the dated cache-busting parameter is accepted as the permanent resolution. This issue will be reopened only if the failures return and a cache bump no longer clears them.





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
> Badge updated at 00:00 UTC (01:00 BST) on 2026-07-10 as expected.
>




