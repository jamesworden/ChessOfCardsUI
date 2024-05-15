import { Component, inject, EventEmitter, Output, Input } from '@angular/core';
import { ChatMessage, PlayerOrNone } from '@shared/models';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'statistics-chat-pane',
  templateUrl: './statistics-chat-pane.component.html',
  styleUrl: './statistics-chat-pane.component.scss',
})
export class StatisticsChatPaneComponent {
  @Input({ required: true }) isHost: boolean;
  @Input({ required: true }) set chatMessages(chatMessages: ChatMessage[]) {
    this.chatMessages$.next(chatMessages);
  }

  @Output() chatMessageSent = new EventEmitter<string>();

  readonly chatMessages$ = new BehaviorSubject<ChatMessage[]>([]);

  message = '';

  sendMessage() {
    if (this.message.trim().length === 0) {
      return;
    }

    const chatMessage: ChatMessage = {
      Message: this.message,
      SentAtUTC: new Date(),
      SentBy: this.isHost ? PlayerOrNone.Host : PlayerOrNone.Guest,
    };

    const existingChatMessages = this.chatMessages$.getValue();
    const newChatMessages = existingChatMessages.concat(chatMessage);

    this.chatMessages$.next(newChatMessages);
    this.chatMessageSent.emit(this.message);
    this.message = '';
  }
}
