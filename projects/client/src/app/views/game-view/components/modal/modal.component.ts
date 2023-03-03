import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalData } from './modal-data';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent {
  @Output() buttonClicked = new EventEmitter<string>();

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,

    @Inject(MAT_DIALOG_DATA)
    public data: ModalData
  ) {}

  onButtonClicked(button: string) {
    this.buttonClicked.emit(button);
  }
}
