import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tutorial-button',
  templateUrl: './tutorial-button.component.html',
  styleUrls: ['./tutorial-button.component.css'],
})
export class TutorialButtonComponent {
  @Input() tutorialName = '';

  constructor() {}

  onStart() {
    console.log(`Starting tutorial: ${this.tutorialName}`);
  }
}
