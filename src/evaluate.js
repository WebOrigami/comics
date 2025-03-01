import { ori } from "@weborigami/origami";

// Given an expression, simulate its evaluation on the command line
export default async function evaluate(expression, files) {
  // Remove "ori" from the start
  expression = expression.replace(/^ori\s?/, "");

  const processed = processQuotes(expression);

  // Evaluate the expression
  const result = await ori.call(files, processed);
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
