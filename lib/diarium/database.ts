import sqlite3 from "sqlite3";
import fs from "fs";
import { type DiariumCase, DiariumCaseSchema } from "./case";
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
      documentId TEXT PRIMARY KEY NOT NULL,
      documentDate TEXT NOT NULL,
      documentOrigin TEXT NOT NULL,
      documentType TEXT NOT NULL,
      caseId TEXT NOT NULL,
      caseName TEXT NOT NULL,
      caseSubject TEXT NOT NULL,
      companyId TEXT,
      companyName TEXT,
      workplaceId TEXT,
      workplaceName TEXT,
      countyId TEXT,
      countyName TEXT,
      municipalityId TEXT,
      municipalityName TEXT,
      created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`);
}

export async function writeDocument(
  filename: string,
  diariumDocument: object,
  diariumCase: object,
): Promise<void> {
  if (!fs.existsSync(filename)) {
    throw new Error(`Database file not found: ${filename}`);
  }

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

  const database = new sqlite3.Database(filename);
  database.run(
    `
    INSERT INTO documents (
      documentId,
      documentDate,
      documentOrigin,
      documentType,
      caseId,
      caseName,
      caseSubject,
      companyId,
      companyName,
      workplaceId,
      workplaceName,
      countyId,
      countyName,
      municipalityId,
      municipalityName
    ) VALUES (
      $documentId,
      $documentDate,
      $documentOrigin,
      $documentType,
      $caseId,
      $caseName,
      $caseSubject,
      $companyId,
      $companyName,
      $workplaceId,
      $workplaceName,
      $countyId,
      $countyName,
      $municipalityId,
      $municipalityName
    );`,
    {
      $documentId: validatedDocument.documentId,
      $documentDate: validatedDocument.documentDate,
      $documentOrigin: validatedDocument.documentOrigin,
      $documentType: validatedDocument.documentType,
      $caseId: validatedCase.caseId,
      $caseName: validatedCase.caseName,
      $caseSubject: validatedCase.caseSubject,
      $companyId: validatedCase.companyId,
      $companyName: validatedCase.companyName,
      $workplaceId: validatedCase.workplaceId,
      $workplaceName: validatedCase.workplaceName,
      $countyId: validatedCase.countyId,
      $countyName: validatedCase.countyName,
      $municipalityId: validatedCase.municipalityId,
      $municipalityName: validatedCase.municipalityName,
    },
  );
}

export async function readDocument(filename: string, id: string): Promise<any> {
  if (!fs.existsSync(filename)) {
    throw new Error(`Database file not found: ${filename}`);
  }
  const database = new sqlite3.Database(filename);
  return new Promise((resolve, reject) => {
    database.get(
      `SELECT * FROM documents WHERE documentId = $id;`,
      {
        $id: id,
      },
      (error, row) => {
        if (error) {
          reject(error);
        } else {
          resolve(row);
        }
      },
    );
  });
}
