import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpponentHandComponent } from './opponent-hand.component';

describe('OpponentHandComponent', () => {
  let component: OpponentHandComponent;
  let fixture: ComponentFixture<OpponentHandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpponentHandComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpponentHandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
