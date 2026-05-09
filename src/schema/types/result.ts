import type { ExpectedRuntimeType, JSONLiteral } from "./schema.js";

type Path = Array<string | number>;

type Issue =
  | {
      path: Path;
      code: "invalid_type";
      expected: ExpectedRuntimeType;
      received: string;
      message: string;
    }
  | {
      path: Path;
      code: "invalid_literal";
      expected: JSONLiteral;
      received: unknown;
      message: string;
    }
  | {
      path: Path;
      code: "unknown_key";
      key: string;
      message: string;
    };

type ParseSuccessResult<T> = { ok: true; value: T };

type ParseFailedResult = { ok: false; issues: Issue[] };

type ParseResult<T> = ParseSuccessResult<T> | ParseFailedResult;

export type { ParseResult, ParseFailedResult, ParseSuccessResult, Issue, Path };
