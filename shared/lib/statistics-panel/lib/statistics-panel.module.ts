import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsPanelComponent } from './components/statistics-panel/statistics-panel.component';
import { CardStackComponent } from './components/card-stack/card-stack.component';
import { GameModule } from '@shared/game';
import { StatisticsMovesPaneComponent } from './components/statistics-moves-pane/statistics-moves-pane.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UiInputsModule } from '@shared/ui-inputs';
import { StatisticsChatPaneComponent } from './components/statistics-chat-panel/statistics-chat-pane.component';
import { FormsModule } from '@angular/forms';
import { StatisticsNewGamePaneComponent } from './components/statistics-new-game-pane/statistics-new-game-pane.component';
import { NewGameTypeButtonComponent } from './components/statistics-new-game-pane/components/new-game-type-button/new-game-type-button.component';

@NgModule({
  declarations: [
    StatisticsPanelComponent,
    CardStackComponent,
    StatisticsMovesPaneComponent,
    StatisticsChatPaneComponent,
    StatisticsNewGamePaneComponent,
    NewGameTypeButtonComponent,
  ],
  imports: [
    CommonModule,
    GameModule,
    MatTooltipModule,
    UiInputsModule,
    FormsModule,
  ],
  exports: [
    StatisticsPanelComponent,
    CardStackComponent,
    StatisticsMovesPaneComponent,
    StatisticsChatPaneComponent,
    StatisticsNewGamePaneComponent,
  ],
})
export class StatisticsPanelModule {}
