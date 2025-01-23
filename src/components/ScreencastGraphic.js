import MediaMixin from "./MediaMixin.js";
import TimelineMixin from "./TimelineMixin.js";

export default class ScreeencastGraphic extends TimelineMixin(
  MediaMixin(HTMLElement)
) {
  connectedCallback() {
    super.connectedCallback?.();

    // Incorporate typewriter phases
    this.phases = {
      hidden: [0],
    };
  }
}

customElements.define("screencast-graphic", ScreeencastGraphic);
