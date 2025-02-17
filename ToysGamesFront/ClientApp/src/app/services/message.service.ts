import { ToastrService } from "ngx-toastr";
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class MessageService {

  constructor(private toastr: ToastrService) { }

  showSuccess(message: string, title: string) {
    this.toastr.success(message, title);
  }

  showError(message: string, title: string) {
    this.toastr.error(message, title);
  }

  showInfo(message: string, title: string) {
    this.toastr.info(message, title);
  }
  
  showWarning(message: string, title: string) {
    this.toastr.warning(message, title);
  }
}