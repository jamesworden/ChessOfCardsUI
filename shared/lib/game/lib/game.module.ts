import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './components/card/card.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [CardComponent],
  imports: [CommonModule, DragDropModule],
  exports: [CardComponent],
})
export class GameModule {}
