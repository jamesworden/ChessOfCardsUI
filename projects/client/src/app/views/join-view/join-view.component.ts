import { Component, Input, OnInit } from '@angular/core';
import { SignalrService } from '../../services/SignalRService';

@Component({
  selector: 'app-join-view',
  templateUrl: './join-view.component.html',
  styleUrls: ['./join-view.component.css'],
})
export class JoinViewComponent implements OnInit {
  @Input() invalidGameCode = false;

  gameCodeInput = '';

  constructor(public signalrService: SignalrService) {
    signalrService.invalidGameCode$.subscribe((invalidGameCode) => {
      this.invalidGameCode = invalidGameCode;
    });

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
      this.signalrService.joinGame(this.gameCodeInput);
    }
  }

  keyIsValid(key: string) {
    const validKeyRegex = new RegExp(/^\w+$/);
    return validKeyRegex.test(key);
  }

  renderGameCode() {
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

      this.invalidGameCode = false;
    }
  }
}
