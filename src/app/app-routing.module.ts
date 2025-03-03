import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AdminComponent } from './components/admin/admin.component';
import { UserComponent } from './components/user/user.component';
import { LoginComponent } from './components/login/login.component';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { authGuard } from './auth/auth.guard';
import { SaveProductComponent } from './components/save-product/save-product.component';
import { ShowProductDetailsComponent } from './components/show-product-details/show-product-details.component';
import { ProductViewDetailsComponent } from './components/product-view-details/product-view-details.component';
import { productResolver } from './resolvers/product.resolver';
import { BuyProductComponent } from './components/buy-product/buy-product.component';
import { buyProductResolver } from './resolvers/buy-product-resolver';
import { OrderConfirmationComponent } from './components/order-confirmation/order-confirmation.component';
import { RegisterComponent } from './components/register/register.component';
import { CartComponent } from './components/cart/cart.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [authGuard], data: {roles: ['AdminRole']} },
  { path: 'user', component: UserComponent, canActivate: [authGuard], data: {roles: ['UserRole']} },
  { path: 'login', component: LoginComponent },
  { path: 'forbidden', component: ForbiddenComponent },
  { path: 'addNewProduct', component: SaveProductComponent, canActivate: [authGuard], data: { roles: ['AdminRole'] } },
  { 
    path: 'editProduct/:productId', 
    component: SaveProductComponent, 
    canActivate: [authGuard], 
    data: { roles: ['AdminRole'] },
    resolve: { product: productResolver }  
  },

  { path: 'showProductDetails', component: ShowProductDetailsComponent },
  { path: 'productViewDetails/:productId', component: ProductViewDetailsComponent,  resolve: { product: productResolver } },
  {
    path: 'buyProduct',  
    component: BuyProductComponent,
    canActivate: [authGuard], 
    data: { roles: ['UserRole'] },
  },
  {
    path: 'cart',  
    component: CartComponent,
    canActivate: [authGuard], 
    data: { roles: ['UserRole'] },
    resolve: { productDetails: buyProductResolver }
  },
  { path: 'orderConfirm', component: OrderConfirmationComponent, canActivate: [authGuard], data: { roles: ['UserRole'] } },
  { path: 'register', component: RegisterComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
