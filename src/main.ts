import { Entity } from "./entity";

class Main {
  public x: number = 0;
  public y: number = 0;

  public canvas?: HTMLDivElement;
  public entities: Entity[] = [];

  // Run on DOMContentLoaded
  public onDOMContentLoaded() {
    const canvas = document.getElementById("canvas") as HTMLDivElement;
    this.canvas = canvas;

    document.body.addEventListener("pointerdown", this.mousedown);

    window.addEventListener("contextmenu", (ev: Event) => {
      ev.preventDefault();

      this.entities.push(new Entity(canvas));
    });
  }

  public mousedown = (e: Event) => {
    const el = e.target as HTMLElement;
    if (!el.isEqualNode(document.body) && !el.isEqualNode(this.canvas!)) return;

    window.addEventListener("pointermove", this.mousemove);
    window.addEventListener("pointerup", this.mouseup);
  };

  public mouseup = () => {
    window.removeEventListener("pointermove", this.mousemove);
    window.removeEventListener("pointerup", this.mouseup);
  };

  private mousemove = (e: PointerEvent) => {
    this.x += e.movementX;
    this.y += e.movementY;

    requestAnimationFrame(this.translate);
  };

  private translate = () => {
    this.canvas!.style.transform = `translate(${this.x}px, ${this.y}px)`;
  };
}

const main = new Main();

window.addEventListener("DOMContentLoaded", main.onDOMContentLoaded.bind(main));
