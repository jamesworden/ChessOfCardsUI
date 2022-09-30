import { TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { GameState } from '../state/game.state';

import { SignalrService } from './SignalRService';

describe('SignalrServiceService', () => {
  let service: SignalrService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([GameState])],
    });
    service = TestBed.inject(SignalrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
