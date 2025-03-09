import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackwardIconComponent } from './backward-icon.component';

describe('BackwardIconComponent', () => {
  let component: BackwardIconComponent;
  let fixture: ComponentFixture<BackwardIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackwardIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackwardIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
