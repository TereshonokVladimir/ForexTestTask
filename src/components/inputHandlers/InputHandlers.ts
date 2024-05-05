// InputHandler.ts
export class InputHandler {
  public element: HTMLElement;
  private callback: (event: Event) => void;

  constructor(element: HTMLElement, callback: (event: Event) => void) {
    this.element = element;
    this.callback = callback;
    this.setupEventListener();
  }

  private setupEventListener(): void {
    this.element.addEventListener('input', this.callback);
  }
}
