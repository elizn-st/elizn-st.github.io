import type { DocumentData } from 'firebase/firestore';

/**
 * Documents in this database are edited by hand in the Firebase Console, so a
 * field can arrive missing, renamed, or with the wrong type picked from the
 * Console's type dropdown. Every read goes through a reader that says which
 * document and which field went wrong, so a bad edit produces a precise
 * message instead of `undefined` reaching the UI as `NaN` or a blank cell.
 */
export class DocumentShapeError extends Error {
  constructor(
    readonly path: string,
    readonly field: string,
    detail: string,
  ) {
    super(`${path}: field "${field}" ${detail}`);
    this.name = 'DocumentShapeError';
  }
}

export interface FieldReader {
  /** Required non-empty string. */
  string(field: string): string;
  /** Optional string; `fallback` when absent, null or empty. */
  optionalString(field: string, fallback: string): string;
  /** Required finite number. A numeric string is accepted and coerced. */
  number(field: string): number;
  /** Optional finite number; `fallback` when absent or null. */
  optionalNumber(field: string, fallback: number): number;
  /** Required boolean. Accepts the strings "true"/"false". */
  boolean(field: string): boolean;
  /** Required string constrained to a known set -- for union types. */
  oneOf<T extends string>(field: string, allowed: readonly T[]): T;
  /** Required array, each element mapped through `item`. */
  array<T>(field: string, item: (value: unknown, index: number) => T): readonly T[];
  /** Raw access, for shapes the helpers above do not cover. */
  raw(field: string): unknown;
}

const isMissing = (value: unknown): boolean => value === undefined || value === null;

export function readFields(path: string, data: DocumentData): FieldReader {
  const fail = (field: string, detail: string): never => {
    throw new DocumentShapeError(path, field, detail);
  };

  const describe = (value: unknown): string =>
    Array.isArray(value) ? 'an array' : `a ${typeof value} (${JSON.stringify(value)})`;

  const reader: FieldReader = {
    raw: (field) => data[field],

    string(field) {
      const value = data[field];
      if (isMissing(value)) return fail(field, 'is missing');
      if (typeof value !== 'string')
        return fail(field, `should be a string but is ${describe(value)}`);
      if (!value.trim()) return fail(field, 'is empty');
      return value;
    },

    optionalString(field, fallback) {
      const value = data[field];
      if (isMissing(value) || value === '') return fallback;
      if (typeof value !== 'string')
        return fail(field, `should be a string but is ${describe(value)}`);
      return value;
    },

    number(field) {
      const value = data[field];
      if (isMissing(value)) return fail(field, 'is missing');
      // The Console's type dropdown makes "string" an easy mis-pick for a
      // numeric field, so a numeric string is coerced rather than rejected.
      const numeric = typeof value === 'string' ? Number(value) : value;
      if (typeof numeric !== 'number' || !Number.isFinite(numeric)) {
        return fail(field, `should be a number but is ${describe(value)}`);
      }
      return numeric;
    },

    optionalNumber(field, fallback) {
      if (isMissing(data[field])) return fallback;
      return reader.number(field);
    },

    boolean(field) {
      const value = data[field];
      if (isMissing(value)) return fail(field, 'is missing');
      if (typeof value === 'boolean') return value;
      if (value === 'true') return true;
      if (value === 'false') return false;
      return fail(field, `should be a boolean but is ${describe(value)}`);
    },

    oneOf<T extends string>(field: string, allowed: readonly T[]): T {
      const value = reader.string(field);
      if (!allowed.includes(value as T)) {
        return fail(field, `is "${value}" but must be one of ${allowed.join(', ')}`);
      }
      return value as T;
    },

    array<T>(field: string, item: (value: unknown, index: number) => T): readonly T[] {
      const value = data[field];
      if (isMissing(value)) return fail(field, 'is missing');
      if (!Array.isArray(value)) return fail(field, `should be an array but is ${describe(value)}`);
      return value.map(item);
    },
  };

  return reader;
}
