import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MoveMade } from '@shared/models';
import { BehaviorSubject } from 'rxjs';
import { MoveNotation } from '@shared/logic';
import { StatisticsPanelView } from '../../models/statistics-panel-view';
import { StatisticsPane } from '../../models/statistics-pane';

@Component({
  selector: 'statistics-panel',
  templateUrl: './statistics-panel.component.html',
  styleUrl: './statistics-panel.component.scss',
})
export class StatisticsPanelComponent {
  readonly StatisticsPanelView = StatisticsPanelView;

  @Input({ required: true }) moveNotations: MoveNotation[] = [];
  @Input({ required: true }) selectedNotationIndex: number | null = null;
  @Input({ required: true }) set isHost(isHost: boolean) {
    this.isHost$.next(isHost);
  }

  @Output() moveNotationSelected = new EventEmitter<number>();

  readonly movesMade$ = new BehaviorSubject<MoveMade[]>([]);
  readonly isHost$ = new BehaviorSubject<boolean>(false);

  currentPanelView: StatisticsPanelView = StatisticsPanelView.Moves;

  readonly panes: StatisticsPane[] = [
    {
      iconClass: 'material-symbols-outlined',
      iconString: 'replay',
      title: 'Moves',
      panelView: StatisticsPanelView.Moves,
    },
  ];

  selectMoveNotation(moveSelectedIndex: number) {
    this.moveNotationSelected.emit(moveSelectedIndex);
  }
}
