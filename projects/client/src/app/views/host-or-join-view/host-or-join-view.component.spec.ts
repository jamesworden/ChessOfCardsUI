import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostOrJoinViewComponent } from './host-or-join-view.component';

describe('HostOrJoinViewComponent', () => {
  let component: HostOrJoinViewComponent;
  let fixture: ComponentFixture<HostOrJoinViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostOrJoinViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostOrJoinViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
