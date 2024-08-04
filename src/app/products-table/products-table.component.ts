import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { DatePipe } from '@angular/common';
import { ProductInterface } from '../interfaces/product.interface';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDeleteComponent } from "../modal-delete/modal-delete.component";

@Component({
  selector: 'app-products-table',
  standalone: true,
  imports: [DatePipe, FormsModule, ModalDeleteComponent],
  templateUrl: './products-table.component.html',
  styleUrl: './products-table.component.scss'
})
export class ProductsTableComponent implements OnInit {

  products$ = inject(ProductsService)
  productsList:ProductInterface[] = []
  originalList:ProductInterface[] = []
  textSearch = '';
  totalProducts = 0;
  showProducts = 5;
  modalSwitch = false
  @ViewChild(ModalDeleteComponent) modalDelete!: ModalDeleteComponent;
  productsData = this.products$.getProducts().subscribe(list=>{
    this.productsList = list.data
    this.originalList = list.data
    this.totalProducts = list.data.length
  })
 
  constructor(
    private router:Router
  ){
  
  }
  ngOnInit(): void {

  }

  onSearch(){
    const result = this.originalList.filter(item => {
      return Object.values(item).some(value => 
        typeof value === 'string' && value.toLowerCase().includes(this.textSearch.toLowerCase())
      );
    });
    if(!this.textSearch){
      this.productsList = this.originalList;
      this.totalProducts = this.originalList.length;
    }
    else
    if(result){
      this.productsList = result;
      this.totalProducts = result.length;
    }
  }
  
  addProduct(){
    this.router.navigate(['/add-product'])
  }

  updateData(item:ProductInterface){
    this.router.navigate(['/add-product'], { 
      queryParams: item 
    });
  }
  deleteData(item:ProductInterface){
    this.modalSwitch = true;
    setTimeout(() => {
      
      this.modalDelete.productName = item.name
      this.modalDelete.productID = item.id
    }, 200);
  }

  cancelModal(){

    this.modalSwitch = false;
    this.productsData = this.products$.getProducts().subscribe(list=>{
      this.productsList = list.data
      this.originalList = list.data
      this.totalProducts = list.data.length
    })
  }
}
