import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameViewComponent } from './game-view/game-view.component';
import { HomeViewComponent } from './home-view/home-view.component';
import { HostViewComponent } from './host-view/host-view.component';
import { JoinViewComponent } from './join-view/join-view.component';

@NgModule({
  declarations: [
    AppComponent,
    GameViewComponent,
    HomeViewComponent,
    HostViewComponent,
    JoinViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
