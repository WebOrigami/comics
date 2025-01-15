import { computed, effect, signal } from "@preact/signals-core";
import AttributeMarshallingMixin from "./AttributeMarshallingMixin.js";
import MediaMixin from "./MediaMixin.js";
import SoundMixin from "./SoundMixin.js";

export default class ScreencastPanel extends SoundMixin(
  MediaMixin(AttributeMarshallingMixin(HTMLElement))
) {
  constructor() {
    super();

    this.animationElement = null;
    this.animationPlayingSignal = signal(false);
    this.audioElement = null;
    this.audioPlayingSignal = signal(false);
    this.audioSrcSignal = signal(null);
    this.selectedSignal = signal(false);

    // Override
    this.playingSignal = computed(() => {
      return this.animationPlaying || this.audioPlaying;
    });
  }

  get animationPlaying() {
    return this.animationPlayingSignal.value;
  }
  set animationPlaying(animationPlaying) {
    this.animationPlayingSignal.value = animationPlaying;
  }

  get audioPlaying() {
    return this.audioPlayingSignal.value;
  }
  set audioPlaying(audioPlaying) {
    this.audioPlayingSignal.value = audioPlaying;
  }

  get audioSrc() {
    return this.audioSrcSignal.value;
  }
  set audioSrc(audioSrc) {
    this.audioSrcSignal.value = audioSrc;
  }

  connectedCallback() {
    this.setAttribute("role", "option");

    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = this.template;

    // Acquire elements
    this.animationElement = this.querySelector("screencast-terminal");
    this.audioElement = this.shadowRoot.querySelector("#audio");
    const buttonSoundIsOff = this.shadowRoot.querySelector("#soundIsOff");
    const buttonSoundIsOn = this.shadowRoot.querySelector("#soundIsOn");

    // Respond to selection
    let played = false;
    effect(() => {
      this.setAttribute("aria-selected", this.selected);

      // Show the buttons when selected
      // See styling note in template property
      const opacity = this.selected ? 1 : 0;
      buttonSoundIsOff.style.opacity = opacity;
      buttonSoundIsOn.style.opacity = opacity;

      if (this.selected) {
        // If we've gained selection and haven't played yet, start playing
        if (!played && !this.playing) {
          played = true;
          this.play();
        }
      } else {
        // If we've lost selection, reset
        this.reset();
        played = false;
      }
    });

    // Tell animation element whether to play sound
    effect(() => {
      if (this.animationElement) {
        this.animationElement.sound = this.sound;
      }
    });

    // Tell audio element which sound to play
    effect(() => {
      this.audioElement.src = this.audioSrc;
    });

    // Play/pause animation
    effect(() => {
      if (this.animationElement) {
        this.animationElement.playing = this.animationPlaying;
      }
    });

    // Play/pause audio in response to our own signals
    effect(() => {
      if (this.audioPlaying) {
        this.audioElement.play();
      } else {
        this.audioElement.pause();
      }
    });

    // Track when audio ends
    this.audioElement.addEventListener("ended", () => {
      this.audioPlaying = false;
    });

    // Track when animation ends
    this.addEventListener("animation-ended", () => {
      this.animationPlaying = false;
    });

    effect(() => {
      // See styling note in template property
      buttonSoundIsOff.style.display = this.sound ? "none" : "block";
      buttonSoundIsOn.style.display = this.sound ? "block" : "none";
    });

    // Sound buttons raise events for comic to manage sound
    buttonSoundIsOff.addEventListener("click", (event) => {
      this.audioPlaying = true;
      this.dispatchEvent(
        new CustomEvent("sound-change", {
          bubbles: true,
          detail: {
            sound: true,
          },
        })
      );
    });
    buttonSoundIsOn.addEventListener("click", (event) => {
      this.audioPlaying = false;
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
  }

  // Override
  get playing() {
    return this.playingSignal.value;
  }
  set playing(playing) {
    this.animationPlaying = playing;
    this.audioPlaying = playing && this.sound;
  }

  // Override; reset the audio to the beginning
  reset() {
    super.reset();
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

    // Note: We'd much prefer to handle some of the styling of the button state
    // in CSS, but Safari is buggy as hell when it comes to rendering SVGs in
    // Shadow DOM. We're forced to do it JS effects instead.
    return `
      <style>
        #controls {
          position: relative;
        }

        button {
          background: transparent;
          border: none;
          color: #555;
          display: block;
          opacity: 0;
          padding: 0;
          position: absolute;
          top: 0;
          transition: opacity 0.25s;
          left: 0;
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
