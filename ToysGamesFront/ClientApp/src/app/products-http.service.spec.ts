import { TestBed } from '@angular/core/testing';

import { ProductsHttpService } from './products-http.service';

describe('ProductsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductsHttpService = TestBed.get(ProductsHttpService);
    expect(service).toBeTruthy();
  });
});
