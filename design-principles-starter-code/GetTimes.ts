// 1. What is the biggest design principle violation in the code below.
// This code contains a lot of duplication, which violates the principle of avoiding duplication.
// In addition, it needs more Decomposition.
// 2. Refactor the code to improve its design.

type Dictionary = {
  [index: string]: string;
};

type Times = {
  interval: number;
  duration: number;
  departure: number;
};

function getValue(propTitle: string, props: Dictionary) {
  let valueString: string = props[propTitle];
  if (!valueString) {
    throw new Error(`missing ${propTitle}`);
  }
  let value: number = parseInt(valueString);
  if (value <= 0) {
    throw new Error("interval must be > 0");
  }
  return value;
}

function getTimes(props: Dictionary): Times {
  let value: number;

  let interval = getValue("interval", props);

  value = getValue("duration", props);
  if (value % interval != 0) {
    throw new Error("duration % interval != 0");
  }
  let duration = value;

  value = getValue("departure", props);
  if (value % interval != 0) {
    throw new Error("departure % interval != 0");
  }
  let departure = value;

  return { interval, duration, departure };
}
