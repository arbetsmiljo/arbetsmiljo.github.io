# arbetsmiljo.github.io

Homepage for the work environment data visualisation subsite of the svenskamodellen Swedish labour market documentation project.

All filesystem lookups in this repo assume a runtime context matching the structure defined in the README of [svenskamodellen/workspace](https://github.com/svenskamodellen/workspace).

## Commands

- Run `make db.sqlite` to download the latest database from the `data` release
- Run `make ingest` (or `YEAR=2025 make ingest`) to scrape new documents into it
- Run `make upload` to publish the local database to the `data` release
- Run `make pull` to discard the local database and download it again
- Run `pnpm combine` to rebuild the database from the yearly repos
- Run `pnpm diarium --help` to list the other diarium CLI commands
- Run `pnpm test` to run the diarium scraper tests
- Run `pnpm dev` to run the dev server at http://localhost:3000/.
- Run `pnpm build` to produce a build
- Run `pnpm ship` to build and deploy to production

## Diarium modules

SQLite & web scraper tooling for work environment data in Arbetsmiljöverket's diarium lives in [lib/diarium](lib/diarium).

| Module | Description |
| --- | --- |
| [Case](lib/diarium/case.ts) | Referred to as an "ärende" by Arbetsmiljöverket. Each case contains one or more documents. Cases may also optionally have one company, county, municipality, and workplace. Many cases have all of these. Some have none. |
| [Company](lib/diarium/company.ts) | Referred to as either a "företag" or an "organisation" by Arbetsmiljöverket. |
| [County](lib/diarium/county.ts) | This is a "län" in Swedish. Sweden has 21 counties and Arbetsmiljöverket's data allows for a few other special cases outside that 21. Not all cases are associated with a county. |
| [Database](lib/diarium/database.ts) | Code related to SQLite3 lives here. That means all the logic for reading from and writing to the database. |
| [Document](lib/diarium/document.ts) | Documents are the protagonists of the diarium data model. Another appropriate English word for them would be "filings". Arbetsmiljöverket refers to them as "handlingar" in Swedish. |
| [Ingestion](lib/diarium/ingestion.ts) | High-level orchestration of several other modules is managed here in order to ingest Arbetsmiljöverket's data into SQLite. |
| [Municipality](lib/diarium/municipality.ts) | This is a "kommun" in Swedish. There are 290 of these in Sweden. Just like with counties, Arbetsmiljöverket have a few special case values here outside the canonical 290 municipalities that actually exist in real life. |
| [Pagination](lib/diarium/pagination.ts) | The web search results on Arbetsmiljöverket's site are paginated. This is the code for paging through those results to determine what documents exist for a given date. |
| [Time](lib/diarium/time.ts) | What project is complete without a junk drawer of utility functions for date and time operations? |
| [Url](lib/diarium/url.ts) | Builds links to search results and case pages on Arbetsmiljöverket's diarium website. |
| [Workplace](lib/diarium/workplace.ts) | Referred to as an "arbetsplats" by Arbetsmiljöverket. Less interesting for companies with a single office or warehouse. More interesting in cases such as city ocuncils where one company might encompass hundreds of workplaces such as schools. |

## License

[CC-0](https://github.com/arbetsmiljo/arbetsmiljo.github.io/blob/main/license)
