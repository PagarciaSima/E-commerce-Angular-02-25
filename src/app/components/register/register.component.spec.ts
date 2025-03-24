import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core'; // Importa TranslateModule
import { of, throwError } from 'rxjs';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from 'src/app/interfaces/user';
import { NgModule } from '@angular/core';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockTranslateService: jasmine.SpyObj<TranslateService>;

  const mockUser: User = {
    userName: 'testuser',
    userFirstName: 'Test',
    userLastName: 'User',
    userPassword: 'password',
  };

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', ['register']);
    mockToastrService = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockTranslateService = jasmine.createSpyObj('TranslateService', ['instant']);

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [TranslateModule.forRoot(), FormsModule], // Importa TranslateModule
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: ToastrService, useValue: mockToastrService },
        { provide: Router, useValue: mockRouter },
        { provide: TranslateService, useValue: mockTranslateService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;

    // Configura el valor de retorno para el servicio de traducción
    mockTranslateService.instant.and.returnValue('Translated message');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should register user and navigate to login on success', () => {
    const mockForm = { valid: true } as NgForm;
    mockUserService.register.and.returnValue(of(mockUser)); // Devuelve un Observable<User>

    component.register(mockForm);

    expect(mockUserService.register).toHaveBeenCalledWith(component.user);
    expect(mockToastrService.success).toHaveBeenCalledWith('Translated message', 'Success');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['login']);
  });

  it('should show error message when username already exists', () => {
    const mockForm = { valid: true } as NgForm;
    const errorResponse = { status: 400, error: 'Username already exists' };
    mockUserService.register.and.returnValue(throwError(errorResponse));

    component.register(mockForm);

    expect(mockUserService.register).toHaveBeenCalledWith(component.user);
    expect(mockToastrService.error).toHaveBeenCalledWith('Translated message', 'Error');
  });

  it('should show generic error message on unexpected error', () => {
    const mockForm = { valid: true } as NgForm;
    const errorResponse = { status: 500, error: 'Server Error' };
    mockUserService.register.and.returnValue(throwError(errorResponse));

    component.register(mockForm);

    expect(mockUserService.register).toHaveBeenCalledWith(component.user);
    expect(mockToastrService.error).toHaveBeenCalledWith('Translated message', 'Error');
  });

  it('should not call register if form is invalid', () => {
    const mockForm = { valid: false } as NgForm;

    component.register(mockForm);

    expect(mockUserService.register).not.toHaveBeenCalled();
  });
});