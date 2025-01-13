import { toString } from "@weborigami/async-tree";

export default async function escapeHtml(output) {
  output = toString(output);
  return output.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
