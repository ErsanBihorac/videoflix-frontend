import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferFooterComponent } from './offer-footer.component';

describe('OfferFooterComponent', () => {
  let component: OfferFooterComponent;
  let fixture: ComponentFixture<OfferFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferFooterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
