import { Component, Input } from '@angular/core';
import { Store } from '@ngxs/store';
import { Tutorial } from '../..';
import { StartTutorial } from '../../../../actions/tutorial.actions';

@Component({
  selector: 'app-tutorial-button',
  templateUrl: './tutorial-button.component.html',
  styleUrls: ['./tutorial-button.component.css'],
})
export class TutorialButtonComponent {
  @Input() tutorial: Tutorial;

  constructor(private store: Store) {}

  onStart() {
    this.store.dispatch(new StartTutorial(this.tutorial));
  }
}
