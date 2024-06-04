import { FocusMonitor } from '@angular/cdk/a11y';
import { Component, EventEmitter, Output, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalData } from '../models/modal-data';

@Component({
  selector: 'button-modal',
  templateUrl: './button-modal.component.html',
  styleUrl: './button-modal.component.css',
})
export class ButtonModalComponent {
  @Output() buttonClicked = new EventEmitter<string>();

  constructor(
    public dialogRef: MatDialogRef<ButtonModalComponent>,
    private focusMonitor: FocusMonitor,
    @Inject(MAT_DIALOG_DATA) public data: ModalData
  ) {}

  ngAfterViewInit() {
    this.removeButtonHighlightBug();
  }

  onButtonClicked(button: string) {
    this.buttonClicked.emit(button);
  }

  /**
   * When buttons are rendered in the modal, they are sometimes
   * highlighted by default for no reason. This fixes that.
   */
  removeButtonHighlightBug() {
    const buttons = document.getElementsByTagName('button');
    const buttonArray = Array.from(buttons);

    for (const button of buttonArray) {
      this.focusMonitor.stopMonitoring(button as HTMLElement);
    }
  }
}
