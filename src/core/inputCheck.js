import * as R from "ramda";
import { FileChecker, DirChecker } from "../shared/io.js";
import { configStore } from "../shared/configstore.js";

function checkHostDirectory({ dir, options }) {
  return { dir: DirChecker("Host/Serve directory")(dir), ...options };
}

function checkServerConfig(args) {
  let { configPath, mode } = args;
  let store = configStore(mode);
  configPath = configPath ? configPath : store.has("filePath") ? store.get("filePath") : configPath;
  return { ...args, configPath: FileChecker("Server Config")(configPath) };
}

function checkRouteConfig(args) {
  let { routePath } = args;
  return { ...args, routePath: FileChecker("Routes Config")(routePath) };
}

function checkCertKeyPath(args) {
  let { certPath, keyPath } = args;
  return { ...args, certPath: FileChecker("SSL Certificate")(certPath), keyPath: FileChecker("Private Key")(keyPath) };
}

export const CheckInput = R.pipe(checkHostDirectory, checkServerConfig, checkRouteConfig, checkCertKeyPath);
