import { signal } from "@preact/signals-core";

// Mixin for something that can be played
export default function MediaMixin(Base) {
  return class Media extends Base {
    constructor() {
      super();
      this.playingSignal = signal(false);
    }

    // Media components can use this to show their final state
    finish() {
      this.playing = false;
    }

    pause() {
      this.playing = false;
    }

    play() {
      this.playing = true;
    }

    get playable() {
      return true;
    }

    get playing() {
      return this.playingSignal.value;
    }
    set playing(playing) {
      this.playingSignal.value = playing;
    }

    // Media components can use this to reset to their initial state
    restart() {
      this.playing = false;
    }
  };
}
