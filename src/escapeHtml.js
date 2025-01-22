import { toString } from "@weborigami/async-tree";

// Escape HTML output so it can be rendered in the browser
export default async function escapeHtml(output) {
  output = toString(output);
  return output.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
