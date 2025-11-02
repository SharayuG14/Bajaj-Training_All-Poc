import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterCategory } from './register-category';

describe('RegisterCategory', () => {
  let component: RegisterCategory;
  let fixture: ComponentFixture<RegisterCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterCategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
