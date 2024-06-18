import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeUserDataPage } from './change-user-data.page';

describe('ChangeUserDataPage', () => {
  let component: ChangeUserDataPage;
  let fixture: ComponentFixture<ChangeUserDataPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ChangeUserDataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
