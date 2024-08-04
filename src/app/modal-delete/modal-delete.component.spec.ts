import { TestBed } from '@angular/core/testing';
import { ModalDeleteComponent } from './modal-delete.component';
import { ProductsService } from '../services/products.service';
import { of } from 'rxjs';

describe('ModalDeleteComponent', () => {
  let component: ModalDeleteComponent;
  let fixture: any;
  let mockProductsService: any;

  beforeEach(async () => {
    mockProductsService = {
      deleteProducts: jest.fn().mockReturnValue(of({}))
    };

    await TestBed.configureTestingModule({
      imports: [],
      declarations: [],
      providers: [
        { provide: ProductsService, useValue: mockProductsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalDeleteComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit false when closeModal is called', () => {
    let spy = jest.spyOn(component.cancel, 'emit');
    component.closeModal();
    expect(spy).toHaveBeenCalledWith(false);
  });

  it('should call deleteProducts and emit false on successful delete', done => {
    component.productID = '123';
    let spy = jest.spyOn(component.cancel, 'emit');
    component.deleteProduct();
    
    setTimeout(() => {
      expect(mockProductsService.deleteProducts).toHaveBeenCalledWith('123');
      expect(spy).toHaveBeenCalledWith(false);
      done();
    }, 500);
  });
});
