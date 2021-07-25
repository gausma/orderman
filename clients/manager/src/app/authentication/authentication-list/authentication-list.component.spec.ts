import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AuthenticationListComponent } from "./authentication-list.component";

describe("AuthenticationListComponent", () => {
  let component: AuthenticationListComponent;
  let fixture: ComponentFixture<AuthenticationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthenticationListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
