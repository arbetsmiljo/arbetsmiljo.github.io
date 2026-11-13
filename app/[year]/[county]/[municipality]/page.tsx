import _ from "lodash";
import { Breadcrumbs } from "@svenskamodellen/components/Breadcrumb";
import { Container } from "@svenskamodellen/components/Container";
import { Main } from "@svenskamodellen/components/Main";
import { TopLevelHeading } from "@svenskamodellen/components/TopLevelHeading";
import { DailyBarChart } from "@/components/DailyBarChart";
import {
  initYearKysely,
  selectDistinctCountiesAndMunicipalities,
  countDocumentsPerDay,
} from "@/lib/year";
import { slugify } from "@/lib/slugify";

type MunicipalityParams = {
  year: string;
  county: string;
  municipality: string;
};

type MunicipalityProps = {
  params: Promise<MunicipalityParams>;
};

export async function generateStaticParams({
  params: { year },
}: {
  params: { year: string };
}): Promise<Omit<MunicipalityParams, "year">[]> {
  const db = initYearKysely(year);
  const data = await selectDistinctCountiesAndMunicipalities(db);
  return data.map(([county, municipality]) => ({
    county: slugify(county.countyName),
    municipality: slugify(municipality.municipalityName),
  }));
}

export default async function County(props: MunicipalityProps) {
  const params = await props.params;
  const { year } = params;
  const db = initYearKysely(year);
  const data = await selectDistinctCountiesAndMunicipalities(db);
  const [county, municipality] = data.find(
    ([county, municipality]) =>
      slugify(county.countyName) === params.county &&
      slugify(municipality.municipalityName) === params.municipality,
  )!;
  const documentsPerDay = await countDocumentsPerDay(db, year, (q) =>
    q.where("municipalityId", "=", municipality.municipalityId),
  );

  return (
    <>
      <Breadcrumbs>
        {{
          "https://svenskamodellen.github.io/": "Svenska modellen",
          "/": "Arbetsmiljö",
          [`/${year}`]: `${year}`,
          [`/${year}/geografi`]: "Geografi",
          [`/${year}/${slugify(county.countyName)}`]: `${_.capitalize(county.countyName)}`,
          [`/${year}/${slugify(county.countyName)}/${slugify(municipality.municipalityName)}`]: `${_.capitalize(municipality.municipalityName)}`,
        }}
      </Breadcrumbs>

      <Main>
        <Container className="flex flex-col items-start space-y-8 pb-8">
          <TopLevelHeading
            text={`Arbetsmiljö ${_.capitalize(municipality.municipalityName)} ${year}`}
          />
          <DailyBarChart
            title="Handlingar per dag"
            description="Visar antalet handlingar per dag genom året."
            data={documentsPerDay}
            valueLabel="Handlingar"
          />
        </Container>
      </Main>
    </>
  );
}
