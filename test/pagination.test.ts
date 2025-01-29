jest.mock("cross-fetch", () => jest.fn());

import fs from "fs";
import { fetchDiariumPage } from "../src/pagination";
import fetch from "cross-fetch";
import { gunzipSync } from "zlib";

describe("fetchDiariumPage", () => {
  it("returns all documents from the page", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      text: async () =>
        gunzipSync(fs.readFileSync("./test/2025-01-07-p1.html.gz")),
    });
    const page = await fetchDiariumPage("2025-01-07", 1);
    expect(page.documents).toMatchInlineSnapshot(`
[
  {
    "documentDate": "2025-01-07",
    "documentId": "2024/045202-2",
    "documentOrigin": "Upprättad",
    "documentType": "Tjänsteanteckning",
  },
  {
    "documentDate": "2025-01-07",
    "documentId": "2024/015728-18",
    "documentOrigin": "Upprättad",
    "documentType": "Tjänsteanteckning",
  },
  {
    "documentDate": "2025-01-07",
    "documentId": "2024/066192-5",
    "documentOrigin": "Upprättad",
    "documentType": "Beslut om slutligt omedelbart förbud",
  },
  {
    "documentDate": "2025-01-07",
    "documentId": "2024/043715-7",
    "documentOrigin": "Upprättad",
    "documentType": "Tjänsteanteckning",
  },
  {
    "documentDate": "2025-01-07",
    "documentId": "2024/030533-30",
    "documentOrigin": "Upprättad",
    "documentType": "Tjänsteanteckning",
  },
  {
    "documentDate": "2025-01-07",
    "documentId": "2024/056665-12",
    "documentOrigin": "Utgående",
    "documentType": "Underrättelse om föreläggande/förbud",
  },
  {
    "documentDate": "2025-01-07",
    "documentId": "2024/073043-4",
    "documentOrigin": "Upprättad",
    "documentType": "Tjänsteanteckning",
  },
  {
    "documentDate": "2025-01-07",
    "documentId": "2024/068340-5",
    "documentOrigin": "Upprättad",
    "documentType": "Faktaunderlag",
  },
  {
    "documentDate": "2025-01-07",
    "documentId": "2024/074019-1",
    "documentOrigin": "Utgående",
    "documentType": "Avgiftsföreläggande",
  },
  {
    "documentDate": "2025-01-07",
    "documentId": "2024/070678-3",
    "documentOrigin": "Utgående",
    "documentType": "Beslut",
  },
]
`);
  });

  it("generates start end and total", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      text: async () =>
        gunzipSync(fs.readFileSync("./test/2025-01-07-p1.html.gz")),
    });
    const page = await fetchDiariumPage("2025-01-07", 1);
    expect(page.start).toEqual(1);
    expect(page.end).toEqual(10);
    expect(page.total).toEqual(887);
  });
});
