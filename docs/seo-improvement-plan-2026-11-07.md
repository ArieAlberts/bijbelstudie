# Website improvement plan — 7 November 2026

## Baseline and scope

- Work from main commit `1ac8fde333de241d7d3a46f7d026acd84dcee5dd` on a separate feature branch.
- Preserve published studies, the Frame method, bilingual routes, study storage and forms.
- Use Windsor Search Console data for `sc-domain:parasja.nl`, requested period 10 October–6 November 2026. Returned daily rows cover 17 October–4 November only. Missing rows are not zero activity. Query and page breakdowns have different aggregation and privacy limits and must not be added to site totals.
- Production HTTP responses identify GitHub Pages. The latest deployment of the baseline commit succeeded on 6 November. Keep the existing hosting and publishing workflow.
- The 7 November coverage export contains measurements only through 23 October: 84 indexed, 40 canonical alternatives, 3 redirects, 15 discovered and 13 crawled but not indexed. It contains no affected URL list and predates recent changes.

## Implementation plan

1. Inspect current search queries, live page responses, canonical URLs, sitemap and source.
2. Repair confirmed navigation and language-switch failures, retaining direct routes to translated studies.
3. Add visible, crawlable navigation to study pages and improve overview discoverability.
4. Correct inconsistent redirect metadata and internal noncanonical links.
5. Crawl the completed build for missing internal destinations and protect fixes with meaningful checks.
6. Run the full production build, verify representative browser flows, publish through a reviewed pull request and verify deployment.
7. Record delivered changes and remaining actions that require new data or external account access.

## Search baseline

The returned daily site totals are 153 impressions and 10 clicks (CTR 6.54%). The query breakdown includes “parasja” (33 impressions, 2 clicks), “parasja betekenis” (6 impressions, 0 clicks) and “parasha deze week” (6 impressions, 0 clicks). These are small samples. The page breakdown attributes 79 impressions and 7 clicks to `/nl/index.html`; it is a separate aggregation and is not a site-total control. No traffic trend or cause can be inferred from the final five available days alone.

## Implemented

- Repaired English method, example and appendix fragments, and handbook links into worksheet steps. Retained the original Dutch fragments as aliases.
- Made language switches follow the declared translated page instead of dropping readers back at the homepage. Preserved query strings and translated view fragments.
- Connected the current study to the navigation's download selection, including selection-change events.
- Replaced 87 noncanonical `index.html` anchor links in the baseline build. The handbook generator normalizes these links every time it runs.
- Made English articles discoverable from desktop and mobile navigation, and linked article navigation to the weekly overview.
- Added visible breadcrumbs, archive, neighboring study, handbook and matching-language links to all 38 generated study pages. Added matching BreadcrumbList data and article images.
- Gave both reading overviews descriptive study links, language navigation, collection metadata and direct links to the standalone Bible readers. The readers were previously listed in the sitemap but unreachable through static HTML links from the root.
- Removed application JavaScript module preloads from the two static overviews.
- Added visible H1 headings to the two introductory views without changing their displayed wording or size.
- Aligned feedback-redirect canonical URLs with their contact destinations. Marked admin and confirmation pages noindex.
- Replaced the 404 page's self-reloading script with a bilingual recovery page and root-relative assets.
- Added build checks for broken internal destinations, reachability of all 113 sitemap pages, noncanonical homepage anchors, valid structured data, breadcrumbs, redirect metadata and the navigation regressions.

## Verification

- Baseline production build check: 113 sitemap pages, no broken internal path destinations, 87 noncanonical homepage links, two reader routes without a crawlable path from the root.
- Updated `npm run build:seo` and `npm run verify:seo` pass, including the crawl of all 113 sitemap pages.
- Local full generation runs DOCX/RTF/EPUB and site compilation, but this environment prevents Chromium from launching for PDF generation. The strict release-download check therefore requires the existing full-build CI job before merge.
- Browser inspection confirmed the original English `#method` failure in production. The cloud browser cannot reach this executor's loopback preview. Verify the candidate through a deployment preview or the published site.

## Follow-up requiring new evidence

- Obtain fresh URL-level Search Console lists for the 15 discovered and 13 crawled-but-not-indexed pages. The supplied coverage workbook cannot identify these URLs. Canonical alternatives and redirects are not automatically errors.
- Monitor the canonical `/nl/` URL after recrawling. GitHub Pages does not provide configurable per-path HTTP 301 redirects for `index.html`; keep canonical tags and internal links consistent rather than changing hosting during this improvement pass.
- Reassess performance after sufficient new, finalized Search Console data has accumulated. Windsor's returned finalized rows stop at 4 November. Do not claim a ranking improvement before measuring one.
- Continue publishing substantive studies using the existing editorial method. Do not publish draft Feast material or replace theological content based on a handful of search queries.
- A live Core Web Vitals or Lighthouse score has not been established by the current data and must not be invented.
