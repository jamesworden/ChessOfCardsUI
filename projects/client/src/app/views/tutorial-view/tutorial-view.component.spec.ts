import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialViewComponent } from './tutorial-view.component';

describe('TutorialViewComponent', () => {
  let component: TutorialViewComponent;
  let fixture: ComponentFixture<TutorialViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TutorialViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorialViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
