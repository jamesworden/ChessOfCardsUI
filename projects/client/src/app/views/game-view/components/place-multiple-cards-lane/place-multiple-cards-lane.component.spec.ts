import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceMultipleCardsLaneComponent } from './place-multiple-cards-lane.component';

describe('PlaceMultipleCardsLaneComponent', () => {
  let component: PlaceMultipleCardsLaneComponent;
  let fixture: ComponentFixture<PlaceMultipleCardsLaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaceMultipleCardsLaneComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaceMultipleCardsLaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
