#!/usr/bin/env node

import { Command } from "commander";
import { parseISO, isFuture } from "date-fns";
import { existsSync } from "fs";
import { initKysely, createDatabase, readDocument, importDocuments } from "../lib/diarium/database";
import { fetchDiariumCase } from "../lib/diarium/case";
import { ingestDiariumDay } from "../lib/diarium/ingestion";
import { fetchDiariumPage } from "../lib/diarium/pagination";
import { generateDateRange } from "../lib/diarium/time";

const program = new Command();
program
  .name("diarium")
  .description("SQLite & web scraper tooling for work environment data");

program
  .command("combineDatabases")
  .description("Merge multiple databases")
  .argument("<src...>", "one or more source database filenames")
  .requiredOption("-d, --dst <dst>", "destination database filename")
  .action(async (srcFiles: string[], { dst }) => {
    const missingSrcFiles = srcFiles.filter((src) => !existsSync(src));

    if (missingSrcFiles.length > 0) {
      throw new Error(
        `Missing source database file(s): ${missingSrcFiles.join(", ")}`,
      );
    }

    const db = initKysely(dst);
    await createDatabase(db);
    for (const src of srcFiles) {
      importDocuments(src, dst);
    }
  });

program
  .command("createDatabase")
  .description("Create a new blank database")
  .option("-f, --filename <filename>", "database filename", "db.sqlite")
  .action(async ({ filename }) => {
    const db = initKysely(filename);
    await createDatabase(db);
  });

program
  .command("fetchDiariumCase")
  .description("Fetch case metadata")
  .argument("<id>", "Case ID")
  .action(async (id) => {
    const data = await fetchDiariumCase(id);
    process.stdout.write(`${JSON.stringify(data, null, 2)}\n`);
  });

program
  .command("fetchDiariumPage")
  .description("Fetch metadata for multiple documents")
  .argument("<date>", "Day")
  .argument("<page>", "Page number")
  .action(async (date, page) => {
    const data = await fetchDiariumPage(date, parseInt(page));
    process.stdout.write(`${JSON.stringify(data, null, 2)}\n`);
  });

program
  .command("generateDateRange")
  .description("List days within a given period")
  .argument("<period>", "Week or month")
  .action(async (period) => {
    const dates = generateDateRange(period);
    process.stdout.write(`${JSON.stringify(dates, null, 2)}\n`);
  });

program
  .command("importDocuments")
  .requiredOption("-s, --src <src>", "source database filename")
  .requiredOption("-d, --dst <dst>", "destination database filename")
  .action(async ({ src, dst }) => {
    if (!existsSync(src)) {
      throw new Error(`Missing source database file: ${src}`);
    }

    importDocuments(src, dst);
  });

program
  .command("ingest")
  .description("Download and store documents for a given period")
  .argument("<period>", "Period to ingest")
  .option("-f, --filename <filename>", "database filename", "db.sqlite")
  .option("-m, --ms <ms>", "Delay between requests", "1000")
  .action(async (period, { filename, ms }) => {
    const db = initKysely(filename);
    const dates = generateDateRange(period).filter(
      (date) => !isFuture(parseISO(date)),
    );
    dates.reverse();
    for (const date of dates) {
      await ingestDiariumDay(db, date, parseInt(ms));
    }
  });

program
  .command("readDocument")
  .option("-f, --filename <filename>", "database filename", "db.sqlite")
  .argument("<id>", "Document ID")
  .action(async (id, { filename }) => {
    const db = initKysely(filename);
    const document = await readDocument(db, id);
    console.log(JSON.stringify(document, null, 2));
  });

program.parse(process.argv);
