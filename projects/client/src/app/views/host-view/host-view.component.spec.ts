import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { PlayerGameState } from '../../state/player-game-state.state';

import { HostViewComponent } from './host-view.component';

describe('HostViewComponent', () => {
  let component: HostViewComponent;
  let fixture: ComponentFixture<HostViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostViewComponent],
      imports: [NgxsModule.forRoot([PlayerGameState])],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
