jest.mock("node-fetch", () => jest.fn());

import fs from "fs";
import { fetchDiariumDocument } from "../src/document";
import fetch from "node-fetch";
import { gunzipSync } from "zlib";

describe("fetchDiariumDocument", () => {
  it("processes a typical employer-related filing with full metadata", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      text: async () =>
        gunzipSync(fs.readFileSync("./test/2023:004796.html.gz")),
    });
    const data = await fetchDiariumDocument("2023/004796-8");
    expect(data).toEqual({
      id: "2023/004796-8",
      documentDate: "2023-02-09",
      documentOrigin: "Inkommande",
      documentType: "Komplettering",
      caseCode: "2023/004796",
      caseName: "Avvikelse från arbetstidslagen – nattarbete",
      caseSubject: "Hantera tillstånd",
      companyCode: "5567037485",
      companyName: "SPOTIFY AB",
      countyCode: "01",
      countyName: "STOCKHOLMS LÄN",
      municipalityCode: "0180",
      municipalityName: "Stockholm",
    });
  });

  it("processes a very empty filing with almost no metadata", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      text: async () =>
        gunzipSync(fs.readFileSync("./test/2024:071290.html.gz")),
    });
    const data = await fetchDiariumDocument("2024/071290-1");
    expect(data).toEqual({
      id: "2024/071290-1",
      documentDate: "2024-12-10",
      documentOrigin: "Utgående",
      documentType: "Avgiftsföreläggande",
      caseCode: "2024/071290",
      caseName: "Sanktionsavgift – Utstationering - Arbetsgivarens anmälan",
      caseSubject: "Hantera avgiftsutdömande",
    });
  });

  it("processes a filing with a CFAR number belonging to a kommun", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      text: async () =>
        gunzipSync(fs.readFileSync("./test/2024:060926.html.gz")),
    });
    const data = await fetchDiariumDocument("2024/060926-5");
    expect(data).toEqual({
      id: "2024/060926-5",
      documentDate: "2025-01-25",
      documentOrigin: "Utgående",
      documentType: "Beslut om att ärende avslutas (avslutsbrev)",
      caseCode: "2024/060926",
      caseName: "Tillbud 20241012. Brand",
      caseSubject: "Bedriva inspektion",
      companyCode: "2120002726",
      companyName: "GÄLLIVARE KOMMUN",
      workplaceCode: "19223593",
      workplaceName: "RÄDDNINGSTJÄNST",
      countyCode: "25",
      countyName: "NORRBOTTENS LÄN",
      municipalityCode: "2523",
      municipalityName: "Gällivare",
    });
  });
});
