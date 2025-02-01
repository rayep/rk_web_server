import * as R from "ramda";
import express from "express";
import morgan from "morgan";
import https from "https";
import { readFileSync } from "fs";
import { getAbsolutePath } from "../shared/utils.js";
import { checkRequiredArgsForHTTPS } from "./inputProcess.js";

const createHttpsServerOptions = (args) => {
  let { certPath, keyPath } = args;
  return { ...args, cert: readFileSync(certPath), key: readFileSync(keyPath) };
};

const createExpressApp = (args) => {
  return { ...args, app: express() };
};

const addLogging = (args) => {
  let { app, log } = args;
  if (log) {
    morgan.token("protocol", (req, res) => req.protocol);
    app.use(morgan(":remote-addr - :method :protocol://:req[host]:url HTTP/:http-version - :status"));
  }
  return { ...args, app };
};

const addStaticServe = (args) => {
  let { app, dir } = args;
  app.use(express.static(dir));
  return { ...args, app };
};

const addRoutes = (args) => {
  let { routes, app } = args;
  routes?.map((route) => {
    let { method, path, action, actionValue } = route;
    if (action === "sendFile") {
      app[method](path, (req, res) => {
        res[action](getAbsolutePath(actionValue));
      });
    }
    app[method](path, (req, res) => {
      res[action](actionValue);
    });
  });
  return { ...args, app };
};

const addOptionTrustProxy = (args) => {
  let { app } = args;
  app.set("trust proxy", true);
  return { ...args, app };
}

const createHttpsServer = (args) => {
  let { app, cert, key } = args;
  return { ...args, server: https.createServer({ cert, key }, app) };
};

export const startSecureServer = (args) => {
  let { server, host, port } = args;
  server.listen(port, host, () => {
    console.log(`\nHTTPS Server has been started on https://${host}:${port}\n`);
  });
};

export const startServer = (args) => {
  let { app, host, port } = args;
  app.listen(port, host, () => {
    console.log(`\nHTTP Server has been started on http://${host}:${port}\n`);
  });
};

export const createServer = R.pipe(createExpressApp, addLogging, addStaticServe, addRoutes, addOptionTrustProxy);

export const createSecureServer = R.pipe(checkRequiredArgsForHTTPS, createHttpsServerOptions, createServer, createHttpsServer);
