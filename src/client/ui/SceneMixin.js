import { signal } from "@preact/signals-core";

export default function SceneMixin(Base) {
  return class Scene extends Base {
    constructor() {
      super();
      this.playingSignal = signal(false);
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
  };
}
