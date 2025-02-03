import { JSDOM } from "jsdom";
import _ from "lodash";
import fetch from "cross-fetch";
import { type DiariumDocument, DiariumDocumentSchema } from "./document";
import z from "zod";

export type DiariumPage = {
  documents: DiariumDocument[];
  number: number;
  total: number;
  start: number;
  end: number;
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

export async function fetchDiariumPage(
  date: string,
  page: number,
): Promise<DiariumPage> {
  const baseUrl = `https://www.av.se/om-oss/diarium-och-allmanna-handlingar/bestall-handlingar/?`;
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
    const documentId = trim(definitions["Handlingsnummer"].trim());
    const documentType = trim(
      result.querySelector("h2 span:last-child")?.innerHTML ?? "",
    );
    const documentDate = trim(definitions["Handlingens datum"]);
    const documentOrigin = trim(definitions["Handlingens ursprung"]);
    const unvalidatedDocument = {
      documentId,
      documentType,
      documentDate,
      documentOrigin,
    };
    let validatedDocument;
    try {
      validatedDocument = DiariumDocumentSchema.parse(
        unvalidatedDocument,
      ) as DiariumDocument;
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation failed:");
        error.issues.forEach((issue) => {
          const path = issue.path.join("");
          const value = _.get(unvalidatedDocument, path);
          console.error(issue.message, { path, value });
          console.error("Unvalidated document:", unvalidatedDocument);
        });
      }
      throw new Error("Invalid case");
    }
    return validatedDocument;
  });

  const hitCountElement = document.querySelector("#dd-pagination-result-total");
  if (!hitCountElement) throw new Error("Hit count not found");
  const hitCountText = hitCountElement.textContent!.trim();
  const total = parseInt(hitCountText.split(" ").join(""));

  const start = (page - 1) * 10 + 1;
  const end = Math.min(page * 10, total);

  const diariumPage = {
    documents,
    number: page,
    total,
    start,
    end,
  };

  return diariumPage;
}
