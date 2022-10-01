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
import { FaceDownCardComponent } from './views/game-view/face-down-card/face-down-card.component';
import { CardComponent } from './views/game-view/card/card.component';
import { DeckComponent } from './views/game-view/deck/deck.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PositionComponent } from './views/game-view/position/position.component';
import { ModalComponent } from './views/game-view/modal/modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    AppComponent,
    GameViewComponent,
    HomeViewComponent,
    HostViewComponent,
    JoinViewComponent,
    FaceDownCardComponent,
    CardComponent,
    DeckComponent,
    PositionComponent,
    ModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DragDropModule,
    NgxsModule.forRoot([GameState]),
    BrowserAnimationsModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
