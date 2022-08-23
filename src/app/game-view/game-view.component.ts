import { Component, OnInit } from '@angular/core';
import { SignalrService } from '../services/SignalRService';

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.css'],
})
export class GameViewComponent implements OnInit {
  gameIsRunning = true;
  gameOverMessage: string | null = null;

  constructor(SignalrService: SignalrService) {
    SignalrService.gameOverMessage$.subscribe((message) => {
      this.gameIsRunning = false;
      this.gameOverMessage = message;
    });
  }

  ngOnInit(): void {}
}
