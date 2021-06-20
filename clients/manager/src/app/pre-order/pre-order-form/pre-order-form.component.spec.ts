import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PreOrderFormComponent } from "./pre-order-form.component";

describe("PreOrderFormComponent", () => {
  let component: PreOrderFormComponent;
  let fixture: ComponentFixture<PreOrderFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreOrderFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreOrderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
