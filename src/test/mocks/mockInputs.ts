import { version } from "typescript";

const exampleLocation = {
  city: "Clinton",
  state: "Illinois",
  zipCode: "61727",
};

const weatherToolInput = {
  id: "i-1235161355ui54",
  verbose: true,
  location: exampleLocation,
};

const failureTestInput = {
  id: "i-1235161355ui56",
  verbose: true,
  location: {
    country: "Mexico",
    city: 77,
    zipCode: 90999,
  },
};

export { weatherToolInput, failureTestInput };
