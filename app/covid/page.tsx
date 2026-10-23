import { Breadcrumbs } from "@svenskamodellen/components/Breadcrumb";
import { Container } from "@svenskamodellen/components/Container";
import { Main } from "@svenskamodellen/components/Main";
import { TopLevelHeading } from "@svenskamodellen/components/TopLevelHeading";
import { Card, CardContent } from "@svenskamodellen/components/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@svenskamodellen/components/Table";

import {
  countCovidTillbudPerEmployer,
  countCovidTillbudPerMonth,
  initKysely,
} from "@/lib/database";
import { DateRangeBarChart } from "@/components/DateRangeBarChart";

export default async function Covid() {
  const databasePath = "db.sqlite";
  const db = initKysely(databasePath);
  const covidTillbudPerMonth = await countCovidTillbudPerMonth(db);
  const covidTillbudPerEmployer = await countCovidTillbudPerEmployer(db);

  return (
    <>
      <Breadcrumbs>
        {{
          "https://svenskamodellen.github.io/": "Svenska modellen",
          "/": "Arbetsmiljö",
          "/covid": "Covid",
        }}
      </Breadcrumbs>
      <Main>
        <Container className="flex flex-col items-start space-y-8">
          <TopLevelHeading
            text="Covid på arbetsplatsen"
            subtext="Inrapporterade tillbud om smitta hos Arbetsmiljöverket"
          />

          <DateRangeBarChart
            title="Covid-tillbud per månad"
            description="Antalet tillbud om smitta (covid) som rapporterats in per månad. Topparna i april 2021 och januari 2022 följer alfa- och omikronvågorna."
            data={covidTillbudPerMonth}
            valueLabel="Tillbud"
          />

          <Card className="flex flex-col gap-y-4 border-background-secondary w-full">
            <CardContent className="flex-1 p-6">
              <h2 className="section-heading mb-1">
                Arbetsgivare med flest covid-tillbud
              </h2>
              <p className="body-text text-muted-foreground mb-4">
                Topp 20 arbetsgivare efter antal inrapporterade smittotillbud.
              </p>
              <Table className="text-base">
                <TableHeader>
                  <TableRow className="border-background-secondary">
                    <TableHead className="font-bold px-0">Arbetsgivare</TableHead>
                    <TableHead className="font-bold px-0 text-right">
                      Tillbud
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {covidTillbudPerEmployer.map(({ name, value }) => (
                    <TableRow key={name} className="border-background-secondary">
                      <TableCell className="body-text px-0">{name}</TableCell>
                      <TableCell className="body-text px-0 text-right">
                        {value}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Container>
      </Main>
    </>
  );
}
