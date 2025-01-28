import { JSDOM } from "jsdom";
import _ from "lodash";
import fetch from "node-fetch";
import { type DiariumDocument, DiariumDocumentSchema } from "./document";

export type DiariumDocumentPropertiesUnavailableInPagination =
  | "documentType"
  | "countyCode"
  | "countyName"
  | "municipalityCode"
  | "municipalityName";

const DiariumPaginationDocumentSchema = DiariumDocumentSchema.omit({
  documentType: true,
  countyCode: true,
  countyName: true,
  municipalityCode: true,
  municipalityName: true,
});

export type DiariumPaginationDocument = Omit<
  DiariumDocument,
  DiariumDocumentPropertiesUnavailableInPagination
>;

export type DiariumPage = {
  documents: DiariumPaginationDocument[];
  hitCount: number;
};

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

export async function fetchDiariumPage(
  date: string,
  page: number,
): Promise<DiariumPage> {
  const baseUrl = `https://www.av.se/om-oss/diarium-och-allmanna-handlingar/bestall-handlingar/Case/?`;
  const query = {
    FromDate: date,
    ToDate: date,
    sortDirection: "asc",
    sortOrder: "Dokumentdatum",
    p: `${page}`,
  };
  const searchUrl = `${baseUrl}${new URLSearchParams(query)}`;
  const response = await fetch(searchUrl, {
    headers: {
      Cookie: "cookieacceptpreferences=0%2c1;",
    },
  });
  const html = await response.text();

  const document = new JSDOM(html).window.document;
  const results = Array.from(document.querySelectorAll(".document-list__item"));
  const documents = results.map((result) => {
    const definitions = dl(result);
    const id = definitions["Handlingsnummer"];
    const documentDate = definitions["Handlingens datum"];
    const documentOrigin = definitions["Handlingens ursprung"];
    const caseCode = id.split("-")[0];
    const caseName = definitions["Ärende"];
    const caseSubject = definitions["Ämnesområde"];
    const companyName = optional(definitions["Företag/organisation"]);
    const companyCode = optional(definitions["Organisationsnummer:"]);
    const workplaceCode = optional(definitions["Arbetsställenummer (CFAR)"]);
    const workplaceName = optional(definitions["Arbetsställe"]);

    const unvalidatedDocument = {
      id,
      documentDate,
      documentOrigin,
      caseCode,
      caseName,
      caseSubject,
      companyCode,
      companyName,
      workplaceCode,
      workplaceName,
    };

    const validatedDocument = DiariumPaginationDocumentSchema.parse(
      unvalidatedDocument,
    ) as DiariumPaginationDocument;
    return validatedDocument;
  });

  const hitCountElement = document.querySelector("[data-dd-search-hits]");
  if (!hitCountElement) throw new Error("Hit count not found");
  const hitCountText = hitCountElement.textContent!.trim();
  const hitCount = parseInt(hitCountText);

  const diariumPage = {
    documents,
    hitCount,
  };

  return diariumPage;
}
