import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeViewComponent } from './views/home-view/home-view.component';
import { GameViewComponent } from './views/game-view/game-view.component';

const routes: Routes = [
  {
    path: '',
    component: HomeViewComponent,
  },
  {
    path: 'game',
    component: GameViewComponent,
  },
  {
    path: 'game/:gameCode',
    component: GameViewComponent,
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
