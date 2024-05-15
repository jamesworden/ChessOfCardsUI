import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreviousNextSelectorComponent } from './previous-next-selector/previous-next-selector.component';
import { ResizableDirective } from './resizable.directive';
import { IconButtonComponent } from './icon-button/icon-button.component';
import { MatBadgeModule } from '@angular/material/badge';

@NgModule({
  declarations: [
    PreviousNextSelectorComponent,
    ResizableDirective,
    IconButtonComponent,
  ],
  imports: [CommonModule, MatBadgeModule],
  exports: [
    PreviousNextSelectorComponent,
    ResizableDirective,
    IconButtonComponent,
  ],
})
export class UiInputsModule {}
