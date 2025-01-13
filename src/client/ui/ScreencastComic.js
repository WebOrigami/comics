import { effect, signal } from "@preact/signals-core";
import ScrollingStoppedMixin from "./ScrollingStoppedMixin.js";

export default class ScreencastComic extends ScrollingStoppedMixin(
  HTMLElement
) {
  constructor() {
    super();
    this.playingSignal = signal(false);
    this.selectedIndexSignal = signal(-1);
  }

  connectedCallback() {
    super.connectedCallback?.();

    // Make the comic a listbox
    this.setAttribute("role", "listbox");

    // Make the comic focusable
    if (!this.hasAttribute("tabindex")) {
      this.setAttribute("tabindex", "0");
    }

    // Clicking an item selects it. We use mouseup/touchend instead of "click"
    // because, on iOS, "click" doesn't seem to always fire.
    const clickHandler = (event) => {
      if (this.scrollInProgress) {
        return; // Ignore clicks while scrolling
      }
      const item = event.target.closest("screencast-panel");
      if (item) {
        this.selectedIndex = this.items.indexOf(item);
      }
      const playButton = event.target.closest("button");
      if (playButton) {
        // Toggle play state
        this.playing = !this.playing;
      }
    };
    this.addEventListener("mouseup", clickHandler);
    this.addEventListener("touchend", clickHandler);

    // Tell items whether they're selected
    effect(() => {
      if (this.selectedItem && this.selectedItem !== this.getCenterItem()) {
        this.selectedItem?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }

      const selectedIndex = this.selectedIndex;
      this.items.forEach((item, index) => {
        item.selected = index === selectedIndex;
      });

      if (this.playing) {
        this.selectedItem?.play();
      }
    });

    // When playing, automatically play the selected panel
    effect(() => {
      this.setAttribute("data-playing", this.playing);
      if (this.playing) {
        this.selectedItem?.play();
      } else {
        clearInterval(this.selectNextTimeout);
        this.selectNextTimeout = null;
        this.selectedItem?.pause?.();
      }
    });

    // Home/End/Up/Down keys move selection, Space toggles play
    this.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "ArrowUp":
          event.preventDefault();
          if (event.altKey || event.metaKey) {
            this.selectFirst();
          } else {
            this.selectPrevious();
          }
          break;

        case "ArrowDown":
          event.preventDefault();
          if (event.altKey || event.metaKey) {
            this.selectLast();
          } else {
            this.selectNext();
          }
          break;

        case "End":
          event.preventDefault();
          this.selectLast();
          break;

        case "Home":
          event.preventDefault();
          this.selectFirst();
          break;

        // Space toggles play state
        case " ":
          event.preventDefault();
          this.playing = !this.playing;
          break;
      }
    });

    // If we have items, select one
    if (this.items.length > 0) {
      if (document.documentElement.scrollTop > 0) {
        // Page was reloaded while scrolled down
        this.selectCenterItem();
      } else {
        // Select first item by default
        this.selectFirst();
      }
    }
  }

  // Return the item in the center of the viewport
  getCenterItem() {
    const middle = window.innerHeight / 2;
    const item = this.items.find((item) => {
      const itemRect = item.getBoundingClientRect();
      return itemRect.top <= middle && middle <= itemRect.bottom;
    });
    return item;
  }

  get items() {
    return Array.from(this.children);
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
    this.playingSignal.value = playing;
  }

  // Called by ScrollingStoppedMixin when scrolling appears to have stopped
  scrollingStopped() {
    this.selectCenterItem();
  }

  selectCenterItem() {
    const centerItem = this.getCenterItem();
    if (centerItem !== this.selectedItem) {
      this.selectedIndex = this.items.indexOf(centerItem);
    }
  }

  get selectedItem() {
    return this.items[this.selectedIndex] ?? null;
  }

  get selectedIndex() {
    return this.selectedIndexSignal.value;
  }
  set selectedIndex(selected) {
    this.selectedIndexSignal.value = selected;
  }

  selectFirst() {
    this.selectedIndex = 0;
  }

  selectLast() {
    this.selectedIndex = this.items.length - 1;
  }

  selectNext() {
    this.selectedIndex = Math.min(
      this.items.length - 1,
      this.selectedIndex + 1
    );
  }

  selectPrevious() {
    this.selectedIndex = Math.max(0, this.selectedIndex - 1);
  }
}

customElements.define("screencast-comic", ScreencastComic);
