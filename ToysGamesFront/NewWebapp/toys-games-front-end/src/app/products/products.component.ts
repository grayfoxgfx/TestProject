import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { AddProductComponent } from '../add-product/add-product.component';
import { ConfirmationDialogService } from '../services/confirmation-dialog.service';
import { EditProductComponent } from '../edit-product/edit-product.component';
import { MessageService } from '../services/message.service';
import { Product } from '../models/models';
import { ProductsService } from '../services/products.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  imports: [
      FormsModule,
      NgbModule,
      CommonModule,
      ReactiveFormsModule,
    ],
})
export class ProductsComponent implements OnInit {
  productForm?: FormGroup;
  hasError?: boolean;
  isLoading$: Observable<boolean>;
  products$: Observable<Product[]>;
  public progress: number = 0;
  public fileName: string = '';
  public file?: File;
  public products: Product[] = [];

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private productService: ProductsService,
    private modalService: NgbModal,
    private messages: MessageService,
    private confirmationService: ConfirmationDialogService
  ) {
    this.isLoading$ = this.productService.isLoading$;
    this.products$ = this.productService.allProducts$;
  }

  ngOnInit(): void {
    this.getAllProducts();
    console.log(this.products);
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.productForm?.controls;
  }

  public addProduct() {
    let modalRef = this.modalService.open(AddProductComponent);
    modalRef.result.then((message: string) => {
      this.messages.showSuccess(message, 'Information');
      const sus = this.productService.getAllProducts().subscribe(success => {
        console.log(success);
      });
      this.unsubscribe.push(sus);
    }) .catch(() => this.messages.showInfo('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)','Warning'));
  }

  public editProduct(product: Product) {
    let modalRef = this.modalService.open(EditProductComponent);
    modalRef.componentInstance.product = product;
    modalRef.result.then((message: string) => {
      this.messages.showSuccess(message, 'Information');
      this.getAllProducts();
    }).catch(() => this.messages.showInfo('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)','Warning'));
  }

  public confirmDeleteProduct(product: Product) {
    this.confirmationService.confirm('Warning', '¿Are you sure to delete this item?')
      .then((confirmed) => {
        if (confirmed) {
          this.deleteProduct(product);
        }
      })
      .catch(() => this.messages.showInfo('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)','Warning'));
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
      this.messages.showInfo('Product ' + product.id + ' deleted successfully', 'Information');
      this.getAllProducts();
    });
    this.unsubscribe.push(sus);
  }
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
