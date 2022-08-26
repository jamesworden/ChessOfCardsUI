import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.css'],
})
export class PositionComponent implements OnInit {
  @Input() laneIndex: number;
  @Input() rowIndex: number;

  constructor() {}

  ngOnInit(): void {}

  drop(event: any) {
    console.log('position', event);
  }
}
