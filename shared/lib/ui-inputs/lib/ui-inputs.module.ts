import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreviousNextSelectorComponent } from './previous-next-selector/previous-next-selector.component';
import { ResizableDirective } from './resizable.directive';
import { IconButtonComponent } from './icon-button/icon-button.component';
import { MatBadgeModule } from '@angular/material/badge';
import { ButtonModalComponent } from './button-modal/button-modal.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    PreviousNextSelectorComponent,
    ResizableDirective,
    IconButtonComponent,
    ButtonModalComponent,
  ],
  imports: [CommonModule, MatBadgeModule, MatButtonModule],
  exports: [
    PreviousNextSelectorComponent,
    ResizableDirective,
    IconButtonComponent,
    ButtonModalComponent,
  ],
})
export class UiInputsModule {}
