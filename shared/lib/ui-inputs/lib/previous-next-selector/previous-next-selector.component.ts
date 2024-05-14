import {
  Component,
  EventEmitter,
  HostListener,
  Output,
  Input,
} from '@angular/core';

@Component({
  selector: 'previous-next-selector',
  templateUrl: './previous-next-selector.component.html',
  styleUrl: './previous-next-selector.component.scss',
})
export class PreviousNextSelectorComponent {
  @Input() selectFirstDisabled = false;
  @Input() selectPrevDisabled = false;
  @Input() selectNextDisabled = false;
  @Input() selectLastDisabled = false;

  @Output() firstSelected = new EventEmitter();
  @Output() previousSelected = new EventEmitter();
  @Output() nextSelected = new EventEmitter();
  @Output() lastSelected = new EventEmitter();

  @HostListener('document:keydown.arrowup')
  handleUpArrow() {
    this.selectPrevious();
  }

  @HostListener('document:keydown.arrowdown')
  handleDownArrow() {
    this.selectNext();
  }

  selectFirst() {
    this.firstSelected.emit();
  }

  selectPrevious() {
    this.previousSelected.emit();
  }

  selectNext() {
    this.nextSelected.emit();
  }

  selectLast() {
    this.lastSelected.emit();
  }
}
