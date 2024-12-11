import { slug } from "@weborigami/origami";

export default function name(text) {
  // Split on spaces and punctuation
  const words = text.split(/[\s\.,]+/);
  // Take the first 10 words
  const first10 = words.slice(0, 10);
  // Join them back together
  const joined = first10.join(" ");
  // Slugify the text
  return slug(joined);
}
