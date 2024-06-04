import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WelcomeStudentPage } from './welcome-student.page';

describe('WelcomeStudentPage', () => {
  let component: WelcomeStudentPage;
  let fixture: ComponentFixture<WelcomeStudentPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(WelcomeStudentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
