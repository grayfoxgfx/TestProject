import { HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { Product } from '../models/models';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {

  @Input() product: Product;
  // convenience getter for easy access to form fields
  get f() {
    return this.editProductForm.controls;
  }

  editProductForm: FormGroup;
  hasError: boolean;
  isLoading$: Observable<boolean>;
  products$: Observable<Product[]>;
  public progress: number = 0;
  public fileName: string = '';
  public file: File;
  public products: Product[] = [];
  private img: Product;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private productService: ProductsService  ) {
    this.isLoading$ = this.productService.isLoading$;
  }

  ngOnInit(): void {
    console.log(this.product);
    this.initForm();
  }

  initForm() {
    this.editProductForm = this.fb.group({
      id: [
        { value: this.product.id, disabled: true }
        ,
        Validators.compose([
          Validators.required,
        ]),
      ],
      name: [
        this.product.name,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ]),
      ],
      description: [
        this.product.description,
        Validators.compose([
          Validators.maxLength(100),
        ]),
      ],
      ageRestriction: [
        this.product.ageRestriction,
        Validators.compose([
          Validators.min(0),
          Validators.max(100),
        ]),
      ],
      price: [
        this.product.price,
        Validators.compose([
          Validators.required,
          Validators.min(1),
          Validators.max(1000),
        ]),
      ],
      company: [
        this.product.company,
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
        ]),
      ], image: [
        '',
        Validators.compose([
        ]),
      ],
    });
  }

  public selectFile(files: FileList) {
    this.file = files.item(0);
    console.log(this.file);
  }
  public postFile(file: File) {
    this.progress = 0;

    if (file) {
      this.UpdateImage(file);
    }
    else {
      this.editProduct();
    }
  }

  private UpdateImage(file: File) {
    const sus = this.productService
      .uploadProductImage(file)
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress)
          this.progress = Math.round(100 * event.loaded / event.total);
        else if (event.type === HttpEventType.Response) {
          this.img = event.body;
          this.editProduct();
        }
      }, error => {
        console.log(error);
      });
    this.unsubscribe.push(sus);
  }

  private editProduct() {
    let productModel = this.mapProductModel();
    const sus = this.productService
      .updateProduct(productModel.id, productModel).subscribe(editedProduct => {
        console.log(editedProduct);
        this.activeModal.close("Product edited! " + productModel.id);
      }, error => {
        console.log(error);
      });
    this.unsubscribe.push(sus);
  }

  private mapProductModel() {
    let productModel = new Product();
    productModel.id = +this.f.id.value;
    productModel.name = this.f.name.value;
    productModel.company = this.f.company.value;
    productModel.description = this.f.description.value;
    productModel.ageRestriction = +this.f.ageRestriction.value;
    productModel.price = +this.f.price.value;    
    productModel.imageUrl = (this.img && this.img.imageUrl.trim().length> 0) ? this.img.imageUrl : this.product.imageUrl;
    return productModel;
  }

  onSubmit() {
    // TODO: Use EventEmitter with form value    
    this.postFile(this.file);

  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
