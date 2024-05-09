import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsPanelComponent } from './components/statistics-panel/statistics-panel.component';
import { CardStackComponent } from './components/card-stack/card-stack.component';
import { GameModule } from '@shared/game';
import { StatisticsMovesPaneComponent } from './components/statistics-moves-pane/statistics-moves-pane.component';
import { StatisticsPaneNavButtonComponent } from './components/statistics-pane-nav-button/statistics-pane-nav-button.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UiInputsModule } from '@shared/ui-inputs';

@NgModule({
  declarations: [
    StatisticsPanelComponent,
    CardStackComponent,
    StatisticsMovesPaneComponent,
    StatisticsPaneNavButtonComponent,
  ],
  imports: [CommonModule, GameModule, MatTooltipModule, UiInputsModule],
  exports: [
    StatisticsPanelComponent,
    CardStackComponent,
    StatisticsPaneNavButtonComponent,
    StatisticsMovesPaneComponent,
  ],
})
export class StatisticsPanelModule {}
