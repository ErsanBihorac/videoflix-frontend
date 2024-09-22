import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferInfoPreviewComponent } from './offer-info-preview.component';

describe('OfferInfoPreviewComponent', () => {
  let component: OfferInfoPreviewComponent;
  let fixture: ComponentFixture<OfferInfoPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferInfoPreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferInfoPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
