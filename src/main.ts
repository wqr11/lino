import { Entity } from "./entity";

class Main {
  public canvas?: HTMLDivElement;

  public entities: Entity[] = [];

  // Run on DOMContentLoaded
  public onDOMContentLoaded() {
    const canvas = document.getElementById("canvas") as HTMLDivElement;
    this.canvas = canvas;

    window.addEventListener("contextmenu", (ev: Event) => {
      ev.preventDefault();

      this.entities.push(new Entity(canvas));
    });
  }
}

const main = new Main();

window.addEventListener("DOMContentLoaded", main.onDOMContentLoaded.bind(main));
