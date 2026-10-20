import { Breadcrumbs } from "@svenskamodellen/components/Breadcrumb";
import { Container } from "@svenskamodellen/components/Container";
import { Main } from "@svenskamodellen/components/Main";
import { TopLevelHeading } from "@svenskamodellen/components/TopLevelHeading";

import { countDocumentsPerYear, initKysely } from "@/lib/database";
import { DateRangeBarChart } from "@/components/DateRangeBarChart";
import { Card, CardContent } from "@svenskamodellen/components/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@svenskamodellen/components/Table";

export default async function Home() {
  const databasePath = 'db.sqlite';
  const db = initKysely(databasePath);
  const documentsPerYear = await countDocumentsPerYear(db);

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
          <TopLevelHeading text="Arbetsmiljödata och -statistik" />

          <DateRangeBarChart
            title="Handlingar per år"
            description="Antalet handlingar per år."
            data={documentsPerYear}
            valueLabel="Handlingar"
          />

          <Card className="flex flex-col gap-y-4 border-background-secondary w-full">
            <CardContent className="flex-1 pb-4">
              <Table className="text-base">
                <TableHeader>
                  <TableRow className="border-background-secondary">
                    <TableHead className="font-bold px-0">
                      År
                    </TableHead>
                    <TableHead className="font-bold px-0">
                      Handlingar
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documentsPerYear.map(
                    ({ date, value }) => (
                      <TableRow
                        key={date}
                        className="border-background-secondary"
                      >
                        <TableCell className="font-medium px-0">
                          <a
                            className="text-link underline"
                            href={`/${date}`}
                          >
                            {date}
                          </a>
                        </TableCell>
                        <TableCell className="px-0">{value}</TableCell>
                      </TableRow>
                    ),
                  )}

                </TableBody>
              </Table>
            </CardContent>
          </Card>

        </Container>
      </Main>
    </>
  );
}
