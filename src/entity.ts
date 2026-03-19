export class Entity {
  /**
   * Координаты относительно центра полотна (0,0)
   */
  public canvas: HTMLDivElement;
  public element: HTMLDivElement;
  public id: string;
  public x: number = 0;
  public y: number = 0;
  public width: number = 0;
  public height: number = 0;
  public isDragging: boolean = false;

  constructor(canvas: HTMLDivElement) {
    this.canvas = canvas;
    this.id = crypto.randomUUID();
    this.x = Math.floor(Math.random() * this.canvas.clientWidth - 40);
    this.y = Math.floor(Math.random() * this.canvas.clientHeight - 40);

    const el = this.createElement();
    el.onmousedown = this.mousedown.bind(this);

    this.element = el;
    this.canvas.appendChild(el);
  }

  public mousedown = () => {
    this.isDragging = true;
    console.log("DOWN", this.id);
    window.addEventListener("mousemove", this.mousemove);
    window.addEventListener("mouseup", this.mouseup);
  };

  public mouseup = () => {
    this.isDragging = false;
    console.log("UP", this.id);
    window.removeEventListener("mousemove", this.mousemove);
    window.removeEventListener("mouseup", this.mouseup);
  };

  private mousemove = (e: MouseEvent) => {
    this.x += e.movementX;
    this.y += e.movementY;

    requestAnimationFrame(this.translate);
  };

  private translate = () => {
    this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
  };

  private createElement = () => {
    const el = document.createElement("div");
    el.style = `
      position: absolute; 
      top: 0; 
      left: 0;
      transform: translate(${this.x}px, ${this.y}px)
    `;
    el.className = "task";

    return el;
  };
}
