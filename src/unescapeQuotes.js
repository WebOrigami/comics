export default async function unescapeQuotes(text) {
  return text.replace(/\\"/g, `"`);
}
