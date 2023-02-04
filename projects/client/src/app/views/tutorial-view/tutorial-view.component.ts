import { Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { View } from '..';
import { UpdateView } from '../../actions/view.actions';
import { Tutorial } from '.';
import { TutorialState } from '../../state/tutorial.state';
import { Observable } from 'rxjs';
import {
  style,
  animate,
  transition,
  trigger,
  state,
} from '@angular/animations';

@Component({
  selector: 'app-tutorial-view',
  templateUrl: './tutorial-view.component.html',
  styleUrls: ['./tutorial-view.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('*', style({ position: 'absolute', left: 0, right: 0 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate(100, style({ opacity: 1 })),
      ]),
      transition(':leave', [animate(100, style({ opacity: 0 }))]),
    ]),
  ],
})
export class TutorialViewComponent {
  @Select(TutorialState.currentTutorial)
  currentTutorial$!: Observable<Tutorial | null>;

  constructor(private store: Store) {}

  Tutorial = Tutorial;

  onBack() {
    this.store.dispatch(new UpdateView(View.Home));
  }
}
