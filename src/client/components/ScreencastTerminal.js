import { effect, signal } from "@preact/signals-core";

export default class ScreencastTerminal extends HTMLElement {
  constructor() {
    super();
    this.command = null;
    this.playingSignal = signal(false);
    this.nextFrameTimeout = null;
    this.tickSignal = signal(-1);
  }

  connectedCallback() {
    this.command = this.querySelector(".command");
    const frameCount = this.command?.textContent.length ?? 0;

    this.addEventListener("click", () => {
      this.playing = !this.playing;
    });

    effect(() => {
      if (!this.playing) {
        clearTimeout(this.nextFrameTimeout);
        this.nextFrameTimeout = null;
      } else if (this.tick >= 0 && this.tick <= frameCount) {
        this.command.style.width = `${this.tick}ch`;
        this.nextFrameTimeout = setTimeout(() => {
          this.tick++;
        }, 100);
        if (this.tick === frameCount) {
          this.playing = false;
        }
      }
    });
  }

  pause() {
    this.playing = false;
  }

  play() {
    this.playing = true;
  }

  get playing() {
    return this.playingSignal.value;
  }
  set playing(playing) {
    if (this.command) {
      this.playingSignal.value = playing;
      this.tick = 0;
    }
  }

  get tick() {
    return this.tickSignal.value;
  }
  set tick(tick) {
    this.tickSignal.value = tick;
  }
}

customElements.define("screencast-terminal", ScreencastTerminal);
