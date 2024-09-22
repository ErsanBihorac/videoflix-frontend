import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferHeaderComponent } from './offer-header.component';

describe('OfferHeaderComponent', () => {
  let component: OfferHeaderComponent;
  let fixture: ComponentFixture<OfferHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
