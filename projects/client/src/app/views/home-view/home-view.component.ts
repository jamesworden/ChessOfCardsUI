import { Component, EventEmitter, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngxs/store';
import { View } from '..';
import { UpdateView } from '../../actions/view.actions';

@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.css'],
})
export class HomeViewComponent {
  currentYear = new Date().getFullYear();

  constructor(private store: Store, private snackBar: MatSnackBar) {}

  onHowToPlay() {
    this.snackBar.open('Under construction.', 'Coming soon!', {
      duration: 1500,
      verticalPosition: 'top',
    });
  }

  onPlayAsGuest() {
    this.store.dispatch(new UpdateView(View.HostOrJoin));
  }

  onLogin() {
    this.snackBar.open('Under construction.', 'Coming soon!', {
      duration: 1500,
      verticalPosition: 'top',
    });
  }
}
