import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@arbetsmarknad/components/Breadcrumb";
import {
  DescriptionList,
  DescriptionItem,
  DescriptionTerm,
  DescriptionDetails,
} from "@arbetsmarknad/components/DescriptionList";
import { Container } from "@arbetsmarknad/components/Container";
import { HeaderMenu } from "@arbetsmarknad/components/HeaderMenu";
import { Page } from "@arbetsmarknad/components/Page";
import { Section } from "@arbetsmarknad/components/Section";
import { SectionHeading } from "@arbetsmarknad/components/SectionHeading";
import { TopLevelHeading } from "@arbetsmarknad/components/TopLevelHeading";

const yearsWithData = ["2024", "2023"];

export default function Home() {
  return (
    <Page>
      <HeaderMenu
        href="https://arbetsmiljo.github.io"
        text="arbetsmiljo.github.io"
      />
      <Breadcrumb className="py-4 w-full flex justify-center">
        <Container>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="https://arbetsmarknad.github.io">
                Arbetsmarknad
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Arbetsmiljö</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Container>
      </Breadcrumb>
      <main className="flex flex-col items-center w-full py-4">
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
      </main>
    </Page>
  );
}
