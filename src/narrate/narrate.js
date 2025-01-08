import { Tree } from "@weborigami/async-tree";
import tts from "./tts.js";

// Function to call the OpenAI Text-to-Speech API
export default async function narrate(stageDirection) {
  const data = await Tree.plain(stageDirection);
  const voice = Object.keys(data)[0];
  const text = data[voice];
  return tts.call(this, text, voice);
}
