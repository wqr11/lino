import type { Store } from "../store";

export class Entity {
  /**
   * Координаты относительно центра полотна (0,0)
   */
  public domainElement!: HTMLElement;
  public element!: HTMLElement;
  public grabbableElement?: HTMLElement;
  public id: string;
  public x: number = 0;
  public y: number = 0;
  public width: number = 0;
  public height: number = 0;
  public isDragging: boolean = false;
  protected transforms: string = "";
  protected store: Store;
  // public isSelected: boolean = false;

  constructor(domainElement: HTMLDivElement, store: Store) {
    this.store = store;
    this.domainElement = domainElement;
    this.id = crypto.randomUUID();
    this.x = Math.floor(Math.random() * this.domainElement.clientWidth - 40);
    this.y = Math.floor(Math.random() * this.domainElement.clientHeight - 40);
  }

  public init() {
    const el = this.createElement();
    el.onmousedown = this.mousedown.bind(this);

    this.element = el;
    this.domainElement.appendChild(el);

    this.translate(); // To set initial translate(x,y)

    return this;
  }

  private mousedown = (e: MouseEvent) => {
    const el = e.target as HTMLElement;
    if (
      this.grabbableElement
        ? !el.isEqualNode(this.grabbableElement)
        : !el.isEqualNode(this.element)
    )
      return;

    this.setIsDragging(true);
    window.addEventListener("pointermove", this.mousemove);
    window.addEventListener("pointerup", this.mouseup);
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

  protected setIsDragging = (isDragging: boolean) => {
    this.isDragging = isDragging;
    this.store.isDragging = isDragging;
    if (isDragging) {
      this.element.style.outline = "2px solid #667eea";
      return;
    }
    this.element.style.outline = "";
  };
}
