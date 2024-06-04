import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WelcomeAdminPage } from './welcome-admin.page';

describe('WelcomeAdminPage', () => {
  let component: WelcomeAdminPage;
  let fixture: ComponentFixture<WelcomeAdminPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(WelcomeAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
