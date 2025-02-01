import fs from "fs";
import * as R from "ramda";
import { FileChecker, JSONReader } from "../shared/io.js";
import { propLookup, checkIfNotEmpty } from "../shared/utils.js";
import { RequiredError, RoutesInvalidError } from "../shared/errors.js";

const certKeyPathLookup = (obj) => !!(propLookup("certPath")(obj) && propLookup("keyPath")(obj));

const checkConfigHost = (args) => propLookup("host")(args.configs);
const checkConfigPort = (args) => propLookup("port")(args.configs);

const checkRoutesPredicate = R.where({
  method: R.includes(R.__, ["get", "post", "delete", "put"]),
  path: checkIfNotEmpty,
  action: R.includes(R.__, ["sendFile", "json", "redirect"]),
  actionValue: checkIfNotEmpty,
});

const checkRoutes = R.unless(checkRoutesPredicate, RoutesInvalidError);

export const checkRequiredArgsForHTTPS = R.ifElse(certKeyPathLookup, R.identity, RequiredError("For HTTPS mode, --cert-path & --key-path arguments"));

function processConfigHostPort(args){
  return R.pipe(
    R.when(checkConfigHost, (args)=>({...args, host: args.configs.host})),
    R.when(checkConfigPort, (args)=>({...args, port: args.configs.port}))
  )(args)
}

function processConfigCertKeyPath(args) {
  let {
    configs: { certPath, keyPath },
  } = args;
  return { ...args, certPath: FileChecker("SSL Certificate in Config")(certPath), keyPath: FileChecker("Private Key in Config")(keyPath) };
} //overwrite args from cli

const processCertKeyPath = R.ifElse(
  certKeyPathLookup,
  R.identity,
  R.when((args) => certKeyPathLookup(args.configs), processConfigCertKeyPath)
); //check in cli args first, if missing, then check with configs.

function processConfig(args) {
  let { configPath } = args;
  return { ...args, configs: JSONReader("Server Config")(configPath) };
}

function processRoutes(args) {
  let { routePath } = args;
  return { ...args, routes: R.pipe(JSONReader("Routes Config"), R.when(checkIfNotEmpty, R.map(checkRoutes)))(routePath) };
}

export const ProcessInput = R.pipe(processConfig, processCertKeyPath, processConfigHostPort, processRoutes);
