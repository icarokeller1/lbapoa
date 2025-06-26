import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LigasDetailComponent } from './ligas-detail.component';

describe('LigasDetailComponent', () => {
  let component: LigasDetailComponent;
  let fixture: ComponentFixture<LigasDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LigasDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LigasDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
