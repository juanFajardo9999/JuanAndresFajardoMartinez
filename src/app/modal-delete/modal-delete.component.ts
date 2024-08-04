import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-modal-delete',
  standalone: true,
  imports: [],
  templateUrl: './modal-delete.component.html',
  styleUrl: './modal-delete.component.scss'
})
export class ModalDeleteComponent implements OnInit {

  productName = ''
  productID = ''
  products$ = inject(ProductsService)
  @Output() cancel=new EventEmitter<boolean>()

  constructor(){

  }
  ngOnInit(): void {
  }
  
  closeModal(){
    this.cancel.emit(false)
  }

  deleteProduct(){
    this.products$.deleteProducts(this.productID).subscribe(r=>{

      this.cancel.emit(false)
    })

  }
}
