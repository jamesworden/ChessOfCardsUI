import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { View } from '..';
import { UpdateView } from '../../actions/view.actions';

@Component({
  selector: 'app-tutorial-view',
  templateUrl: './tutorial-view.component.html',
  styleUrls: ['./tutorial-view.component.css'],
})
export class TutorialViewComponent {
  constructor(private store: Store) {}

  onBack() {
    this.store.dispatch(new UpdateView(View.Home));
  }
}
