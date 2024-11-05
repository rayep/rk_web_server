import * as R from "ramda";
import { default as NodePath } from "path";

export const getAbsolutePath = (path) => (NodePath.isAbsolute(path) ? path : NodePath.resolve(path));
export const checkIfNotEmpty = (value) => R.isNotNil(value) && R.isNotEmpty(value);
export const propLookup = (prop) => R.prop(prop);
