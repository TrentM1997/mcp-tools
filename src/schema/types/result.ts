type Path = Array<string | number>;

type IssueMessage = string;

type Issue = {
  path: Path;
  message: IssueMessage;
};

type ParseSuccessResult<T> = { ok: true; value: T };

type ParseFailedResult = { ok: false; issues: Issue[] };

type ParseResult<T> = ParseSuccessResult<T> | ParseFailedResult;

export type { ParseResult, ParseFailedResult, ParseSuccessResult, Issue, Path };
