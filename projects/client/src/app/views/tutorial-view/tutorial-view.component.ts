import { Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { View } from '..';
import { UpdateView } from '../../actions/view.actions';
import { Tutorial } from '.';
import { SubscriptionManager } from '../../util/subscription-manager';
import { TutorialState } from '../../state/tutorial.state';
import { Observable } from 'rxjs';
import {
  style,
  animate,
  transition,
  trigger,
  state,
} from '@angular/animations';

const TRANSITION_TITLE_DURATION = 2000;

@Component({
  selector: 'app-tutorial-view',
  templateUrl: './tutorial-view.component.html',
  styleUrls: ['./tutorial-view.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('*', style({ position: 'absolute', left: 0, right: 0 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate(500, style({ opacity: 1 })),
      ]),
      transition(':leave', [animate(250, style({ opacity: 0 }))]),
    ]),
  ],
})
export class TutorialViewComponent {
  private sm = new SubscriptionManager();

  @Select(TutorialState.currentTutorial)
  currentTutorial$!: Observable<Tutorial | null>;

  showingTransitionTitle = false;
  finishedTransitionTitle = false;

  constructor(private store: Store) {
    this.sm.add(
      this.currentTutorial$.subscribe((currentTutorial) => {
        if (currentTutorial) {
          this.showingTransitionTitle = true;
          this.finishedTransitionTitle = false;

          setTimeout(() => {
            this.showingTransitionTitle = false;
            this.finishedTransitionTitle = true;
          }, TRANSITION_TITLE_DURATION);
        }
      })
    );
  }

  Tutorial = Tutorial;

  onBack() {
    this.store.dispatch(new UpdateView(View.Home));
  }
}
