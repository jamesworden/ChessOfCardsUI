import { Component, Input } from '@angular/core';
import { MoveMade } from '@shared/models';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { getMoveNotationsPlayerMade } from '@shared/logic';
import { map } from 'rxjs/operators';

enum StatisticsPanelView {
  Moves = 'moves',
}

interface Pane {
  iconClass: string;
  iconString: string;
  title: string;
}

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
    map(getMoveNotationsPlayerMade)
  );

  currentPanelView: StatisticsPanelView = StatisticsPanelView.Moves;

  readonly panes: Pane[] = [
    {
      iconClass: 'material-symbols-outlined',
      iconString: 'replay',
      title: 'Moves',
    },
  ];
}
