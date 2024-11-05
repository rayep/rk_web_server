import * as R from "ramda";
import fs from "fs";
import { default as NodePath } from "path";
import { FileEmptyError, FileInvalidError, FileNotExistsError, FileReadAccessError } from "./errors.js";
import { getAbsolutePath, checkIfNotEmpty } from "./utils.js";

const normalizePath = (path) => NodePath.normalize(path);
const transformPath = R.pipe(normalizePath, getAbsolutePath);
const checkIfDirExists = (path) => !!fs.statSync(path, { throwIfNoEntry: false })?.isDirectory();
const checkIfFileExists = (path) => !!fs.statSync(path, { throwIfNoEntry: false })?.isFile();
const checkReadAccess = (path) => {
  try {
    return !fs.accessSync(path, fs.constants.R_OK);
  } catch (err) {
    return false;
  }
};

function PathChecker(existsPredicate, accessPredicate, type) {
  let existsChecker = R.ifElse(existsPredicate, R.identity, FileNotExistsError(type));
  let accessChecker = R.ifElse(accessPredicate, R.identity, FileReadAccessError(type));
  return R.pipe(existsChecker, accessChecker);
}

export const DirChecker = (type) => R.pipe(transformPath, PathChecker(checkIfDirExists, checkReadAccess, type));

export const FileChecker = (type) => R.when(checkIfNotEmpty, R.pipe(transformPath, PathChecker(checkIfFileExists, checkReadAccess, type)));

const JSONParserSafe = (type) => R.tryCatch(JSON.parse, FileInvalidError(type))
const CheckforEmptyResponse = (type) => R.unless(checkIfNotEmpty, FileEmptyError(type))

export const JSONReader = (type) =>
  R.when(checkIfNotEmpty, R.pipe(fs.readFileSync, JSONParserSafe(type), CheckforEmptyResponse(type)));
