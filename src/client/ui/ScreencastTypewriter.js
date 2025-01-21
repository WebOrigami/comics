import { effect, signal } from "@preact/signals-core";
import MediaMixin from "./MediaMixin.js";
import playSoundEffect from "./playSoundEffect.js";
import SoundMixin from "./SoundMixin.js";
import TimelineMixin from "./TimelineMixin.js";

export default class ScreencastTypewriter extends TimelineMixin(
  MediaMixin(SoundMixin(HTMLElement))
) {
  constructor() {
    super();
    this.textSignal = signal("");
  }

  connectedCallback() {
    // Get initial text from textElement
    let text = this.textElement?.textContent ?? "";
    // Use non-breaking spaces
    text = text.replace(/ /g, "\u00A0");
    this.text = text;

    super.connectedCallback();

    effect(() => {
      if (this.text.length === 0) {
        // No typing needed
        this.phases = {};
        return;
      }

      const typing = Array.from(this.text).map((char) => {
        // Random character delay
        let delay = 100 + Math.random() * 100;
        // Shorter delay for alphabetic characters
        if (/[A-Za-z]/i.test(char)) {
          delay /= 2;
        }
        delay = Math.round(delay);
        return delay;
      });

      this.phases = {
        starting: [300],
        typing,
        waiting: [300],
        return: [150],
      };
    });
  }

  get playable() {
    return super.playable && this.text.length > 0;
  }

  renderFrame(phase, index) {
    super.renderFrame(phase, index);

    // Set text length
    if (this.textElement) {
      let length;
      if (phase === "starting") {
        length = 0;
      } else if (phase === "typing") {
        length = index + 1;
      } else {
        length = this.text.length;
      }
      this.textElement.textContent = this.text.slice(0, length);
    }

    // Play sound effects
    if (this.sound) {
      let effect;
      if (phase === "typing") {
        effect = "keyClick";
      } else if (phase === "return") {
        effect = "returnClick";
      }
      if (effect) {
        // Don't wait for async function to complete
        playSoundEffect(effect);
      }
    }
  }

  get text() {
    return this.textSignal.value;
  }
  set text(text) {
    this.textSignal.value = text;
  }

  get textElement() {
    return this.querySelector(".text");
  }
}

customElements.define("screencast-typewriter", ScreencastTypewriter);
