import { scope as scopeFn } from "@weborigami/async-tree";
import { ori } from "@weborigami/origami";

// Given an expression, simulate its evaluation on the command line
export default async function evaluate(expression) {
  const processed = processQuotes(expression);

  // Add the sample files to the scope
  const scope = scopeFn(this);
  const sample = await scope.get("sample");
  const result = await ori.call(sample, processed);
  return result;
}

export function processQuotes(text) {
  // If the whole text is quoted, remove the quotes
  if (text.startsWith(`"`) && text.endsWith(`"`)) {
    return text.slice(1, -1);
  }
  // Replace any escaped quotes with just the quote
  return text.replace(/\\"/g, `"`);
}
