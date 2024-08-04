import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsTableComponent } from './products-table.component';
import { ProductsService } from '../services/products.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductInterface } from '../interfaces/product.interface';
import { Router } from '@angular/router';

describe('ProductsTableComponent', () => {
  let component: ProductsTableComponent;
  let fixture: ComponentFixture<ProductsTableComponent>;
  let mockProductsService: Partial<jest.Mocked<ProductsService>>;
  let mockRouter: Partial<jest.Mocked<Router>>;

  const mockProductList: ProductInterface[] = [
    { id: '1', name: 'Product 1', description: 'Description 1', logo: 'logo1.png', date_release: '2024-01-01', date_revision: '2025-01-01' },
    { id: '2', name: 'Product 2', description: 'Description 2', logo: 'logo2.png', date_release: '2024-02-01', date_revision: '2025-02-01' }
  ];

  beforeEach(async () => {
    mockProductsService = {
      getProducts: jest.fn().mockReturnValue(of({ data: mockProductList })),
      addProducts: jest.fn(),
      updateProducts: jest.fn(),
      getValidation: jest.fn(),
      deleteProducts: jest.fn()
    };

    mockRouter = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, ProductsTableComponent],
      providers: [
        { provide: ProductsService, useValue: mockProductsService },
        { provide: Router, useValue: mockRouter },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsTableComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize product list on component initialization', () => {
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.productsList.length).toBe(2);
    expect(component.originalList.length).toBe(2);
    expect(component.totalProducts).toBe(2);
    expect(component.productsList).toEqual(mockProductList);
  });

  it('should navigate to add-product page on addProduct', () => {
    component.addProduct();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/add-product']);
  });

  it('should filter products based on search text', () => {
    component.originalList = mockProductList;
    component.textSearch = 'Product 1';

    component.onSearch();
    fixture.detectChanges();

    expect(component.productsList.length).toBe(1);
    expect(component.productsList[0].name).toBe('Product 1');
  });

  it('should show all products if search text is empty', () => {
    component.originalList = mockProductList;
    component.textSearch = '';

    component.onSearch();
    fixture.detectChanges();

    expect(component.productsList.length).toBe(2);
  });
});
