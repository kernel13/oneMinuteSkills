import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { WelcomeComponent } from './welcome.component';

describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [WelcomeComponent, IonicModule.forRoot()],
      providers: [{ provide: Router, useValue: router }],
    }).compileComponents();

    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have navigateToTopics method', () => {
    expect(component.navigateToTopics).toBeDefined();
  });

  it('should navigate to topics on button click', () => {
    component.navigateToTopics();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/onboarding/topics']);
  });

  it('should render welcome title', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.welcome-title')).toBeTruthy();
  });

  it('should render feature items', () => {
    const compiled = fixture.nativeElement;
    const features = compiled.querySelectorAll('.feature-item');
    expect(features.length).toBe(4);
  });
});
