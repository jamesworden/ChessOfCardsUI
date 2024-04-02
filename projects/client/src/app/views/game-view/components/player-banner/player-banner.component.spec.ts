import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerBannerComponent } from './player-banner.component';

describe('PlayerBannerComponent', () => {
  let component: PlayerBannerComponent;
  let fixture: ComponentFixture<PlayerBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerBannerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlayerBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
