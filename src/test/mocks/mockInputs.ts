import { idText, version } from "typescript";

const clinton = {
  city: "Clinton",
  state: "Illinois",
  zipCode: "61727",
};

const bloomington = {
  city: "Bloomington",
  state: "Illinois",
  zipCode: "61704",
};

const weatherClinton = {
  id: crypto.randomUUID(),
  verbose: true,
  location: clinton,
};

const weatherBloomington = {
  id: crypto.randomUUID(),
  verbose: false,
  location: bloomington,
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

export { weatherClinton, failureTestInput, weatherBloomington };
