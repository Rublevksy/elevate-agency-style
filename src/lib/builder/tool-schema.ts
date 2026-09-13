/**
 * zod → JSON Schema, for the subset `spec.ts` uses, so the model's tool
 * definition is generated from the same schema that validates its answer. Two
 * hand-maintained copies would drift; this way a field added to the schema is
 * automatically asked for.
 *
 * The JSON Schema only steers the model. Validation is always `parseDraft`.
 */
import { z } from "zod";

type Json = { [k: string]: unknown };

export function toJsonSchema(schema: z.ZodTypeAny): Json {
  const def = schema._def as { typeName: string } & Record<string, unknown>;
  switch (def.typeName) {
    case z.ZodFirstPartyTypeKind.ZodObject: {
      const shape = (schema as z.ZodObject<z.ZodRawShape>).shape;
      const properties: Json = {};
      const required: string[] = [];
      for (const [key, value] of Object.entries(shape)) {
        properties[key] = toJsonSchema(value);
        if (!value.isOptional()) required.push(key);
      }
      return { type: "object", properties, required, additionalProperties: false };
    }
    case z.ZodFirstPartyTypeKind.ZodString: {
      const out: Json = { type: "string" };
      for (const check of (schema as z.ZodString)._def.checks) {
        if (check.kind === "min") out.minLength = check.value;
        if (check.kind === "max") out.maxLength = check.value;
        if (check.kind === "regex") out.pattern = check.regex.source;
      }
      return out;
    }
    case z.ZodFirstPartyTypeKind.ZodEnum:
      return { type: "string", enum: (schema as z.ZodEnum<[string, ...string[]]>).options };
    case z.ZodFirstPartyTypeKind.ZodArray: {
      const arr = schema as z.ZodArray<z.ZodTypeAny>;
      const out: Json = { type: "array", items: toJsonSchema(arr.element) };
      if (arr._def.minLength) out.minItems = arr._def.minLength.value;
      if (arr._def.maxLength) out.maxItems = arr._def.maxLength.value;
      if (arr._def.exactLength) {
        out.minItems = arr._def.exactLength.value;
        out.maxItems = arr._def.exactLength.value;
      }
      return out;
    }
    case z.ZodFirstPartyTypeKind.ZodOptional:
      return toJsonSchema((schema as z.ZodOptional<z.ZodTypeAny>).unwrap());
    case z.ZodFirstPartyTypeKind.ZodDefault:
      return toJsonSchema((schema as z.ZodDefault<z.ZodTypeAny>).removeDefault());
    case z.ZodFirstPartyTypeKind.ZodNumber:
      return { type: "number" };
    default:
      throw new Error(`toJsonSchema: unsupported zod type ${def.typeName}`);
  }
}
