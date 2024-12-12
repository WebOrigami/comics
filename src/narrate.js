import { Tree } from "@weborigami/async-tree";
import tts from "./tts.js";

const voices = {
  Alice: "shimmer",
  Bob: "echo",
};

// Function to call the OpenAI Text-to-Speech API
export default async function narrate(stageDirection) {
  const data = await Tree.plain(stageDirection);
  const actor = Object.keys(data)[0];
  const voice = voices[actor];
  const text = data[voice];
  return tts.call(this, text, voice);
}
