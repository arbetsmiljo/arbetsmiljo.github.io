import { JSDOM } from "jsdom";
import _ from "lodash";
import fetch from "cross-fetch";
import z from "zod";

export type DiariumDocumentOrigin = "Inkommande" | "Upprättad" | "Utgående";

export type DiariumDocumentType =
  | "Anbud (vinnande)"
  | "Anbud (övriga)"
  | "Anbudsförfrågan/offertförfrågan"
  | "Anmälan"
  | "Anmälan av byggarbetsplats"
  | "Anmälan om dödsfall"
  | "Anmälan om miljöfarlig verksamhet (Kännedomskopia)"
  | "Anmälan om misstänkt missförhållande på arbetsplats"
  | "Anmälan om olycka"
  | "Anmälan om tillbud"
  | "Anmälan om uppställning av mobilt krossverk"
  | "Anmälan om utstationering"
  | "Anmälan till kommissionen"
  | "Anmälan, asbest"
  | "Anmälan, rapport från medicinsk kontroll"
  | "Anmälan, rapport från yrkeshygienisk mätning"
  | "Anmälan, smittämnen"
  | "Anmälan,Säkerhetsrapport/Tillsynsprogram från miljöfarlig verksamhet/SEVESO"
  | "Annons"
  | "Anskaffningsbeslut"
  | "Ansökan"
  | "Ansökan om att inkassera avgift"
  | "Ansökan om påförande av avgift"
  | "Ansökan om vitesutdömande"
  | "Arbetsmiljöverkets författningssamling"
  | "Avgiftsföreläggande"
  | "Avtal"
  | "Begäran från skyddsombud om ingripande"
  | "Begäran om avtalsjustering"
  | "Begäran om förlängd svarstid"
  | "Begäran om kompletterande uppgifter"
  | "Begäran om komplettering"
  | "Begäran om yttrande"
  | "Begäran/Förfrågan om uppgifter/synpunkter"
  | "Behovsanalys/marknadsanalys"
  | "Bekräftelse/Svar/Uppmaning till uppgiftslämnare"
  | "Beslut"
  | "Beslut om att avvisa skyddsombudets begäran"
  | "Beslut om att inte meddela omedelbart förbud"
  | "Beslut om att ärende avslutas (avslutsbrev)"
  | "Beslut om avbruten upphandling"
  | "Beslut om avskrivning av skyddsombudets begäran"
  | "Beslut om avslag av skyddsombudets begäran"
  | "Beslut om avvisning"
  | "Beslut om förbud med vite"
  | "Beslut om förbud utan vite"
  | "Beslut om föreläggande med vite"
  | "Beslut om föreläggande utan vite"
  | "Beslut om prövningstillstånd"
  | "Beslut om slutligt omedelbart förbud"
  | "Beslut om tillfälligt omedelbart förbud"
  | "Beslut om upphävande av tillfälligt förbud"
  | "Beslut om ändring"
  | "Beslut rörande begäran om förlängd svarstid"
  | "Dokumenterad bedömning inklusive brister och krav"
  | "Dom"
  | "Dom/beslut"
  | "Faktaunderlag"
  | "Frågor från anbudsgivare och information till anbudsgivare"
  | "Föranmälan"
  | "Föreskriftsförslag Externt"
  | "Föreskriftsförslag Internt"
  | "Förfrågan/Information om inträffad arbetsolycka"
  | "Förlängd svarstid - Begäran/beslut"
  | "Förlängning av avtal"
  | "Förrättningsprotokoll"
  | "Förstudierapport"
  | "Förändring av avtal (justering eller tillägg)"
  | "Inbjudan att lämna intresseanmälan"
  | "Information om att ärende avslutas"
  | "Information ur e-skada"
  | "Information ur RAPEX/ICSMS"
  | "Inspektionsmeddelande"
  | "Intresseanmälan"
  | "Intyg återkommande besiktning"
  | "Kallelse"
  | "Kompletterande uppgifter"
  | "Komplettering"
  | "Konsekvensutredning/beslut om att ingen behövs"
  | "Kvittens"
  | "Meddelande om att Arbetsmiljöverket godtagit invändningarna"
  | "Meddelande om skyddsombudsstopp"
  | "Missiv till domstol"
  | "Mötesanteckningar"
  | "Notifiering"
  | "Omprövningsrapport"
  | "Parallelluppställning"
  | "Påminnelse"
  | "Rapport"
  | "Rapport - utredning, olycksfall, tillbud"
  | "Registrerat besök"
  | "Sammanställning av inkomna externa remissvar"
  | "Skyddsombudets återkallande av begäran"
  | "Svar på avgiftsföreläggande"
  | "Svar på kravskrivelse"
  | "Svar/synpunkter på föreskriftsförslag Externt"
  | "Svar/synpunkter på föreskriftsförslag Internt"
  | "Tilldelningsbeslut"
  | "Tillsynsmeddelande"
  | "Tips från annan myndighet om misstänkt missförhållande på arbetsplats"
  | "Tips om misstänkt missförhållande på arbetsplats"
  | "Tjänsteanteckning"
  | "Trycklov"
  | "Underrättelse"
  | "Underrättelse om föreläggande/förbud"
  | "Uppdragsdirektiv/plan"
  | "Uppföljning av krav"
  | "Uppgifter/synpunkter"
  | "Upphandlingsprotokoll (utvärdering)"
  | "Uppsägning av avtal"
  | "Vidarebefordran till annan aktör"
  | "Yttrande"
  | "Återtagande av ansökan"
  | "Öppningsprotokoll"
  | "Överklagande"
  | "Övrig korrespondens (frågor/svar/synpunkter/info)"
  | "Övriga handlingar - Avgiftsutdömande"
  | "Övriga handlingar - Överklagande"
  | "Övriga handlingar administrera anskaffning"
  | "Övriga handlingar inspektion";

export enum DiariumCounty {
  "STOCKHOLMS LÄN" = "01",
  "UPPSALA LÄN" = "03",
  "SÖDERMANLANDS LÄN" = "04",
  "ÖSTERGÖTLANDS LÄN" = "05",
  "JÖNKÖPINGS LÄN" = "06",
  "KRONOBERGS LÄN" = "07",
  "KALMAR LÄN" = "08",
  "GOTLANDS LÄN" = "09",
  "BLEKINGE LÄN" = "10",
  "SKÅNE LÄN" = "12",
  "HALLANDS LÄN" = "13",
  "VÄSTRA GÖTALANDS LÄN" = "14",
  "VÄRMLANDS LÄN" = "17",
  "ÖREBRO LÄN" = "18",
  "VÄSTMANLANDS LÄN" = "19",
  "DALARNAS LÄN" = "20",
  "GÄVLEBORGS LÄN" = "21",
  "VÄSTERNORRLANDS LÄN" = "22",
  "JÄMTLANDS LÄN" = "23",
  "VÄSTERBOTTENS LÄN" = "24",
  "NORRBOTTENS LÄN" = "25",
  "FIKTIV" = "99",
}

export type DiariumCountyName = keyof typeof DiariumCounty;
export type DiariumCountyCode = `${DiariumCounty}`;

export enum DiariumMunicipality {
  "Upplands-Väsby" = "0114",
  "Vallentuna" = "0115",
  "Österåker" = "0117",
  "Värmdö" = "0120",
  "Järfälla" = "0123",
  "Ekerö" = "0125",
  "Huddinge" = "0126",
  "Botkyrka" = "0127",
  "Salem" = "0128",
  "Haninge" = "0136",
  "Tyresö" = "0138",
  "Upplands-Bro" = "0139",
  "Nykvarn" = "0140",
  "Täby" = "0160",
  "Danderyd" = "0162",
  "Sollentuna" = "0163",
  "Stockholm" = "0180",
  "Södertälje" = "0181",
  "Nacka" = "0182",
  "Sundbyberg" = "0183",
  "Solna" = "0184",
  "Lidingö" = "0186",
  "Vaxholm" = "0187",
  "Norrtälje" = "0188",
  "Sigtuna" = "0191",
  "Nynäshamn" = "0192",
  "Håbo" = "0305",
  "Älvkarleby" = "0319",
  "Knivsta" = "0330",
  "Heby" = "0331",
  "Tierp" = "0360",
  "Uppsala" = "0380",
  "Enköping" = "0381",
  "Östhammar" = "0382",
  "Vingåker" = "0428",
  "Gnesta" = "0461",
  "Nyköping" = "0480",
  "Oxelösund" = "0481",
  "Flen" = "0482",
  "Katrineholm" = "0483",
  "Eskilstuna" = "0484",
  "Strängnäs" = "0486",
  "Trosa" = "0488",
  "Ödeshög" = "0509",
  "Ydre" = "0512",
  "Kinda" = "0513",
  "Boxholm" = "0560",
  "Åtvidaberg" = "0561",
  "Finspång" = "0562",
  "Valdemarsvik" = "0563",
  "Linköping" = "0580",
  "Norrköping" = "0581",
  "Söderköping" = "0582",
  "Motala" = "0583",
  "Vadstena" = "0584",
  "Mjölby" = "0586",
  "Aneby" = "0604",
  "Gnosjö" = "0617",
  "Mullsjö" = "0642",
  "Habo" = "0643",
  "Gislaved" = "0662",
  "Vaggeryd" = "0665",
  "Jönköping" = "0680",
  "Nässjö" = "0682",
  "Värnamo" = "0683",
  "Sävsjö" = "0684",
  "Vetlanda" = "0685",
  "Eksjö" = "0686",
  "Tranås" = "0687",
  "Uppvidinge" = "0760",
  "Lessebo" = "0761",
  "Tingsryd" = "0763",
  "Alvesta" = "0764",
  "Älmhult" = "0765",
  "Markaryd" = "0767",
  "Växjö" = "0780",
  "Ljungby" = "0781",
  "Högsby" = "0821",
  "Torsås" = "0834",
  "Mörbylånga" = "0840",
  "Hultsfred" = "0860",
  "Mönsterås" = "0861",
  "Emmaboda" = "0862",
  "Kalmar" = "0880",
  "Nybro" = "0881",
  "Oskarshamn" = "0882",
  "Västervik" = "0883",
  "Vimmerby" = "0884",
  "Borgholm" = "0885",
  "Gotland" = "0980",
  "Olofström" = "1060",
  "Karlskrona" = "1080",
  "Ronneby" = "1081",
  "Karlshamn" = "1082",
  "Sölvesborg" = "1083",
  "Svalöv" = "1214",
  "Staffanstorp" = "1230",
  "Burlöv" = "1231",
  "Vellinge" = "1233",
  "Östra Göinge" = "1256",
  "Örkelljunga" = "1257",
  "Bjuv" = "1260",
  "Kävlinge" = "1261",
  "Lomma" = "1262",
  "Svedala" = "1263",
  "Skurup" = "1264",
  "Sjöbo" = "1265",
  "Hörby" = "1266",
  "Höör" = "1267",
  "Tomelilla" = "1270",
  "Bromölla" = "1272",
  "Osby" = "1273",
  "Perstorp" = "1275",
  "Klippan" = "1276",
  "Åstorp" = "1277",
  "Båstad" = "1278",
  "Malmö" = "1280",
  "Lund" = "1281",
  "Landskrona" = "1282",
  "Helsingborg" = "1283",
  "Höganäs" = "1284",
  "Eslöv" = "1285",
  "Ystad" = "1286",
  "Trelleborg" = "1287",
  "Kristianstad" = "1290",
  "Simrishamn" = "1291",
  "Ängelholm" = "1292",
  "Hässleholm" = "1293",
  "Hylte" = "1315",
  "Halmstad" = "1380",
  "Laholm" = "1381",
  "Falkenberg" = "1382",
  "Varberg" = "1383",
  "Kungsbacka" = "1384",
  "Härryda" = "1401",
  "Partille" = "1402",
  "Öckerö" = "1407",
  "Stenungsund" = "1415",
  "Tjörn" = "1419",
  "Orust" = "1421",
  "Sotenäs" = "1427",
  "Munkedal" = "1430",
  "Tanum" = "1435",
  "Dals-Ed" = "1438",
  "Färgelanda" = "1439",
  "Ale" = "1440",
  "Lerum" = "1441",
  "Vårgårda" = "1442",
  "Bollebygd" = "1443",
  "Grästorp" = "1444",
  "Essunga" = "1445",
  "Karlsborg" = "1446",
  "Gullspång" = "1447",
  "Tranemo" = "1452",
  "Bengtsfors" = "1460",
  "Mellerud" = "1461",
  "Lilla Edet" = "1462",
  "Mark" = "1463",
  "Svenljunga" = "1465",
  "Herrljunga" = "1466",
  "Vara" = "1470",
  "Götene" = "1471",
  "Tibro" = "1472",
  "Töreboda" = "1473",
  "Göteborg" = "1480",
  "Mölndal" = "1481",
  "Kungälv" = "1482",
  "Lysekil" = "1484",
  "Uddevalla" = "1485",
  "Strömstad" = "1486",
  "Vänersborg" = "1487",
  "Trollhättan" = "1488",
  "Alingsås" = "1489",
  "Borås" = "1490",
  "Ulricehamn" = "1491",
  "Åmål" = "1492",
  "Mariestad" = "1493",
  "Lidköping" = "1494",
  "Skara" = "1495",
  "Skövde" = "1496",
  "Hjo" = "1497",
  "Tidaholm" = "1498",
  "Falköping" = "1499",
  "Kil" = "1715",
  "Eda" = "1730",
  "Torsby" = "1737",
  "Storfors" = "1760",
  "Hammarö" = "1761",
  "Munkfors" = "1762",
  "Forshaga" = "1763",
  "Grums" = "1764",
  "Årjäng" = "1765",
  "Sunne" = "1766",
  "Karlstad" = "1780",
  "Kristinehamn" = "1781",
  "Filipstad" = "1782",
  "Hagfors" = "1783",
  "Arvika" = "1784",
  "Säffle" = "1785",
  "Lekeberg" = "1814",
  "Laxå" = "1860",
  "Hallsberg" = "1861",
  "Degerfors" = "1862",
  "Hällefors" = "1863",
  "Ljusnarsberg" = "1864",
  "Örebro" = "1880",
  "Kumla" = "1881",
  "Askersund" = "1882",
  "Karlskoga" = "1883",
  "Nora" = "1884",
  "Lindesberg" = "1885",
  "Skinnskatteberg" = "1904",
  "Surahammar" = "1907",
  "Kungsör" = "1960",
  "Hallstahammar" = "1961",
  "Norberg" = "1962",
  "Västerås" = "1980",
  "Sala" = "1981",
  "Fagersta" = "1982",
  "Köping" = "1983",
  "Arboga" = "1984",
  "Vansbro" = "2021",
  "Malung" = "2023",
  "Gagnef" = "2026",
  "Leksand" = "2029",
  "Rättvik" = "2031",
  "Orsa" = "2034",
  "Älvdalen" = "2039",
  "Smedjebacken" = "2061",
  "Mora" = "2062",
  "Falun" = "2080",
  "Borlänge" = "2081",
  "Säter" = "2082",
  "Hedemora" = "2083",
  "Avesta" = "2084",
  "Ludvika" = "2085",
  "Ockelbo" = "2101",
  "Hofors" = "2104",
  "Ovanåker" = "2121",
  "Nordanstig" = "2132",
  "Ljusdal" = "2161",
  "Gävle" = "2180",
  "Sandviken" = "2181",
  "Söderhamn" = "2182",
  "Bollnäs" = "2183",
  "Hudiksvall" = "2184",
  "Ånge" = "2260",
  "Timrå" = "2262",
  "Härnösand" = "2280",
  "Sundsvall" = "2281",
  "Kramfors" = "2282",
  "Sollefteå" = "2283",
  "Örnsköldsvik" = "2284",
  "Ragunda" = "2303",
  "Bräcke" = "2305",
  "Krokom" = "2309",
  "Strömsund" = "2313",
  "Åre" = "2321",
  "Berg" = "2326",
  "Härjedalen" = "2361",
  "Östersund" = "2380",
  "Nordmaling" = "2401",
  "Bjurholm" = "2403",
  "Vindeln" = "2404",
  "Robertsfors" = "2409",
  "Norsjö" = "2417",
  "Malå" = "2418",
  "Storuman" = "2421",
  "Sorsele" = "2422",
  "Dorotea" = "2425",
  "Vännäs" = "2460",
  "Vilhelmina" = "2462",
  "Åsele" = "2463",
  "Umeå" = "2480",
  "Lycksele" = "2481",
  "Skellefteå" = "2482",
  "Arvidsjaur" = "2505",
  "Arjeplog" = "2506",
  "Jokkmokk" = "2510",
  "Överkalix" = "2513",
  "Kalix" = "2514",
  "Övertorneå" = "2518",
  "Pajala" = "2521",
  "Gällivare" = "2523",
  "Älvsbyn" = "2560",
  "Luleå" = "2580",
  "Piteå" = "2581",
  "Boden" = "2582",
  "Haparanda" = "2583",
  "Kiruna" = "2584",
  "Ej svensk hemortskommun" = "10000",
}

export type DiariumMunicipalityName = keyof typeof DiariumMunicipality;
export type DiariumMunicipalityCode = `${DiariumMunicipality}`;

export type DiariumDocument = {
  id: string;
  documentDate: string;
  documentOrigin: DiariumDocumentOrigin;
  documentType: DiariumDocumentType;
  caseCode: string;
  caseName: string;
  caseSubject: string;
  companyCode?: string;
  companyName?: string;
  workplaceCode?: string;
  workplaceName?: string;
  countyCode?: DiariumCountyCode;
  countyName?: DiariumCountyName;
  municipalityCode?: DiariumMunicipalityCode;
  municipalityName?: DiariumMunicipalityName;
};

export const DiariumDocumentSchema = z.object({
  id: z.string().regex(/^\d{4}\/\d{6}-\d+$/, {
    message: "Invalid format, expected YYYY/000000-1",
  }),
  documentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "Invalid date format, expected yyyy-mm-dd",
  }),
  documentOrigin: z.union([
    z.literal("Inkommande"),
    z.literal("Upprättad"),
    z.literal("Utgående"),
  ]),
  documentType: z.union([
    z.literal("Anbud (vinnande)"),
    z.literal("Anbud (övriga)"),
    z.literal("Anbudsförfrågan/offertförfrågan"),
    z.literal("Anmälan"),
    z.literal("Anmälan av byggarbetsplats"),
    z.literal("Anmälan om dödsfall"),
    z.literal("Anmälan om miljöfarlig verksamhet (Kännedomskopia)"),
    z.literal("Anmälan om misstänkt missförhållande på arbetsplats"),
    z.literal("Anmälan om olycka"),
    z.literal("Anmälan om tillbud"),
    z.literal("Anmälan om uppställning av mobilt krossverk"),
    z.literal("Anmälan om utstationering"),
    z.literal("Anmälan till kommissionen"),
    z.literal("Anmälan, asbest"),
    z.literal("Anmälan, rapport från medicinsk kontroll"),
    z.literal("Anmälan, rapport från yrkeshygienisk mätning"),
    z.literal("Anmälan, smittämnen"),
    z.literal(
      "Anmälan,Säkerhetsrapport/Tillsynsprogram från miljöfarlig verksamhet/SEVESO",
    ),
    z.literal("Annons"),
    z.literal("Anskaffningsbeslut"),
    z.literal("Ansökan"),
    z.literal("Ansökan om att inkassera avgift"),
    z.literal("Ansökan om påförande av avgift"),
    z.literal("Ansökan om vitesutdömande"),
    z.literal("Arbetsmiljöverkets författningssamling"),
    z.literal("Avgiftsföreläggande"),
    z.literal("Avtal"),
    z.literal("Begäran från skyddsombud om ingripande"),
    z.literal("Begäran om avtalsjustering"),
    z.literal("Begäran om förlängd svarstid"),
    z.literal("Begäran om kompletterande uppgifter"),
    z.literal("Begäran om komplettering"),
    z.literal("Begäran om yttrande"),
    z.literal("Begäran/Förfrågan om uppgifter/synpunkter"),
    z.literal("Behovsanalys/marknadsanalys"),
    z.literal("Bekräftelse/Svar/Uppmaning till uppgiftslämnare"),
    z.literal("Beslut"),
    z.literal("Beslut om att avvisa skyddsombudets begäran"),
    z.literal("Beslut om att inte meddela omedelbart förbud"),
    z.literal("Beslut om att ärende avslutas (avslutsbrev)"),
    z.literal("Beslut om avbruten upphandling"),
    z.literal("Beslut om avskrivning av skyddsombudets begäran"),
    z.literal("Beslut om avslag av skyddsombudets begäran"),
    z.literal("Beslut om avvisning"),
    z.literal("Beslut om förbud med vite"),
    z.literal("Beslut om förbud utan vite"),
    z.literal("Beslut om föreläggande med vite"),
    z.literal("Beslut om föreläggande utan vite"),
    z.literal("Beslut om prövningstillstånd"),
    z.literal("Beslut om slutligt omedelbart förbud"),
    z.literal("Beslut om tillfälligt omedelbart förbud"),
    z.literal("Beslut om upphävande av tillfälligt förbud"),
    z.literal("Beslut om ändring"),
    z.literal("Beslut rörande begäran om förlängd svarstid"),
    z.literal("Dokumenterad bedömning inklusive brister och krav"),
    z.literal("Dom"),
    z.literal("Dom/beslut"),
    z.literal("Faktaunderlag"),
    z.literal("Frågor från anbudsgivare och information till anbudsgivare"),
    z.literal("Föranmälan"),
    z.literal("Föreskriftsförslag Externt"),
    z.literal("Föreskriftsförslag Internt"),
    z.literal("Förfrågan/Information om inträffad arbetsolycka"),
    z.literal("Förlängd svarstid - Begäran/beslut"),
    z.literal("Förlängning av avtal"),
    z.literal("Förrättningsprotokoll"),
    z.literal("Förstudierapport"),
    z.literal("Förändring av avtal (justering eller tillägg)"),
    z.literal("Inbjudan att lämna intresseanmälan"),
    z.literal("Information om att ärende avslutas"),
    z.literal("Information ur e-skada"),
    z.literal("Information ur RAPEX/ICSMS"),
    z.literal("Inspektionsmeddelande"),
    z.literal("Intresseanmälan"),
    z.literal("Intyg återkommande besiktning"),
    z.literal("Kallelse"),
    z.literal("Kompletterande uppgifter"),
    z.literal("Komplettering"),
    z.literal("Konsekvensutredning/beslut om att ingen behövs"),
    z.literal("Kvittens"),
    z.literal("Meddelande om att Arbetsmiljöverket godtagit invändningarna"),
    z.literal("Meddelande om skyddsombudsstopp"),
    z.literal("Missiv till domstol"),
    z.literal("Mötesanteckningar"),
    z.literal("Notifiering"),
    z.literal("Omprövningsrapport"),
    z.literal("Parallelluppställning"),
    z.literal("Påminnelse"),
    z.literal("Rapport"),
    z.literal("Rapport - utredning, olycksfall, tillbud"),
    z.literal("Registrerat besök"),
    z.literal("Sammanställning av inkomna externa remissvar"),
    z.literal("Skyddsombudets återkallande av begäran"),
    z.literal("Svar på avgiftsföreläggande"),
    z.literal("Svar på kravskrivelse"),
    z.literal("Svar/synpunkter på föreskriftsförslag Externt"),
    z.literal("Svar/synpunkter på föreskriftsförslag Internt"),
    z.literal("Tilldelningsbeslut"),
    z.literal("Tillsynsmeddelande"),
    z.literal(
      "Tips från annan myndighet om misstänkt missförhållande på arbetsplats",
    ),
    z.literal("Tips om misstänkt missförhållande på arbetsplats"),
    z.literal("Tjänsteanteckning"),
    z.literal("Trycklov"),
    z.literal("Underrättelse"),
    z.literal("Underrättelse om föreläggande/förbud"),
    z.literal("Uppdragsdirektiv/plan"),
    z.literal("Uppföljning av krav"),
    z.literal("Uppgifter/synpunkter"),
    z.literal("Upphandlingsprotokoll (utvärdering)"),
    z.literal("Uppsägning av avtal"),
    z.literal("Vidarebefordran till annan aktör"),
    z.literal("Yttrande"),
    z.literal("Återtagande av ansökan"),
    z.literal("Öppningsprotokoll"),
    z.literal("Överklagande"),
    z.literal("Övrig korrespondens (frågor/svar/synpunkter/info)"),
    z.literal("Övriga handlingar - Avgiftsutdömande"),
    z.literal("Övriga handlingar - Överklagande"),
    z.literal("Övriga handlingar administrera anskaffning"),
    z.literal("Övriga handlingar inspektion"),
  ]),

  caseCode: z.string().regex(/^\d{4}\/\d{6}$/, {
    message: "Invalid format, expected YYYY/000000",
  }),
  caseName: z.string(),
  caseSubject: z.string(),
  companyCode: z
    .string()
    .regex(/^\d{6}-?\d{4}$/, {
      message: "Invalid format, expected 123456-1234",
    })
    .optional()
    .transform((val) => {
      if (val && val.includes("-")) {
        return val.split("-").join("");
      }
      return val;
    }),
  companyName: z.string().optional(),
  workplaceCode: z
    .string()
    .regex(/^\d{8}$/, {
      message: "Invalid format, expected 12345678",
    })
    .optional(),
  workplaceName: z.string().optional(),

  countyCode: z
    .union([
      z.literal("01"),
      z.literal("03"),
      z.literal("04"),
      z.literal("05"),
      z.literal("06"),
      z.literal("07"),
      z.literal("08"),
      z.literal("09"),
      z.literal("10"),
      z.literal("12"),
      z.literal("13"),
      z.literal("14"),
      z.literal("17"),
      z.literal("18"),
      z.literal("19"),
      z.literal("20"),
      z.literal("21"),
      z.literal("22"),
      z.literal("23"),
      z.literal("24"),
      z.literal("25"),
      z.literal("99"),
    ])
    .optional(),
  countyName: z
    .union([
      z.literal("STOCKHOLMS LÄN"),
      z.literal("UPPSALA LÄN"),
      z.literal("SÖDERMANLANDS LÄN"),
      z.literal("ÖSTERGÖTLANDS LÄN"),
      z.literal("JÖNKÖPINGS LÄN"),
      z.literal("KRONOBERGS LÄN"),
      z.literal("KALMAR LÄN"),
      z.literal("GOTLANDS LÄN"),
      z.literal("BLEKINGE LÄN"),
      z.literal("SKÅNE LÄN"),
      z.literal("HALLANDS LÄN"),
      z.literal("VÄSTRA GÖTALANDS LÄN"),
      z.literal("VÄRMLANDS LÄN"),
      z.literal("ÖREBRO LÄN"),
      z.literal("VÄSTMANLANDS LÄN"),
      z.literal("DALARNAS LÄN"),
      z.literal("GÄVLEBORGS LÄN"),
      z.literal("VÄSTERNORRLANDS LÄN"),
      z.literal("JÄMTLANDS LÄN"),
      z.literal("VÄSTERBOTTENS LÄN"),
      z.literal("NORRBOTTENS LÄN"),
      z.literal("FIKTIV"),
    ])
    .optional(),

  municipalityCode: z
    .union([
      z.literal("0114"),
      z.literal("0115"),
      z.literal("0117"),
      z.literal("0120"),
      z.literal("0123"),
      z.literal("0125"),
      z.literal("0126"),
      z.literal("0127"),
      z.literal("0128"),
      z.literal("0136"),
      z.literal("0138"),
      z.literal("0139"),
      z.literal("0140"),
      z.literal("0160"),
      z.literal("0162"),
      z.literal("0163"),
      z.literal("0180"),
      z.literal("0181"),
      z.literal("0182"),
      z.literal("0183"),
      z.literal("0184"),
      z.literal("0186"),
      z.literal("0187"),
      z.literal("0188"),
      z.literal("0191"),
      z.literal("0192"),
      z.literal("0305"),
      z.literal("0319"),
      z.literal("0330"),
      z.literal("0331"),
      z.literal("0360"),
      z.literal("0380"),
      z.literal("0381"),
      z.literal("0382"),
      z.literal("0428"),
      z.literal("0461"),
      z.literal("0480"),
      z.literal("0481"),
      z.literal("0482"),
      z.literal("0483"),
      z.literal("0484"),
      z.literal("0486"),
      z.literal("0488"),
      z.literal("0509"),
      z.literal("0512"),
      z.literal("0513"),
      z.literal("0560"),
      z.literal("0561"),
      z.literal("0562"),
      z.literal("0563"),
      z.literal("0580"),
      z.literal("0581"),
      z.literal("0582"),
      z.literal("0583"),
      z.literal("0584"),
      z.literal("0586"),
      z.literal("0604"),
      z.literal("0617"),
      z.literal("0642"),
      z.literal("0643"),
      z.literal("0662"),
      z.literal("0665"),
      z.literal("0680"),
      z.literal("0682"),
      z.literal("0683"),
      z.literal("0684"),
      z.literal("0685"),
      z.literal("0686"),
      z.literal("0687"),
      z.literal("0760"),
      z.literal("0761"),
      z.literal("0763"),
      z.literal("0764"),
      z.literal("0765"),
      z.literal("0767"),
      z.literal("0780"),
      z.literal("0781"),
      z.literal("0821"),
      z.literal("0834"),
      z.literal("0840"),
      z.literal("0860"),
      z.literal("0861"),
      z.literal("0862"),
      z.literal("0880"),
      z.literal("0881"),
      z.literal("0882"),
      z.literal("0883"),
      z.literal("0884"),
      z.literal("0885"),
      z.literal("0980"),
      z.literal("1060"),
      z.literal("1080"),
      z.literal("1081"),
      z.literal("1082"),
      z.literal("1083"),
      z.literal("1214"),
      z.literal("1230"),
      z.literal("1231"),
      z.literal("1233"),
      z.literal("1256"),
      z.literal("1257"),
      z.literal("1260"),
      z.literal("1261"),
      z.literal("1262"),
      z.literal("1263"),
      z.literal("1264"),
      z.literal("1265"),
      z.literal("1266"),
      z.literal("1267"),
      z.literal("1270"),
      z.literal("1272"),
      z.literal("1273"),
      z.literal("1275"),
      z.literal("1276"),
      z.literal("1277"),
      z.literal("1278"),
      z.literal("1280"),
      z.literal("1281"),
      z.literal("1282"),
      z.literal("1283"),
      z.literal("1284"),
      z.literal("1285"),
      z.literal("1286"),
      z.literal("1287"),
      z.literal("1290"),
      z.literal("1291"),
      z.literal("1292"),
      z.literal("1293"),
      z.literal("1315"),
      z.literal("1380"),
      z.literal("1381"),
      z.literal("1382"),
      z.literal("1383"),
      z.literal("1384"),
      z.literal("1401"),
      z.literal("1402"),
      z.literal("1407"),
      z.literal("1415"),
      z.literal("1419"),
      z.literal("1421"),
      z.literal("1427"),
      z.literal("1430"),
      z.literal("1435"),
      z.literal("1438"),
      z.literal("1439"),
      z.literal("1440"),
      z.literal("1441"),
      z.literal("1442"),
      z.literal("1443"),
      z.literal("1444"),
      z.literal("1445"),
      z.literal("1446"),
      z.literal("1447"),
      z.literal("1452"),
      z.literal("1460"),
      z.literal("1461"),
      z.literal("1462"),
      z.literal("1463"),
      z.literal("1465"),
      z.literal("1466"),
      z.literal("1470"),
      z.literal("1471"),
      z.literal("1472"),
      z.literal("1473"),
      z.literal("1480"),
      z.literal("1481"),
      z.literal("1482"),
      z.literal("1484"),
      z.literal("1485"),
      z.literal("1486"),
      z.literal("1487"),
      z.literal("1488"),
      z.literal("1489"),
      z.literal("1490"),
      z.literal("1491"),
      z.literal("1492"),
      z.literal("1493"),
      z.literal("1494"),
      z.literal("1495"),
      z.literal("1496"),
      z.literal("1497"),
      z.literal("1498"),
      z.literal("1499"),
      z.literal("1715"),
      z.literal("1730"),
      z.literal("1737"),
      z.literal("1760"),
      z.literal("1761"),
      z.literal("1762"),
      z.literal("1763"),
      z.literal("1764"),
      z.literal("1765"),
      z.literal("1766"),
      z.literal("1780"),
      z.literal("1781"),
      z.literal("1782"),
      z.literal("1783"),
      z.literal("1784"),
      z.literal("1785"),
      z.literal("1814"),
      z.literal("1860"),
      z.literal("1861"),
      z.literal("1862"),
      z.literal("1863"),
      z.literal("1864"),
      z.literal("1880"),
      z.literal("1881"),
      z.literal("1882"),
      z.literal("1883"),
      z.literal("1884"),
      z.literal("1885"),
      z.literal("1904"),
      z.literal("1907"),
      z.literal("1960"),
      z.literal("1961"),
      z.literal("1962"),
      z.literal("1980"),
      z.literal("1981"),
      z.literal("1982"),
      z.literal("1983"),
      z.literal("1984"),
      z.literal("2021"),
      z.literal("2023"),
      z.literal("2026"),
      z.literal("2029"),
      z.literal("2031"),
      z.literal("2034"),
      z.literal("2039"),
      z.literal("2061"),
      z.literal("2062"),
      z.literal("2080"),
      z.literal("2081"),
      z.literal("2082"),
      z.literal("2083"),
      z.literal("2084"),
      z.literal("2085"),
      z.literal("2101"),
      z.literal("2104"),
      z.literal("2121"),
      z.literal("2132"),
      z.literal("2161"),
      z.literal("2180"),
      z.literal("2181"),
      z.literal("2182"),
      z.literal("2183"),
      z.literal("2184"),
      z.literal("2260"),
      z.literal("2262"),
      z.literal("2280"),
      z.literal("2281"),
      z.literal("2282"),
      z.literal("2283"),
      z.literal("2284"),
      z.literal("2303"),
      z.literal("2305"),
      z.literal("2309"),
      z.literal("2313"),
      z.literal("2321"),
      z.literal("2326"),
      z.literal("2361"),
      z.literal("2380"),
      z.literal("2401"),
      z.literal("2403"),
      z.literal("2404"),
      z.literal("2409"),
      z.literal("2417"),
      z.literal("2418"),
      z.literal("2421"),
      z.literal("2422"),
      z.literal("2425"),
      z.literal("2460"),
      z.literal("2462"),
      z.literal("2463"),
      z.literal("2480"),
      z.literal("2481"),
      z.literal("2482"),
      z.literal("2505"),
      z.literal("2506"),
      z.literal("2510"),
      z.literal("2513"),
      z.literal("2514"),
      z.literal("2518"),
      z.literal("2521"),
      z.literal("2523"),
      z.literal("2560"),
      z.literal("2580"),
      z.literal("2581"),
      z.literal("2582"),
      z.literal("2583"),
      z.literal("2584"),
      z.literal("10000"),
    ])
    .optional(),

  municipalityName: z
    .union([
      z.literal("Upplands-Väsby"),
      z.literal("Vallentuna"),
      z.literal("Österåker"),
      z.literal("Värmdö"),
      z.literal("Järfälla"),
      z.literal("Ekerö"),
      z.literal("Huddinge"),
      z.literal("Botkyrka"),
      z.literal("Salem"),
      z.literal("Haninge"),
      z.literal("Tyresö"),
      z.literal("Upplands-Bro"),
      z.literal("Nykvarn"),
      z.literal("Täby"),
      z.literal("Danderyd"),
      z.literal("Sollentuna"),
      z.literal("Stockholm"),
      z.literal("Södertälje"),
      z.literal("Nacka"),
      z.literal("Sundbyberg"),
      z.literal("Solna"),
      z.literal("Lidingö"),
      z.literal("Vaxholm"),
      z.literal("Norrtälje"),
      z.literal("Sigtuna"),
      z.literal("Nynäshamn"),
      z.literal("Håbo"),
      z.literal("Älvkarleby"),
      z.literal("Knivsta"),
      z.literal("Heby"),
      z.literal("Tierp"),
      z.literal("Uppsala"),
      z.literal("Enköping"),
      z.literal("Östhammar"),
      z.literal("Vingåker"),
      z.literal("Gnesta"),
      z.literal("Nyköping"),
      z.literal("Oxelösund"),
      z.literal("Flen"),
      z.literal("Katrineholm"),
      z.literal("Eskilstuna"),
      z.literal("Strängnäs"),
      z.literal("Trosa"),
      z.literal("Ödeshög"),
      z.literal("Ydre"),
      z.literal("Kinda"),
      z.literal("Boxholm"),
      z.literal("Åtvidaberg"),
      z.literal("Finspång"),
      z.literal("Valdemarsvik"),
      z.literal("Linköping"),
      z.literal("Norrköping"),
      z.literal("Söderköping"),
      z.literal("Motala"),
      z.literal("Vadstena"),
      z.literal("Mjölby"),
      z.literal("Aneby"),
      z.literal("Gnosjö"),
      z.literal("Mullsjö"),
      z.literal("Habo"),
      z.literal("Gislaved"),
      z.literal("Vaggeryd"),
      z.literal("Jönköping"),
      z.literal("Nässjö"),
      z.literal("Värnamo"),
      z.literal("Sävsjö"),
      z.literal("Vetlanda"),
      z.literal("Eksjö"),
      z.literal("Tranås"),
      z.literal("Uppvidinge"),
      z.literal("Lessebo"),
      z.literal("Tingsryd"),
      z.literal("Alvesta"),
      z.literal("Älmhult"),
      z.literal("Markaryd"),
      z.literal("Växjö"),
      z.literal("Ljungby"),
      z.literal("Högsby"),
      z.literal("Torsås"),
      z.literal("Mörbylånga"),
      z.literal("Hultsfred"),
      z.literal("Mönsterås"),
      z.literal("Emmaboda"),
      z.literal("Kalmar"),
      z.literal("Nybro"),
      z.literal("Oskarshamn"),
      z.literal("Västervik"),
      z.literal("Vimmerby"),
      z.literal("Borgholm"),
      z.literal("Gotland"),
      z.literal("Olofström"),
      z.literal("Karlskrona"),
      z.literal("Ronneby"),
      z.literal("Karlshamn"),
      z.literal("Sölvesborg"),
      z.literal("Svalöv"),
      z.literal("Staffanstorp"),
      z.literal("Burlöv"),
      z.literal("Vellinge"),
      z.literal("Östra Göinge"),
      z.literal("Örkelljunga"),
      z.literal("Bjuv"),
      z.literal("Kävlinge"),
      z.literal("Lomma"),
      z.literal("Svedala"),
      z.literal("Skurup"),
      z.literal("Sjöbo"),
      z.literal("Hörby"),
      z.literal("Höör"),
      z.literal("Tomelilla"),
      z.literal("Bromölla"),
      z.literal("Osby"),
      z.literal("Perstorp"),
      z.literal("Klippan"),
      z.literal("Åstorp"),
      z.literal("Båstad"),
      z.literal("Malmö"),
      z.literal("Lund"),
      z.literal("Landskrona"),
      z.literal("Helsingborg"),
      z.literal("Höganäs"),
      z.literal("Eslöv"),
      z.literal("Ystad"),
      z.literal("Trelleborg"),
      z.literal("Kristianstad"),
      z.literal("Simrishamn"),
      z.literal("Ängelholm"),
      z.literal("Hässleholm"),
      z.literal("Hylte"),
      z.literal("Halmstad"),
      z.literal("Laholm"),
      z.literal("Falkenberg"),
      z.literal("Varberg"),
      z.literal("Kungsbacka"),
      z.literal("Härryda"),
      z.literal("Partille"),
      z.literal("Öckerö"),
      z.literal("Stenungsund"),
      z.literal("Tjörn"),
      z.literal("Orust"),
      z.literal("Sotenäs"),
      z.literal("Munkedal"),
      z.literal("Tanum"),
      z.literal("Dals-Ed"),
      z.literal("Färgelanda"),
      z.literal("Ale"),
      z.literal("Lerum"),
      z.literal("Vårgårda"),
      z.literal("Bollebygd"),
      z.literal("Grästorp"),
      z.literal("Essunga"),
      z.literal("Karlsborg"),
      z.literal("Gullspång"),
      z.literal("Tranemo"),
      z.literal("Bengtsfors"),
      z.literal("Mellerud"),
      z.literal("Lilla Edet"),
      z.literal("Mark"),
      z.literal("Svenljunga"),
      z.literal("Herrljunga"),
      z.literal("Vara"),
      z.literal("Götene"),
      z.literal("Tibro"),
      z.literal("Töreboda"),
      z.literal("Göteborg"),
      z.literal("Mölndal"),
      z.literal("Kungälv"),
      z.literal("Lysekil"),
      z.literal("Uddevalla"),
      z.literal("Strömstad"),
      z.literal("Vänersborg"),
      z.literal("Trollhättan"),
      z.literal("Alingsås"),
      z.literal("Borås"),
      z.literal("Ulricehamn"),
      z.literal("Åmål"),
      z.literal("Mariestad"),
      z.literal("Lidköping"),
      z.literal("Skara"),
      z.literal("Skövde"),
      z.literal("Hjo"),
      z.literal("Tidaholm"),
      z.literal("Falköping"),
      z.literal("Kil"),
      z.literal("Eda"),
      z.literal("Torsby"),
      z.literal("Storfors"),
      z.literal("Hammarö"),
      z.literal("Munkfors"),
      z.literal("Forshaga"),
      z.literal("Grums"),
      z.literal("Årjäng"),
      z.literal("Sunne"),
      z.literal("Karlstad"),
      z.literal("Kristinehamn"),
      z.literal("Filipstad"),
      z.literal("Hagfors"),
      z.literal("Arvika"),
      z.literal("Säffle"),
      z.literal("Lekeberg"),
      z.literal("Laxå"),
      z.literal("Hallsberg"),
      z.literal("Degerfors"),
      z.literal("Hällefors"),
      z.literal("Ljusnarsberg"),
      z.literal("Örebro"),
      z.literal("Kumla"),
      z.literal("Askersund"),
      z.literal("Karlskoga"),
      z.literal("Nora"),
      z.literal("Lindesberg"),
      z.literal("Skinnskatteberg"),
      z.literal("Surahammar"),
      z.literal("Kungsör"),
      z.literal("Hallstahammar"),
      z.literal("Norberg"),
      z.literal("Västerås"),
      z.literal("Sala"),
      z.literal("Fagersta"),
      z.literal("Köping"),
      z.literal("Arboga"),
      z.literal("Vansbro"),
      z.literal("Malung"),
      z.literal("Gagnef"),
      z.literal("Leksand"),
      z.literal("Rättvik"),
      z.literal("Orsa"),
      z.literal("Älvdalen"),
      z.literal("Smedjebacken"),
      z.literal("Mora"),
      z.literal("Falun"),
      z.literal("Borlänge"),
      z.literal("Säter"),
      z.literal("Hedemora"),
      z.literal("Avesta"),
      z.literal("Ludvika"),
      z.literal("Ockelbo"),
      z.literal("Hofors"),
      z.literal("Ovanåker"),
      z.literal("Nordanstig"),
      z.literal("Ljusdal"),
      z.literal("Gävle"),
      z.literal("Sandviken"),
      z.literal("Söderhamn"),
      z.literal("Bollnäs"),
      z.literal("Hudiksvall"),
      z.literal("Ånge"),
      z.literal("Timrå"),
      z.literal("Härnösand"),
      z.literal("Sundsvall"),
      z.literal("Kramfors"),
      z.literal("Sollefteå"),
      z.literal("Örnsköldsvik"),
      z.literal("Ragunda"),
      z.literal("Bräcke"),
      z.literal("Krokom"),
      z.literal("Strömsund"),
      z.literal("Åre"),
      z.literal("Berg"),
      z.literal("Härjedalen"),
      z.literal("Östersund"),
      z.literal("Nordmaling"),
      z.literal("Bjurholm"),
      z.literal("Vindeln"),
      z.literal("Robertsfors"),
      z.literal("Norsjö"),
      z.literal("Malå"),
      z.literal("Storuman"),
      z.literal("Sorsele"),
      z.literal("Dorotea"),
      z.literal("Vännäs"),
      z.literal("Vilhelmina"),
      z.literal("Åsele"),
      z.literal("Umeå"),
      z.literal("Lycksele"),
      z.literal("Skellefteå"),
      z.literal("Arvidsjaur"),
      z.literal("Arjeplog"),
      z.literal("Jokkmokk"),
      z.literal("Överkalix"),
      z.literal("Kalix"),
      z.literal("Övertorneå"),
      z.literal("Pajala"),
      z.literal("Gällivare"),
      z.literal("Älvsbyn"),
      z.literal("Luleå"),
      z.literal("Piteå"),
      z.literal("Boden"),
      z.literal("Haparanda"),
      z.literal("Kiruna"),
      z.literal("Ej svensk hemortskommun"),
    ])
    .optional(),
});

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

const optional = (text: string | null) =>
  text ? (trim(text).toLowerCase() === "saknas" ? undefined : text) : undefined;

/**
 * Fetch metadata about a document from the Arbetsmiljöverket website.
 */
export async function fetchDiariumDocument(
  id: string,
): Promise<DiariumDocument> {
  const baseUrl = `https://www.av.se/om-oss/diarium-och-allmanna-handlingar/bestall-handlingar/Case/?id=`;
  const caseCode = id.split("-")[0];
  const caseUrl = `${baseUrl}${caseCode}`;
  const response = await fetch(caseUrl, {
    headers: {
      Cookie: "cookieacceptpreferences=0%2c1;",
    },
  });
  const html = await response.text();

  const document = new JSDOM(html).window.document;
  const article = [...document.querySelectorAll("article")].find((a) =>
    a.querySelector("h3")?.textContent?.includes(id),
  );

  if (!article) {
    throw new Error(`Document ${id} not found`);
  }

  const definitions = dl(article);
  const documentDate = definitions["Handlingens datum"];
  const documentOrigin = definitions["Handlingens ursprung"];
  const documentType = definitions["Handlingstyp"];

  const h1 = document.querySelector("h1");
  if (!h1) {
    throw new Error(`Document ${id} missing h1`);
  }
  const caseName = trim(h1.textContent);

  const caseContainer = h1?.parentElement!.parentElement!;
  const caseDefinitions = dl(caseContainer);
  const caseSubject = caseDefinitions["Ämnesområde"];
  const companyCode = optional(caseDefinitions["Organisationsnummer"]);
  const companyName = optional(caseDefinitions["Företag/organisation"]);
  const workplaceCode = optional(caseDefinitions["Arbetsställenummer (CFAR)"]);

  let workplaceName = undefined;
  let countyCode = undefined;
  let countyName = undefined;
  let municipalityCode = undefined;
  let municipalityName = undefined;

  const placeSpan = Array.from(
    caseContainer.querySelectorAll("span.visually-hidden"),
  ).find((p) => p.textContent?.trim().includes("Plats"));
  if (placeSpan) {
    const placeParagraph = placeSpan.parentElement!;

    const countySpan = placeParagraph.querySelector("span:nth-child(2)");
    if (countySpan) {
      const countySpanText = countySpan.textContent!.trim();
      if (countySpanText !== "Saknas") {
        const countyMatch = countySpanText.match(/(.+) \((\d+)\)/);
        if (countyMatch) {
          countyCode = countyMatch?.[2];
          countyName = countyMatch?.[1];
        }
      }
    }

    const municipalitySpan = placeParagraph.querySelector("span:nth-child(3)");
    if (municipalitySpan) {
      const municipalitySpanText = municipalitySpan.textContent!.trim();
      if (municipalitySpanText !== "Saknas") {
        const municipalityMatch = municipalitySpanText.match(/(.+) \((\d+)\)/);
        if (municipalityMatch) {
          municipalityCode = municipalityMatch?.[2];
          municipalityName = municipalityMatch?.[1];
        }
      }
    }

    const placeDefinition = placeParagraph.parentElement!;
    const workplaceRawName =
      placeDefinition.firstChild?.textContent?.trim() || "";
    if (workplaceRawName && workplaceRawName !== "Saknas") {
      workplaceName = workplaceRawName;
    }
  }

  const unvalidatedDocument = {
    id,
    documentDate,
    documentOrigin,
    documentType,
    caseCode,
    caseName,
    caseSubject,
    companyCode,
    companyName,
    workplaceCode,
    workplaceName,
    countyCode,
    countyName,
    municipalityCode,
    municipalityName,
  };

  const validatedDocument = DiariumDocumentSchema.parse(unvalidatedDocument);

  return validatedDocument;
}
