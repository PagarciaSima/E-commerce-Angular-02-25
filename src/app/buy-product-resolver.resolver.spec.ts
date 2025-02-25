import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { buyProductResolverResolver } from './buy-product-resolver.resolver';

describe('buyProductResolverResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => buyProductResolverResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
