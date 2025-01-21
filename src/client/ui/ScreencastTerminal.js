import { effect } from "@preact/signals-core";
import MediaMixin from "./MediaMixin.js";
import SoundMixin from "./SoundMixin.js";
import TimelineMixin from "./TimelineMixin.js";

export default class ScreencastTerminal extends TimelineMixin(
  MediaMixin(SoundMixin(HTMLElement))
) {
  connectedCallback() {
    super.connectedCallback?.();

    // Propagate sound setting to typewriter
    effect(() => {
      if (this.typewriterElement) {
        this.typewriterElement.sound = this.sound;
      }
    });

    // Incorporate typewriter phases
    const typing = this.typewriterElement ? this.typewriterElement.frames : [];
    if (typing.length === 0) {
      // No typing needed
      this.phases = {};
    } else {
      this.phases = {
        typing,
        running: [100],
      };
    }
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
    // Will return the first typewriter, which is what we want
    return this.querySelector("screencast-typewriter");
  }
}

customElements.define("screencast-terminal", ScreencastTerminal);
