import { HttpEventType, HttpRequest } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { strict } from 'assert';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { first, last, map, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AddProductComponent } from '../add-product/add-product.component';
import { ConfirmationDialogService } from '../confirmation-dialog.service';
import { EditProductComponent } from '../edit-product/edit-product.component';
import { MessageService } from '../message.service';
import { Product } from '../models/models';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  productForm: FormGroup;
  hasError: boolean;
  isLoading$: Observable<boolean>;
  products$: Observable<Product[]>;
  public progress: number = 0;
  public fileName: string = '';
  public file: File;
  public products: Product[] = [];

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private productService: ProductsService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private messages: MessageService,
    private confirmationService: ConfirmationDialogService
  ) {
    this.isLoading$ = this.productService.isLoading$;
    this.products$ = this.productService.allProducts$;
  }

  ngOnInit(): void {
    console.log(this.products);
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.productForm.controls;
  }

  public addProduct() {
    let modalRef = this.modalService.open(AddProductComponent);
    modalRef.result.then((message: string) => {
      this.messages.showSuccess(message, 'Informacion');
      const sus = this.productService.getAllProducts().subscribe(success => {
        console.log(success);
      });
      this.unsubscribe.push(sus);
    }) .catch(() => this.messages.showInfo('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)','Advertencia'));
  }

  public editProduct(product: Product) {
    let modalRef = this.modalService.open(EditProductComponent);
    modalRef.componentInstance.product = product;
    modalRef.result.then((message: string) => {
      this.messages.showSuccess(message, 'Informacion');
      this.getAllProducts();
    }).catch(() => this.messages.showInfo('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)','Advertencia'));    
  }

  public confirmDeleteProduct(product: Product) {
    this.confirmationService.confirm('ADVERTENCIA', '¿Esta seguro que desea eliminar?')
      .then((confirmed) => {        
        if (confirmed) {
          this.deleteProduct(product);
        }
      })
      .catch(() => this.messages.showInfo('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)','Advertencia'));
  }

  public getAllProducts() {
    const sus = this.productService.getAllProducts().subscribe(products => {
      console.log("products");
      console.log(products);
      this.productService.allProductsSubject.next(products);
    });
    this.unsubscribe.push(sus);
  }
  public deleteProduct(product: Product) {
    const sus = this.productService.deleteProductById(product.id).subscribe(deletedProduct => {
      this.messages.showInfo('Producto ' + deletedProduct.id + ' eliminado con exito', 'Informacion');
      this.getAllProducts();
    });
    this.unsubscribe.push(sus);
  }
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
