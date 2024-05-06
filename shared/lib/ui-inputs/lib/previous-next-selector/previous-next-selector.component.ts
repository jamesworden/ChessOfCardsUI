import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'previous-next-selector',
  templateUrl: './previous-next-selector.component.html',
  styleUrl: './previous-next-selector.component.scss',
})
export class PreviousNextSelectorComponent {
  @Output() firstSelected = new EventEmitter();
  @Output() previousSelected = new EventEmitter();
  @Output() nextSelected = new EventEmitter();
  @Output() lastSelected = new EventEmitter();

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
