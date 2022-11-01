import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { ViewState } from './state/view.state';
import { View } from './views';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @Select(ViewState.currentView)
  currentView$: Observable<View>;

  View = View;

  constructor() {}
}
