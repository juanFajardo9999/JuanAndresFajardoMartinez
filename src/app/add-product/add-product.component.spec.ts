import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddProductComponent } from './add-product.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterState, Event, NavigationEnd } from '@angular/router';
import { Observable, of } from 'rxjs';
import { CustomValidatorsService } from '../services/custom-validators.service';
import { HttpClient } from '@angular/common/http';
import { ProductsService } from '../services/products.service';

describe('AddProductComponent', () => {
  let component: AddProductComponent;
  let fixture: ComponentFixture<AddProductComponent>;
  let mockProductsService: jest.Mocked<ProductsService>;
  let mockRouter: jest.Mocked<Router>;
  let mockActivatedRoute: any;
  let mockHttpClient: jest.Mocked<HttpClient>;

  beforeEach(async () => {
    mockRouter = {
      navigate: jest.fn(),
      events: new Observable<Event>((observer) => {
        observer.next(new NavigationEnd(0, '/', '/'));
      }),
      routerState: {} as RouterState,
      errorHandler: jest.fn(),
      navigated: false,
      isActive: jest.fn().mockReturnValue(true),
      serializeUrl: jest.fn().mockReturnValue(''),
      createUrlTree: jest.fn().mockReturnValue({}),
      getCurrentNavigation: jest.fn().mockReturnValue(null)
    } as unknown as jest.Mocked<Router>;

    mockHttpClient = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn()
    } as unknown as jest.Mocked<HttpClient>;

    mockProductsService = {
      _http: mockHttpClient,
      getProducts: jest.fn(),
      addProducts: jest.fn().mockReturnValue(of({})), // Ensure this returns an Observable
      updateProducts: jest.fn().mockReturnValue(of({})), // Ensure this returns an Observable
      getValidation: jest.fn(),
      deleteProducts: jest.fn()
    };

    mockActivatedRoute = {
      queryParams: of({})
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, AddProductComponent],
      providers: [
        { provide: ProductsService, useValue: mockProductsService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: HttpClient, useValue: mockHttpClient },
        { provide: CustomValidatorsService, useFactory: () => ({
            checkIdNotTaken: () => () => of(null)
          })
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component and initialize the form', () => {
    expect(component).toBeTruthy();
    expect(component.productForm).toBeDefined();
    expect(component.productForm.get('id')).toBeDefined();
  });

  it('should populate the form if update params are provided', () => {
    // Simulate query params for update
    mockActivatedRoute.queryParams = of({
      id: '1', name: 'Product 1', description: 'Desc 1', logo: 'logo1.png', date_release: '2024-01-01', date_revision: '2025-01-01'
    });
    fixture = TestBed.createComponent(AddProductComponent);  // Recreate the component to pick up new queryParams
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.productForm.get('id')?.value).toEqual('1');
    expect(component.productForm.get('name')?.value).toEqual('Product 1');
  });

  it('should add one year to date_release and update date_revision', () => {
    const inputDate = '2023-01-01';
    const expectedDate = '2024-01-01';
    const result = component.addOneYear(inputDate);
    expect(result).toEqual(expectedDate);
  });

  it('should send updated product data and navigate to home', () => {
    component.update = '1';
    component.productForm.setValue({
      id: '1',
      name: 'Updated Product',
      description: 'Updated Description',
      logo: 'updated_logo.png',
      date_release: '2024-01-01',
      date_revision: '2025-01-01'
    });

    component.sendData();

    expect(mockProductsService.updateProducts).toHaveBeenCalledWith('1', component.productForm.value);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should add new product and navigate to home when there is no update id', () => {
    component.productForm.setValue({
      id: '2',
      name: 'New Product',
      description: 'New Description',
      logo: 'new_logo.png',
      date_release: '2024-01-01',
      date_revision: '2025-01-01'
    });

    component.sendData();

    expect(mockProductsService.addProducts).toHaveBeenCalledWith(component.productForm.value);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
  });
});
