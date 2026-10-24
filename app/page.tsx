import { Breadcrumbs } from "@svenskamodellen/components/Breadcrumb";
import { Container } from "@svenskamodellen/components/Container";
import { Main } from "@svenskamodellen/components/Main";
import { TopLevelHeading } from "@svenskamodellen/components/TopLevelHeading";

import {
  countAsbestDocumentsPerYear,
  countCovidTillbudPerMonth,
  countDocumentsPerYear,
  countInspektionDocumentsPerYear,
  countOlycksfallCasesPerYear,
  countSixSixACasesPerYear,
  initKysely,
} from "@/lib/database";
import { DateRangeBarChart } from "@/components/DateRangeBarChart";

export default async function Home() {
  const databasePath = 'db.sqlite';
  const db = initKysely(databasePath);
  const documentsPerYear = await countDocumentsPerYear(db);
  const inspektionDocumentsPerYear = await countInspektionDocumentsPerYear(db);
  const olycksfallCasesPerYear = await countOlycksfallCasesPerYear(db);
  const asbestDocumentsPerYear = await countAsbestDocumentsPerYear(db);
  const sixSixACasesPerYear = await countSixSixACasesPerYear(db);
  const covidTillbudPerMonth = await countCovidTillbudPerMonth(db);

  return (
    <>
      <Breadcrumbs>
        {{
          "https://svenskamodellen.github.io/": "Svenska modellen",
          "/": "Arbetsmiljö",
        }}
      </Breadcrumbs>
      <Main>
        <Container className="flex flex-col items-start space-y-8">
          <TopLevelHeading text="Arbetsmiljödata och -statistik" subtext="Mönster och trender i Arbetsmiljöverkets diarium" />

          <p className="max-w-prose body-text">Den här sidan är en del av webbprojektet <a className="text-link underline" href="https://svenskamodellen.github.io/">Svenska Modellen</a> och är tänkt att göra Arbetsmiljöverkets diarium mer överblickbart och begripligt med hjälp av datavisualisering.</p>

          <DateRangeBarChart
            title="Handlingar per år"
            description="Antalet handlingar per år."
            data={documentsPerYear}
            valueLabel="Handlingar"
            titleHref="/handlingar-per-ar"
            hrefPattern="/{date}"
          />

          <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2">
            <DateRangeBarChart
              title="Covid"
              description="Antalet tillbud om smitta (covid) som rapporterats in per månad."
              data={covidTillbudPerMonth}
              valueLabel="Tillbud"
              titleHref="/covid"
            />

            <DateRangeBarChart
              title="Inspektioner"
              description="Antalet handlingar som innehåller ordet 'inspektion'."
              data={inspektionDocumentsPerYear}
              valueLabel="Handlingar"
            />

            <DateRangeBarChart
              title="Olycksfall"
              description="Antalet ärenden som innehåller ordet 'olycksfall' per år."
              data={olycksfallCasesPerYear}
              valueLabel="Ärenden"
            />

            <DateRangeBarChart
              title="Asbest"
              description="Antalet handlingar som innehåller ordet 'asbest'."
              data={asbestDocumentsPerYear}
              valueLabel="Handlingar"
              hrefPattern="/{date}/asbest"
            />

            <DateRangeBarChart
              title="6:6a-ärenden"
              description="Antalet 6:6a-ärenden per år."
              data={sixSixACasesPerYear}
              valueLabel="Ärenden"
              titleHref="/66a"
              hrefPattern="/{date}/66a"
            />
          </div>

        </Container>
      </Main>
    </>
  );
}
