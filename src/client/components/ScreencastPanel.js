import { effect, signal } from "@preact/signals-core";

export default class ScreencastPanel extends HTMLElement {
  constructor() {
    super();
    this.selectedSignal = signal(false);
  }

  connectedCallback() {
    this.setAttribute("role", "option");

    effect(() => {
      this.setAttribute("aria-selected", this.selected);
    });
  }

  get selected() {
    return this.selectedSignal.value;
  }
  set selected(selected) {
    this.selectedSignal.value = selected;
  }
}

customElements.define("screencast-panel", ScreencastPanel);
