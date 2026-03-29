import type { Store } from "@/store";

export class Selection {
  public startX: number = 0;
  public endX: number = 0;
  public startY: number = 0;
  public endY: number = 0;

  public element: HTMLElement;
  protected store: Store;

  constructor(store: Store) {
    this.store = store;
    this.element = this.createElement();
  }

  protected createElement = () => {
    const el = document.createElement("div");
    el.className = "selection";
    document.body.appendChild(el);
    return el;
  };

  protected updateElement = () => {
    const { width, height, normalizedStartX, normalizedStartY } =
      this.getNormalizedCoords();

    this.element.style.transform = `translate(${normalizedStartX}px, ${normalizedStartY}px)`;
    this.element.style.width = `${width}px`;
    this.element.style.height = `${height}px`;
  };

  public getNormalizedCoords = () => {
    /**
     * sWidth = signedWidth
     * sHeight = signedHeight
     * Can be both positive (+) and negative (-)
     */
    const sWidth = this.endX - this.startX;
    const sHeight = this.endY - this.startY;
    const normalizedStartX = sWidth >= 0 ? this.startX : this.endX;
    const normalizedStartY = sHeight >= 0 ? this.startY : this.endY;

    return {
      width: Math.abs(sWidth),
      height: Math.abs(sHeight),
      normalizedStartX,
      normalizedStartY,
    };
  };

  public startSelection = (e: MouseEvent) => {
    this.store.isSelecting = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
  };

  public moveSelection = (e: MouseEvent) => {
    this.endX = e.clientX;
    this.endY = e.clientY;
    this.updateElement();
  };

  public deleteSelection = () => {
    this.store.isSelecting = false;
    this.startX = 0;
    this.endX = 0;
    this.startY = 0;
    this.endY = 0;
    this.updateElement();
  };
}
