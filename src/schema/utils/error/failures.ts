import type { ParseFailedResult, Path, Issue } from "../../types/result.js";
import type { ExpectedRuntimeType, JSONLiteral } from "../../types/schema.js";

type LiteralValue = string | number | boolean;

function expectedLiteralFailure(
  path: Path,
  expected: LiteralValue,
  input: unknown,
): ParseFailedResult {
  return {
    ok: false,
    issues: [
      {
        path,
        code: "invalid_literal",
        expected: expected,
        received: input,
        message: `Expected literal: ${String(expected)}, received: ${input}`,
      },
    ],
  };
}

function expectedEnumFailure(
  path: Path,
  expected: readonly JSONLiteral[],
  input: unknown,
): ParseFailedResult {
  return {
    ok: false,
    issues: [
      {
        path,
        code: "invalid_enum",
        expected: expected,
        received: input,
        message: `Expected one of the following enumerations: ${String(expected.join(", "))}, received: ${input}`,
      },
    ],
  };
}

function expectedTypeFailure(
  path: Path,
  expectedType: ExpectedRuntimeType,
  input: unknown,
): ParseFailedResult {
  const received = getReceivedType(input);

  return {
    ok: false,
    issues: [
      {
        path,
        code: "invalid_type",
        expected: expectedType,
        received: received,
        message: `Expected type: ${expectedType}, received type: ${received}`,
      },
    ],
  };
}

function getReceivedType(input: unknown): string {
  if (input === null) {
    return "null";
  }

  if (Array.isArray(input)) {
    return "array";
  }

  return typeof input;
}

function formatIssuesPath(path: Path) {
  const hasIssues = path.length > 0;

  switch (hasIssues) {
    case false: {
      return "<root>";
    }

    case true: {
      return formatPath(path);
    }
  }
}

function formatPath(path: Path): string {
  return path.reduce<string>((prev, segment) => {
    if (typeof segment === "number") {
      return `${prev}[${segment}]`;
    }

    return prev ? `${prev}.${segment}` : segment;
  }, "");
}

function formatIssue(issue: Issue): string {
  return `${formatIssuesPath(issue.path)}: ${issue.message}`;
}

function createPathErrorMessage(issues: Issue[]): string {
  return issues.map(formatIssue).join("; ");
}

export {
  expectedTypeFailure,
  formatIssuesPath,
  createPathErrorMessage,
  expectedLiteralFailure,
  expectedEnumFailure,
};
