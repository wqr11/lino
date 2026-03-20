import { Entity } from "./entity";
import { Store } from "./store";
import { Task } from "./task";

const SCROLL_SCALE_DELTA = 0.1; // %

class Main {
  public x: number = 0;
  public y: number = 0;

  public body?: HTMLBodyElement;
  public canvas?: HTMLDivElement;
  public entities: Entity[] = [];
  private store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  // Run on DOMContentLoaded
  public initApp() {
    const canvas = document.getElementById("canvas") as HTMLDivElement;
    const body = document.body as HTMLBodyElement;
    this.canvas = canvas;
    this.body = body;

    this.body.addEventListener("pointerdown", this.handlePointerDown);

    window.addEventListener("contextmenu", (e: Event) => e.preventDefault(), {
      passive: false,
    });
    window.addEventListener("keydown", (ev: KeyboardEvent) => {
      if (ev.key === " ") {
        ev.preventDefault();
        this.entities.push(new Task(canvas, scale).init());
      }
    });
    window.addEventListener("wheel", this.handleWheelScale, {
      passive: false,
    });
    // @TODO: Finish
    window.addEventListener(
      "selectstart",
      (e: Event) => {
        e.preventDefault();

        if (this.store.isDragging) {
          return;
        }
      },
      {
        passive: false,
      },
    );
  }

  public handlePointerDown = (e: MouseEvent) => {
    switch (e.button) {
      case 1:
        break;
      case 2:
        const el = e.target as HTMLElement;
        if (!el.isEqualNode(document.body) && !el.isEqualNode(this.canvas!))
          return;

        window.addEventListener("pointermove", this.handleGrabMove);
        window.addEventListener("pointerup", this.removePointerListeners);
        break;
      default:
        return;
    }
  };

  public removePointerListeners = () => {
    window.removeEventListener("pointermove", this.handleGrabMove);
    window.removeEventListener("pointerup", this.removePointerListeners);
  };

  private handleGrabMove = (e: PointerEvent) => {
    this.x += e.movementX * this.store.antiScale;
    this.y += e.movementY * this.store.antiScale;

    requestAnimationFrame(this.translate);
  };

  private translate = () => {
    this.canvas!.style.transform = `translate(${this.x}px, ${this.y}px)`;
  };

  private handleWheelScale = (e: WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const direction = e.deltaY > 0 ? -1 : 1;
      // scale * (1 +- 0.05)
      this.store.scale *= 1 + direction * SCROLL_SCALE_DELTA;
      this.store.antiScale = 1 / this.store.scale;

      this.canvas!.style.scale = `${this.store.scale}`;
    }
  };
}

const scale = new Store();
const main = new Main(scale);

window.addEventListener("DOMContentLoaded", main.initApp.bind(main));
