import {
  Component,
  Inject,
  Output,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalData } from './modal-data';
import { FocusMonitor } from '@angular/cdk/a11y';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements AfterViewInit {
  @Output() buttonClicked = new EventEmitter<string>();

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
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
   * When buttons are rendered in the modal, they are sometimes highlighted by
   * default for no reason. This fixes that.
   */
  removeButtonHighlightBug() {
    const buttons = document.getElementsByTagName('button');
    const buttonArray = Array.from(buttons);

    for (const button of buttonArray) {
      this.focusMonitor.stopMonitoring(button as HTMLElement);
    }
  }
}
