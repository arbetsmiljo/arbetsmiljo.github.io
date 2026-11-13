import _ from "lodash";
import { Breadcrumbs } from "@svenskamodellen/components/Breadcrumb";
import { Container } from "@svenskamodellen/components/Container";
import { Main } from "@svenskamodellen/components/Main";
import { TopLevelHeading } from "@svenskamodellen/components/TopLevelHeading";
import { DailyBarChart } from "@/components/DailyBarChart";
import { Metadata } from "next";
import {
  initYearKysely,
  countCasesPerDay,
  countDocumentsByCompanyNameKeyword,
  countDocumentsByMunicipalityNameKeyword,
  type YearProps
} from "@/lib/year";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@svenskamodellen/components/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@svenskamodellen/components/Table";
import { slugify } from "@/lib/slugify";

export async function generateMetadata(props: YearProps): Promise<Metadata> {
  const { year } = await props.params;
  return {
    title: `Asbest ${year}`,
  };
}

export default async function Asbestos(props: YearProps) {
  const { year } = await props.params;
  const db = initYearKysely(year);
  const asbestosCasesPerDay = await countCasesPerDay(db, year, (q) =>
    q.where("caseName", "like", "%asbest%").where("documentId", "like", "%-1"),
  );
  const asbestosCompanyRanking = await countDocumentsByCompanyNameKeyword(
    db,
    "asbest",
  );
  const asbestosMunicipalityRanking =
    await countDocumentsByMunicipalityNameKeyword(db, "asbest");

  return (
    <>
      <Breadcrumbs>
        {{
          "https://svenskamodellen.github.io/": "Svenska modellen",
          "/": "Arbetsmiljö",
          [`/${year}`]: `${year}`,
          [`/${year}/asbest`]: "Asbest",
        }}
      </Breadcrumbs>
      <Main>
        <Container className="flex flex-col items-start space-y-8 pb-8">
          <TopLevelHeading text={`Asbest ${year}`} />
          <DailyBarChart
            title="Ärenden per dag"
            description="Antal nya ärenden som innehåller ordet 'asbest' per dag"
            data={asbestosCasesPerDay}
            valueLabel="Ärenden"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 w-full">
            <Card className="flex flex-col gap-y-4 border-background-secondary">
              <CardHeader className="flex flex-row items-stretch space-y-0 border-background-secondary border-b p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                  <CardTitle>Företag med flest asbesthandlingar</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-1 pb-4">
                <Table className="text-base">
                  <TableHeader>
                    <TableRow className="border-background-secondary">
                      <TableHead className="font-bold px-0">Län</TableHead>
                      <TableHead className="font-bold px-0">
                        Handlingar
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {asbestosCompanyRanking
                      .slice(0, 10)
                      .map(({ companyName, documentCount }) => (
                        <TableRow
                          key={companyName}
                          className="border-background-secondary"
                        >
                          <TableCell className="font-medium px-0">
                            {companyName}
                          </TableCell>
                          <TableCell className="px-0">
                            {documentCount}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="flex flex-col gap-y-4 border-background-secondary">
              <CardHeader className="flex flex-row items-stretch space-y-0 border-background-secondary border-b p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                  <CardTitle>Kommuner med flest asbesthandlingar</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-1 pb-4">
                <Table className="text-base">
                  <TableHeader>
                    <TableRow className="border-background-secondary">
                      <TableHead className="font-bold px-0">Län</TableHead>
                      <TableHead className="font-bold px-0">
                        Handlingar
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {asbestosMunicipalityRanking
                      .slice(0, 10)
                      .map(
                        ({ municipalityName, countyName, documentCount }) => (
                          <TableRow
                            key={municipalityName}
                            className="border-background-secondary"
                          >
                            <TableCell className="font-medium px-0">
                              <a
                                className="underline text-link"
                                href={`/${year}/${slugify(countyName)}/${slugify(municipalityName)}`}
                              >
                                {_.capitalize(municipalityName)}
                              </a>
                            </TableCell>
                            <TableCell className="px-0">
                              {documentCount}
                            </TableCell>
                          </TableRow>
                        ),
                      )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Main>
    </>
  );
}
