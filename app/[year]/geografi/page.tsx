import { Breadcrumbs } from "@svenskamodellen/components/Breadcrumb";
import { Container } from "@svenskamodellen/components/Container";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@svenskamodellen/components/Card";
import { Main } from "@svenskamodellen/components/Main";
import { TopLevelHeading } from "@svenskamodellen/components/TopLevelHeading";
import { Metadata } from "next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@svenskamodellen/components/Table";
import { initYearKysely, countDocumentsByCounty, type YearProps } from "@/lib/year";
import { slugify } from "@/lib/slugify";
import _ from "lodash";

export async function generateMetadata(props: YearProps): Promise<Metadata> {
  const { year } = await props.params;
  return {
    title: `Arbetsmiljöinspektioner ${year}`,
  };
}

export default async function Inspections(props: YearProps) {
  const { year } = await props.params;
  const db = initYearKysely(year);
  const documentsByCounty = await countDocumentsByCounty(db);

  return (
    <>
      <Breadcrumbs>
        {{
          "https://svenskamodellen.github.io/": "Svenska modellen",
          "/": "Arbetsmiljö",
          [`/${year}`]: `${year}`,
          [`/${year}/geografi`]: "Geografi",
        }}
      </Breadcrumbs>
      <Main>
        <Container className="flex flex-col items-start space-y-8 pb-8">
          <TopLevelHeading
            text={`Arbetsmiljöhandlingar ${year}`}
            subtext="Geografisk fördelning"
          />
          <div className="grid grid-cols-1 gap-4 w-full">
            <Card className="flex flex-col gap-y-4 border-background-secondary">
              <CardHeader className="flex flex-row items-stretch space-y-0 border-background-secondary border-b p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                  <CardTitle>Handlingar per län</CardTitle>
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
                    {documentsByCounty.map(({ countyName, documentCount }) => (
                      <TableRow
                        key={countyName}
                        className="border-background-secondary"
                      >
                        <TableCell className="px-0">
                          <a
                            className="underline text-link"
                            href={`/${year}/${slugify(countyName)}`}
                          >
                            {_.capitalize(countyName)}
                          </a>
                        </TableCell>
                        <TableCell className="px-0">{documentCount}</TableCell>
                      </TableRow>
                    ))}
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
