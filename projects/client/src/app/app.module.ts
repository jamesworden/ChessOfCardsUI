import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxsModule } from '@ngxs/store';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameState } from '@shared/game';
import { GameViewComponent } from './views/game-view/game-view.component';
import { HomeViewComponent } from './views/home-view/home-view.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from './views/game-view/components/sidebar/sidebar.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FooterComponent } from './components/footer/footer.component';
import { PlayerBannerComponent } from './views/game-view/components/player-banner/player-banner.component';
import { GameModule } from '@shared/game';
import { AnimationOverlayModule } from '@shared/animation-overlay';
import { StatisticsPanelModule } from '@shared/statistics-panel';
import { UiInputsModule } from '@shared/ui-inputs';
import { OpponentHandToolbarComponent } from './views/game-view/components/opponent-hand-toolbar/opponent-hand-toolbar.component';
import { GameViewNavbarComponent } from './views/game-view/components/game-view-navbar/game-view-navbar.component';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [
    AppComponent,
    GameViewComponent,
    HomeViewComponent,
    SidebarComponent,
    FooterComponent,
    PlayerBannerComponent,
    OpponentHandToolbarComponent,
    GameViewNavbarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DragDropModule,
    NgxsModule.forRoot([GameState]),
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule,
    BrowserAnimationsModule,
    MatIconModule,
    FormsModule,
    GameModule,
    AnimationOverlayModule,
    StatisticsPanelModule,
    UiInputsModule,
    MatMenuModule,
  ],
  providers: [provideAnimations()],
  bootstrap: [AppComponent],
})
export class AppModule {}
