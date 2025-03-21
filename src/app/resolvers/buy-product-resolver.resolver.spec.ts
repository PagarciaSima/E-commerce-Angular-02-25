import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { buyProductResolver } from './buy-product-resolver';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/product';


describe('buyProductResolverResolver', () => {
  const executeResolver: ResolveFn<Product[] | Observable<Product[] | null> | Promise<Product[] | null> | null> = 
  (...resolverParameters) => TestBed.runInInjectionContext(() => buyProductResolver(...resolverParameters));


  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
function buyProductResolverResolver(arg0: RouterStateSnapshot | ActivatedRouteSnapshot): any {
  throw new Error('Function not implemented.');
}

