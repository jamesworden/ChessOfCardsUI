import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { SignalrService } from '../../services/SignalRService';
import { PlayerGameState } from '../../state/player-game-state.state';

import { JoinViewComponent } from './join-view.component';

describe('JoinViewComponent', () => {
  let component: JoinViewComponent;
  let fixture: ComponentFixture<JoinViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JoinViewComponent],
      imports: [NgxsModule.forRoot([PlayerGameState])],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
