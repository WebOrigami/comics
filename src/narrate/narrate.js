import { Tree } from "@weborigami/async-tree";
import tts from "./tts.js";

const voices = {
  Alice: "shimmer",
  Bob: "echo",
};

// Function to call the OpenAI Text-to-Speech API
export default async function narrate(panel) {
  const data = await Tree.plain(panel);
  const { actor, narration } = data;
  const voice = voices[actor];
  const text = capitalizeOri(stripBold(narration));
  return tts.call(this, text, voice);
}

// Replace all occurrences of the word "ori" with "Ori". OpenAI TTS doesn't
// support pronunciation hints (e.g., via SSML) yet, but seems to be do better
// pronouncing "ori" as "Oree" (instead of "or-eye") if it's capitalized.
export function capitalizeOri(text) {
  return text.replace(/\bori\b/g, "Ori");
}

// Strip bold text from the narration
export function stripBold(narration) {
  return narration.replace(/\*\*(.*?)\*\*/g, "$1");
}
