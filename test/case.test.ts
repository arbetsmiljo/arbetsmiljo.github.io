jest.mock("cross-fetch", () => jest.fn());

import fs from "fs";
import { DiariumCaseIdSchema, fetchDiariumCase } from "../src/case";
import fetch from "cross-fetch";
import { gunzipSync } from "zlib";

describe("DiariumCaseIdSchema", () => {
  it("accepts a valid ID", () => {
    expect(DiariumCaseIdSchema.parse("1234/123456")).toEqual("1234/123456");
  });

  it("rejects an invalid ID", () => {
    expect(() => DiariumCaseIdSchema.parse("9183")).toThrow();
  });
});

describe("fetchDiariumCase", () => {
  it("fetches typical employer cases with metadata", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      text: async () =>
        gunzipSync(fs.readFileSync("./test/2023:004796.html.gz")),
    });
    const data = await fetchDiariumCase("2023/004796");
    expect(data).toEqual({
      caseId: "2023/004796",
      caseName: "Avvikelse från arbetstidslagen – nattarbete",
      caseSubject: "Hantera tillstånd",
      companyId: "5567037485",
      companyName: "SPOTIFY AB",
      countyId: "01",
      countyName: "STOCKHOLMS LÄN",
      municipalityId: "0180",
      municipalityName: "Stockholm",
    });
  });

  it("fetches case metadata for very empty cases", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      text: async () =>
        gunzipSync(fs.readFileSync("./test/2024:071290.html.gz")),
    });
    const data = await fetchDiariumCase("2024/071290");
    expect(data).toEqual({
      caseId: "2024/071290",
      caseName: "Sanktionsavgift – Utstationering - Arbetsgivarens anmälan",
      caseSubject: "Hantera avgiftsutdömande",
    });
  });

  it("fetches case metadata for kommun filings with a CFAR", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      text: async () =>
        gunzipSync(fs.readFileSync("./test/2024:060926.html.gz")),
    });
    const data = await fetchDiariumCase("2024/060926");
    expect(data).toEqual({
      caseId: "2024/060926",
      caseName: "Tillbud 20241012. Brand",
      caseSubject: "Bedriva inspektion",
      companyId: "2120002726",
      companyName: "GÄLLIVARE KOMMUN",
      workplaceId: "19223593",
      workplaceName: "RÄDDNINGSTJÄNST",
      countyId: "25",
      countyName: "NORRBOTTENS LÄN",
      municipalityId: "2523",
      municipalityName: "Gällivare",
    });
  });
});
