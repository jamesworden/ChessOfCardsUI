import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { FocusMonitor } from '@angular/cdk/a11y';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sidebar-item',
  templateUrl: './sidebar-item.component.html',
  styleUrls: ['./sidebar-item.component.scss'],
})
export class SidebarItemComponent implements AfterViewInit {
  readonly #focusMonitor = inject(FocusMonitor);
  readonly #snackBar = inject(MatSnackBar);

  /** CSS width, height, and font size of the item. */
  @Input() itemHeight: number;
  @Input() iconSize: number;
  @Input() materialSymbol: string;
  @Input() iconColor = 'white';
  @Input() itemWidth: number;
  @Input() disabled = false;

  @Output() selected = new EventEmitter<void>();

  ngAfterViewInit() {
    this.removeButtonHighlightBug();
  }

  onClick() {
    if (this.disabled) {
      this.#snackBar.open('Waiting for response from server...', undefined, {
        duration: 1500,
        verticalPosition: 'top',
      });
    } else {
      this.selected.emit();
    }
  }

  /**
   * When the sidebar button triggers the modal, it remains highlighted after the
   * modal is closed. This hack prevents that from happening.
   */
  removeButtonHighlightBug() {
    const buttons = document.getElementsByClassName('sidebar-button');
    const buttonArray = Array.from(buttons);

    for (const button of buttonArray) {
      this.#focusMonitor.stopMonitoring(button as HTMLElement);
    }
  }
}
