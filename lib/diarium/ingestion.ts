import { fetchDiariumDocument } from "./document";
import { fetchDiariumPage } from "./pagination";

export async function ingestDiariumDay(date: string) {
  let pageNumber = 1;
  let page = await fetchDiariumPage(date, pageNumber);
  const total = page.hitCount;
  let remaining = total - page.documents.length;

  while (remaining > 0 && page.documents.length > 0) {
    pageNumber += 1;
    page = await fetchDiariumPage(date, pageNumber);
    const documents = await Promise.all(
      page.documents.map(async (document) => {
        return await fetchDiariumDocument(document.id);
      }),
    );
    console.log(documents.map((d) => d.companyCode));

    remaining = 0;
  }
}
