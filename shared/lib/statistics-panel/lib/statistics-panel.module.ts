import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsPanelComponent } from './components/statistics-panel/statistics-panel.component';
import { CardStackComponent } from './components/card-stack/card-stack.component';
import { GameModule } from '@shared/game';

@NgModule({
  declarations: [StatisticsPanelComponent, CardStackComponent],
  imports: [CommonModule, GameModule],
  exports: [StatisticsPanelComponent, CardStackComponent],
})
export class StatisticsPanelModule {}
