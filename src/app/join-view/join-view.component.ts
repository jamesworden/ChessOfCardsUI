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
      this.joinGameEvent.emit(this.gameCodeInput);
    }
  }

  keyIsValid(key: string) {
    const validKeyRegex = new RegExp(/^\w+$/);
    return validKeyRegex.test(key);
  }

  renderGameCode() {
    console.log(this.gameCodeInput);
    const keyElements = document.getElementsByClassName('game-code-char');

    for (let i = 0; i < this.gameCodeInput.length; i++) {
      const keyElement = keyElements.item(i);

      if (keyElement) {
        keyElement.textContent = this.gameCodeInput.charAt(i);
      }
    }
  }
}
