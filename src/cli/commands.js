import { Command } from "commander";
import Conf from "conf";
import { configStore } from "../shared/configstore.js";

function optionsHelper(command) {
  command
    .argument("[dir]", "Directory to serve/host", ".")
    .option("-p|--port <port>", "Port to listen", "3000")
    .option("-h|--host <host>", "Hostname/IP address to bind", "localhost")
    .option("-r|--route-path <Path>", "Routes config (JSON) path")
    .option("-c|--config-path <Path>", "Server config (JSON) path")
    .option("--no-log", "Disable request logging");
  return command;
}

function serverConfigAddHelper(mode, command) {
  command
    .command("config-add")
    .description(`Add global server config for '${mode.toUpperCase()}' mode`)
    .argument("[filePath]", "Server config file path (JSON)")
    .action((filePath) => {
      let store = configStore(mode);
      store.set("filePath", filePath);
    })
}

function serverConfigShowHelper(mode, command){
  command
  .command("config-show")
  .description(`Show global server config used by '${mode.toUpperCase()}' mode`)
  .action(() => {
    let store = configStore(mode);
    store.has('filePath') ? console.log(`\n${mode.toUpperCase()} Config FilePath - ${store.get('filePath')}`) : undefined;
  });
}

export const httpServerMode = new Command("http").description("HTTP Server Mode");
optionsHelper(httpServerMode);
serverConfigAddHelper("http", httpServerMode);
serverConfigShowHelper("http", httpServerMode);

export const httpsServerMode = new Command("https")
  .description("HTTPS Server Mode")
  .option("--cert-path <Path>", "SSL certificate (CRT/PEM) path")
  .option("--key-path <Path>", "SSL private key (KEY) path");
optionsHelper(httpsServerMode);
serverConfigAddHelper("https", httpsServerMode);
serverConfigShowHelper("https", httpsServerMode)
