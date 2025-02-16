import type { Connection } from "mysql2/promise";
import type { Kysely } from "kysely";
import ora from "ora-classic";
import {
  type DiariumDatabase,
  fetchDateRange,
  fetchDocumentIds,
  fetchMissingDocumentIds,
  readDocuments,
  writeToMysql,
} from "./database.js";
import { dateRange, delay } from "./time.js";

export async function exportToDolt(
  db: Kysely<DiariumDatabase>,
  dolt: Connection,
): Promise<void> {
  const [min, max] = await fetchDateRange(db);
  const dates = dateRange(min, max);

  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    const daySpinner = ora(` ${date}`).start();
    const documentIds = await fetchDocumentIds(db, date);
    daySpinner.clear();
    daySpinner.start(` ${date} has ${documentIds.length} documents in SQLite`);
    const missingIds = await fetchMissingDocumentIds(dolt, documentIds);
    daySpinner.clear();
    daySpinner.start(
      ` ${date} has ${missingIds.length} documents missing from Dolt`,
    );

    if (missingIds.length === 0) {
      daySpinner.clear();
      daySpinner.succeed(
        ` ${date} 0 of ${documentIds.length} documents copied`,
      );
      continue;
    }

    const documents = await readDocuments(db, missingIds);
    await writeToMysql(dolt, documents);
    daySpinner.clear();
    daySpinner.succeed(
      ` ${date} ${missingIds.length} of ${documentIds.length} documents copied`,
    );
  }
}
