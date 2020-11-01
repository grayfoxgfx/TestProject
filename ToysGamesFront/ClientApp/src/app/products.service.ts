import { HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subscription, of, EMPTY } from 'rxjs';
import { map, catchError, switchMap, finalize, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Product } from './models/models';
import { ProductsHttpService } from './products-http.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  isLoading$: Observable<boolean>;
  private isLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  // public fields
  allProducts$: Observable<Product[]>;
  allProductsSubject: BehaviorSubject<Product[]>;
  get currentProductList(): Product[] {
    return this.allProductsSubject.value;
  }
  products: Product[] = [];

  constructor(private productsHttpService: ProductsHttpService) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
    this.allProductsSubject = new BehaviorSubject<Product[]>([]);
    this.allProducts$ = this.allProductsSubject.asObservable();
    const subscr = this.getAllProducts().subscribe(products => {
      this.allProductsSubject.next(products);
    });
    this.unsubscribe.push(subscr);
  }

  getAllProducts(): Observable<Product[]> {
    this.isLoadingSubject.next(true);    
    return this.productsHttpService.getAllProducts().pipe(
      tap(products => {        
        this.allProductsSubject.next(products);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
  updateProduct(id: number, editedProduct: Product): Observable<Product[]> {
    this.isLoadingSubject.next(true);
    return this.productsHttpService.updateProduct(id, editedProduct).pipe(
      map(() => {
        this.isLoadingSubject.next(false)
      }), switchMap(() => {
        return this.getAllProducts();
      }),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  createProduct(newProduct: Product): Observable<Product> {
    this.isLoadingSubject.next(true);
    return this.productsHttpService.createProduct(newProduct).pipe(
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }


  deleteProductById(id: number): Observable<Product> {
    this.isLoadingSubject.next(true);
    return this.productsHttpService.deleteProduct(id).pipe(
      map(() => {
        this.isLoadingSubject.next(false)
      }), switchMap(() => {
        return this.getAllProducts();
      }),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  uploadProductImage(file: File): Observable<HttpEvent<Product>> {
    this.isLoadingSubject.next(true);

    return this.productsHttpService.uploadProductImage(file).pipe(
      map(filename => {
        this.isLoadingSubject.next(false);
        return filename;
      }),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  getProductById(id: number): Observable<Product> {
    this.isLoadingSubject.next(true);
    return this.productsHttpService.getProductById(id).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}