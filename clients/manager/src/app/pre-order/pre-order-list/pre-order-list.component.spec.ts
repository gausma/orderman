import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreOrderListComponent } from './pre-order-list.component';

describe('PreOrderListComponent', () => {
  let component: PreOrderListComponent;
  let fixture: ComponentFixture<PreOrderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreOrderListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
