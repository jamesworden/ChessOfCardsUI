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
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
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

  @Output() chatMessageSent = new EventEmitter<string>();

  @Select(GameState.gameIsActive)
  gameIsActive$!: Observable<boolean>;

  @Select(GameState.isHost)
  isHost$!: Observable<boolean>;

  @ViewChild('scrollContainer', { static: true })
  scrollContainer!: ElementRef<HTMLElement>;

  readonly chatMessages$ = new BehaviorSubject<ChatMessage[]>([]);

  readonly displayedChatMessages$ = combineLatest([
    this.chatMessages$,
    this.isHost$,
  ]).pipe(
    map(([chatMessages, isHost]) => {
      const displayChatMessages: DisplayChatMessage[] = [];

      let latestedSentBy = PlayerOrNone.None;

      for (const chatMessage of chatMessages) {
        if (chatMessage.sentBy === latestedSentBy) {
          displayChatMessages[displayChatMessages.length - 1].date =
            chatMessage.sentAtUTC;
          displayChatMessages[displayChatMessages.length - 1].messages.push(
            chatMessage.message
          );
        } else {
          const sentByPlayer =
            (isHost && chatMessage.sentBy === PlayerOrNone.Host) ||
            (!isHost && chatMessage.sentBy === PlayerOrNone.Guest);

          displayChatMessages.push({
            messages: [chatMessage.message],
            name: sentByPlayer ? undefined : 'Opponent',
            date: chatMessage.sentAtUTC,
            sentByPlayer,
          });
        }

        latestedSentBy = chatMessage.sentBy;
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
      message: this.message,
      sentAtUTC: new Date(),
      sentBy: this.#store.selectSnapshot(GameState.isHost)
        ? PlayerOrNone.Host
        : PlayerOrNone.Guest,
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
