import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SignalrService } from '../../services/SignalRService';

@Component({
  selector: 'app-host-view',
  templateUrl: './host-view.component.html',
  styleUrls: ['./host-view.component.css'],
})
export class HostViewComponent implements OnInit {
  gameCode = '';

  constructor(public signalrService: SignalrService) {
    this.signalrService.gameCode$.subscribe((gameCode) => {
      this.gameCode = gameCode;
    });
  }

  ngOnInit(): void {}
}
