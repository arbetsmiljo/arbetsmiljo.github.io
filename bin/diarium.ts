#!/usr/bin/env node

import { Command } from "commander";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";
import { fetchDocument } from "@/document";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pkg = JSON.parse(readFileSync(`${__dirname}/../package.json`, "utf8"));

const program = new Command();
program.name(pkg.name).description(pkg.description).version(pkg.name);

program
  .command("fetchDocument")
  .description("Fetch document metadata")
  .argument("<id>", "Document ID")
  .action(async (id) => {
    const data = await fetchDocument(id);
    process.stdout.write(`${JSON.stringify(data, null, 2)}\n`);
  });

program.parse(process.argv);
