import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Incomplete } from './incomplete';

describe('Incomplete', () => {
  let component: Incomplete;
  let fixture: ComponentFixture<Incomplete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Incomplete],
    }).compileComponents();

    fixture = TestBed.createComponent(Incomplete);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
