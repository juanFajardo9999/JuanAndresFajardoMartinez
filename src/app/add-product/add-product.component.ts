import { DatePipe, JsonPipe, NgClass, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomValidatorsService } from '../services/custom-validators.service';
import { ProductsService } from '../services/products.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe, NgIf, NgClass, DatePipe],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
})
export class AddProductComponent implements OnInit{
  productForm!: FormGroup;
  atualDate:Date = new Date();
  update:string = '';
  cancelButtonDisabled = false;

  constructor(
    private formBuilder: FormBuilder,
    private productService:ProductsService,
    private router:Router,
    private route: ActivatedRoute,
    private customValidators: CustomValidatorsService
  ) {}

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({ 
      id: ['',[Validators.required,Validators.minLength(3),Validators.maxLength(10)], 
      [this.customValidators.checkIdNotTaken()]
    ], 
      name: ['',[Validators.required,Validators.minLength(5),Validators.maxLength(100)]],
      description: ['',[Validators.required,Validators.minLength(10),Validators.maxLength(200)]],
      logo: ['',[Validators.required]],
      date_release: ['',[Validators.required]],
      date_revision: ['',[Validators.required]]
    });
    this.productForm.get('date_revision')?.disable();

    this.route.queryParams.subscribe(params => {
      if(params['id']){
        this.cancelButtonDisabled = true;
        this.update = params['id'];
        this.productForm.get('id')?.disable();
        this.productForm.setValue({
          id: params['id'],
          name: params['name'],
          description: params['description'],
          logo: params['logo'],
          date_release: params['date_release'],
          date_revision: params['date_revision']
        })
      } 

    });
  }
  addOneYear(date: string): string {
    if(!date)
      return this.atualDate.toISOString().split('T')[0];
    const newDate = new Date(date);
    newDate.setFullYear(newDate.getFullYear() + 1);
    this.productForm.get('date_revision')?.enable();

    return newDate.toISOString().split('T')[0];
  }

  sendData(){
    if(this.update)
      this.productService.updateProducts(this.update,this.productForm.value).subscribe();
    else
      this.productService.addProducts(this.productForm.value).subscribe();
    this.router.navigate(['/home'])
  }
}
