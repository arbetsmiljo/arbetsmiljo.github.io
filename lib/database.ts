import Database from "better-sqlite3";
import { sql } from "kysely";
import { Generated, Kysely, SqliteDialect } from "kysely";

export type DiariumDocument = {
  documentId: string;
  documentDate: string;
  documentOrigin: string;
  documentType: string;
  caseId: string;
  caseName: string;
  caseSubject: string;
  companyId?: string;
  companyName?: string;
  workplaceId?: string;
  workplaceName?: string;
  countyId?: string;
  countyName?: string;
  municipalityId?: string;
  municipalityName?: string;
  created: Generated<Date>;
};

export interface DiariumDatabase {
  documents: DiariumDocument;
}

export function initKysely(filename: string): Kysely<DiariumDatabase> {
  const database = new Database(filename);
  const dialect = new SqliteDialect({ database });
  const db = new Kysely<DiariumDatabase>({ dialect });
  return db;
}

export async function countDocumentsPerYear(
  db: Kysely<DiariumDatabase>
): Promise<{ date: string; value: number }[]> {
  const result = await db
    .selectFrom("documents")
    .select([
      sql<string>`strftime('%Y', documentDate)`.as("year"),
      db.fn.count("documentId").as("documentCount"),
    ])
    .groupBy(sql`year`)
    .orderBy(sql`year`)
    .execute();
  return result.map(row => ({
    date: row.year!,
    value: Number(row.documentCount),
  }));
}

export async function countCovidTillbudPerEmployer(
  db: Kysely<DiariumDatabase>,
  limit = 20
): Promise<{ name: string; value: number }[]> {
  const result = await db
    .selectFrom("documents")
    .select([
      "companyName",
      sql<number>`count(distinct caseId)`.as("caseCount"),
    ])
    .where(
      sql<boolean>`caseName glob 'Tillbud 2[0-9][0-9][0-9][0-9][0-9][0-9][0-9]*Smitta*'`
    )
    .where("companyName", "is not", null)
    .where("companyName", "!=", "")
    .groupBy("companyName")
    .orderBy(sql`caseCount`, "desc")
    .limit(limit)
    .execute();
  return result.map((row) => ({
    name: row.companyName!,
    value: Number(row.caseCount),
  }));
}

export async function countOlycksfallCasesPerYear(
  db: Kysely<DiariumDatabase>
): Promise<{ date: string; value: number }[]> {
  const result = await db
    .selectFrom("documents")
    .select([
      sql<string>`strftime('%Y', documentDate)`.as("year"),
      sql<number>`count(distinct caseId)`.as("caseCount"),
    ])
    .where((eb) =>
      eb.or([
        eb(sql`lower(caseName)`, "like", "%olycksfall%"),
        eb(sql`lower(caseSubject)`, "like", "%olycksfall%"),
        eb(sql`lower(documentType)`, "like", "%olycksfall%"),
      ])
    )
    .groupBy(sql`year`)
    .orderBy(sql`year`)
    .execute();
  return result.map(row => ({
    date: row.year!,
    value: Number(row.caseCount),
  }));
}

export async function countSixSixACasesPerYear(
  db: Kysely<DiariumDatabase>
): Promise<{ date: string; value: number }[]> {
  const result = await db
    .selectFrom("documents")
    .select([
      sql<string>`strftime('%Y', documentDate)`.as("year"),
      sql<number>`count(distinct caseId)`.as("caseCount"),
    ])
    .where((eb) =>
      eb.or([
        eb(sql`lower(caseName)`, "like", "%6:6a%"),
        eb(sql`lower(caseName)`, "like", "%6-6a%"),
        eb(sql`lower(caseName)`, "like", "%6 kap. 6 a%"),
        eb(sql`lower(caseSubject)`, "like", "%6:6a%"),
        eb(sql`lower(caseSubject)`, "like", "%6-6a%"),
        eb(sql`lower(caseSubject)`, "like", "%6 kap. 6 a%"),
        eb(
          "documentType",
          "=",
          "Begäran från skyddsombud om ingripande"
        ),
      ])
    )
    .groupBy(sql`year`)
    .orderBy(sql`year`)
    .execute();
  return result.map(row => ({
    date: row.year!,
    value: Number(row.caseCount),
  }));
}


export async function countSixSixACasesPerEmployer(
  db: Kysely<DiariumDatabase>,
  limit = 20
): Promise<{ name: string; value: number }[]> {
  const result = await db
    .selectFrom("documents")
    .select([
      "companyName",
      sql<number>`count(distinct caseId)`.as("caseCount"),
    ])
    .where((eb) =>
      eb.or([
        eb(sql`lower(caseName)`, "like", "%6:6a%"),
        eb(sql`lower(caseName)`, "like", "%6-6a%"),
        eb(sql`lower(caseName)`, "like", "%6 kap. 6 a%"),
        eb(sql`lower(caseSubject)`, "like", "%6:6a%"),
        eb(sql`lower(caseSubject)`, "like", "%6-6a%"),
        eb(sql`lower(caseSubject)`, "like", "%6 kap. 6 a%"),
        eb(
          "documentType",
          "=",
          "Begäran från skyddsombud om ingripande"
        ),
      ])
    )
    .where("companyName", "is not", null)
    .where("companyName", "!=", "")
    .groupBy("companyName")
    .orderBy("caseCount", "desc")
    .limit(limit)
    .execute();

  return result.map((row) => ({
    name: row.companyName!,
    value: Number(row.caseCount),
  }));
}

export async function countAsbestDocumentsPerYear(
  db: Kysely<DiariumDatabase>
): Promise<{ date: string; value: number }[]> {
  const result = await db
    .selectFrom("documents")
    .select([
      sql<string>`strftime('%Y', documentDate)`.as("year"),
      db.fn.count("documentId").as("documentCount"),
    ])
    .where((eb) =>
      eb.or([
        eb(sql`lower(documentType)`, "like", "%asbest%"),
        eb(sql`lower(caseName)`, "like", "%asbest%"),
        eb(sql`lower(caseSubject)`, "like", "%asbest%"),
      ])
    )
    .groupBy(sql`year`)
    .orderBy(sql`year`)
    .execute();
  return result.map(row => ({
    date: row.year!,
    value: Number(row.documentCount),
  }));
}

export async function countCovidTillbudPerMonth(
  db: Kysely<DiariumDatabase>
): Promise<{ date: string; value: number }[]> {
  const result = await db
    .selectFrom("documents")
    .select([
      sql<string>`substr(caseName, instr(caseName, 'Tillbud ') + 8, 6)`.as(
        "yearMonth"
      ),
      sql<number>`count(distinct caseId)`.as("caseCount"),
    ])
    .where(
      sql<boolean>`caseName glob 'Tillbud 2[0-9][0-9][0-9][0-9][0-9][0-9][0-9]*Smitta*'`
    )
    .groupBy(sql`yearMonth`)
    .orderBy(sql`yearMonth`)
    .execute();

  const counts = new Map<string, number>();
  for (const row of result) {
    const ym = row.yearMonth;
    if (!ym || ym.length !== 6) continue;
    counts.set(ym, Number(row.caseCount));
  }

  const keys = [...counts.keys()].sort();
  if (keys.length === 0) return [];

  // Fill every month between the first and last report with zeroes so the
  // monthly bar chart has a continuous time axis.
  const toIndex = (ym: string) =>
    Number(ym.slice(0, 4)) * 12 + (Number(ym.slice(4, 6)) - 1);
  const fromIndex = (i: number) =>
    `${Math.floor(i / 12)}-${String((i % 12) + 1).padStart(2, "0")}`;

  const start = toIndex(keys[0]);
  const end = toIndex(keys[keys.length - 1]);

  const data: { date: string; value: number }[] = [];
  for (let i = start; i <= end; i++) {
    const ym = `${Math.floor(i / 12)}${String((i % 12) + 1).padStart(2, "0")}`;
    data.push({ date: fromIndex(i), value: counts.get(ym) ?? 0 });
  }
  return data;
}

export async function countInspektionDocumentsPerYear(
  db: Kysely<DiariumDatabase>
): Promise<{ date: string; value: number }[]> {
  const result = await db
    .selectFrom("documents")
    .select([
      sql<string>`strftime('%Y', documentDate)`.as("year"),
      db.fn.count("documentId").as("documentCount"),
    ])
    .where((eb) =>
      eb.or([
        eb(sql`lower(documentType)`, "like", "%inspektion%"),
        eb(sql`lower(caseName)`, "like", "%inspektion%"),
        eb(sql`lower(caseSubject)`, "like", "%inspektion%"),
      ])
    )
    .groupBy(sql`year`)
    .orderBy(sql`year`)
    .execute();
  return result.map(row => ({
    date: row.year!,
    value: Number(row.documentCount),
  }));
}
