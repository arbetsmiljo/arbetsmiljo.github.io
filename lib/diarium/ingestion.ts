import {
  countDocuments,
  DiariumDatabase,
  readDocument,
  writeDocument,
} from "./database.js";
import { fetchDiariumCase } from "./case.js";
import { DiariumPage, fetchDiariumPage } from "./pagination.js";
import ora from "ora-classic";
import { Kysely } from "kysely";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function ingestDiariumDay(
  db: Kysely<DiariumDatabase>,
  date: string,
  ms = 1000,
) {
  let pageNumber = 1;
  let page: DiariumPage;
  const documentCount = await countDocuments(db, date);

  do {
    let pageSpinner = ora(` ${date} page ${pageNumber}`).start();
    page = await fetchDiariumPage(date, pageNumber);
    await delay(ms);
    if (documentCount >= page.total) {
      pageSpinner.warn(` ${date} ✅`);
      return;
    }
    pageSpinner.succeed(
      ` ${date} page ${page.number}: ${page.start} - ${page.end} of ${page.total}`,
    );

    for (let i = 0; i < page.documents.length; i++) {
      const diariumDocument = page.documents[i];
      const { documentId } = diariumDocument;
      const documentSpinner = ora(` ${documentId}`).start();
      const existingDocument = await readDocument(db, documentId);
      if (existingDocument) {
        documentSpinner.warn(` ${documentId}: Already exists`);
        continue;
      }
      await delay(ms);
      const diariumCase = await fetchDiariumCase(documentId.split("-")[0]);
      await writeDocument(db, diariumDocument, diariumCase);
      documentSpinner.succeed(
        ` ${diariumDocument.documentId}: ${diariumDocument.documentType} ${diariumCase.companyName ? `(${diariumCase.companyName})` : ""}`,
      );
    }

    pageNumber += 1;
  } while (page.end < page.total);
}
