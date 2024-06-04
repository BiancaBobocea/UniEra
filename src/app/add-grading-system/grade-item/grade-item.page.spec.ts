import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GradeItemPage } from './grade-item.page';

describe('GradeItemPage', () => {
  let component: GradeItemPage;
  let fixture: ComponentFixture<GradeItemPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(GradeItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
