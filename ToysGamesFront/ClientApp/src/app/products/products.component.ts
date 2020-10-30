import { HttpEventType, HttpRequest } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { strict } from 'assert';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { first, last, map, switchMap, tap } from 'rxjs/operators';
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
  public progress: number = 0;
  public fileName: string = '';
  public file: File;

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
        '',
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
      image: [
        '',
        Validators.compose([
          Validators.required,
        ]),
      ],
    });
  }

  public selectFile(files: FileList) {
    this.file = files.item(0);
    console.log(this.file);
  }
  public postFile(file: File) {
    const postImageSubscr = this.productService
      .uploadProductImage(file)
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress)
          this.progress = Math.round(100 * event.loaded / event.total);
        else if (event.type === HttpEventType.Response) {
          let img :Product = event.body;
          debugger;
          let productModel = new Product();
          productModel.id = +this.f.id.value;
          productModel.name = this.f.name.value;
          productModel.company = this.f.company.value;
          productModel.description = this.f.description.value;
          productModel.ageRestriction = +this.f.ageRestriction.value;
          productModel.price = +this.f.price.value;

          productModel.imageUrl = img.imageUrl;

          this.productService
            .createProduct(productModel).subscribe(createdProduct => {
              console.log(createdProduct);             
            }, error => {
              console.log(error);
            });
        }
      }, error => {
        console.log(error);
      });
  }

  onSubmit() {
    debugger;
    // TODO: Use EventEmitter with form value
    console.log(this.productForm.errors);
    console.warn(this.productForm.value);
    //this.submit();
    this.postFile(this.file);
    const getAll = this.productService.getAllProducts().subscribe();
    this.unsubscribe.push(getAll);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
