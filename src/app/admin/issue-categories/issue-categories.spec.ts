import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueCategories } from './issue-categories';

describe('IssueCategories', () => {
  let component: IssueCategories;
  let fixture: ComponentFixture<IssueCategories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssueCategories],
    }).compileComponents();

    fixture = TestBed.createComponent(IssueCategories);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
