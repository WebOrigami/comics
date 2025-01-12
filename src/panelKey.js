import { trailingSlash, Tree } from "@weborigami/async-tree";
import { slug } from "@weborigami/origami";

/**
 * Given a tree representing a panel and an index, create a slug that
 * incorporates the index as a three-digit number and the first few words
 * of the narration.
 */
export default async function panelSlug(panelTree, index) {
  const panelNumber = trailingSlash.remove(index).padStart(3, "0");

  // Take the first few words of the narration
  const panel = await Tree.plain(panelTree);
  const { narration } = panel;
  const words = narration.split(/[\s\.,]+/);
  const firstWords = words.slice(0, 10).join(" ");

  const text = `${panelNumber} ${firstWords}`;

  const textSlug = slug(text);
  const result = trailingSlash.toggle(textSlug, trailingSlash.has(index));
  return result;
}
