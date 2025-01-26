#!/usr/bin/env node

import { Command } from "commander";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";
import { version } from "./version";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pkg = JSON.parse(readFileSync(`${__dirname}/../package.json`, "utf8"));

const program = new Command();
program.name(pkg.name).description("Starter Node project").version(pkg.name);

program
  .command("version")
  .description("Show version")
  .action(async () => {
    process.stdout.write(`${await version()}\n`);
  });

program.parse(process.argv);
