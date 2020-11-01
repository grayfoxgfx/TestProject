import { HttpEventType, HttpRequest } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { strict } from 'assert';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { first, last, map, switchMap, tap } from 'rxjs/operators';
import { AddProductComponent } from '../add-product/add-product.component';
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
    private messages: MessageService
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
      this.productService.getAllProducts().subscribe(success => {
        console.log(success);
      });
    }, (dismiss) => {
      this.messages.showWarning(dismiss, 'Informacion');
    });
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
