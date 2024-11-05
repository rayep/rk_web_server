#!/usr/bin/env node

/* A Simple HTTP/HTTPS server for serving static files */

import * as R from "ramda";
import { program } from "commander";
import { CheckInput } from "./core/inputCheck.js";
import { ProcessInput } from "./core/inputProcess.js";
import { createSecureServer, createServer, startServer, startSecureServer } from "./core/server.js";
import { httpServerMode, httpsServerMode } from "./cli/commands.js";

program.version("1.0.0").name("rkwebserver").description("A Simple HTTP/HTTPS server for serving static files.");

httpServerMode.action((dir, options) => {
  options.mode = 'http'
  let HTTPServer = R.pipe(CheckInput, ProcessInput, createServer, startServer);
  HTTPServer({ dir, options });
});

httpsServerMode.action((dir, options) => {
  options.mode = 'https'
  let HTTPSServer = R.pipe(CheckInput, ProcessInput, createSecureServer, startSecureServer);
  HTTPSServer({ dir, options });
});

program.addCommand(httpServerMode).addCommand(httpsServerMode).parse();
