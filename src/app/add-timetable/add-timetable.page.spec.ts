import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddTimetablePage } from './add-timetable.page';

describe('AddTimetablePage', () => {
  let component: AddTimetablePage;
  let fixture: ComponentFixture<AddTimetablePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddTimetablePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
