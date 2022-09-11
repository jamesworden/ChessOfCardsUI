import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { PlayerGameState } from '../../state/player-game-state.state';

import { GameViewComponent } from './game-view.component';

describe('GameViewComponent', () => {
  let component: GameViewComponent;
  let fixture: ComponentFixture<GameViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GameViewComponent],
      imports: [NgxsModule.forRoot([PlayerGameState])],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
