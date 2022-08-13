import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SignalrService } from '../services/SignalRService';

@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.css'],
})
export class HomeViewComponent implements OnInit {
  @Output() hostGameEvent = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {}

  hostGame() {
    this.hostGameEvent.emit();
  }
}
