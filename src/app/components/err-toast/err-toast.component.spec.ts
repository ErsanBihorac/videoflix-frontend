import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrToastComponent } from './err-toast.component';

describe('ErrToastComponent', () => {
  let component: ErrToastComponent;
  let fixture: ComponentFixture<ErrToastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrToastComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
