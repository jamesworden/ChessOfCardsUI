import { Component, OnInit } from '@angular/core';
import { SignalrService } from '../services/SignalRService';

@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.css'],
})
export class HomeViewComponent implements OnInit {
  constructor(public signalrService: SignalrService) {}

  ngOnInit(): void {}

  hostGame() {
    this.signalrService.createGame();
  }
}
