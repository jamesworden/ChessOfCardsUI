import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaceDownCardComponent } from './face-down-card.component';

describe('FaceDownCardComponent', () => {
  let component: FaceDownCardComponent;
  let fixture: ComponentFixture<FaceDownCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaceDownCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FaceDownCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
