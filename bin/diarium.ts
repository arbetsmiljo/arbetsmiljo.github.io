#!/usr/bin/env node

import { Command } from "commander";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";
import { fetchDocument } from "@/document";
import { initSchema } from "@/schema";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pkg = JSON.parse(readFileSync(`${__dirname}/../package.json`, "utf8"));

const program = new Command();
console.log(pkg);
program.name(pkg.name).description(pkg.description).version(pkg.name);

program
  .command("fetchDocument")
  .description("Fetch document metadata")
  .argument("<id>", "Document ID")
  .action(async (id) => {
    const data = await fetchDocument(id);
    process.stdout.write(`${JSON.stringify(data, null, 2)}\n`);
  });

program
  .command("initSchema")
  .description("Create a new blank database")
  .option("-f, --filename <filename>", "database filename", "db.sqlite")
  .action(async ({ filename }) => {
    await initSchema(filename);
  });

program.parse(process.argv);
