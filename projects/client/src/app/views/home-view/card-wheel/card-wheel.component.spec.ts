import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardWheelComponent } from './card-wheel.component';

describe('CardWheelComponent', () => {
  let component: CardWheelComponent;
  let fixture: ComponentFixture<CardWheelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardWheelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardWheelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
