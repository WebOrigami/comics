/**
 * This mixin provides a `scrollingStopped` method that is called when scrolling
 * appears to have stopped.
 *
 * It uses a heuristic based on the average of the last two scroll positions. It
 * listens for touchstart and touchend events to avoid triggering the
 * `scrollingStopped` method when the user is still touching the screen.
 */
export default function ScrollingStoppedMixin(Base) {
  return class ScrollingStopped extends Base {
    constructor() {
      super();
      this.touching = false;
    }

    connectedCallback() {
      super.connectedCallback?.();

      let tops = [0, 0];
      let wasMoving = false;
      setInterval(() => {
        tops.shift();
        tops.push(document.documentElement.scrollTop);
        const average = tops.reduce((a, b) => a + b) / tops.length;
        const stopped = tops.every((top) => Math.abs(top - average) < 1);
        if (!stopped) {
          // console.log(tops);
          wasMoving = true;
        } else if (wasMoving) {
          // console.log(
          //   tops,
          //   this.touching ? "still touching" : "scrolling stopped"
          // );
          wasMoving = false;
          if (!this.touching) {
            this.scrollingStopped?.();
          }
        }
      }, 25);

      document.addEventListener("touchstart", () => {
        // console.log("touchstart");
        this.touching = true;
      });

      document.addEventListener("touchend", () => {
        // console.log("touchend");
        this.touching = false;
      });
    }
  };
}
