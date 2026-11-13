import Database from "better-sqlite3";
import { Kysely, SelectQueryBuilder, SqliteDialect, sql } from "kysely";
import { DiariumDatabase } from "./diarium/database";
import type { DiariumCountyId, DiariumCountyName } from "./diarium/county";
import type {
  DiariumMunicipalityId,
  DiariumMunicipalityName,
} from "./diarium/municipality";
import { listDaysInYear } from "./time";

export type YearProps = {
  params: Promise<{ year: string }>;
};

export async function selectYears(): Promise<string[]> {
  const db = new Kysely<DiariumDatabase>({
    dialect: new SqliteDialect({ database: new Database("db.sqlite") }),
  });
  const rows = await db
    .selectFrom("documents")
    .select(sql<string>`substr(documentDate, 1, 4)`.as("year"))
    .distinct()
    .orderBy("year")
    .execute();
  return rows.map((row) => row.year);
}

const yearKyselys = new Map<string, Kysely<DiariumDatabase>>();

export function initYearKysely(year: string): Kysely<DiariumDatabase> {
  if (!/^\d{4}$/.test(year)) throw new Error(`Invalid year: ${year}`);
  const cached = yearKyselys.get(year);
  if (cached) return cached;
  // Copy the year's rows into an indexed in-memory database once per worker
  // rather than scanning the whole combined database on every page.
  const database = new Database(":memory:");
  database.exec(`
    ATTACH DATABASE 'db.sqlite' AS source;
    CREATE TABLE documents AS SELECT * FROM source.documents
      WHERE documentDate >= '${year}-01-01' AND documentDate < '${Number(year) + 1}-01-01';
    DETACH DATABASE source;
    CREATE INDEX documents_documentDate ON documents (documentDate);
    CREATE INDEX documents_countyId ON documents (countyId, documentDate);
    CREATE INDEX documents_municipalityId ON documents (municipalityId, documentDate);
    CREATE INDEX documents_countyName ON documents (countyName, municipalityName);
  `);
  const dialect = new SqliteDialect({ database });
  const db = new Kysely<DiariumDatabase>({ dialect });
  yearKyselys.set(year, db);
  return db;
}

export async function countCasesPerDay(
  db: Kysely<DiariumDatabase>,
  year: string,
  where?: (
    q: SelectQueryBuilder<DiariumDatabase, any, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  ) => SelectQueryBuilder<DiariumDatabase, any, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
): Promise<{ date: string; value: number }[]> {
  const days = listDaysInYear(year);
  let query = db
    .selectFrom("documents")
    .select(["documentDate", db.fn.count("documentId").as("documentCount")])
    .groupBy("documentDate")
    .orderBy("documentDate");
  if (where) query = where(query);
  const result = await query.execute();
  return days.map((day) => ({
    date: day,
    value:
      Number(result.find((row) => row.documentDate === day)?.documentCount) ||
      0,
  }));
}

export async function countTotalDocuments(
  db: Kysely<DiariumDatabase>,
): Promise<number> {
  const result = await db
    .selectFrom("documents")
    .select([db.fn.count("documentId").as("documentCount")])
    .executeTakeFirst();
  return result ? Number(result.documentCount) : 0;
}

export async function countDocumentsPerDay(
  db: Kysely<DiariumDatabase>,
  year: string,
  where?: (
    q: SelectQueryBuilder<DiariumDatabase, any, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  ) => SelectQueryBuilder<DiariumDatabase, any, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
): Promise<{ date: string; value: number }[]> {
  const days = listDaysInYear(year);
  let query = db
    .selectFrom("documents")
    .select(["documentDate", db.fn.count("documentId").as("value")]);
  if (where) query = where(query);
  const rows = await query
    .groupBy("documentDate")
    .orderBy("documentDate")
    .execute();
  return days.map((day) => ({
    date: day,
    value: Number(rows.find((row) => row.documentDate === day)?.value) || 0,
  }));
}

export async function countCaseNameKeywordMatches(
  db: Kysely<DiariumDatabase>,
  keywords: string[],
): Promise<Record<string, number>> {
  const result: Record<string, number> = {};
  for (const keyword of keywords) {
    const row = await db
      .selectFrom("documents")
      .select(db.fn.countAll().as("count"))
      .where("caseName", "like", `%${keyword}%`)
      .executeTakeFirst();
    result[keyword] = Number(row?.count) || 0;
  }
  return result;
}

type County = {
  countyId: DiariumCountyId;
  countyName: DiariumCountyName;
};

export async function selectDistinctCounties(
  db: Kysely<DiariumDatabase>,
): Promise<County[]> {
  const result = await db
    .selectFrom("documents")
    .select(["countyId", "countyName"])
    .where("countyId", "is not", null)
    .where("countyName", "is not", null)
    .orderBy("countyName")
    .distinct()
    .execute();
  const counties = result.map((row) => ({
    countyId: row.countyId!,
    countyName: row.countyName!,
  }));
  return counties;
}

type Municipality = {
  municipalityId: DiariumMunicipalityId;
  municipalityName: DiariumMunicipalityName;
};

export async function selectDistinctCountiesAndMunicipalities(
  db: Kysely<DiariumDatabase>,
  where?: (
    q: SelectQueryBuilder<DiariumDatabase, any, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  ) => SelectQueryBuilder<DiariumDatabase, any, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
): Promise<[County, Municipality][]> {
  let query = db
    .selectFrom("documents")
    .select(["countyId", "countyName", "municipalityId", "municipalityName"])
    .where("countyId", "is not", null)
    .where("countyName", "is not", null)
    .where("municipalityId", "is not", null)
    .where("municipalityName", "is not", null);
  if (where) query = where(query);
  query = query.orderBy("countyName").distinct();
  const result = await query.execute();
  const output = result.map(
    (row) =>
      [
        {
          countyId: row.countyId!,
          countyName: row.countyName!,
        },
        {
          municipalityId: row.municipalityId!,
          municipalityName: row.municipalityName!,
        },
      ] as [County, Municipality],
  );
  return output;
}

export async function countDocumentsByCounty(
  db: Kysely<DiariumDatabase>,
): Promise<{ countyName: DiariumCountyName; documentCount: number }[]> {
  const result = await db
    .selectFrom("documents")
    .select(["countyName", db.fn.count("documentId").as("documentCount")])
    .where("countyName", "is not", null)
    .groupBy("countyName")
    .orderBy("documentCount", "desc")
    .execute();
  return result.map((row) => ({
    countyName: row.countyName!,
    documentCount: Number(row.documentCount),
  }));
}

export async function countDocumentsByMunicipality(
  db: Kysely<DiariumDatabase>,
  countyName: DiariumCountyName,
): Promise<{ municipalityName: DiariumMunicipalityName; documentCount: number }[]> {
  const result = await db
    .selectFrom("documents")
    .select(["municipalityName", db.fn.count("documentId").as("documentCount")])
    .where("municipalityName", "is not", null)
    .where("countyName", "=", countyName)
    .groupBy("municipalityName")
    .orderBy("documentCount", "desc")
    .execute();
  return result.map((row) => ({
    municipalityName: row.municipalityName!,
    documentCount: Number(row.documentCount),
  }));
}

export async function countDocumentsByInspectionType(
  db: Kysely<DiariumDatabase>,
): Promise<{ inspectionType: string; count: number }[]> {
  const result = await db
    .selectFrom("documents")
    .select([
      sql<string>`TRIM(REPLACE(caseName, 'Inspektion inom', ''))`.as(
        "inspectionType",
      ),
      db.fn.countAll().as("count"),
    ])
    .where("caseName", "like", "Inspektion inom%")
    .groupBy("inspectionType")
    .orderBy("count", "desc")
    .execute();

  return result.map((row) => ({
    inspectionType: row.inspectionType!,
    count: Number(row.count),
  }));
}

export async function countDocumentsByCompanyNameKeyword(
  db: Kysely<DiariumDatabase>,
  keyword: string,
): Promise<{ companyName: string; documentCount: number }[]> {
  const result = await db
    .selectFrom("documents")
    .select(["companyName", db.fn.count("documentId").as("documentCount")])
    .where("caseName", "like", `%${keyword}%`)
    .where("companyName", "is not", null)
    .groupBy("companyName")
    .orderBy("documentCount", "desc")
    .execute();
  return result.map((row) => ({
    companyName: row.companyName!,
    documentCount: Number(row.documentCount),
  }));
}

export async function countDocumentsByMunicipalityNameKeyword(
  db: Kysely<DiariumDatabase>,
  keyword: string,
): Promise<
  { municipalityName: DiariumMunicipalityName; countyName: DiariumCountyName; documentCount: number }[]
> {
  const result = await db
    .selectFrom("documents")
    .select([
      "municipalityName",
      "countyName",
      db.fn.count("documentId").as("documentCount"),
    ])
    .where("caseName", "like", `%${keyword}%`)
    .where("municipalityName", "is not", null)
    .groupBy("municipalityName")
    .orderBy("documentCount", "desc")
    .execute();
  return result.map((row) => ({
    municipalityName: row.municipalityName!,
    countyName: row.countyName!,
    documentCount: Number(row.documentCount),
  }));
}

export async function countCasesPerSeason(
  db: Kysely<DiariumDatabase>,
  keyword: string,
): Promise<{ season: string; count: number }[]> {
  const result = await db
    .selectFrom("documents")
    .select([
      sql<string>`CASE
        WHEN strftime('%m', documentDate) IN ('03', '04', '05') THEN 'spring'
        WHEN strftime('%m', documentDate) IN ('06', '07', '08') THEN 'summer'
        WHEN strftime('%m', documentDate) IN ('09', '10', '11') THEN 'autumn'
        ELSE 'winter'
      END`.as("season"),
      db.fn.count("documentId").as("count"),
    ])
    .where("caseName", "like", `%${keyword}%`)
    .groupBy("season")
    .orderBy(
      sql<number>`CASE
        WHEN season = 'spring' THEN 1
        WHEN season = 'summer' THEN 2
        WHEN season = 'autumn' THEN 3
        ELSE 4
      END`,
    )
    .execute();
  return result.map((row) => ({
    season: row.season!,
    count: Number(row.count),
  }));
}

export async function selectSixSixACases(db: Kysely<DiariumDatabase>): Promise<
  {
    caseId: string;
    documentDate: string;
    caseName: string;
    companyName?: string;
    workplaceName?: string;
    countyName?: string;
    municipalityName?: string;
  }[]
> {
  const result = await db
    .selectFrom("documents")
    .select([
      "caseId",
      "documentDate",
      "caseName",
      "companyName",
      "workplaceName",
      "countyName",
      "municipalityName",
    ])
    .where((eb) =>
      eb.or([
        eb("caseName", "like", "%6:6a%"),
        eb("caseName", "like", "%6-6a%"),
        eb("caseName", "like", "%6 kap. 6 a%"),
        eb("caseSubject", "like", "%6:6a%"),
        eb("caseSubject", "like", "%6-6a%"),
        eb("caseSubject", "like", "%6 kap. 6 a%"),
        eb("documentType", "=", "Begäran från skyddsombud om ingripande"),
      ]),
    )
    .where("documentId", "like", "%-1")
    .orderBy("documentDate")
    .orderBy("caseId")
    .execute();

  return result.map((row) => ({
    caseId: row.caseId,
    documentDate: row.documentDate,
    caseName: row.caseName,
    companyName: row.companyName ?? undefined,
    workplaceName: row.workplaceName ?? undefined,
    countyName: row.countyName ?? undefined,
    municipalityName: row.municipalityName ?? undefined,
  }));
}

export async function latestDocuments(db: Kysely<DiariumDatabase>): Promise<
  {
    documentId: string;
    documentDate: string;
    documentType: string;
    caseName: string;
    companyId?: string;
    companyName?: string;
    created: string;
  }[]
> {
  const result = await db
    .selectFrom("documents")
    .select([
      "documentId",
      "documentDate",
      "documentType",
      "caseName",
      "companyId",
      "companyName",
      "created",
    ])
    .orderBy("created", "desc")
    .limit(8192)
    .execute();
  const documents = result.map((row) => ({
    documentId: row.documentId!,
    documentDate: row.documentDate!,
    documentType: row.documentType!,
    caseName: row.caseName!,
    companyId: row.companyId,
    companyName: row.companyName,
    created: `${row.created}`,
  }));
  return documents;
}
