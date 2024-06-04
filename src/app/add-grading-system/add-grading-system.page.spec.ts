import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddGradingSystemPage } from './add-grading-system.page';

describe('AddGradingSystemPage', () => {
  let component: AddGradingSystemPage;
  let fixture: ComponentFixture<AddGradingSystemPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddGradingSystemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
