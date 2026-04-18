import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { HomePage } from './home.page';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the today tab by default', () => {
    expect(component.activeTab).toBe('hoy');
    expect(component.currentSection.label).toBe('Hoy');
  });

  it('should update the active tab when requested', () => {
    component.onTabChange('categorias');

    expect(component.activeTab).toBe('categorias');
    expect(component.currentSection.greeting).toBe('Hola tab 3');
  });
});
