import { Component, Input } from '@angular/core';
import { MoveMade } from '@shared/models';
import { BehaviorSubject } from 'rxjs';
import { getMoveNotations } from '@shared/logic';
import { map } from 'rxjs/operators';
import { StatisticsPanelView } from '../../models/statistics-panel-view';
import { StatisticsPane } from '../../models/statistics-pane';

@Component({
  selector: 'statistics-panel',
  templateUrl: './statistics-panel.component.html',
  styleUrl: './statistics-panel.component.scss',
})
export class StatisticsPanelComponent {
  readonly StatisticsPanelView = StatisticsPanelView;

  @Input({ required: true }) set movesMade(movesMade: MoveMade[]) {
    this.movesMade$.next(movesMade);
  }
  @Input({ required: true }) set isHost(isHost: boolean) {
    this.isHost$.next(isHost);
  }

  readonly movesMade$ = new BehaviorSubject<MoveMade[]>([]);
  readonly isHost$ = new BehaviorSubject<boolean>(false);

  readonly moveNotationsPlayerMade$ = this.movesMade$.pipe(
    map(getMoveNotations)
  );

  currentPanelView: StatisticsPanelView = StatisticsPanelView.Moves;

  readonly panes: StatisticsPane[] = [
    {
      iconClass: 'material-symbols-outlined',
      iconString: 'replay',
      title: 'Moves',
    },
  ];
}
