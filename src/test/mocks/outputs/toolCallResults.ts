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
    message: "Expected type: string, received type: number",
  },
  {
    path: ["location", "state"],
    message: "Expected type: string, received type: undefined",
  },
  {
    path: ["location", "zipCode"],
    message: "Expected type: string, received type: number",
  },
  {
    path: ["location", "country"],
    message: "Unknown key: country",
  },
];

export { weatherToolFailedCall, weatherToolNotOkay };
