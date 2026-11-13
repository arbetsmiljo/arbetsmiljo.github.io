import { Breadcrumbs } from "@svenskamodellen/components/Breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@svenskamodellen/components/Card";
import { Container } from "@svenskamodellen/components/Container";
import { Main } from "@svenskamodellen/components/Main";
import { TopLevelHeading } from "@svenskamodellen/components/TopLevelHeading";
import { Metadata } from "next";
import { DailyBarChart } from "@/components/DailyBarChart";
import {
  countCasesPerDay,
  initYearKysely,
  selectSixSixACases,
  type YearProps
} from "@/lib/year";
import { diariumSearchUrl } from "@/lib/diarium/url";
import { format, parseISO } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@svenskamodellen/components/Table";

export async function generateMetadata(props: YearProps): Promise<Metadata> {
  const { year } = await props.params;
  return {
    title: `6:6a-begäranden ${year}`,
    description:
      "Statistik över begäranden från skyddsombud enligt 6 kap. 6 a § arbetsmiljölagen.",
  };
}

export default async function SixSixA(props: YearProps) {
  const { year } = await props.params;
  const db = initYearKysely(year);
  const sixSixACases = await selectSixSixACases(db);
  const sixSixACasesPerDay = await countCasesPerDay(db, year, (q) =>
    q
      .where((eb) =>
        eb.or([
          eb("caseName", "like", "%6:6a%"),
          eb("caseName", "like", "%6-6a%"),
          eb("caseName", "like", "%6 kap. 6 a%"),
          eb("caseSubject", "like", "%6:6a%"),
          eb("caseSubject", "like", "%6-6a%"),
          eb("caseSubject", "like", "%6 kap. 6 a%"),
          eb("documentType", "=", "Begäran från skyddsombud om ingripande"),
        ]),
      )
      .where("documentId", "like", "%-1"),
  );


  return (
    <>
      <Breadcrumbs>
        {{
          "https://svenskamodellen.github.io/": "Svenska modellen",
          "/": "Arbetsmiljö",
          [`/${year}`]: `${year}`,
          [`/${year}/66a`]: "6:6a",
        }}
      </Breadcrumbs>
      <Main>
        <Container className="flex flex-col items-start space-y-8 pb-8">
          <TopLevelHeading
            text={`6:6a-begäranden ${year}`}
            subtext="Begäranden från skyddsombud enligt 6 kap. 6 a § arbetsmiljölagen"
          />

          <DailyBarChart
            title="Nya 6:6a-ärenden per dag"
            description="Antal nya diarieförda ärenden som identifierats som 6:6a-begäranden per dag"
            data={sixSixACasesPerDay}
            valueLabel="Ärenden"
          />

          <Card className="w-full border-background-secondary">
            <CardHeader className="border-background-secondary border-b">
              <CardTitle>6:6a-begäranden under året</CardTitle>
              <CardDescription>
                Kronologisk lista över 6:6a-begäranden
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <Table className="text-base">
                <TableHeader>
                  <TableRow className="border-background-secondary">
                    <TableHead className="font-bold px-0">Datum</TableHead>
                    <TableHead className="font-bold px-0">Ärende</TableHead>
                    <TableHead className="font-bold px-0">Arbetsplats</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sixSixACases.map((sixSixACase) => (
                    <TableRow
                      key={sixSixACase.caseId}
                      className="border-background-secondary"
                    >
                      <TableCell className="px-0 whitespace-nowrap">
                        {format(parseISO(sixSixACase.documentDate), "yyyy-MM-dd")}
                      </TableCell>
                      <TableCell className="px-0 whitespace-nowrap">
                        <a
                          className="text-link underline"
                          href={diariumSearchUrl({
                            SearchText: sixSixACase.caseId,
                          })}
                        >
                          {sixSixACase.caseId}
                        </a>
                      </TableCell>
                      <TableCell className="px-0">
                        {sixSixACase.companyName ??
                          sixSixACase.workplaceName ??
                          "–"}
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
