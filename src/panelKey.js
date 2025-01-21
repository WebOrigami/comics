import { trailingSlash, Tree } from "@weborigami/async-tree";
import { slug } from "@weborigami/origami";

/**
 * Given a tree representing a panel, create a slug from the first
 * few words of the narration.
 */
export default async function panelSlug(panelTree) {
  // Take the first few words of the narration
  const panel = await Tree.plain(panelTree);
  const { narration } = panel;
  const words = narration.split(/[\s\.,]+/);
  const text = words.slice(0, 10).join(" ");
  const textSlug = slug(text);
  const result = trailingSlash.toggle(textSlug);
  return result;
}
