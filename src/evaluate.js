import { ori } from "@weborigami/origami";

// Given an expression, simulate its evaluation on the command line
export default async function evaluate(expression, files) {
  const processed = processQuotes(expression);

  if (processed.startsWith("serve")) {
    // Fake server
    return `Server running at http://localhost:5000. Press Ctrl+C to stop.`;
  } else if (processed.startsWith("copy")) {
    // Fake copy
    return "";
  }

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
