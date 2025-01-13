import { effect, signal } from "@preact/signals-core";
import AttributeMarshallingMixin from "./AttributeMarshallingMixin.js";

export default class ScreencastPanel extends AttributeMarshallingMixin(
  HTMLElement
) {
  constructor() {
    super();
    this.audioElement = null;
    this.audioPlayingSignal = signal(false);
    this.audioSrcSignal = signal(null);
    this.animationPlayingSignal = signal(false);
    this.playingSignal = signal(false);
    this.selectedSignal = signal(false);
  }

  get animationElement() {
    return this.querySelector("screencast-terminal");
  }

  get audioSrc() {
    return this.audioSrcSignal.value;
  }
  set audioSrc(src) {
    this.audioSrcSignal.value = src;
  }

  connectedCallback() {
    this.setAttribute("role", "option");

    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <slot></slot>
      <audio id="audio"></audio>
    `;
    this.audioElement = this.shadowRoot.querySelector("#audio");

    effect(() => {
      this.setAttribute("aria-selected", this.selected);
    });

    effect(() => {
      this.audioElement.src = this.audioSrc;
    });

    // Track when audio ends
    this.audioElement.addEventListener("ended", () => {
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

    if (this.animationElement?.playable) {
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
