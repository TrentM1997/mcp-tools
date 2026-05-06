import type { Issue, Path } from "../types/result.js";

function formatPath(path: Path): string {
  if (path.length === 0) {
    return "<root>";
  }

  return path.reduce<string>((result, segment) => {
    const stringSegment = String(segment);

    if (typeof segment === "number") {
      return `${result}[${stringSegment}]`;
    }

    return result ? `${result}.${stringSegment}` : stringSegment;
  }, "");
}

function formatIssue(issue: Issue): string {
  return `${formatPath(issue.path)}: ${issue.message}`;
}

function createPathErrorMessage(issues: Issue[]): string {
  return issues.map(formatIssue).join("; ");
}
