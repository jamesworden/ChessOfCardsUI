import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { ViewState } from './state/view.state';
import { View } from './views';
import { Observable } from 'rxjs';
import { style, animate, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(500, style({ opacity: 1 })),
      ]),
      transition(':leave', [animate(500, style({ opacity: 0 }))]),
    ]),
  ],
})
export class AppComponent {
  @Select(ViewState.currentView)
  currentView$: Observable<View>;

  View = View;

  constructor() {}
}
