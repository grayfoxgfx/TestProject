import { Component, OnInit } from '@angular/core';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Product } from '../models/models';
import { ProductsService } from '../services/products.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
  imports: [FormsModule, NgbModule, CommonModule, ReactiveFormsModule],
})
export class AddProductComponent implements OnInit {
  // convenience getter for easy access to form fields
  get f() {
    return this.productForm?.controls;
  }

  productForm: FormGroup;
  hasError?: boolean;
  isLoading$: Observable<boolean>;
  products$: Observable<Product[]>;

  // Public fields for file and progress
  public progress: number = 0;
  public fileName: string = '';
  public file: File | null = null;
  public imagePreviewUrl: string | undefined; // For image preview

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private productService: ProductsService
  ) {
    this.productForm = <FormGroup>{};
    this.isLoading$ = this.productService.isLoading$;
    this.products$ = this.productService.allProducts$;
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.productForm = this.fb.group({
      name: [
        '',
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      description: ['', Validators.compose([Validators.maxLength(100)])],
      ageRestriction: [
        0,
        Validators.compose([Validators.min(0), Validators.max(100)]),
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
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      image: ['', Validators.compose([Validators.required])],
    });
  }

  public selectFile(event: Event) {
    let files: FileList | null = (<HTMLInputElement>event.target).files;

    if (files && files.length > 0 && files.item(0) != null) {
      this.file = files.item(0);
      if (this.file) this.previewImage(this.file);
      console.log(this.file);
    }
  }

  private previewImage(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreviewUrl = e.target.result; // Set the preview URL
    };
    reader.readAsDataURL(file); // Read the selected file
  }

  public postFile(file: File) {
    this.progress = 0;
    const postImageSubscr = this.productService
      .uploadProductImage(file)
      .subscribe({
        next: (event: HttpEvent<Product>) => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            this.progress = Math.round(
              (100 * event.loaded) / (event.total || 1)
            );
          } else if (event.type === HttpEventType.Response) {
            let img: Product | null = event.body;
            let productModel = new Product();
            productModel.name = this.f?.['name'].value;
            productModel.company = this.f?.['company'].value;
            productModel.description = this.f?.['description'].value;
            productModel.ageRestriction = +this.f?.['ageRestriction'].value;
            productModel.price = +this.f?.['price'].value;

            productModel.imageUrl = img?.imageUrl || '';

            this.productService.createProduct(productModel).subscribe({
              next: (createdProduct) => {
                console.log(createdProduct);
                this.activeModal.close('Product created! ' + createdProduct.id);
              },
              error: (error) => {
                console.log(error);
              },
            });
          }
        },
        error: (error) => {
          console.log(error);
        },
      });

    this.unsubscribe.push(postImageSubscr);
  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.log(this.productForm?.errors);
    console.warn(this.productForm?.value);

    if (this.file != null) this.postFile(this.file);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
