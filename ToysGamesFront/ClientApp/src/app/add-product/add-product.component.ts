import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders } from '@angular/common/http';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from '../message.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../models/models';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.sass']
})
export class AddProductComponent implements OnInit {    
  private modalRef: NgbModalRef;    
  // convenience getter for easy access to form fields
  get f() {
    return this.productForm.controls;
  }  

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
    private _http: HttpClient, 
    public activeModal: NgbActiveModal,    
    private modalService: NgbModal,
    private fb: FormBuilder,
    private productService: ProductsService,
    private route: ActivatedRoute,
    private router: Router,
    private messages:MessageService 
) { 
      this.isLoading$ = this.productService.isLoading$;
      this.products$ = this.productService.allProducts$;
  }

  ngOnInit(): void {
    this.initForm();
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
    this.progress = 0;
    const postImageSubscr = this.productService
      .uploadProductImage(file)
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress)
          this.progress = Math.round(100 * event.loaded / event.total);
        else if (event.type === HttpEventType.Response) {
          let img: Product = event.body;
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
              this.activeModal.close("Egresado Agregado Correctamente " + createdProduct.id);                            
            }, error => {
              console.log(error);
            });
        }
      }, error => {
        console.log(error);
      });
  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.log(this.productForm.errors);
    console.warn(this.productForm.value);
    
    this.postFile(this.file);    
   
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
