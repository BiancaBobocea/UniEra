import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GradesListPage } from './grades-list.page';

describe('GradesListPage', () => {
  let component: GradesListPage;
  let fixture: ComponentFixture<GradesListPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(GradesListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
