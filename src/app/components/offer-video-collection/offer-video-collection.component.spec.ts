import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferVideoCollectionComponent } from './offer-video-collection.component';

describe('OfferVideoCollectionComponent', () => {
  let component: OfferVideoCollectionComponent;
  let fixture: ComponentFixture<OfferVideoCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferVideoCollectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferVideoCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
