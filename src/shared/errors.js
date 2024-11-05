import * as R from "ramda";

export const ErrorHandler = R.thunkify((error) => {
  console.error(error);
  process.exit(1);
});

export const FileInvalidError = (type) => ErrorHandler(`Invalid ${type} file. Please check format and try again`);
export const FileEmptyError = (file) => ErrorHandler(`${file} file is empty.`)
export const FileNotExistsError = (file) => ErrorHandler(`${file} file doesn't exist/invalid`);
export const FileReadAccessError = (file) => ErrorHandler(`${file} file is not readable/accessible`);
export const RequiredError = (errorMsg) => ErrorHandler(`${errorMsg} are required.`);
export const RoutesInvalidError = ErrorHandler("Routes file has invalid/missing properties.");
