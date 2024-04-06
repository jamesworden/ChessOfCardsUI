import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './components/card/card.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { LaneComponent } from './components/lane/lane.component';
import { PositionComponent } from './components/position/position.component';
import { JokerCardComponent } from './components/joker-card/joker-card.component';

@NgModule({
  declarations: [
    CardComponent,
    LaneComponent,
    PositionComponent,
    JokerCardComponent,
  ],
  imports: [CommonModule, DragDropModule],
  exports: [
    CardComponent,
    PositionComponent,
    LaneComponent,
    JokerCardComponent,
  ],
})
export class GameModule {}
