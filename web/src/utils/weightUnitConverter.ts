export const KG_TO_LBS_RATIO = 2.2046226218488;

export const convertWeight = (value: number, toUnit: "kg" | "lbs"): number => {
  if (toUnit === "lbs") {
    return value * KG_TO_LBS_RATIO;
  }
  return value / KG_TO_LBS_RATIO;
};

export const convertFromKg = (value: number, toUnit: "kg" | "lbs"): number => {
  if (toUnit === "lbs") {
    return value * KG_TO_LBS_RATIO;
  }
  return value;
};

export const convertToKg = (value: number, fromUnit: "kg" | "lbs"): number => {
  if (fromUnit === "lbs") {
    return value / KG_TO_LBS_RATIO;
  }
  return value;
};

export const formatWeightDisplay = (value: number, unit: "kg" | "lbs") => {
  return `${value} ${unit}`;
};
