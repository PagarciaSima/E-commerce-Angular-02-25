import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UserAuthService } from 'src/app/services/user-auth.service';
import { UserService } from 'src/app/services/user.service';
import { of, throwError } from 'rxjs';
import { FormsModule, NgForm } from '@angular/forms';
import { LoginResponse } from 'src/app/interfaces/login-response';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockTranslateService: jasmine.SpyObj<TranslateService>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockUserAuthService: jasmine.SpyObj<UserAuthService>;
  let mockUserService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    mockTranslateService = jasmine.createSpyObj('TranslateService', ['instant']);
    mockToastrService = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockUserAuthService = jasmine.createSpyObj('UserAuthService', ['setRoles', 'setToken']);
    mockUserService = jasmine.createSpyObj('UserService', ['login']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [TranslateModule.forRoot(), FormsModule],
      providers: [
        { provide: TranslateService, useValue: mockTranslateService },
        { provide: ToastrService, useValue: mockToastrService },
        { provide: Router, useValue: mockRouter },
        { provide: UserAuthService, useValue: mockUserAuthService },
        { provide: UserService, useValue: mockUserService }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    // Configura el valor de retorno para el servicio de traducción
    mockTranslateService.instant.and.returnValue('Translated message');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call login and handle success for AdminRole', () => {
    const responseMock: LoginResponse = { 
      user: { 
        userName: 'adminUser',
        userFirstName: 'Admin',
        userLastName: 'User',
        userPassword: 'hashed-password',
        role: [{
          roleName: 'AdminRole',
          roleDescription: 'Admin role description'
        }]
      }, 
      jwtToken: 'fake-token' 
    };
    
    mockUserService.login.and.returnValue(of(responseMock));

    const mockForm = { value: { userName: 'admin', userPassword: '1234' } } as NgForm;
    component.login(mockForm);

    expect(mockUserAuthService.setRoles).toHaveBeenCalledWith(responseMock.user.role!);
    expect(mockUserAuthService.setToken).toHaveBeenCalledWith(responseMock.jwtToken);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin']);
    expect(mockToastrService.success).toHaveBeenCalledWith('Translated message', 'Success');
  });

  it('should call login and handle success for UserRole', () => {
    const responseMock: LoginResponse = { 
      user: { 
        userName: 'user',
        userFirstName: 'User',
        userLastName: 'User',
        userPassword: 'hashed-password',
        role: [{
          roleName: 'UserRole',
          roleDescription: 'User role description'
        }]
      }, 
      jwtToken: 'fake-token' 
    };
    
    mockUserService.login.and.returnValue(of(responseMock));

    const mockForm = { value: { userName: 'user', userPassword: '1234' } } as NgForm;
    component.login(mockForm);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/user']);
  });

  it('should handle login error 401', () => {
    mockUserService.login.and.returnValue(throwError({ status: 401 }));

    const mockForm = { value: { userName: 'wrong', userPassword: 'wrong' } } as NgForm;
    component.login(mockForm);

    expect(mockToastrService.error).toHaveBeenCalledWith('Translated message', 'Error');
  });

  it('should handle login error 500', () => {
    mockUserService.login.and.returnValue(throwError({ status: 500 }));

    const mockForm = { value: { userName: 'error', userPassword: 'error' } } as NgForm;
    component.login(mockForm);

    expect(mockToastrService.error).toHaveBeenCalledWith('Translated message', 'Error');
  });

  it('should handle unexpected login error', () => {
    mockUserService.login.and.returnValue(throwError({ status: 400 }));

    const mockForm = { value: { userName: 'random', userPassword: 'random' } } as NgForm;
    component.login(mockForm);

    expect(mockToastrService.error).toHaveBeenCalledWith('Translated message', 'Error');
  });
});