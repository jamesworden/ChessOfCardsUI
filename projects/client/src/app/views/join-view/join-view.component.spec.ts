import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxsModule } from '@ngxs/store';
import { GameState } from '../../state/game.state';

import { JoinViewComponent } from './join-view.component';

describe('JoinViewComponent', () => {
  let component: JoinViewComponent;
  let fixture: ComponentFixture<JoinViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JoinViewComponent],
      imports: [NgxsModule.forRoot([GameState])],
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
