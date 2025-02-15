import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AdminComponent } from './components/admin/admin.component';
import { UserComponent } from './components/user/user.component';
import { LoginComponent } from './components/login/login.component';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { authGuard } from './auth/auth.guard';
import { AddNewProductComponent } from './components/add-new-product/add-new-product.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'admin', component: AdminComponent, canActivate: [authGuard], data: {roles: ['AdminRole']} },
  { path: 'user', component: UserComponent, canActivate: [authGuard], data: {roles: ['UserRole']} },
  { path: 'login', component: LoginComponent },
  { path: 'forbidden', component: ForbiddenComponent },
  { path: 'addNewProduct', component: AddNewProductComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
