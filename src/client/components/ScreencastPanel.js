import { effect, signal } from "@preact/signals-core";

export default class ScreencastPanel extends HTMLElement {
  constructor() {
    super();
    this.selectedSignal = signal(false);
  }

  get audioElement() {
    return this.querySelector("audio");
  }

  connectedCallback() {
    this.setAttribute("role", "option");

    effect(() => {
      this.setAttribute("aria-selected", this.selected);
    });

    // If the audio ends, wait a bit, then raise our own event
    this.audioElement?.addEventListener("ended", () => {
      setTimeout(() => {
        this.dispatchEvent(
          new CustomEvent("panel-ended", {
            bubbles: true,
          })
        );
      }, 300);
    });
  }

  play() {
    this.audioElement?.play();
  }

  pause() {
    this.audioElement?.pause();
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
