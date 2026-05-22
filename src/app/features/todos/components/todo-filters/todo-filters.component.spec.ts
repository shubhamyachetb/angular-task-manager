import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoFiltersComponent } from './todo-filters.component';

describe('TodoFiltersComponent', () => {
  let component: TodoFiltersComponent;
  let fixture: ComponentFixture<TodoFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoFiltersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoFiltersComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
