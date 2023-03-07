import { AfterViewInit, Component, Input } from '@angular/core';
import { FocusMonitor } from '@angular/cdk/a11y';

@Component({
  selector: 'app-sidebar-item',
  templateUrl: './sidebar-item.component.html',
  styleUrls: ['./sidebar-item.component.css'],
})
export class SidebarItemComponent implements AfterViewInit {
  /** CSS width, height, and font size of the item. */
  @Input() itemHeight: number;
  @Input() iconSize: number;
  @Input() materialSymbol: string;
  @Input() iconColor = 'white';
  @Input() itemWidth: number;

  constructor(private focusMonitor: FocusMonitor) {}

  ngAfterViewInit() {
    this.removeButtonHighlightBug();
  }

  /**
   * When the sidebar button triggers the modal, it remains highlighted after the
   * modal is closed. This hack prevents that from happening.
   */
  removeButtonHighlightBug() {
    const buttons = document.getElementsByClassName('sidebar-button');
    const buttonArray = Array.from(buttons);

    for (const button of buttonArray) {
      this.focusMonitor.stopMonitoring(button as HTMLElement);
    }
  }
}
