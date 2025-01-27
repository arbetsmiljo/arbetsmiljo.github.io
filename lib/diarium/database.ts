import sqlite3 from "sqlite3";
import fs from "fs";

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
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      document_code TEXT NOT NULL
    );
`);
}
