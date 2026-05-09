const weatherToolFailedCall = {
  ok: false,
  code: "invalid_input",
  reason: "Tool input failed validation",
  formattedIssues:
    "location.city: Expected type: string, received type: number; " +
    "location.state: Expected type: string, received type: undefined; " +
    "location.zipCode: Expected type: string, received type: number; " +
    "location.country: Unknown key: country",
};

const weatherToolNotOkay = [
  {
    path: ["location", "city"],
    code: "invalid_type",
    expected: "string",
    received: "number",
    message: "Expected type: string, received type: number",
  },
  {
    path: ["location", "state"],
    code: "invalid_type",
    expected: "string",
    received: "undefined",
    message: "Expected type: string, received type: undefined",
  },
  {
    path: ["location", "zipCode"],
    code: "invalid_type",
    expected: "string",
    received: "number",
    message: "Expected type: string, received type: number",
  },
  {
    path: ["location", "country"],
    code: "unknown_key",
    key: "country",
    message: "Unknown key: country",
  },
];

export { weatherToolFailedCall, weatherToolNotOkay };
