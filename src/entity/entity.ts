import type { Store } from "@/store";

export class Entity {
  /**
   * Координаты относительно центра полотна (0,0)
   */
  public domainElement!: HTMLElement;
  public element!: HTMLElement;
  public id: string;
  public x: number = 0;
  public y: number = 0;
  public width: number = 0;
  public height: number = 0;
  public isDragging: boolean = false;
  public isSelected: boolean = false;
  public isFocused: boolean = false;
  protected store: Store;
  protected transforms: string = "";

  constructor(domainElement: HTMLDivElement, store: Store) {
    this.store = store;
    this.domainElement = domainElement;
    this.id = crypto.randomUUID();
    this.x = Math.floor(Math.random() * this.domainElement.clientWidth - 40);
    this.y = Math.floor(Math.random() * this.domainElement.clientHeight - 40);
  }

  public init = () => {
    this.element = this.createElement();
    this.element.addEventListener("pointerdown", this.mousedown);
    this.element.addEventListener("dblclick", this.dblclick);

    this.translate();

    this.domainElement.appendChild(this.element);

    return this;
  };

  public destroy = () => {
    /**
     * Remove event listeners && remove element from the DOM
     */
    this.element.removeEventListener("pointerdown", this.mousedown);
    this.element.removeEventListener("dblclick", this.dblclick);
    window.removeEventListener("pointermove", this.mousemove);
    window.removeEventListener("pointerup", this.mouseup);
    this.domainElement.removeChild(this.element);
  };

  private mousedown = () => {
    if (this.isFocused) {
      return;
    }

    /**
     * OLD Implementation
     * Grab only on free space
     */
    // if (
    //   this.grabbableElement
    //     ? !el.isEqualNode(this.grabbableElement)
    //     : !el.isEqualNode(this.element)
    // )
    //   return;

    this.setIsDragging(true);
    window.addEventListener("pointermove", this.mousemove);
    window.addEventListener("pointerup", this.mouseup);
  };

  private dblclick = () => {
    this.isFocused = true;
    this.element.classList.add("focused");
    window.addEventListener("mousedown", this.outsideClickWhenFocused);
  };

  private outsideClickWhenFocused = (e: Event) => {
    if (!this.element.contains(e.target as HTMLElement)) {
      this.isFocused = false;
      this.element.classList.remove("focused");
      window.removeEventListener("mousedown", this.outsideClickWhenFocused);
    }
  };

  private mouseup = () => {
    this.setIsDragging(false);

    /**
     * Этот вызов можно убрать.
     * Эффекты с transforms все равно не на элементе висят зачастую, а на ребенке.
     *
     * @description
     * После того, как мы ставим this.transforms = "" выше,
     * применяем новый style.transform
     */
    this.translate();
    window.removeEventListener("pointermove", this.mousemove);
    window.removeEventListener("pointerup", this.mouseup);
  };

  private mousemove = (e: PointerEvent) => {
    this.x += e.movementX * this.store.antiScale;
    this.y += e.movementY * this.store.antiScale;

    requestAnimationFrame(this.translate);
  };

  protected translate = () => {
    this.element.style.transform = `translate(${this.x}px, ${this.y}px) ${this.transforms}`;
  };

  /**
   * ** Override this **
   * @returns HTMLElement
   */
  protected createElement = (): HTMLElement => {
    const el = document.createElement("div");
    el.className = "entity";
    el.innerHTML = `
      <textarea style="resize: none; width: 100%"></textarea>
      <button>test</button>
    `;

    return el;
  };

  public setIsSelected = (isSelected: boolean) => {
    this.isSelected = isSelected;
    this.setSelectedStyles(isSelected);
  };

  protected setIsDragging = (isDragging: boolean) => {
    this.isDragging = isDragging;
    this.store.isDragging = isDragging;
  };

  /**
   * State styles
   */
  protected setDraggingStyles = (isDragging: boolean) => {
    if (isDragging) {
      this.element.style.outline = "2px solid #667eea";
      return;
    }
    this.element.style.outline = "";
  };
  protected setSelectedStyles = (isSelected: boolean) => {
    if (isSelected) {
      this.element.style.outline = "2px solid red";
      return;
    }
    this.element.style.outline = "";
  };
}
