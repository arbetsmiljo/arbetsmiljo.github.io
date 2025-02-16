import { Breadcrumbs } from "@arbetsmarknad/components/Breadcrumb";
import {
  DescriptionList,
  DescriptionItem,
  DescriptionTerm,
  DescriptionDetails,
} from "@arbetsmarknad/components/DescriptionList";
import { Container } from "@arbetsmarknad/components/Container";
import { Main } from "@arbetsmarknad/components/Main";
import { Section } from "@arbetsmarknad/components/Section";
import { SectionHeading } from "@arbetsmarknad/components/SectionHeading";
import { TopLevelHeading } from "@arbetsmarknad/components/TopLevelHeading";

const yearsWithData = ["2025", "2024", "2023", "2022", "2021"];

export default function Home() {
  return (
    <>
      <Breadcrumbs>
        {{
          "https://arbetsmarknad.github.io/": "Arbetsmarknad",
          "/": "Arbetsmiljö",
        }}
      </Breadcrumbs>
      <Main>
        <Container className="flex flex-col items-start space-y-4">
          <TopLevelHeading text="Arbetsmiljödata och -statistik" />
          <p></p>
          <Section>
            <SectionHeading>År</SectionHeading>
            <DescriptionList>
              {yearsWithData.map((year) => (
                <DescriptionItem key={year}>
                  <DescriptionTerm>
                    <a
                      className="font-bold underline text-blue-600"
                      href={`/${year}`}
                    >
                      {year}
                    </a>
                  </DescriptionTerm>
                  <DescriptionDetails>{`Statistik om arbetsmiljön ${year}`}</DescriptionDetails>
                </DescriptionItem>
              ))}
            </DescriptionList>
          </Section>
        </Container>
      </Main>
    </>
  );
}
