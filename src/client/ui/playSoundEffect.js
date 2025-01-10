const audioContext = new window.AudioContext();

const soundFiles = {
  keyClick: "/assets/sounds/keyClick.mp3",
  returnClick: "/assets/sounds/returnClick.mp3",
};

const audioPromises = {};

// Function to play the cached MP3 file
export default async function playSoundEffect(effect) {
  audioPromises[effect] ??= loadAudio(soundFiles[effect]);
  const audioBuffer = await audioPromises[effect];

  // Create a new BufferSource for playback
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;

  // Connect the source to the AudioContext's destination (speakers)
  source.connect(audioContext.destination);

  // Start playing the audio
  source.start();
}

async function loadAudio(soundFile) {
  let audioBuffer = null;

  try {
    // Fetch the MP3 file
    const response = await fetch(soundFile);
    if (!response.ok) {
      throw new Error(`Failed to fetch audio file: ${response.statusText}`);
    }

    // Read the MP3 file as an ArrayBuffer
    const arrayBuffer = await response.arrayBuffer();

    // Decode the audio data into an AudioBuffer and cache it
    audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  } catch (error) {
    console.error("Error preloading MP3:", error);
  }

  return audioBuffer;
}
