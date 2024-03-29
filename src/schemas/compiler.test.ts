import { expect, describe, it } from "vitest";
import * as Prettier from "prettier";
import { compileSchemaToJs, compileSchemaToTypes } from "./compiler";

const exampleSchema = {
	$schema: "http://json-schema.org/draft-07/schema",
	type: "object",
	properties: {
		pspReference: { type: "string" },
		data: { type: "object", additionalProperties: true, properties: {} },
		result: {
			anyOf: [
				{ type: "string", const: "CHARGE_SUCCESS" },
				{ type: "string", const: "CHARGE_FAILURE" },
				{ type: "string", const: "CHARGE_REQUESTED" },
				{ type: "string", const: "AUTHORIZATION_SUCCESS" },
				{ type: "string", const: "AUTHORIZATION_FAILURE" },
				{ type: "string", const: "AUTHORIZATION_REQUESTED" },
			],
		},
		amount: { type: "number", minimum: 0 },
		time: { type: "string", format: "date-time" },
		externalUrl: { type: "string" },
		message: { type: "string" },
	},
	required: ["pspReference", "data", "result", "amount", "time", "externalUrl", "message"],
} as const;

describe("JSON schema compiler", () => {
	describe(`compileSchemaToJs`, () => {
		it(`compileSchemaToJs compiles schema to JS code`, async () => {
			const resultCode = await compileSchemaToJs("SchemaName", exampleSchema);
			const formattedCode = Prettier.format(resultCode, { parser: "typescript" });
			expect(formattedCode).toMatchSnapshot();
		});
	});

	describe(`compileSchemaToTypes`, () => {
		it(`compileSchemaToTypes compiles schema to TS types`, async () => {
			expect(await compileSchemaToTypes("SchemaName", exampleSchema, "")).toMatchInlineSnapshot(`
        "import type { ValidateFunction } from \\"ajv\\";
        import type { JSONObject } from '../../types';
        /* eslint-disable */
        /**
         * This file was automatically generated by json-schema-to-typescript.
         * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
         * and run json-schema-to-typescript to regenerate this file.
         */

        export interface SchemaName {
          pspReference: string;
          data: {
            [k: string]: unknown;
          };
          result:
            | \\"CHARGE_SUCCESS\\"
            | \\"CHARGE_FAILURE\\"
            | \\"CHARGE_REQUESTED\\"
            | \\"AUTHORIZATION_SUCCESS\\"
            | \\"AUTHORIZATION_FAILURE\\"
            | \\"AUTHORIZATION_REQUESTED\\";
          amount: number;
          time: string;
          externalUrl: string;
          message: string;
          [k: string]: unknown;
        }

        declare const ValidateSchemaName: ValidateFunction<SchemaName>;
        export default ValidateSchemaName;"
      `);
		});
	});
});
