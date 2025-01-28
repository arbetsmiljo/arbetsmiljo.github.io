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
    "id": "2024/045202-2",
  },
  {
    "id": "2024/015728-18",
  },
  {
    "id": "2024/066192-5",
  },
  {
    "id": "2024/043715-7",
  },
  {
    "id": "2024/030533-30",
  },
  {
    "id": "2024/056665-12",
  },
  {
    "id": "2024/073043-4",
  },
  {
    "id": "2024/068340-5",
  },
  {
    "id": "2024/074019-1",
  },
  {
    "id": "2024/070678-3",
  },
]
`);
  });

  it("extracts hit count", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      text: async () =>
        gunzipSync(fs.readFileSync("./test/2025-01-07-p1.html.gz")),
    });
    const page = await fetchDiariumPage("2025-01-07", 1);
    expect(page.hitCount).toEqual(887);
  });
});
