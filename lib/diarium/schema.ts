import sqlite3 from "sqlite3";

/**
 * Creates a new blank database
 */
export async function initSchema(filename: string): Promise<void> {
  const database = new sqlite3.Database(filename);
  database.exec(`
    CREATE TABLE documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      document_code TEXT NOT NULL
    );
`);
}
