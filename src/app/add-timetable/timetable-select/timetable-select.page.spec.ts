import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimetableSelectPage } from './timetable-select.page';

describe('TimetableSelectPage', () => {
  let component: TimetableSelectPage;
  let fixture: ComponentFixture<TimetableSelectPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TimetableSelectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
