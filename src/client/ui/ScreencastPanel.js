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
        this.playingSignal.value &&
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

  pause() {
    this.audioElement?.pause?.();
    this.audioPlayingSignal.value = false;

    this.animationElement?.pause?.();
    this.animationPlayingSignal.value = false;

    this.playingSignal.value = false;
  }

  get selected() {
    return this.selectedSignal.value;
  }
  set selected(selected) {
    this.selectedSignal.value = selected;

    // If we lose selection while play, pause the audio
    if (!selected) {
      this.pause();

      // Reset the audio to the beginning
      if (this.audioElement) {
        this.audioElement.currentTime = 0;
      }
    }
  }
}

customElements.define("screencast-panel", ScreencastPanel);
