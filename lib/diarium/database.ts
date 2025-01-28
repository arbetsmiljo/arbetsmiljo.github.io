import sqlite3 from "sqlite3";
import fs from "fs";
import { type DiariumDocument, DiariumDocumentSchema } from "./document";
import z from "zod";

export type DatabaseDocument = DiariumDocument & {
  created: Date;
};

const DatabaseDocumentSchema = DiariumDocumentSchema.extend({
  created: z.preprocess(
    (arg) => (typeof arg == "string" ? new Date(arg) : undefined),
    z.date(),
  ),
});

/**
 * Creates a new blank database
 */
export async function createDatabase(filename: string): Promise<void> {
  if (fs.existsSync(filename)) {
    throw new Error(`Database file already exists: ${filename}`);
  }
  const database = new sqlite3.Database(filename);
  database.exec(`
    CREATE TABLE documents (
      id TEXT PRIMARY KEY NOT NULL,
      created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      documentDate TEXT NOT NULL,
      documentOrigin TEXT NOT NULL,
      documentType TEXT NOT NULL,
      caseCode TEXT NOT NULL,
      caseName TEXT NOT NULL,
      caseSubject TEXT NOT NULL,
      companyCode TEXT,
      companyName TEXT,
      workplaceCode TEXT,
      workplaceName TEXT,
      countyCode TEXT,
      countyName TEXT,
      municipalityCode TEXT,
      municipalityName TEXT
    );
`);
}

export async function writeDocument(
  filename: string,
  document: object,
): Promise<void> {
  if (!fs.existsSync(filename)) {
    throw new Error(`Database file not found: ${filename}`);
  }
  const validatedDocument = DiariumDocumentSchema.parse(document);
  const database = new sqlite3.Database(filename);
  database.run(
    `
    INSERT INTO documents (
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
      municipalityName
    ) VALUES (
      $id,
      $documentDate,
      $documentOrigin,
      $documentType,
      $caseCode,
      $caseName,
      $caseSubject,
      $companyCode,
      $companyName,
      $workplaceCode,
      $workplaceName,
      $countyCode,
      $countyName,
      $municipalityCode,
      $municipalityName
    );`,
    {
      $id: validatedDocument.id,
      $documentDate: validatedDocument.documentDate,
      $documentOrigin: validatedDocument.documentOrigin,
      $documentType: validatedDocument.documentType,
      $caseCode: validatedDocument.caseCode,
      $caseName: validatedDocument.caseName,
      $caseSubject: validatedDocument.caseSubject,
      $companyCode: validatedDocument.companyCode,
      $companyName: validatedDocument.companyName,
      $workplaceCode: validatedDocument.workplaceCode,
      $workplaceName: validatedDocument.workplaceName,
      $countyCode: validatedDocument.countyCode,
      $countyName: validatedDocument.countyName,
      $municipalityCode: validatedDocument.municipalityCode,
      $municipalityName: validatedDocument.municipalityName,
    },
  );
}

export async function readDocument(
  filename: string,
  id: string,
): Promise<DatabaseDocument> {
  if (!fs.existsSync(filename)) {
    throw new Error(`Database file not found: ${filename}`);
  }
  const database = new sqlite3.Database(filename);
  return new Promise((resolve, reject) => {
    database.get(
      `SELECT * FROM documents WHERE id = $id;`,
      {
        $id: id,
      },
      (error, row) => {
        if (error) {
          reject(error);
        } else {
          const document = DatabaseDocumentSchema.parse(
            row,
          ) as DatabaseDocument;
          resolve(document);
        }
      },
    );
  });
}
