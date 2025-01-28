jest.mock("node-fetch", () => jest.fn());

import fs from "fs";
import { fetchDiariumPage } from "../src/pagination";
import fetch from "node-fetch";
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
    "caseCode": "2024/045202",
    "caseName": "Inspektion inom Ett tryggt arbetsliv nollvision Vibrationer",
    "caseSubject": "Bedriva inspektion",
    "companyCode": "5567449193",
    "companyName": "BLOMQUIST RÖR AB",
    "documentDate": "2025-01-07",
    "documentOrigin": "Upprättad",
    "id": "2024/045202-2",
    "workplaceCode": "28534865",
    "workplaceName": "BLOMQUIST RÖR AB",
  },
  {
    "caseCode": "2024/015728",
    "caseName": "Tillbud 20240301. Hot",
    "caseSubject": "Bedriva inspektion",
    "companyCode": "2120002361",
    "companyName": "BOLLNÄS KOMMUN",
    "documentDate": "2025-01-07",
    "documentOrigin": "Upprättad",
    "id": "2024/015728-18",
    "workplaceCode": "19346899",
    "workplaceName": "RENHAMMARSKOLAN, FÖRSKOLEKLASS, FRITIDSHEM",
  },
  {
    "caseCode": "2024/066192",
    "caseName": "Inspektion - Omedelbart förbud 20241113 - Arbetsutrustning - Telivägen 2",
    "caseSubject": "Bedriva inspektion",
    "companyCode": "5569753824",
    "companyName": "STORBUTIKEN I NYNÄSHAMN AB",
    "documentDate": "2025-01-07",
    "documentOrigin": "Upprättad",
    "id": "2024/066192-5",
    "workplaceCode": "55626477",
    "workplaceName": "ICA MAXI",
  },
  {
    "caseCode": "2024/043715",
    "caseName": "Sanktionsavgift- avsaknad av besiktning - lyftanordning - billyft",
    "caseSubject": "Hantera avgiftsutdömande",
    "companyCode": "5593493371",
    "companyName": "DANNO BILVERKSTAD AB",
    "documentDate": "2025-01-07",
    "documentOrigin": "Upprättad",
    "id": "2024/043715-7",
    "workplaceCode": "68342740",
    "workplaceName": "DANNO BILVERKSTAD AB",
  },
  {
    "caseCode": "2024/030533",
    "caseName": "Skyddsombuds begäran om ingripande enligt 6 kap 6a § arbetsmiljölagen - brister i arbetsmiljö",
    "caseSubject": "Bedriva inspektion",
    "companyCode": "5564782646",
    "companyName": "COOR ILV AB",
    "documentDate": "2025-01-07",
    "documentOrigin": "Upprättad",
    "id": "2024/030533-30",
    "workplaceCode": "32069205",
    "workplaceName": "COOR ILV AB",
  },
  {
    "caseCode": "2024/056665",
    "caseName": "Skyddsombuds begäran om ingripande enligt 6 kap 6a § arbetsmiljölagen - psykosocial kartläggning",
    "caseSubject": "Bedriva inspektion",
    "companyCode": "2321000206",
    "companyName": "REGION VÄSTERNORRLAND",
    "documentDate": "2025-01-07",
    "documentOrigin": "Utgående",
    "id": "2024/056665-12",
    "workplaceCode": "19260751",
    "workplaceName": "LÄNSSJUKHUSET SUNDSVALL OCH HÄRNÖSAND",
  },
  {
    "caseCode": "2024/073043",
    "caseName": "Inspektion - Omedelbart förbud 20241213 - Arbetsutrustning - ÖSTRA KANALGATAN 2 B LGH 1102, KARLSTAD",
    "caseSubject": "Bedriva inspektion",
    "companyCode": "5569601668",
    "companyName": "TRIALOGUE AB",
    "documentDate": "2025-01-07",
    "documentOrigin": "Upprättad",
    "id": "2024/073043-4",
    "workplaceCode": "54195680",
    "workplaceName": "TRIALOGUE AB",
  },
  {
    "caseCode": "2024/068340",
    "caseName": "Inspektion inom Myndighetsgemensamma kontroller",
    "caseSubject": "Bedriva inspektion",
    "companyCode": "5592504103",
    "companyName": "PATTYS HORNSGATAN AB",
    "documentDate": "2025-01-07",
    "documentOrigin": "Upprättad",
    "id": "2024/068340-5",
    "workplaceCode": "65864969",
    "workplaceName": "PATTYS HORNSGATAN AB",
  },
  {
    "caseCode": "2024/074019",
    "caseName": "Sanktionsavgift - överträdelse av 5 § arbetstidslagen",
    "caseSubject": "Hantera avgiftsutdömande",
    "companyCode": "5592504103",
    "companyName": "PATTYS HORNSGATAN AB",
    "documentDate": "2025-01-07",
    "documentOrigin": "Utgående",
    "id": "2024/074019-1",
    "workplaceCode": "65864969",
    "workplaceName": "PATTYS HORNSGATAN AB",
  },
  {
    "caseCode": "2024/070678",
    "caseName": "Asbest – ansökan om tillstånd för hantering av asbest eller asbesthaltigt material vid forskning, utveckling och analys",
    "caseSubject": "Hantera tillstånd",
    "companyCode": "5561856385",
    "companyName": "FEELGOOD FÖRETAGSHÄLSOVÅRD AB",
    "documentDate": "2025-01-07",
    "documentOrigin": "Utgående",
    "id": "2024/070678-3",
    "workplaceCode": "24962342",
    "workplaceName": "FEELGOOD ÖSTERSUND",
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
