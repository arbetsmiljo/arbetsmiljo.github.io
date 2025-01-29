import { readDocument, writeDocument } from "./database";
import { fetchDiariumCase } from "./case";
import { DiariumPage, fetchDiariumPage } from "./pagination";
import ora from "ora-classic";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function ingestDiariumDay(
  date: string,
  filename: string,
  ms = 1000,
) {
  let pageNumber = 1;
  let page: DiariumPage;

  do {
    let pageSpinner = ora(` ${date} page ${pageNumber}`).start();
    page = await fetchDiariumPage(date, pageNumber);
    await delay(ms);
    pageSpinner.succeed(
      ` ${date} page ${page.number}: ${page.start} - ${page.end} of ${page.total}`,
    );

    for (let i = 0; i < page.documents.length; i++) {
      const diariumDocument = page.documents[i];
      const { documentId } = diariumDocument;
      const documentSpinner = ora(` ${documentId}`).start();
      const existingDocument = await readDocument(filename, documentId);
      if (existingDocument) {
        documentSpinner.warn(` ${documentId}: Already exists`);
        continue;
      }
      await delay(ms);
      const diariumCase = await fetchDiariumCase(documentId.split("-")[0]);
      await writeDocument(filename, diariumDocument, diariumCase);
      documentSpinner.succeed(
        ` ${diariumDocument.documentId}: ${diariumDocument.documentType} ${diariumCase.companyName ? `(${diariumCase.companyName})` : ""}`,
      );
    }

    pageNumber += 1;
  } while (page.end < page.total);
}
