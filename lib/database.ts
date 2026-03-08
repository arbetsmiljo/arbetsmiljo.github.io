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
