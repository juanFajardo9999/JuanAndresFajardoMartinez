import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductsService } from './products.service';
import { environment } from '../../environments/environment';
import { ProductInterface } from '../interfaces/product.interface';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductsService]
    });
    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch products', () => {
    const mockProducts: ProductInterface[] = [{
      id: '1',
      name: 'Test Product',
      description: 'This is a test product description.',
      logo: 'test-logo.png',
      date_release: new Date().toISOString().split('T')[0], 
      date_revision: new Date().toISOString().split('T')[0] 
    }];

    service.getProducts().subscribe(products => {
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne(`${environment.apiEndpoint}bp/products`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should add a product', () => {
    const mockProduct: ProductInterface = {
      id: '1',
      name: 'Test Product',
      description: 'This is a test product description.',
      logo: 'test-logo.png',
      date_release: new Date().toISOString().split('T')[0], 
      date_revision: new Date().toISOString().split('T')[0]
    };
    service.addProducts(mockProduct).subscribe(response => {
      expect(response).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${environment.apiEndpoint}bp/products`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockProduct);
    req.flush(mockProduct);
  });

  it('should update a product', () => {
    const mockProduct: ProductInterface = {
      id: '1',
      name: 'Test Product',
      description: 'This is a test product description.',
      logo: 'test-logo.png',
      date_release: new Date().toISOString().split('T')[0], 
      date_revision: new Date().toISOString().split('T')[0]
    };
    service.updateProducts(mockProduct.id, mockProduct).subscribe(response => {
      expect(response).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${environment.apiEndpoint}bp/products/${mockProduct.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockProduct);
    req.flush(mockProduct);
  });

  it('should validate product ID', () => {
    const mockValidation = true;
    const id = '123';

    service.getValidation(id).subscribe(response => {
      expect(response).toBe(mockValidation);
    });

    const req = httpMock.expectOne(`${environment.apiEndpoint}bp/products/verification/${id}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockValidation);
  });

  it('should delete a product', () => {
    const id = '123';
    const mockResponse = true;

    service.deleteProducts(id).subscribe(response => {
      expect(response).toBe(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiEndpoint}bp/products/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });
});
