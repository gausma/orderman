import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PreOrderAddDialogComponent } from "./pre-order-add-dialog.component";

describe("PreOrderAddDialogComponent", () => {
  let component: PreOrderAddDialogComponent;
  let fixture: ComponentFixture<PreOrderAddDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreOrderAddDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreOrderAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
