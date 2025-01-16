import { signal } from "@preact/signals-core";

export default function SoundMixin(Base) {
  return class Sound extends Base {
    constructor() {
      super();
      this.soundSignal = signal(false);
    }

    attributeChangedCallback(name, oldValue, newValue) {
      super.attributeChangedCallback?.(name, oldValue, newValue);
      if (name === "sound") {
        this.sound = String(newValue) === "true";
      } else {
        super.attributeChangedCallback(name, oldValue, newValue);
      }
    }

    get sound() {
      return this.soundSignal.value;
    }
    set sound(sound) {
      this.soundSignal.value = sound;
    }
  };
}
