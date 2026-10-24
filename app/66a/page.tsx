import { Breadcrumbs } from "@svenskamodellen/components/Breadcrumb";
import { Card, CardContent } from "@svenskamodellen/components/Card";
import { Container } from "@svenskamodellen/components/Container";
import { DateRangeBarChart } from "@/components/DateRangeBarChart";
import { Main } from "@svenskamodellen/components/Main";
import { TopLevelHeading } from "@svenskamodellen/components/TopLevelHeading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@svenskamodellen/components/Table";

import {
  countSixSixACasesPerEmployer,
  countSixSixACasesPerYear,
  initKysely,
} from "@/lib/database";

export default async function SixSixA() {
  const db = initKysely("db.sqlite");
  const casesPerYear = await countSixSixACasesPerYear(db);
  const casesPerEmployer = await countSixSixACasesPerEmployer(db);

  return (
    <>
      <Breadcrumbs>
        {{
          "https://svenskamodellen.github.io/": "Svenska modellen",
          "/": "Arbetsmiljö",
          "/66a": "6:6a",
        }}
      </Breadcrumbs>
      <Main>
        <Container className="flex flex-col items-start space-y-8">
          <TopLevelHeading
            text="6:6a-begäranden"
            subtext="Begäranden från skyddsombud enligt 6 kap. 6 a § arbetsmiljölagen"
          />

          <DateRangeBarChart
            title="6:6a-ärenden per år"
            description="Antalet 6:6a-ärenden per år."
            data={casesPerYear}
            valueLabel="Ärenden"
            hrefPattern="/{date}/66a"
          />

          <Card className="w-full border-background-secondary">
            <CardContent className="flex-1 p-6">
              <h2 className="section-heading mb-1">6:6a-toppen</h2>
              <p className="body-text text-muted-foreground mb-4">
                De 20 arbetsgivarna med flest 6:6a-ärenden.
              </p>
              <Table className="text-base">
                <TableHeader>
                  <TableRow className="border-background-secondary">
                    <TableHead className="font-bold px-0">Arbetsgivare</TableHead>
                    <TableHead className="font-bold px-0 text-right">
                      Ärenden
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {casesPerEmployer.map(({ name, value }) => (
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
