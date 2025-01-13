export default async function processQuotes(text) {
  // If the whole text is quoted, remove the quotes
  if (text.startsWith(`"`) && text.endsWith(`"`)) {
    return text.slice(1, -1);
  }
  // Replace any escaped quotes with just the quote
  return text.replace(/\\"/g, `"`);
}
