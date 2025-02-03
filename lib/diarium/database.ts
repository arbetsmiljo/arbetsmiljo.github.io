import Database from "better-sqlite3";
import { Generated, Kysely, SqliteDialect, sql } from "kysely";
import { type DiariumCase, DiariumCaseSchema } from "./case";
import { type DiariumDocument, DiariumDocumentSchema } from "./document";

type DiariumDocumentsTable = DiariumDocument &
  DiariumCase & {
    created: Generated<Date>;
  };

export interface DiariumDatabase {
  documents: DiariumDocumentsTable;
}

export function initKysely(filename: string): Kysely<DiariumDatabase> {
  const database = new Database(filename);
  const dialect = new SqliteDialect({ database });
  const db = new Kysely<DiariumDatabase>({ dialect });
  return db;
}

/**
 * Creates a new blank database
 */
export async function createDatabase(
  db: Kysely<DiariumDatabase>,
): Promise<void> {
  await db.schema
    .createTable("documents")
    .addColumn("documentId", "text", (col) => col.primaryKey().notNull())
    .addColumn("documentDate", "text", (col) => col.notNull())
    .addColumn("documentOrigin", "text", (col) => col.notNull())
    .addColumn("documentType", "text", (col) => col.notNull())
    .addColumn("caseId", "text", (col) => col.notNull())
    .addColumn("caseName", "text", (col) => col.notNull())
    .addColumn("caseSubject", "text", (col) => col.notNull())
    .addColumn("companyId", "text")
    .addColumn("companyName", "text")
    .addColumn("workplaceId", "text")
    .addColumn("workplaceName", "text")
    .addColumn("countyId", "text")
    .addColumn("countyName", "text")
    .addColumn("municipalityId", "text")
    .addColumn("municipalityName", "text")
    .addColumn("created", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .execute();
}

export async function writeDocument(
  db: Kysely<DiariumDatabase>,
  diariumDocument: object,
  diariumCase: object,
): Promise<void> {
  let validatedDocument: DiariumDocument;
  try {
    validatedDocument = DiariumDocumentSchema.parse(diariumDocument);
  } catch (error) {
    console.error(diariumDocument);
    throw new Error(`Invalid document: ${error}`);
  }

  let validatedCase: DiariumCase;
  try {
    validatedCase = DiariumCaseSchema.parse(diariumCase);
  } catch (error) {
    console.error(diariumCase);
    throw new Error(`Invalid case: ${error}`);
  }

  await db
    .insertInto("documents")
    .values({
      documentId: validatedDocument.documentId,
      documentDate: validatedDocument.documentDate,
      documentOrigin: validatedDocument.documentOrigin,
      documentType: validatedDocument.documentType,
      caseId: validatedCase.caseId,
      caseName: validatedCase.caseName,
      caseSubject: validatedCase.caseSubject,
      companyId: validatedCase.companyId,
      companyName: validatedCase.companyName,
      workplaceId: validatedCase.workplaceId,
      workplaceName: validatedCase.workplaceName,
      countyId: validatedCase.countyId,
      countyName: validatedCase.countyName,
      municipalityId: validatedCase.municipalityId,
      municipalityName: validatedCase.municipalityName,
    })
    .execute();
}

export async function readDocument(
  db: Kysely<DiariumDatabase>,
  id: string,
): Promise<any> {
  const document = await db
    .selectFrom("documents")
    .selectAll()
    .where("documentId", "=", id)
    .executeTakeFirst();
  return document;
}

export async function countDocuments(
  db: Kysely<DiariumDatabase>,
  documentDate: string,
): Promise<number> {
  const result = await db
    .selectFrom("documents")
    .select(db.fn.count("documentId").as("documentCount"))
    .where("documentDate", "=", documentDate)
    .executeTakeFirst();
  return result?.documentCount ? Number(result.documentCount) : 0;
}
