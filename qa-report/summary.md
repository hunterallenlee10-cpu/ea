# QA report (SPEC) — http://localhost:3100

81 pages · 1003 checks · **3 failed** · 1318 visible placeholders

| Check | Passed | Failed |
|---|---|---|
| 200 | 81 | 0 |
| redirect | 14 | 0 |
| canonical | 81 | 0 |
| one H1 | 81 | 0 |
| no rating schema (HTML) | 81 | 0 |
| SPEC noindex header | 81 | 0 |
| SPEC noindex meta | 81 | 0 |
| SPEC banner | 81 | 0 |
| SPEC no tracking tags | 81 | 0 |
| title/meta identical to live (except missing ones) | 1 | 0 |
| verification tags (live site had 0) | 1 | 0 |
| no broken internal links (79 checked) | 1 | 0 |
| sitemap lists every indexable live URL | 1 | 0 |
| sitemap leaves out | 1 | 0 |
| sitemap has no priority/changefreq | 1 | 0 |
| sitemap uses absolute www URLs | 1 | 0 |
| sitemap includes images | 1 | 0 |
| robots.txt allows crawling | 1 | 0 |
| robots.txt allows OAI-SearchBot and PerplexityBot | 1 | 0 |
| robots.txt sitemap line (spec) | 1 | 0 |
| /llms.txt | 1 | 0 |
| unknown slug is a real 404 | 1 | 0 |
| no rating schema (rendered) | 81 | 0 |
| one H1 (rendered) | 81 | 0 |
| SPEC no tracking requests | 81 | 0 |
| axe | 81 | 0 |
| lighthouse | 1 | 3 |

## Lighthouse (mobile)

| Page | Perf | A11y | BP | SEO | LCP ms | TBT ms | CLS |
|---|---|---|---|---|---|---|---|
| / | 94 | 100 | 100 | 100 | 3017 | 98 | 0 |
| /estimate | 98 | 100 | 100 | 100 | 2163 | 79 | 0 |
| /painting-company/bellevue | 94 | 100 | 100 | 100 | 2989 | 101 | 0 |
| /interior-painting | 94 | 100 | 100 | 100 | 2880 | 141 | 0 |

## Failures

- lighthouse /: {"performance":94,"accessibility":100,"bestPractices":100,"seo":100,"lcpMs":3017,"tbtMs":98,"cls":0}
- lighthouse /painting-company/bellevue: {"performance":94,"accessibility":100,"bestPractices":100,"seo":100,"lcpMs":2989,"tbtMs":101,"cls":0}
- lighthouse /interior-painting: {"performance":94,"accessibility":100,"bestPractices":100,"seo":100,"lcpMs":2880,"tbtMs":141,"cls":0}
