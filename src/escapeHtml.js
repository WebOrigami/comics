import { isUnpackable } from "@weborigami/async-tree";

export default async function escapeHtml(html) {
  if (isUnpackable(html)) {
    html = await html.unpack();
  }
  return html.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
