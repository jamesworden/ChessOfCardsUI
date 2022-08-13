import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-join-view',
  templateUrl: './join-view.component.html',
  styleUrls: ['./join-view.component.css'],
})
export class JoinViewComponent implements OnInit {
  @Output() joinGameEvent = new EventEmitter();

  gameCodeInput = '';

  constructor() {
    document.addEventListener('keypress', ({ key }) => {
      this.attemptType(key);
    });

    document.addEventListener('keydown', ({ key }) => {
      if (key == 'Backspace') {
        this.attemptBackspace();
      }
    });
  }

  ngOnInit(): void {}

  onSubmitGameCode() {
    this.joinGameEvent.emit();
  }

  attemptType(key: string) {
    if (key.length != 1) {
      return;
    }

    if (this.gameCodeInput.length >= 4) {
      return;
    }

    if (!this.keyIsValid(key)) {
      return;
    }

    this.gameCodeInput += key.toUpperCase();

    this.renderGameCode();

    const isFinalKey = this.gameCodeInput.length == 4;

    if (isFinalKey) {
      this.joinGameEvent.emit({ gameCode: this.gameCodeInput });
    }
  }

  keyIsValid(key: string) {
    const validKeyRegex = new RegExp(/^\w+$/);
    return validKeyRegex.test(key);
  }

  renderGameCode() {
    console.log(this.gameCodeInput);
    const keyElements = document.getElementsByClassName('game-code-char');

    for (let i = 0; i < 4; i++) {
      const keyElement = keyElements.item(i);
      const keyForThisElementExists = this.gameCodeInput.length - 1 >= i;

      if (!keyElement) break;

      if (keyForThisElementExists) {
        const key = this.gameCodeInput.charAt(i);
        keyElement.textContent = key;
      } else {
        keyElement.textContent = '';
      }
    }
  }

  attemptBackspace() {
    if (this.gameCodeInput.length > 0) {
      this.gameCodeInput = this.gameCodeInput.substring(
        0,
        this.gameCodeInput.length - 1
      );

      this.renderGameCode();
    }
  }
}
