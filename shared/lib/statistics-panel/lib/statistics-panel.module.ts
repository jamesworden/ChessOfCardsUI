import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsPanelComponent } from './components/statistics-panel/statistics-panel.component';
import { CardStackComponent } from './components/card-stack/card-stack.component';
import { GameModule } from '@shared/game';
import { StatisticsMovesPaneComponent } from './components/statistics-moves-pane/statistics-moves-pane.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UiInputsModule } from '@shared/ui-inputs';

@NgModule({
  declarations: [
    StatisticsPanelComponent,
    CardStackComponent,
    StatisticsMovesPaneComponent,
  ],
  imports: [CommonModule, GameModule, MatTooltipModule, UiInputsModule],
  exports: [
    StatisticsPanelComponent,
    CardStackComponent,
    StatisticsMovesPaneComponent,
  ],
})
export class StatisticsPanelModule {}
