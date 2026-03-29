import { Entity } from "./entity";
import { Selection } from "./selection";
import { Store } from "./store";
import { Task } from "./task";

const SCROLL_SCALE_DELTA = 0.1; // 10%

class Main {
  public x: number = 0;
  public y: number = 0;

  public body?: HTMLBodyElement;
  public canvas?: HTMLDivElement;
  public entities: Entity[] = [];
  public selectedEntities: Entity[] = [];
  private store: Store;
  private selection: Selection;

  constructor(store: Store, selection: Selection) {
    this.store = store;
    this.selection = selection;
  }

  // Run on DOMContentLoaded
  public initApp() {
    const canvas = document.getElementById("canvas") as HTMLDivElement;
    const body = document.body as HTMLBodyElement;
    this.canvas = canvas;
    this.body = body;

    /**
     * Handles mouse keys press
     *
     * 0 - Primary key (left by defautlt)
     * Nothing now.
     *
     * 2 - Secondary key (right by default)
     * Moving canvas
     */
    this.body.addEventListener("pointerdown", this.handlePointerDown);

    /**
     * Disable contextmenu
     */
    window.addEventListener("contextmenu", (e: Event) => e.preventDefault(), {
      passive: false,
    });

    /**
     * Creates new Tasks on Spacebar press
     */
    window.addEventListener("keydown", (ev: KeyboardEvent) => {
      if (ev.key === " ") {
        ev.preventDefault();
        this.entities.push(new Task(this.canvas!, this.store).init());
      }
    });

    /**
     * Spinning wheel changes the scale
     */
    window.addEventListener("wheel", this.handleWheelScale, {
      passive: false,
    });

    /**
     * Disable browser selection
     */
    window.addEventListener(
      "selectstart",
      (e: Event) => {
        e.preventDefault();
      },
      {
        passive: false,
      },
    );
  }

  public handlePointerDown = (e: MouseEvent) => {
    const el = e.target as HTMLElement;
    if (!el.isEqualNode(document.body) && !el.isEqualNode(this.canvas!)) return;

    switch (e.button) {
      case 0:
        this.selection.deleteSelection();
        this.selection.startSelection(e);
        window.addEventListener("pointermove", this.selection.moveSelection);
        window.addEventListener("pointerup", this.selectEntities);
        break;
      case 2:
        window.addEventListener("pointermove", this.moveCanvas);
        window.addEventListener("pointerup", this.removeCanvasListeners);
        break;
      default:
        return;
    }
  };

  public removeCanvasListeners = () => {
    window.removeEventListener("pointermove", this.moveCanvas);
    window.removeEventListener("pointerup", this.removeCanvasListeners);
  };

  private moveCanvas = (e: PointerEvent) => {
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

  private selectEntities = () => {
    window.removeEventListener("pointermove", this.selection.moveSelection);

    for (let i = 0, len = this.entities.length; i < len; i++) {
      const entity = this.entities[i];

      const isOverlapping = this.isEntityOverlappingWithSelection(entity);

      console.log(isOverlapping);

      entity.setIsSelected(isOverlapping);
      this.selectedEntities.push(entity);
    }

    this.selection.deleteSelection();

    window.removeEventListener("pointermove", this.selection.moveSelection);
    window.removeEventListener("pointerup", this.selectEntities);
  };

  private isEntityOverlappingWithSelection = (entity: Entity) => {
    const {
      x: entityStartX,
      y: entityStartY,
      width: entityWidth,
      height: entityHeight,
    } = entity;
    const entityEndX = entityStartX + entityWidth;
    const entityEndY = entityStartY + entityHeight;

    const {
      normalizedStartX: selectionStartX,
      normalizedStartY: selectionStartY,
      width: selectionWidth,
      height: selectionHeight,
    } = this.selection.getNormalizedCoords();
    const selectionEndX =
      selectionStartX + selectionWidth * this.store.antiScale;
    const selectionEndY =
      selectionStartY + selectionHeight * this.store.antiScale;

    if (selectionEndX < entityStartX || selectionStartX > entityEndX) {
      return false;
    }

    if (selectionEndY < entityStartY || selectionStartY > entityEndY) {
      return false;
    }

    return true;
  };
}

const store = new Store();
const selection = new Selection(store);
const main = new Main(store, selection);

window.addEventListener("DOMContentLoaded", main.initApp.bind(main));
