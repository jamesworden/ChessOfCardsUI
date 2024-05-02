import { Component } from '@angular/core';

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

  currentPanelView: StatisticsPanelView = StatisticsPanelView.Moves;

  readonly panes: Pane[] = [
    {
      iconClass: 'material-symbols-outlined',
      iconString: 'replay',
      title: 'Moves',
    },
  ];
}
