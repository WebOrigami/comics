import MediaMixin from "./MediaMixin.js";
import ScreencastTerminal from "./ScreencastTerminal.js";

const forceLoad = [ScreencastTerminal];

export default class ScreencastEditor extends MediaMixin(HTMLElement) {
  // Override
  finish() {
    super.finish();
    this.terminalElement?.finish();
  }

  // Override
  restart() {
    super.restart();
    this.terminalElement?.restart();
  }

  // Override
  play() {
    super.play();
    this.terminalElement?.play();
  }

  get playable() {
    return this.terminalElement?.playable ?? false;
  }

  get sound() {
    return this.terminalElement?.sound ?? false;
  }
  set sound(sound) {
    if (this.terminalElement) {
      this.terminalElement.sound = sound;
    }
  }

  get terminalElement() {
    return this.querySelector("screencast-terminal");
  }
}

customElements.define("screencast-editor", ScreencastEditor);
