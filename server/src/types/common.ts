export type ISODateTimeString = string;
export type DateKey = `${number}-${number}-${number}`;

export type LanguageCode = "en" | "br" | "es";

export type Gender = "male" | "female" | "other";
export type GoalType = "bulk" | "cut" | "maintain";
export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "intense";

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
export type JsonObject = { [key: string]: JsonValue };
export type JsonArray = JsonValue[];

