import {
  Component,
  EventEmitter,
  Output,
  Input,
  ViewChild,
  ElementRef,
  OnInit,
  DestroyRef,
  inject,
} from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { GameState } from '@shared/game';
import { ChatMessage, PlayerOrNone } from '@shared/models';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface DisplayChatMessage {
  name?: string;
  messages: string[];
  date: Date;
  sentByPlayer: boolean;
}

@Component({
  selector: 'statistics-chat-pane',
  templateUrl: './statistics-chat-pane.component.html',
  styleUrl: './statistics-chat-pane.component.scss',
})
export class StatisticsChatPaneComponent implements OnInit {
  readonly #destroyRef = inject(DestroyRef);
  readonly #store = inject(Store);

  @Input() gameIsActive = true;
  @Input({ required: true }) set isHost(isHost: boolean) {
    this.isHost$.next(isHost);
  }

  @Output() chatMessageSent = new EventEmitter<string>();

  @ViewChild('scrollContainer', { static: true })
  scrollContainer!: ElementRef<HTMLElement>;

  readonly isHost$ = new BehaviorSubject<boolean>(false);
  readonly chatMessages$ = new BehaviorSubject<ChatMessage[]>([]);

  readonly displayedChatMessages$ = combineLatest([
    this.chatMessages$,
    this.isHost$,
  ]).pipe(
    map(([chatMessages, isHost]) => {
      const displayChatMessages: DisplayChatMessage[] = [];

      let latestedSentBy = PlayerOrNone.None;

      for (const chatMessage of chatMessages) {
        if (chatMessage.SentBy === latestedSentBy) {
          displayChatMessages[displayChatMessages.length - 1].date =
            chatMessage.SentAtUTC;
          displayChatMessages[displayChatMessages.length - 1].messages.push(
            chatMessage.Message
          );
        } else {
          const sentByPlayer =
            (isHost && chatMessage.SentBy === PlayerOrNone.Host) ||
            (!isHost && chatMessage.SentBy === PlayerOrNone.Guest);

          displayChatMessages.push({
            messages: [chatMessage.Message],
            name: sentByPlayer ? undefined : 'Opponent',
            date: chatMessage.SentAtUTC,
            sentByPlayer,
          });
        }

        latestedSentBy = chatMessage.SentBy;
      }

      return displayChatMessages;
    }),
    tap((displayChatMessages) =>
      setTimeout(() => {
        if (
          displayChatMessages.length > 0 &&
          !this.hasInitiallyScrolledToBottom
        ) {
          this.scrollToBottom('instant');
          this.hasInitiallyScrolledToBottom = true;
        } else {
          this.scrollToBottom('smooth');
        }
      })
    )
  );

  message = '';
  hasInitiallyScrolledToBottom = false;

  ngOnInit() {
    this.#store
      .select(GameState.chatMessages)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((chatMessages) => this.chatMessages$.next(chatMessages));
  }

  sendMessage() {
    if (this.message.trim().length === 0) {
      return;
    }

    const chatMessage: ChatMessage = {
      Message: this.message,
      SentAtUTC: new Date(),
      SentBy: this.isHost$.getValue() ? PlayerOrNone.Host : PlayerOrNone.Guest,
    };

    const existingChatMessages = this.chatMessages$.getValue();
    const newChatMessages = existingChatMessages.concat(chatMessage);

    this.chatMessages$.next(newChatMessages);
    this.chatMessageSent.emit(this.message);
    this.message = '';
  }

  scrollToBottom(scrollBehavior: ScrollBehavior = 'smooth') {
    const container = this.scrollContainer.nativeElement;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: scrollBehavior,
    });
  }
}
