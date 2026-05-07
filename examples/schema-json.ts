import { s } from "mcp-tools";

const SearchInput = s.object({
  query: s.string(),
  page: s.optional(s.number()),
  tags: s.array(s.string()),
  id: s.union([s.string(), s.number()]),
  mode: s.literal("search"),
});

const jsonSchema = SearchInput.toJSONSchema();

console.dir(jsonSchema, { depth: null });
