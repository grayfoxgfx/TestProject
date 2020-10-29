import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';
import { Product } from '../models/models';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  productForm: FormGroup;
  hasError: boolean;
  isLoading$: Observable<boolean>;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private productService: ProductsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.isLoading$ = this.productService.isLoading$;
  }

  ngOnInit(): void {
    this.initForm();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.productForm.controls;
  }

  initForm() {
    this.productForm = this.fb.group({
      id: [
        0,
        Validators.compose([
          Validators.required,
        ]),
      ],
      name: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ]),
      ],
      description: [
        '',
        Validators.compose([
          Validators.maxLength(100),
        ]),
      ],
      ageRestriction: [
        0,
        Validators.compose([
          Validators.min(0),
          Validators.max(100),
        ]),
      ],
      price: [
        0,
        Validators.compose([
          Validators.required,
          Validators.min(1),
          Validators.max(1000),
        ]),
      ],
      company: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ]),
      ],
      imageUrl: [
        '',
        Validators.compose([
          Validators.required,
        ]),
      ],
    });
  }

  submit() {
    this.hasError = false;
    let productModel = new Product();
    productModel.id = this.f.id.value;
    productModel.name = this.f.name.value;
    productModel.company = this.f.company.value;
    productModel.description = this.f.description.value;
    productModel.ageRestriction = this.f.ageRestriction.value;
    productModel.price = this.f.price.value;
    productModel.imageUrl = this.f.imageUrl.value;

    const createSubscr = this.productService
      .createProduct(productModel)
      .pipe(
        first(),
        map((user: Product) => {
          if (user) {
            //this.router.navigate([this.returnUrl]);
          } else {
            //this.hasError = true;
          }
        }),
        switchMap(() => {
          return this.productService.getAllProducts();
        }),
      ).subscribe();
    this.unsubscribe.push(createSubscr);
  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.productForm.value);
    const getAll = this.productService.getAllProducts().subscribe();
    this.unsubscribe.push(getAll);
    this.submit();
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
