import { toString } from "@weborigami/async-tree";

export default async function escapeHtml(html) {
  html = toString(html);
  return html.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
