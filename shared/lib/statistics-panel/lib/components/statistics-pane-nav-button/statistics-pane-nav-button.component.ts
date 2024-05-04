import { Component, Input } from '@angular/core';

@Component({
  selector: 'statistics-pane-nav-button',
  templateUrl: './statistics-pane-nav-button.component.html',
  styleUrl: './statistics-pane-nav-button.component.scss',
})
export class StatisticsPaneNavButtonComponent {
  @Input({ required: true }) iconClass: string;
  @Input({ required: true }) iconString: string;
  @Input({ required: true }) title: string;
  @Input({ required: true }) isActive: boolean;
}
