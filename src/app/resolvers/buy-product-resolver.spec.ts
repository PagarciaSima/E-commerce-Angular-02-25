import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { buyProductResolver } from './buy-product-resolver';
import { Product } from '../interfaces/product';

describe('buyProductResolverResolver', () => {
  const executeResolver: ResolveFn<Product[] | null>  = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => buyProductResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
