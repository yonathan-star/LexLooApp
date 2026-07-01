export function fieldValue(fields: Record<string, string>, patterns: string[]) {
  const entries = Object.entries(fields);
  for (const pattern of patterns) {
    const match = entries.find(([key]) => key.toLowerCase().includes(pattern.toLowerCase()));
    if (match?.[1]) return match[1];
  }
  return "";
}

export function emailFrom(fields: Record<string, string>) {
  return fieldValue(fields, ["email", "mail"]);
}

export function passwordFrom(fields: Record<string, string>) {
  return fieldValue(fields, ["password", "pass"]);
}

export function nameFrom(fields: Record<string, string>) {
  return fieldValue(fields, ["name", "display", "child"]);
}

export function codeFrom(fields: Record<string, string>) {
  return fieldValue(fields, ["code", "tile", "lex"]);
}
