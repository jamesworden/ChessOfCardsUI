import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { PlayerGameState } from '../state/player-game-state.state';

import { SignalrService } from './SignalRService';

describe('SignalrServiceService', () => {
  let service: SignalrService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([PlayerGameState])],
    });
    service = TestBed.inject(SignalrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
