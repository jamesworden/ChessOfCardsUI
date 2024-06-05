import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-player-banner',
  templateUrl: './player-banner.component.html',
  styleUrl: './player-banner.component.scss',
})
export class PlayerBannerComponent {
  @Input({ required: true }) username: string;
  @Input() elo?: number;
  @Input() containerClass: string;
  @Input() opponentDisconnectTimer: number | null;
}
