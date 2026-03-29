/**
 * This is Dependency-Injected into all entities
 */
export class Store {
  public scale: number = 1;
  public antiScale: number = 1;
  /**
   * @description
   * Global.
   * Should be `true` if is currently dragging ANY entity
   */
  public isDragging: boolean = false;
  public isSelecting: boolean = false;
}
