import {
  Directive,
  ElementRef,
  HostListener,
  Renderer2,
  inject,
  Input,
  TemplateRef,
  ContentChild,
  OnInit,
} from '@angular/core';

@Directive({
  selector: '[resizable]',
})
export class ResizableDirective implements OnInit {
  readonly #elementRef = inject(ElementRef);
  readonly #renderer = inject(Renderer2);

  @Input() minHeightPx = 0;
  @Input() startHeightPx = 0;

  @ContentChild('grabber')
  grabber: ElementRef<HTMLElement | undefined>;

  private isResizing = false;
  private startX: number;
  private startY: number;
  private startWidth: number;
  private startHeight: number;

  ngOnInit() {
    this.#renderer.setStyle(
      this.#elementRef.nativeElement,
      'height',
      this.startHeightPx + 'px'
    );
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    const grabber = this.grabber.nativeElement;
    if (!grabber) {
      return;
    }

    this.startX = event.clientX;
    this.startY = event.clientY;
    this.startWidth = this.#elementRef.nativeElement.offsetWidth;
    this.startHeight = this.#elementRef.nativeElement.offsetHeight;

    const { x, y, width, height } = grabber.getBoundingClientRect();
    const startXAndStartYAreInBounds =
      this.startX >= x &&
      this.startX <= x + width &&
      this.startY >= y &&
      this.startY <= y + height;
    if (!startXAndStartYAreInBounds) {
      return;
    }

    this.isResizing = true;

    event.preventDefault();
  }

  @HostListener('document:mousemove', ['$event'])
  @HostListener('document:touchmove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isResizing) {
      const deltaY = event.clientY - this.startY;
      const newHeight = this.startHeight - deltaY;
      if (newHeight < this.minHeightPx) {
        return;
      }

      this.#renderer.setStyle(
        this.#elementRef.nativeElement,
        'height',
        newHeight + 'px'
      );
    }
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.isResizing = false;
  }
}
