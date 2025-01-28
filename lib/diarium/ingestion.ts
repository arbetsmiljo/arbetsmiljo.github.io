import { fetchDiariumDocument } from "./document";
import { fetchDiariumPage } from "./pagination";
import ora from "ora";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function ingestDiariumDay(date: string, ms = 1000) {
  let pageNumber = 1;
  let pageSpinner = ora(` Page ${pageNumber}`).start();
  let page = await fetchDiariumPage(date, pageNumber);
  pageSpinner.succeed(
    ` Page ${pageNumber}: ${page.documents.length * (pageNumber - 1)} - ${
      page.documents.length * (pageNumber - 1) + page.documents.length
    } of ${page.hitCount}`,
  );
  const total = page.hitCount;
  let remaining = total - page.documents.length;

  while (remaining > 0 && page.documents.length > 0) {
    pageNumber += 1;
    page = await fetchDiariumPage(date, pageNumber);

    for (let i = 0; i < page.documents.length; i++) {
      const { id } = page.documents[i];
      const documentSpinner = ora(` ${id}`).start();
      await delay(ms);
      const document = await fetchDiariumDocument(id);
      documentSpinner.succeed(
        ` ${document.id}: ${document.documentType} ${document.companyName ? `(${document.companyName})` : ""}`,
      );
    }

    remaining = 0;
  }
}
