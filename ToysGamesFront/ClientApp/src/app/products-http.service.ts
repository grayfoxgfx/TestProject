import { HttpClient, HttpEvent, HttpEventType, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from './models/models';
let API_USERS_URL: string = environment.apiUrl + "/api/products";

@Injectable({
  providedIn: 'root'
})
export class ProductsHttpService {
  constructor(private _http: HttpClient) { }

  getAllProducts(): Observable<Product[]> {    
    return this._http.get<Product[]>(API_USERS_URL);
  }

  getProductById(id: number): Observable<Product> {
    return this._http.get<Product>(API_USERS_URL + "/" + id);
  }

  createProduct(newProduct: Product): Observable<Product> {
    return this._http.post<Product>(API_USERS_URL, newProduct);
  }

  updateProduct(id: number, editedProduct: Product): Observable<Product> {
    return this._http.put<Product>(API_USERS_URL + "/" + id, editedProduct);
  }
  deleteProduct(id: number): Observable<Product> {
    return this._http.delete<Product>(API_USERS_URL + "/" + id);
  }

  uploadProductImage(file: File):Observable<HttpEvent<Product>> {
    if (!file)
      return;
    const formData = new FormData();
    formData.append(file.name, file);    
    
    const uploadReq = new HttpRequest('POST',
    API_USERS_URL + "/image", formData, {
      reportProgress: true      
    });

    return this._http.request<Product>(uploadReq);
  }
}
