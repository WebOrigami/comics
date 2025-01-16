import { effect, signal } from "@preact/signals-core";
import MediaMixin from "./MediaMixin.js";

const startingFrames = 2; // Waiting to start typing
const typingFrames = 1;
const waitingPhaseFrames = 1; // Waiting to press return key
const loadingPhaseFrames = 3; // Waiting for page to load

export default class ScreencastBrowser extends MediaMixin(HTMLElement) {
  constructor() {
    super();
    // this.command = null;
    this.frameCount = 0;
    this.nextFrameTimeout = null;
    // this.textLength = 0;
    this.timeSignal = signal(0);
  }

  connectedCallback() {
    // this.command = this.querySelector(".command");
    // this.textLength = this.command?.textContent.length ?? 0;

    this.frameCount =
      startingFrames + typingFrames + waitingPhaseFrames + loadingPhaseFrames;

    this.addEventListener("click", () => {
      if (!this.playing) {
        this.play();
      } else {
        this.pause();
      }
    });

    effect(() => {
      // Render the frame for the current time
      this.render(this.time);

      if (!this.playing) {
        clearTimeout(this.nextFrameTimeout);
        this.nextFrameTimeout = null;
      } else if (this.time === this.frameCount) {
        // Last frame; stop
        this.playing = false;
        this.dispatchEvent(
          new CustomEvent("animation-ended", { bubbles: true })
        );
      } else {
        // Next tick
        let delay = 150;
        this.nextFrameTimeout = setTimeout(() => {
          this.time++;
        }, delay);
      }
    });
  }

  finish() {
    super.finish();
    this.time = this.frameCount;
  }

  phase(time) {
    if (time <= startingFrames) {
      return "starting";
    } else if (time <= startingFrames + typingFrames) {
      return "typing";
    } else if (time <= startingFrames + typingFrames + waitingPhaseFrames) {
      return "waiting";
    } else if (time < this.frameCount) {
      return "loading";
    } else {
      return "done";
    }
  }

  // Override
  play() {
    if (this.time === this.frameCount) {
      // Trying to play past end; restart at beginning
      this.time = 0;
    }
    super.play();
  }

  // Override
  get playable() {
    return super.playable && this.command?.textContent.length > 0;
  }

  render(time) {
    // Update phase
    const phase = this.phase(time);
    this.classList.toggle("starting", phase === "starting");
    this.classList.toggle("typing", phase === "typing");
    this.classList.toggle("waiting", phase === "waiting");
    this.classList.toggle("loading", phase === "loading");
  }

  restart() {
    super.restart();
    this.time = 0;
  }

  get time() {
    return this.timeSignal.value;
  }
  set time(time) {
    this.timeSignal.value = time;
  }
}

customElements.define("screencast-browser", ScreencastBrowser);
