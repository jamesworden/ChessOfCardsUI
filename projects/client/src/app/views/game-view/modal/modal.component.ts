import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      header: string;
      message: string;
    },
    private store: Store
  ) {
    dialogRef.afterClosed().subscribe(() => {
      console.log('Switch to home view.');
      // this.store.dispatch(new SwitchView(Views.Home));
    });
  }

  ngOnInit(): void {}
}
