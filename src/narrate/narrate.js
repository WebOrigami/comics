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
  const text = stripBold(narration);
  return tts.call(this, text, voice);
}

// Strip bold text from the narration
export function stripBold(narration) {
  return narration.replace(/\*\*(.*?)\*\*/g, "$1");
}
