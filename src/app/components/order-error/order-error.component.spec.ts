import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderErrorComponent } from './order-error.component';

describe('OrderErrorComponent', () => {
  let component: OrderErrorComponent;
  let fixture: ComponentFixture<OrderErrorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderErrorComponent]
    });
    fixture = TestBed.createComponent(OrderErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
