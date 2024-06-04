import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CourseItemsPage } from './course-items.page';

describe('CourseItemsPage', () => {
  let component: CourseItemsPage;
  let fixture: ComponentFixture<CourseItemsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CourseItemsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
