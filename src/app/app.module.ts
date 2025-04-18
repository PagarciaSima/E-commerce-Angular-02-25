import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { AdminComponent } from './components/admin/admin.component';
import { UserComponent } from './components/user/user.component';
import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { FormsModule } from '@angular/forms';
import { RegisterComponent } from './components/register/register.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { RouterModule } from '@angular/router';
import { AuthInterceptor } from './auth/auth.interceptor';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { SaveProductComponent } from './components/save-product/save-product.component';
import { ShowProductDetailsComponent } from './components/show-product-details/show-product-details.component';
import { ProductViewDetailsComponent } from './components/product-view-details/product-view-details.component';
import { BuyProductComponent } from './components/buy-product/buy-product.component';
import { OrderConfirmationComponent } from './components/order-confirmation/order-confirmation.component';
import { CartComponent } from './components/cart/cart.component';
import { SearchBarComponent } from './components/shared/search-bar/search-bar.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { MyOrdersComponent } from './components/my-orders/my-orders.component';
import { OrdersComponent } from './components/orders/orders.component';
import { SpinnerComponent } from './components/shared/spinner/spinner.component';
import { OrderErrorComponent } from './components/order-error/order-error.component';
import { NgChartsModule } from 'ng2-charts';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AdminComponent,
    UserComponent,
    LoginComponent,
    HeaderComponent,
    ForbiddenComponent,
    RegisterComponent,
    FooterComponent,
    SaveProductComponent,
    ShowProductDetailsComponent,
    ProductViewDetailsComponent,
    BuyProductComponent,
    OrderConfirmationComponent,
    CartComponent,
    SearchBarComponent,
    MyOrdersComponent,
    OrdersComponent,
    SpinnerComponent,
    OrderErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot(), 
    BrowserAnimationsModule,
    RouterModule,
    NgChartsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
    
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },


  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
