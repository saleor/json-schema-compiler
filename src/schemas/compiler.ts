import * as AjvStandalone from "ajv/dist/standalone";
import type { AnySchema, AnySchemaObject } from "ajv";
import { compile } from "json-schema-to-typescript";
import { getAjv } from "./ajv";
import { type JSONValue } from "./types";

type JSONSchema4 = Parameters<typeof compile>[0];

const getAjvForCodegen = (definitionsJson?: AnySchema) => {
	const ajv = getAjv({
		coerceTypes: true,
		code: {
			source: true,
			esm: true,
			optimize: true,
		},
		loadSchema(uri) {
			// @todo is this safe?
			return fetch(uri).then((res) => res.json() as Promise<AnySchemaObject>);
		},
	});
	if (definitionsJson) {
		ajv.addSchema(definitionsJson);
	}
	return ajv;
};

export async function compileSchemaToTypes(
	schemaName: string,
	schema: JSONValue,
	definitionsDir: string,
) {
	const types = await compile(schema as JSONSchema4, schemaName, {
		unknownAny: true,
		cwd: definitionsDir,
	});
	const typesWithDefaultExport = [
		`import type { ValidateFunction } from "ajv";`,
		`import type { JSONObject } from '../../types';`,
		types,
		`declare const Validate${schemaName}: ValidateFunction<${schemaName}>;`,
		`export default Validate${schemaName};`,
	].join("\n");
	return typesWithDefaultExport;
}

export async function compileSchemaToJs(
	_schemaName: string,
	schema: JSONValue,
	definitionsJson?: AnySchema,
) {
	const ajv = getAjvForCodegen(definitionsJson);
	const validate = await ajv.compileAsync(schema as AnySchemaObject);
	const sourceCode = AjvStandalone.default(ajv, validate);
	return `/* c8 ignore start */\n` + sourceCode;
}
