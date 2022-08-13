import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-host-view',
  templateUrl: './host-view.component.html',
  styleUrls: ['./host-view.component.css'],
})
export class HostViewComponent implements OnInit {
  @Input() gameCode: string = '';

  constructor() {}

  ngOnInit(): void {}
}
