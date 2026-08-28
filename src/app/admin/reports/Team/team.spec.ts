import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamReportsComponent } from './team';

describe('Team', () => {
  let component: TeamReportsComponent;
  let fixture: ComponentFixture<TeamReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamReportsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TeamReportsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
