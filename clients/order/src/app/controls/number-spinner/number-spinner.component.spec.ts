import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NumberSpinnerComponent } from './number-spinner.component';

describe('NgxNumberSpinnerComponent', () => {
  let component: NumberSpinnerComponent;
  let fixture: ComponentFixture<NumberSpinnerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NumberSpinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
