import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Tutorial } from '.';
import { TutorialState } from '../../state/tutorial.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tutorial-view',
  templateUrl: './tutorial-view.component.html',
  styleUrls: ['./tutorial-view.component.css'],
})
export class TutorialViewComponent {
  @Select(TutorialState.currentTutorial)
  currentTutorial$!: Observable<Tutorial | null>;

  Tutorial = Tutorial;

  onBack() {}
}
