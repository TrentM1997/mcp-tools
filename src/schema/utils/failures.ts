import type { ParseFailedResult, Path, Issue } from "../types/result.js";

function expectedTypeFailure(
  path: Path,
  message: Issue["message"],
): ParseFailedResult {
  return {
    ok: false,
    issues: [{ path, message }],
  };
}

export { expectedTypeFailure };
