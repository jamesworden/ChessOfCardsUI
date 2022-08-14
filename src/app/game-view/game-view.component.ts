import { Component, OnInit } from '@angular/core';
import { SignalrService } from '../services/SignalRService';

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.css'],
})
export class GameViewComponent implements OnInit {
  gameOverMessage: string | null = null;

  constructor(SignalrService: SignalrService) {
    SignalrService.gameOver$.subscribe((message) => {
      this.gameOverMessage = message;
    });
  }

  ngOnInit(): void {}
}
