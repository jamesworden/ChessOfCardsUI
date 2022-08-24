import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxsModule } from '@ngxs/store';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlayerGameState } from './state/player-game-state.state';
import { GameViewComponent } from './views/game-view/game-view.component';
import { HomeViewComponent } from './views/home-view/home-view.component';
import { HostViewComponent } from './views/host-view/host-view.component';
import { JoinViewComponent } from './views/join-view/join-view.component';

@NgModule({
  declarations: [
    AppComponent,
    GameViewComponent,
    HomeViewComponent,
    HostViewComponent,
    JoinViewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxsModule.forRoot([PlayerGameState]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
