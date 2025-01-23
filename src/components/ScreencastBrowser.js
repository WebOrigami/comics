import { effect } from "@preact/signals-core";
import MediaMixin from "./MediaMixin.js";
import ScreencastTypewriter from "./ScreencastTypewriter.js";
import SoundMixin from "./SoundMixin.js";
import TimelineMixin from "./TimelineMixin.js";

const forceLoad = [ScreencastTypewriter];

export default class ScreencastBrowser extends TimelineMixin(
  MediaMixin(SoundMixin(HTMLElement))
) {
  connectedCallback() {
    super.connectedCallback?.();

    // this.addEventListener("click", () => {
    //   if (!this.playing) {
    //     this.play();
    //   } else {
    //     this.pause();
    //   }
    // });

    // Propagate sound setting to typewriter
    effect(() => {
      if (this.typewriterElement) {
        this.typewriterElement.sound = this.sound;
      }
    });

    // Incorporate typewriter phases
    const typing = this.typewriterElement ? this.typewriterElement.frames : [];
    this.phases = {
      typing,
      loading: [300],
    };
  }

  renderFrame(phase, index) {
    super.renderFrame(phase, index);

    if (this.typewriterElement) {
      const typewriterTime =
        phase === "typing" ? index : this.phases.typing?.length;
      this.typewriterElement.renderTime(typewriterTime);
    }
  }

  get typewriterElement() {
    return this.querySelector("screencast-typewriter");
  }
}

customElements.define("screencast-browser", ScreencastBrowser);
