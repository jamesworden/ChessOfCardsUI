import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxsModule } from '@ngxs/store';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameState } from './state/game.state';
import { GameViewComponent } from './views/game-view/game-view.component';
import { HomeViewComponent } from './views/home-view/home-view.component';
import { HostViewComponent } from './views/host-view/host-view.component';
import { JoinViewComponent } from './views/join-view/join-view.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { HostOrJoinViewComponent } from './views/host-or-join-view/host-or-join-view.component';
import { ViewState } from './state/view.state';
import { TutorialViewComponent } from './views/tutorial-view/tutorial-view.component';
import { TutorialButtonComponent } from './views/tutorial-view/components/tutorial-button/tutorial-button.component';
import { TutorialState } from './state/tutorial.state';
import { CardComponent } from './views/game-view/components/card/card.component';
import { FaceDownCardComponent } from './views/game-view/components/face-down-card/face-down-card.component';
import { PositionComponent } from './views/game-view/components/position/position.component';
import { ModalComponent } from './views/game-view/components/modal/modal.component';
import { PlaceMultipleCardsLaneComponent } from './views/game-view/components/place-multiple-cards-lane/place-multiple-cards-lane.component';
import { LaneComponent } from './views/game-view/components/lane/lane.component';
import { PlayerHandComponent } from './views/game-view/components/player-hand/player-hand.component';
import { OpponentHandComponent } from './views/game-view/components/opponent-hand/opponent-hand.component';
import { BoardComponent } from './views/game-view/components/board/board.component';
import { SidebarComponent } from './views/game-view/components/sidebar/sidebar.component';
import { SidebarItemComponent } from './views/game-view/components/sidebar/sidebar-item/sidebar-item.component';
import { ServerState } from './state/server.state';
import { JokerCardComponent } from './views/game-view/components/joker-card/joker-card.component';

@NgModule({
  declarations: [
    AppComponent,
    GameViewComponent,
    HomeViewComponent,
    HostViewComponent,
    JoinViewComponent,
    FaceDownCardComponent,
    CardComponent,
    PositionComponent,
    ModalComponent,
    PlaceMultipleCardsLaneComponent,
    HostOrJoinViewComponent,
    TutorialViewComponent,
    TutorialButtonComponent,
    LaneComponent,
    PlayerHandComponent,
    OpponentHandComponent,
    BoardComponent,
    SidebarComponent,
    SidebarItemComponent,
    JokerCardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DragDropModule,
    NgxsModule.forRoot([GameState, ViewState, TutorialState, ServerState]),
    BrowserAnimationsModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
