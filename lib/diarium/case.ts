import { JSDOM } from "jsdom";
import _ from "lodash";
import fetch from "cross-fetch";
import z from "zod";

import { CompanyIdSchema, CompanyNameSchema } from "./company";
import { WorkplaceIdSchema, WorkplaceNameSchema } from "./workplace";

import {
  type DiariumCountyId,
  type DiariumCountyName,
  DiariumCountyIdSchema,
  DiariumCountyNameSchema,
} from "./county";

import {
  type DiariumMunicipalityId,
  type DiariumMunicipalityName,
  DiariumMunicipalityIdSchema,
  DiariumMunicipalityNameSchema,
} from "./municipality";

/**
 * Data model for case metadata
 *
 * Most of this is optional because tons of csases lack most of these fields.
 */
export type DiariumCase = {
  caseId: string;
  caseName: string;
  caseSubject: string;
  companyId?: string;
  companyName?: string;
  workplaceId?: string;
  workplaceName?: string;
  countyId?: DiariumCountyId;
  countyName?: DiariumCountyName;
  municipalityId?: DiariumMunicipalityId;
  municipalityName?: DiariumMunicipalityName;
};

/**
 * Case IDs have a strict pattern. A valid example is 1234/123456.
 * Arbetsmiljöverket's data quality is high in the case of this property and
 * I've never observed a single case of this pattern being violated.
 */
export const DiariumCaseIdSchema = z.string().regex(/^\d{4}\/\d{6}$/, {
  message: "Invalid format, expected YYYY/000000",
});

/**
 * Case names can be any string value.
 */
export const DiariumCaseNameSchema = z.string();

/**
 * Case subjects seem to be some kind of enum but I haven't gotten around to
 * listing them and setting up validation here yet so any string value is
 * accepted.
 */
export const DiariumCaseSubjectSchema = z.string();

export const DiariumCaseSchema = z.object({
  caseId: DiariumCaseIdSchema,
  caseName: DiariumCaseNameSchema,
  caseSubject: DiariumCaseSubjectSchema,
  companyId: CompanyIdSchema.optional(),
  companyName: CompanyNameSchema.optional(),
  workplaceId: WorkplaceIdSchema.optional(),
  workplaceName: WorkplaceNameSchema.optional(),
  countyId: DiariumCountyIdSchema.optional(),
  countyName: DiariumCountyNameSchema.optional(),
  municipalityId: DiariumMunicipalityIdSchema.optional(),
  municipalityName: DiariumMunicipalityNameSchema.optional(),
});

const trim = (text: string | null) =>
  _.trim(_.replace(text || "", /\s+/g, " "));

const dl = (root: Element): Record<string, string> =>
  [...root.querySelectorAll("dl")].reduce(
    (result: Record<string, string>, dl) => {
      [...dl.querySelectorAll("dt")].forEach((dt, i) => {
        const dd = dl.querySelectorAll("dd")[i];
        const key = trim(dt.textContent);
        const value = trim(
          dd.querySelector("a")?.textContent || dd.textContent,
        );
        result[key] = value;
      });
      return result;
    },
    {},
  );

const optional = (text: string | null) =>
  text ? (trim(text).toLowerCase() === "saknas" ? undefined : text) : undefined;

/**
 * Fetch metadata about a document from the Arbetsmiljöverket website.
 */
export async function fetchDiariumCase(caseId: string): Promise<DiariumCase> {
  const baseUrl = `https://www.av.se/om-oss/diarium-och-allmanna-handlingar/bestall-handlingar/Case/?id=`;
  const caseUrl = `${baseUrl}${caseId}`;
  const response = await fetch(caseUrl, {
    headers: {
      Cookie: "cookieacceptpreferences=0%2c1;",
    },
  });
  const html = await response.text();

  const document = new JSDOM(html).window.document;

  const h1 = document.querySelector("h1");
  if (!h1) {
    throw new Error(`Case ${caseId} missing h1`);
  }
  const caseName = trim(h1.textContent);

  const caseContainer = h1?.parentElement!.parentElement!;
  const caseDefinitions = dl(caseContainer);
  const caseSubject = caseDefinitions["Ämnesområde"];
  const companyId = optional(caseDefinitions["Organisationsnummer"]);
  const companyName = optional(caseDefinitions["Företag/organisation"]);
  const workplaceId = optional(caseDefinitions["Arbetsställenummer (CFAR)"]);

  let workplaceName = undefined;
  let countyId = undefined;
  let countyName = undefined;
  let municipalityId = undefined;
  let municipalityName = undefined;

  const placeSpan = Array.from(
    caseContainer.querySelectorAll("span.visually-hidden"),
  ).find((p) => p.textContent?.trim().includes("Plats"));
  if (placeSpan) {
    const placeParagraph = placeSpan.parentElement!;

    const countySpan = placeParagraph.querySelector("span:nth-child(2)");
    if (countySpan) {
      const countySpanText = countySpan.textContent!.trim();
      if (countySpanText !== "Saknas") {
        const countyMatch = countySpanText.match(/(.+) \((\d+)\)/);
        if (countyMatch) {
          countyId = countyMatch?.[2];
          countyName = countyMatch?.[1];
        }
      }
    }

    const municipalitySpan = placeParagraph.querySelector("span:nth-child(3)");
    if (municipalitySpan) {
      const municipalitySpanText = municipalitySpan.textContent!.trim();
      if (municipalitySpanText !== "Saknas") {
        const municipalityMatch = municipalitySpanText.match(/(.+) \((\d+)\)/);
        if (municipalityMatch) {
          municipalityId = municipalityMatch?.[2];
          municipalityName = municipalityMatch?.[1];
        }
      }
    }

    const placeDefinition = placeParagraph.parentElement!;
    const workplaceRawName =
      placeDefinition.firstChild?.textContent?.trim() || "";
    if (workplaceRawName && workplaceRawName !== "Saknas") {
      workplaceName = workplaceRawName;
    }
  }

  const unvalidatedCase = {
    caseId,
    caseName,
    caseSubject,
    companyId,
    companyName,
    workplaceId,
    workplaceName,
    countyId,
    countyName,
    municipalityId,
    municipalityName,
  };

  let validatedCase: DiariumCase;
  try {
    validatedCase = DiariumCaseSchema.parse(unvalidatedCase);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation failed:");
      error.issues.forEach((issue) => {
        const path = issue.path.join("");
        const value = _.get(unvalidatedCase, path);
        console.error(issue.message, { path, value });
        console.error("Unvalidated case:", unvalidatedCase);
      });
    }
    throw new Error("Invalid case");
  }

  return validatedCase;
}
