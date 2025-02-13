#!/usr/bin/env node

import { Command } from "commander";
import { parseISO, isFuture } from "date-fns";
import { readFileSync } from "fs";
import { initKysely, createDatabase, readDocument } from "./database.js";
import { fetchDiariumCase } from "./case.js";
import { ingestDiariumDay } from "./ingestion.js";
import { fetchDiariumPage } from "./pagination.js";
import { generateDateRange } from "./time.js";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const pkg = JSON.parse(readFileSync(`${__dirname}/../package.json`, "utf8"));

const program = new Command();
program.name(pkg.name).description(pkg.description).version(pkg.name);

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
