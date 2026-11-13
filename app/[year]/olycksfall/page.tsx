import { Breadcrumbs } from "@svenskamodellen/components/Breadcrumb";

import { Container } from "@svenskamodellen/components/Container";
import { Main } from "@svenskamodellen/components/Main";
import { TopLevelHeading } from "@svenskamodellen/components/TopLevelHeading";
import { DailyBarChart } from "@/components/DailyBarChart";
import { Metadata } from "next";
import { initYearKysely, countCasesPerDay, type YearProps } from "@/lib/year";

export async function generateMetadata(props: YearProps): Promise<Metadata> {
  const { year } = await props.params;
  return {
    title: `Olycksfall ${year}`,
  };
}

export default async function Accidents(props: YearProps) {
  const { year } = await props.params;
  const db = initYearKysely(year);
  const accidentCasesPerDay = await countCasesPerDay(db, year, (q) =>
    q
      .where("caseName", "like", "%olycksfall%")
      .where("documentId", "like", "%-1"),
  );

  return (
    <>
      <Breadcrumbs>
        {{
          "https://svenskamodellen.github.io/": "Svenska modellen",
          "/": "Arbetsmiljö",
          [`/${year}`]: `${year}`,
          [`/${year}/olycksfall`]: "Olycksfall",
        }}
      </Breadcrumbs>
      <Main>
        <Container className="flex flex-col items-start space-y-8 pb-8">
          <TopLevelHeading
            text={`Olycksfall ${year}`}
          />
          <DailyBarChart
            title="Ärenden per dag"
            description="Antal nya ärenden som innehåller ordet 'olycksfall' per dag"
            data={accidentCasesPerDay}
            valueLabel="Ärenden"
          />
        </Container>
      </Main>
    </>
  );
}
