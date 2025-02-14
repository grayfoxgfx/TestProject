
import { HttpClient, HttpEvent, HttpEventType, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Product } from '../models/models';


let API_PRODUCTS_URL: string = environment.apiUrl + "/api/products/";
let API_IMAGES_URL: string = environment.apiUrl + "/images/";

@Injectable({
  providedIn: 'root'
})
export class ProductsHttpService {
  constructor(private _http: HttpClient) { }

  getAllProducts(): Observable<Product[]> {
    return this._http.get<Product[]>(API_PRODUCTS_URL)
      .pipe(
        tap(products =>
          products.forEach(product => {
            product.apiUrl = API_IMAGES_URL;
          })
        ));
  }

  getProductById(id: number): Observable<Product> {
    return this._http.get<Product>(API_PRODUCTS_URL + id);
  }

  createProduct(newProduct: Product): Observable<Product> {
    return this._http.post<Product>(API_PRODUCTS_URL, newProduct);
  }

  updateProduct(id: number, editedProduct: Product): Observable<Product> {
    return this._http.put<Product>(API_PRODUCTS_URL + id, editedProduct);
  }
  deleteProduct(id: number): Observable<Product> {
    return this._http.delete<Product>(API_PRODUCTS_URL + id);
  }

  uploadProductImage(file: File): Observable<HttpEvent<Product>> {
    if (!file)
      return EMPTY;
    const formData = new FormData();
    formData.append(file.name, file);

    const uploadReq = new HttpRequest('POST',
      API_PRODUCTS_URL + "image", formData, {
      reportProgress: true
    });

    return this._http.request<Product>(uploadReq);
  }
}
