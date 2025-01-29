#!/usr/bin/env node

import { Command } from "commander";
import { readFileSync } from "fs";
import { createDatabase, readDocument } from "./database";
import { fetchDiariumCase } from "./case";
import { ingestDiariumDay } from "./ingestion";
import { fetchDiariumPage } from "./pagination";
import { generateDateRange } from "./time";

const pkg = JSON.parse(readFileSync(`${__dirname}/../package.json`, "utf8"));

const program = new Command();
program.name(pkg.name).description(pkg.description).version(pkg.name);

program
  .command("createDatabase")
  .description("Create a new blank database")
  .option("-f, --filename <filename>", "database filename", "db.sqlite")
  .action(async ({ filename }) => {
    await createDatabase(filename);
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
    const dates = generateDateRange(period);
    for (const date of dates) {
      await ingestDiariumDay(date, filename, parseInt(ms));
    }
  });

program
  .command("readDocument")
  .option("-f, --filename <filename>", "database filename", "db.sqlite")
  .argument("<id>", "Document ID")
  .action(async (id, { filename }) => {
    const document = await readDocument(filename, id);
    console.log(JSON.stringify(document, null, 2));
  });

program.parse(process.argv);
