import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectGroupPage } from './select-group.page';

describe('SelectGroupPage', () => {
  let component: SelectGroupPage;
  let fixture: ComponentFixture<SelectGroupPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SelectGroupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
