import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})

export class ConfirmationDialogComponent implements OnInit {

  @Input() title: string = 'Default Title';
  @Input() message: string = 'Are you sure?';
  @Input() btnOkText: string = 'OK';
  @Input() btnCancelText: string = 'Cancel';

  constructor(private activeModal: NgbActiveModal) {}

  ngOnInit() {}

  public decline() {
    this.activeModal.close(false); // User declined
  }

  public accept() {
    this.activeModal.close(true); // User accepted
  }

  public dismiss() {
    this.activeModal.dismiss('Dismissed by user'); // Optionally add a reason for dismissal
  }
}
