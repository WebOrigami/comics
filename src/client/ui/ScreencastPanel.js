import { effect, signal } from "@preact/signals-core";
import AttributeMarshallingMixin from "./AttributeMarshallingMixin.js";
import SoundMixin from "./SoundMixin.js";

export default class ScreencastPanel extends SoundMixin(
  AttributeMarshallingMixin(HTMLElement)
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
    this.shadowRoot.innerHTML = this.template;

    this.audioElement = this.shadowRoot.querySelector("#audio");

    effect(() => {
      this.setAttribute("aria-selected", this.selected);

      if (this.selected) {
        this.play();
      } else {
        // If we lose selection while playing, pause and reset
        if (this.playing) {
          this.pause();
        }
        this.reset();
      }
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

    // Sound buttons raise events for comic to manage sound
    this.shadowRoot
      .querySelector("#soundIsOff")
      .addEventListener("click", (event) => {
        this.dispatchEvent(
          new CustomEvent("sound-change", {
            bubbles: true,
            detail: {
              sound: true,
            },
          })
        );
      });
    this.shadowRoot
      .querySelector("#soundIsOn")
      .addEventListener("click", (event) => {
        this.dispatchEvent(
          new CustomEvent("sound-change", {
            bubbles: true,
            detail: {
              sound: false,
            },
          })
        );
      });
    // Absorb mousedown and touchend events so they don't bubble up to the comic
    this.shadowRoot
      .querySelector("#controls")
      .addEventListener("mouseup", (event) => {
        event.stopPropagation();
      });
    this.shadowRoot
      .querySelector("#controls")
      .addEventListener("touchend", (event) => {
        event.stopPropagation();
      });

    // Tell items whether to play sound
    effect(() => {
      if (this.animationElement) {
        this.animationElement.sound = this.sound;
      }
    });
  }

  play() {
    if (this.sound) {
      this.audioElement?.play();
      this.audioPlayingSignal.value = true;
    }

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
    this.selectedSignal.value = selected;
  }

  get template() {
    // Icons from Google Material Design Icons
    return `
      <style>
        button {
          background: transparent;
          border: none;
          color: #555;
          padding: 0;
          /* visibility: hidden; */
        }

        :host([aria-selected="true"]) {
          button {
            /* visibility: visible; */
          }
        }

        :host([sound="true"]) {
          #soundIsOff {
            display: none;
          }
        }
        :host([sound="false"]) {
          #soundIsOn {
            display: none;
          }
        }
      </style>
      <slot></slot>
      <div id="controls">
        <button id="soundIsOff">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
          <path d="M792-56 671-177q-25 16-53 27.5T560-131v-82q14-5 27.5-10t25.5-12L480-368v208L280-360H120v-240h128L56-792l56-56 736 736-56 56Zm-8-232-58-58q17-31 25.5-65t8.5-70q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 53-14.5 102T784-288ZM650-422l-90-90v-130q47 22 73.5 66t26.5 96q0 15-2.5 29.5T650-422ZM480-592 376-696l104-104v208Zm-80 238v-94l-72-72H200v80h114l86 86Zm-36-130Z"/>
          </svg>
        </button>
        <button id="soundIsOn">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
            <path d="M560-131v-82q90-26 145-100t55-168q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 127-78 224.5T560-131ZM120-360v-240h160l200-200v640L280-360H120Zm440 40v-322q47 22 73.5 66t26.5 96q0 51-26.5 94.5T560-320ZM400-606l-86 86H200v80h114l86 86v-252ZM300-480Z"/>
          </svg>
        </button>
      </div>
      <audio id="audio"></audio>
    `;
  }
}

customElements.define("screencast-panel", ScreencastPanel);
