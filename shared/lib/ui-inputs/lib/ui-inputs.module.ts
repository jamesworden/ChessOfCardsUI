import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreviousNextSelectorComponent } from './previous-next-selector/previous-next-selector.component';
import { ResizableDirective } from './resizable.directive';

@NgModule({
  declarations: [PreviousNextSelectorComponent, ResizableDirective],
  imports: [CommonModule],
  exports: [PreviousNextSelectorComponent, ResizableDirective],
})
export class UiInputsModule {}
