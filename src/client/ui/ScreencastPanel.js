import { effect, signal } from "@preact/signals-core";

export default class ScreencastPanel extends HTMLElement {
  constructor() {
    super();
    this.audioPlayingSignal = signal(false);
    this.animationPlayingSignal = signal(false);
    this.playingSignal = signal(false);
    this.selectedSignal = signal(false);
  }

  get animationElement() {
    return this.querySelector("screencast-terminal");
  }

  get audioElement() {
    return this.querySelector("audio");
  }

  connectedCallback() {
    this.setAttribute("role", "option");

    effect(() => {
      this.setAttribute("aria-selected", this.selected);
    });

    // Track when audio ends
    this.audioElement?.addEventListener("ended", () => {
      this.audioPlayingSignal.value = false;
    });

    // Track when animation ends
    this.addEventListener("animation-ended", () => {
      this.animationPlayingSignal.value = false;
    });

    // If we're playing but both the audio and animation have ended, wait a bit,
    // then signal that the overall panel has ended.
    effect(() => {
      if (
        this.playing &&
        !this.audioPlayingSignal.value &&
        !this.animationPlayingSignal.value
      ) {
        setTimeout(() => {
          this.dispatchEvent(
            new CustomEvent("panel-ended", {
              bubbles: true,
            })
          );
        }, 500);
        this.playingSignal.value = false;
        this.reset();
      }
    });
  }

  play() {
    this.audioElement?.play();
    this.audioPlayingSignal.value = true;

    if (this.animationElement) {
      this.animationElement?.play();
      this.animationPlayingSignal.value = true;
    } else {
      this.animationPlayingSignal.value = false;
    }

    this.playingSignal.value = true;
  }

  get playing() {
    return this.playingSignal.value;
  }

  pause() {
    this.audioElement?.pause?.();
    this.audioPlayingSignal.value = false;

    this.animationElement?.pause?.();
    this.animationPlayingSignal.value = false;

    this.playingSignal.value = false;
  }

  // Reset the audio to the beginning
  reset() {
    if (this.audioElement) {
      this.audioElement.currentTime = 0;
    }
  }

  get selected() {
    return this.selectedSignal.value;
  }
  set selected(selected) {
    // If we lose selection while playing, pause and reset
    if (!selected) {
      if (this.playing) {
        this.pause();
      }
      this.reset();
    }

    this.selectedSignal.value = selected;
  }
}

customElements.define("screencast-panel", ScreencastPanel);
