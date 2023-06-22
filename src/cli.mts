#!/usr/bin/env node

import { Command } from "@commander-js/extra-typings";
import Pkg from "../package.json";
import { run } from "./schemas/compile";

console.log(`
  ____        _                   ____       _                             ____                      _ _           
/ ___|  __ _| | ___  ___  _ __  / ___|  ___| |__   ___ _ __ ___   __ _   / ___|___  _ __ ___  _ __ (_) | ___ _ __ 
\\___ \\ / _' | |/ _ \\/ _ \\| '__| \\___ \\ / __| '_ \\ / _ \\ '_ ' _ \\ / _' | | |   / _ \\| '_ ' _ \\| '_ \\| | |/ _ \\ '__|
 ___) | (_| | |  __/ (_) | |     ___) | (__| | | |  __/ | | | | | (_| | | |__| (_) | | | | | | |_) | | |  __/ |   
|____/ \\__,_|_|\\___|\\___/|_|    |____/ \\___|_| |_|\\___|_| |_| |_|\\__,_|  \\____\\___/|_| |_| |_| .__/|_|_|\\___|_|   
                                                                                             |_|                  
`);

const program = new Command();

program.name("saleor-schema-compiler").version(Pkg.version);

program
	.command("compile")
	.argument("<dirname>")
	.option("-d, --definitions <filepath>", "Path to the definitions.json file")
	.action((dirname, { definitions }) => {
		return run(dirname, definitions);
	});

program.parse(process.argv);
