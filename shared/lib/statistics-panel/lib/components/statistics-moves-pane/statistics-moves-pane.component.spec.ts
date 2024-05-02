import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsMovesPaneComponent } from './statistics-moves-pane.component';

describe('StatisticsMovesPaneComponent', () => {
  let component: StatisticsMovesPaneComponent;
  let fixture: ComponentFixture<StatisticsMovesPaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticsMovesPaneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StatisticsMovesPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
