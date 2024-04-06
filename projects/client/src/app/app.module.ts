import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxsModule } from '@ngxs/store';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameState } from './state/game.state';
import { GameViewComponent } from './views/game-view/game-view.component';
import { HomeViewComponent } from './views/home-view/home-view.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from './views/game-view/components/modal/modal.component';
import { SidebarComponent } from './views/game-view/components/sidebar/sidebar.component';
import { SidebarItemComponent } from './views/game-view/components/sidebar/sidebar-item/sidebar-item.component';
import { ServerState } from './state/server.state';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AnimationOverlayComponent } from './views/game-view/components/animation-overlay/animation-overlay.component';
import { NavbarState } from './state/navbar.state';
import { FooterComponent } from './components/footer/footer.component';
import { PlayerBannerComponent } from './views/game-view/components/player-banner/player-banner.component';
import { GameModule } from '@shared/game';

@NgModule({
  declarations: [
    AppComponent,
    GameViewComponent,
    HomeViewComponent,
    ModalComponent,
    SidebarComponent,
    SidebarItemComponent,
    AnimationOverlayComponent,
    FooterComponent,
    PlayerBannerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DragDropModule,
    NgxsModule.forRoot([GameState, ServerState, NavbarState]),
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule,
    BrowserAnimationsModule,
    MatIconModule,
    FormsModule,
    GameModule,
  ],
  providers: [provideAnimations()],
  bootstrap: [AppComponent],
})
export class AppModule {}
