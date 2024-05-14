import {
  Directive,
  ElementRef,
  HostListener,
  Renderer2,
  inject,
  Input,
  ContentChild,
  OnInit,
  EventEmitter,
  Output,
} from '@angular/core';

@Directive({
  selector: '[resizable]',
})
export class ResizableDirective implements OnInit {
  readonly #elementRef = inject(ElementRef);
  readonly #renderer = inject(Renderer2);

  @Input({ required: true }) minHeightPx: number;
  @Input() verticalMaxHeightOffsetPx = 0;
  @Input() startHeightPx = 0;

  @Output() heightChanged = new EventEmitter<number>();

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
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: MouseEvent | TouchEvent) {
    const grabber = this.grabber.nativeElement;
    if (!grabber) {
      return;
    }

    const clientX =
      event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    const clientY =
      event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;

    this.startX = clientX;
    this.startY = clientY;
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
  onTouchMove(event: MouseEvent | TouchEvent) {
    if (!this.isResizing) {
      return;
    }

    const clientY =
      event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
    const deltaY = clientY - this.startY;
    let newHeight = this.startHeight - deltaY;
    if (newHeight < this.minHeightPx) {
      return;
    }

    const maxHeight = window.innerHeight - this.verticalMaxHeightOffsetPx;
    if (newHeight >= maxHeight) {
      newHeight = maxHeight;
    }

    this.#renderer.setStyle(
      this.#elementRef.nativeElement,
      'height',
      newHeight + 'px'
    );

    this.heightChanged.emit(newHeight);
  }

  @HostListener('document:mouseup')
  @HostListener('document:touchend')
  onTouchEnd() {
    this.isResizing = false;
  }
}
