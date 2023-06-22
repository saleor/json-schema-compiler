import * as Ajv from "ajv";
import type { Options } from "ajv";
import * as AjvFormats from "ajv-formats";

export const getAjv = (options?: Options) => {
	const ajv = AjvFormats.default(new Ajv.default(options));
	ajv.addKeyword("tsType");
	return ajv;
};
