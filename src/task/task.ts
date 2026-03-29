import { Entity } from "@/entity";

export class Task extends Entity {
  public width: number = 260;
  public height: number = 220;
  protected taskContent!: HTMLDivElement;

  protected override createElement = () => {
    const taskEl = document.createElement("div");
    const taskContent = document.createElement("div");

    taskEl.className = "entity";
    taskContent.className = "note yellow note-fx";
    taskContent.innerHTML = `
      <h3>📝 Задача</h3>
      <input type="text" placeholder="Название задачи" />
      <textarea placeholder="Описание..."></textarea>
      <div class="footer">
        <span class="tag">#работа</span>
        <span class="date">20 мар</span>
      </div>
    `;

    taskEl.appendChild(taskContent);
    this.taskContent = taskContent;

    return taskEl;
  };

  protected override setDraggingStyles = (isDragging: boolean) => {
    if (isDragging) {
      this.transforms = "scale(1.05)";
      // this.taskContent.style.outline = "2px solid red";
      // this.taskContent.style.transform = this.transforms; // taskContent
      return;
    }
    this.transforms = "";
    // this.taskContent.style.outline = "";
    // this.taskContent.style.transform = this.transforms; // taskContent
  };
}
