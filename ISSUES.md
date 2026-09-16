> [!NOTE]
> ## Summary of issues logged in [KayanShah/KayanShah/Issues](https://github.com/KayanShah/KayanShah/issues)
>
> **Status as of 2026-09-16:** all logged issues (#1, #3, #4) are Resolved — nothing open.

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


---


> [!NOTE]
> **Issue #4 — committers.top UK Badge Showing Unranked** · [View issue](https://github.com/KayanShah/KayanShah/issues/4)
>
> **Status:** Resolved
> **Opened:** 2026-09-16
> **Closed:** 2026-09-16
> **Link:** [KayanShah/KayanShah#4](https://github.com/KayanShah/KayanShah/issues/4)
>
> ### Problem
> [`https://user-badge.committers.top/uk/KayanShah.svg`](https://user-badge.committers.top/uk/KayanShah.svg) shows "unranked (public commits)" for the UK list. Ranked in the top 256 for about 3 months, then dropped off roughly a month ago. Followers (1,053) and location ("England") both comfortably clear the list's current requirements, so the drop isn't due to either of those.
>
> ### Cause
> [ashkulz/committers.top](https://github.com/ashkulz/committers.top) queries `contributionsCollection` with no `from`/`to` range, which GitHub defaults to a rolling 365-day window. The same field was queried twice — once as the profile owner, once as an unrelated third-party account with no access to private repos:
>
> | Field | As owner | As a stranger (what committers.top sees) |
> |---|---|---|
> | `totalCommitContributions` | 1,542 | 673 |
> | `restrictedContributionsCount` | 0 | 897 |
> | `contributionCalendar.totalContributions` | 1,631 | 1,631 (same) |
>
> 897 of the 1,631 rolling-year contributions are to private repositories (~25 actively-pushed ones). GitHub aggregates those into a hidden total for any non-collaborator rather than attributing them to a contribution type, so committers.top's crawler — itself just another non-collaborator — only sees 673 visible commits. As the rolling window advanced, the public-heavy months that used to carry the ranking rolled out and were replaced by this private-heavy stretch.
>
> ### Resolution
> Not a bug in committers.top or the badge — `totalCommitContributions` and `restrictedContributionsCount` are computed relative to what the querying viewer is authorised to see, and committers.top's crawler is just another unrelated viewer. Confirmed by building the actual `committers.top` binary from source (`CGO_ENABLED=0 go build`, the same invocation its `daily_update.yml` uses) and running it against live data — it reproduced the same 1,542 / 1,631 figures as the manual GraphQL check.
>
> Compared against the live UK cutoffs at rank 256, the gap is real on all three list variants:
>
> | List | Rank 256 needs | Visible to others | Gap |
> |---|---|---|---|
> | `/uk` (commits) | ≥765 | 673 | −92 |
> | `/uk_public` (contributions) | ≥1,124 | 734 | −390 |
> | `/uk_private` (all) | ≥2,983 | 1,631 | −1,352 |
>
> There is no code or configuration fix available from this repo. The only way back onto the list is to make some of the active private repos public — their existing commit history becomes public retroactively, as far back as the rolling window still covers — or shift more commits into already-public repos.
>
> ### Closing statement
> Closed 2026-09-16, diagnosed and documented — not a bug. The badge is accurately reporting what a third-party viewer can see; the gap is a direct, verified consequence of ~55% of this past year's contributions sitting in private repositories, not a fault in committers.top, the badge worker, or this README. No changes were made to this repository as a result, since there is nothing here to fix. Full working (self-vs-third-party GraphQL comparison, cutoff table, production-binary re-run) is posted on the [GitHub issue](https://github.com/KayanShah/KayanShah/issues/4). Revisit if any of the active private repos are made public and the badge should be rechecked.
>


---


> [!IMPORTANT]
> **Issue #5 — Follower Count Badge Showing Wrong Number** · [View issue](https://github.com/KayanShah/KayanShah/issues/5)
>
> **Status:** Open- Investigating
> **Opened:** 2026-09-16
> **Link:** [KayanShah/KayanShah#5](https://github.com/KayanShah/KayanShah/issues/5)
>
> ### Problem
> The "Thank you for X followers" badge on the README and the follower count shown on the GitHub profile appeared to disagree — the profile displayed "1.1k followers" while the badge and every direct API check showed 1,053, which looked like the badge was undercounting.
>
> ### Cause
> GitHub's profile UI abbreviates follower counts to one decimal place once they pass 1,000 — 1,050 through 1,149 all display as "1.1k". "1.1k" is not a separate, larger figure; it's 1,053 rounded for display, not evidence of a higher true count.
>
> Checked three independent ways to be sure the raw figure itself was right:
>
> | Method | Result |
> |---|---|
> | REST (`GET /user`) | `followers: 1053` |
> | GraphQL (`user(login:"KayanShah"){followers{totalCount}}`) | `1053` |
> | Full pagination of `/users/KayanShah/followers`, counted entry by entry | `1053` |
>
> All three agree, and all three match the badge.
>
> ### Resolution
> No discrepancy exists. The badge, the API, and the abbreviated "1.1k" profile figure are all reporting the same live follower count. No code or content change was made, since there was nothing to fix — this was a misreading of GitHub's number formatting, not a bug in the badge, the API, or this README.
>




