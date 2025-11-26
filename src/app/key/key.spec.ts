import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Key } from './key';

describe('Key', () => {
  let component: Key;
  let fixture: ComponentFixture<Key>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Key]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Key);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
