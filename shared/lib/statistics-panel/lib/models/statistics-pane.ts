import { StatisticsPanelView } from './statistics-panel-view';

export interface StatisticsPane {
  iconClass: string;
  iconString: string;
  title: string;
  panelView: StatisticsPanelView;
}
