import { Routes } from '@angular/router';
import { ProductsTableComponent } from './products-table/products-table.component';
import { AddProductComponent } from './add-product/add-product.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: 'home', 
        component: ProductsTableComponent,
    },
    {
        path: 'add-product',
        component: AddProductComponent
    },   
    {
        path: '**',
        redirectTo: '/home',
        pathMatch: 'prefix'
    }
];
