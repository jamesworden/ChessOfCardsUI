import { Component, EventEmitter, Output } from '@angular/core';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
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

  constructor(private store: Store) {}

  onHowToPlay() {
    this.store.dispatch(new UpdateView(View.Tutorial));
  }

  onPlayAsGuest() {
    this.store.dispatch(new UpdateView(View.HostOrJoin));
  }
}
