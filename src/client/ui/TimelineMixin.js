import { computed, effect, signal } from "@preact/signals-core";

export default function TimelineMixin(Base) {
  return class Timeline extends Base {
    constructor() {
      super();
      this.nextFrameTimeout = null;
      this.timeSignal = signal(0);
      this.phasesSignal = signal({});
      this.frameCountSignal = computed(() => {
        let count = 0;
        for (const phase in this.frames) {
          count += this.frames[phase];
        }
        return count;
      });
    }

    connectedCallback() {
      super.connectedCallback?.();

      effect(() => {
        // Render the frame for the current time
        this.renderTime(this.time);

        if (!this.playing) {
          clearTimeout(this.nextFrameTimeout);
          this.nextFrameTimeout = null;
        } else if (this.time >= this.frameCount) {
          // Last frame; stop
          this.playing = false;
          this.dispatchEvent(
            new CustomEvent("animation-ended", { bubbles: true })
          );
        } else {
          // Next tick
          const delay = this.frames[this.time];
          this.nextFrameTimeout = setTimeout(() => {
            this.time++;
          }, delay);
        }
      });
    }

    get frames() {
      // Flatten the phases into a single array
      return Object.values(this.phases).reduce(
        (acc, frames) => acc.concat(frames),
        []
      );
    }

    finish() {
      super.finish();
      this.time = this.frameCount;
    }

    get frameCount() {
      return this.frames.length;
    }

    get phases() {
      return this.phasesSignal.value;
    }
    set phases(phases) {
      this.phasesSignal.value = phases;
    }

    // Return the name of the current phase and the frame within that phase
    getPosition(time) {
      let index = 0;
      for (let phase in this.phases) {
        const frames = this.phases[phase];
        if (time < index + frames.length) {
          return { phase, index: time - index };
        }
        index += frames.length;
      }
      return { phase: "done", index: 0 };
    }

    // Override
    play() {
      if (this.time >= this.frameCount) {
        // Trying to play past end; restart at beginning
        this.time = 0;
      }
      super.play();
    }

    // Component extends this to add rendering
    renderFrame(phase, index) {
      // Reflect phase in class
      for (let key in this.phases) {
        this.classList.toggle(key, key === phase);
      }
      this.classList.toggle("done", phase === "done");
    }

    renderTime(time) {
      const { phase, index } = this.getPosition(time);
      this.renderFrame(phase, index);
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
  };
}
